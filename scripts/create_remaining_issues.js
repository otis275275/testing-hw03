const https = require('https');

const TOKEN = process.env.GITHUB_TOKEN || '';
const OWNER = 'otis275275';
const REPO = 'eshop-sut';

function createIssue(issue) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      title: issue.title,
      body: issue.body,
      labels: issue.labels || ['bug']
    });

    const req = https.request({
      hostname: 'api.github.com',
      path: `/repos/${OWNER}/${REPO}/issues`,
      method: 'POST',
      headers: {
        'Authorization': `token ${TOKEN}`,
        'User-Agent': 'NodeJS-Issue-Creator',
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } else {
          reject(new Error(`Failed with status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

const issues = [
  // Issue 2
  {
    title: "[BUG][Auth] Account lockout duration hardcoded to 180 seconds instead of 30 seconds",
    labels: ["bug", "backend"],
    body: `## Môi trường
- **Client**: REST API Client / cURL
- **Hệ điều hành**: Windows 11
- **URL**: \`http://localhost:3000/api/login\`
- **Phiên bản/Commit**: Commit \`bfa3a40\` (\`origin/main\`)
- **Tài khoản kiểm thử**: \`test@eshop.com\`

## Steps to reproduce
1. Đăng nhập sai 3 lần liên tiếp với tài khoản \`test@eshop.com\` để kích hoạt trạng thái khóa tài khoản.
2. Kiểm tra giá trị trường \`lockedUntil\` trong phản hồi JSON trả về từ server:
   \`\`\`json
   { "error": "Tài khoản đã bị khóa. Vui lòng thử lại sau.", "lockedUntil": "..." }
   \`\`\`
3. Tính khoảng thời gian khóa: \`lockedUntil - thời điểm gửi request\`.
4. Đợi 31 giây sau khi bị khóa, gửi lại request đăng nhập với thông tin mật khẩu chính xác (\`Test1234!\`).

## Actual result
- Thời gian khóa tài khoản bị hardcode thành \`180,000\` ms (180 giây / 3 phút) thay vì 30 giây.
- Tại thời điểm $t = 31$ giây sau khi bị khóa, người dùng nhập đúng mật khẩu nhưng hệ thống vẫn từ chối với \`HTTP 403 Forbidden\`. Người dùng phải đợi tới 3 phút mới đăng nhập lại được.
- **Vị trí mã nguồn lỗi**: \`backend/server.js: dòng 57\`:
  \`\`\`javascript
  if (newAttempts >= 3) {
    lockedUntil = new Date(Date.now() + 180000).toISOString(); // LỖI: 180,000 ms = 180 giây (3 phút)
  }
  \`\`\`

## Expected result
- Theo đặc tả FR-02: Trong môi trường demo, tài khoản chỉ bị tạm khóa đúng **30 giây** (\`Date.now() + 30000\`).
- Sau 30 giây (ví dụ tại mốc $t = 31$ giây), người dùng nhập đúng mật khẩu phải đăng nhập thành công (\`HTTP 200 OK\`) và bộ đếm \`login_attempts\` phải được reset về 0.

## Evidence
![Bug 02 Evidence](https://raw.githubusercontent.com/otis275275/eshop-sut/main/docs/screenshots/bug-02-auth-lockout-180s.png)`
  },

  // Issue 3
  {
    title: "[BUG][Auth-UI] Login form displays incorrect title 'Đăng Ký', text input types, and misplaced error alert",
    labels: ["bug", "frontend", "ui"],
    body: `## Môi trường
- **Trình duyệt**: Google Chrome 120+
- **Hệ điều hành**: Windows 11
- **URL**: \`http://localhost:5173/login\`
- **Phiên bản/Commit**: Commit \`bfa3a40\` (\`origin/main\`)
- **Tài khoản kiểm thử**: Khách vãng lai / Người dùng chưa đăng nhập

## Steps to reproduce
1. Mở trình duyệt và truy cập trang đăng nhập \`http://localhost:5173/login\`.
2. Quan sát tiêu đề form, nhãn các ô nhập liệu và các thẻ \`<input>\`.
3. Nhập mật khẩu vào ô "Mật khẩu" và quan sát cách hiển thị ký tự trên màn hình.
4. Bấm nút đăng nhập với thông tin sai để kích hoạt thông báo lỗi và quan sát vị trí của hộp thông báo.

## Actual result
- **Lỗi 1 (Sai tiêu đề)**: Tiêu đề trang hiển thị \`<h2>Đăng Ký</h2>\` thay vì "Đăng nhập".
- **Lỗi 2 (Sai type email)**: Ô nhập email dùng thẻ \`<input type="text">\` thay vì \`type="email"\`, làm mất tính năng validate định dạng email của HTML5.
- **Lỗi 3 (Lộ mật khẩu)**: Ô nhập mật khẩu dùng thẻ \`<input type="text">\` thay vì \`type="password"\`, làm lộ rõ mật khẩu văn bản thường trên màn hình.
- **Lỗi 4 (Sai ngôn ngữ nút)**: Nút bấm ghi tiếng Anh \`Sign In\` thay vì tiếng Việt "Đăng nhập".
- **Lỗi 5 (Hộp lỗi sai vị trí)**: Hộp thông báo lỗi được render phía dưới nút bấm thay vì ở phía trên.
- **Vị trí mã nguồn lỗi**: \`frontend-web/src/pages/Login.jsx: dòng 24, 30, 40, 58, 66\`.

## Expected result
- Tiêu đề form phải hiển thị đúng: **Đăng nhập**.
- Trường email phải dùng \`<input type="email">\` kích hoạt HTML5 validation theo FR-02 & FR-22.
- Trường mật khẩu phải dùng \`<input type="password">\` che giấu ký tự bảo mật.
- Nút bấm phải có nhãn tiếng Việt chuẩn: **Đăng nhập**.
- Hộp thông báo lỗi render trang nhã phía trên nút bấm theo tiêu chuẩn UX.

## Evidence
![Bug 03 Evidence](https://raw.githubusercontent.com/otis275275/eshop-sut/main/docs/screenshots/bug-03-auth-ui-login-form-defects.png)`
  },

  // Issue 4
  {
    title: "[BUG][Mobile-Auth] Mobile catch block swallows account lockout error message from server",
    labels: ["bug", "mobile"],
    body: `## Môi trường
- **Client**: React Native Expo App (Mobile Client)
- **Hệ điều hành**: Windows 11 / Android / iOS
- **URL**: Mobile App kết nối \`http://<SERVER_IP>:3000/api/login\`
- **Phiên bản/Commit**: Commit \`bfa3a40\` (\`origin/main\`)
- **Tài khoản kiểm thử**: \`test@eshop.com\`

## Steps to reproduce
1. Đăng nhập sai 3 lần liên tiếp trên ứng dụng Mobile để tài khoản rơi vào trạng thái tạm khóa.
2. Tại lần đăng nhập tiếp theo khi tài khoản đang bị khóa, bấm nút "Đăng nhập".
3. Quan sát thông báo lỗi màu đỏ hiển thị trên màn hình ứng dụng Mobile.

## Actual result
- Backend server trả về mã \`HTTP 403 Forbidden\` kèm thông báo:
  \`\`\`json
  { "error": "Tài khoản đã bị khóa. Vui lòng thử lại sau." }
  \`\`\`
- Tuy nhiên, khối \`catch\` trong hàm \`handleLogin\` của Mobile App ghi đè toàn bộ lỗi thành chuỗi tĩnh:
  \`setLoginError("Đăng nhập thất bại. Vui lòng kiểm tra lại.")\`
- Người dùng hoàn toàn không biết tài khoản đang bị khóa, tiếp tục thao tác gây ức chế.
- **Vị trí mã nguồn lỗi**: \`frontend-mobile/App.js: dòng 194-206\`.

## Expected result
- Mobile App phải trích xuất và hiển thị chính xác thông điệp lỗi do Server trả về:
  **"Tài khoản đã bị khóa. Vui lòng thử lại sau."** theo đúng đặc tả FR-02.

## Evidence
![Bug 04 Evidence](https://raw.githubusercontent.com/otis275275/eshop-sut/main/docs/screenshots/bug-04-mobile-auth-swallow-lockout-error.png)`
  },

  // Issue 5
  {
    title: "[BUG][Cart] Adding duplicate product appends new row instead of incrementing quantity",
    labels: ["bug", "frontend", "cart"],
    body: `## Môi trường
- **Trình duyệt**: Google Chrome 120+
- **Hệ điều hành**: Windows 11
- **URL**: \`http://localhost:5173/\` & \`http://localhost:5173/cart\`
- **Phiên bản/Commit**: Commit \`bfa3a40\` (\`origin/main\`)
- **Dữ liệu kiểm thử**: Sản phẩm \`iPhone 15 Pro Max\`

## Steps to reproduce
1. Truy cập trang chủ \`http://localhost:5173/\`.
2. Bấm nút "Thêm vào giỏ" tại sản phẩm \`iPhone 15 Pro Max\`.
3. Bấm tiếp nút "Thêm vào giỏ" tại cùng sản phẩm \`iPhone 15 Pro Max\` lần thứ hai.
4. Điều hướng vào trang giỏ hàng \`http://localhost:5173/cart\` và quan sát bảng giỏ hàng.

## Actual result
- Bảng giỏ hàng hiển thị **2 dòng riêng biệt** cùng tên sản phẩm "iPhone 15 Pro Max", mỗi dòng có số lượng là 1.
- Hàm \`addToCart\` luôn append phần tử mới vào mảng thay vì kiểm tra trùng lặp để gộp số lượng.
- **Vị trí mã nguồn lỗi**: \`frontend-web/src/context/CartContext.jsx: dòng 8-10\`:
  \`\`\`javascript
  const addToCart = (product, quantity) => {
    setCart([...cart, { ...product, quantity }]); // LỖI: Luôn append phần tử mới
  };
  \`\`\`

## Expected result
- Khi thêm cùng một sản phẩm đã có trong giỏ hàng, hệ thống phải tăng số lượng của dòng sản phẩm đó lên (\`quantity = 2\`), không được tạo thêm dòng mới (theo đặc tả FR-07).

## Evidence
![Bug 05 Evidence](https://raw.githubusercontent.com/otis275275/eshop-sut/main/docs/screenshots/bug-05-cart-duplicate-product-new-row.png)`
  },

  // Issue 6
  {
    title: "[BUG][Cart-UI] Cart table displays static text quantity without +/- adjustment buttons",
    labels: ["bug", "frontend", "ui", "cart"],
    body: `## Môi trường
- **Trình duyệt**: Google Chrome 120+
- **Hệ điều hành**: Windows 11
- **URL**: \`http://localhost:5173/cart\`
- **Phiên bản/Commit**: Commit \`bfa3a40\` (\`origin/main\`)
- **Dữ liệu kiểm thử**: Giỏ hàng có sản phẩm

## Steps to reproduce
1. Thêm một sản phẩm vào giỏ hàng và mở trang \`http://localhost:5173/cart\`.
2. Quan sát cột "Số lượng" trong bảng giỏ hàng.
3. Thử tìm nút hoặc ô nhập để điều chỉnh số lượng sản phẩm.

## Actual result
- Cột Số lượng chỉ hiển thị dạng text tĩnh thuần túy (\`<td>{item.quantity}</td>\`).
- Hoàn toàn không có nút \`+\` / \`-\` hoặc ô input để thay đổi số lượng. Người dùng muốn đổi số lượng buộc phải xóa và thêm lại từ đầu.
- **Vị trí mã nguồn lỗi**: \`frontend-web/src/pages/Cart.jsx: dòng 47\`.

## Expected result
- Bảng giỏ hàng phải có nút \`+\` và \`-\` (hoặc ô nhập số lượng) để người dùng có thể tăng giảm số lượng sản phẩm trực tiếp trong giỏ hàng (theo đặc tả FR-07).

## Evidence
![Bug 06 Evidence](https://raw.githubusercontent.com/otis275275/eshop-sut/main/docs/screenshots/bug-06-cart-missing-qty-adjustment-buttons.png)`
  },

  // Issue 7
  {
    title: "[BUG][Cart-UI] Remove item button deletes product immediately without confirmation dialog",
    labels: ["bug", "frontend", "ui", "cart"],
    body: `## Môi trường
- **Trình duyệt**: Google Chrome 120+
- **Hệ điều hành**: Windows 11
- **URL**: \`http://localhost:5173/cart\`
- **Phiên bản/Commit**: Commit \`bfa3a40\` (\`origin/main\`)
- **Dữ liệu kiểm thử**: Giỏ hàng có sản phẩm

## Steps to reproduce
1. Thêm một sản phẩm vào giỏ hàng và truy cập trang \`http://localhost:5173/cart\`.
2. Bấm vào nút màu đỏ "Xóa" tại cột Thao tác.
3. Quan sát phản hồi của giao diện.

## Actual result
- Sản phẩm biến mất lập tức khỏi giỏ hàng ngay khi người dùng bấm nút "Xóa".
- Hoàn toàn không xuất hiện hộp thoại xác nhận (\`window.confirm\` hoặc Modal Dialog), gây nguy cơ mất dữ liệu khi bấm nhầm.
- **Vị trí mã nguồn lỗi**: \`frontend-web/src/pages/Cart.jsx: dòng 50-56\`:
  \`\`\`jsx
  <button onClick={() => removeFromCart(index)} className="text-red-500 hover:text-red-700">Xóa</button>
  \`\`\`

## Expected result
- Theo đặc tả FR-07: *"Nút Xóa sản phẩm phải có dialog xác nhận trước khi thực hiện"*.
- Hệ thống phải hiển thị hộp thoại xác nhận (Ví dụ: "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?"), chỉ khi người dùng chọn Đồng ý thì mới xóa.

## Evidence
![Bug 07 Evidence](https://raw.githubusercontent.com/otis275275/eshop-sut/main/docs/screenshots/bug-07-cart-missing-delete-confirmation-dialog.png)`
  },

  // Issue 8
  {
    title: "[BUG][Cart-UI] Cart total displays incorrect label 'Tổng tạm tính' instead of 'Tổng cộng'",
    labels: ["bug", "frontend", "ui", "cart"],
    body: `## Môi trường
- **Trình duyệt**: Google Chrome 120+
- **Hệ điều hành**: Windows 11
- **URL**: \`http://localhost:5173/cart\`
- **Phiên bản/Commit**: Commit \`bfa3a40\` (\`origin/main\`)
- **Dữ liệu kiểm thử**: Giỏ hàng có sản phẩm

## Steps to reproduce
1. Thêm sản phẩm vào giỏ hàng và điều hướng đến \`http://localhost:5173/cart\`.
2. Quan sát dòng hiển thị tổng tiền ở góc dưới bên trái của bảng giỏ hàng.

## Actual result
- Nhãn tổng tiền hiển thị là **"Tổng tạm tính:"** thay vì "Tổng cộng:".
- Dễ gây hiểu lầm cho khách hàng rằng đơn hàng còn chịu thêm các khoản phí ẩn hoặc thuế phát sinh.
- **Vị trí mã nguồn lỗi**: \`frontend-web/src/pages/Cart.jsx: dòng 62-64\`:
  \`\`\`jsx
  <div className="text-xl font-bold">
    Tổng tạm tính: <span className="text-red-600">{cartTotal.toLocaleString()} ₫</span>
  </div>
  \`\`\`

## Expected result
- Theo đặc tả FR-07: Tổng tiền hiển thị nhãn chính xác: **"Tổng cộng"** (không phải "Tổng tạm tính").

## Evidence
![Bug 08 Evidence](https://raw.githubusercontent.com/otis275275/eshop-sut/main/docs/screenshots/bug-08-cart-incorrect-total-label.png)`
  },

  // Issue 9
  {
    title: "[BUG][Cart-UI] Back navigation button labeled '← Mua tiếp' instead of 'Tiếp tục mua sắm'",
    labels: ["bug", "frontend", "ui", "cart"],
    body: `## Môi trường
- **Trình duyệt**: Google Chrome 120+
- **Hệ điều hành**: Windows 11
- **URL**: \`http://localhost:5173/cart\`
- **Phiên bản/Commit**: Commit \`bfa3a40\` (\`origin/main\`)
- **Dữ liệu kiểm thử**: Giỏ hàng có sản phẩm

## Steps to reproduce
1. Mở trang giỏ hàng \`http://localhost:5173/cart\` khi đã có sản phẩm.
2. Quan sát nút quay về trang chủ bên cạnh nút "Tiến hành thanh toán".

## Actual result
- Nút hiển thị nhãn ngắn không chuẩn: **"← Mua tiếp"**.
- Không đồng bộ với nhãn "Tiếp tục mua sắm" trên màn hình Empty State.
- **Vị trí mã nguồn lỗi**: \`frontend-web/src/pages/Cart.jsx: dòng 66-68\`:
  \`\`\`jsx
  <Link to="/" className="border px-4 py-2 rounded text-gray-600 hover:bg-gray-50">
    ← Mua tiếp
  </Link>
  \`\`\`

## Expected result
- Theo đặc tả FR-07: Phải có nút với nhãn chuẩn: **"Tiếp tục mua sắm"** để quay về trang chủ.

## Evidence
![Bug 09 Evidence](https://raw.githubusercontent.com/otis275275/eshop-sut/main/docs/screenshots/bug-09-cart-incorrect-continue-shopping-label.png)`
  },

  // Issue 10
  {
    title: "[BUG][Cart-UI] Empty cart state lacks visual illustration image",
    labels: ["bug", "frontend", "ui", "cart"],
    body: `## Môi trường
- **Trình duyệt**: Google Chrome 120+
- **Hệ điều hành**: Windows 11
- **URL**: \`http://localhost:5173/cart\`
- **Phiên bản/Commit**: Commit \`bfa3a40\` (\`origin/main\`)
- **Dữ liệu kiểm thử**: Giỏ hàng rỗng (\`cart.length === 0\`)

## Steps to reproduce
1. Đảm bảo giỏ hàng trống (xóa toàn bộ sản phẩm hoặc mở phiên mới).
2. Điều hướng vào trang \`http://localhost:5173/cart\`.
3. Quan sát màn hình trạng thái giỏ hàng trống.

## Actual result
- Giao diện chỉ hiển thị 2 dòng text đơn điệu: "Giỏ hàng của bạn đang trống" và liên kết "Tiếp tục mua sắm".
- Hoàn toàn thiếu hình ảnh minh họa giỏ hàng rỗng (Empty State illustration).
- **Vị trí mã nguồn lỗi**: \`frontend-web/src/pages/Cart.jsx: dòng 20-27\`.

## Expected result
- Theo đặc tả FR-07: *"Giỏ hàng trống phải có hình minh họa và thông báo rõ ràng"*.
- Màn hình phải render hình ảnh minh họa trực quan (ví dụ vector empty cart) kết hợp thông báo sinh động.

## Evidence
![Bug 10 Evidence](https://raw.githubusercontent.com/otis275275/eshop-sut/main/docs/screenshots/bug-10-cart-empty-missing-illustration.png)`
  },

  // Issue 11
  {
    title: "[BUG][Cart-API] POST /api/cart accepts unvalidated non-existent product and negative quantity",
    labels: ["bug", "backend", "api", "cart"],
    body: `## Môi trường
- **Client**: REST API Client / cURL
- **Hệ điều hành**: Windows 11
- **URL**: \`http://localhost:3000/api/cart\`
- **Phiên bản/Commit**: Commit \`bfa3a40\` (\`origin/main\`)
- **Tài khoản kiểm thử**: \`test@eshop.com\`

## Steps to reproduce
1. Đăng nhập để nhận JWT Token hợp lệ của người dùng.
2. Gửi request \`POST /api/cart\` với payload rác (sản phẩm không tồn tại và số lượng âm):
   \`\`\`json
   { "product_id": 9999, "quantity": -5 }
   \`\`\`
3. Quan sát mã phản hồi HTTP trả về từ server.

## Actual result
- Server trả về \`HTTP 200 OK\` (\`{"message": "Added to cart"}\`) và lưu trực tiếp payload rác vào giỏ hàng.
- API hoàn toàn không kiểm tra xem \`product_id\` có tồn tại trong CSDL hay không và không kiểm tra điều kiện \`quantity > 0\`.
- **Vị trí mã nguồn lỗi**: \`backend/server.js: dòng 290-295\`:
  \`\`\`javascript
  app.post("/api/cart", authenticateToken, (req, res) => {
    const userId = req.user.id;
    if (!userCarts[userId]) userCarts[userId] = [];
    userCarts[userId].push(req.body); // LỖI: Push trực tiếp không validate
    res.json({ message: "Added to cart" });
  });
  \`\`\`

## Expected result
- Backend API phải validate payload chặt chẽ:
  - Nếu \`product_id\` không tồn tại trong CSDL $\rightarrow$ trả về \`HTTP 404 Not Found\`.
  - Nếu \`quantity <= 0\` hoặc không phải số nguyên dương $\rightarrow$ trả về \`HTTP 400 Bad Request\`.

## Evidence
![Bug 11 Evidence](https://raw.githubusercontent.com/otis275275/eshop-sut/main/docs/screenshots/bug-11-cart-api-unvalidated-payload.png)`
  },

  // Issue 12
  {
    title: "[BUG][Security] Broken Access Control on /api/admin/* allowing normal users to access admin resources",
    labels: ["bug", "backend", "security"],
    body: `## Môi trường
- **Client**: REST API Client / cURL
- **Hệ điều hành**: Windows 11
- **URL**: \`http://localhost:3000/api/admin/users\` & \`http://localhost:3000/api/admin/orders\`
- **Phiên bản/Commit**: Commit \`bfa3a40\` (\`origin/main\`)
- **Tài khoản kiểm thử**: \`test@eshop.com\` (\`role = 'user'\`)

## Steps to reproduce
1. Đăng nhập với tài khoản người dùng bình thường (\`test@eshop.com\`) để nhận JWT Token.
2. Sử dụng token này để gửi request \`GET /api/admin/users\` hoặc \`GET /api/admin/orders\`:
   \`\`\`http
   GET /api/admin/users HTTP/1.1
   Authorization: Bearer <USER_JWT_TOKEN>
   \`\`\`
3. Quan sát mã phản hồi HTTP và dữ liệu nhận được.

## Actual result
- Server trả về \`HTTP 200 OK\` kèm toàn bộ danh sách khách hàng, email, địa chỉ và đơn hàng của hệ thống.
- Middleware \`authenticateToken\` chỉ giải mã token mà hoàn toàn không kiểm tra quyền \`req.user.role === 'admin'\`.
- Lỗ hổng Broken Access Control (OWASP Top 1) nghiêm trọng.
- **Vị trí mã nguồn lỗi**: \`backend/server.js: dòng 100-110 và 494-525\`.

## Expected result
- Theo đặc tả FR-12: Tất cả các API quản trị (\`/api/admin/*\`) phải yêu cầu Token hợp lệ VÀ \`role = 'admin'\`.
- Khi người dùng thông thường (\`role = 'user'\`) truy cập, hệ thống phải từ chối ngay với mã phản hồi **\`HTTP 403 Forbidden\`**.

## Evidence
![Bug 12 Evidence](https://raw.githubusercontent.com/otis275275/eshop-sut/main/docs/screenshots/bug-12-security-broken-access-control-admin-apis.png)`
  },

  // Issue 13
  {
    title: "[BUG][Security] Missing authentication middleware on mutating product APIs (POST/PUT/DELETE /api/products)",
    labels: ["bug", "backend", "security"],
    body: `## Môi trường
- **Client**: REST API Client / cURL
- **Hệ điều hành**: Windows 11
- **URL**: \`http://localhost:3000/api/products\`
- **Phiên bản/Commit**: Commit \`bfa3a40\` (\`origin/main\`)
- **Tài khoản kiểm thử**: Khách vãng lai (Anonymous / Không truyền token)

## Steps to reproduce
1. Gửi request \`POST /api/products\` mà HOÀN TOÀN KHÔNG kèm header \`Authorization\`:
   \`\`\`json
   {
     "name": "Hack Test Item 0 Dong",
     "price": 0,
     "description": "Created anonymously",
     "category_id": 1
   }
   \`\`\`
2. Quan sát phản hồi trả về từ server và kiểm tra CSDL sản phẩm.

## Actual result
- Server trả về \`HTTP 201 Created\` và chèn thành công sản phẩm vào CSDL.
- Các route \`POST\`, \`PUT\`, \`DELETE /api/products\` hoàn toàn thiếu middleware \`authenticateToken\`. Bất kỳ ai trên internet đều có thể thêm, sửa đổi giá hoặc xóa sạch danh mục sản phẩm của cửa hàng.
- **Vị trí mã nguồn lỗi**: \`backend/server.js: dòng 167-196\`.

## Expected result
- Theo đặc tả FR-12: Các API có tính ảnh hưởng dữ liệu (\`POST/PUT/DELETE /api/products\`) bắt buộc phải yêu cầu xác thực JWT và kiểm tra quyền Quản trị viên (\`role = 'admin'\`).
- Request không có token phải bị chặn với \`HTTP 401 Unauthorized\`.
- Request có token nhưng không phải admin phải bị chặn với \`HTTP 403 Forbidden\`.

## Evidence
![Bug 13 Evidence](https://raw.githubusercontent.com/otis275275/eshop-sut/main/docs/screenshots/bug-13-security-unauthenticated-product-mutation.png)`
  },

  // Issue 14
  {
    title: "[BUG][Security] Privilege Escalation via PUT /api/users/me allowing normal users to elevate to admin",
    labels: ["bug", "backend", "security"],
    body: `## Môi trường
- **Client**: REST API Client / cURL
- **Hệ điều hành**: Windows 11
- **URL**: \`http://localhost:3000/api/users/me\`
- **Phiên bản/Commit**: Commit \`bfa3a40\` (\`origin/main\`)
- **Tài khoản kiểm thử**: \`test@eshop.com\` (\`role = 'user'\`)

## Steps to reproduce
1. Đăng nhập tài khoản thường \`test@eshop.com\` để nhận JWT Token.
2. Gửi request \`PUT /api/users/me\` kèm payload tự gán quyền:
   \`\`\`json
   { "role": "admin" }
   \`\`\`
3. Kiểm tra phản hồi HTTP và giá trị cột \`role\` của user trong bảng \`users\` của CSDL.

## Actual result
- Server trả về \`HTTP 200 OK\` và cập nhật thẳng giá trị \`role = 'admin'\` vào CSDL cho người dùng.
- Lỗ hổng Leo thang Đặc quyền (Privilege Escalation / Mass Assignment) nghiêm trọng.
- **Vị trí mã nguồn lỗi**: \`backend/server.js: dòng 124-127\`:
  \`\`\`javascript
  if (role) {
    query += ", role = ?";
    params.push(role); // Cập nhật thẳng không kiểm tra quyền!
  }
  \`\`\`

## Expected result
- Theo đặc tả FR-04 & FR-12: Người dùng chỉ được phép cập nhật thông tin cá nhân (Họ tên, SĐT, Địa chỉ), **tuyệt đối không được phép tự thay đổi thuộc tính \`role\`**.
- Backend phải bỏ qua hoặc từ chối thuộc tính \`role\` từ request của người dùng thông thường.

## Evidence
![Bug 14 Evidence](https://raw.githubusercontent.com/otis275275/eshop-sut/main/docs/screenshots/bug-14-security-privilege-escalation-user-role.png)`
  },

  // Issue 15
  {
    title: "[BUG][API] GET /api/admin/orders ignores pagination query parameter 'limit'",
    labels: ["bug", "backend", "api"],
    body: `## Môi trường
- **Client**: REST API Client / cURL
- **Hệ điều hành**: Windows 11
- **URL**: \`http://localhost:3000/api/admin/orders\`
- **Phiên bản/Commit**: Commit \`bfa3a40\` (\`origin/main\`)
- **Tài khoản kiểm thử**: \`admin@eshop.com\`

## Steps to reproduce
1. Gửi request \`GET /api/admin/orders?limit=1\` kèm token hợp lệ.
2. Đếm số lượng phần tử đơn hàng trong mảng JSON trả về.

## Actual result
- Server trả về toàn bộ danh sách tất cả các đơn hàng có trong CSDL, bỏ qua hoàn toàn tham số \`limit=1\`.
- Câu lệnh SQL trong backend không truyền mệnh đề \`LIMIT\` / \`OFFSET\`.
- Nguy cơ cạn kiệt tài nguyên bộ nhớ (OOM) và DoS khi số lượng đơn hàng lớn.
- **Vị trí mã nguồn lỗi**: \`backend/server.js: dòng 510-523\`.

## Expected result
- Backend API phải áp dụng phân trang, tôn trọng tham số \`limit\` được truyền từ client (chỉ trả về tối đa số bản ghi bằng \`limit\`).

## Evidence
![Bug 15 Evidence](https://raw.githubusercontent.com/otis275275/eshop-sut/main/docs/screenshots/bug-15-api-admin-orders-ignores-pagination-limit.png)`
  },

  // Issue 16
  {
    title: "[BUG][Admin-UI] Header fails to render Admin navigation link when logged in as admin",
    labels: ["bug", "frontend", "ui", "admin"],
    body: `## Môi trường
- **Trình duyệt**: Google Chrome 120+
- **Hệ điều hành**: Windows 11
- **URL**: \`http://localhost:5173/\`
- **Phiên bản/Commit**: Commit \`bfa3a40\` (\`origin/main\`)
- **Tài khoản kiểm thử**: \`admin@eshop.com\` (\`role = 'admin'\`)

## Steps to reproduce
1. Truy cập \`http://localhost:5173/login\` và đăng nhập với tài khoản Quản trị viên (\`admin@eshop.com\` / \`Admin123!\`).
2. Sau khi được điều hướng về trang chủ, quan sát thanh Header điều hướng trên cùng.

## Actual result
- Header chỉ hiển thị "Chào, Admin" và nút "Thoát".
- Hoàn toàn không có liên kết/menu truy cập vào phân hệ Web Admin (ví dụ: Trang quản trị, Quản lý đơn hàng, Quản lý sản phẩm).
- **Vị trí mã nguồn lỗi**: \`frontend-web/src/App.jsx: dòng 24-36\`:
  \`\`\`jsx
  {user ? (
    <div className="flex gap-4 items-center">
      <Link to="/profile" className="hover:underline text-yellow-300">
        <span dangerouslySetInnerHTML={{ __html: \`Chào, \${user.name}\` }} />
      </Link>
      {/* THIẾU: Không kiểm tra user.role === 'admin' để render Link to="/admin" */}
      <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Thoát</button>
    </div>
  ) : ( ... )}
  \`\`\`

## Expected result
- Khi người dùng đăng nhập có \`user.role === 'admin'\`, Header phải render thêm liên kết hoặc menu **"Quản trị"** / **"Admin Portal"** để người quản trị điều hướng vào các trang quản lý.

## Evidence
![Bug 16 Evidence](https://raw.githubusercontent.com/otis275275/eshop-sut/main/docs/screenshots/bug-16-admin-ui-missing-header-link.png)`
  },

  // Issue 17
  {
    title: "[BUG][Admin-UI] Missing client-side route guards (Protected Route) for admin pages in App.jsx",
    labels: ["bug", "frontend", "security", "admin"],
    body: `## Môi trường
- **Trình duyệt**: Google Chrome 120+
- **Hệ điều hành**: Windows 11
- **URL**: \`http://localhost:5173/\`
- **Phiên bản/Commit**: Commit \`bfa3a40\` (\`origin/main\`)
- **Tài khoản kiểm thử**: Khách vãng lai / Người dùng thường (\`role = 'user'\`)

## Steps to reproduce
1. Kiểm tra cấu hình router trong \`frontend-web/src/App.jsx\`.
2. Kiểm tra việc bảo vệ các tuyến đường Admin khỏi việc truy cập trực tiếp bằng URL (Direct URL Access).

## Actual result
- Trong \`App.jsx\`, không có bất kỳ component Route Guard / ProtectedRoute nào để bảo vệ các tuyến đường yêu cầu quyền hạn.
- Thiếu cơ chế kiểm tra trạng thái đăng nhập và phân quyền \`user.role === 'admin'\` phía client để tự động chuyển hướng người dùng không đủ quyền về trang đăng nhập.
- **Vị trí mã nguồn lỗi**: \`frontend-web/src/App.jsx: dòng 50-60\`.

## Expected result
- Phải triển khai cơ chế Route Guard (ví dụ \`<AdminRoute>\` hoặc \`<ProtectedRoute roles={['admin']}>\`) bao bọc các tuyến đường quản trị.
- Nếu người dùng chưa đăng nhập hoặc không có \`role === 'admin'\`, hệ thống phải chặn truy cập và điều hướng về trang chủ hoặc trang đăng nhập kèm thông báo phù hợp.

## Evidence
![Bug 17 Evidence](https://raw.githubusercontent.com/otis275275/eshop-sut/main/docs/screenshots/bug-17-admin-ui-missing-route-guard.png)`
  }
];

async function run() {
  console.log(`Starting to create ${issues.length} issues on GitHub repo ${OWNER}/${REPO}...`);
  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i];
    console.log(`Creating Issue ${i + 2}/${issues.length + 1}: ${issue.title}...`);
    try {
      const res = await createIssue(issue);
      console.log(`-> Created #${res.number}: ${res.html_url}`);
      // Sleep 1 second to avoid secondary rate limiting
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`Error creating issue ${issue.title}:`, err.message);
    }
  }
  console.log('All remaining issues processed!');
}

run();
