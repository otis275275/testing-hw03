# BÁO CÁO TASK 3 — KIỂM THỬ ĐA TRÌNH DUYỆT (CROSS-BROWSER TESTING) — PHÂN HỆ M2

- **Môn học:** Kiểm thử Phần mềm (FIT - HCMUS) — Bài tập lớn HW03
- **Sinh viên thực hiện (Thành viên M2):** **Lê Trung Thành Đạt** — MSSV: **23120228** (`23120228@student.hcmus.edu.vn`)
- **Hệ thống cần kiểm thử (SUT):** EShop Web (`http://localhost:5173`, Backend API `http://localhost:3000`)
- **Phạm vi kiểm thử (M2 Scope):** 49 mục GUI Checklist (`CHK-01` → `CHK-49`) từ [`testcase/gui_checklist_m2.md`](../testcase/gui_checklist_m2.md) trên màn hình **Home**, **Product Detail**, **Header & Footer** *(không kiểm tra `/cart` theo phân công M2)*.
- **Thời điểm chạy kiểm thử tự động:** `2026-11-12T12:43:42.891Z` (`19:43:42 UTC+7`)
- **Script thực thi:** [`scripts/capture_task3_cross_browser.js`](../scripts/capture_task3_cross_browser.js) + [`scripts/capture_window.ps1`](../scripts/capture_window.ps1) *(chế độ `headless: false` + chụp nguyên khung cửa sổ trình duyệt thật trên Windows)*
- **Dữ liệu tổng hợp thô:** [`report/screenshots/task3/task3_run_summary.json`](./screenshots/task3/task3_run_summary.json)

---

## 1. Môi trường & Nền tảng kiểm thử (3 Browser Engines)

Toàn bộ 49 mục kiểm thử được chạy tự động qua **Playwright** trên trình duyệt thật/engine thực tế (không cắt ghép ảnh tĩnh), có gắn watermark định danh (`MSSV: 23120228 | Lê Trung Thành Đạt`), URL, timestamp và User-Agent thật của từng trình duyệt:

| STT | Nền tảng / Trình duyệt | Engine / Phiên bản ghi nhận | Cách thực thi | Thư mục ảnh bằng chứng |
| :-: | :--- | :--- | :--- | :--- |
| 1 | **Google Chrome (Windows 11)** | Chromium / Chrome channel (`AppleWebKit/537.36`) | Playwright `chromium.launch({ channel: 'chrome' })` | [`screenshots/task3/chrome/`](./screenshots/task3/chrome/) (23 ảnh) |
| 2 | **Mozilla Firefox (Windows 11)** | Gecko (`Mozilla/5.0 ... rv:159.0`) | Playwright `firefox.launch()` | [`screenshots/task3/firefox/`](./screenshots/task3/firefox/) (23 ảnh) |
| 3 | **Safari / WebKit** | Apple WebKit Engine (`Macintosh; Intel Mac OS X 10_15_7 ... AppleWebKit/605.1.15`) | Playwright `webkit.launch()` | [`screenshots/task3/safari/`](./screenshots/task3/safari/) (23 ảnh) |

> **Ghi chú minh bạch về môi trường Safari:** Máy kiểm thử chạy Windows 11 không có phần cứng macOS và tài khoản miễn phí trên nền tảng cloud giới hạn thời gian phiên (1 phút/phiên), nên hạng mục Safari được thực thi bằng **Playwright WebKit Engine** (engine dựng trang lõi của Safari). Script [`capture_task3_cross_browser.js`](../scripts/capture_task3_cross_browser.js) cũng hỗ trợ cờ `--browserstack` để chạy trực tiếp lên macOS Safari thật khi cấu hình `BROWSERSTACK_USERNAME` và `BROWSERSTACK_ACCESS_KEY`.

---

## 2. Tổng hợp Kết quả Cross-Browser (49 Checklist Items)

| Trình duyệt / Engine | Tổng số mục | PASS | FAIL | Tỷ lệ PASS | Khác biệt riêng nền tảng |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Google Chrome (Windows 11)** | 49 | **27** | **22** | 55.1% | Không có lỗi riêng (22 lỗi chung toàn hệ thống) |
| **Mozilla Firefox (Windows 11)** | 49 | **26** | **23** | 53.1% | **+1 lỗi riêng `CHK-23`**: cho phép gõ chữ cái `"abc"` vào ô `<input type="number">` |
| **Safari / WebKit Engine** | 49 | **27** | **22** | 55.1% | Không có lỗi riêng (hành vi giống Chrome ở toàn bộ 49 mục) |

**Kết luận nhanh:**
- **48 / 49 mục** cho kết quả đồng nhất trên cả 3 engine (**26 PASS** chung và **22 FAIL** chung bắt nguồn từ logic giao diện/React của SUT).
- **1 / 49 mục (`CHK-23`)** xuất hiện **khác biệt hành vi giữa các trình duyệt (Cross-Browser Defect)**: Chrome và Safari/WebKit tự động chặn ký tự không phải số trong `<input type="number">`, trong khi **Mozilla Firefox** cho phép hiển thị chữ `"abc"` trực tiếp trong ô nhập và đặt `validity.badInput = true`.

---

## 3. Phân tích Chuyên sâu Lỗi Khác biệt Cross-Browser (`CHK-23`)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã mục** | `CHK-23` (IA-02 — Chặn ký tự chữ cái trong ô số lượng) |
| **Màn hình** | Product Detail (`/product/1`) |
| **Thao tác tái hiện** | Xóa trắng ô `Số lượng:` (`<input type="number">`), sau đó gõ tuần tự `"abc"` từ bàn phím (`pressSequentially('abc')`). |
| **Kết quả trên Chrome** | **PASS** — Trình duyệt chặn ký tự chữ; ô nhập liệu giữ trống, `value=""`, `validity.badInput=false`. |
| **Kết quả trên Safari / WebKit** | **PASS** — Trình duyệt chặn ký tự chữ; ô nhập liệu giữ trống, `value=""`, `validity.badInput=false`. |
| **Kết quả trên Firefox** | **FAIL** — Firefox cho phép người dùng gõ và **hiển thị rõ chữ `"abc"` bên trong ô số lượng**; thuộc tính DOM `validity.badInput=true` (trong khi `.value` rỗng `""` theo chuẩn HTML cho giá trị không hợp lệ). |
| **Nguyên nhân kỹ thuật** | Trang `ProductDetail` chỉ dựa vào `<input type="number">` mặc định của trình duyệt mà **không có handler lọc/chặn ký tự không phải số** (`onKeyDown` / `onChange` regex) hoặc kiểm tra `validity.badInput` trước khi xử lý. Đặc tả HTML cho phép mỗi browser tự quyết định có hiển thị ký tự chữ hay không, và Firefox lựa chọn cho phép gõ tự do rồi đánh dấu `badInput`. |
| **Ảnh bằng chứng đối chiếu** | - Firefox (FAIL — hiện `"abc"`): [`firefox/CHK-23.png`](./screenshots/task3/firefox/CHK-23.png)<br>- Chrome (PASS — ô trống): [`chrome/CHK-23.png`](./screenshots/task3/chrome/CHK-23.png)<br>- Safari/WebKit (PASS — ô trống): [`safari/CHK-23.png`](./screenshots/task3/safari/CHK-23.png) |

---

## 4. Bảng Đối chiếu Chi tiết 49 Mục trên 3 Trình duyệt

| Mã | IA | Thành phần kiểm tra | Chrome | Firefox | Safari / WebKit | Quan sát thực tế & Ảnh bằng chứng |
| :---: | :---: | :--- | :---: | :---: | :---: | :--- |
| `CHK-01` | IA-01 | Số lượng `<h1>` trên trang Home | **FAIL** | **FAIL** | **FAIL** | Xuất hiện 2 thẻ `<h1>`: `"Danh sách sản phẩm"` và `"Hiển thị 5 sản phẩm"`.<br>[Chrome](./screenshots/task3/chrome/CHK-01.png) · [Firefox](./screenshots/task3/firefox/CHK-01.png) · [Safari](./screenshots/task3/safari/CHK-01.png) |
| `CHK-02` | IA-01 | Tiêu đề `<h1>` trên Product Detail | **PASS** | **PASS** | **PASS** | `ProductDetail <h1> count=1` trên cả 3 trình duyệt. |
| `CHK-03` | IA-01 | Đơn vị tiền tệ trên thẻ Home | **FAIL** | **FAIL** | **FAIL** | Giá mẫu hiển thị `30,000,000 VND` thay vì `₫`.<br>[Chrome](./screenshots/task3/chrome/CHK-03.png) · [Firefox](./screenshots/task3/firefox/CHK-03.png) · [Safari](./screenshots/task3/safari/CHK-03.png) |
| `CHK-04` | IA-01 | Đơn vị tiền tệ trên Product Detail | **PASS** | **PASS** | **PASS** | Hiển thị `"30,000,000 ₫"`, màu đỏ `rgb(220, 38, 38)`. |
| `CHK-05` | IA-01 | Căn thẳng hàng thẻ sản phẩm (Home) | **PASS** | **PASS** | **PASS** | Hàng 1 cùng tọa độ đỉnh và chiều cao (`sameTop=true, sameHeight=true`). |
| `CHK-06` | IA-01 | Căn thẳng hàng nút thao tác trên thẻ | **PASS** | **PASS** | **PASS** | Các nút hành động thẳng hàng theo trục ngang (`true`). |
| `CHK-07` | IA-01 | Nhất quán màu nút hành động chính | **FAIL** | **FAIL** | **FAIL** | Home dùng xanh dương `rgb(37, 99, 235)` vs Detail dùng xanh lá `rgb(22, 163, 74)`.<br>[Chrome](./screenshots/task3/chrome/CHK-07.png) · [Firefox](./screenshots/task3/firefox/CHK-07.png) · [Safari](./screenshots/task3/safari/CHK-07.png) |
| `CHK-08` | IA-01 | Phân cấp Typography trên Home | **PASS** | **PASS** | **PASS** | `h1=30px > cardTitle=20px`. |
| `CHK-09` | IA-01 | Tránh thanh cuộn ngang | **PASS** | **PASS** | **PASS** | `horizontalOverflow=false` trên cả 3 engine. |
| `CHK-10` | IA-01 | Hiển thị Chân trang (Footer) | **PASS** | **PASS** | **PASS** | `"© 2026 EShop SUT. Dành cho mục đích kiểm thử."`, nền `rgb(31, 41, 55)`. |
| `CHK-11` | IA-01 | Co giãn lưới khi đổi kích thước | **PASS** | **PASS** | **PASS** | Số cột: desktop=3, tablet=3, mobile=1. |
| `CHK-12` | IA-01 | Khoảng cách đệm thanh Header | **PASS** | **PASS** | **PASS** | `Header paddingLeft=16px`. |
| `CHK-13` | IA-01 | Hiệu ứng Hover trên nút Thoát | **FAIL** | **FAIL** | **FAIL** | Màu nền trước và khi hover không đổi (`rgb(239, 68, 68)`).<br>[Chrome](./screenshots/task3/chrome/CHK-13.png) · [Firefox](./screenshots/task3/firefox/CHK-13.png) · [Safari](./screenshots/task3/safari/CHK-13.png) |
| `CHK-14` | IA-01 | Thông báo thân thiện khi lỗi tìm kiếm | **FAIL** | **FAIL** | **FAIL** | Tìm `'` hiển thị lỗi kỹ thuật thô `Database ErrorSQLITE_ERROR: unrecognized token: "'"`.<br>[Chrome](./screenshots/task3/chrome/CHK-14.png) · [Firefox](./screenshots/task3/firefox/CHK-14.png) · [Safari](./screenshots/task3/safari/CHK-14.png) |
| `CHK-15` | IA-02 | Placeholder ô tìm kiếm | **PASS** | **PASS** | **PASS** | `Placeholder="Tìm kiếm..."`. |
| `CHK-16` | IA-02 | Kích hoạt tìm kiếm bằng nút "Tìm" | **PASS** | **PASS** | **PASS** | Lọc đúng `1/5` sản phẩm khớp từ khóa. |
| `CHK-17` | IA-02 | Kích hoạt tìm kiếm bằng phím Enter | **PASS** | **PASS** | **PASS** | Nhấn Enter lọc đúng `1` sản phẩm. |
| `CHK-18` | IA-02 | Tải lại danh sách khi xóa từ khóa | **PASS** | **PASS** | **PASS** | Xóa từ khóa và tìm lại trả về đủ `5/5` sản phẩm. |
| `CHK-19` | IA-02 | Giá trị mặc định ô số lượng (Detail) | **PASS** | **PASS** | **PASS** | Giá trị mặc định `1`. |
| `CHK-20` | IA-02 | Ràng buộc số nguyên dương cho số lượng | **FAIL** | **FAIL** | **FAIL** | Thuộc tính `min=null`, chấp nhận giá trị âm `-5`.<br>[Chrome](./screenshots/task3/chrome/CHK-20.png) · [Firefox](./screenshots/task3/firefox/CHK-20.png) · [Safari](./screenshots/task3/safari/CHK-20.png) |
| `CHK-21` | IA-02 | Chặn nhập số thập phân ở ô số lượng | **FAIL** | **FAIL** | **FAIL** | Chấp nhận nhập `0.5` trong ô số lượng.<br>[Chrome](./screenshots/task3/chrome/CHK-21.png) · [Firefox](./screenshots/task3/firefox/CHK-21.png) · [Safari](./screenshots/task3/safari/CHK-21.png) |
| `CHK-22` | IA-02 | Giới hạn số lượng tối đa khi đặt hàng | **FAIL** | **FAIL** | **FAIL** | Thuộc tính `max=null`, nhận giá trị `2000000000`.<br>[Chrome](./screenshots/task3/chrome/CHK-22.png) · [Firefox](./screenshots/task3/firefox/CHK-22.png) · [Safari](./screenshots/task3/safari/CHK-22.png) |
| **`CHK-23`** | **IA-02** | **Chặn ký tự chữ cái trong ô số lượng** | **PASS** | **FAIL** | **PASS** | **Khác biệt cross-browser:** Chrome & Safari/WebKit chặn `"abc"` (`badInput=false`); **Firefox giữ `"abc"` trong ô nhập và `badInput=true`**.<br>[Chrome](./screenshots/task3/chrome/CHK-23.png) · [Firefox](./screenshots/task3/firefox/CHK-23.png) · [Safari](./screenshots/task3/safari/CHK-23.png) |
| `CHK-24` | IA-02 | Nút mũi tên tăng giảm số lượng | **PASS** | **PASS** | **PASS** | `ArrowUp -> "2"`, `ArrowDown -> "1"`. |
| `CHK-25` | IA-02 | Kích thước ô nhập số lượng | **PASS** | **PASS** | **PASS** | `qtyInput width=80px`. |
| `CHK-26` | IA-02 | Nhãn định danh cho ô số lượng | **PASS** | **PASS** | **PASS** | Nhãn `"Số lượng:"` rõ ràng cạnh ô nhập. |
| `CHK-27` | IA-02 | Hiển thị an toàn từ khóa tìm kiếm | **FAIL** | **FAIL** | **FAIL** | Thẻ `<b>` bị render thành HTML thật trong DOM (`HTML <b> rendered in DOM=true`).<br>[Chrome](./screenshots/task3/chrome/CHK-27.png) · [Firefox](./screenshots/task3/firefox/CHK-27.png) · [Safari](./screenshots/task3/safari/CHK-27.png) |
| `CHK-28` | IA-03 | Logo EShop điều hướng về Trang chủ | **PASS** | **PASS** | **PASS** | Click logo quay về `http://localhost:5173/`. |
| `CHK-29` | IA-03 | Phân trang danh sách sản phẩm | **FAIL** | **FAIL** | **FAIL** | Không có thanh phân trang (`Pagination present=false`, render dồn toàn bộ sản phẩm).<br>[Chrome](./screenshots/task3/chrome/CHK-29.png) · [Firefox](./screenshots/task3/firefox/CHK-29.png) · [Safari](./screenshots/task3/safari/CHK-29.png) |
| `CHK-30` | IA-03 | Huy hiệu giỏ hàng trên thanh điều hướng | **FAIL** | **FAIL** | **FAIL** | Liên kết `"Giỏ hàng"` không có badge đếm số lượng (`badge=false`).<br>[Chrome](./screenshots/task3/chrome/CHK-30.png) · [Firefox](./screenshots/task3/firefox/CHK-30.png) · [Safari](./screenshots/task3/safari/CHK-30.png) |
| `CHK-31` | IA-03 | Nhãn nút Đăng xuất | **FAIL** | **FAIL** | **FAIL** | Nút hiển thị `"Thoát"` thay vì `"Đăng xuất"`.<br>[Chrome](./screenshots/task3/chrome/CHK-31.png) · [Firefox](./screenshots/task3/firefox/CHK-31.png) · [Safari](./screenshots/task3/safari/CHK-31.png) |
| `CHK-32` | IA-03 | Highlight trang hiện tại trên Navbar | **FAIL** | **FAIL** | **FAIL** | Không đánh dấu trang đang xem (`Navbar active highlight=false`).<br>[Chrome](./screenshots/task3/chrome/CHK-32.png) · [Firefox](./screenshots/task3/firefox/CHK-32.png) · [Safari](./screenshots/task3/safari/CHK-32.png) |
| `CHK-33` | IA-03 | Nút "Xem chi tiết" chuyển đúng trang | **PASS** | **PASS** | **PASS** | Điều hướng đúng tới `http://localhost:5173/product/1`. |
| `CHK-34` | IA-03 | Thanh Breadcrumbs trên Product Detail | **FAIL** | **FAIL** | **FAIL** | Thiếu hoàn toàn thanh Breadcrumbs (`Breadcrumbs present=false`).<br>[Chrome](./screenshots/task3/chrome/CHK-34.png) · [Firefox](./screenshots/task3/firefox/CHK-34.png) · [Safari](./screenshots/task3/safari/CHK-34.png) |
| `CHK-35` | IA-03 | Điều hướng khi bấm Tên tài khoản | **PASS** | **PASS** | **PASS** | Điều hướng tới `http://localhost:5173/profile`. |
| `CHK-36` | IA-03 | Menu điều hướng khi chưa đăng nhập | **PASS** | **PASS** | **PASS** | Hiển thị đủ `["Giỏ hàng", "Đăng nhập", "Đăng ký"]`. |
| `CHK-37` | IA-03 | Hiệu ứng rê chuột trên liên kết menu | **PASS** | **PASS** | **PASS** | Liên kết menu có lớp gạch chân khi hover (`true`). |
| `CHK-38` | IA-03 | Chuyển trang mượt không reload toàn trang | **PASS** | **PASS** | **PASS** | Giữ nguyên trạng thái SPA (`SPA marker preserved=true`). |
| `CHK-39` | IA-03 | Hiển thị an toàn tên user trên Header | **FAIL** | **FAIL** | **FAIL** | Tên tài khoản chứa HTML bị render trực tiếp trên Header (`Header username HTML rendered=true`).<br>[Chrome](./screenshots/task3/chrome/CHK-39.png) · [Firefox](./screenshots/task3/firefox/CHK-39.png) · [Safari](./screenshots/task3/safari/CHK-39.png) |
| `CHK-40` | IA-04 | Độ nhạy nút "Thêm vào giỏ" (Detail) | **FAIL** | **FAIL** | **FAIL** | Click lần 1 không có tác dụng (Dead Click); chữ nút giữ nguyên `"Thêm vào giỏ hàng"`.<br>[Chrome](./screenshots/task3/chrome/CHK-40.png) · [Firefox](./screenshots/task3/firefox/CHK-40.png) · [Safari](./screenshots/task3/safari/CHK-40.png) |
| `CHK-41` | IA-04 | Đồng bộ Giỏ hàng khi Đăng xuất | **FAIL** | **FAIL** | **FAIL** | Sau khi bấm `"Thoát"` chưa F5, giỏ hàng vẫn hiển thị 1 dòng dữ liệu cũ.<br>[Chrome](./screenshots/task3/chrome/CHK-41.png) · [Firefox](./screenshots/task3/firefox/CHK-41.png) · [Safari](./screenshots/task3/safari/CHK-41.png) |
| `CHK-42` | IA-04 | Phản hồi nút Thêm giỏ khi click liên tục | **FAIL** | **FAIL** | **FAIL** | Click 3 lần: lần 2 đổi `"Đã thêm"`, lần 1 & 3 bị nuốt lệnh (chỉ tăng 1 dòng giỏ).<br>[Chrome](./screenshots/task3/chrome/CHK-42.png) · [Firefox](./screenshots/task3/firefox/CHK-42.png) · [Safari](./screenshots/task3/safari/CHK-42.png) |
| `CHK-43` | IA-04 | Phản hồi thị giác khi thêm giỏ tại Home | **FAIL** | **FAIL** | **FAIL** | Không có toast hay phản hồi thị giác (`Home add-to-cart visual feedback=false`).<br>[Chrome](./screenshots/task3/chrome/CHK-43.png) · [Firefox](./screenshots/task3/firefox/CHK-43.png) · [Safari](./screenshots/task3/safari/CHK-43.png) |
| `CHK-44` | IA-04 | Trạng thái tải dữ liệu trên Home | **FAIL** | **FAIL** | **FAIL** | Không hiển thị spinner/skeleton khi chờ API (`Loading indicator during API fetch=false`).<br>[Chrome](./screenshots/task3/chrome/CHK-44.png) · [Firefox](./screenshots/task3/firefox/CHK-44.png) · [Safari](./screenshots/task3/safari/CHK-44.png) |
| `CHK-45` | IA-04 | Trạng thái tải dữ liệu trên Product Detail | **PASS** | **PASS** | **PASS** | Hiển thị chữ thông báo tải (`ProductDetail loading text visible=true`). |
| `CHK-46` | IA-04 | Trạng thái rỗng khi tìm không có kết quả | **FAIL** | **FAIL** | **FAIL** | Vùng kết quả trống trơn, thiếu thông báo hướng dẫn (`Empty state message present=false`).<br>[Chrome](./screenshots/task3/chrome/CHK-46.png) · [Firefox](./screenshots/task3/firefox/CHK-46.png) · [Safari](./screenshots/task3/safari/CHK-46.png) |
| `CHK-47` | IA-04 | Mô tả thay thế `alt` ảnh sản phẩm (Home) | **FAIL** | **FAIL** | **FAIL** | `5/5` ảnh sản phẩm trên trang Home có `alt=""`.<br>[Chrome](./screenshots/task3/chrome/CHK-47.png) · [Firefox](./screenshots/task3/firefox/CHK-47.png) · [Safari](./screenshots/task3/safari/CHK-47.png) |
| `CHK-48` | IA-04 | Mô tả `alt` ảnh tại Product Detail | **PASS** | **PASS** | **PASS** | `alt="iPhone 15 Pro Max"`. |
| `CHK-49` | IA-04 | Màu sắc nút Đăng xuất phân biệt rõ | **PASS** | **PASS** | **PASS** | Nút đỏ nổi bật (`bg-red-500 px-3 py-1 rounded`). |

---

## 5. Cách tái lập lại bằng chứng trên máy cá nhân hoặc BrowserStack

1. **Chạy tự động trên cả 3 trình duyệt cục bộ (Chrome, Firefox, Safari/WebKit):**
   ```powershell
   node scripts/capture_task3_cross_browser.js
   ```
   Script tự động khởi động Backend (`:3000`) và Frontend Web (`:5173`) nếu chưa chạy, thực thi kiểm tra toàn bộ 49 mục cho từng trình duyệt, chụp 23 ảnh có watermark (`MSSV: 23120228`, `Lê Trung Thành Đạt`, URL, User-Agent, timestamp) và xuất báo cáo JSON tại `report/screenshots/task3/task3_run_summary.json`.

2. **Chạy trên thiết bị thật / macOS Safari thật qua BrowserStack (tùy chọn):**
   ```powershell
   $env:BROWSERSTACK_USERNAME="<username>"
   $env:BROWSERSTACK_ACCESS_KEY="<access_key>"
   node scripts/capture_task3_cross_browser.js --browserstack
   ```

