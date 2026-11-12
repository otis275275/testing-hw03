# TASK 2 — GIAI ĐOẠN 2: BIỂU MẪU GHI CHÉP PHIÊN ĐÁNH GIÁ (PILOT + P1–P7)

- **Môn học:** Kiểm thử Phần mềm (FIT - HCMUS) — Bài tập lớn HW03
- **Thành viên thực hiện (M2):** Lê Trung Thành Đạt — MSSV: `23120228`
- **Tài liệu chuẩn Phase 1:** [`task2_phase1_plan_and_instruments.md`](./task2_phase1_plan_and_instruments.md)
- **Hệ thống kiểm thử (SUT):** EShop Web (`http://localhost:5173`, Backend API `http://localhost:3000`)
- **Luồng End-to-End (Flow F2):** Tìm sản phẩm theo nhu cầu $\rightarrow$ Xem chi tiết $\rightarrow$ Chọn số lượng & Thêm vào giỏ hàng $\rightarrow$ Vào trang Giỏ hàng xác minh sản phẩm đã được lưu $\rightarrow$ Quay về trang chủ.

> [!CAUTION]
> **Quy định Anti-Cheat:** Tất cả người tham gia (Pilot + P1–P7) phải là **người thật ở ngoài lớp học HW03**. Thông tin liên hệ phải xác thực được và **che 4 chữ số ở giữa** (ví dụ: `0912***678`). TA có thể gọi ngẫu nhiên 2/7 người để xác minh.

---

## 1. Bảng Danh sách Người tham gia (Pilot + P1–P7)

| Vai trò | Họ và tên thật | Nghề nghiệp / Đối tượng | Ngoài lớp HW03? | Ngoài IT? | SĐT / Zalo / Email *(che 4 số giữa)* | Ngày giờ thực hiện | Kênh thực hiện | File / Link Video bằng chứng | Trạng thái |
| :-: | :--- | :--- | :---: | :---: | :--- | :---: | :---: | :--- | :---: |
| **Pilot** | | | ☐ Có | ☐ Có / ☐ Không | | `YYYY-MM-DD HH:mm` | Trực tiếp / Meet | | Chưa chạy |
| **P1** | Hà Anh Tuấn | Sinh viên IT năm 4 (VGU) | ☑ Có | ☐ Không *(IT)* | `093****045` | `2026-11-12 20:30` | Online (YouTube Record) | [Video P1](https://youtu.be/hSGZJhJrAhA) + [`candidate 1 transcript`](./%5BVietnamese%20%28auto-generated%29%5D%20Software%20Testing%20homework%203%20-%20candidate%201%20%5BDownSub.com%5D.txt) | Hoàn thành (`00:37` tác vụ / `07:11` video) |
| **P2** | Trần Kim Ngân | Sinh viên IT năm 4 (HCMUS) | ☐ Có *(xác nhận ngoài lớp HW03)* | ☐ Không *(IT)* | `098****128` | `2026-11-12 21:00` | Online (YouTube Record) | [Video P2](https://youtu.be/1EfXQpylgmQ) *(YouTube: Dat Thanh)* | Hoàn thành (`00:56` tác vụ / `04:50` video; chờ xác nhận ngoài lớp) |
| **P3** | Đinh Ngọc Khánh | Sinh viên IT năm 4 (HCMUT) | ☑ Có | ☐ Không *(IT)* | `089****207` | `2026-11-12 21:15` | Trực tiếp / Meet | Không có *(từ chối ghi hình)* | Chờ Time on Task & kết quả SEQ/SUS thật |
| **P4** | Lâm Mỹ Phương | Sinh viên IT năm 4 (HCMUT) | ☑ Có | ☐ Không *(IT)* | `094****740` | `2026-11-12 21:30` | Trực tiếp / Meet | Không có *(từ chối ghi hình)* | Chờ Time on Task & kết quả SEQ/SUS thật |
| **P5** | | | ☐ Có | ☐ Có / ☐ Không | | `YYYY-MM-DD HH:mm` | Trực tiếp / Meet | | Chưa chạy |
| **P6** | | | ☐ Có | ☐ Có / ☐ Không | | `YYYY-MM-DD HH:mm` | Trực tiếp / Meet | | Chưa chạy |
| **P7** | | | ☐ Có | ☐ Có / ☐ Không | | `YYYY-MM-DD HH:mm` | Trực tiếp / Meet | | Chưa chạy |

---

## 2. Biên bản Phiên Chạy thử (Pilot Session)

- **Người tham gia:** `[Họ tên]` | **Nghề nghiệp:** `[...]` | **Ngoài lớp HW03:** `[Có]`
- **SĐT/Zalo/Email *(che 4 số giữa)*:** `[09xx***xxx]`
- **Ngày giờ:** `YYYY-MM-DD HH:mm` | **Hình thức:** `[Trực tiếp / Google Meet]`
- **Bằng chứng quay màn hình + âm thanh:** `[Tên file video / link]`
- **Thời gian hoàn thành (Time on Task):** `[mm:ss]`
- **Kết quả tác vụ:** `[Thành công hoàn toàn / Thành công có trợ giúp / Thất bại]`
- **Điểm SEQ (1–7):** `[.../7]` | **Điểm SUS:** `[.../100]`

### Nhật ký Quan sát (Observation Log — Pilot)

| Mốc thời gian | Thao tác quan sát được | Trích dẫn Think-Aloud | Điểm nghẽn / Lỗi / Do dự |
| :---: | :--- | :--- | :--- |
| `00:00` | Bắt đầu xem trang Home | `"..."` | |
| `00:xx` | | `"..."` | |
| `00:xx` | | `"..."` | |

### Điểm SUS (1–5) — Pilot

| Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Tổng quy đổi | Điểm SUS (`/100`) |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| | | | | | | | | | | | |

### Phỏng vấn Mở (Probe Questions — Pilot)
1. **Độ rõ ràng (Clarity):** `...`
2. **Khả năng khôi phục sau lỗi (Error Recovery):** `...`
3. **Tốc độ & Hiệu quả (Speed):** `...`
4. **Độ tin cậy & An tâm (Trust):** `...`
5. **Câu hỏi bổ sung theo phiên (Session-specific):** `...`

### Tinh chỉnh Kịch bản / Quy trình sau Pilot (Pre-Flight Adjustments)
- **Kịch bản có rõ ràng không?** `...`
- **Thay đổi áp dụng trước khi chạy P1–P7:** `...`

---

## 3. Biên bản Phiên P1

- **Người tham gia:** `Hà Anh Tuấn` | **Nghề nghiệp:** `Sinh viên IT năm 4 (VGU)` | **Ngoài lớp HW03:** `Có (học VGU, ngoài lớp HW03 HCMUS; thuộc ngành IT)`
- **SĐT/Zalo/Email *(che 4 số giữa)*:** `093****045`
- **Ngày giờ:** `2026-11-12 20:30` | **Hình thức:** `Online (có quay màn hình & thu âm)`
- **Bằng chứng quay màn hình + âm thanh:** [https://youtu.be/hSGZJhJrAhA](https://youtu.be/hSGZJhJrAhA) · Transcript: [`candidate 1 [DownSub.com].txt`](./%5BVietnamese%20%28auto-generated%29%5D%20Software%20Testing%20homework%203%20-%20candidate%201%20%5BDownSub.com%5D.txt)
- **Thời gian hoàn thành (Time on Task):** `00:37` *(từ `00:49` bắt đầu thao tác tới `01:26` xong xác minh giỏ; `00:44` tính đến lúc ĐPV chốt dừng ở `01:33`; tổng thời lượng video cả SEQ/SUS/Probe là `07:11`)*
- **Kết quả tác vụ:** `Thành công hoàn toàn` *(tìm được iPhone 15 Pro Max giá 30 triệu, vào chi tiết, thêm vào giỏ và vào giỏ hàng kiểm tra)*
- **Ghi chú bối cảnh kịch bản thực tế:** Ở phiên này, điều phối viên giao nhiệm vụ tìm *"điện thoại iPhone giá 30 triệu"* (khác với kịch bản tai nghe trong Phase 1; chưa test bước tìm từ khóa không có kết quả `"Sony"` và xem Footer).
- **Điểm SEQ (1–7):** `6 / 7` | **Điểm SUS:** `82.5 / 100` *(Grade A — xem ghi chú ở Q6 và Q9 bên dưới)*

### Nhật ký Quan sát (Observation Log — P1)

| Mốc thời gian | Thao tác quan sát được | Trích dẫn Think-Aloud | Điểm nghẽn / Lỗi / Do dự |
| :---: | :--- | :--- | :--- |
| `00:49` | Nghe xong nhiệm vụ tìm iPhone giá 30 triệu và xác nhận lại mục tiêu trước khi làm | `"Ok bạn. Bạn muốn phone 30 triệu hả?"` | Xác nhận lại mục tiêu trước khi thao tác (`00:01`–`00:42` là phần ĐPV giới thiệu). |
| `01:02` | Nhập từ khóa `iPhone` vào thanh tìm kiếm trên Home | `"Đây mình đã bấm keyword iPhone thì nó đã lọc lại được một cái iPhone 15 3[0] triệu mình sẽ bấm nha."` | Tìm kiếm lọc nhanh (do tổng chỉ có 5 sản phẩm); bấm vào trang chi tiết. *(Auto-caption ghi nhầm "3 triệu")*. |
| `01:15` | Bấm nút `"Thêm vào giỏ hàng"` trên trang Chi tiết | `"Ok bây giờ thêm vào giỏ hàng nhé."` *(Phỏng vấn tại `05:15`: "Không biết thêm chưa nhưng mà có vẻ thêm rồi á. Cái nút nó chỉ đậm/đập tí thôi.")* | Thiếu thông báo xác nhận / toast / badge số lượng trên Header khiến người dùng không chắc chắn nút đã chạy chưa. |
| `01:26`–`01:33` | Tự vào trang Giỏ hàng để kiểm tra lại sản phẩm, sau đó hỏi có cần thanh toán không | `"Mình đã thêm vào gió hàng xong rồi mình có thanh toán không bạn ơi?"` *(Phỏng vấn tại `05:50`: "Mình bấm thêm vào giỏ không thấy phản hồi lắm thì mình vô giỏ xem...")* | Phải tự vào `/cart` để xác minh vì thiếu phản hồi hệ thống; tác vụ dừng tại `01:33` theo phạm vi M2. |

### Điểm SUS (1–5) — P1

| Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Tổng quy đổi | Điểm SUS (`/100`) |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| 3 | 1 | 5 | 1 | 4 | 5* | 5 | 1 | 5* | 1 | **33** | **82.5** |

> [!NOTE]
> **Ghi chú kiểm tra lại từ audio gốc của P1:**
> - **Q6 (`5*`):** Khi được hỏi *"tôi thấy có quá nhiều điểm thiếu nhất quán..."*, P1 trả lời miệng *"Cảm giác nó cũng nhất quán rồi"* nhưng lại đọc điểm **`5`** (có thể bị nhầm chiều câu phủ định). Trong bảng trên giữ nguyên con số **`5`** theo đúng lời người tham gia (`5 - 5 = 0`, SUS = `82.5`). Nếu bạn xác nhận P1 muốn chọn `1` cho câu phủ định này thì tổng quy đổi là `37` (SUS = `92.5`).
> - **Q9 (`5*`):** Phụ đề tự động ghi ký tự `"N"` (nhiều khả năng là chữ `"Năm"` bị cắt). Cần nghe lại audio gốc để xác nhận chính xác là `5`.

### Phỏng vấn Mở (Probe Questions — P1)
1. **Độ rõ ràng (Clarity):** Khựng lại ở nút **"Thêm vào giỏ"**: *"Không biết thêm chưa nhưng mà có vẻ thêm rồi á. Cái nút nó chỉ đậm/đập tí thôi."*
2. **Khả năng khôi phục sau lỗi (Error Recovery):** Hệ thống không có chỉ dẫn/gợi ý khi thiếu phản hồi: *"Mình bấm thêm vào giỏ không thấy phản hồi lắm thì mình vô giỏ xem thì mình mới biết là nó có được thêm."*
3. **Tốc độ & Hiệu quả (Speed):** Không gặp cảm giác tốn thời gian vì dữ liệu mẫu quá ít: *"Tại vì có năm sản phẩm cho nên tìm cũng không có ý nghĩa lắm."*
4. **Độ tin cậy & An tâm (Trust):** Cảm thấy *"cũng được á, không đến nỗi"*; điểm e ngại duy nhất: *"Ngoài cái việc mà nó không có báo cho mình biết là mình đã bấm thành công thì không có gì."*
5. **Câu hỏi bổ sung theo phiên (Session-specific):** Khi được hỏi thêm về tính nhất quán giao diện (lúc làm Q6), P1 xem lại trang và nhận xét cảm giác bố cục/màu sắc tổng thể khá nhất quán, chỉ thiếu rõ ràng ở trạng thái phản hồi sau khi thêm vào giỏ.

---

## 4. Biên bản Phiên P2

- **Người tham gia:** `Trần Kim Ngân` | **Nghề nghiệp:** `Sinh viên IT năm 4 (HCMUS)` | **Ngoài lớp HW03:** `[Cần xác nhận không học cùng lớp HW03 này; thuộc ngành IT]`
- **SĐT/Zalo/Email *(che 4 số giữa)*:** `098****128`
- **Ngày giờ:** `2026-11-12 21:00` | **Hình thức:** `Online (có quay màn hình & thu âm)`
- **Bằng chứng quay màn hình + âm thanh:** [https://youtu.be/1EfXQpylgmQ](https://youtu.be/1EfXQpylgmQ) *(YouTube: Dat Thanh — `Software Testing homework 3 - candidate 2`)*
- **Thời gian hoàn thành (Time on Task):** `00:56` *(từ `00:26` bắt đầu tìm kiếm & xem chi tiết tới `01:22` khi hoàn tất kiểm tra Giỏ hàng và ĐPV chốt dừng; tổng thời lượng video cả SEQ/SUS/Probe là `04:50`)*
- **Kết quả tác vụ:** `Thành công hoàn toàn` *(tìm MacBook $\rightarrow$ xem chi tiết $\rightarrow$ thêm vào giỏ $\rightarrow$ vào Giỏ hàng xác minh)*
- **Ghi chú bối cảnh kịch bản thực tế:** Điều phối viên giao tìm sản phẩm *"MacBook"*; ở bước xem chi tiết và sau khi thêm vào giỏ, điều phối viên có nhắc lại bước tiếp theo (*"xem thông tin xong thì bạn thêm giỏ hàng giúp mình"*, *"kiếm chỗ nào vào kiểm tra"*).
- **Điểm SEQ (1–7):** `6 / 7` | **Điểm SUS:** `92.5 / 100` *(Grade A)*

### Nhật ký Quan sát (Observation Log — P2)

| Mốc thời gian | Thao tác quan sát được | Trích dẫn Think-Aloud | Điểm nghẽn / Lỗi / Do dự |
| :---: | :--- | :--- | :--- |
| `00:26`–`00:39` | Tìm kiếm từ khóa `MacBook` và mở trang Chi tiết sản phẩm | `"Ừ để mình xem chi tiết nha. Ok. Ủa giờ mình phải thêm vô giỏ hàng hả bạn hay là giờ..."` | Hơi phân vân bước tiếp theo sau khi đọc xong chi tiết ở `00:39` (cần xác nhận từ điều phối viên). |
| `00:48`–`01:01` | Bấm nút `"Thêm vào giỏ hàng"` tại Product Detail | `"Ok thông tin... ồ đã thiệt nhưng mà mình không thấy nó thông báo nhỉ."` | **Phát hiện trực tiếp tại `01:01`:** Thiếu Toast / thông báo xác nhận và thiếu badge giỏ hàng sau khi bấm thêm. |
| `01:12`–`01:22` | Tự tìm và mở trang Giỏ hàng (`/cart`) để kiểm tra sản phẩm đã thêm | `"Ok giỏ hàng đây. Sản phẩm, giá, số lượng, thành tiền. Mình xóa thử nha."` | Kiểm tra đủ các cột dữ liệu; định bấm nút `"Xóa"` lúc `01:20` thì ĐPV báo dừng ở `01:22` đúng ranh giới M2. |

### Điểm SUS (1–5) — P2

| Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Tổng quy đổi | Điểm SUS (`/100`) |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| 4 | 1 | 5 | 1 | 4 | 1 | 4* | 1 | 5 | 1 | **37** | **92.5** |

> [!NOTE]
> - **Q5 (`4`):** P2 chủ động giải thích lý do trừ 1 điểm: *"mình cho là 4 điểm, trừ 1 điểm tại không có thông báo thôi."*
> - **Q7 (`4*`):** Trong bản ghi, điều phối viên đọc nhầm câu hỏi thành *"học cách xây dựng trang web này rất nhanh"* (thay vì *"học cách sử dụng trang web"*); P2 vẫn chấm `4`.

### Phỏng vấn Mở (Probe Questions — P2)
1. **Độ rõ ràng (Clarity):** Trả lời *"Mình không"* khi hỏi về nút gây bối rối, nhưng trong lúc thao tác Think-Aloud có nhận xét rõ *"không thấy nó thông báo nhỉ"* khi bấm thêm vào giỏ.
2. **Khả năng khôi phục sau lỗi (Error Recovery):** *"Hiện tại thì mình chưa thấy nhưng mà nói chung những thông tin hiện lên thì cũng đủ để xài."*
3. **Tốc độ & Hiệu quả (Speed):** Nhanh, chỉ tốn thời gian *"lúc mình đọc thông tin thôi"*.
4. **Độ tin cậy & An tâm (Trust):** *"Ờ mình có, chắc chắn."*
5. **Câu hỏi bổ sung theo phiên (Session-specific):** Dù chấm SUS cao (`92.5`), P2 vẫn chỉ ra đúng khiếm khuyết phản hồi hệ thống tại Q5 (*"trừ 1 điểm tại không có thông báo thôi"*) và muốn thử thao tác tiếp nút `"Xóa"` trong giỏ hàng.

---

## 5. Biên bản Phiên P3

- **Người tham gia:** `Đinh Ngọc Khánh` | **Nghề nghiệp:** `Sinh viên IT năm 4 (HCMUT)` | **Ngoài lớp HW03:** `Có (học HCMUT, ngoài lớp HW03 HCMUS; thuộc ngành IT)`
- **SĐT/Zalo/Email *(che 4 số giữa)*:** `089****207`
- **Ngày giờ:** `2026-11-12 21:15` | **Hình thức:** `[Trực tiếp / Google Meet]`
- **Bằng chứng quay màn hình + âm thanh:** `Không có (người tham gia từ chối ghi hình/thu âm; chỉ ghi chép biên bản)`
- **Thời gian hoàn thành (Time on Task):** `[mm:ss]`
- **Kết quả tác vụ:** `[Thành công hoàn toàn / Thành công có trợ giúp / Thất bại]`
- **Điểm SEQ (1–7):** `[.../7]` | **Điểm SUS:** `[.../100]`

### Nhật ký Quan sát (Observation Log — P3)

| Mốc thời gian | Thao tác quan sát được | Trích dẫn Think-Aloud | Điểm nghẽn / Lỗi / Do dự |
| :---: | :--- | :--- | :--- |
| `00:00` | Bắt đầu xem trang Home | `"..."` | |
| `00:xx` | | `"..."` | |
| `00:xx` | | `"..."` | |
| `00:xx` | | `"..."` | |

### Điểm SUS (1–5) — P3

| Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Tổng quy đổi | Điểm SUS (`/100`) |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| | | | | | | | | | | | |

### Phỏng vấn Mở (Probe Questions — P3)
1. **Độ rõ ràng (Clarity):** `...`
2. **Khả năng khôi phục sau lỗi (Error Recovery):** `...`
3. **Tốc độ & Hiệu quả (Speed):** `...`
4. **Độ tin cậy & An tâm (Trust):** `...`
5. **Câu hỏi bổ sung theo phiên (Session-specific):** `...`

---

## 6. Biên bản Phiên P4

- **Người tham gia:** `Lâm Mỹ Phương` | **Nghề nghiệp:** `Sinh viên IT năm 4 (HCMUT)` | **Ngoài lớp HW03:** `Có (học HCMUT, ngoài lớp HW03 HCMUS; thuộc ngành IT)`
- **SĐT/Zalo/Email *(che 4 số giữa)*:** `094****740`
- **Ngày giờ:** `2026-11-12 21:30` | **Hình thức:** `[Trực tiếp / Google Meet]`
- **Bằng chứng quay màn hình + âm thanh:** `Không có (người tham gia từ chối ghi hình/thu âm; chỉ ghi chép biên bản)`
- **Thời gian hoàn thành (Time on Task):** `[mm:ss]`
- **Kết quả tác vụ:** `[Thành công hoàn toàn / Thành công có trợ giúp / Thất bại]`
- **Điểm SEQ (1–7):** `[.../7]` | **Điểm SUS:** `[.../100]`

### Nhật ký Quan sát (Observation Log — P4)

| Mốc thời gian | Thao tác quan sát được | Trích dẫn Think-Aloud | Điểm nghẽn / Lỗi / Do dự |
| :---: | :--- | :--- | :--- |
| `00:00` | Bắt đầu xem trang Home | `"..."` | |
| `00:xx` | | `"..."` | |
| `00:xx` | | `"..."` | |
| `00:xx` | | `"..."` | |

### Điểm SUS (1–5) — P4

| Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Tổng quy đổi | Điểm SUS (`/100`) |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| | | | | | | | | | | | |

### Phỏng vấn Mở (Probe Questions — P4)
1. **Độ rõ ràng (Clarity):** `...`
2. **Khả năng khôi phục sau lỗi (Error Recovery):** `...`
3. **Tốc độ & Hiệu quả (Speed):** `...`
4. **Độ tin cậy & An tâm (Trust):** `...`
5. **Câu hỏi bổ sung theo phiên (Session-specific):** `...`

---

## 7. Biên bản Phiên P5

- **Người tham gia:** `[Họ tên]` | **Nghề nghiệp:** `[...]` | **Ngoài lớp HW03:** `[Có]`
- **SĐT/Zalo/Email *(che 4 số giữa)*:** `[09xx***xxx]`
- **Ngày giờ:** `YYYY-MM-DD HH:mm` | **Hình thức:** `[Trực tiếp / Google Meet]`
- **Bằng chứng quay màn hình + âm thanh:** `[Tên file video / link]`
- **Thời gian hoàn thành (Time on Task):** `[mm:ss]`
- **Kết quả tác vụ:** `[Thành công hoàn toàn / Thành công có trợ giúp / Thất bại]`
- **Điểm SEQ (1–7):** `[.../7]` | **Điểm SUS:** `[.../100]`

### Nhật ký Quan sát (Observation Log — P5)

| Mốc thời gian | Thao tác quan sát được | Trích dẫn Think-Aloud | Điểm nghẽn / Lỗi / Do dự |
| :---: | :--- | :--- | :--- |
| `00:00` | Bắt đầu xem trang Home | `"..."` | |
| `00:xx` | | `"..."` | |
| `00:xx` | | `"..."` | |
| `00:xx` | | `"..."` | |

### Điểm SUS (1–5) — P5

| Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Tổng quy đổi | Điểm SUS (`/100`) |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| | | | | | | | | | | | |

### Phỏng vấn Mở (Probe Questions — P5)
1. **Độ rõ ràng (Clarity):** `...`
2. **Khả năng khôi phục sau lỗi (Error Recovery):** `...`
3. **Tốc độ & Hiệu quả (Speed):** `...`
4. **Độ tin cậy & An tâm (Trust):** `...`
5. **Câu hỏi bổ sung theo phiên (Session-specific):** `...`

---

## 8. Biên bản Phiên P6

- **Người tham gia:** `[Họ tên]` | **Nghề nghiệp:** `[...]` | **Ngoài lớp HW03:** `[Có]`
- **SĐT/Zalo/Email *(che 4 số giữa)*:** `[09xx***xxx]`
- **Ngày giờ:** `YYYY-MM-DD HH:mm` | **Hình thức:** `[Trực tiếp / Google Meet]`
- **Bằng chứng quay màn hình + âm thanh:** `[Tên file video / link]`
- **Thời gian hoàn thành (Time on Task):** `[mm:ss]`
- **Kết quả tác vụ:** `[Thành công hoàn toàn / Thành công có trợ giúp / Thất bại]`
- **Điểm SEQ (1–7):** `[.../7]` | **Điểm SUS:** `[.../100]`

### Nhật ký Quan sát (Observation Log — P6)

| Mốc thời gian | Thao tác quan sát được | Trích dẫn Think-Aloud | Điểm nghẽn / Lỗi / Do dự |
| :---: | :--- | :--- | :--- |
| `00:00` | Bắt đầu xem trang Home | `"..."` | |
| `00:xx` | | `"..."` | |
| `00:xx` | | `"..."` | |
| `00:xx` | | `"..."` | |

### Điểm SUS (1–5) — P6

| Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Tổng quy đổi | Điểm SUS (`/100`) |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| | | | | | | | | | | | |

### Phỏng vấn Mở (Probe Questions — P6)
1. **Độ rõ ràng (Clarity):** `...`
2. **Khả năng khôi phục sau lỗi (Error Recovery):** `...`
3. **Tốc độ & Hiệu quả (Speed):** `...`
4. **Độ tin cậy & An tâm (Trust):** `...`
5. **Câu hỏi bổ sung theo phiên (Session-specific):** `...`

---

## 9. Biên bản Phiên P7

- **Người tham gia:** `[Họ tên]` | **Nghề nghiệp:** `[...]` | **Ngoài lớp HW03:** `[Có]`
- **SĐT/Zalo/Email *(che 4 số giữa)*:** `[09xx***xxx]`
- **Ngày giờ:** `YYYY-MM-DD HH:mm` | **Hình thức:** `[Trực tiếp / Google Meet]`
- **Bằng chứng quay màn hình + âm thanh:** `[Tên file video / link]`
- **Thời gian hoàn thành (Time on Task):** `[mm:ss]`
- **Kết quả tác vụ:** `[Thành công hoàn toàn / Thành công có trợ giúp / Thất bại]`
- **Điểm SEQ (1–7):** `[.../7]` | **Điểm SUS:** `[.../100]`

### Nhật ký Quan sát (Observation Log — P7)

| Mốc thời gian | Thao tác quan sát được | Trích dẫn Think-Aloud | Điểm nghẽn / Lỗi / Do dự |
| :---: | :--- | :--- | :--- |
| `00:00` | Bắt đầu xem trang Home | `"..."` | |
| `00:xx` | | `"..."` | |
| `00:xx` | | `"..."` | |
| `00:xx` | | `"..."` | |

### Điểm SUS (1–5) — P7

| Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Tổng quy đổi | Điểm SUS (`/100`) |
| :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| | | | | | | | | | | | |

### Phỏng vấn Mở (Probe Questions — P7)
1. **Độ rõ ràng (Clarity):** `...`
2. **Khả năng khôi phục sau lỗi (Error Recovery):** `...`
3. **Tốc độ & Hiệu quả (Speed):** `...`
4. **Độ tin cậy & An tâm (Trust):** `...`
5. **Câu hỏi bổ sung theo phiên (Session-specific):** `...`

