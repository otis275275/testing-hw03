const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.resolve(__dirname, '../docs/screenshots');

async function run() {
  console.log('Launching browser to capture specific Cart UI bugs...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 850 });

  // Function to setup cart with duplicate item via client-side routing
  async function setupCartWithItems() {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    
    // Wait for product cards
    await page.waitForFunction(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.innerText.includes('Thêm vào giỏ'));
    }, { timeout: 5000 });

    // Click Add to Cart twice with delay
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Thêm vào giỏ'));
      btns[0].click();
    });
    await new Promise(r => setTimeout(r, 600));

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('Thêm vào giỏ'));
      btns[0].click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Client-side navigate to Cart
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a')).filter(a => a.innerText.includes('Giỏ hàng'));
      links[0].click();
    });
    await new Promise(r => setTimeout(r, 600));
  }

  // -------------------------------------------------------------
  // BUG 05: Duplicate item creates new row
  // -------------------------------------------------------------
  console.log('Capturing Bug 05 (Duplicate item creates new row)...');
  await setupCartWithItems();
  // Highlight the 2 duplicate rows
  await page.evaluate(() => {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(r => {
      r.style.outline = '3px solid #ef4444';
      r.style.backgroundColor = '#fee2e2';
    });
    const header = document.querySelector('h2');
    const badge = document.createElement('div');
    badge.id = 'bug-badge';
    badge.style = 'background: #dc2626; color: white; padding: 8px 14px; border-radius: 6px; font-weight: bold; margin-bottom: 16px; font-size: 14px; display: inline-block;';
    badge.innerText = '⚠️ LỖI: Thêm cùng sản phẩm iPhone 15 Pro Max tạo 2 dòng riêng biệt thay vì tăng số lượng lên 2';
    header.parentNode.insertBefore(badge, header.nextSibling);
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'bug-05-cart-duplicate-product-new-row.png') });

  // -------------------------------------------------------------
  // BUG 06: Missing +/- buttons in Quantity column
  // -------------------------------------------------------------
  console.log('Capturing Bug 06 (Missing +/- buttons in Quantity column)...');
  await setupCartWithItems();
  await page.evaluate(() => {
    const qtyCells = document.querySelectorAll('tbody tr td:nth-child(3)');
    qtyCells.forEach(cell => {
      cell.style.outline = '3px solid #ef4444';
      cell.style.backgroundColor = '#fef08a';
      cell.style.padding = '8px 12px';
      cell.innerHTML = `${cell.innerText} <span style="color: #dc2626; font-size: 12px; font-weight: bold; margin-left: 6px;">[Thiếu nút +/-]</span>`;
    });
    const header = document.querySelector('h2');
    const badge = document.createElement('div');
    badge.id = 'bug-badge';
    badge.style = 'background: #dc2626; color: white; padding: 8px 14px; border-radius: 6px; font-weight: bold; margin-bottom: 16px; font-size: 14px; display: inline-block;';
    badge.innerText = '⚠️ LỖI: Cột "Số lượng" chỉ hiển thị text tĩnh, hoàn toàn thiếu nút [+] và [-] để chỉnh số lượng';
    header.parentNode.insertBefore(badge, header.nextSibling);
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'bug-06-cart-missing-qty-adjustment-buttons.png') });

  // -------------------------------------------------------------
  // BUG 07: Delete button without confirmation dialog
  // -------------------------------------------------------------
  console.log('Capturing Bug 07 (Delete button lacks confirmation dialog)...');
  await setupCartWithItems();
  await page.evaluate(() => {
    const delBtns = document.querySelectorAll('tbody tr td button');
    delBtns.forEach(btn => {
      btn.style.outline = '3px solid #ef4444';
      btn.style.backgroundColor = '#fee2e2';
      btn.style.padding = '4px 10px';
      btn.style.borderRadius = '4px';
    });
    const header = document.querySelector('h2');
    const badge = document.createElement('div');
    badge.id = 'bug-badge';
    badge.style = 'background: #dc2626; color: white; padding: 8px 14px; border-radius: 6px; font-weight: bold; margin-bottom: 16px; font-size: 14px; display: inline-block;';
    badge.innerText = '⚠️ LỖI: Nút "Xóa" xóa lập tức khi bấm, không có Dialog xác nhận (window.confirm / Modal) theo FR-07';
    header.parentNode.insertBefore(badge, header.nextSibling);
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'bug-07-cart-missing-delete-confirmation-dialog.png') });

  // -------------------------------------------------------------
  // BUG 08: Incorrect total label 'Tổng tạm tính'
  // -------------------------------------------------------------
  console.log('Capturing Bug 08 (Incorrect label "Tổng tạm tính")...');
  await setupCartWithItems();
  await page.evaluate(() => {
    // Find the total element
    const totalDivs = Array.from(document.querySelectorAll('div')).filter(d => d.innerText.includes('Tổng tạm tính'));
    if (totalDivs.length > 0) {
      const target = totalDivs[totalDivs.length - 1];
      target.style.outline = '3px solid #ef4444';
      target.style.backgroundColor = '#fef08a';
      target.style.padding = '8px 14px';
      target.style.borderRadius = '6px';
    }
    const header = document.querySelector('h2');
    const badge = document.createElement('div');
    badge.id = 'bug-badge';
    badge.style = 'background: #dc2626; color: white; padding: 8px 14px; border-radius: 6px; font-weight: bold; margin-bottom: 16px; font-size: 14px; display: inline-block;';
    badge.innerText = '⚠️ LỖI: Hiển thị nhãn sai "Tổng tạm tính:" thay vì "Tổng cộng:" theo quy định đặc tả FR-07';
    header.parentNode.insertBefore(badge, header.nextSibling);
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'bug-08-cart-incorrect-total-label.png') });

  // -------------------------------------------------------------
  // BUG 09: Incorrect button label '← Mua tiếp'
  // -------------------------------------------------------------
  console.log('Capturing Bug 09 (Incorrect button label "← Mua tiếp")...');
  await setupCartWithItems();
  await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a')).filter(a => a.innerText.includes('← Mua tiếp'));
    if (links.length > 0) {
      const target = links[0];
      target.style.outline = '3px solid #ef4444';
      target.style.backgroundColor = '#fef08a';
      target.style.fontWeight = 'bold';
    }
    const header = document.querySelector('h2');
    const badge = document.createElement('div');
    badge.id = 'bug-badge';
    badge.style = 'background: #dc2626; color: white; padding: 8px 14px; border-radius: 6px; font-weight: bold; margin-bottom: 16px; font-size: 14px; display: inline-block;';
    badge.innerText = '⚠️ LỖI: Nút quay về hiển thị nhãn "← Mua tiếp" thay vì chuẩn đặc tả "Tiếp tục mua sắm"';
    header.parentNode.insertBefore(badge, header.nextSibling);
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'bug-09-cart-incorrect-continue-shopping-label.png') });

  // -------------------------------------------------------------
  // BUG 10: Empty cart state lacks illustration
  // -------------------------------------------------------------
  console.log('Capturing Bug 10 (Empty cart lacks illustration image)...');
  await page.goto('http://localhost:5173/cart', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const emptyContainer = document.querySelector('div.text-center');
    if (emptyContainer) {
      const placeholder = document.createElement('div');
      placeholder.style = 'border: 2px dashed #ef4444; background: #fee2e2; color: #dc2626; padding: 24px; border-radius: 8px; margin: 20px auto; max-width: 400px; font-weight: bold; font-size: 14px;';
      placeholder.innerHTML = '📷 [KHÔNG CÓ HÌNH ẢNH MINH HỌA]<br/><span style="font-size: 12px; font-weight: normal; color: #991b1b;">Đặc tả FR-07 quy định: Giỏ hàng trống phải có hình minh họa và thông báo rõ ràng</span>';
      emptyContainer.insertBefore(placeholder, emptyContainer.firstChild);
    }
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'bug-10-cart-empty-missing-illustration.png') });

  await browser.close();
  console.log('All cart UI screenshots regenerated successfully with distinct highlights!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
