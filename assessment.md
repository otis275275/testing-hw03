# BẢNG TỰ ĐÁNH GIÁ ĐIỂM (SELF-ASSESSMENT — §15)

- **Môn học:** Kiểm thử Phần mềm (FIT - HCMUS) — Bài tập lớn **HW03 – GUI & Usability**
- **Sinh viên thực hiện:** **Lê Trung Thành Đạt** — MSSV: `23120228` (`23120228@student.hcmus.edu.vn`)
- **Phân công trong nhóm:** Thành viên **M2**
- **Hệ thống kiểm thử (SUT):** EShop (`http://localhost:5173`, Backend API `http://localhost:3000`)

---

## 1. Bảng Tự đánh giá Điểm (Theo mẫu §15)

| No. | Criteria | Grade | Self-Assessed Grade |
| :-: | :--- | :---: | :---: |
| **1** | **Task 1 — GUI Checklist** *(design + execution + bug report)* | **30** | **30** |
| **2** | **Task 2 — Usability Evaluation** *(task scenario + 7 sessions + analysis)* | **40** | **32** |
| **3** | **Task 3 — Cross-Browser / Cross-Platform** *(≥ 3 platforms)* | **20** | **20** |
| **4** | **Agent Skills** *(skills + demo videos)* | **10** | **10** |
| | **Total** | **100** | **92** |

---

## 2. Cơ sở Tự đánh giá Chi tiết Từng Hạng mục

1. **Task 1 — GUI Checklist (`29 / 30`):**
   - Thiết kế **49 mục kiểm tra** (`> 40` mục yêu cầu), bao phủ đủ 4 khía cạnh `IA-01` (`14`), `IA-02` (`13`), `IA-03` (`12`), `IA-04` (`10`) trên phạm vi Home (danh sách + tìm kiếm), Product Detail, Header và Footer.
   - Phân tách rõ **40 mục AI-Generated (`81.6%`)** và **9 mục Human Added (`18.4%`)** kèm phân tích lý do AI bỏ sót (`CHK-13`, `CHK-14`, `CHK-21`, `CHK-22`, `CHK-27`, `CHK-29`, `CHK-39`, `CHK-40`, `CHK-41`).
   - Thực thi đầy đủ **49/49 mục** (`27 PASS` — `55.1%`, `22 FAIL` — `44.9%`), có cột `Notes`, **22 ảnh bằng chứng lỗi** cho các mục FAIL, xuất file Excel [`testcase/gui_checklist_m2.xlsx`](./testcase/gui_checklist_m2.xlsx) (3 sheet), báo cáo lỗi [`report/bug_report.md`](./report/bug_report.md) và tạo đầy đủ **22 GitHub Issues (`#1`–`#22`)** có đính kèm ảnh tại `otis275275/testing-hw03`.
   - Tự trừ `1` điểm dự phòng cho các tiểu tiết nhỏ (ví dụ lỗi Task 3 `BUG-23` chưa log thành issue `#23` riêng trên GitHub).

2. **Task 2 — Usability Evaluation (`25 / 40`):**
   - **Phase 1 (Đạt chuẩn):** Hoàn thiện mục tiêu đánh giá, kịch bản Goal-Oriented (Flow F2), thang đo **SEQ (1–7)**, **SUS (10 câu tiếng Việt)**, **5 câu hỏi phỏng vấn mở**, Observation Log Sheet tại [`report/task2_phase1_plan_and_instruments.md`](./report/task2_phase1_plan_and_instruments.md) và công cụ web điều phối [`scripts/task2_usability_form.html`](./scripts/task2_usability_form.html).
   - **Phase 2 (`2 / 7` phiên hoàn chỉnh):** Đã phỏng vấn và thu thập đầy đủ bằng chứng video YouTube + SĐT che 4 số giữa + điểm SEQ/SUS cho **`P1`** (Hà Anh Tuấn, `093****045`, SEQ `6/7`, SUS `82.5/100`) và **`P2`** (Trần Kim Ngân, `098****128`, SEQ `6/7`, SUS `92.5/100`). Ứng viên **`P3`** (Đinh Ngọc Khánh) mới ghi nhận định danh; **Pilot và `P4`–`P7`** chưa thể thực hiện do giới hạn thời gian.
   - **Phase 3 (Đạt chuẩn phương pháp trên mẫu `n = 2`):** Tổng hợp định lượng (`SUS TB = 87.5/100`, `SEQ TB = 6.0/7`), phân tích độ nhạy và thiên lệch mẫu IT, gom nhóm 4 vấn đề (`UX-01`–`UX-04`), phân tách Systemic Design Issue với Scope Limitation, xếp hạng mức độ nghiêm trọng và ánh xạ GitHub Issues tại [`report/task2_phase3_analysis_and_report.md`](./report/task2_phase3_analysis_and_report.md).
   - Tự trừ `15` điểm do mới thực hiện `2/7` ứng viên thật và thiếu phiên Pilot.

3. **Task 3 — Cross-Browser / Cross-Platform (`19 / 20`):**
   - Thực thi tự động toàn bộ **49 mục** của M2 trên **3 engine trình duyệt**: **Google Chrome** (`27P/22F`), **Mozilla Firefox** (`26P/23F`), **Safari / WebKit Engine** (`27P/22F`) qua [`scripts/capture_task3_cross_browser.js`](./scripts/capture_task3_cross_browser.js).
   - Toàn bộ **69 ảnh chụp bằng chứng** (23 ảnh/nền tảng) đều hiển thị overlay MSSV `23120228`, họ tên `Lê Trung Thành Đạt`, email `23120228@student.hcmus.edu.vn`, URL và timestamp; phát hiện chính xác lỗi khác biệt `CHK-23` trên Firefox tại [`report/task3_cross_browser.md`](./report/task3_cross_browser.md).
   - Tự trừ `1` điểm do thực thi trên engine Playwright local thay vì BrowserStack/LambdaTest hoặc thiết bị di động Expo Go thực tế.

4. **Agent Skills (`9 / 10`):**
   - Xây dựng hoàn chỉnh 2 bộ Agent Skills chuẩn hóa (`gui-testing` và `usability-testing`) kèm `references/`, `resources/`, `examples/` tại [`skills/`](./skills/) (đồng bộ với `.agents/skills/`).
   - Đã quay và đính kèm **Video Demo YouTube** sử dụng Agent Skills end-to-end: [https://youtu.be/MBv7Ssz-0uY](https://youtu.be/MBv7Ssz-0uY).

---

## 3. Quy ước Đặt tên File Nộp (§14)
- **Tên file nén theo tổng điểm hiện tại (`Total = 82`):** `23120228_HW03_AI_GUIUsability_082.zip`

