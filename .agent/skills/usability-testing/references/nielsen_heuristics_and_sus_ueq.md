# Chi tiết 10 Nguyên tắc Heuristic & Bảng Câu hỏi Chuẩn SUS / UEQ-S

## 1. Mười Nguyên tắc Heuristic của Jakob Nielsen

1. **Hiển thị trạng thái hệ thống (Visibility of system status)**: Cung cấp phản hồi kịp thời cho mọi thao tác. Ví dụ: khi click nút "Thanh toán", hiển thị icon spinner loading hoặc trạng thái "Đang xử lý đơn hàng".
2. **Tương thích giữa hệ thống và thế giới thực (Match between system and real world)**: Sử dụng các thuật ngữ, khái niệm quen thuộc trong thương mại điện tử đời sống thay vì thuật ngữ kỹ thuật (ví dụ: dùng "Giỏ hàng", "Mã giảm giá", "Tổng tiền" thay vì "Cart Object", "Coupon Entity", "Payload Total").
3. **Người dùng được kiểm soát và tự do (User control and freedom)**: Cho phép hủy đơn hàng đang chờ duyệt, nút "Quay lại trang chủ" sau khi thanh toán, và dialog hỏi xác nhận trước khi xóa món hàng khỏi giỏ.
4. **Nhất quán và tuân thủ chuẩn (Consistency and standards)**: Màu sắc nút hành động đồng nhất (xanh dương cho thao tác chính, đỏ cho thao tác nguy hiểm); đơn vị tiền tệ thống nhất `₫` trên mọi màn hình.
5. **Phòng ngừa lỗi (Error prevention)**: Giới hạn số lượng trong giỏ hàng $\ge 1$; chỉ cho phép nhập số vào trường số điện thoại; tự động chuyển mã coupon sang chữ in hoa.
6. **Nhận biết thay vì ghi nhớ (Recognition rather than recall)**: Hiển thị tóm tắt danh sách sản phẩm và tổng tiền ngay tại trang Checkout để người dùng không cần phải quay lại giỏ hàng kiểm tra.
7. **Linh hoạt và hiệu quả sử dụng (Flexibility and efficiency of use)**: Cho phép chuyển trang nhanh qua Breadcrumbs; hỗ trợ phím Enter để tìm kiếm hoặc submit form.
8. **Thiết kế tối giản và thẩm mỹ (Aesthetic and minimalist design)**: Loại bỏ các thẻ thông tin thừa hoặc các đường viền gây rối mắt; hiển thị các thông tin quan trọng nhất ở vị trí trung tâm.
9. **Giúp người dùng nhận biết, chẩn đoán và khắc phục lỗi (Help users recognize, diagnose, and recover from errors)**: Khi coupon hết hạn, ghi rõ *"Mã giảm giá đã hết hạn sử dụng vào ngày DD/MM/YYYY"* thay vì chỉ báo chung chung *"Lỗi cú pháp"*.
10. **Trợ giúp và tài liệu hướng dẫn (Help and documentation)**: Gợi ý các mã giảm giá có sẵn hoặc giải thích quy định áp dụng mã ngay tại bước checkout.

---

## 2. Bảng 10 Câu hỏi Chuẩn SUS (System Usability Scale)

| STT | Nội dung câu hỏi khảo sát | Loại câu hỏi | Điểm Likert (1 - 5) |
| :-: | :--- | :---: | :---: |
| Q1 | Tôi nghĩ rằng tôi sẽ thích sử dụng hệ thống này thường xuyên. | Tích cực (Lẻ) | 1 2 3 4 5 |
| Q2 | Tôi thấy hệ thống này phức tạp một cách không cần thiết. | Tiêu cực (Chẵn) | 1 2 3 4 5 |
| Q3 | Tôi thấy hệ thống này dễ sử dụng. | Tích cực (Lẻ) | 1 2 3 4 5 |
| Q4 | Tôi nghĩ rằng tôi sẽ cần sự hỗ trợ của một chuyên gia kỹ thuật để có thể sử dụng hệ thống này. | Tiêu cực (Chẵn) | 1 2 3 4 5 |
| Q5 | Tôi thấy các chức năng khác nhau trong hệ thống này được tích hợp rất tốt. | Tích cực (Lẻ) | 1 2 3 4 5 |
| Q6 | Tôi nghĩ rằng có quá nhiều điều không nhất quán trong hệ thống này. | Tiêu cực (Chẵn) | 1 2 3 4 5 |
| Q7 | Tôi tưởng tượng rằng hầu hết mọi người sẽ học cách sử dụng hệ thống này rất nhanh chóng. | Tích cực (Lẻ) | 1 2 3 4 5 |
| Q8 | Tôi thấy hệ thống này rất rườm rà và cồng kềnh khi sử dụng. | Tiêu cực (Chẵn) | 1 2 3 4 5 |
| Q9 | Tôi cảm thấy rất tự tin khi sử dụng hệ thống này. | Tích cực (Lẻ) | 1 2 3 4 5 |
| Q10 | Tôi cần phải học rất nhiều điều trước khi có thể sử dụng thành thạo hệ thống này. | Tiêu cực (Chẵn) | 1 2 3 4 5 |

**Quy tắc chấm điểm:**
- Điểm câu lẻ = Điểm đánh giá - 1
- Điểm câu chẵn = 5 - Điểm đánh giá
- Tổng điểm = (Tổng điểm 10 câu) $\times$ 2.5

