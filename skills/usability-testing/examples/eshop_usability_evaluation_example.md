# Ví dụ Thực tế Đánh giá Khả năng Sử dụng cho EShop SUT (Phân hệ Thành viên M2)

**Phạm vi phân công (M2 Scope):**
- **Luồng Usability F2:** Tìm sản phẩm theo nhu cầu $\rightarrow$ Xem thông tin chi tiết $\rightarrow$ Thêm vào giỏ hàng (Bao phủ FR-05 & FR-06 trên nền tảng Web).
- **Mục tiêu đánh giá:** Đánh giá độ trực quan của tính năng tìm kiếm, khả năng nhận diện thông tin sản phẩm, và sự mượt mà/độ nhạy khi người dùng thao tác thêm sản phẩm vào giỏ hàng.

---

## 1. Kịch bản Nhiệm vụ Mục tiêu (Goal-Oriented Task Scenario)

> [!IMPORTANT]
> **Kịch bản giao cho Tester (Không hướng dẫn từng bước):**  
> *"Bạn đang có nhu cầu tìm mua một chiếc 'Áo thun' trên website EShop để mặc đi chơi với bạn bè. Bạn hãy truy cập website, tìm kiếm sản phẩm áo thun ưng ý, xem kỹ các thông tin chi tiết (giá cả, chất liệu/mô tả), chọn số lượng là 2 cái và thêm sản phẩm đó vào giỏ hàng của bạn."*

---

## 2. Kết quả Đo lường Định lượng (Tổng hợp từ 7 Người dùng Mẫu trên Luồng F2)

- **Tỷ lệ hoàn thành tác vụ (Task Success Rate):** 6 / 7 người hoàn thành (85.7%).
- **Thời gian trung bình hoàn thành (Average Time on Task):** 3 phút 15 giây (Thời gian chuẩn dự kiến: 1 phút 30 giây $\rightarrow$ Bị đội thời gian do nút thêm giỏ bấm lần đầu không ăn).
- **Điểm SUS Trung bình (Average SUS Score):** **56.5 / 100** (Xếp loại D - Dưới trung bình, gây nhiều ức chế ở khâu thao tác giỏ hàng).

| STT | Người tham gia | Thời gian (phút) | Lỗi vấp phải (Error count) | Điểm SUS (/100) | Nhận xét thực tế của người dùng (Think-Aloud) |
| :-: | :--- | :---: | :---: | :---: | :--- |
| 1 | P1 (Nhân viên văn phòng) | 3m 40s | 2 | 57.5 | *"Tôi bấm nút 'Thêm vào giỏ hàng' rồi mà không thấy giỏ hàng nhảy số, tưởng mạng bị đơ nên phải bấm lại lần nữa."* |
| 2 | P2 (Sinh viên khác ngành) | 2m 20s | 1 | 62.5 | Thao tác tìm kiếm nhanh, nhưng bối rối vì không có thanh Breadcrumb để bấm quay lại trang danh mục. |
| 3 | P3 (Kinh doanh tự do) | 4m 10s | 3 | 50.0 | *"Tìm thử từ khóa 'áo polo' không ra sản phẩm nào nhưng màn hình trắng trơn, không có câu báo gì làm tưởng web bị lỗi."* |
| 4 | P4 (Kế toán) | 3m 30s | 2 | 55.0 | Ô số lượng cho phép gõ số âm, bấm thêm giỏ hàng không có thông báo toast chúc mừng thành công. |
| 5 | P5 (Nội trợ) | 4m 30s | 3 | 47.5 | *"Không biết sản phẩm đã vào giỏ chưa vì nhìn lên góc trên bên phải không thấy có số lượng giỏ hàng như các web khác."* |
| 6 | P6 (Lập trình viên ngoài ngành)| 2m 10s | 1 | 67.5 | Phát hiện ngay nút thêm giỏ hàng bị 'dead click' ở lần đầu tiên do lỗi code, phải double click. |
| 7 | P7 (Giáo viên) | 3m 25s | 2 | 55.5 | Giao diện đơn giản dễ đọc, nhưng nút Thêm giỏ hàng màu xanh lá cây hơi chói và không ăn nút lần đầu. |

---

## 3. Phân loại Khuyết điểm Khả dụng theo 10 Heuristic của Jakob Nielsen

1. **Khuyết điểm Nghiêm trọng (Blocker / Major):**
   - **Nút "Thêm vào giỏ hàng" bị Dead Click ở lần bấm đầu (7/7 người vấp phải):**
     - *Vi phạm:* **Heuristic 1 (Visibility of system status)** & **Heuristic 3 (User control and freedom)**.
     - *Hệ quả:* 100% người dùng tưởng hệ thống bị lag hoặc không nhận lệnh, dẫn đến việc phải bấm liên tục nhiều lần.
   - **Header thiếu Cart Badge đếm số lượng (6/7 người phản ánh):**
     - *Vi phạm:* **Heuristic 1 (Visibility of system status)** & **Heuristic 4 (Consistency and standards)**.
     - *Hệ quả:* Sau khi thêm giỏ, người dùng không có căn cứ trực quan để biết giỏ hàng đã có bao nhiêu sản phẩm.

2. **Khuyết điểm Trung bình (Major / Minor):**
   - **Empty State khi tìm kiếm không có kết quả bị trắng trơn (5/7 người nhận diện):**
     - *Vi phạm:* **Heuristic 9 (Help users recognize, diagnose, and recover from errors)**.
     - *Hệ quả:* Khi gõ từ khóa không có hàng, lưới sản phẩm rỗng không có thông báo hay gợi ý tìm từ khóa khác.
   - **Thiếu thanh điều hướng Breadcrumbs tại trang Product Detail (4/7 người nhận diện):**
     - *Vi phạm:* **Heuristic 3 (User control and freedom)** & **Heuristic 7 (Flexibility and efficiency of use)**.
     - *Hệ quả:* Người dùng phải bấm nút Back của trình duyệt hoặc bấm lại logo EShop để quay về danh sách.
   - **Ô nhập số lượng cho phép nhập giá trị không hợp lệ (số âm, số 0) (4/7 người nhận diện):**
     - *Vi phạm:* **Heuristic 5 (Error prevention)**.
     - *Hệ quả:* Không có ràng buộc chặn người dùng nhập số lượng vô nghĩa.
