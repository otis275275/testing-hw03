import os
import re
import sys
import base64
import argparse
from pathlib import Path
import markdown_it
from playwright.sync_api import sync_playwright

WORKSPACE_DIR = Path(r"d:\ALL_SOURCE_CODE\Learning\Testing\eshop-sut")
REPORT_DIR = WORKSPACE_DIR / "report"
DOCS_DIR = WORKSPACE_DIR / "docs"

def clean_math(text: str) -> str:
    # Handle display math $$...$$
    def replace_display_math(m):
        content = m.group(1).strip()
        content = re.sub(r'\\mathbf\{([^}]+)\}', r'<b>\1</b>', content)
        content = re.sub(r'\\text\{([^}]+)\}', r'\1', content)
        content = content.replace(r'\times', '×').replace(r'\ge', '≥').replace(r'\le', '≤')
        content = content.replace(r'\rightarrow', '→').replace(r'\dots', '…').replace(r'\sum', '∑')
        return f'<div class="math-block">{content}</div>'
    text = re.sub(r'\$\$(.+?)\$\$', replace_display_math, text, flags=re.DOTALL)

    # Handle inline math $...$
    def replace_inline_math(m):
        content = m.group(1).strip()
        content = re.sub(r'\\mathbf\{([^}]+)\}', r'<b>\1</b>', content)
        content = re.sub(r'\\text\{([^}]+)\}', r'\1', content)
        content = content.replace(r'\times', '×').replace(r'\ge', '≥').replace(r'\le', '≤')
        content = content.replace(r'\rightarrow', '→').replace(r'\dots', '…').replace(r'\sum', '∑')
        content = content.replace(r'\in', '∈')
        # Common subscripts/superscripts
        content = re.sub(r'min_(\d+)\^([+-])', r'<i>min</i><sub>\1</sub><sup>\2</sup>', content)
        content = re.sub(r'max_(\d+)\^([+-])', r'<i>max</i><sub>\1</sub><sup>\2</sup>', content)
        content = re.sub(r'min_(\d+)', r'<i>min</i><sub>\1</sub>', content)
        content = re.sub(r'max_(\d+)', r'<i>max</i><sub>\1</sub>', content)
        content = re.sub(r'Nom_(\d+)', r'<i>Nom</i><sub>\1</sub>', content)
        content = re.sub(r'LB_(\d+)', r'<i>LB</i><sub>\1</sub>', content)
        content = re.sub(r'UB_(\d+)', r'<i>UB</i><sub>\1</sub>', content)
        content = re.sub(r'x_(\d+)', r'<i>x</i><sub>\1</sub>', content)
        content = re.sub(r'\\epsilon_(\d+)', r'ε<sub>\1</sub>', content)
        content = content.replace(r'\epsilon', 'ε')
        return f'<span class="math-inline">{content}</span>'
    text = re.sub(r'\$([^\$\n]+?)\$', replace_inline_math, text)
    return text

def parse_alerts_and_blockquotes(md_text: str) -> str:
    lines = md_text.split('\n')
    new_lines = []
    i = 0
    alert_pattern = re.compile(r'^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](.*)$', re.IGNORECASE)
    
    while i < len(lines):
        line = lines[i]
        alert_match = alert_pattern.match(line)
        if alert_match:
            alert_type = alert_match.group(1).upper()
            title_extra = alert_match.group(2).strip()
            content_lines = []
            i += 1
            while i < len(lines) and (lines[i].startswith('>') or lines[i].strip() == ''):
                l = lines[i]
                if l.startswith('>'):
                    content_lines.append(l[1:].strip())
                else:
                    content_lines.append('')
                i += 1
            alert_content = '\n'.join(content_lines).strip()
            
            icon_map = {
                'NOTE': 'ℹ️',
                'TIP': '💡',
                'IMPORTANT': '📌',
                'WARNING': '⚠️',
                'CAUTION': '🛑'
            }
            icon = icon_map.get(alert_type, 'ℹ️')
            title = f"{icon} {alert_type}" + (f": {title_extra}" if title_extra else "")
            
            new_lines.append(f'<div class="alert alert-{alert_type.lower()}">')
            new_lines.append(f'  <div class="alert-title">{title}</div>')
            new_lines.append(f'  <div class="alert-content">{alert_content}</div>')
            new_lines.append('</div>\n')
        else:
            new_lines.append(line)
            i += 1
            
    return '\n'.join(new_lines)

def embed_images_as_base64(html_content: str, md_dir: Path) -> str:
    # Match <img ... src="..." ...>
    def replace_img(match):
        full_tag = match.group(0)
        src = match.group(1)
        if src.startswith('data:') or src.startswith('http://') or src.startswith('https://'):
            return full_tag
        
        # Local image file candidates
        candidates = [
            (md_dir / src).resolve(),
            (WORKSPACE_DIR / src).resolve(),
            (DOCS_DIR / "screenshots" / Path(src).name).resolve(),
            (md_dir / Path(src).name).resolve(),
        ]
        resolved_path = None
        for cand in candidates:
            if cand.exists() and cand.is_file():
                resolved_path = cand
                break
        
        if resolved_path:
            ext = resolved_path.suffix.lower().replace('.', '')
            mime = f"image/{ext}" if ext in ['png', 'jpeg', 'jpg', 'webp', 'gif'] else "image/png"
            with open(resolved_path, 'rb') as f:
                b64 = base64.b64encode(f.read()).decode('utf-8')
            return full_tag.replace(src, f"data:{mime};base64,{b64}")
        return full_tag

    return re.sub(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>', replace_img, html_content)

def enhance_badges_in_html(html_content: str) -> str:
    # PASS / FAIL / NOTE badges in table cells
    html_content = re.sub(r'<td>(\s*<strong>PASS<\/strong>\s*|\s*PASS\s*)<\/td>', 
                          r'<td><span class="badge badge-pass">PASS</span></td>', html_content)
    
    html_content = re.sub(r'<td>(\s*<strong>FAIL[^<]*<\/strong>|\s*FAIL[^<]*)<\/td>', 
                          lambda m: f'<td><span class="badge badge-fail">{m.group(1).replace("<strong>","").replace("</strong>","").strip()}</span></td>', 
                          html_content)
    
    html_content = re.sub(r'<td>(\s*<strong>NOTE[^<]*<\/strong>|\s*NOTE[^<]*)<\/td>', 
                          lambda m: f'<td><span class="badge badge-note">{m.group(1).replace("<strong>","").replace("</strong>","").strip()}</span></td>', 
                          html_content)
    
    html_content = re.sub(r'<td>(\s*<strong>Valid<\/strong>\s*|\s*Valid\s*)<\/td>', 
                          r'<td><span class="badge badge-valid">Valid</span></td>', html_content)
    
    html_content = re.sub(r'<td>(\s*<strong>Invalid[^<]*<\/strong>|\s*Invalid[^<]*)<\/td>', 
                          lambda m: f'<td><span class="badge badge-invalid">{m.group(1).replace("<strong>","").replace("</strong>","").strip()}</span></td>', 
                          html_content)

    return html_content

def build_full_html(body_html: str, title: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>{title}</title>
<style>
  @page {{
    size: A4;
    margin: 18mm 16mm 20mm 16mm;
  }}
  
  *, *::before, *::after {{
    box-sizing: border-box;
  }}
  
  body {{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    font-size: 11.5pt;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
  }}
  
  /* Headings */
  h1, h2, h3, h4, h5, h6 {{
    color: #0f172a;
    font-weight: 700;
    margin-top: 1.6em;
    margin-bottom: 0.6em;
    line-height: 1.3;
    page-break-after: avoid;
    break-after: avoid;
  }}
  
  h1 {{
    font-size: 20pt;
    border-bottom: 2.5px solid #2563eb;
    padding-bottom: 8px;
    margin-top: 0;
    color: #1e3a8a;
  }}
  
  h2 {{
    font-size: 14.5pt;
    border-bottom: 1.5px solid #e2e8f0;
    padding-bottom: 6px;
    color: #1e293b;
  }}
  
  h3 {{
    font-size: 12.5pt;
    color: #2563eb;
  }}
  
  h4 {{
    font-size: 11.5pt;
    color: #334155;
  }}
  
  p, ul, ol {{
    margin-top: 0;
    margin-bottom: 0.9em;
  }}
  
  ul, ol {{
    padding-left: 24px;
  }}
  
  li {{
    margin-bottom: 0.35em;
  }}
  
  a {{
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
  }}
  
  /* Tables */
  table {{
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 14px 0 20px 0;
    font-size: 9pt;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    overflow: hidden;
    page-break-inside: auto;
  }}
  
  tr {{
    page-break-inside: avoid;
    break-inside: avoid;
  }}
  
  th {{
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
    text-align: left;
    padding: 8px 10px;
    border-bottom: 2px solid #cbd5e1;
    border-right: 1px solid #e2e8f0;
    text-transform: uppercase;
    font-size: 8.5pt;
    letter-spacing: 0.02em;
  }}
  
  th:last-child {{
    border-right: none;
  }}
  
  td {{
    padding: 7px 10px;
    border-bottom: 1px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
    vertical-align: top;
    line-height: 1.45;
  }}
  
  td:last-child {{
    border-right: none;
  }}
  
  tr:nth-child(even) td {{
    background-color: #f8fafc;
  }}
  
  tr:last-child td {{
    border-bottom: none;
  }}
  
  /* Badges */
  .badge {{
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 8pt;
    text-align: center;
    white-space: nowrap;
  }}
  
  .badge-pass {{
    background-color: #dcfce7;
    color: #15803d;
    border: 1px solid #bbf7d0;
  }}
  
  .badge-fail {{
    background-color: #fee2e2;
    color: #b91c1c;
    border: 1px solid #fecaca;
  }}
  
  .badge-note {{
    background-color: #fef3c7;
    color: #b45309;
    border: 1px solid #fde68a;
  }}
  
  .badge-valid {{
    background-color: #ecfdf5;
    color: #047857;
    font-weight: 700;
  }}
  
  .badge-invalid {{
    background-color: #fff1f2;
    color: #be123c;
    font-weight: 700;
  }}
  
  /* Code & Syntax */
  code {{
    font-family: "Cascadia Code", Consolas, "Courier New", monospace;
    font-size: 8.5pt;
    background-color: #f1f5f9;
    color: #0f172a;
    padding: 2px 5px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }}
  
  pre {{
    background-color: #0f172a;
    color: #f8fafc;
    padding: 12px 14px;
    border-radius: 6px;
    font-family: "Cascadia Code", Consolas, "Courier New", monospace;
    font-size: 8.5pt;
    line-height: 1.5;
    overflow-x: auto;
    margin: 12px 0;
    page-break-inside: avoid;
    break-inside: avoid;
    border: 1px solid #1e293b;
  }}
  
  pre code {{
    background-color: transparent;
    color: inherit;
    padding: 0;
    border: none;
    font-size: inherit;
  }}
  
  /* Blockquotes & Alerts */
  blockquote {{
    border-left: 4px solid #3b82f6;
    background-color: #f8fafc;
    margin: 12px 0;
    padding: 10px 16px;
    border-radius: 0 6px 6px 0;
    color: #334155;
    page-break-inside: avoid;
  }}
  
  .alert {{
    margin: 14px 0;
    padding: 12px 16px;
    border-radius: 6px;
    border-left: 4px solid #3b82f6;
    background-color: #eff6ff;
    page-break-inside: avoid;
    break-inside: avoid;
  }}
  
  .alert-title {{
    font-weight: 700;
    font-size: 9.5pt;
    margin-bottom: 4px;
    color: #1e40af;
  }}
  
  .alert-content {{
    font-size: 9pt;
    color: #1e3a8a;
  }}
  
  .alert-important {{
    border-left-color: #8b5cf6;
    background-color: #f5f3ff;
  }}
  .alert-important .alert-title {{ color: #6d28d9; }}
  .alert-important .alert-content {{ color: #5b21b6; }}
  
  .alert-warning {{
    border-left-color: #f59e0b;
    background-color: #fffbeb;
  }}
  .alert-warning .alert-title {{ color: #b45309; }}
  .alert-warning .alert-content {{ color: #92400e; }}
  
  .alert-tip {{
    border-left-color: #10b981;
    background-color: #ecfdf5;
  }}
  .alert-tip .alert-title {{ color: #047857; }}
  .alert-tip .alert-content {{ color: #065f46; }}
  
  /* Horizontal rules */
  hr {{
    border: none;
    border-top: 1.5px solid #e2e8f0;
    margin: 22px 0;
  }}
  
  /* Images */
  img {{
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    margin: 10px 0;
    border: 1px solid #e2e8f0;
    page-break-inside: avoid;
  }}
  
  /* Math block */
  .math-block {{
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 14px;
    text-align: center;
    margin: 10px 0;
    font-family: "Cambria Math", "Times New Roman", serif;
    font-size: 11pt;
    color: #0f172a;
    page-break-inside: avoid;
  }}
  
  .math-inline {{
    font-family: "Cambria Math", "Times New Roman", serif;
    font-size: 10.5pt;
    color: #0f172a;
  }}
</style>
</head>
<body>
{body_html}
</body>
</html>"""

def get_target_pdf_path(input_md_file: Path, output_dest: Path = None, overwrite: bool = False) -> Path:
    if output_dest:
        if output_dest.is_dir() or str(output_dest).endswith(("\\", "/")):
            target_dir = output_dest
            target = target_dir / f"{input_md_file.stem}.pdf"
        else:
            target = output_dest
            target_dir = target.parent
    else:
        target_dir = input_md_file.parent
        target = target_dir / f"{input_md_file.stem}.pdf"

    target_dir.mkdir(parents=True, exist_ok=True)

    if overwrite or not target.exists():
        return target

    # Auto-number if target already exists and overwrite is False
    base_name = target.stem
    ext = target.suffix
    idx = 1
    new_target = target_dir / f"{base_name}({idx}){ext}"
    while new_target.exists():
        idx += 1
        new_target = target_dir / f"{base_name}({idx}){ext}"
    return new_target

def convert_md_to_pdf(input_md_file: Path, browser, output_dest: Path = None, overwrite: bool = False, footer_text: str = None) -> Path:
    print(f"Reading: {input_md_file}...")
    with open(input_md_file, "r", encoding="utf-8") as f:
        md_text = f.read()

    # Preprocessing
    md_text = clean_math(md_text)
    md_text = parse_alerts_and_blockquotes(md_text)

    # Markdown to HTML
    md = markdown_it.MarkdownIt("commonmark", {"html": True, "linkify": False}).enable("table").enable("strikethrough")
    body_html = md.render(md_text)

    # Postprocessing
    body_html = enhance_badges_in_html(body_html)
    body_html = embed_images_as_base64(body_html, input_md_file.parent)

    title = input_md_file.stem.replace('_', ' ').title()
    full_html = build_full_html(body_html, title)

    target_pdf = get_target_pdf_path(input_md_file, output_dest, overwrite)
    print(f"Rendering PDF -> {target_pdf}...")

    page = browser.new_page()
    page.set_content(full_html, wait_until="networkidle")

    display_footer = footer_text or "FIT - HCMUS | Software Testing HW02"
    footer_template = f'''
    <div style="font-size: 8pt; font-family: -apple-system, sans-serif; color: #64748b; width: 100%; display: flex; justify-content: space-between; padding: 0 16mm;">
      <span>{display_footer}</span>
      <span>Trang <span class="pageNumber"></span> / <span class="totalPages"></span></span>
    </div>
    '''

    page.pdf(
        path=str(target_pdf),
        format="A4",
        print_background=True,
        display_header_footer=True,
        header_template='<div></div>',
        footer_template=footer_template,
        margin={
            "top": "16mm",
            "bottom": "18mm",
            "left": "15mm",
            "right": "15mm"
        }
    )
    page.close()
    size_kb = os.path.getsize(target_pdf) / 1024
    print(f"SUCCESS: {target_pdf.name} ({size_kb:.1f} KB)\n")
    return target_pdf

def main():
    parser = argparse.ArgumentParser(
        description="Tool chuyển đổi tệp Markdown (.md) sang PDF chuẩn in ấn chất lượng cao với Microsoft Edge & Playwright."
    )
    parser.add_argument(
        "inputs", 
        nargs="*", 
        help="Đường dẫn đến một hoặc nhiều tệp .md cần chuyển đổi (VD: report/main_report.md). Nếu để trống, mặc định chuyển đổi 5 báo cáo trong report/."
    )
    parser.add_argument(
        "-o", "--output", 
        help="Đường dẫn tệp PDF đầu ra hoặc thư mục đích (VD: -o output.pdf hoặc -o report/)."
    )
    parser.add_argument(
        "--overwrite", 
        action="store_true", 
        help="Ghi đè lên tệp PDF nếu đã tồn tại thay vì tự động đánh số (1), (2)..."
    )
    parser.add_argument(
        "--footer", 
        help="Văn bản chân trang tùy chỉnh."
    )

    args = parser.parse_args()

    # Determine files to process
    if args.inputs:
        target_files = [Path(p).resolve() for p in args.inputs]
    else:
        # Default report files
        target_files = [
            REPORT_DIR / "AI_analys.md",
            REPORT_DIR / "AI_audit.md",
            REPORT_DIR / "AI_critique.md",
            REPORT_DIR / "main_report.md",
            REPORT_DIR / "bug_report.md"
        ]

    output_dest = Path(args.output).resolve() if args.output else None

    with sync_playwright() as p:
        print("Launching Edge browser...")
        browser = p.chromium.launch(channel="msedge", headless=True)
        for f in target_files:
            if f.exists() and f.is_file():
                convert_md_to_pdf(
                    input_md_file=f,
                    browser=browser,
                    output_dest=output_dest,
                    overwrite=args.overwrite,
                    footer_text=args.footer
                )
            else:
                print(f"ERROR: File not found: {f}")
        browser.close()

if __name__ == "__main__":
    main()
