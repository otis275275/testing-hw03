# HW03 — GUI & Usability Testing (EShop SUT) — Thành viên M2

- **Môn học:** Kiểm thử Phần mềm (FIT - HCMUS) — Bài tập lớn **HW03**
- **Sinh viên thực hiện:** **Lê Trung Thành Đạt**
- **MSSV:** `23120228` | **Email:** `23120228@student.hcmus.edu.vn`
- **Phân công phạm vi (M2):**
  - **Task 1 (GUI Checklist):** Home *(danh sách sản phẩm + tìm kiếm)*, Product Detail, Header & Footer toàn cục *(Web; không kiểm tra `/cart`)*
  - **Task 2 (Usability Flow F2):** Tìm sản phẩm theo nhu cầu $\rightarrow$ Xem chi tiết $\rightarrow$ Chọn số lượng & Thêm vào giỏ $\rightarrow$ Vào `/cart` xác minh $\rightarrow$ Quay về trang chủ
  - **Task 3 (Cross-Browser):** 49 mục GUI Checklist trên **Google Chrome**, **Mozilla Firefox**, **Safari / WebKit Engine**
- **Repository & GitHub Issues:** [https://github.com/otis275275/testing-hw03](https://github.com/otis275275/testing-hw03) · [22 Open Issues](https://github.com/otis275275/testing-hw03/issues)
- **Tài liệu đặc tả SUT gốc (SRS):** [`SRS_EShop.md`](./SRS_EShop.md)

---

## 1. Bảng Tự đánh giá Điểm (Self-Assessment Table — §15)

> [!IMPORTANT]
> Sau khi hoàn tất các phiên **Task 2 (Pilot + P2–P7)** và quay/gắn link **Video Demo YouTube (Task 4)**, vui lòng cập nhật lại cột *Self-Assessed Grade* và tổng điểm 3 chữ số cho tên file nén `<StudentID>_HW03_AI_GUIUsability_<SelfAssessedGrade>.zip`.

| No. | Criteria | Max Grade | Self-Assessed Grade | Ghi chú hiện trạng |
| :-: | :--- | :---: | :---: | :--- |
| **1** | **Task 1 — GUI Checklist** *(design + execution + bug report)* | **30** | **29** | Hoàn thành 49 mục (> 40), phản biện AI (40) vs Human (9), thực thi đầy đủ, 22 ảnh bằng chứng, Excel `.xlsx`, báo cáo lỗi & 22 GitHub Issues (`#1`–`#22`). |
| **2** | **Task 2 — Usability Evaluation** *(task scenario + 7 sessions + analysis)* | **40** | *(Chờ hoàn thành)* | Đã xong Phase 1 (`task2_phase1_plan_and_instruments.md`), công cụ điều phối HTML, và đã điền `1/7` người tham gia thật (`P1`: Hà Anh Tuấn). Đang chờ Pilot + `P2`–`P7` + Phase 3. |
| **3** | **Task 3 — Cross-Browser / Cross-Platform** *(≥ 3 platforms)* | **20** | **19** | Đã chạy thực thi 49 mục trên 3 engine: Chrome, Firefox, Safari/WebKit (`69` ảnh có overlay MSSV + họ tên + email), phát hiện lỗi khác biệt `CHK-23` trên Firefox. |
| **4** | **Agent Skills** *(skills + demo videos)* | **10** | *(Chờ link video)* | Đã hoàn thiện 2 bộ skill (`gui-testing`, `usability-testing`) tại `skills/` và `.agents/skills/`; đang chờ bạn quay và gắn link YouTube demo. |
| | **Total** | **100** | *(Cập nhật trước khi nén nộp)* | |

---

## 2. Báo cáo Tóm tắt Kiểm thử (Test Summary Report — §14)

| Chỉ số thống kê | Kết quả ghi nhận | Chi tiết & Tài liệu tham chiếu |
| :--- | :---: | :--- |
| **Số màn hình / thành phần đã kiểm thử (Task 1)** | **4** | Primary: **Home** (Danh sách + Tìm kiếm); Secondary/Global: **Product Detail**, **Header**, **Footer** |
| **Số luồng End-to-End đã thiết kế (Task 2)** | **1 luồng (F2)** | Tìm kiếm $\rightarrow$ Chi tiết SP $\rightarrow$ Chọn số lượng & Thêm giỏ $\rightarrow$ Xác nhận trong Giỏ hàng $\rightarrow$ Quay về Home |
| **Số mục GUI Checklist đã thiết kế** | **49 mục** | 40 AI-Generated (`81.6%`) + 9 Human Added (`18.4%`), vượt mức tối thiểu > 40 mục |
| **Số mục đã thực thi (Executed)** | **49 / 49 mục** | Bao phủ đủ 4 khía cạnh: `IA-01` (14), `IA-02` (13), `IA-03` (12), `IA-04` (10) |
| **Số mục Đạt (Passed) — Task 1 (Chrome)** | **27 mục (55.1%)** | `IA-01`: 9, `IA-02`: 9, `IA-03`: 6, `IA-04`: 3 |
| **Số mục Không đạt (Failed) — Task 1 (Chrome)** | **22 mục (44.9%)** | `IA-01`: 5, `IA-02`: 4, `IA-03`: 6, `IA-04`: 7 — có 22 ảnh chụp bằng chứng |
| **Số nền tảng Cross-Browser (Task 3)** | **3 nền tảng** | **Chrome** (`27P/22F`), **Firefox** (`26P/23F`), **Safari/WebKit** (`27P/22F`) |
| **Tổng số Bug phát hiện & Báo cáo** | **23 bugs** | **22 GUI bugs** đã log lên GitHub Issues (`#1`–`#22`) + **1 Cross-Browser bug** (`CHK-23` Firefox) |
| **Số người tham gia Usability (Task 2)** | **1 / 7** *(đang tiến hành)* | Đã hoàn thành `P1` (Hà Anh Tuấn, `093****045`, SEQ `6/7`, SUS `82.5`); chờ Pilot + `P2`–`P7` |
| **Số Agent Skills đã xây dựng** | **2 skills** | `gui-testing` & `usability-testing` (đồng bộ ở `skills/` và `.agents/skills/`) |

### Video Minh họa (Demo Videos — Task 4)
- **Video Demo Skill `gui-testing` & `usability-testing` (YouTube):** `[Chờ bạn điền link YouTube trước khi nộp bài]`
- **Ghi hình các phiên Usability Testing (Task 2):** Lưu tham chiếu từng phiên tại [`report/task2_phase2_session_logs.md`](./report/task2_phase2_session_logs.md).

---

## 3. Danh mục Tài liệu Nộp bài (Deliverables Directory)

| Hạng mục theo §14 | File Markdown / Dữ liệu | File PDF / Excel |
| :--- | :--- | :--- |
| **Main Report** | [`report/main_report.md`](./report/main_report.md) | [`report/main_report.pdf`](./report/main_report.pdf) |
| **GUI Checklist (> 40 items)** | [`testcase/gui_checklist_m2.md`](./testcase/gui_checklist_m2.md) | [`testcase/gui_checklist_m2.xlsx`](./testcase/gui_checklist_m2.xlsx) |
| **Bug Report & GitHub Issues** | [`report/bug_report.md`](./report/bug_report.md) | [`report/bug_report.pdf`](./report/bug_report.pdf) |
| **Task 2 Usability Plan & Logs** | [`report/task2_phase1_plan_and_instruments.md`](./report/task2_phase1_plan_and_instruments.md)<br>[`report/task2_phase2_session_logs.md`](./report/task2_phase2_session_logs.md) | [`report/task2_phase1_plan_and_instruments.pdf`](./report/task2_phase1_plan_and_instruments.pdf)<br>*(bảng điểm & form hỗ trợ: [`scripts/task2_usability_form.html`](./scripts/task2_usability_form.html))* |
| **Task 3 Cross-Browser Report** | [`report/task3_cross_browser.md`](./report/task3_cross_browser.md) | [`report/task3_cross_browser.pdf`](./report/task3_cross_browser.pdf) |
| **Screenshots Evidence** | Task 1 & GitHub Issues: [`report/screenshots/`](./report/screenshots/)<br>Task 3 (69 ảnh): [`report/screenshots/task3/`](./report/screenshots/task3/) | — |
| **AI Critique (200–300 words)** | [`report/AI_critique.md`](./report/AI_critique.md) | [`report/AI_critique.pdf`](./report/AI_critique.pdf) |
| **AI Audit Report** | [`AI.log.md`](./AI.log.md) | [`AI.log.pdf`](./AI.log.pdf) |
| **Agent Skills** | [`skills/gui-testing/`](./skills/gui-testing/) · [`skills/usability-testing/`](./skills/usability-testing/) | — |
| **Git Commit Log** | [`git_commit_log.txt`](./git_commit_log.txt) | — |

---

## 4. Hướng dẫn Chạy lại SUT & Script Kiểm thử

1. **Khởi động Backend & Frontend Web:**
   ```bash
   cd backend && npm start
   cd frontend-web && npm run dev
   ```
2. **Chạy lại kiểm thử đa trình duyệt (Task 3):**
   ```bash
   node scripts/capture_task3_cross_browser.js
   ```
3. **Xuất lại file Excel Checklist & các file PDF báo cáo:**
   ```bash
   node scripts/generate_excel_checklist.js
   node scripts/generate_pdf.js
   ```
