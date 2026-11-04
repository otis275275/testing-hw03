# GUI Checklist Template (Dành cho Thành viên M2)

**Dự án:** EShop SUT (Web E-Commerce Platform)  
**Màn hình kiểm thử chính (Primary Screen):** Trang Home (Danh sách sản phẩm + Thanh tìm kiếm, Web)  
**Màn hình / Thành phần phụ trợ (Secondary & Global):** Trang Chi tiết sản phẩm (Product Detail), Header & Footer toàn cục  
**Người kiểm thử:** [Họ và Tên Tester / MSSV]  
**Ngày thực hiện:** [YYYY-MM-DD]  
**Nền tảng kiểm thử:** [Ví dụ: Chrome v124 (Windows 11) / Firefox v125 / Android Chrome]

> [!IMPORTANT]
> **Ràng buộc phân công nhóm (Scope Boundary - Anti Duplication):**  
> - Bảng checklist này **TUYỆT ĐỐI KHÔNG** bao gồm các phần tử trên màn hình Giỏ hàng (`/cart`) như: bảng giỏ hàng, nút tăng/giảm (+/-) số lượng, nút xóa sản phẩm, tổng tiền giỏ hàng, nút Checkout. Toàn bộ các phần tử đó thuộc phân công của thành viên khác trong nhóm.  
> - Checklist tập trung 100% vào: **Trang Home**, **Trang Product Detail**, và **Header / Footer toàn cục**, đảm bảo bao phủ > 40 mục trên 4 khía cạnh IA-01, IA-02, IA-03, IA-04.

---

## 1. Bảng Tổng quan Kết quả Thực thi

| Tổng số mục kiểm tra | Đạt (Passed) | Không đạt (Failed) | Chưa áp dụng (N/A) | Tỷ lệ Đạt (Pass Rate) |
| :---: | :---: | :---: | :---: | :---: |
| 0 | 0 | 0 | 0 | 0.0% |

---

## 2. Bảng GUI Checklist Chi tiết

> **Hướng dẫn chấm:** Đánh dấu `☒` vào cột **Pass** hoặc **Fail**. Đối với các mục **Fail**, ghi rõ mô tả lỗi thực tế và mã ảnh bằng chứng vào cột **Notes / Evidence**.

| # | Khía cạnh (Category) | Thành phần (Checkpoint) | Tiêu chí kiểm chứng (Verification criteria)<br>*(Thành phần + Thao tác + Kết quả mong đợi)* | Pass | Fail | Ghi chú & Bằng chứng (Notes / Evidence) |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| **I** | **IA-01: GENERAL UI STANDARDS** | | | | | |
| 1 | IA-01 | Số lượng thẻ `<h1>` trên trang Home | Trang Home chỉ tồn tại duy nhất 1 thẻ `<h1>` mô tả trang ("Danh sách sản phẩm"). | ☐ | ☐ | |
| 2 | IA-01 | Số lượng thẻ `<h1>` trên Product Detail | Trang Product Detail chỉ có đúng 1 thẻ `<h1>` hiển thị tên sản phẩm. | ☐ | ☐ | |
| 3 | IA-01 | Ký hiệu đơn vị tiền tệ trên card Home | Mọi giá bán trên card sản phẩm hiển thị ký hiệu `₫` chuẩn và có phân cách hàng nghìn (ví dụ: `150.000 ₫`), không dùng `VND`. | ☐ | ☐ | |
| 4 | IA-01 | Ký hiệu đơn vị tiền tệ trên Product Detail | Giá sản phẩm trên trang Product Detail hiển thị ký hiệu `₫` phân cách hàng nghìn. | ☐ | ☐ | |
| 5 | IA-01 | Màu sắc nút Thêm giỏ hàng (Home vs Detail) | Màu sắc nút "Thêm vào giỏ" phải đồng nhất một mã màu xanh dương chuẩn theo thiết kế, không đổi sang màu xanh lá. | ☐ | ☐ | |
| 6 | IA-01 | Căn thẳng hàng nút bấm trên lưới sản phẩm | Các nút "Xem chi tiết" và "Thêm vào giỏ" trên cùng một hàng luôn nằm thẳng tắp trên trục ngang, không bị lệch khi tên sản phẩm dài. | ☐ | ☐ | |
| 7 | IA-01 | Tránh thanh cuộn ngang ngoài ý muốn | Giao diện trang Home và Product Detail không làm xuất hiện thanh cuộn ngang (`overflow-x`) trên các độ phân giải màn hình chuẩn. | ☐ | ☐ | |
| **II** | **IA-02: FORMS & CONTROLS** | | | | | |
| 8 | IA-02 | Placeholder ô tìm kiếm sản phẩm | Ô tìm kiếm có placeholder gợi ý rõ ràng ("Tìm kiếm...") và tự động xóa khi bắt đầu gõ. | ☐ | ☐ | |
| 9 | IA-02 | Phím Enter kích hoạt tìm kiếm | Nhấn phím Enter khi con trỏ đang ở ô tìm kiếm sẽ kích hoạt tìm kiếm mà không cần phải click chuột vào nút "Tìm". | ☐ | ☐ | |
| 10 | IA-02 | Ràng buộc ô nhập số lượng (Product Detail) | Ô nhập số lượng chỉ nhận số nguyên dương $\ge 1$, chặn nhập số âm, số 0 hoặc chữ cái. | ☐ | ☐ | |
| 11 | IA-02 | Hiển thị an toàn từ khóa tìm kiếm (XSS) | Từ khóa tìm kiếm hiển thị trên màn hình kết quả được escape an toàn, không render mã HTML/JavaScript độc hại. | ☐ | ☐ | |
| 12 | IA-02 | Thứ tự phím Tab trên trang Home | Nhấn phím Tab di chuyển tuần tự qua thanh tìm kiếm, nút Tìm, rồi lần lượt qua từng card sản phẩm theo thứ tự hợp lý. | ☐ | ☐ | |
| **III**| **IA-03: NAVIGATION** | | | | | |
| 13 | IA-03 | Highlight trang hiện tại trên Navbar | Menu Header highlight rõ nét trang đang xem (ví dụ: highlight link Home khi đang ở trang chủ). | ☐ | ☐ | |
| 14 | IA-03 | Huy hiệu giỏ hàng trên Header (Cart Badge) | Link "Giỏ hàng" trên Header luôn hiển thị badge tròn đếm tổng số lượng món hàng hiện có trong giỏ. | ☐ | ☐ | |
| 15 | IA-03 | Nhãn nút Đăng xuất của tài khoản | Nút thoát phiên đăng nhập của người dùng mang nhãn "Đăng xuất" rõ ràng (không dùng "Thoát"). | ☐ | ☐ | |
| 16 | IA-03 | Logo dẫn về Trang chủ | Click vào logo "EShop" ở góc trái Header luôn điều hướng an toàn về lại trang chủ `/`. | ☐ | ☐ | |
| 17 | IA-03 | Thanh Breadcrumbs trên Product Detail | Trang Chi tiết sản phẩm có Breadcrumbs với định dạng chuẩn `Trang chủ / [Tên SP]`, mục cuối là text tĩnh không click được. | ☐ | ☐ | |
| **IV** | **IA-04: FEEDBACK & STATE** | | | | | |
| 18 | IA-04 | Độ nhạy nút Thêm giỏ hàng (Product Detail) | Bấm nút "Thêm vào giỏ hàng" tại Product Detail phải nhận lệnh và phản hồi ngay ở lần click đầu tiên. | ☐ | ☐ | |
| 19 | IA-04 | Phản hồi thị giác khi thêm giỏ hàng (Home) | Bấm nút "Thêm vào giỏ" trên card sản phẩm ở trang Home phải hiển thị Toast notification hoặc cập nhật số badge tức thì. | ☐ | ☐ | |
| 20 | IA-04 | Empty State khi tìm kiếm không ra kết quả | Khi tìm kiếm từ khóa không có sản phẩm, trang Home hiển thị hình minh họa thân thiện và thông báo "Không tìm thấy sản phẩm phù hợp". | ☐ | ☐ | |
| 21 | IA-04 | Trạng thái Loading khi tải danh sách sản phẩm | Trong lúc fetch dữ liệu sản phẩm từ API, hiển thị biểu tượng loading spinner hoặc khung xương (skeleton screen). | ☐ | ☐ | |
| 22 | IA-04 | Thuộc tính Alt của hình ảnh sản phẩm | Tất cả hình ảnh sản phẩm trên trang Home và Product Detail đều có thuộc tính `alt` mô tả tên sản phẩm, không để rỗng. | ☐ | ☐ | |

---

## 3. Nhật ký Bổ sung của Con người (Human Refinements)
*Liệt kê các mục kiểm tra mà AI đã bỏ sót kèm lý do giải thích chi tiết:*

1. **[Mục X]**: [Tên mục]  
   - *Lý do AI bỏ sót:* [Do AI chỉ quét cấu trúc DOM tĩnh mà bỏ qua logic click đúp / bẫy XSS / chuẩn WCAG / ...]
