# TASK 2 — GIAI ĐOẠN 3: PHÂN TÍCH KẾT QUẢ & BÁO CÁO ĐÁNH GIÁ KHẢ NĂNG SỬ DỤNG

- **Môn học:** Kiểm thử Phần mềm (FIT - HCMUS) — Bài tập lớn **HW03**
- **Thành viên thực hiện (M2):** Lê Trung Thành Đạt — MSSV: `23120228` (`23120228@student.hcmus.edu.vn`)
- **Hệ thống kiểm thử (SUT):** EShop Web (`http://localhost:5173`, Backend API `http://localhost:3000`)
- **Luồng End-to-End được đánh giá (Flow F2):** Tìm sản phẩm theo nhu cầu $\rightarrow$ Xem chi tiết $\rightarrow$ Chọn số lượng & Thêm vào giỏ hàng $\rightarrow$ Vào `/cart` xác minh sản phẩm đã lưu $\rightarrow$ Quay về Home
- **Tài liệu liên quan:**
  - Kế hoạch & công cụ Phase 1: [`task2_phase1_plan_and_instruments.md`](./task2_phase1_plan_and_instruments.md)
  - Biên bản phiên thu thập Phase 2: [`task2_phase2_session_logs.md`](./task2_phase2_session_logs.md)
  - Báo cáo lỗi & GitHub Issues: [`bug_report.md`](./bug_report.md) · [GitHub Issues (`#1`–`#22`)](https://github.com/otis275275/testing-hw03/issues)

> [!WARNING]
> **Giới hạn cỡ mẫu thực tế (`n = 2 / 7` phiên hoàn chỉnh):** Do hạn chế thời gian trước hạn nộp bài, hiện tại nhóm mới thu thập và phân tích đầy đủ dữ liệu phỏng vấn thực tế từ **2 ứng viên (`P1` và `P2`)** có video & transcript xác thực. Ứng viên **`P3` (Đinh Ngọc Khánh)** mới ghi nhận thông tin định danh ban đầu (chưa thực hiện phiên test), còn **Pilot và `P4`–`P7`** chưa thể triển khai. Báo cáo Phase 3 dưới đây phản ánh trung thực **100% dữ liệu quan sát từ 2 phiên `P1` và `P2`**, không ngụy tạo dữ liệu cho các phiên chưa thực hiện.

---

## 1. Tổng quan Mẫu Dữ liệu Thực tế (`n = 2`)

| Mã | Họ tên | Đối tượng / Nền tảng | SĐT *(che 4 số giữa)* | Nhiệm vụ thực tế | Time on Task | Kết quả tác vụ | SEQ (`1–7`) | SUS (`/100`) | Bằng chứng |
| :-: | :--- | :--- | :---: | :--- | :---: | :--- | :---: | :---: | :--- |
| **P1** | Hà Anh Tuấn | Sinh viên IT năm 4 (VGU) — Ngoài lớp HW03 | `093****045` | Tìm điện thoại iPhone giá 30 triệu $\rightarrow$ Chi tiết $\rightarrow$ Thêm giỏ $\rightarrow$ Xem giỏ | `00:37` *(video `07:11`)* | Thành công hoàn toàn *(tự thao tác)* | **6 / 7** | **82.5** *(92.5 nếu hiệu chỉnh Q6)* | [Video P1](https://youtu.be/hSGZJhJrAhA) · [`candidate 1 transcript`](./%5BVietnamese%20%28auto-generated%29%5D%20Software%20Testing%20homework%203%20-%20candidate%201%20%5BDownSub.com%5D.txt) |
| **P2** | Trần Kim Ngân | Sinh viên IT năm 4 (HCMUS) *(chờ xác nhận ngoài lớp)* | `098****128` | Tìm MacBook $\rightarrow$ Chi tiết $\rightarrow$ Thêm giỏ $\rightarrow$ Xem giỏ | `00:56` *(video `04:50`)* | Thành công hoàn toàn *(có nhắc bước từ ĐPV)* | **6 / 7** | **92.5** | [Video P2](https://youtu.be/1EfXQpylgmQ) *(YouTube: Dat Thanh)* |
| **Tổng / TB** | **`n = 2`** | **100% Sinh viên IT năm 4** | **2/2 có SĐT** | **Core Path Flow F2** | **TB: `00:47`** | **2 / 2 (100%)** | **6.0 / 7** | **87.5 / 100** | — |

---

## 2. Chấm điểm & Phân tích Định lượng (SUS & SEQ)

### 2.1. Bảng Điểm Quy đổi Chi tiết Từng Câu SUS (`Q1`–`Q10`)

Công thức chuẩn theo tài liệu Phase 1 và `skills/usability-testing`:
- Câu lẻ (`Q1, Q3, Q5, Q7, Q9`): $Score_i = \text{Điểm gốc} - 1$
- Câu chẵn (`Q2, Q4, Q6, Q8, Q10`): $Score_i = 5 - \text{Điểm gốc}$
- $\text{SUS Score} = \left(\sum_{i=1}^{10} Score_i\right) \times 2.5$

| Câu hỏi SUS | Chiều | P1 (Gốc $\rightarrow$ Quy đổi) | P2 (Gốc $\rightarrow$ Quy đổi) | TB Gốc | TB Quy đổi (`/4.0`) | Diễn giải từ dữ liệu phiên |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Q1.** Sử dụng trang web thường xuyên | `+` | `3` $\rightarrow$ `2` | `4` $\rightarrow$ `3` | `3.5` | `2.5` | Thấp nhất trong các câu tích cực; P1 nhận xét kho chỉ có 5 SP nên ít nhu cầu dùng lại. |
| **Q2.** Phức tạp không cần thiết | `-` | `1` $\rightarrow$ `4` | `1` $\rightarrow$ `4` | `1.0` | `4.0` | Cả 2 ứng viên đều thấy giao diện đơn giản, ít thành phần gây nhiễu. |
| **Q3.** Trang web dễ sử dụng | `+` | `5` $\rightarrow$ `4` | `5` $\rightarrow$ `4` | `5.0` | `4.0` | Cấu trúc Home $\rightarrow$ Detail $\rightarrow$ Cart quen thuộc với sinh viên IT. |
| **Q4.** Cần hỗ trợ kỹ thuật | `-` | `1` $\rightarrow$ `4` | `1` $\rightarrow$ `4` | `1.0` | `4.0` | Không cần người hướng dẫn về mặt kỹ thuật để thao tác cơ bản. |
| **Q5.** Các chức năng tích hợp tốt | `+` | `4` $\rightarrow$ `3` | `4` $\rightarrow$ `3` | `4.0` | `3.0` | **P2 chủ động trừ 1 điểm:** *"trừ 1 điểm tại không có thông báo thôi"*. |
| **Q6.** Có quá nhiều điểm thiếu nhất quán | `-` | `5*` $\rightarrow$ `0` | `1` $\rightarrow$ `4` | `3.0` | `2.0` | **Bất thường ghi âm ở P1:** nói *"cũng nhất quán rồi"* nhưng đọc `5` (có thể nhầm chiều phủ định). |
| **Q7.** Học cách sử dụng rất nhanh | `+` | `5` $\rightarrow$ `4` | `4*` $\rightarrow$ `3` | `4.5` | `3.5` | P2 chấm `4` *(ghi chú: ĐPV đọc nhầm thành "học cách xây dựng trang web")*. |
| **Q8.** Cảm thấy rườm rà khi dùng | `-` | `1` $\rightarrow$ `4` | `1` $\rightarrow$ `4` | `1.0` | `4.0` | Quy trình tìm kiếm và xem thông tin ngắn gọn. |
| **Q9.** Cảm thấy tự tin khi sử dụng | `+` | `5*` $\rightarrow$ `4` | `5` $\rightarrow$ `4` | `5.0` | `4.0` | Cả 2 đều tự tin ở tác vụ cơ bản *(P1 phụ đề ghi `"N"`, cần đối chiếu audio để chốt `5`)*. |
| **Q10.** Phải học nhiều thứ trước khi dùng | `-` | `1` $\rightarrow$ `4` | `1` $\rightarrow$ `4` | `1.0` | `4.0` | Đường cong học tập (learning curve) rất thấp. |
| **Tổng hợp** | — | **`33` $\rightarrow$ `82.5`** | **`37` $\rightarrow$ `92.5`** | — | **TB: `87.5 / 100`** | **Grade A (> 80.3)** *(phân tích độ nhạy bên dưới)* |

### 2.2. Nhận xét Định lượng & Phân tích Độ nhạy (Sensitivity & Bias Analysis)
1. **Điểm SEQ (Single Ease Question):** Cả `P1` và `P2` đều chấm **`6 / 7`** (trung bình **`6.0 / 7`**), cho thấy tác vụ tìm kiếm $\rightarrow$ xem chi tiết $\rightarrow$ thêm giỏ $\rightarrow$ kiểm tra được đánh giá gần mức rất dễ, nhưng **chưa đạt `7/7`** đúng tại bước chuyển từ *Thêm vào giỏ* sang *Xác nhận trạng thái*.
2. **Điểm SUS trung bình `87.5 / 100` (Grade A):**
   - Theo số ghi nhận nguyên văn: $\text{Mean} = (82.5 + 92.5) / 2 = \mathbf{87.5}$ (`SD = 7.07`).
   - Nếu kiểm chứng audio cho thấy `P1` thực chất muốn chọn `1` ở câu phủ định `Q6`, điểm `P1` tăng lên `92.5` và điểm trung bình là **`92.5 / 100`**.
3. **Tại sao điểm SUS cao nhưng vẫn tồn tại lỗi UX rõ rệt?**
   - **Thiên lệch đối tượng mẫu (IT-Background Bias):** Cả `2/2` người tham gia đều là sinh viên IT năm 4 (`VGU` và `HCMUS`). Khi thiếu thông báo phản hồi ở nút *"Thêm vào giỏ"*, họ không bỏ cuộc mà **tự suy luận theo thói quen web** (nhìn nút *"đậm/đập tí"* hoặc tự click vào `/cart` để kiểm tra). Với người dùng phổ thông (Non-IT), sự mơ hồ này dễ dẫn tới click nhiều lần (kích hoạt thêm lỗi `CHK-40`/`CHK-42`) hoặc bỏ dở vì tưởng nút hỏng.
   - **Điểm trừ tập trung đúng một nút thắt:** Trong bảng SUS, 6/10 câu đạt tuyệt đối (`4.0/4.0` quy đổi), chỉ có **Q5 (tích hợp chức năng)** bị cả 2 ứng viên trừ xuống `4/5` và **Q1 (tần suất dùng)** xuống `3.5/5`.

---

## 3. Tổng hợp Quan sát & Phân biệt Loại Vấn đề (Pain Points Synthesis)

Gộp toàn bộ trích dẫn Think-Aloud, quan sát thao tác và trả lời phỏng vấn mở từ `P1` và `P2`, các vấn đề được phân nhóm và phân tách rõ giữa **lỗi thiết kế mang tính hệ thống (Systemic Design Issue)** với **lỗi cục bộ / giới hạn dữ liệu mẫu (Isolated / Scope Issue)**.

### Bảng Tổng hợp các Nhóm Điểm nghẽn (UX Pain Points)

| Mã UX | Tên nhóm vấn đề | Tần suất gặp | Bằng chứng trực tiếp từ phiên (`P1`, `P2`) | Phân loại bản chất | Ánh xạ Heuristic (Nielsen) | Mức độ nghiêm trọng (Severity) |
| :---: | :--- | :---: | :--- | :--- | :--- | :---: |
| **UX-01** | **Thiếu hoàn toàn phản hồi xác nhận & chỉ báo số lượng khi thêm vào giỏ hàng** | **2 / 2** (`100%`) | • **P1:** *"Không biết thêm chưa nhưng mà có vẻ thêm rồi á. Cái nút nó chỉ đậm/đập tí thôi."* / *"Mình bấm thêm vào giỏ không thấy phản hồi lắm thì mình vô giỏ xem thì mình mới biết..."*<br>• **P2:** *"ồ đã thiệt nhưng mà mình không thấy nó thông báo nhỉ."* + Trừ 1 điểm SUS Q5 (*"trừ 1 điểm tại không có thông báo thôi"*). | **Systemic Design Issue** *(xuyên suốt Header, Home & Product Detail)* | **#1 Visibility of System Status** · **#4 Consistency & Standards** | **Major** *(Nghiêm trọng — P1)* |
| **UX-02** | **Đứt gãy định hướng bước tiếp theo sau khi xem chi tiết & thêm vào giỏ** | **2 / 2** (`100%`) | • **P2:** *"Ủa giờ mình phải thêm vô giỏ hàng hả bạn hay là giờ..."* *(phân vân sau khi xem chi tiết, phải hỏi điều phối viên; sau khi thêm vào giỏ tiếp tục cần ĐPV gợi ý tìm giỏ hàng).*<br>• **P1:** Tự đoán vào giỏ kiểm tra, xong hỏi: *"xong rồi mình có thanh toán không bạn ơi?"* | **Systemic Design Issue** *(thiếu điều hướng phân cấp & chuyển tiếp luồng)* | **#1 Visibility of System Status** · **#6 Recognition Rather than Recall** | **Minor $\rightarrow$ Major** *(cản trở khả năng tự chủ luồng ở P2)* |
| **UX-03** | **Danh mục sản phẩm mẫu quá ít (5 SP) làm giảm ý nghĩa tìm kiếm & ý định quay lại** | **1 / 2** (`50%`) | • **P1 (Probe Speed):** *"Tại vì có năm sản phẩm cho nên tìm cũng không có ý nghĩa lắm."*<br>• Phản ánh qua điểm SUS **Q1 = 3/5** (`P1`) và **4/5** (`P2`). | **Scope / Data Limitation** *(giới hạn dữ liệu demo SUT, kết hợp thiếu phân trang nếu mở rộng)* | **#7 Flexibility and Efficiency of Use** | **Cosmetic / Minor** |
| **UX-04** | **Sai lệch điều phối & độ phủ kịch bản trong thực tế thu thập** | **2 / 2** (`100%` phiên) | • Cả 2 phiên giao tìm từ khóa có sẵn (`iPhone`, `MacBook`) nên chưa kích hoạt tình huống *tìm không ra sản phẩm (`"Sony"`)* hoặc *nhập sai số lượng*.<br>• ĐPV nhắc bước cho P2 và đọc nhầm từ ở SUS Q7; P1 có sai khác miệng/số ở Q6. | **Evaluation Process Issue** *(không phải lỗi phần mềm EShop, cần ghi nhận để minh bạch)* | — *(Chất lượng dữ liệu đánh giá)* | **Methodological Note** |

### Phân tích Chuyên sâu: Lỗi Cục bộ vs. Vấn đề Thiết kế Hệ thống
1. **Vấn đề Thiết kế Hệ thống (Systemic Design Issues — `UX-01`, `UX-02`):**
   - Trong cả 2 phiên độc lập với 2 sản phẩm khác nhau (`iPhone 15` và `MacBook`), điểm nghẽn rơi vào **cùng một vị trí cấu trúc**: giao điểm giữa **Product Detail** $\rightarrow$ **Header (`Giỏ hàng`)**.
   - Nguyên nhân gốc không nằm ở một dòng chữ đơn lẻ mà do kiến trúc UI thiếu hẳn **Feedback Loop**: nút bấm không phát Toast/banner xác nhận, Header không có Cart Badge cập nhật real-time, trang chi tiết không có Breadcrumbs hay CTA chuyển tiếp sang `/cart`. Kết quả là người dùng mất trạng thái an tâm ngay sau hành động quan trọng nhất của luồng mua sắm.
2. **Vấn đề Cục bộ / Bối cảnh (`UX-03`) & Khoảng trống Chưa được Kích hoạt từ Task 1:**
   - Lời phàn nàn của `P1` về việc *"chỉ có 5 sản phẩm"* mang tính bối cảnh demo hơn là bug giao diện.
   - Ngoài ra, đối chiếu với **22 GUI Bugs ở Task 1** ([`bug_report.md`](./bug_report.md)), do 2 phiên thực tế chạy theo từ khóa hợp lệ (`iPhone`, `MacBook`) với số lượng mặc định `1` và không có phiên Pilot sàng lọc trước, các lỗi nghiêm trọng khác trên Flow F2 đã phát hiện ở Task 1 **chưa được kích hoạt trong phiên người dùng** (cần bổ sung vào danh sách ưu tiên sửa lỗi tổng thể):
     - **Dead Click (`BUG-16` / `CHK-40` — Critical):** Nút `"Thêm vào giỏ hàng"` bỏ qua click đầu tiên khi state chưa đồng bộ; nếu người dùng phổ thông chỉ click 1 lần rồi thấy im lặng (`UX-01`), họ sẽ thất bại ngầm ở giỏ hàng trống.
     - **Empty State Search (`BUG-21` / `CHK-46` — Major):** Vùng danh sách trắng trơn khi tìm từ khóa không tồn tại.
     - **Quantity Boundary (`BUG-06..08`, `BUG-23` — Major):** Cho phép nhập số âm, `0.5`, quá lớn hoặc chữ `"abc"` trên Firefox.

---

## 4. Xếp hạng Ưu tiên & Đối chiếu GitHub Issues

| Thứ tự ưu tiên | Mức độ (Severity) | Vấn đề Usability & Nguyên nhân Kỹ thuật | GitHub Issue đã log | Đề xuất Khắc phục (Actionable Fix) |
| :-: | :---: | :--- | :--- | :--- |
| **P0 (Khẩn cấp)** | **Critical / Blocker tiềm ẩn** | **Dead Click lần bấm đầu & click liên tục không ổn định** trên nút `"Thêm vào giỏ hàng"` (kích hoạt ngầm rủi ro mất hàng khi thiếu thông báo `UX-01`). | [#16 (`CHK-40`)](https://github.com/otis275275/testing-hw03/issues/16)<br>[#18 (`CHK-42`)](https://github.com/otis275275/testing-hw03/issues/18) | Rà soát `ProductDetail.jsx` và `CartContext.jsx` để đảm bảo hàm `addToCart` thực thi ngay từ click đầu tiên (`clickCount === 1`), khóa double-submit hoặc debounce hợp lý. |
| **P1 (Cao)** | **Major** | **`UX-01`: Thiếu hoàn toàn Toast xác nhận & Badge số lượng trên Header** khi thêm sản phẩm từ Product Detail / Home (`2/2` người dùng bị khựng). | [#11 (`CHK-30`)](https://github.com/otis275275/testing-hw03/issues/11)<br>[#19 (`CHK-43`)](https://github.com/otis275275/testing-hw03/issues/19) | Thêm **Cart Badge** hiển thị tổng số lượng trên Header (cập nhật ngay từ `CartContext`), kèm **Toast Notification** (`"Đã thêm vào giỏ hàng — Xem giỏ"`) tồn tại 3 giây. |
| **P2 (Trung bình)** | **Minor $\rightarrow$ Major** | **`UX-02`: Thiếu chỉ dẫn chuyển bước & định vị vị trí trang** (thiếu Breadcrumbs, Active Nav State, liên kết nhanh sang `/cart` sau khi thêm). | [#13 (`CHK-32`)](https://github.com/otis275275/testing-hw03/issues/13)<br>[#14 (`CHK-34`)](https://github.com/otis275275/testing-hw03/issues/14) | Bổ sung Breadcrumbs `Trang chủ / Tên sản phẩm` ở `/product/:id`, highlight tab đang mở trên Header, và cung cấp nút/link `"Đi tới giỏ hàng"` ngay trong thông báo xác nhận. |
| **P3 (Thấp)** | **Minor / Cosmetic** | **`UX-03` & Đồng nhất thị giác:** Dữ liệu mẫu ít (5 SP), thiếu phân trang, khác màu nút chính (`Home` xanh dương vs `Detail` xanh lá), hiển thị `VND` vs `₫`. | [#2 (`CHK-03`)](https://github.com/otis275275/testing-hw03/issues/2)<br>[#3 (`CHK-07`)](https://github.com/otis275275/testing-hw03/issues/3)<br>[#10 (`CHK-29`)](https://github.com/otis275275/testing-hw03/issues/10) | Chuẩn hóa màu CTA chính (xanh dương theo thiết kế) và đơn vị `₫` giữa các màn hình; bổ sung seed data đa dạng hơn và phân trang khi mở rộng danh mục. |

> [!NOTE]
> Toàn bộ ảnh chụp bằng chứng kỹ thuật của các lỗi `CHK-30`, `CHK-32`, `CHK-34`, `CHK-40`, `CHK-42`, `CHK-43`, `CHK-03`, `CHK-07`, `CHK-29` đã được gắn trực tiếp trên từng Issue tại [`otis275275/testing-hw03/issues`](https://github.com/otis275275/testing-hw03/issues) và lưu trong [`bug_report.md`](./bug_report.md). Khoảnh khắc người dùng gặp khó khăn trong thực tế được lưu tại hai video đối thoại [Video P1](https://youtu.be/hSGZJhJrAhA) và [Video P2](https://youtu.be/1EfXQpylgmQ).

---

## 5. Kết luận & Bài học Rút ra cho Lần Đánh giá Tiếp theo

1. **Kết luận chính từ dữ liệu `n = 2`:** Luồng Flow F2 của EShop đạt tỷ lệ hoàn thành `100%` (`2/2`), `SEQ = 6.0/7`, `SUS = 87.5/100` (Grade A) với nhóm sinh viên IT, **nhưng** 100% người dùng đều khựng lại hoặc trừ điểm vì **thiếu phản hồi trạng thái sau khi bấm "Thêm vào giỏ"** (`UX-01`) và lúng túng bước chuyển tiếp (`UX-02`). Đây là nút thắt ưu tiên cao nhất cần sửa trước khi đưa ứng dụng cho người dùng phổ thông (Non-IT).
2. **Hạn chế cần khắc phục nếu bổ sung thêm `P3`–`P7`:**
   - Tuyển người dùng **ngoài ngành IT** (đúng tinh thần Phase 1) để tránh việc người dùng tự suy đoán cấu trúc bù đắp cho thiếu sót UI.
   - Bắt buộc chạy kịch bản **Goal-Oriented** (kèm điều kiện lọc giá, từ khóa không tồn tại `"Sony"`, và thay đổi số lượng) và **giữ im lặng trung lập** (không nhắc bước tiếp theo như ở P2).
   - Kiểm tra lại cách đọc câu hỏi phủ định trên thang SUS (đặc biệt Q6) và trích xuất mốc thời gian (`mm:ss`) chính xác từ video quay màn hình.

