/**
 * Generate clean A4 PDF reports from Markdown files using Playwright (Microsoft Edge).
 * Zero external dependencies beyond `playwright`.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function cleanMath(text) {
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, inner) => {
    const c = inner
      .trim()
      .replace(/\\mathbf\{([^}]+)\}/g, '<b>$1</b>')
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/\\times/g, '×')
      .replace(/\\ge/g, '≥')
      .replace(/\\le/g, '≤')
      .replace(/\\rightarrow/g, '→')
      .replace(/\\sum/g, '∑');
    return `<div class="math-block">${c}</div>`;
  });
  text = text.replace(/\$([^\$\n]+?)\$/g, (_, inner) => {
    const c = inner
      .trim()
      .replace(/\\mathbf\{([^}]+)\}/g, '<b>$1</b>')
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/\\times/g, '×')
      .replace(/\\ge/g, '≥')
      .replace(/\\le/g, '≤')
      .replace(/\\rightarrow/g, '→')
      .replace(/\\sum/g, '∑');
    return `<span class="math-inline">${c}</span>`;
  });
  return text;
}

function resolveImgDataUri(src, mdDir) {
  if (!src || src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  const cleanSrc = decodeURIComponent(src.split('#')[0].replace(/^file:\/\/\//i, ''));
  const candidates = [
    path.resolve(mdDir, cleanSrc),
    path.resolve(ROOT, cleanSrc),
    path.resolve(ROOT, 'report', 'screenshots', path.basename(cleanSrc)),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      const ext = path.extname(p).toLowerCase().slice(1);
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext || 'png'}`;
      const b64 = fs.readFileSync(p).toString('base64');
      return `data:${mime};base64,${b64}`;
    }
  }
  return src;
}

function renderInline(text, mdDir) {
  const codeSpans = [];
  text = text.replace(/`([^`]+)`/g, (_, code) => {
    const idx = codeSpans.length;
    codeSpans.push(`<code>${escapeHtml(code)}</code>`);
    return `\u0000CODE${idx}\u0000`;
  });

  // Images ![alt](src)
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
    const dataUri = resolveImgDataUri(src.trim(), mdDir);
    return `<img src="${dataUri}" alt="${escapeHtml(alt)}" />`;
  });

  // Links [label](href)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    return `<a href="${escapeHtml(href.trim())}">${label}</a>`;
  });

  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
  text = text.replace(/<br\s*\/?>/gi, '<br/>');

  text = text.replace(/\u0000CODE(\d+)\u0000/g, (_, idx) => codeSpans[Number(idx)]);
  return text;
}

function splitTableRow(line) {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  const cells = [];
  let cur = '';
  let inCode = false;
  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (ch === '`') inCode = !inCode;
    if (ch === '|' && !inCode) {
      cells.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  cells.push(cur.trim());
  return cells;
}

function isTableSeparator(line) {
  return /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?$/.test(line.trim());
}

function mdToHtml(mdText, mdDir) {
  mdText = cleanMath(mdText);
  const lines = mdText.split(/\r?\n/);
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code blocks
    const fence = /^```(.*)$/.exec(line.trim());
    if (fence) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      out.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      continue;
    }

    // Blank line
    if (!line.trim()) {
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      out.push('<hr/>');
      i++;
      continue;
    }

    // Headings
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      const lvl = h[1].length;
      out.push(`<h${lvl}>${renderInline(h[2].trim(), mdDir)}</h${lvl}>`);
      i++;
      continue;
    }

    // Alerts & Blockquotes
    if (line.trim().startsWith('>')) {
      const alertMatch = /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](.*)$/i.exec(line.trim());
      const qLines = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        qLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      if (alertMatch) {
        const type = alertMatch[1].toLowerCase();
        const titleExtra = alertMatch[2].trim();
        const body = qLines.slice(1).map((l) => renderInline(l, mdDir)).join('<br/>');
        out.push(
          `<div class="alert alert-${type}"><div class="alert-title">${alertMatch[1].toUpperCase()}${
            titleExtra ? ': ' + escapeHtml(titleExtra) : ''
          }</div><div class="alert-content">${body}</div></div>`
        );
      } else {
        const body = qLines.map((l) => renderInline(l, mdDir)).join('<br/>');
        out.push(`<blockquote>${body}</blockquote>`);
      }
      continue;
    }

    // Tables
    if (line.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const headers = splitTableRow(line);
      const sep = splitTableRow(lines[i + 1]);
      const aligns = sep.map((s) => {
        if (s.startsWith(':') && s.endsWith(':')) return 'center';
        if (s.endsWith(':')) return 'right';
        return 'left';
      });
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }
      let tbl = '<table><thead><tr>';
      headers.forEach((hText, idx) => {
        tbl += `<th style="text-align:${aligns[idx] || 'left'}">${renderInline(hText, mdDir)}</th>`;
      });
      tbl += '</tr></thead><tbody>';
      rows.forEach((r) => {
        tbl += '<tr>';
        headers.forEach((_, idx) => {
          const rawCell = r[idx] || '';
          let cellHtml = renderInline(rawCell, mdDir);
          if (/^\*\*PASS\*\*$/i.test(rawCell.trim()) || /^PASS$/i.test(rawCell.trim())) {
            cellHtml = '<span class="badge badge-pass">PASS</span>';
          } else if (/^\*\*FAIL\*\*$/i.test(rawCell.trim()) || /^FAIL$/i.test(rawCell.trim())) {
            cellHtml = '<span class="badge badge-fail">FAIL</span>';
          }
          tbl += `<td style="text-align:${aligns[idx] || 'left'}">${cellHtml}</td>`;
        });
        tbl += '</tr>';
      });
      tbl += '</tbody></table>';
      out.push(tbl);
      continue;
    }

    // Unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        const itemLines = [lines[i].replace(/^\s*[-*]\s+/, '')];
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*[-*]\s+/.test(lines[i]) && !/^\s*\d+\.\s+/.test(lines[i])) {
          itemLines.push(lines[i].trim());
          i++;
        }
        items.push(`<li>${renderInline(itemLines.join(' '), mdDir)}</li>`);
      }
      out.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        const itemLines = [lines[i].replace(/^\s*\d+\.\s+/, '')];
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*\d+\.\s+/.test(lines[i]) && !/^\s*[-*]\s+/.test(lines[i])) {
          itemLines.push(lines[i].trim());
          i++;
        }
        items.push(`<li>${renderInline(itemLines.join(' '), mdDir)}</li>`);
      }
      out.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    // Standalone image line
    if (/^!\[[^\]]*\]\([^)]+\)\s*$/.test(line.trim())) {
      out.push(`<p class="img-wrap">${renderInline(line.trim(), mdDir)}</p>`);
      i++;
      continue;
    }

    // Paragraph
    const pLines = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('>') &&
      !/^(-{3,}|\*{3,})$/.test(lines[i].trim()) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !(lines[i].includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1]))
    ) {
      pLines.push(lines[i].trim());
      i++;
    }
    out.push(`<p>${renderInline(pLines.join(' '), mdDir)}</p>`);
  }

  return out.join('\n');
}

function buildHtmlDocument(bodyHtml, title) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
  @page { size: A4; margin: 16mm 15mm 18mm 15mm; }
  *, *::before, *::after { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    color: #1e293b;
    font-size: 10.5pt;
    line-height: 1.55;
    margin: 0;
    padding: 0;
  }
  h1, h2, h3, h4 {
    color: #0f172a;
    font-weight: 700;
    margin-top: 1.3em;
    margin-bottom: 0.5em;
    page-break-after: avoid;
    break-after: avoid;
  }
  h1 { font-size: 18pt; border-bottom: 2.5px solid #2563eb; padding-bottom: 6px; margin-top: 0; color: #1e3a8a; }
  h2 { font-size: 13.5pt; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px; }
  h3 { font-size: 11.5pt; color: #2563eb; }
  p, ul, ol { margin-top: 0; margin-bottom: 0.75em; }
  ul, ol { padding-left: 22px; }
  li { margin-bottom: 0.3em; }
  a { color: #2563eb; text-decoration: none; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0 16px 0;
    font-size: 8.8pt;
    page-break-inside: auto;
  }
  tr { page-break-inside: avoid; break-inside: avoid; }
  th {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
    padding: 6px 8px;
    border: 1px solid #cbd5e1;
    font-size: 8.2pt;
  }
  td {
    padding: 6px 8px;
    border: 1px solid #cbd5e1;
    vertical-align: top;
    word-break: break-word;
  }
  tr:nth-child(even) td { background: #f8fafc; }
  .badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 7.8pt;
    white-space: nowrap;
  }
  .badge-pass { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
  .badge-fail { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
  code {
    font-family: Consolas, "Courier New", monospace;
    font-size: 8.5pt;
    background: #f1f5f9;
    padding: 1px 4px;
    border-radius: 3px;
    border: 1px solid #e2e8f0;
  }
  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 10px 12px;
    border-radius: 6px;
    font-family: Consolas, "Courier New", monospace;
    font-size: 8pt;
    line-height: 1.45;
    white-space: pre-wrap;
    word-break: break-word;
    page-break-inside: avoid;
  }
  pre code { background: transparent; border: none; color: inherit; padding: 0; }
  blockquote {
    border-left: 4px solid #3b82f6;
    background: #f8fafc;
    margin: 10px 0;
    padding: 8px 12px;
    color: #334155;
    page-break-inside: avoid;
  }
  .alert {
    margin: 10px 0;
    padding: 10px 14px;
    border-radius: 6px;
    border-left: 4px solid #3b82f6;
    background: #eff6ff;
    page-break-inside: avoid;
  }
  .alert-title { font-weight: 700; font-size: 9pt; margin-bottom: 3px; color: #1e40af; }
  .alert-content { font-size: 9pt; color: #1e3a8a; }
  .alert-important { border-left-color: #8b5cf6; background: #f5f3ff; }
  .alert-important .alert-title { color: #6d28d9; }
  .alert-caution, .alert-warning { border-left-color: #f59e0b; background: #fffbeb; }
  .alert-caution .alert-title, .alert-warning .alert-title { color: #b45309; }
  hr { border: none; border-top: 1px solid #e2e8f0; margin: 16px 0; }
  img {
    max-width: 100%;
    max-height: 460px;
    width: auto;
    height: auto;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    margin: 8px 0;
    page-break-inside: avoid;
    display: block;
  }
  .math-block { background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 10px; text-align: center; margin: 8px 0; }
  .math-inline { font-family: "Cambria Math", Georgia, serif; }
</style>
</head>
<body>${bodyHtml}</body>
</html>`;
}

async function main() {
  const targets = [
    'report/main_report.md',
    'report/bug_report.md',
    'report/task3_cross_browser.md',
    'report/task2_phase1_plan_and_instruments.md',
    'report/AI_critique.md',
    'testcase/gui_checklist_m2.md',
    'AI.log.md',
  ];

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const rel of targets) {
      const mdPath = path.join(ROOT, rel);
      if (!fs.existsSync(mdPath)) {
        console.warn(`[SKIP] Missing ${rel}`);
        continue;
      }
      const pdfPath = mdPath.replace(/\.md$/i, '.pdf');
      const mdText = fs.readFileSync(mdPath, 'utf8');
      const bodyHtml = mdToHtml(mdText, path.dirname(mdPath));
      const fullHtml = buildHtmlDocument(bodyHtml, path.basename(rel, '.md'));

      const page = await browser.newPage();
      await page.setContent(fullHtml, { waitUntil: 'load' });
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: `<div style="font-size:8pt;font-family:-apple-system,sans-serif;color:#64748b;width:100%;display:flex;justify-content:space-between;padding:0 15mm;">
          <span>FIT - HCMUS | Software Testing HW03 — MSSV: 23120228 (M2)</span>
          <span>Trang <span class="pageNumber"></span> / <span class="totalPages"></span></span>
        </div>`,
        margin: { top: '16mm', bottom: '18mm', left: '15mm', right: '15mm' },
      });
      await page.close();
      const kb = (fs.statSync(pdfPath).size / 1024).toFixed(1);
      console.log(`[PDF] ${path.relative(ROOT, pdfPath)} (${kb} KB)`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

