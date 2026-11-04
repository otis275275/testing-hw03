# Usability Evaluation Protocol Template (Phân hệ Thành viên M2)

## 1. Thông tin Kế hoạch & Phiên Kiểm thử

- **Dự án SUT:** EShop E-commerce Platform (Web Frontend).
- **Phân công thành viên:** **M2**.
- **Luồng tác vụ đánh giá (End-to-End Flow F2):**  
  **Tìm sản phẩm theo nhu cầu $\rightarrow$ Xem thông tin chi tiết $\rightarrow$ Thêm vào giỏ hàng $\rightarrow$ Vào trang giỏ hàng chỉ để xác minh (Verify) sản phẩm đã được thêm.**
- **Ranh giới tác vụ (Scope Boundary):**  
  > [!IMPORTANT]
  > Tác vụ kết thúc ngay khi người dùng kiểm tra trạng thái sản phẩm trong giỏ hàng. Người dùng **hoàn toàn không thực hiện** các thao tác chỉnh sửa giỏ hàng (tăng giảm số lượng, xóa sản phẩm, nhập coupon hay thanh toán checkout). Ranh giới này đảm bảo độc lập 100% với phân công của thành viên phụ trách Cart/Checkout.
- **Kịch bản mục tiêu giao cho Tester (Goal Scenario):**  
  *"Bạn đang cần mua 2 chiếc áo thun để mặc đi chơi cùng bạn bè vào cuối tuần. Hãy truy cập website EShop, tìm kiếm một mẫu áo thun bạn thích, xem kỹ thông tin chi tiết, thêm 2 sản phẩm vào giỏ hàng và **xác nhận rằng sản phẩm đã được lưu trong giỏ hàng của bạn**."*
- **Thời lượng dự kiến:** 10 – 15 phút / người.

---

## 2. Bảng Danh sách 7 Người tham gia (Thực tế, Ngoài lớp học)

> [!CAUTION]
> Để tuân thủ quy định chống gian lận (Anti-Cheat), thông tin liên hệ bắt buộc che 4 số ở giữa (ví dụ: `0912***789`), người tham gia phải là người thật ngoài lớp học HW03.

| # | Họ và tên | Nghề nghiệp / Vai trò | Nhóm đối tượng | Thông tin liên hệ (Zalo / SĐT) | Ngày & Giờ test | Kênh thực hiện (In-person / Google Meet) |
| :-: | :--- | :--- | :--- | :--- | :---: | :---: |
| Pilot | [Họ tên Tester Pilot] | [Nghề nghiệp] | Non-IT | `090x***123` | YYYY-MM-DD HH:mm | Trực tiếp |
| P1 | [Họ tên P1] | [Nghề nghiệp] | Non-IT | `091x***456` | YYYY-MM-DD HH:mm | Google Meet |
| P2 | [Họ tên P2] | [Nghề nghiệp] | Sinh viên khác ngành | `098x***789` | YYYY-MM-DD HH:mm | Trực tiếp |
| P3 | [Họ tên P3] | [Nghề nghiệp] | Non-IT | `097x***012` | YYYY-MM-DD HH:mm | Google Meet |
| P4 | [Họ tên P4] | [Nghề nghiệp] | Nhân viên văn phòng | `093x***345` | YYYY-MM-DD HH:mm | Trực tiếp |
| P5 | [Họ tên P5] | [Nghề nghiệp] | Nội trợ / Tự do | `094x***678` | YYYY-MM-DD HH:mm | Google Meet |
| P6 | [Họ tên P6] | [Nghề nghiệp] | Kế toán / Kinh doanh | `096x***901` | YYYY-MM-DD HH:mm | Trực tiếp |
| P7 | [Họ tên P7] | [Nghề nghiệp] | Kỹ sư ngoài ngành IT | `092x***234` | YYYY-MM-DD HH:mm | Google Meet |

---

## 3. Nhật ký Quan sát Thực địa (Observation Log per Participant)

### Người tham gia: [Tên Tester - Px]
- **Thời gian hoàn thành tác vụ (Time on task):** [Ví dụ: 3 phút 20 giây]
- **Trạng thái hoàn thành (Task Completion):** [Thành công hoàn toàn / Thành công có trợ giúp / Thất bại]
- **Điểm đánh giá độ dễ (SEQ 1-7):** [/ 7]

| Mốc thời gian | Hành động của người dùng | Lời nói / Cảm xúc (Think-Aloud) | Điểm nghẽn / Khó khăn nhận diện (Friction Point) |
| :---: | :--- | :--- | :--- |
| `00:30` | Nhập từ khóa tìm kiếm "áo thun" | *"Gõ tìm kiếm xong bấm Enter là tìm được ngay, khá nhanh."* | Hành vi tìm kiếm mượt mà. |
| `01:15` | Chọn xem sản phẩm và chỉnh số lượng | *"Ủa ô số lượng này sao gõ được số âm với số 0 luôn nè?"* | Ô số lượng thiếu validation `min="1"`. |
| `01:45` | Bấm nút "Thêm vào giỏ hàng" lần đầu | *"Ủa sao bấm nút rồi mà không thấy hiện thông báo gì hết, cũng không thấy giỏ hàng nhảy số?"* | Nút bị lỗi dead-click lần 1, Header thiếu badge. |
| `02:20` | Bấm vào link "Giỏ hàng" trên Header | *"Để vào giỏ hàng xem thử có chưa... Ơ sao giỏ hàng trống trơn thế này?"* | Người dùng phát hiện hàng chưa vào giỏ, phải quay lại bấm lần 2. |
| `03:00` | Quay lại Product Detail bấm lần 2, rồi vào lại Giỏ hàng | *"À giờ mới thấy có sản phẩm trong giỏ hàng rồi nè."* | Tác vụ kết thúc thành công sau khi xác minh có hàng trong giỏ. |

---

## 4. Tổng hợp Điểm Thang đo SUS (System Usability Scale)

| Participant | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Điểm SUS (/100) | Xếp loại (Grade) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| P1 | | | | | | | | | | | | |
| P2 | | | | | | | | | | | | |
| P3 | | | | | | | | | | | | |
| P4 | | | | | | | | | | | | |
| P5 | | | | | | | | | | | | |
| P6 | | | | | | | | | | | | |
| P7 | | | | | | | | | | | | |
| **Trung bình** | | | | | | | | | | | **[Điểm TB]** | **[Grade]** |

---

## 5. Tổng hợp Vấn đề Khả dụng & Xếp hạng Nghiêm trọng (Severity Ranking)

| ID | Vấn đề Khả dụng phát hiện | Tần suất xuất hiện (x/7) | Mức độ nghiêm trọng (Severity) | Vi phạm Heuristic | Đề xuất khắc phục giao diện |
| :-: | :--- | :---: | :---: | :--- | :--- |
| U-01 | Nút Thêm vào giỏ bị Dead Click ở lần bấm đầu | 7/7 | **Blocker / Major** | Heuristic 1: Visibility of system status | Bỏ logic `clickCount === 0`, kích hoạt thêm giỏ ngay trong lần đầu. |
| U-02 | Header toàn cục thiếu badge đếm số lượng giỏ hàng | 6/7 | **Major** | Heuristic 1: Visibility of system status | Bổ sung badge số lượng tròn đỏ/vàng trên icon Giỏ hàng. |
| U-03 | Empty State khi tìm kiếm không có kết quả bị trắng trơn | 5/7 | **Major** | Heuristic 9: Help users recognize & recover | Bổ sung minh họa và câu thông báo "Không tìm thấy sản phẩm phù hợp". |
| U-04 | Thiếu Breadcrumbs điều hướng trên Product Detail | 4/7 | **Minor** | Heuristic 3: User control & freedom | Bổ sung thanh điều hướng `Trang chủ / Tên sản phẩm`. |
| U-05 | Ô số lượng cho phép nhập số âm và số 0 | 4/7 | **Minor** | Heuristic 5: Error prevention | Thêm ràng buộc `min="1"` và `type="number"`. |
