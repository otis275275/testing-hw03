# TASK 2 — ĐÁNH GIÁ KHẢ NĂNG SỬ DỤNG (USABILITY EVALUATION)
## GIAI ĐOẠN 1: LẬP KẾ HOẠCH, KỊCH BẢN & CÔNG CỤ ĐO LƯỜNG (PHASE 1 — PLAN & PREPARE)

- **Môn học:** Kiểm thử Phần mềm (FIT - HCMUS) — Bài tập lớn HW03
- **Thành viên thực hiện (M2):** Lê Trung Thành Đạt — MSSV: `23120228`
- **Hệ thống cần kiểm thử (SUT):** EShop Web (`http://localhost:5173`, Backend API `http://localhost:3000`)
- **Luồng End-to-End được chọn (Flow F2 — Phạm vi M2):**  
  **Tìm sản phẩm theo nhu cầu $\rightarrow$ Xem thông tin chi tiết $\rightarrow$ Chọn số lượng & Thêm vào giỏ hàng $\rightarrow$ Vào trang Giỏ hàng để xác minh sản phẩm đã được lưu**
- **Ranh giới phạm vi (Scope Boundary):** Phiên kiểm thử kết thúc ngay khi người dùng **xác nhận được sản phẩm đã nằm trong giỏ hàng**. Không yêu cầu người dùng thực hiện chỉnh sửa số lượng trong giỏ, xóa hàng, nhập mã giảm giá hay thanh toán checkout (thuộc phân công thành viên khác).

---

## 1. Mục tiêu Đánh giá (Evaluation Objectives)

Đánh giá trải nghiệm thực tế của người dùng cuối (ưu tiên người dùng phổ thông ngoài ngành IT) trên luồng mua sắm cốt lõi **F2** nhằm tìm ra các câu trả lời định lượng và định tính cho 5 mục tiêu sau:

1. **Khả năng tìm kiếm & lọc thông tin (Findability & Search Clarity):** Người dùng có nhanh chóng tìm đúng sản phẩm mong muốn bằng thanh tìm kiếm trên trang Home hay không? Khi gõ từ khóa không ra kết quả, họ phản ứng thế nào?
2. **Mức độ trực quan của trang Chi tiết & Nhập số lượng (Comprehension & Error Prevention):** Người dùng có dễ dàng đọc giá, mô tả và chỉnh số lượng muốn mua không, hay gặp nhầm lẫn/vấp lỗi khi nhập liệu ở ô số lượng?
3. **Độ rõ ràng của Phản hồi Hệ thống (System Status Visibility):** Khi bấm nút *"Thêm vào giỏ hàng"*, người dùng có nhận biết được thao tác đã thành công hay chưa? Họ có bị bối rối khi thiếu toast thông báo hoặc thiếu huy hiệu đếm số lượng (badge) trên chữ *"Giỏ hàng"* không?
4. **Điểm nghẽn điều hướng (Navigation Bottlenecks):** Người dùng có bị lúng túng khi quay lại danh sách sản phẩm (do thiếu Breadcrumbs) hoặc khi tự tìm đường sang trang Giỏ hàng để kiểm tra lại món hàng vừa thêm không?
5. **Mức độ tự tin & độ tin cậy cảm nhận (Confidence, Speed & Trust):** Mất bao lâu để hoàn thành trọn vẹn luồng tác vụ, tỷ lệ hoàn thành (Task Success Rate) và điểm hài lòng chung (**SUS Score**) đạt mức nào theo chuẩn ngành ($\ge 68$ hay dưới trung bình)?

---

## 2. Kịch bản Nhiệm vụ Mục tiêu (Goal-Oriented Task Scenario)

> [!IMPORTANT]
> **Nguyên tắc thiết kế kịch bản:** Chỉ đưa **mục tiêu thực tế** của người mua hàng (đã đối chiếu khớp với dữ liệu sản phẩm thực tế có trên EShop SUT), **tuyệt đối không hướng dẫn từng bước** (không nhắc tên nút, không chỉ chỗ gõ, không báo trước lỗi dead-click).

### Kịch bản phát cho Người tham gia (Goal chung — Participant Prompt)

> *"Bạn đang cần mua **2 chiếc tai nghe chống ồn** với ngân sách tối đa **6.000.000 ₫/chiếc** trên một trang web bán hàng mới tên là **EShop** (chưa từng mua ở đây bao giờ).*
>
> *Trước hết, bạn hãy xem qua trang web để kiểm tra thông tin bản quyền/đơn vị vận hành xem cửa hàng có đáng tin cậy không; sau đó tự tìm thử xem shop có bán **tai nghe Sony** không — nếu không có thì tìm một mẫu tai nghe chống ồn khác phù hợp ngân sách, xem kỹ thông tin chi tiết rồi đưa **2 chiếc** vào giỏ hàng. Cuối cùng, hãy kiểm tra lại trong giỏ hàng để chắc chắn đã có đúng sản phẩm với đủ số lượng 2, rồi quay về lại trang đầu của cửa hàng (chưa cần thanh toán)."*

### Điều kiện hoàn thành nhiệm vụ & Phạm vi màn hình đi qua (Dành riêng cho Điều phối viên, không đọc cho Tester)
- **Độ phủ màn hình tự nhiên từ Goal trên:**
  - **Home & Tìm kiếm:** Tìm `"Sony"` (chạm Empty State) $\rightarrow$ xóa tìm hoặc tìm `"tai nghe"` để thấy *Tai nghe AirPods Pro 2* (`6,000,000 VND`).
  - **Footer:** Đọc thông tin bản quyền `© 2026 EShop SUT...` để kiểm tra độ tin cậy cửa hàng.
  - **Product Detail:** Đọc mô tả *"Chống ồn chủ động xuất sắc"*, chọn số lượng `2`, bấm *Thêm vào giỏ hàng*.
  - **Header & Kiểm tra Giỏ hàng:** Dùng thanh điều hướng trên cùng để vào *Giỏ hàng* kiểm tra đủ 2 sản phẩm (kèm cảm nhận thiếu badge/toast/dead-click), sau đó bấm logo *EShop* về lại trang chủ.
- **Thành công hoàn toàn (Complete Success):** Tự tìm được *Tai nghe AirPods Pro 2*, thêm đúng số lượng `2`, xác nhận thấy đủ trong `/cart` và quay lại được trang chủ mà không cần gợi ý.
- **Thành công có trợ giúp (Assisted Success):** Cần điều phối viên gợi ý sau khi bị kẹt $> 2$ phút mới qua được bước vướng.
- **Thất bại (Failed):** Bỏ cuộc, hoặc kiểm tra giỏ hàng thấy trống / sai số lượng mà không tự phát hiện và sửa được.

---

## 3. Hướng dẫn Điều phối & Kịch bản Lời dẫn Chuẩn (Moderator Script)

### 3.1. Chuẩn bị Môi trường trước mỗi phiên (Pre-Session Checklist)
- [ ] Khởi động Backend (`http://localhost:3000`) và Frontend Web (`http://localhost:5173`). Nếu test từ xa qua Google Meet, bật share control hoặc chuẩn bị tunnel bảo đảm kết nối API ổn định.
- [ ] Mở trình duyệt bằng **cửa sổ ẩn danh (Incognito / Fresh Profile)** để giỏ hàng ban đầu luôn rỗng (`0` sản phẩm) và chưa đăng nhập trạng thái cũ.
- [ ] Chuẩn bị sẵn công cụ quay màn hình + thu âm (OBS / Windows Game Bar / Google Meet Record) và xin phép người tham gia trước khi bấm quay.
- [ ] Chuẩn bị sẵn link/phiếu **SEQ + SUS + Câu hỏi phỏng vấn** (mục 4 bên dưới) để gửi ngay sau khi họ làm xong tác vụ.

### 3.2. Lời dẫn mở đầu (Set the Stage — Đọc trước khi bắt đầu)
> *"Cảm ơn bạn đã dành thời gian tham gia buổi trải nghiệm hôm nay. Mình đang đánh giá giao diện của một website bán hàng mẫu tên là **EShop**. Xin lưu ý là **bài test này kiểm tra mức độ dễ dùng của trang web, hoàn toàn KHÔNG phải kiểm tra trình độ hay kiến thức của bạn** — nếu bạn thấy chỗ nào khó hiểu, bấm nhầm hay bị kẹt thì đó là lỗi của trang web cần phải sửa.*
>
> *Trong lúc thao tác, nhờ bạn áp dụng cách **Suy nghĩ thành tiếng (Think-Aloud)**: bạn đang tìm gì, nhìn thấy gì, nghĩ nút này sẽ làm gì, hoặc thấy kỳ lạ/bực mình ở đâu thì cứ nói thành tiếng hết ra nhé. Trong lúc bạn làm, mình sẽ chỉ im lặng quan sát và ghi chú chứ không nhắc bài trừ khi bạn thật sự bế tắc hoàn toàn. Bạn sẵn sàng và đồng ý cho mình ghi lại màn hình/âm thanh để làm bằng chứng học tập chưa?"*

### 3.3. Quy tắc Quan sát Trung lập (Neutral Observation Rules)
- Khi người dùng hỏi *"Bấm nút này không thấy gì, có phải nhấn thêm lần nữa không?"*: **Không trả lời Có/Không**. Chỉ hỏi lại trung lập: *"Theo bạn thì lúc này bạn sẽ làm gì tiếp theo?"*
- Chỉ gợi ý tối thiểu nếu người tham gia bế tắc tại một điểm quá **2 phút** và ghi chú lại mốc thời gian đã can thiệp.

---

## 4. Bộ Công cụ Đo lường (Instruments)

### Công cụ A — Thang đo Độ dễ tức thời (SEQ — Single Ease Question)
*(Hỏi ngay khi người tham gia vừa kết thúc nhiệm vụ, trước khi phỏng vấn sâu)*

> *"Nhìn chung, bạn đánh giá nhiệm vụ vừa rồi ở mức nào trên thang điểm từ 1 đến 7?"*
> - **1** (Rất khó) — **2** — **3** — **4** (Bình thường) — **5** — **6** — **7** (Rất dễ)

---

### Công cụ B — Bảng Câu hỏi Chuẩn SUS (System Usability Scale — 10 mục)
*(Phát cho người tham gia tự điền ngay sau khi hoàn thành tác vụ. Thang Likert: **1** = Hoàn toàn không đồng ý $\rightarrow$ **5** = Hoàn toàn đồng ý)*

| STT | Nội dung câu hỏi (Tiếng Việt chuẩn hóa) | Chiều tính điểm | Điểm (1–5) |
| :-: | :--- | :---: | :---: |
| **Q1** | Tôi nghĩ rằng tôi sẽ thích sử dụng trang web này thường xuyên. | Tích cực (Lẻ) | ☐ 1  ☐ 2  ☐ 3  ☐ 4  ☐ 5 |
| **Q2** | Tôi thấy trang web này phức tạp một cách không cần thiết. | Tiêu cực (Chẵn) | ☐ 1  ☐ 2  ☐ 3  ☐ 4  ☐ 5 |
| **Q3** | Tôi thấy trang web này dễ sử dụng. | Tích cực (Lẻ) | ☐ 1  ☐ 2  ☐ 3  ☐ 4  ☐ 5 |
| **Q4** | Tôi nghĩ rằng tôi sẽ cần sự hỗ trợ của người am hiểu kỹ thuật để sử dụng được trang web này. | Tiêu cực (Chẵn) | ☐ 1  ☐ 2  ☐ 3  ☐ 4  ☐ 5 |
| **Q5** | Tôi thấy các chức năng khác nhau trên trang web này được kết nối với nhau khá tốt. | Tích cực (Lẻ) | ☐ 1  ☐ 2  ☐ 3  ☐ 4  ☐ 5 |
| **Q6** | Tôi thấy có quá nhiều điểm thiếu nhất quán trên trang web này (màu sắc, chữ, cách phản hồi). | Tiêu cực (Chẵn) | ☐ 1  ☐ 2  ☐ 3  ☐ 4  ☐ 5 |
| **Q7** | Tôi hình dung rằng hầu hết mọi người sẽ học cách dùng trang web này rất nhanh. | Tích cực (Lẻ) | ☐ 1  ☐ 2  ☐ 3  ☐ 4  ☐ 5 |
| **Q8** | Tôi thấy trang web này khá rườm rà, bất tiện khi thao tác. | Tiêu cực (Chẵn) | ☐ 1  ☐ 2  ☐ 3  ☐ 4  ☐ 5 |
| **Q9** | Tôi cảm thấy rất tự tin khi thao tác trên trang web này. | Tích cực (Lẻ) | ☐ 1  ☐ 2  ☐ 3  ☐ 4  ☐ 5 |
| **Q10** | Tôi cần phải tìm hiểu hoặc thử sai nhiều thứ trước khi dùng trơn tru được trang web này. | Tiêu cực (Chẵn) | ☐ 1  ☐ 2  ☐ 3  ☐ 4  ☐ 5 |

**Công thức chấm điểm SUS:**
- Câu lẻ ($1, 3, 5, 7, 9$): $\text{Điểm quy đổi} = \text{Điểm gốc} - 1$
- Câu chẵn ($2, 4, 6, 8, 10$): $\text{Điểm quy đổi} = 5 - \text{Điểm gốc}$
- $\text{SUS Score} = \left(\sum_{i=1}^{10} \text{Điểm quy đổi}_i\right) \times 2.5$ *(Thang 0 – 100; Grade A: $> 80.3$, Grade B/C: $68.0 - 80.3$, Grade D: $51.0 - 67.9$, Grade F: $< 51.0$)*.

---

### Công cụ C — Bộ Câu hỏi Phỏng vấn Mở (Post-Session Probe Questions)
*(Bao phủ đủ tối thiểu 4 khía cạnh bắt buộc của đề bài: Clarity, Error Recovery, Speed, Trust)*

1. **Độ rõ ràng (Clarity):**
   - *Có màn hình, nút bấm hay thông tin nào khiến bạn phải dừng lại suy nghĩ xem nó dùng để làm gì hoặc nó đã chạy chưa không?*
   - *Khi bạn bấm thêm sản phẩm vào giỏ, làm sao bạn biết được là đã thêm thành công hay chưa?*
2. **Khả năng khôi phục sau lỗi (Error Recovery):**
   - *Lúc gặp trục trặc (ví dụ tìm kiếm không ra kết quả, bấm nút không thấy phản hồi hoặc vào giỏ không thấy hàng), hệ thống có gợi ý hay chỉ dẫn gì giúp bạn biết cách tự xử lý không?*
   - *Theo bạn, vì sao lỗi đó xảy ra và lúc đó bạn cảm thấy thế nào?*
3. **Tốc độ & Hiệu quả thao tác (Speed):**
   - *Bước nào trong quá trình tìm sản phẩm và thêm vào giỏ làm bạn mất thời gian hoặc phải bấm thừa thao tác nhiều nhất?*
4. **Độ tin cậy & An tâm (Trust):**
   - *Với trải nghiệm giao diện và cách phản hồi vừa rồi, bạn có đủ tin tưởng để tiếp tục đặt mua hàng thật trên trang web này không? Điều gì làm bạn yên tâm hoặc e ngại nhất?*
5. **Câu hỏi mở bổ sung theo phiên (Session-specific):**
   - *[Hỏi xoáy vào 1–2 khoảnh khắc ngập ngừng cụ thể quan sát được trong phiên Think-Aloud của chính người đó.]*

---

### Công cụ D — Biểu mẫu Ghi chép Quan sát Thực địa (Observation Log Sheet — Dùng cho mỗi phiên)

```markdown
### Biên bản Phiên [Pilot / P1..P7]
- **Người tham gia:** [Họ tên] | **SĐT/Zalo:** [09xx***xxx] | **Ngày giờ:** YYYY-MM-DD HH:mm
- **Hình thức:** [Trực tiếp / Google Meet] | **Bằng chứng quay màn hình:** [Tên file video / link]
- **Thời gian hoàn thành (Time on Task):** [mm:ss]
- **Kết quả tác vụ:** [Thành công hoàn toàn / Thành công có trợ giúp / Thất bại]
- **Điểm SEQ (1–7):** [x / 7] | **Điểm SUS:** [xx.x / 100]

| Mốc thời gian | Thao tác quan sát được | Trích dẫn Think-Aloud | Điểm nghẽn / Lỗi / Do dự (Friction & Errors) |
| :---: | :--- | :--- | :--- |
| `00:00` | Bắt đầu xem trang Home | "..." | ... |
```

---

## 5. Kế hoạch Tuyển chọn 7 Người tham gia & Phiên Chạy thử (Pilot + Recruitment Roster)

> [!CAUTION]
> **Quy định chống gian lận (Anti-Cheat Rule — Mục 11 đề bài HW03):**
> - Tất cả **7 người tham gia chính thức** (và 1 người Pilot) phải là **người thật ở ngoài lớp học HW03** (không tuyển sinh viên đang học môn này).
> - Ưu tiên người dùng phổ thông **không thuộc ngành IT / không làm Tester**.
> - Ghi rõ thông tin liên hệ xác thực (SĐT / Zalo / Email) và **che 4 chữ số ở giữa** (ví dụ: `0912***678`). **Trợ giảng (TA) sẽ gọi điện xác minh ngẫu nhiên 2/7 người tham gia.**
> - **Bảng dưới đây là mẫu chờ điền dữ liệu thật khi bạn tuyển người và thực hiện xong Phase 2 — tuyệt đối không điền tên hoặc số điện thoại giả.**

| Vai trò | Họ và tên thật | Nghề nghiệp / Đối tượng | Ngoài lớp HW03? | SĐT / Zalo xác thực *(che 4 số giữa)* | Lịch hẹn dự kiến | Kênh thực hiện | Trạng thái |
| :-: | :--- | :--- | :---: | :--- | :---: | :---: | :---: |
| **Pilot** | *(Chờ điền khi chạy thử)* | *(Ưu tiên ngoài IT)* | ☐ Có | `09xx***xxx` | `YYYY-MM-DD HH:mm` | Trực tiếp / Meet | Chưa chạy |
| **P1** | *(Chờ tuyển người thật)* | *(Ví dụ: Nhân viên văn phòng)* | ☐ Có | `09xx***xxx` | `YYYY-MM-DD HH:mm` | Trực tiếp / Meet | Chưa chạy |
| **P2** | *(Chờ tuyển người thật)* | *(Ví dụ: Sinh viên ngoài IT)* | ☐ Có | `09xx***xxx` | `YYYY-MM-DD HH:mm` | Trực tiếp / Meet | Chưa chạy |
| **P3** | *(Chờ tuyển người thật)* | *(Ví dụ: Kinh doanh / Bán hàng)* | ☐ Có | `09xx***xxx` | `YYYY-MM-DD HH:mm` | Trực tiếp / Meet | Chưa chạy |
| **P4** | *(Chờ tuyển người thật)* | *(Ví dụ: Kế toán / Tài chính)* | ☐ Có | `09xx***xxx` | `YYYY-MM-DD HH:mm` | Trực tiếp / Meet | Chưa chạy |
| **P5** | *(Chờ tuyển người thật)* | *(Ví dụ: Giáo viên / Hành chính)* | ☐ Có | `09xx***xxx` | `YYYY-MM-DD HH:mm` | Trực tiếp / Meet | Chưa chạy |
| **P6** | *(Chờ tuyển người thật)* | *(Ví dụ: Kỹ sư ngoài ngành IT)* | ☐ Có | `09xx***xxx` | `YYYY-MM-DD HH:mm` | Trực tiếp / Meet | Chưa chạy |
| **P7** | *(Chờ tuyển người thật)* | *(Ví dụ: Người mua sắm online tự do)* | ☐ Có | `09xx***xxx` | `YYYY-MM-DD HH:mm` | Trực tiếp / Meet | Chưa chạy |

---

## 6. Quy trình Chạy thử Pilot (Pre-Flight Validation)

Trước khi bước vào 7 phiên chính thức (Phase 2), thực hiện **1 phiên Pilot** và kiểm tra các tiêu chí tinh chỉnh sau:
1. Người Pilot có hiểu ngay mục tiêu *"mua 2 chiếc tai nghe chống ồn ngân sách $\le 6.000.000$ ₫"* mà không cần hỏi lại *"tìm ở đâu / mua cái nào"* không?
2. Thời lượng mỗi phiên (tác vụ + SEQ + SUS + phỏng vấn 4 ý) có nằm gọn trong **10–15 phút** không?
3. Luồng kỹ thuật (tải trang Home, tìm kiếm, mở `/product/:id`, thêm vào giỏ, mở `/cart`, reset giỏ hàng giữa các lượt test) có chạy thông suốt trên thiết bị quay màn hình không?
4. Ghi lại mọi chỉnh sửa từ câu chữ kịch bản sau Pilot trước khi tiến hành P1 $\rightarrow$ P7.

