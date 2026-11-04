# Usability Testing (Kiểm thử khả năng sử dụng)

**Môn học:** Kiểm thử phần mềm  
**Nhóm:** 07  

---

## Slide 1: Trang bìa
* **Tiêu đề:** Usability Testing - Kiểm thử khả năng sử dụng
* **Trình bày bởi:** Nhóm 07
* **Môn học:** Kiểm thử phần mềm

---

## Slide 2: 1. Khái niệm
* **Usability Testing (Kiểm thử khả năng sử dụng):** Là một phương pháp quan trọng trong thiết kế và phát triển sản phẩm, nhằm đánh giá mức độ thân thiện và hiệu quả của sản phẩm khi người dùng tương tác.
* **Trả lời cho câu hỏi:** “Sản phẩm này có trực quan, thân thiện và hoạt động hiệu quả với người dùng thực tế?”

---

## Slide 3: 2. Phân biệt với GUI Testing
> *"GUI Testing kiểm tra ứng dụng đúng hay sai, còn Usability Testing kiểm tra ứng dụng dễ hay khó dùng."*

| Tiêu chí | GUI Testing | Usability Testing |
| :--- | :--- | :--- |
| **Trọng tâm** | Đúng quy cách kỹ thuật & Thiết kế | Trải nghiệm & Sự hài lòng người dùng |
| **Thực hiện** | Developers / QA Testers | Người dùng thực tế (End-users) / UX |
| **Phương pháp** | Công cụ tự động & Script kiểm tra UI | Quan sát hành vi & Thu thập phản hồi |
| **Đầu ra** | Bug kỹ thuật | Khó khăn, điểm nghẽn của người dùng |
| **Mục tiêu** | Giao diện chạy đúng thiết kế | Giao diện thân thiện & dễ dùng |

---

## Slide 4: 3. Tiêu chuẩn Quốc tế ISO 9241-11
Tính khả dụng (Usability) của phần mềm được đo lường qua 3 yếu tố chính:
* **Hiệu quả (Effectiveness):** Hoàn thành nhiệm vụ đúng và đầy đủ không?
* **Hiệu suất (Efficiency):** Tốn bao nhiêu thời gian, công sức?
* **Sự hài lòng (Satisfaction):** Người dùng cảm thấy thoải mái, chấp nhận được không?

---

## Slide 5: 4. Mục tiêu
* Phát hiện vấn đề sớm, khi chi phí sửa còn rẻ (sửa ở giai đoạn thiết kế rẻ hơn nhiều so với sau khi phát hành).
* Kiểm chứng giả định của nhóm thiết kế bằng dữ liệu thật.
* Giảm chi phí hỗ trợ, tăng tỷ lệ chuyển đổi và giữ chân người dùng.

---

## Slide 6: 5. Vị trí trong vòng đời phát triển
Được thực hiện lặp lại trong suốt vòng đời phát triển.

| Tiêu chí | Giai đoạn hình thành (Prototype) | Tổng kết (Gần hoàn thiện hoặc đã ra mắt) |
| :--- | :--- | :--- |
| **Thời điểm** | Trong quá trình thiết kế, prototype | Sản phẩm gần hoàn thiện hoặc đã ra mắt |
| **Mục đích** | Đo, so sánh, đánh giá đạt/không đạt | Tìm và sửa vấn đề |
| **Tính chất** | Chủ yếu định lượng, nhiều người | Chủ yếu định tính, ít người, lặp nhiều vòng |

---

## Slide 7: 6. Phân loại
* **Theo người điều phối:**
  * **Moderated:** Có người điều phối theo dõi và hỏi thêm.
  * **Unmoderated:** Không có người điều phối; người dùng tự thực hiện task theo hướng dẫn.
* **Theo địa điểm:**
  * **In-person:** Người dùng và researcher ở cùng địa điểm.
  * **Remote testing:** Người dùng tham gia từ xa thông qua Internet.
* **Theo loại dữ liệu thu thập được:**
  * **Kiểm thử định tính (Qualitative Testing):** Thu thập dữ liệu về suy nghĩ, cảm nhận, hành vi và khó khăn của người dùng.
  * **Kiểm thử định lượng (Quantitative Testing):** Thu thập dữ liệu có thể đo lường bằng số.

---

## Slide 8 & 9: 7. Chỉ số và thang đo (Phần 1)

### Chỉ số hành vi:
* **Task success rate:** Số người hoàn thành / tổng số người. (Ví dụ: Out of all the tasks completed by respondents, 28.0% ended up at a "correct" answer).
* **Time on task:** Thời gian hoàn thành. (Lowest observed time: 0s, Lower quartile: 2m 5s, Median: 3m 18s, Upper quartile: 5m 10s, Highest observed time: 30m 6s).
* **Error rate:** Số lỗi trên mỗi nhiệm vụ.
* **Số click/số bước** so với đường đi tối ưu.

### Thang đo thái độ (SEQ):
* **SEQ (Single Ease Question):** Sau mỗi task, hỏi *"Overall, how difficult or easy did you find this task?"* (Thang đo 1 - Very Difficult đến 7 - Very Easy).

---

## Slide 10, 11 & 12: 8. Chỉ số và thang đo (Phần 2 - SUS)

### Thang đo SUS (System Usability Scale):
Bảng câu hỏi gồm 10 mục dùng để đo lường cảm nhận và nhận thức chủ quan của người dùng về tính dễ sử dụng của sản phẩm.

* **Đặc điểm chính:**
  * **Cấu trúc:** 10 câu hỏi đan xen giữa thái cực tích cực (câu lẻ: 1, 3, 5, 7, 9) và tiêu cực (câu chẵn: 2, 4, 6, 8, 10).
  * **Thang đo Likert:** Người tham gia chấm điểm mỗi câu từ 1 (Hoàn toàn không đồng ý) đến 5 (Hoàn toàn đồng ý).
  * **Thời điểm thực hiện:** Ngay sau khi hoàn thành toàn bộ phiên kiểm thử.

* **Cách tính điểm SUS:**
  1. Câu hỏi lẻ $(1, 3, 5, 7, 9)$: $(\text{Điểm} - 1)$.
  2. Các câu hỏi chẵn $(2, 4, 6, 8, 10)$: $(5 - \text{Điểm})$.
  3. Cộng tất cả rồi nhân với $2.5$. Tổng điểm tối đa là $100$.

* **Đánh giá điểm SUS:**
  * **Trên 80.3 điểm:** Xuất sắc
  * **Từ 68 đến 80.3 điểm:** Ở mức tốt, trên trung bình
  * **Dưới 68 điểm:** Cần được cải thiện
  * **Dưới 51 điểm:** Hệ thống gặp vấn đề rất nghiêm trọng về khả năng sử dụng

---

## Slide 13 đến 23: 9. Mười nguyên tắc Heuristic của Jakob Nielsen
Bộ chuẩn mực kinh nghiệm để đánh giá khả năng sử dụng trong thiết kế giao diện người dùng:

1. **Hiển thị trạng thái hệ thống (Visibility of system status):** Hệ thống phải luôn thông báo cho người dùng biết chuyện gì đang xảy ra, thông qua phản hồi thích hợp và trong thời gian hợp lý (Ví dụ: Thanh tiến trình upload, thông báo trạng thái).
2. **Tương thích giữa hệ thống và thế giới thực (Match between system and real world):** Hệ thống sử dụng biểu tượng, ngôn ngữ và khái niệm quen thuộc trong đời sống thay vì các thuật ngữ lập trình (Ví dụ: Biểu tượng giỏ hàng, nút thanh toán trực quan).
3. **Người dùng được kiểm soát và tự do (User control and freedom):** Cung cấp các nút như “Quay lại”, “Hủy”, “Hoàn tác” (Undo/Redo) hoặc hộp thoại xác nhận khi xóa để người dùng điều chỉnh khi lỡ thao tác.
4. **Nhất quán và tuân thủ chuẩn (Consistency and standards):** Sử dụng chung một kiểu định dạng cho các nút, biểu tượng, màu sắc và cách trình bày ở tất cả các trang; tuân theo các chuẩn thiết kế phổ biến.
5. **Phòng ngừa lỗi (Error prevention):** Thiết kế chủ động ngăn chặn sai sót trước khi nó xảy ra thay vì chỉ hiển thị thông báo lỗi (Ví dụ: Kiểm tra điều kiện mật khẩu real-time, gợi ý nhập liệu).
6. **Nhận biết thay vì ghi nhớ (Recognition rather than recall):** Hiển thị thông tin và gợi ý trực quan (như lịch sử tìm kiếm, gợi ý từ khóa) để người dùng không cần phải ghi nhớ lại các dữ liệu đã nhập trước đó.
7. **Sự linh hoạt và hiệu quả sử dụng (Flexibility and efficiency of use):** Hỗ trợ cả người dùng mới với giao diện trực quan, hướng dẫn từng bước, lẫn người dùng lâu năm thông qua các phím tắt và thao tác nâng cao.
8. **Thiết kế tối giản và thẩm mỹ (Aesthetic and minimalist design):** Loại bỏ các thành phần rườm rà, giữ giao diện sạch sẽ và tập trung vào nội dung quan trọng nhất.
9. **Giúp người dùng nhận biết, chẩn đoán và khắc phục lỗi (Help users recognize, diagnose, and recover from errors):** Thông báo lỗi bằng ngôn ngữ dễ hiểu, giải thích rõ nguyên nhân và hướng dẫn cách khắc phục cụ thể (Ví dụ: Nút Retry, hướng dẫn định dạng email hợp lệ).
10. **Trợ giúp và tài liệu hướng dẫn (Help and documentation):** Cung cấp tài liệu hỗ trợ, câu hỏi thường gặp (FAQ) hoặc cửa sổ hướng dẫn ngay khi người dùng cần.

---

## Slide 24: 10. Quy trình thực hiện Usability Testing
1. **Lập kế hoạch:** Mục tiêu, chỉ số.
2. **Tuyển tester:** Chọn đúng người.
3. **Thiết kế task.**
4. **Chuẩn bị, pilot:** Kịch bản.
5. **Tiến hành test:** Quan sát, think-aloud.
6. **Phân tích:** Vấn đề, mức độ.
7. **Báo cáo:** Bằng chứng, đề xuất.
8. **Sửa, Test lại:** Lặp lại bước 5 cho đến khi đạt chỉ số mục tiêu.

---

## Slide 25: 11. Ưu điểm và hạn chế chung
* **Ưu điểm:**
  * Phát hiện vấn đề thực tế: Xác định các khó khăn, lỗi giao diện và trở ngại mà người dùng gặp phải.
  * Hiểu hành vi người dùng.
  * Cải thiện trải nghiệm người dùng, tăng hiệu quả sử dụng.
  * Thu thập phản hồi trực tiếp.
* **Hạn chế:**
  * Môi trường test không hoàn toàn giống thực tế (hiệu ứng bị quan sát).
  * Mẫu nhỏ nên khó khái quát thống kê.
  * Tuyển đúng người mất công.
  * Tập trung vào khả năng sử dụng, không thay thế các loại kiểm thử chức năng, hiệu năng hoặc bảo mật.

---

## Slide 26 đến 32: 12. Ứng dụng AI trong Usability Testing
* **AI hỗ trợ tester trong:**
  * Tạo kịch bản kiểm thử (Generate Test Scenarios)
  * Tạo dữ liệu kiểm thử (Generate Test Data)
  * Phân tích giao diện người dùng (Analyze UI)
  * Phân tích kết quả kiểm thử (Analyze Test Results)
  * Đề xuất cải tiến (Suggest Improvements)
* **Nguyên tắc:** *AI assists - Human validates* (AI hỗ trợ - Con người xác thực). Con người vẫn phải xem xét và đánh giá trước khi đưa ra kết luận.
* **Quy trình AI:** `AI-Generated Test Scenarios` $\rightarrow$ `Human Review (Relevant? Testable? Measurable?)` $\rightarrow$ `Accept / Modify` $\rightarrow$ `Usability Test` $\rightarrow$ `Evidence`.

---

## Slide 33 đến 46: 13. Các công cụ hỗ trợ Usability Testing
Giới thiệu 3 công cụ phổ biến: **Userbrain**, **UXReality**, **UXtweak**.

### Đặc điểm chung:
Đánh giá mức độ dễ sử dụng của website, ứng dụng hoặc prototype qua việc thu thập dữ liệu (hành vi, thao tác, phản hồi), phát hiện vấn đề UX và hỗ trợ cải thiện thiết kế.

### So sánh các công cụ:
| Tiêu chí | Userbrain | UXReality | UXTweak |
| :--- | :--- | :--- | :--- |
| **Mục tiêu chính** | Test nhanh, giá rẻ, làm liên tục | Đo lường độ chú ý thị giác và cảm xúc | Nghiên cứu UX toàn diện trong một nền tảng |
| **Cách thu thập dữ liệu / Điểm nổi bật** | Video, giọng nói, phản hồi, thao tác, khảo sát. Setup dưới 5 phút, AI tự tóm tắt lỗi và insight. | Video, giọng nói, phản hồi, thao tác, khảo sát. Theo dõi ánh mắt và nét mặt ngay trên camera. | Video, giọng nói, phản hồi, thao tác, khảo sát. Phương pháp: Card Sorting, Tree Testing, First-click, Heatmap (All-in-one). |
| **Phù hợp khi** | Cần test nhanh, liên tục hàng tuần với chi phí tiết kiệm. | Cần đo độ chú ý thị giác và cảm xúc vô thức. | Cần nghiên cứu toàn diện, bài bản cả về cấu trúc điều hướng lẫn kiểm thử giao diện. |

---

## Slide 47 đến 58: 14. Mini Practical Exercise (Thực hành với Userbrain)
* **Mục tiêu:** Kiểm tra xem người dùng có thể tìm và thêm một sản phẩm vào giỏ hàng một cách dễ dàng hay không.
* **Website test:** Sauce Demo (`https://sauce-demo.myshopify.com/`)
* **Task cho Tester:** “Hãy tìm một đôi giày có giá dưới 100 đô la và thêm nó vào giỏ hàng của bạn.”
* **Các bước thực hiện trên Userbrain:**
  1. **Step 1 - Create a test:** Đăng nhập, chọn tạo website test mới, đặt tên, nhập URL và cấu hình ngôn ngữ.
  2. **Step 2 - Define the task:** Chọn "Start from scratch", nhập task yêu cầu user thực hiện, thêm các câu hỏi định lượng/thái độ (Multiple Choice - *"How easy or difficult was it to complete this task?"*, Written Response - *"Bạn muốn chúng tôi cải thiện về điều gì?"*).
  3. **Step 3 - Run the test:** Mời tester qua link chia sẻ (`https://participate.userbrain.com/...`) hoặc dùng panel sẵn có.
  4. **Step 4 - Review the recording:** Mở session của tester (`jay@gmail.com`, `Nam@gmail.com`), xem lại video playback (screen + audio), kiểm tra transcripts, notes & clips, và tổng hợp báo cáo chỉ số (Task Success Rate, Avg. test duration).

---

## Slide 59: Kết thúc
* **Nội dung:** Mã QR Form khảo sát ý kiến.

---
*Tài liệu được chuyển đổi đầy đủ từ nội dung slide nhóm 07 môn Kiểm thử phần mềm.*