/**
 * Generate testcase/gui_checklist_m2.xlsx from testcase/gui_checklist_m2.md
 * and report/screenshots/task3/task3_run_summary.json (zero external dependencies).
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..');
const MD_PATH = path.join(ROOT, 'testcase', 'gui_checklist_m2.md');
const TASK3_JSON_PATH = path.join(ROOT, 'report', 'screenshots', 'task3', 'task3_run_summary.json');
const OUT_XLSX = path.join(ROOT, 'testcase', 'gui_checklist_m2.xlsx');

const ISSUE_MAP = {
  'CHK-01': 'https://github.com/otis275275/testing-hw03/issues/1',
  'CHK-03': 'https://github.com/otis275275/testing-hw03/issues/2',
  'CHK-07': 'https://github.com/otis275275/testing-hw03/issues/3',
  'CHK-13': 'https://github.com/otis275275/testing-hw03/issues/4',
  'CHK-14': 'https://github.com/otis275275/testing-hw03/issues/5',
  'CHK-20': 'https://github.com/otis275275/testing-hw03/issues/6',
  'CHK-21': 'https://github.com/otis275275/testing-hw03/issues/7',
  'CHK-22': 'https://github.com/otis275275/testing-hw03/issues/8',
  'CHK-27': 'https://github.com/otis275275/testing-hw03/issues/9',
  'CHK-29': 'https://github.com/otis275275/testing-hw03/issues/10',
  'CHK-30': 'https://github.com/otis275275/testing-hw03/issues/11',
  'CHK-31': 'https://github.com/otis275275/testing-hw03/issues/12',
  'CHK-32': 'https://github.com/otis275275/testing-hw03/issues/13',
  'CHK-34': 'https://github.com/otis275275/testing-hw03/issues/14',
  'CHK-39': 'https://github.com/otis275275/testing-hw03/issues/15',
  'CHK-40': 'https://github.com/otis275275/testing-hw03/issues/16',
  'CHK-41': 'https://github.com/otis275275/testing-hw03/issues/17',
  'CHK-42': 'https://github.com/otis275275/testing-hw03/issues/18',
  'CHK-43': 'https://github.com/otis275275/testing-hw03/issues/19',
  'CHK-44': 'https://github.com/otis275275/testing-hw03/issues/20',
  'CHK-46': 'https://github.com/otis275275/testing-hw03/issues/21',
  'CHK-47': 'https://github.com/otis275275/testing-hw03/issues/22',
};

function stripMd(s) {
  return String(s || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/👉\s*\[([^\]]+)\]\(([^)]+)\)/g, 'Ảnh: $1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\\([\\*_])/g, '$1')
    .trim();
}

function parseChecklistMd() {
  const md = fs.readFileSync(MD_PATH, 'utf8');
  const lines = md.split(/\r?\n/);
  const items = [];
  const critiques = [];
  let inCritique = false;

  for (const line of lines) {
    if (line.startsWith('## 3. Phần Bổ sung')) {
      inCritique = true;
      continue;
    }
    if (!inCritique) {
      const m = /^\|\s*(\d+)\s*\|\s*`(CHK-\d+)`\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|/.exec(line);
      if (m) {
        items.push({
          no: Number(m[1]),
          id: m[2],
          aspect: stripMd(m[3]),
          component: stripMd(m[4]),
          criteria: stripMd(m[5]),
          origin: stripMd(m[6]),
          result: stripMd(m[7]),
          notes: stripMd(m[8]),
        });
      }
    } else {
      const c = /^\|\s*\*\*([^*]+)\*\*\s*\|\s*([^|]+)\|\s*([^|]+)\|/.exec(line);
      if (c && !c[1].includes('Mã mục')) {
        critiques.push({
          ids: stripMd(c[1]),
          title: stripMd(c[2]),
          rationale: stripMd(c[3]),
        });
      }
    }
  }
  return { items, critiques };
}

function xmlEsc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function colName(idx0) {
  let n = idx0 + 1;
  let name = '';
  while (n > 0) {
    const r = (n - 1) % 26;
    name = String.fromCharCode(65 + r) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
}

function createWorkbookXml(sheets) {
  const sharedStrings = [];
  const ssMap = new Map();
  function intern(val) {
    const s = String(val ?? '');
    if (ssMap.has(s)) return ssMap.get(s);
    const idx = sharedStrings.length;
    sharedStrings.push(s);
    ssMap.set(s, idx);
    return idx;
  }

  // Style indices:
  // 0: default (wrap)
  // 1: title (bold 14pt dark blue)
  // 2: header (bold white on #1E3A8A, centered, border)
  // 3: cell normal (wrap, border)
  // 4: cell center (wrap, border, center)
  // 5: PASS (bold green #15803D on #DCFCE7, center, border)
  // 6: FAIL (bold red #B91C1C on #FEE2E2, center, border)
  // 7: section subheader (bold on #E2E8F0, border)
  const sheetXmls = sheets.map((sheet) => {
    const colsXml = (sheet.widths || [])
      .map((w, idx) => `<col min="${idx + 1}" max="${idx + 1}" width="${w}" customWidth="1"/>`)
      .join('');

    const rowsXml = sheet.rows
      .map((row, rIdx) => {
        const rowNum = rIdx + 1;
        const cellsXml = row.cells
          .map((cell, cIdx) => {
            const ref = `${colName(cIdx)}${rowNum}`;
            const style = cell.style ?? 3;
            if (typeof cell.value === 'number' && !Number.isNaN(cell.value)) {
              return `<c r="${ref}" s="${style}"><v>${cell.value}</v></c>`;
            }
            const sIdx = intern(cell.value ?? '');
            return `<c r="${ref}" t="s" s="${style}"><v>${sIdx}</v></c>`;
          })
          .join('');
        const ht = row.height ? ` ht="${row.height}" customHeight="1"` : '';
        return `<row r="${rowNum}"${ht}>${cellsXml}</row>`;
      })
      .join('');

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews><sheetView workbookViewId="0"/></sheetViews>
  <sheetFormatPr defaultRowHeight="20"/>
  ${colsXml ? `<cols>${colsXml}</cols>` : ''}
  <sheetData>${rowsXml}</sheetData>
</worksheet>`;
  });

  const ssXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${sharedStrings.length}" uniqueCount="${sharedStrings.length}">
${sharedStrings.map((s) => `<si><t xml:space="preserve">${xmlEsc(s)}</t></si>`).join('')}
</sst>`;

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="5">
    <font><sz val="11"/><name val="Segoe UI"/></font>
    <font><b/><sz val="14"/><color rgb="FF1E3A8A"/><name val="Segoe UI"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Segoe UI"/></font>
    <font><b/><sz val="11"/><color rgb="FF15803D"/><name val="Segoe UI"/></font>
    <font><b/><sz val="11"/><color rgb="FFB91C1C"/><name val="Segoe UI"/></font>
  </fonts>
  <fills count="6">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF1E3A8A"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFDCFCE7"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFEE2E2"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFE2E8F0"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFCBD5E1"/></left>
      <right style="thin"><color rgb="FFCBD5E1"/></right>
      <top style="thin"><color rgb="FFCBD5E1"/></top>
      <bottom style="thin"><color rgb="FFCBD5E1"/></bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="8">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
    <xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="3" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="4" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="5" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
  </cellXfs>
</styleSheet>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  ${sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('\n  ')}
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    ${sheets.map((s, i) => `<sheet name="${xmlEsc(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('\n    ')}
  </sheets>
</workbook>`;

  const wbRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('\n  ')}
  <Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId${sheets.length + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>`;

  const files = [
    { name: '[Content_Types].xml', data: Buffer.from(contentTypesXml, 'utf8') },
    { name: '_rels/.rels', data: Buffer.from(rootRelsXml, 'utf8') },
    { name: 'xl/workbook.xml', data: Buffer.from(workbookXml, 'utf8') },
    { name: 'xl/_rels/workbook.xml.rels', data: Buffer.from(wbRelsXml, 'utf8') },
    { name: 'xl/styles.xml', data: Buffer.from(stylesXml, 'utf8') },
    { name: 'xl/sharedStrings.xml', data: Buffer.from(ssXml, 'utf8') },
  ];
  sheetXmls.forEach((xml, i) => {
    files.push({ name: `xl/worksheets/sheet${i + 1}.xml`, data: Buffer.from(xml, 'utf8') });
  });
  return files;
}

// CRC32 + ZIP writer (store/deflate)
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function buildZip(entries) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, 'utf8');
    const raw = entry.data;
    const comp = zlib.deflateRawSync(raw);
    const crc = crc32(raw);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // UTF-8
    local.writeUInt16LE(8, 8); // deflate
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(0, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(comp.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);

    localParts.push(local, nameBuf, comp);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(0, 12);
    central.writeUInt16LE(0, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(comp.length, 20);
    central.writeUInt32LE(raw.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);

    centralParts.push(central, nameBuf);
    offset += local.length + nameBuf.length + comp.length;
  }

  const centralBuf = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralBuf, eocd]);
}

function main() {
  const { items, critiques } = parseChecklistMd();
  const task3 = JSON.parse(fs.readFileSync(TASK3_JSON_PATH, 'utf8'));

  const browserMap = {};
  for (const b of ['chrome', 'firefox', 'safari']) {
    browserMap[b] = {};
    for (const row of task3.browsers[b].checklistAudit) {
      browserMap[b][row.id] = row;
    }
  }

  const aiCount = items.filter((i) => i.origin.includes('AI')).length;
  const humanCount = items.length - aiCount;
  const passCount = items.filter((i) => i.result === 'PASS').length;
  const failCount = items.filter((i) => i.result === 'FAIL').length;

  const aspects = ['IA-01', 'IA-02', 'IA-03', 'IA-04'];
  const aspectNames = {
    'IA-01': 'IA-01: General UI Standards',
    'IA-02': 'IA-02: Forms & Controls',
    'IA-03': 'IA-03: Navigation',
    'IA-04': 'IA-04: Feedback & State',
  };

  // Sheet 1: Test Summary
  const summaryRows = [
    { height: 28, cells: [{ value: 'EShop SUT (HW03) — BÁO CÁO TỔNG HỢP GUI CHECKLIST (M2)', style: 1 }] },
    { cells: [{ value: 'Sinh viên thực hiện:', style: 7 }, { value: 'Lê Trung Thành Đạt — MSSV: 23120228 (M2)', style: 3 }] },
    { cells: [{ value: 'Phạm vi màn hình:', style: 7 }, { value: 'Home (Danh sách + Tìm kiếm), Product Detail, Header & Footer toàn cục (Web)', style: 3 }] },
    { cells: [{ value: 'Tổng số mục thiết kế:', style: 7 }, { value: items.length, style: 4 }, { value: `AI-Generated: ${aiCount} (${((aiCount / items.length) * 100).toFixed(1)}%) | Human Added: ${humanCount} (${((humanCount / items.length) * 100).toFixed(1)}%)`, style: 3 }] },
    { cells: [{ value: 'Tổng kết quả (Task 1 - Chrome):', style: 7 }, { value: `${passCount} PASS / ${failCount} FAIL`, style: 4 }, { value: `Tỷ lệ PASS: ${((passCount / items.length) * 100).toFixed(1)}%`, style: 3 }] },
    { cells: [{ value: 'GitHub Issues đã log:', style: 7 }, { value: Object.keys(ISSUE_MAP).length, style: 4 }, { value: 'https://github.com/otis275275/testing-hw03/issues', style: 3 }] },
    { cells: [] },
    {
      height: 26,
      cells: [
        { value: 'Khía cạnh giao diện', style: 2 },
        { value: 'Tổng số mục', style: 2 },
        { value: 'AI-Generated', style: 2 },
        { value: 'Human Added', style: 2 },
        { value: 'PASS', style: 2 },
        { value: 'FAIL', style: 2 },
        { value: 'Tỷ lệ PASS', style: 2 },
      ],
    },
    ...aspects.map((a) => {
      const sub = items.filter((i) => i.aspect === a);
      const ai = sub.filter((i) => i.origin.includes('AI')).length;
      const hu = sub.length - ai;
      const p = sub.filter((i) => i.result === 'PASS').length;
      const f = sub.length - p;
      return {
        cells: [
          { value: aspectNames[a], style: 3 },
          { value: sub.length, style: 4 },
          { value: ai, style: 4 },
          { value: hu, style: 4 },
          { value: p, style: 5 },
          { value: f, style: 6 },
          { value: `${((p / sub.length) * 100).toFixed(1)}%`, style: 4 },
        ],
      };
    }),
    {
      cells: [
        { value: 'TỔNG CỘNG', style: 7 },
        { value: items.length, style: 7 },
        { value: aiCount, style: 7 },
        { value: humanCount, style: 7 },
        { value: passCount, style: 5 },
        { value: failCount, style: 6 },
        { value: `${((passCount / items.length) * 100).toFixed(1)}%`, style: 7 },
      ],
    },
    { cells: [] },
    {
      height: 26,
      cells: [
        { value: 'Nền tảng Cross-Browser (Task 3)', style: 2 },
        { value: 'Tổng mục', style: 2 },
        { value: 'PASS', style: 2 },
        { value: 'FAIL', style: 2 },
        { value: 'Tỷ lệ PASS', style: 2 },
        { value: 'Khác biệt ghi nhận', style: 2 },
      ],
    },
    {
      cells: [
        { value: 'Google Chrome (Windows 11)', style: 3 },
        { value: 49, style: 4 },
        { value: 27, style: 5 },
        { value: 22, style: 6 },
        { value: '55.1%', style: 4 },
        { value: 'Không có lỗi riêng (22 lỗi chung toàn hệ thống)', style: 3 },
      ],
    },
    {
      cells: [
        { value: 'Mozilla Firefox (Windows 11)', style: 3 },
        { value: 49, style: 4 },
        { value: 26, style: 5 },
        { value: 23, style: 6 },
        { value: '53.1%', style: 4 },
        { value: '+1 lỗi riêng CHK-23: cho phép gõ chữ "abc" vào ô số lượng', style: 3 },
      ],
    },
    {
      cells: [
        { value: 'Safari / WebKit Engine', style: 3 },
        { value: 49, style: 4 },
        { value: 27, style: 5 },
        { value: 22, style: 6 },
        { value: '55.1%', style: 4 },
        { value: 'Hành vi đồng nhất Chrome ở toàn bộ 49 mục', style: 3 },
      ],
    },
  ];

  // Sheet 2: Checklist 49 items
  const checklistRows = [
    {
      height: 28,
      cells: [
        { value: '#', style: 2 },
        { value: 'Mã mục', style: 2 },
        { value: 'Khía cạnh', style: 2 },
        { value: 'Thành phần kiểm tra', style: 2 },
        { value: 'Tiêu chí kiểm chứng chi tiết', style: 2 },
        { value: 'Nguồn đề xuất', style: 2 },
        { value: 'Task 1 (Chrome)', style: 2 },
        { value: 'Task 3 Firefox', style: 2 },
        { value: 'Task 3 Safari/WebKit', style: 2 },
        { value: 'Ghi chú Thực thi & Ảnh Bằng chứng', style: 2 },
        { value: 'GitHub Issue', style: 2 },
      ],
    },
    ...items.map((it) => {
      const ff = browserMap.firefox[it.id]?.status || it.result;
      const sf = browserMap.safari[it.id]?.status || it.result;
      return {
        height: 44,
        cells: [
          { value: it.no, style: 4 },
          { value: it.id, style: 4 },
          { value: it.aspect, style: 4 },
          { value: it.component, style: 3 },
          { value: it.criteria, style: 3 },
          { value: it.origin, style: 4 },
          { value: it.result, style: it.result === 'PASS' ? 5 : 6 },
          { value: ff, style: ff === 'PASS' ? 5 : 6 },
          { value: sf, style: sf === 'PASS' ? 5 : 6 },
          { value: it.notes, style: 3 },
          { value: ISSUE_MAP[it.id] || (ff === 'FAIL' ? 'Task 3 Cross-Browser Defect (Firefox)' : '—'), style: 3 },
        ],
      };
    }),
  ];

  // Sheet 3: Human Critiques
  const critiqueRows = [
    {
      height: 26,
      cells: [
        { value: 'Mã mục bổ sung', style: 2 },
        { value: 'Thành phần bổ sung', style: 2 },
        { value: 'Lý do AI bỏ sót (Human Critique)', style: 2 },
      ],
    },
    ...critiques.map((c) => ({
      height: 56,
      cells: [
        { value: c.ids, style: 4 },
        { value: c.title, style: 3 },
        { value: c.rationale, style: 3 },
      ],
    })),
  ];

  const files = createWorkbookXml([
    { name: 'Test Summary', widths: [34, 16, 16, 16, 14, 42, 16], rows: summaryRows },
    { name: 'GUI Checklist (49 Items)', widths: [6, 11, 10, 32, 48, 16, 15, 15, 18, 52, 44], rows: checklistRows },
    { name: 'Human Critiques', widths: [20, 40, 82], rows: critiqueRows },
  ]);

  fs.writeFileSync(OUT_XLSX, buildZip(files));
  console.log(`Generated ${OUT_XLSX} (${items.length} items, ${critiques.length} critique groups)`);
}

main();
