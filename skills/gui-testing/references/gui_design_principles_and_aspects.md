# GUI Design Principles & Interface Aspects (Reference)

## 1. Ba Nguyên tắc Thiết kế Giao diện Người dùng (Theo Seminar Nhóm 05)

### 1.1 Consistency (Tính Nhất Quán)
- **Visual Consistency**: Phông chữ, kích thước chữ (typography hierarchy: h1, h2, h3, body, caption), bảng màu (chủ đạo, cảnh báo, thành công, nguy hiểm), viền bo góc (`rounded`), khoảng cách (spacing grid: 4px, 8px, 16px, 24px) phải đồng nhất trên tất cả màn hình.
- **Data Formatting Consistency**: Đơn vị tiền tệ chuẩn `100.000 ₫` (dấu chấm hàng nghìn, khoảng trắng, ký hiệu `₫`), ngày tháng chuẩn (`DD/MM/YYYY` hoặc `YYYY-MM-DD`), định dạng số điện thoại.
- **Language & Tone Consistency**: Ngôn ngữ toàn bộ hệ thống phải thống nhất một ngôn ngữ (tiếng Việt cho EShop). Không trộn lẫn tiếng Anh vào các nút lệnh hoặc thông báo.

### 1.2 Error Prevention (Chủ động Ngăn ngừa Lỗi)
- **Input Constraints**: Ô số điện thoại chỉ nhận chữ số; ô số lượng chỉ nhận số nguyên dương $\ge 1$; ô ngày hết hạn hiển thị placeholder hoặc datepicker chuẩn.
- **Destructive Safeguards**: Mọi hành động làm mất mát dữ liệu hoặc không thể hoàn tác (Xóa sản phẩm khỏi giỏ, Hủy đơn hàng, Xóa tài khoản người dùng) bắt buộc phải có bước xác nhận (Confirm Dialog).
- **Proactive Validation**: Cảnh báo lỗi inline theo thời gian thực hoặc kiểm tra ngay trước khi submit, vô hiệu hóa nút hành động khi biểu mẫu chưa thỏa mãn điều kiện bắt buộc.

### 1.3 System Feedback (Phản hồi Hệ thống)
- **Immediate Response (0.1s - 1s)**: Mọi tương tác của người dùng cần có phản hồi thị giác:
  - Nút bấm có trạng thái `hover`, `active`, `focus`.
  - Khi request đang xử lý: chuyển nút sang `disabled`, hiển thị biểu tượng loading xoay hoặc con trỏ `wait`.
  - Khi hoàn thành: hiển thị thông báo kết quả (Toast, Alert, Badge nhảy số).

---

## 2. Bốn Khía cạnh Giao diện (Interface Aspects - IA) theo Đề bài HW03

| Aspect ID | Tên khía cạnh | Phạm vi kiểm tra cụ thể |
| :--- | :--- | :--- |
| **IA-01** | General UI Standards | Căn lề lưới (Alignment), khoảng cách đều nhau, màu sắc nút phân cấp rõ ràng (xanh = tích cực, đỏ = nguy hiểm), hiển thị thẻ tiêu đề duy nhất `<h1>`, độ co giãn khi thay đổi kích thước cửa sổ. |
| **IA-02** | Forms & Controls | Dấu sao `*` cho trường bắt buộc, kiểu thẻ input đúng chuẩn (`type="email"`, `type="password"`), tab order tuần tự hợp lý, thông báo lỗi đặt phía trên nút submit, step indicator cho form nhiều bước. |
| **IA-03** | Navigation | Thanh menu đánh dấu trang hiện tại (active state), icon giỏ hàng có badge hiển thị số lượng item, nhãn nút Đăng xuất chuẩn xác, breadcrumbs điều hướng đa cấp trên các trang con. |
| **IA-04** | Feedback / State | Toast/Badge sau khi thêm vào giỏ hàng, dialog xác nhận trước khi xóa, màn hình empty state có minh họa trực quan, ảnh sản phẩm có alt text đầy đủ, khóa nút chống double click. |

---

## 3. Ranh giới của GUI Automation (Record & Playback vs Assertions)
- **Nên tự động hóa**: Các luồng nghiệp vụ lặp đi lặp lại nhiều lần (Đăng ký, Đăng nhập, Checkout); kiểm tra hồi quy sau khi sửa mã nguồn; kiểm thử nhiều bộ dữ liệu (Data-driven testing).
- **Không nên tự động hóa 100%**: Đánh giá cảm xúc và độ thẩm mỹ của giao diện; kiểm tra lỗi bố cục tinh vi (visual overlap, font rendering); đánh giá độ mượt mà và trực quan của trải nghiệm người dùng.

