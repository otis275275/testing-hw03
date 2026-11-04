const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const http = require('http');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.resolve(__dirname, '../report/screenshots');
const USER_DATA_DIR = path.resolve(__dirname, '../temp_chrome_profile');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(port, name, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const up = await checkPort(port);
    if (up) {
      console.log(`[OK] Server ${name} is up on port ${port}`);
      return true;
    }
    await new Promise((r) => setTimeout(r, 600));
  }
  throw new Error(`Timeout waiting for ${name} on port ${port}`);
}

// Annotation Helper to inject clear visual feedback
async function addDefectCallout(page, { selector, title, description, boxStyle, badgeStyle, position = 'bottom' }) {
  await page.evaluate(({ selector, title, description, boxStyle, badgeStyle, position }) => {
    const targets = selector ? Array.from(document.querySelectorAll(selector)) : [];
    targets.forEach((el) => {
      el.style.outline = '3px solid #ef4444';
      el.style.outlineOffset = '3px';
      el.style.boxShadow = '0 0 12px rgba(239, 68, 68, 0.4)';
    });

    const badge = document.createElement('div');
    badge.className = 'custom-defect-badge';
    badge.style.cssText = `
      background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
      color: #ffffff;
      border: 2px solid #fecaca;
      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.4);
      border-radius: 8px;
      padding: 12px 18px;
      margin: 12px 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      z-index: 99999;
      position: relative;
      ${badgeStyle || ''}
    `;
    badge.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 15px; margin-bottom: 4px; color: #fef08a;">
        <span style="font-size: 18px;">⚠️</span> ${title}
      </div>
      <div style="font-size: 13.5px; line-height: 1.4; color: #f8fafc; font-weight: 500;">
        ${description}
      </div>
    `;

    if (targets.length > 0 && targets[0].parentNode) {
      if (position === 'bottom') {
        targets[0].parentNode.insertBefore(badge, targets[0].nextSibling);
      } else {
        targets[0].parentNode.insertBefore(badge, targets[0]);
      }
    } else {
      document.body.insertBefore(badge, document.body.firstChild);
    }
  }, { selector, title, description, boxStyle, badgeStyle, position });
}

async function run() {
  console.log('--- Step 1: Checking / Starting Servers ---');
  let backendProc = null;
  let frontendProc = null;

  const backendUp = await checkPort(3000);
  if (!backendUp) {
    console.log('Starting Backend server (node server.js)...');
    backendProc = spawn('node', ['server.js'], {
      cwd: path.resolve(__dirname, '../backend'),
      stdio: 'ignore'
    });
  }

  const frontendUp = await checkPort(5173);
  if (!frontendUp) {
    console.log('Starting Frontend-Web server (npx vite)...');
    frontendProc = spawn('cmd.exe', ['/c', 'npx', 'vite', '--port', '5173'], {
      cwd: path.resolve(__dirname, '../frontend-web'),
      stdio: 'ignore'
    });
  }

  await waitForServer(3000, 'Backend API');
  await waitForServer(5173, 'Frontend Web');

  console.log('--- Step 2: Launching Chrome via Puppeteer ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    userDataDir: USER_DATA_DIR,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--window-size=1366,850'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 850, deviceScaleFactor: 1.5 });

  console.log('--- Step 3: Capturing 22 GUI Defects ---');

  // Helper navigation
  async function gotoHome() {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));
  }

  async function gotoProduct(id = 1) {
    await page.goto(`http://localhost:5173/product/${id}`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));
  }

  // -------------------------------------------------------------
  // CHK-01: Dual <h1> on Home
  // -------------------------------------------------------------
  console.log('Capturing CHK-01 (Dual <h1> on Home)...');
  await gotoHome();
  await addDefectCallout(page, {
    selector: 'h1',
    title: '[CHK-01] LỖI: Trang Home xuất hiện 2 thẻ <h1> vi phạm phân cấp cấu trúc duy nhất',
    description: 'Trang chủ tồn tại đồng thời 2 thẻ &lt;h1&gt;: tiêu đề chính "Danh sách sản phẩm" và thẻ phụ "Hiển thị 6 sản phẩm" ở cuối trang (Vi phạm chuẩn FR-05 &amp; FR-21).',
    position: 'top'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-01.png') });

  // -------------------------------------------------------------
  // CHK-03: Currency shows "... VND" instead of "₫"
  // -------------------------------------------------------------
  console.log('Capturing CHK-03 (Currency unit VND instead of ₫)...');
  await gotoHome();
  await addDefectCallout(page, {
    selector: '.text-red-500.font-bold',
    title: '[CHK-03] LỖI: Giá sản phẩm hiển thị đơn vị "VND" thay vì ký hiệu chuẩn "₫"',
    description: 'Đặc tả FR-21 quy định: "Luôn dùng ký hiệu ₫ với định dạng phân cách hàng nghìn". Thực tế giao diện lại hiển thị định dạng chữ "... VND".',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-03.png') });

  // -------------------------------------------------------------
  // CHK-07: Inconsistent button colors (Home Blue vs Detail Green)
  // -------------------------------------------------------------
  console.log('Capturing CHK-07 (Inconsistent button color)...');
  await gotoProduct(1);
  await addDefectCallout(page, {
    selector: 'button.bg-green-600',
    title: '[CHK-07] LỖI: Nút hành động chính dùng màu xanh lá cây, không đồng bộ với màu xanh dương',
    description: 'Nút "Thêm vào giỏ" trên thẻ sản phẩm trang chủ dùng màu xanh dương (bg-blue-600), nhưng sang trang Chi tiết lại đổi thành màu xanh lá cây (bg-green-600), vi phạm tính nhất quán bảng màu (FR-21).',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-07.png') });

  // -------------------------------------------------------------
  // CHK-13: Hover effect missing on Thoát button
  // -------------------------------------------------------------
  console.log('Capturing CHK-13 (Thoát button hover feedback missing)...');
  await gotoHome();
  await page.evaluate(() => {
    localStorage.setItem('token', 'mock_token');
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Nguyễn Văn A' }));
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await addDefectCallout(page, {
    selector: 'header button',
    title: '[CHK-13] LỖI: Nút "Thoát" trên Header hoàn toàn không có hiệu ứng hover phản hồi thị giác',
    description: 'Nút đăng xuất chỉ mang class tĩnh, khi rê chuột qua nút không hề có bất kỳ chuyển đổi sắc độ màu hay hiệu ứng trỏ chuột nào (Vi phạm nguyên tắc System Feedback).',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-13.png') });

  // -------------------------------------------------------------
  // CHK-14: Database Error raw HTML on search
  // -------------------------------------------------------------
  console.log('Capturing CHK-14 (Raw Database Error on search)...');
  await gotoHome();
  await page.type('input[placeholder="Tìm kiếm..."]', "'");
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 600));
  await addDefectCallout(page, {
    selector: '.bg-red-100',
    title: '[CHK-14] LỖI: Để lộ khối lỗi kỹ thuật thô kệch từ máy chủ làm vỡ bố cục giao diện',
    description: 'Khi tìm kiếm ký tự đặc biệt (dấu nháy đơn \'), thay vì thông báo lỗi thân thiện, màn hình xuất hiện một khối màu đỏ lớn in nguyên văn: "Database Error - SQLITE_ERROR: unrecognized token...".',
    position: 'top'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-14.png') });

  // -------------------------------------------------------------
  // CHK-20: Quantity input allows negative values
  // -------------------------------------------------------------
  console.log('Capturing CHK-20 (Quantity input allows negative values)...');
  await gotoProduct(1);
  await page.evaluate(() => {
    const input = document.querySelector('input[type="number"]');
    if (input) {
      input.value = '-5';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await addDefectCallout(page, {
    selector: 'input[type="number"]',
    title: '[CHK-20] LỖI: Ô số lượng cho phép nhập trực tiếp số âm (-5) mà không bị ngăn chặn',
    description: 'Đặc tả FR-06 quy định: "Chỉ nhận số nguyên dương, tối thiểu là 1". Giao diện thiếu thuộc tính min="1" cho phép người dùng gõ số âm và số 0.',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-20.png') });

  // -------------------------------------------------------------
  // CHK-21: Quantity input allows decimal values
  // -------------------------------------------------------------
  console.log('Capturing CHK-21 (Quantity input allows decimal values)...');
  await gotoProduct(1);
  await page.evaluate(() => {
    const input = document.querySelector('input[type="number"]');
    if (input) {
      input.value = '0.5';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await addDefectCallout(page, {
    selector: 'input[type="number"]',
    title: '[CHK-21] LỖI: Ô số lượng cho phép nhập số thập phân (0.5), thêm giỏ hàng bị mất dữ liệu',
    description: 'Giao diện không chặn dấu chấm thập phân; khi nhập 0.5 và bấm thêm giỏ hàng, hàm ép kiểu chuyển thành 0 khiến giỏ hàng trống trơn mà không có cảnh báo.',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-21.png') });

  // -------------------------------------------------------------
  // CHK-22: Quantity input allows huge numbers (Upper bound)
  // -------------------------------------------------------------
  console.log('Capturing CHK-22 (Quantity input allows huge numbers)...');
  await gotoProduct(1);
  await page.evaluate(() => {
    const input = document.querySelector('input[type="number"]');
    if (input) {
      input.value = '2000000000';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await addDefectCallout(page, {
    selector: 'input[type="number"]',
    title: '[CHK-22] LỖI: Ô số lượng thiếu giới hạn trên (max), cho phép nhập số cực lớn (2 tỷ)',
    description: 'Thiếu ràng buộc giới hạn số lượng đặt hàng tối đa hợp lý; người dùng gõ 2.000.000.000 mà không hề có cảnh báo vượt ngưỡng.',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-22.png') });

  // -------------------------------------------------------------
  // CHK-27: Search reflected XSS HTML
  // -------------------------------------------------------------
  console.log('Capturing CHK-27 (Search reflected XSS)...');
  await gotoHome();
  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder="Tìm kiếm..."]');
    if (input) {
      input.value = '<b style="color:red;font-size:20px;">XSS_TEST</b>';
    }
    const form = document.querySelector('form');
    if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 600));
  await addDefectCallout(page, {
    selector: '.text-gray-600',
    title: '[CHK-27] LỖI: Từ khóa tìm kiếm hiển thị thực thi mã định dạng HTML trực tiếp',
    description: 'Đặc tả FR-05 quy định: "Từ khóa tìm kiếm phải được hiển thị an toàn". Thực tế sử dụng dangerouslySetInnerHTML khiến chuỗi HTML bị render trực tiếp thay vì dạng chuỗi văn bản.',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-27.png') });

  // -------------------------------------------------------------
  // CHK-29: Lack of Pagination on Home (Endless vertical scroll)
  // -------------------------------------------------------------
  console.log('Capturing CHK-29 (Lack of Pagination on Home)...');
  await gotoHome();
  await addDefectCallout(page, {
    selector: '.grid',
    title: '[CHK-29] LỖI: Danh sách sản phẩm không có phân trang (Pagination), dồn ứ làm cuộn dọc vô tận',
    description: 'Trang Home dồn tất cả sản phẩm vào một màn hình duy nhất mà không có thanh chuyển trang (Trang 1, 2, 3...) hay nút xem thêm, gây trải nghiệm cuộn dọc kéo dài.',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-29.png') });

  // -------------------------------------------------------------
  // CHK-30: Missing Cart Badge on Header
  // -------------------------------------------------------------
  console.log('Capturing CHK-30 (Missing Cart Badge on Header)...');
  await gotoHome();
  await addDefectCallout(page, {
    selector: 'header a[href="/cart"]',
    title: '[CHK-30] LỖI: Link "Giỏ hàng" trên Header hoàn toàn không có huy hiệu (Badge) đếm số lượng',
    description: 'Đặc tả FR-23 quy định: "Link Giỏ hàng phải hiển thị badge số lượng sản phẩm trong giỏ". Thực tế Header chỉ hiển thị duy nhất chữ "Giỏ hàng" tĩnh.',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-30.png') });

  // -------------------------------------------------------------
  // CHK-31: Logout button labeled "Thoát" instead of "Đăng xuất"
  // -------------------------------------------------------------
  console.log('Capturing CHK-31 (Logout button labeled Thoát)...');
  await gotoHome();
  await addDefectCallout(page, {
    selector: 'header button',
    title: '[CHK-31] LỖI: Nút đăng xuất của tài khoản hiển thị nhãn "Thoát" thay vì "Đăng xuất"',
    description: 'Đặc tả FR-23 quy định: "Nút Đăng xuất phải nhãn là \'Đăng xuất\' (không phải \'Thoát\')". Giao diện thực tế đang dùng nhãn không đúng chuẩn.',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-31.png') });

  // -------------------------------------------------------------
  // CHK-32: Navbar lacks active state highlight
  // -------------------------------------------------------------
  console.log('Capturing CHK-32 (Navbar lacks active state highlight)...');
  await gotoHome();
  await addDefectCallout(page, {
    selector: 'header nav',
    title: '[CHK-32] LỖI: Thanh điều hướng không có hiệu ứng highlight đánh dấu trang đang xem',
    description: 'Đặc tả FR-23 quy định: "Thanh điều hướng (Navbar) phải highlight trang đang được chọn". Thực tế các mục menu hoàn toàn không có trạng thái active.',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-32.png') });

  // -------------------------------------------------------------
  // CHK-34: Product Detail lacks Breadcrumbs
  // -------------------------------------------------------------
  console.log('Capturing CHK-34 (Product Detail lacks Breadcrumbs)...');
  await gotoProduct(1);
  await addDefectCallout(page, {
    selector: '.bg-white.p-6.border',
    title: '[CHK-34] LỖI: Trang Chi tiết sản phẩm hoàn toàn thiếu thanh đường dẫn điều hướng (Breadcrumbs)',
    description: 'Đặc tả FR-23 quy định: "Breadcrumb bắt buộc có ở các trang con (Chi tiết sản phẩm...)". Màn hình chi tiết mở ra đột ngột mà không có đường dẫn Trang chủ / Tên sản phẩm.',
    position: 'top'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-34.png') });

  // -------------------------------------------------------------
  // CHK-39: Header username renders raw HTML (Stored XSS)
  // -------------------------------------------------------------
  console.log('Capturing CHK-39 (Header username renders raw HTML)...');
  await gotoHome();
  await page.evaluate(() => {
    localStorage.setItem('token', 'mock_token');
    localStorage.setItem('user', JSON.stringify({ id: 1, name: '<b style="color:red;font-size:18px;">Hacked_Admin</b>' }));
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await addDefectCallout(page, {
    selector: 'header a[href="/profile"]',
    title: '[CHK-39] LỖI: Tên người dùng trên Header render mã HTML thô thay vì hiển thị an toàn',
    description: 'Đặc tả bảo mật SEC-04 yêu cầu escape an toàn mọi dữ liệu từ người dùng. Việc dùng dangerouslySetInnerHTML khiến thẻ HTML trong tên user bị render trực tiếp lên thanh menu.',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-39.png') });

  // -------------------------------------------------------------
  // CHK-40: Dead click on Add to cart
  // -------------------------------------------------------------
  console.log('Capturing CHK-40 (Dead click on Add to cart)...');
  await gotoProduct(1);
  await addDefectCallout(page, {
    selector: 'button.bg-green-600',
    title: '[CHK-40] LỖI: Bấm nút "Thêm vào giỏ hàng" ở lần đầu tiên hoàn toàn không có phản hồi',
    description: 'Người dùng click chuột lần đầu tiên nhưng không có bất kỳ dấu hiệu UI nào (không hiện Toast thông báo, không đổi màu nút, không có số nhảy trên giỏ hàng).',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-40.png') });

  // -------------------------------------------------------------
  // CHK-41: Logout does not sync / clear Cart state
  // -------------------------------------------------------------
  console.log('Capturing CHK-41 (Logout does not sync / clear Cart state)...');
  await gotoHome();
  await page.evaluate(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await addDefectCallout(page, {
    selector: 'header',
    title: '[CHK-41] LỖI: Bấm Đăng xuất nhưng dữ liệu giỏ hàng cũ vẫn còn nguyên, bắt người dùng phải reload',
    description: 'Sau khi người dùng thoát phiên làm việc, giỏ hàng vẫn lưu thông tin sản phẩm của tài khoản trước; chỉ khi người dùng nhấn F5 tải lại trang thì giỏ mới hiển thị trống.',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-41.png') });

  // -------------------------------------------------------------
  // CHK-42: Rapid click on Add to cart does not update button text
  // -------------------------------------------------------------
  console.log('Capturing CHK-42 (Rapid click does not update button text)...');
  await gotoProduct(1);
  await addDefectCallout(page, {
    selector: 'button.bg-green-600',
    title: '[CHK-42] LỖI: Click liên tục vào nút "Thêm vào giỏ hàng", nút không đổi nhãn sang "Đã thêm"',
    description: 'Khi người dùng nhấp chuột liên tục để thêm hàng, nút bấm vẫn giữ nguyên dòng chữ "Thêm vào giỏ hàng" mà không hề có phản hồi thị giác xác nhận thành công.',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-42.png') });

  // -------------------------------------------------------------
  // CHK-43: Home card Add to cart missing toast
  // -------------------------------------------------------------
  console.log('Capturing CHK-43 (Home card Add to cart missing toast)...');
  await gotoHome();
  await addDefectCallout(page, {
    selector: '.grid button.bg-blue-600',
    title: '[CHK-43] LỖI: Bấm nút "Thêm vào giỏ" trên thẻ sản phẩm không có Toast thông báo xác nhận',
    description: 'Đặc tả FR-24 yêu cầu: "Sau khi bấm \'Thêm vào giỏ\', phải có phản hồi trực quan (toast/badge)". Thực tế bấm nút trên thẻ sản phẩm ở trang chủ không hề xuất hiện Toast.',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-43.png') });

  // -------------------------------------------------------------
  // CHK-44: Missing loading state on Home page
  // -------------------------------------------------------------
  console.log('Capturing CHK-44 (Missing loading state on Home page)...');
  await gotoHome();
  await addDefectCallout(page, {
    selector: 'h1',
    title: '[CHK-44] LỖI: Trong thời gian chờ tải danh sách sản phẩm, trang Home thiếu vòng xoay loading',
    description: 'Đặc tả FR-05 quy định: "Khi đang tải dữ liệu phải hiển thị trạng thái loading". Giao diện trang chủ không hề có spinner hay khung xương skeleton khi gọi API.',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-44.png') });

  // -------------------------------------------------------------
  // CHK-46: Search nonexistent keyword gives blank empty state
  // -------------------------------------------------------------
  console.log('Capturing CHK-46 (Search nonexistent keyword gives blank empty state)...');
  await gotoHome();
  await page.type('input[placeholder="Tìm kiếm..."]', 'sanphamkhongtontai12345');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 600));
  await addDefectCallout(page, {
    selector: '.text-gray-600',
    title: '[CHK-46] LỖI: Tìm kiếm không có kết quả để màn hình trắng trơn, thiếu hình ảnh minh họa',
    description: 'Đặc tả FR-05 & FR-24 yêu cầu: "Trang trống (Empty State) phải có icon/hình minh họa và thông báo rõ ràng". Khi không có sản phẩm, khu vực lưới bị để trống trơn hoàn toàn.',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-46.png') });

  // -------------------------------------------------------------
  // CHK-47: Home card image missing alt text (alt="")
  // -------------------------------------------------------------
  console.log('Capturing CHK-47 (Home card image missing alt text)...');
  await gotoHome();
  await addDefectCallout(page, {
    selector: '.grid img',
    title: '[CHK-47] LỖI: Ảnh sản phẩm để rỗng thuộc tính alt="", không có mô tả thay thế',
    description: 'Đặc tả FR-24 quy định: "Tất cả ảnh sản phẩm phải có thuộc tính alt mô tả nội dung ảnh (không để rỗng)". Thực tế thẻ img trên thẻ sản phẩm để alt="".',
    position: 'bottom'
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'CHK-47.png') });

  console.log('--- Step 4: All 22 screenshots captured successfully! ---');
  await browser.close();

  if (backendProc) {
    console.log('Stopping spawned Backend process...');
    backendProc.kill();
  }
  if (frontendProc) {
    console.log('Stopping spawned Frontend process...');
    frontendProc.kill();
  }
  console.log('Done!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});

