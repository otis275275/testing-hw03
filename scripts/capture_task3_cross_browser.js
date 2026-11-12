/**
 * Task 3 — Cross-Browser GUI Defect Capture Script (Chrome, Firefox, Safari/WebKit)
 *
 * Runs REAL browser sessions via Playwright (locally or via BrowserStack) against
 * the running EShop SUT (http://localhost:5173), injects the required student
 * identity watermark + defect callouts on the live DOM, and captures screenshots
 * for each browser under report/screenshots/task3/<browser>/.
 *
 * Usage:
 *   1) Local Playwright:
 *      npm install playwright
 *      npx playwright install chromium firefox webkit
 *      node scripts/capture_task3_cross_browser.js
 *
 *   2) BrowserStack (real macOS Safari, Windows Firefox, Windows Chrome):
 *      set BROWSERSTACK_USERNAME=...
 *      set BROWSERSTACK_ACCESS_KEY=...
 *      node scripts/capture_task3_cross_browser.js --browserstack
 *
 *   Optional flags:
 *      --browsers=chrome,firefox,safari   (comma-separated subset)
 *      --email=23120228@student.hcmus.edu.vn
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn, execFileSync } = require('child_process');

let playwright;
try {
  playwright = require('playwright');
} catch (err) {
  console.error(
    '[ERROR] Missing "playwright" package. Install it first:\n' +
      '  npm install playwright\n' +
      '  npx playwright install chromium firefox webkit'
  );
  process.exit(1);
}

const STUDENT_INFO = {
  mssv: '23120228',
  fullName: 'Lê Trung Thành Đạt',
  email: getArgValue('--email') || '23120228@student.hcmus.edu.vn',
};

const BASE_URL = process.env.SUT_WEB_URL || 'http://localhost:5173';
const OUT_ROOT = path.resolve(__dirname, '../report/screenshots/task3');
const USE_BROWSERSTACK = process.argv.includes('--browserstack');
const HEADLESS = process.argv.includes('--headless');
const CAPTURE_PS1 = path.resolve(__dirname, 'capture_window.ps1');
const DEFAULT_VIEWPORT = { width: 1280, height: 760 };

const BROWSER_CONFIGS = {
  chrome: {
    label: 'Google Chrome',
    osLabel: 'Windows 11',
    engine: 'chromium',
    channel: 'chrome',
    bsCaps: {
      browser: 'chrome',
      browser_version: 'latest',
      os: 'Windows',
      os_version: '11',
    },
  },
  firefox: {
    label: 'Mozilla Firefox',
    osLabel: process.platform === 'win32' ? 'Windows 11' : process.platform,
    engine: 'firefox',
    bsCaps: {
      browser: 'playwright-firefox',
      os: 'Windows',
      os_version: '11',
    },
  },
  safari: {
    label: USE_BROWSERSTACK ? 'Safari (macOS)' : 'Safari / WebKit',
    osLabel: USE_BROWSERSTACK ? 'macOS Sonoma' : 'WebKit Engine',
    engine: 'webkit',
    bsCaps: {
      browser: 'playwright-webkit',
      os: 'OS X',
      os_version: 'Sonoma',
    },
  },
};

function getArgValue(prefix) {
  const match = process.argv.find((arg) => arg.startsWith(`${prefix}=`));
  return match ? match.slice(prefix.length + 1) : null;
}

function parseSelectedBrowsers() {
  const arg = getArgValue('--browsers');
  if (!arg) return ['chrome', 'firefox', 'safari'];
  return arg
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((name) => Boolean(BROWSER_CONFIGS[name]));
}

function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, () => resolve(true));
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(port, name, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await checkPort(port)) {
      console.log(`[OK] ${name} is reachable on port ${port}`);
      return;
    }
    await new Promise((r) => setTimeout(r, 600));
  }
  throw new Error(`Timeout waiting for ${name} on port ${port}`);
}

async function ensureServersRunning() {
  const spawned = [];
  if (!(await checkPort(3000))) {
    console.log('Starting Backend API (port 3000)...');
    spawned.push(
      spawn(process.execPath, ['server.js'], {
        cwd: path.resolve(__dirname, '../backend'),
        stdio: 'ignore',
      })
    );
  }
  if (!(await checkPort(5173))) {
    console.log('Starting Frontend Web (port 5173)...');
    const viteBin = path.resolve(__dirname, '../frontend-web/node_modules/vite/bin/vite.js');
    spawned.push(
      spawn(process.execPath, [viteBin, '--port', '5173'], {
        cwd: path.resolve(__dirname, '../frontend-web'),
        stdio: 'ignore',
      })
    );
  }
  await waitForServer(3000, 'Backend API');
  await waitForServer(5173, 'Frontend Web');
  return spawned;
}

async function launchBrowser(key, cfg) {
  if (USE_BROWSERSTACK) {
    const user = process.env.BROWSERSTACK_USERNAME;
    const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
    if (!user || !accessKey) {
      throw new Error(
        'BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY must be set for --browserstack'
      );
    }
    const caps = {
      ...cfg.bsCaps,
      name: `EShop Task 3 - ${cfg.label}`,
      build: `HW03-${STUDENT_INFO.mssv}`,
      'browserstack.username': user,
      'browserstack.accessKey': accessKey,
      'browserstack.local': 'true',
    };
    const wsEndpoint = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
      JSON.stringify(caps)
    )}`;
    return playwright[cfg.engine].connect(wsEndpoint);
  }

  const launchOpts = { headless: HEADLESS };
  if (!HEADLESS && cfg.engine === 'chromium') {
    launchOpts.args = ['--window-position=40,40', '--window-size=1320,860'];
  }
  if (cfg.channel) {
    try {
      return await playwright[cfg.engine].launch({
        ...launchOpts,
        channel: cfg.channel,
      });
    } catch (_) {
      console.warn(
        `[WARN] Channel "${cfg.channel}" not found; falling back to Playwright bundled ${cfg.engine}.`
      );
    }
  }
  return playwright[cfg.engine].launch(launchOpts);
}

/**
 * Injects the student identity tag/watermark and page URL badge onto the live DOM.
 */
async function injectStudentTag(page, { browserLabel, osLabel, checkId }) {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const currentUrl = page.url();
  const ua = await page.evaluate(() => navigator.userAgent);

  await page.evaluate(
    ({ student, browserLabel, osLabel, checkId, currentUrl, timestamp, ua }) => {
      const existing = document.getElementById('task3-student-tag');
      if (existing) existing.remove();

      const tag = document.createElement('div');
      tag.id = 'task3-student-tag';
      tag.style.cssText = `
        position: fixed;
        bottom: 14px;
        right: 14px;
        z-index: 2147483647;
        background: rgba(15, 23, 42, 0.92);
        color: #f8fafc;
        border: 2px solid #38bdf8;
        border-radius: 10px;
        padding: 10px 14px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 12px;
        line-height: 1.45;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
        max-width: 440px;
        pointer-events: none;
      `;

      const titleDiv = document.createElement('div');
      titleDiv.style.cssText =
        'font-weight: 800; color: #38bdf8; font-size: 13px; margin-bottom: 3px;';
      titleDiv.textContent = `[${checkId}] ${browserLabel} — ${osLabel}`;

      const studentDiv = document.createElement('div');
      studentDiv.textContent = `MSSV: ${student.mssv} | Họ tên: ${student.fullName}`;

      const emailDiv = document.createElement('div');
      emailDiv.textContent = `Email: ${student.email}`;

      const urlDiv = document.createElement('div');
      urlDiv.style.cssText = 'color: #cbd5e1; word-break: break-all;';
      urlDiv.textContent = `URL: ${currentUrl}`;

      const metaDiv = document.createElement('div');
      metaDiv.style.cssText = 'color: #94a3b8; font-size: 10.5px; margin-top: 2px;';
      metaDiv.textContent = `${timestamp} | ${ua.slice(0, 68)}...`;

      tag.append(titleDiv, studentDiv, emailDiv, urlDiv, metaDiv);
      document.body.appendChild(tag);
    },
    { student: STUDENT_INFO, browserLabel, osLabel, checkId, currentUrl, timestamp, ua }
  );
}

/**
 * Highlights the target element(s) and inserts a visual defect callout card.
 */
async function addDefectCallout(page, { selector, title, description, position = 'bottom' }) {
  await page.evaluate(
    ({ selector, title, description, position }) => {
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
        box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.5);
        border-radius: 8px;
        padding: 12px 18px;
        margin: 12px 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        z-index: 99999;
        position: relative;
      `;

      const heading = document.createElement('div');
      heading.style.cssText =
        'display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 15px; margin-bottom: 4px; color: #fef08a;';
      heading.textContent = `⚠ ${title}`;

      const body = document.createElement('div');
      body.style.cssText = 'font-size: 13.5px; line-height: 1.4; color: #f8fafc; font-weight: 500;';
      body.textContent = description;

      badge.appendChild(heading);
      badge.appendChild(body);

      if (targets.length > 0 && targets[0].parentNode) {
        if (position === 'bottom') {
          targets[0].parentNode.insertBefore(badge, targets[0].nextSibling);
        } else {
          targets[0].parentNode.insertBefore(badge, targets[0]);
        }
      } else {
        document.body.insertBefore(badge, document.body.firstChild);
      }
    },
    { selector, title, description, position }
  );
}

async function gotoHome(page) {
  await page.unroute('**/api/users/me').catch(() => {});
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.removeItem('token'));
  await page.waitForTimeout(400);
}

async function gotoProduct(page, id = 1) {
  await page.unroute('**/api/users/me').catch(() => {});
  await page.goto(`${BASE_URL}/product/${id}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
}

async function mockLogin(page, name = 'Test User') {
  await page.unroute('**/api/users/me').catch(() => {});
  await page.route('**/api/users/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        name,
        email: STUDENT_INFO.email,
        role: 'user',
      }),
    })
  );
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('token', 'task3_session_token');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
}

const DEFECT_SCENARIOS = [
  {
    id: 'CHK-01',
    run: async (page) => {
      await gotoHome(page);
      await addDefectCallout(page, {
        selector: 'h1',
        title: '[CHK-01] Trang Home xuất hiện 2 thẻ <h1>',
        description:
          'Trang chủ tồn tại đồng thời 2 thẻ <h1> ("Danh sách sản phẩm" và "Hiển thị X sản phẩm"), vi phạm FR-05 & FR-21.',
        position: 'top',
      });
    },
  },
  {
    id: 'CHK-03',
    run: async (page) => {
      await gotoHome(page);
      await addDefectCallout(page, {
        selector: '.text-red-500.font-bold',
        title: '[CHK-03] Giá sản phẩm hiển thị "VND" thay vì "₫"',
        description: 'Đặc tả FR-21 yêu cầu dùng ký hiệu "₫" thay vì chữ "VND".',
      });
    },
  },
  {
    id: 'CHK-07',
    run: async (page) => {
      await gotoProduct(page, 1);
      await addDefectCallout(page, {
        selector: 'button.bg-green-600',
        title: '[CHK-07] Màu nút hành động không nhất quán (xanh dương vs xanh lá)',
        description: 'Nút "Thêm vào giỏ" ở Home màu xanh dương nhưng ở Detail lại đổi sang màu xanh lá.',
      });
    },
  },
  {
    id: 'CHK-13',
    run: async (page) => {
      await mockLogin(page, 'Lê Trung Thành Đạt');
      await addDefectCallout(page, {
        selector: 'header button',
        title: '[CHK-13] Nút "Thoát" thiếu hiệu ứng Hover',
        description: 'Nút đăng xuất không có hiệu ứng phản hồi màu sắc khi rê chuột.',
      });
    },
  },
  {
    id: 'CHK-14',
    run: async (page) => {
      await gotoHome(page);
      await page.fill('input[placeholder="Tìm kiếm..."]', "'");
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
      await addDefectCallout(page, {
        selector: '.bg-red-100',
        title: '[CHK-14] Lộ lỗi SQLITE thô trên giao diện khi tìm kiếm ký tự đặc biệt',
        description: 'Hiển thị trực tiếp HTML "Database Error - SQLITE_ERROR" thay vì thông báo thân thiện.',
        position: 'top',
      });
    },
  },
  {
    id: 'CHK-20',
    run: async (page) => {
      await gotoProduct(page, 1);
      await page.fill('input[type="number"]', '-5');
      await addDefectCallout(page, {
        selector: 'input[type="number"]',
        title: '[CHK-20] Ô số lượng cho phép nhập số âm (-5)',
        description: 'Thiếu ràng buộc min="1" theo FR-06.',
      });
    },
  },
  {
    id: 'CHK-21',
    run: async (page) => {
      await gotoProduct(page, 1);
      await page.fill('input[type="number"]', '0.5');
      await addDefectCallout(page, {
        selector: 'input[type="number"]',
        title: '[CHK-21] Ô số lượng cho phép nhập số thập phân (0.5)',
        description: 'Không chặn số thập phân, parseInt("0.5") thành 0 khi thêm giỏ hàng.',
      });
    },
  },
  {
    id: 'CHK-22',
    run: async (page) => {
      await gotoProduct(page, 1);
      await page.fill('input[type="number"]', '2000000000');
      await addDefectCallout(page, {
        selector: 'input[type="number"]',
        title: '[CHK-22] Ô số lượng thiếu giới hạn trên (cho phép 2 tỷ)',
        description: 'Không giới hạn số lượng tối đa hợp lý.',
      });
    },
  },
  {
    id: 'CHK-23',
    run: async (page) => {
      await gotoProduct(page, 1);
      const qtyInput = page.locator('input[type="number"]');
      await qtyInput.fill('');
      await qtyInput.pressSequentially('abc');
      const state = await qtyInput.evaluate((el) => ({
        value: el.value,
        badInput: el.validity.badInput,
      }));
      const statusText = state.badInput
        ? 'FAIL trên trình duyệt này: giữ ký tự "abc" (validity.badInput=true)'
        : 'PASS trên trình duyệt này: trình duyệt tự chặn ký tự chữ (badInput=false)';
      await addDefectCallout(page, {
        selector: 'input[type="number"]',
        title: '[CHK-23] Cross-Browser: Nhập chữ "abc" vào ô số lượng (<input type="number">)',
        description: `${statusText} (value="${state.value}"). Firefox cho phép nhập chữ không phải số, khác với Chrome & WebKit.`,
      });
    },
  },
  {
    id: 'CHK-27',
    run: async (page) => {
      await gotoHome(page);
      await page.fill('input[placeholder="Tìm kiếm..."]', '<b style="color:red;font-size:20px;">XSS_TEST</b>');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
      await addDefectCallout(page, {
        selector: '.text-gray-600',
        title: '[CHK-27] Từ khóa tìm kiếm render HTML trực tiếp (Reflected XSS)',
        description: 'Từ khóa tìm kiếm bị render qua dangerouslySetInnerHTML thay vì text thuần.',
      });
    },
  },
  {
    id: 'CHK-29',
    run: async (page) => {
      await gotoHome(page);
      await addDefectCallout(page, {
        selector: '.grid',
        title: '[CHK-29] Thiếu phân trang (Pagination) trên trang Home',
        description: 'Toàn bộ sản phẩm hiển thị trên một trang duy nhất.',
      });
    },
  },
  {
    id: 'CHK-30',
    run: async (page) => {
      await gotoHome(page);
      await addDefectCallout(page, {
        selector: 'header a[href="/cart"]',
        title: '[CHK-30] Link "Giỏ hàng" thiếu badge đếm số lượng',
        description: 'Vi phạm FR-23: Giỏ hàng trên Navbar phải hiển thị badge số lượng.',
      });
    },
  },
  {
    id: 'CHK-31',
    run: async (page) => {
      await mockLogin(page, 'Lê Trung Thành Đạt');
      await addDefectCallout(page, {
        selector: 'header button',
        title: '[CHK-31] Nút đăng xuất ghi "Thoát" thay vì "Đăng xuất"',
        description: 'Vi phạm FR-23: Nút đăng xuất phải có nhãn "Đăng xuất".',
      });
    },
  },
  {
    id: 'CHK-32',
    run: async (page) => {
      await gotoHome(page);
      await addDefectCallout(page, {
        selector: 'header nav',
        title: '[CHK-32] Navbar thiếu highlight trang đang chọn',
        description: 'Vi phạm FR-23: Không đánh dấu active state trên thanh điều hướng.',
      });
    },
  },
  {
    id: 'CHK-34',
    run: async (page) => {
      await gotoProduct(page, 1);
      await addDefectCallout(page, {
        selector: '.bg-white.p-6.border',
        title: '[CHK-34] Trang Chi tiết sản phẩm thiếu Breadcrumb',
        description: 'Vi phạm FR-23: Thiếu đường dẫn điều hướng Trang chủ / Tên sản phẩm.',
        position: 'top',
      });
    },
  },
  {
    id: 'CHK-39',
    run: async (page) => {
      await mockLogin(page, '<b style="color:red;font-size:18px;">XSS_Name</b>');
      await addDefectCallout(page, {
        selector: 'header a[href="/profile"]',
        title: '[CHK-39] Tên người dùng trên Header render HTML thô',
        description: 'Vi phạm SEC-04: Dùng dangerouslySetInnerHTML cho tên user.',
      });
    },
  },
  {
    id: 'CHK-40',
    run: async (page) => {
      await gotoProduct(page, 1);
      await page.click('button.bg-green-600');
      await addDefectCallout(page, {
        selector: 'button.bg-green-600',
        title: '[CHK-40] Bấm "Thêm vào giỏ hàng" lần đầu không phản hồi',
        description: 'Lần click đầu bị nuốt sự kiện (không cập nhật giỏ, không đổi nhãn).',
      });
    },
  },
  {
    id: 'CHK-41',
    run: async (page) => {
      await mockLogin(page, 'Lê Trung Thành Đạt');
      await page.click('.grid button.bg-blue-600');
      await page.click('header button');
      await page.click('header a[href="/cart"]');
      await page.waitForTimeout(300);
      await addDefectCallout(page, {
        selector: 'table',
        title: '[CHK-41] Đăng xuất không đồng bộ làm trống giỏ hàng',
        description: 'CartContext giữ nguyên sản phẩm sau khi người dùng bấm Thoát, không cần F5 vẫn thấy giỏ cũ.',
      });
    },
  },
  {
    id: 'CHK-42',
    run: async (page) => {
      await gotoProduct(page, 1);
      const btn = page.locator('button.bg-green-600');
      await btn.click();
      await btn.click();
      await btn.click();
      await addDefectCallout(page, {
        selector: 'button.bg-green-600',
        title: '[CHK-42] Click liên tục không giữ trạng thái phản hồi rõ ràng',
        description:
          'Click 3 lần liên tiếp vào "Thêm vào giỏ hàng" nhưng lần 1 & 3 bị nuốt sự kiện, không có Toast hay Badge xác nhận số lượng.',
      });
    },
  },
  {
    id: 'CHK-43',
    run: async (page) => {
      await gotoHome(page);
      await page.click('.grid button.bg-blue-600');
      await addDefectCallout(page, {
        selector: '.grid button.bg-blue-600',
        title: '[CHK-43] Bấm "Thêm vào giỏ" trên Home thiếu Toast/Badge phản hồi',
        description: 'Vi phạm FR-24: Không có phản hồi trực quan khi bấm thêm vào giỏ.',
      });
    },
  },
  {
    id: 'CHK-44',
    run: async (page) => {
      await gotoHome(page);
      await addDefectCallout(page, {
        selector: 'h1',
        title: '[CHK-44] Trang Home thiếu trạng thái Loading khi tải dữ liệu',
        description: 'Vi phạm FR-05: Không hiển thị spinner hoặc skeleton khi đang fetch API.',
      });
    },
  },
  {
    id: 'CHK-46',
    run: async (page) => {
      await gotoHome(page);
      await page.fill('input[placeholder="Tìm kiếm..."]', 'sanphamkhongtontai12345');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
      await addDefectCallout(page, {
        selector: '.text-gray-600',
        title: '[CHK-46] Tìm kiếm không có kết quả hiển thị trắng trơn (thiếu Empty State)',
        description: 'Vi phạm FR-05 & FR-24: Thiếu icon và thông báo khi danh sách rỗng.',
      });
    },
  },
  {
    id: 'CHK-47',
    run: async (page) => {
      await gotoHome(page);
      await addDefectCallout(page, {
        selector: '.grid img',
        title: '[CHK-47] Ảnh sản phẩm trên Home để alt="" rỗng',
        description: 'Vi phạm FR-24: Tất cả ảnh sản phẩm phải có thuộc tính alt mô tả.',
      });
    },
  },
];

/**
 * Executes all 49 M2 GUI checklist verifications live on the browser page.
 */
async function runChecklistAudit(page) {
  const checks = [];
  const rec = (id, status, observed) => checks.push({ id, status, observed });

  // --- Home page static & layout checks ---
  await gotoHome(page);
  const homeMetrics = await page.evaluate(() => {
    const h1s = Array.from(document.querySelectorAll('h1')).map((el) => el.textContent.trim());
    const prices = Array.from(document.querySelectorAll('.grid .text-red-500.font-bold')).map((el) =>
      el.textContent.trim()
    );
    const cards = Array.from(document.querySelectorAll('.grid > div'));
    const rowTops = cards.slice(0, 3).map((c) => Math.round(c.getBoundingClientRect().top));
    const rowHeights = cards.slice(0, 3).map((c) => Math.round(c.getBoundingClientRect().height));
    const btnTops = cards
      .slice(0, 3)
      .map((c) => {
        const b = c.querySelector('button');
        return b ? Math.round(b.getBoundingClientRect().top) : null;
      });
    const h1Size = parseFloat(getComputedStyle(document.querySelector('h1')).fontSize);
    const cardTitleSize = parseFloat(getComputedStyle(document.querySelector('.grid h2')).fontSize);
    const overflowX = document.documentElement.scrollWidth > window.innerWidth;
    const footer = document.querySelector('footer');
    const footerBg = footer ? getComputedStyle(footer).backgroundColor : '';
    const footerText = footer ? footer.textContent.trim() : '';
    const gridCols = getComputedStyle(document.querySelector('.grid')).gridTemplateColumns.split(' ').length;
    const header = document.querySelector('header');
    const headerPad = header ? getComputedStyle(header).paddingLeft : '';
    const searchInput = document.querySelector('input[placeholder="Tìm kiếm..."]');
    const logoLink = document.querySelector('header a[href="/"]');
    const cartLink = document.querySelector('header a[href="/cart"]');
    const navLinks = Array.from(document.querySelectorAll('header nav a'));
    const hasActiveClass = navLinks.some((a) => a.getAttribute('aria-current') || a.className.includes('active') || a.className.includes('underline font-bold'));
    const authLinks = navLinks.map((a) => a.textContent.trim());
    const imgs = Array.from(document.querySelectorAll('.grid img'));
    const emptyAlts = imgs.filter((img) => !img.getAttribute('alt') || img.getAttribute('alt').trim() === '').length;
    const hasPagination = Boolean(document.querySelector('[aria-label*="pagination"], .pagination')) || Array.from(document.querySelectorAll('button, a')).some((el) => /^(Trang )?\d+$|^Xem thêm$/.test(el.textContent.trim()));
    return {
      h1s,
      prices,
      cardsCount: cards.length,
      sameRowTop: new Set(rowTops).size === 1,
      sameRowHeight: new Set(rowHeights).size === 1,
      sameBtnTop: new Set(btnTops).size === 1,
      h1Size,
      cardTitleSize,
      overflowX,
      footerBg,
      footerText,
      gridCols,
      headerPad,
      searchPlaceholder: searchInput ? searchInput.getAttribute('placeholder') : '',
      logoHref: logoLink ? logoLink.getAttribute('href') : '',
      cartLinkText: cartLink ? cartLink.textContent.trim() : '',
      hasCartBadge: cartLink ? Boolean(cartLink.querySelector('span, .badge')) || /\d+/.test(cartLink.textContent) : false,
      hasActiveClass,
      authLinks,
      imgsCount: imgs.length,
      emptyAlts,
      hasPagination,
      homeBtnBg: getComputedStyle(document.querySelector('.grid button')).backgroundColor,
      hoverClassOnNav: navLinks.some((a) => a.className.includes('hover:underline')),
    };
  });

  rec('CHK-01', homeMetrics.h1s.length === 1 ? 'PASS' : 'FAIL', `Found ${homeMetrics.h1s.length} <h1> tags: ${JSON.stringify(homeMetrics.h1s)}`);
  rec('CHK-03', homeMetrics.prices.every((p) => p.includes('₫') && !p.includes('VND')) ? 'PASS' : 'FAIL', `Sample price: ${homeMetrics.prices[0]}`);
  rec('CHK-05', homeMetrics.sameRowTop && homeMetrics.sameRowHeight ? 'PASS' : 'FAIL', `Row1 sameTop=${homeMetrics.sameRowTop}, sameHeight=${homeMetrics.sameRowHeight}`);
  rec('CHK-06', homeMetrics.sameBtnTop ? 'PASS' : 'FAIL', `Action buttons aligned horizontally: ${homeMetrics.sameBtnTop}`);
  rec('CHK-08', homeMetrics.h1Size > homeMetrics.cardTitleSize ? 'PASS' : 'FAIL', `h1=${homeMetrics.h1Size}px > cardTitle=${homeMetrics.cardTitleSize}px`);
  rec('CHK-09', !homeMetrics.overflowX ? 'PASS' : 'FAIL', `horizontalOverflow=${homeMetrics.overflowX}`);
  rec('CHK-10', homeMetrics.footerText.includes('2026') ? 'PASS' : 'FAIL', `Footer="${homeMetrics.footerText}", bg=${homeMetrics.footerBg}`);

  // CHK-11: Responsive grid columns (1366 -> 768 -> 375)
  await page.setViewportSize({ width: 768, height: 850 });
  const tabletCols = await page.evaluate(() => getComputedStyle(document.querySelector('.grid')).gridTemplateColumns.split(' ').length);
  await page.setViewportSize({ width: 375, height: 812 });
  const mobileCols = await page.evaluate(() => getComputedStyle(document.querySelector('.grid')).gridTemplateColumns.split(' ').length);
  await page.setViewportSize({ width: 1366, height: 850 });
  rec('CHK-11', homeMetrics.gridCols === 3 && tabletCols >= 2 && mobileCols === 1 ? 'PASS' : 'FAIL', `Cols desktop=${homeMetrics.gridCols}, tablet=${tabletCols}, mobile=${mobileCols}`);
  rec('CHK-12', parseFloat(homeMetrics.headerPad) >= 12 ? 'PASS' : 'FAIL', `Header paddingLeft=${homeMetrics.headerPad}`);
  rec('CHK-15', homeMetrics.searchPlaceholder === 'Tìm kiếm...' ? 'PASS' : 'FAIL', `Placeholder="${homeMetrics.searchPlaceholder}"`);

  // CHK-16, CHK-17, CHK-18: Search button, Enter key, Clear reset
  await page.fill('input[placeholder="Tìm kiếm..."]', 'iPhone');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(350);
  const searchBtnCount = await page.locator('.grid > div').count();
  rec('CHK-16', searchBtnCount >= 1 && searchBtnCount < homeMetrics.cardsCount ? 'PASS' : 'FAIL', `Filtered count=${searchBtnCount}/${homeMetrics.cardsCount}`);

  await page.fill('input[placeholder="Tìm kiếm..."]', 'MacBook');
  await page.press('input[placeholder="Tìm kiếm..."]', 'Enter');
  await page.waitForTimeout(350);
  const enterCount = await page.locator('.grid > div').count();
  rec('CHK-17', enterCount >= 1 && enterCount < homeMetrics.cardsCount ? 'PASS' : 'FAIL', `Enter filtered count=${enterCount}`);

  await page.fill('input[placeholder="Tìm kiếm..."]', '');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(350);
  const resetCount = await page.locator('.grid > div').count();
  rec('CHK-18', resetCount === homeMetrics.cardsCount ? 'PASS' : 'FAIL', `Reset count=${resetCount}/${homeMetrics.cardsCount}`);

  // CHK-14: SQLite error on single quote
  await page.fill('input[placeholder="Tìm kiếm..."]', "'");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(350);
  const rawSqlErr = await page.locator('.bg-red-100').textContent().catch(() => '');
  rec('CHK-14', rawSqlErr.includes('SQLITE_ERROR') ? 'FAIL' : 'PASS', `Raw error text="${rawSqlErr.trim().slice(0, 80)}"`);

  // CHK-27: Reflected HTML XSS in search
  await page.fill('input[placeholder="Tìm kiếm..."]', '<b id="xss-probe">XSS</b>');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(350);
  const xssRendered = (await page.locator('#xss-probe').count()) > 0;
  rec('CHK-27', xssRendered ? 'FAIL' : 'PASS', `HTML <b> rendered in DOM=${xssRendered}`);

  // CHK-46: Empty state
  await page.fill('input[placeholder="Tìm kiếm..."]', 'sanphamkhongtontai12345');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(350);
  const emptyStateHasMsg = await page.evaluate(() => /không tìm thấy|empty|trống/i.test(document.body.innerText));
  rec('CHK-46', emptyStateHasMsg ? 'PASS' : 'FAIL', `Empty state message present=${emptyStateHasMsg}`);

  // CHK-44: Loading indicator on slow API
  await gotoHome(page);
  await page.route('**/api/products*', async (route) => {
    await new Promise((r) => setTimeout(r, 700));
    await route.continue();
  });
  const navPromise = page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1', { timeout: 5000 });
  const hasHomeLoading = await page.evaluate(() => /đang tải|loading/i.test(document.body.innerText) || Boolean(document.querySelector('[role="status"], .animate-spin, .animate-pulse')));
  await navPromise;
  await page.waitForLoadState('networkidle');
  await page.unroute('**/api/products*');
  rec('CHK-44', hasHomeLoading ? 'PASS' : 'FAIL', `Loading indicator during API fetch=${hasHomeLoading}`);

  rec('CHK-29', homeMetrics.hasPagination ? 'PASS' : 'FAIL', `Pagination present=${homeMetrics.hasPagination} (all ${homeMetrics.cardsCount} items rendered)`);
  rec('CHK-30', homeMetrics.hasCartBadge ? 'PASS' : 'FAIL', `Cart link="${homeMetrics.cartLinkText}", badge=${homeMetrics.hasCartBadge}`);
  rec('CHK-32', homeMetrics.hasActiveClass ? 'PASS' : 'FAIL', `Navbar active highlight=${homeMetrics.hasActiveClass}`);
  rec('CHK-36', homeMetrics.authLinks.includes('Đăng nhập') && homeMetrics.authLinks.includes('Đăng ký') ? 'PASS' : 'FAIL', `Auth links=${JSON.stringify(homeMetrics.authLinks)}`);
  rec('CHK-37', homeMetrics.hoverClassOnNav ? 'PASS' : 'FAIL', `Nav hover underline class=${homeMetrics.hoverClassOnNav}`);
  rec('CHK-47', homeMetrics.emptyAlts === 0 ? 'PASS' : 'FAIL', `Images with empty alt=${homeMetrics.emptyAlts}/${homeMetrics.imgsCount}`);

  // CHK-43: Home Add to cart feedback
  await gotoHome(page);
  await page.click('.grid button.bg-blue-600');
  await page.waitForTimeout(200);
  const homeAddToast = await page.evaluate(() => /đã thêm|thành công/i.test(document.body.innerText));
  rec('CHK-43', homeAddToast ? 'PASS' : 'FAIL', `Home add-to-cart visual feedback=${homeAddToast}`);

  // CHK-28, CHK-33, CHK-38: SPA Navigation Logo & Xem chi tiet
  const beforeUrl = page.url();
  await page.evaluate(() => { window.__spaMarker = true; });
  await page.click('.grid a[href^="/product/"]');
  await page.waitForTimeout(400);
  const detailUrl = page.url();
  const spaKept = await page.evaluate(() => window.__spaMarker === true);
  rec('CHK-33', /\/product\/\d+/.test(detailUrl) ? 'PASS' : 'FAIL', `Navigated to ${detailUrl}`);
  await page.click('header a[href="/"]');
  await page.waitForTimeout(300);
  const backHomeUrl = page.url();
  const spaKeptBack = await page.evaluate(() => window.__spaMarker === true);
  rec('CHK-28', backHomeUrl === `${BASE_URL}/` || backHomeUrl === BASE_URL ? 'PASS' : 'FAIL', `Logo returned to ${backHomeUrl}`);
  rec('CHK-38', spaKept && spaKeptBack && beforeUrl !== detailUrl ? 'PASS' : 'FAIL', `SPA marker preserved=${spaKept && spaKeptBack}`);

  // --- Product Detail checks ---
  // CHK-45: Loading state on ProductDetail
  await page.route('**/api/products/*', async (route) => {
    await new Promise((r) => setTimeout(r, 700));
    await route.continue();
  });
  const prodNav = page.goto(`${BASE_URL}/product/1`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('main', { timeout: 5000 });
  const detailLoadingText = await page.waitForFunction(() => document.body.innerText.includes('Đang tải...'), null, { timeout: 2000 }).then(() => true).catch(() => false);
  await prodNav;
  await page.waitForLoadState('networkidle');
  await page.unroute('**/api/products/*');
  rec('CHK-45', detailLoadingText ? 'PASS' : 'FAIL', `ProductDetail loading text visible=${detailLoadingText}`);

  const detailMetrics = await page.evaluate(() => {
    const h1s = Array.from(document.querySelectorAll('h1')).map((e) => e.textContent.trim());
    const priceEl = document.querySelector('p.text-red-600');
    const detailBtn = document.querySelector('button.bg-green-600');
    const qtyInput = document.querySelector('input[type="number"]');
    const labelText = document.querySelector('label') ? document.querySelector('label').textContent.trim() : '';
    const hasBreadcrumb = Boolean(document.querySelector('nav[aria-label*="breadcrumb"], .breadcrumb')) || document.body.innerText.includes('Trang chủ /');
    const detailImg = document.querySelector('main img');
    return {
      h1s,
      priceText: priceEl ? priceEl.textContent.trim() : '',
      priceColor: priceEl ? getComputedStyle(priceEl).color : '',
      detailBtnBg: detailBtn ? getComputedStyle(detailBtn).backgroundColor : '',
      qtyDefault: qtyInput ? qtyInput.value : '',
      qtyMin: qtyInput ? qtyInput.getAttribute('min') : null,
      qtyMax: qtyInput ? qtyInput.getAttribute('max') : null,
      qtyWidth: qtyInput ? Math.round(qtyInput.getBoundingClientRect().width) : 0,
      labelText,
      hasBreadcrumb,
      detailImgAlt: detailImg ? detailImg.getAttribute('alt') : '',
    };
  });

  rec('CHK-02', detailMetrics.h1s.length === 1 ? 'PASS' : 'FAIL', `ProductDetail <h1> count=${detailMetrics.h1s.length}`);
  rec('CHK-04', detailMetrics.priceText.includes('₫') ? 'PASS' : 'FAIL', `Price="${detailMetrics.priceText}", color=${detailMetrics.priceColor}`);
  rec('CHK-07', detailMetrics.detailBtnBg === homeMetrics.homeBtnBg ? 'PASS' : 'FAIL', `Home btn=${homeMetrics.homeBtnBg} vs Detail btn=${detailMetrics.detailBtnBg}`);
  rec('CHK-19', detailMetrics.qtyDefault === '1' ? 'PASS' : 'FAIL', `Default qty="${detailMetrics.qtyDefault}"`);
  rec('CHK-20', detailMetrics.qtyMin === '1' ? 'PASS' : 'FAIL', `min="${detailMetrics.qtyMin}" (accepts negative -5)`);

  // CHK-21 & CHK-22
  await page.fill('input[type="number"]', '0.5');
  const decimalVal = await page.inputValue('input[type="number"]');
  rec('CHK-21', decimalVal === '0.5' ? 'FAIL' : 'PASS', `Accepted decimal value="${decimalVal}"`);

  await page.fill('input[type="number"]', '2000000000');
  const hugeVal = await page.inputValue('input[type="number"]');
  rec('CHK-22', detailMetrics.qtyMax ? 'PASS' : 'FAIL', `max="${detailMetrics.qtyMax}", accepted="${hugeVal}"`);

  // CHK-23: Typing letters into input[type="number"] (can differ in Firefox vs Chromium/WebKit!)
  await page.fill('input[type="number"]', '');
  await page.locator('input[type="number"]').pressSequentially('abc');
  const letterVal = await page.inputValue('input[type="number"]');
  const typedTextVisible = await page.evaluate(() => {
    const el = document.querySelector('input[type="number"]');
    return { value: el.value, validityBadInput: el.validity.badInput };
  });
  rec('CHK-23', letterVal === '' && !typedTextVisible.validityBadInput ? 'PASS' : 'FAIL', `After typing "abc": value="${typedTextVisible.value}", badInput=${typedTextVisible.validityBadInput}`);

  // CHK-24: ArrowUp/ArrowDown step by 1
  await page.fill('input[type="number"]', '1');
  await page.locator('input[type="number"]').press('ArrowUp');
  const afterUp = await page.inputValue('input[type="number"]');
  await page.locator('input[type="number"]').press('ArrowDown');
  const afterDown = await page.inputValue('input[type="number"]');
  rec('CHK-24', afterUp === '2' && afterDown === '1' ? 'PASS' : 'FAIL', `ArrowUp->"${afterUp}", ArrowDown->"${afterDown}"`);

  rec('CHK-25', detailMetrics.qtyWidth > 0 && detailMetrics.qtyWidth <= 120 ? 'PASS' : 'FAIL', `qtyInput width=${detailMetrics.qtyWidth}px`);
  rec('CHK-26', detailMetrics.labelText === 'Số lượng:' ? 'PASS' : 'FAIL', `Label="${detailMetrics.labelText}"`);
  rec('CHK-34', detailMetrics.hasBreadcrumb ? 'PASS' : 'FAIL', `Breadcrumbs present=${detailMetrics.hasBreadcrumb}`);
  rec('CHK-48', detailMetrics.detailImgAlt === detailMetrics.h1s[0] ? 'PASS' : 'FAIL', `alt="${detailMetrics.detailImgAlt}"`);

  // CHK-40 & CHK-42: First click dead click & continuous clicks
  await gotoProduct(page, 1);
  await page.click('button.bg-green-600');
  const textAfter1Click = (await page.locator('button.bg-green-600').textContent()).trim();
  rec('CHK-40', textAfter1Click === 'Đã thêm' ? 'PASS' : 'FAIL', `After 1st click text="${textAfter1Click}"`);
  await page.click('button.bg-green-600');
  const textAfter2Click = (await page.locator('button.bg-green-600').textContent()).trim();
  await page.click('button.bg-green-600');
  await page.click('header a[href="/cart"]');
  await page.waitForTimeout(250);
  const cartItemsAfter3Clicks = await page.locator('tbody tr').count();
  rec('CHK-42', cartItemsAfter3Clicks === 3 ? 'PASS' : 'FAIL', `2nd click="${textAfter2Click}", after 3 clicks cart rows=${cartItemsAfter3Clicks} (clicks 1 & 3 swallowed)`);

  // --- Authenticated Header & Logout checks ---
  await mockLogin(page, 'Lê Trung Thành Đạt');
  const authMetrics = await page.evaluate(() => {
    const btn = document.querySelector('header button');
    return {
      btnText: btn ? btn.textContent.trim() : '',
      btnBgBefore: btn ? getComputedStyle(btn).backgroundColor : '',
      btnClass: btn ? btn.className : '',
      profileHref: document.querySelector('header a[href="/profile"]')?.getAttribute('href') || '',
    };
  });
  await page.hover('header button');
  await page.waitForTimeout(150);
  const btnBgHover = await page.evaluate(() => getComputedStyle(document.querySelector('header button')).backgroundColor);

  rec('CHK-13', authMetrics.btnBgBefore !== btnBgHover || authMetrics.btnClass.includes('hover:') ? 'PASS' : 'FAIL', `bg before=${authMetrics.btnBgBefore}, hover=${btnBgHover}`);
  rec('CHK-31', authMetrics.btnText === 'Đăng xuất' ? 'PASS' : 'FAIL', `Button text="${authMetrics.btnText}"`);
  rec('CHK-49', authMetrics.btnClass.includes('bg-red') ? 'PASS' : 'FAIL', `Logout button style="${authMetrics.btnClass}"`);

  // CHK-35: Profile link navigation
  await page.click('header a[href="/profile"]');
  await page.waitForTimeout(300);
  rec('CHK-35', page.url().endsWith('/profile') ? 'PASS' : 'FAIL', `Profile link navigated to ${page.url()}`);

  // CHK-41: Logout does not clear Cart without reload
  await page.click('header a[href="/"]');
  await page.waitForTimeout(300);
  await page.click('.grid button.bg-blue-600');
  await page.click('header button');
  await page.click('header a[href="/cart"]');
  await page.waitForTimeout(300);
  const cartRowsAfterLogout = await page.locator('tbody tr').count();
  rec('CHK-41', cartRowsAfterLogout === 0 ? 'PASS' : 'FAIL', `Cart rows after logout without F5=${cartRowsAfterLogout}`);

  // CHK-39: Stored XSS username in Header
  await mockLogin(page, '<b id="header-xss">XSS_Name</b>');
  const headerXssRendered = (await page.locator('#header-xss').count()) > 0;
  rec('CHK-39', headerXssRendered ? 'FAIL' : 'PASS', `Header username HTML rendered=${headerXssRendered}`);

  // Sort by CHK number
  checks.sort((a, b) => a.id.localeCompare(b.id));
  return checks;
}

async function captureBrowserScreenshot(page, { browserKey, scenarioId, filePath }) {
  const canUseWindowCapture =
    !HEADLESS &&
    !USE_BROWSERSTACK &&
    process.platform === 'win32' &&
    fs.existsSync(CAPTURE_PS1);

  if (!canUseWindowCapture) {
    await page.screenshot({ path: filePath });
    return;
  }

  const marker = `[EShop-${browserKey}-${scenarioId}]`;
  const prevTitle = await page.evaluate((m) => {
    const old = document.title;
    document.title = `${old} ${m}`.trim();
    return old;
  }, marker);

  try {
    await page.waitForTimeout(150);
    execFileSync(
      'powershell',
      [
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        CAPTURE_PS1,
        '-TitleSubstring',
        marker,
        '-OutPath',
        filePath,
      ],
      { stdio: 'pipe' }
    );
  } catch (err) {
    console.warn(
      `[${browserKey}] Window capture failed for ${scenarioId} (${err.message}); falling back to viewport screenshot.`
    );
    await page.screenshot({ path: filePath });
  } finally {
    await page.evaluate((old) => {
      document.title = old;
    }, prevTitle).catch(() => {});
  }
}

async function runForBrowser(browserKey, cfg) {
  const outDir = path.join(OUT_ROOT, browserKey);
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`\n=== Running Task 3 on ${cfg.label} (${cfg.osLabel}) ===`);
  const browser = await launchBrowser(browserKey, cfg);
  const contextOpts = HEADLESS
    ? { viewport: DEFAULT_VIEWPORT, deviceScaleFactor: 1.5 }
    : { viewport: DEFAULT_VIEWPORT };
  const context = await browser.newContext(contextOpts);
  const page = await context.newPage();

  const screenshots = [];
  let checklistAudit = [];
  try {
    console.log(`[${browserKey}] Running 49-item GUI checklist audit...`);
    checklistAudit = await runChecklistAudit(page);
    const passCount = checklistAudit.filter((c) => c.status === 'PASS').length;
    const failCount = checklistAudit.filter((c) => c.status === 'FAIL').length;
    console.log(`[${browserKey}] Audit finished: ${passCount} PASS, ${failCount} FAIL (total ${checklistAudit.length})`);

    await page.setViewportSize(DEFAULT_VIEWPORT);

    for (const scenario of DEFECT_SCENARIOS) {
      console.log(`[${browserKey}] Capturing ${scenario.id}...`);
      await scenario.run(page);
      await injectStudentTag(page, {
        browserLabel: cfg.label,
        osLabel: cfg.osLabel,
        checkId: scenario.id,
      });
      const filePath = path.join(outDir, `${scenario.id}.png`);
      await captureBrowserScreenshot(page, {
        browserKey,
        scenarioId: scenario.id,
        filePath,
      });
      screenshots.push({ id: scenario.id, file: path.relative(path.resolve(__dirname, '..'), filePath) });
    }
  } finally {
    await context.close();
    await browser.close();
  }

  return { checklistAudit, screenshots };
}

async function main() {
  const selected = parseSelectedBrowsers();
  if (selected.length === 0) {
    throw new Error('No valid browsers selected. Use chrome, firefox, safari.');
  }

  const spawned = await ensureServersRunning();
  const summary = {};

  try {
    for (const key of selected) {
      summary[key] = await runForBrowser(key, BROWSER_CONFIGS[key]);
    }
    const summaryPath = path.join(OUT_ROOT, 'task3_run_summary.json');
    fs.mkdirSync(OUT_ROOT, { recursive: true });
    fs.writeFileSync(
      summaryPath,
      JSON.stringify({ student: STUDENT_INFO, browsers: summary, generatedAt: new Date().toISOString() }, null, 2),
      'utf8'
    );
    console.log(`\n[DONE] Task 3 screenshots & summary saved to ${OUT_ROOT}`);
  } finally {
    spawned.forEach((proc) => proc.kill());
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
