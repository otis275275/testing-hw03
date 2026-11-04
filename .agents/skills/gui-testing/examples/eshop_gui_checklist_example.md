# Ví dụ Minh họa Bộ GUI Checklist cho EShop SUT (Phân hệ Thành viên M2)

**Phạm vi phân công (M2 Scope):**
- **Màn hình chính (Primary Screen):** Trang Home (Danh sách sản phẩm + Ô tìm kiếm, Web).
- **Màn hình / Thành phần liên đới (Secondary & Global Components):** Trang Chi tiết sản phẩm (Product Detail), Header & Footer toàn cục.
- **Tiêu chuẩn:** Phủ trọn vẹn 4 khía cạnh giao diện (IA-01: General UI Standards, IA-02: Forms & Controls, IA-03: Navigation, IA-04: Feedback & State) theo FR-05, FR-06 và FR-21 đến FR-24.

---

| # | Khía cạnh | Thành phần kiểm tra (Checkpoint) | Tiêu chí kiểm chứng (Verification Criteria) | Kết quả | Ghi chú & Bằng chứng thực tế (Notes / Evidence) |
| :-: | :--- | :--- | :--- | :---: | :--- |
| **I** | **IA-01** | **General UI Standards** | | | |
| 1 | IA-01 | Số lượng thẻ tiêu đề `<h1>` trên trang Home | Trang Home chỉ có duy nhất 1 thẻ `<h1>` mô tả trang ("Danh sách sản phẩm"). | **FAIL** | Phát hiện có 2 thẻ `<h1>`: tiêu đề chính và dòng "Hiển thị X sản phẩm" ở cuối trang (vi phạm FR-05 & FR-21). |
| 2 | IA-01 | Đơn vị tiền tệ hiển thị trên card sản phẩm | Mọi giá bán trên card sản phẩm hiển thị ký hiệu `₫` và phân cách hàng nghìn (ví dụ: `150.000 ₫`). | **FAIL** | Giá sản phẩm trên card hiển thị `... VND` thay vì ký hiệu `₫` (vi phạm FR-21). |
| 3 | IA-01 | Đơn vị tiền tệ trang Chi tiết sản phẩm | Giá sản phẩm trên trang Product Detail hiển thị ký hiệu `₫`. | **PASS** | Hiển thị đúng định dạng `... ₫`. |
| 4 | IA-01 | Căn thẳng hàng nút bấm trên lưới sản phẩm | Các nút "Xem chi tiết" và "Thêm vào giỏ" trên cùng một hàng luôn nằm thẳng tắp trên trục ngang. | **FAIL** | Khi tên sản phẩm dài 2 dòng làm lệch chiều cao card, nút bấm bị trồi sụt không thẳng hàng. |
| 5 | IA-01 | Màu sắc nút "Thêm vào giỏ hàng" | Nút hành động chính phải dùng màu xanh dương chuẩn theo thiết kế. | **FAIL** | Nút "Thêm vào giỏ hàng" ở trang Product Detail dùng màu xanh lá (`bg-green-600`), ở card Home dùng xanh dương (`bg-blue-600`) $\rightarrow$ Không nhất quán bảng màu. |
| **II** | **IA-02** | **Forms & Controls** | | | |
| 6 | IA-02 | Ô nhập tìm kiếm sản phẩm (Search Input) | Ô tìm kiếm có placeholder gợi ý rõ ràng và hỗ trợ phím Enter để kích hoạt tìm kiếm. | **PASS** | Có placeholder "Tìm kiếm..." và form submit bằng Enter hoạt động tốt. |
| 7 | IA-02 | Ràng buộc số lượng (Product Detail) | Ô nhập số lượng chỉ nhận số nguyên dương $\ge 1$, không cho nhập số âm hoặc số 0. | **FAIL** | Ô số lượng thiếu thuộc tính `min="1"`, cho phép người dùng gõ số 0 hoặc số âm. |
| 8 | IA-02 | Hiển thị an toàn từ khóa tìm kiếm (XSS) | Từ khóa tìm kiếm hiển thị trên giao diện phải được escape an toàn, không render mã HTML. | **FAIL** | Sử dụng `<span dangerouslySetInnerHTML={{ __html: search }} />`, gây nguy cơ XSS khi tìm kiếm chuỗi HTML/script. |
| **III**| **IA-03** | **Navigation** | | | |
| 9 | IA-03 | Huy hiệu giỏ hàng trên Header toàn cục | Link "Giỏ hàng" trên Header phải có badge số lượng hiển thị tổng số món hàng hiện có. | **FAIL** | Header toàn cục chỉ hiển thị chữ "Giỏ hàng", hoàn toàn thiếu badge số lượng (vi phạm FR-23). |
| 10 | IA-03 | Nhãn nút Đăng xuất trên Header | Nút đăng xuất của người dùng đã đăng nhập phải mang nhãn "Đăng xuất". | **FAIL** | Nút trên Header mang nhãn "Thoát" thay vì "Đăng xuất" (vi phạm FR-23). |
| 11 | IA-03 | Highlight trang hiện tại trên Navbar | Menu Header phải highlight trang đang xem (Active state) để người dùng định vị. | **FAIL** | Header không áp dụng class active/highlight cho bất kỳ link nào (Home/Giỏ hàng). |
| 12 | IA-03 | Breadcrumbs trang Chi tiết sản phẩm | Trang Product Detail bắt buộc có thanh Breadcrumbs `Trang chủ / [Danh mục] / [Tên SP]`. | **FAIL** | Trang Chi tiết sản phẩm hoàn toàn thiếu Breadcrumbs điều hướng (vi phạm FR-23). |
| **IV** | **IA-04** | **Feedback & State** | | | |
| 13 | IA-04 | Độ nhạy nút "Thêm vào giỏ hàng" (Product Detail) | Bấm nút "Thêm vào giỏ hàng" phải nhận phản hồi ngay ở lần click đầu tiên. | **FAIL** | Cài đặt logic chặn `clickCount === 0`, click lần 1 không có phản ứng, phải click lần 2 mới thực hiện (Lỗi State/Logic nghiêm trọng). |
| 14 | IA-04 | Phản hồi thị giác khi Thêm giỏ ở trang Home | Bấm nút "Thêm vào giỏ" trực tiếp trên card sản phẩm phải hiển thị Toast/Badge cập nhật. | **FAIL** | Không có bất kỳ Toast notification hoặc hiệu ứng thị giác nào, người dùng không biết đã thêm thành công hay chưa. |
| 15 | IA-04 | Trạng thái rỗng khi tìm kiếm không ra kết quả | Khi tìm kiếm từ khóa không có sản phẩm, phải hiển thị empty state có minh họa và thông báo rõ ràng. | **FAIL** | Màn hình chỉ để trống lưới sản phẩm, không có thông báo "Không tìm thấy sản phẩm phù hợp" hay hình minh họa (vi phạm FR-05 & FR-24). |
| 16 | IA-04 | Trạng thái Loading khi tải danh sách sản phẩm | Trong lúc đang fetch dữ liệu sản phẩm từ API, giao diện phải hiển thị spinner/skeleton loading. | **FAIL** | Thiếu hẳn trạng thái loading trên Web, màn hình bị chớp giật khi chuyển trang (vi phạm FR-05). |
| 17 | IA-04 | Thuộc tính Alt của hình ảnh sản phẩm | Tất cả ảnh sản phẩm phải có thuộc tính `alt` mô tả tên sản phẩm, không để rỗng. | **FAIL** | Thẻ ảnh trên card sản phẩm để rỗng `alt=""` (vi phạm FR-24 & tiêu chuẩn Accessibility). |
