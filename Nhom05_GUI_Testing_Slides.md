# SLIDES — SEMINAR GUI TESTING (NHÓM 05\) — BẢN MARKDOWN

**Nguồn:** xuất từ 32 slide của deck (bản PNG \+ 2 video) bằng OCR ngày 28/10/2026. **Cách dùng:** đây là bản text đi kèm bộ slide nộp cho GV (`Nhom05_GUI_Testing_Slides.pdf`). Lỗi chính tả do OCR có thể xảy ra — nên rà một lượt trước khi trình chiếu. **Video:** các slide 27 và 29 là video, phát trong `Slide/Presenter.html` hoặc xem tại [https\://youtu.be/KRZuE-sEqzE](https://youtu.be/KRZuE-sEqzE)

---

## Slide 1 — SEMINAR

GUI TESTING Thực hiện bởi nhóm 05 Nguyễn Hoàng Liêm    Trần Đại Hiệp Nguyễn Thanh Huyền   Trần Quốc Huy Nguyễn Phúc Hậu kiểm thử phần mềm

---

## Slide 2 — MỤC LỤC

- Thông tin chung GUI Testing  
- Các nguyên tắc thiết kế GUI  
- GUI Checklist  
- Data driven testing  
- Record and playback  
- Checkpoint and assertion  
- Các công cụ GUI Testing BUSINESS MODEL CANVAS 2

---

## Slide 3 — Thế nào là GUI Testing?

- Quá trình kiểm tra các thành phần giao diện như nút bấm, ô nhập liệu, menu và cách bố trí để đảm bảo chúng hiển thị đúng, hoạt động chính xác và mang lại trải nghiệm tốt cho người dùng.  
- Preview Window  
- ButtonGroup  
- RadioButton1  
- RadioButton2  
- RadioButton3  
- ButtonGroup2  
- CheckBox1  
- CheckBox2  
- 50%  
- 3

---

## Slide 4 — Hiểu lầm thường gặp

GUI Testing vs Functional Testing vs UX Testing GUI Kiểm chứng các thuộc tính về thị giác (font chữ, màu sắc...) của thành phần giao diện có khớp với thiết kế FUNCTIONAL Kiểm chứng dữ liệu đầu vào/ đầu ra, quy tắc tính toán giỏ hàng, xử lý giao dịch thanh toán... UX Đánh giá mức độ thuận tiện và tâm lý của người dùng thực tế khi thực hiện thao tác trên ứng dụng 4

---

## Slide 5 — GUI Testing vs Functional Testing vs UX Testing

- United States  
- Germany  
- United Kingdom  
- Brazil  
- Card  
- ACH bank debit  
- ...  
- Card number  
- 1234 1234 1234 1234  
- VISA  
- AMEX  
- DISCOVER  
- Expiration date  
- Security code  
- MM/YY  
- CVV  
- Pay \$175.00  
- 5

---

## Slide 6 — Các nguyên tắc thiết kế GUI

Consistency: Toàn bộ hệ thống phải tuân thủ đồng nhất một bộ màu sắc, phông chữ... trên mọi màn hình 6

---

## Slide 7 — Các nguyên tắc thiết kế GUI

- Error Prevention: Thiết kế các chốt chặn ngay trên giao diện để ngăn ngừa lỗi có thể xảy ra do thao tác người dùng.  
- Số thẻ cho phép tối đa 16 chữ số  
- Bắt buộc hiển thị định dạng ngày tháng MM/YY  
- United States  
- Germany  
- United Kingdom  
- Brazil  
- Card  
- ACH bank debit  
- ...  
- Card number  
- 1234 1234 1234 1234  
- VISA  
- DISCOVER  
- Expiration date  
- Security code  
- MM/YY  
- CVV  
- Pay \$175.00  
- 7

---

## Slide 8 — **Các nguyên tắc thiết kế GUI**

* **System Feedback:** Mọi thao tác của người dùng hoặc sự kiện hệ thống phải có phản hồi thị giác ngay lập tức trong vòng 0.1 s \- 1 s  
* Normal  
* Hover  
* Disabled  
* Filters  
* Filters  
* Filters  
* Menu  
* Menu  
* Menu  
* Download  
* Download  
* Download  
* Send  
* Send  
* Send  
* Favorite  
* Favorite  
* Favorite  
* 8

---

## Slide 9 — **4 nhóm lỗi GUI**

* **Visual & Layout Bugs**  
* Reasoning \>  
* Worked with 2 files. \>  
* Removed the duplicate "Assignments" key on line 139  
  - it was already defined on line 58\.  
* Fix component interaction errors  
* Updated file  
* Version 7  
* 1 edited file  
* 1 paragraph  
* Lỗi liên quan đến cách sắp xếp, kích thước và hiển thị các thành phần giao diện, thường do bố cục hoặc quy tắc định dạng chưa phù hợp  
* **State Bugs**  
* My files  
* You have no files yet  
* Lỗi liên quan đến trạng thái của các thành phần giao diện khi tương tác, thường do xử lý trạng thái hoặc cập nhật dữ liệu không chính xác.  
* **Responsive Bugs**  
* 11:24  
* 42%  
* Our Services \- marketi...  
* marketing0f405f3947-ghdwb...  
* 01 Market Research  
* 02 Market Entry  
* Support overseas companies throughout  
* Provide market...  
* Lỗi liên quan đến bố cục và khả năng hiển thị giao diện trên các kích thước màn hình khác nhau, thường do thiết kế chưa phù hợp  
* **Typo & Localization**  
* BUY NOW  
* JETZT RFUFU  
* Lỗi liên quan đến chính tả, nội dung và ngôn ngữ hiển thị, thường do sai sót trong nhập liệu hoặc xử lý bản dịch 9

---

## Slide 10 — Project: \_\_\_\_\_\_\_\_ Screen / Flow: \_\_\_\_\_\_\_\_ Build: \_\_\_\_\_\_\_\_ Reviewer: \_\_\_\_\_\_\_\_ Date: \_\_\_\_\_\_\_\_

Mark ☒ in the Pass or Fail column; write N/A in Notes where a check does not apply.

# Category	Checkpoint	Verification criteria	Pass	Fail	Notes / Evidence

1	Visual Consistency	Alignment	Labels, input boxes, headers, and buttons are aligned uniformly along a clear visual grid.	☐	☐ 2	Visual Consistency	Color & Palette	Font colors, backgrounds, and themes remain consistent across all screens.	☐	☐ 3	Visual Consistency	Typography & Content	Text and system messages are free from spelling and grammatical mistakes.	☐	☐ 4	Visual Consistency	Data Formatting	Standardized formats are maintained for dates, times, and numbers across the system.	☐	☐ 5	Controls & Inputs	Field Limits	Input fields restrict entries to valid data lengths and string limits.	☐	☐ 6	Controls & Inputs	Disabled States	Non-enterable, read-only, and disabled fields are visually distinct (e.g., grayed out).	☐	☐ 7	Controls & Inputs	Assistive Hints	Placeholders and tooltips are helpful, meaningful, and unambiguous.	☐	☐ 8	Controls & Inputs	Selection Controls	Checkboxes, radio buttons, and dropdown lists display clear default states and update properly.	☐	☐ 9	Navigation & Usability	Tab Order	The Tab and Shift \+ Tab keyboard sequence navigates logical field orders.	☐	☐ 10	Navigation & Usability	Default Actions	Primary dialogs and forms designate an appropriate default action button.	☐	☐ 11	Navigation & Usability	Keyboard Support	Standard hotkeys, accelerator keys, and keystrokes are handled consistently.	☐	☐ 12	Navigation & Usability	Hover & Focus	Interactive elements (links, buttons) display distinct visual feedback upon interaction.	☐	☐ 13	Feedback & Safety	Processing States	Cursors or visual loading indicators signal background tasks and return to normal once complete.	☐	☐ 14	Feedback & Safety	Destructive Safeguards	Confirmation prompts appear before executing permanent changes or record deletions.	☐	☐ 15	Feedback & Safety	Error Messages	Alerts use clear, non-technical language that informs without assigning blame to the user.	☐	☐ 16	Feedback & Safety	Input Validation	Invalid inputs trigger localized, visible cues such as red outlines and error labels.	☐	☐ 17	Responsive Display	Breakpoint Layout	Layout components stack and resize gracefully across screen resolutions.	☐	☐ 18	Responsive Display	Element Overlap	Floating panels, dropdowns, and images do not overlap clickable elements or labels.	☐	☐ 19	Responsive Display	Scroll Boundaries	Unintended horizontal page scrollbars are avoided on target display viewports.	☐	☐ Result: \_\_\_\_ / 19 passed · Open defects: \_\_\_\_ · Release call: ☐ Approve ☐ Approve with follow-ups ☐ Reject 10

---

## Slide 11 — GUI CHECKLIST

- Multi-screen scope  
- Triết lý: Không chỉ kiểm thử một màn hình đơn lẻ do dễ thiếu sót các lỗi. Chọn đi theo luồng của người dùng để bảo phủ nhiều mục nhất có thể (Product List → Cart → Register / Checkout)  
- 4 interface aspects  
- IA-01 (General UI Standards): Giao diện có căn thẳng hàng, đúng màu sắc và hiển thị tốt trên mobile và desktop?  
- IA-02 (Forms & Controls): Các ô nhập và nút có kiểm soát bằng điều kiện và báo lỗi rõ ràng khi nhập sai không?  
- IA-03 (Navigation): Thanh Menu, đường dẫn trang, nút phân trang và phím Tab có đưa người dùng đi đúng luồng  
- IA-04 (Feedback & State): Vòng xoay Loading, khóa nút Disabled chống bấm đúp, hộp thoại xác nhận xóa, Toast 11

---

## Slide 12 — GUI CHECKLIST

Công thức \[Thành phần thị giác\] \+ \[Thao tác / điều kiện\] \+ \[Kết quả về mặt thị giác mong đợi\] → Đo lường PASS / FAIL Lưu ý khi sử dụng AI Các công cụ sử dụng AI thường bỏ quên các yếu tố GUI liên quan tới Accessibility (keyboard-only), Dark mode, bố cục phải sang trái (RTL), sử dụng đa ngôn ngữ 12

---

## Slide 13 — Digital downloads

- Thanh Breadcrumbs khi truy cập trang danh mục Digital downloads hiển thị đúng thứ tự "Home / Digital downloads", và chữ cuối ở dạng văn bản tĩnh không click được (IA-03)  
- Computers  
- Electronics  
- Apparel  
- Digital downloads  
- Books  
- Jewelry  
- Gift Cards  
- Home / Digital downloads  
- Categories  
- Computers  
- Electronics  
- Apparel  
- Digital downloads  
- Books  
- Jewelry  
- Gift Cards  
- Manufacturers  
- Apple  
- HP  
- View all  
- Popular tags  
- apparel  
- awesome  
- book  
- camera  
- cell  
- compact  
- Sort by Position Display 6 per page  
- LONDON GRAMMAR  
- IF YOU WAIT  
- If You Wait (donation)  
- ADD TO CART  
- IMAGINE DRAGONS  
- NIGHT VISIONS  
- Night Visions  
- \$2.80  
- ADD TO CART  
- THE SCRIPT  
- SCIENCE & FAITH  
- Science & Faith  
- ADD TO CART  
- Các nút "ADD TO CART" sau khi thẻ sản phẩm bên trên có hoặc không có dòng giá tiền (\$2.80) cả 3 nút vẫn cần thẳng tắp trên cùng một trục ngang, nền xanh chữ trắng rõ nét (IA-01)  
- 13

---

## Slide 14 — Register

- Search store  
- Electronics  
- Apparel  
- Digital downloads  
- Books  
- Jewelry  
- Your Personal Details  
- Gender: Male Female  
- First name: \*  
- First name is required.  
- Last name: \*  
- Last name is required.  
- Email: \*  
- Email is required.  
- Company Details  
- Company name:  
- Các trường First name, Last name, Email có dấu \* Khi để trống và bấm nút Register Hiện dòng chữ báo lỗi màu đỏ ("... is required.") nằm ở giữa ngay bên dưới từng ô  
- 14

---

## Slide 15 — GUI Checklist

Project: \_\_\_\_\_\_\_\_ Screen / Flow: \_\_\_\_\_\_\_\_ Reviewer: \_\_\_\_\_\_\_\_ Date: \_\_\_\_\_\_\_\_

# \| Category \| Checkpoint \| Verification criteria \| Pass \| Fail \| Notes / Evidence

1 \| IA-01 (General UI Standards) \| Align "ADD TO CART" button \| 3 "ADD TO CART" buttons on the Digital downloads category page — regardless of whether the product card above has a price line (\$2.80) or not — still need to be aligned on the same horizontal axis, with clear white text on a blue background. \| □ \| □ \| 2 \| IA-02 (Forms & Controls) \| Required fields in the Register form \| The First name / Last name / Email fields have an asterisk \*; when left blank and clicking the Register button, a red error message ("... is required.") is displayed immediately below each field. \| □ \| □ \| 3 \| IA-03 (Navigation) \| Breadcrumbs bar \| When accessing the Digital downloads category page, the breadcrumb displays the correct order Home / Digital downloads, and the last text is in static format and is not clickable. \| □ \| □ \| Result: \_\_\_\_\_ / 3 passed \| Open defects: \_\_\_\_\_ 15

---

## Slide 16 — Ranh giới của GUI Automation

Tự động hóa cho những việc lặp lại và có kết quả xác định. Nên tự động hóa

- Luồng lặp lại nhiều lần: đăng nhập, đăng ký, thanh toán.  
- Trạng thái giao diện có kết quả rõ ràng.  
- Kiểm thử nhiều bộ dữ liệu.  
- Kiểm thử hồi quy sau mỗi lần sửa phần mềm. Không nên tự động hóa hoàn toàn  
- Đánh giá giao diện đẹp hay xấu.  
- Đánh giá trải nghiệm người dùng.  
- Kiểm thử tải API hoặc cơ sở dữ liệu.  
- Những trường hợp cần nhận xét chủ quan của con người. 16

---

## Slide 17 — GUI automation: Record and Playback

Mechanism

- Testers perform actions on the interface.  
- The tool records the actions.  
- The tool creates scripts for playback.  
- Scripts are run multiple times. Advantages  
- Create tests quickly.  
- Easy for beginners to get started.  
- Useful when exploring business flows. Disadvantages  
- Locators easily break when the interface changes.  
- Often covers only one case. Example: Open the registration page → Enter email and password → Click the “Register” button → Check the result notification. \*Locator: how the tool identifies an element on the page 17

---

## Slide 18 — GUI automation: Data Driven Testing

Mechanism

- Separate data from test steps.  
- Use one script to run multiple data sets.  
- Each data set has its own expected result. Benefits  
- Easy to add new cases.  
- Reduce test duplication.  
- Can check valid, invalid, and boundary data.  
- Know exactly which data set failed. Example: email test data set \| Data \| Expected result \| \|---\|---\| \| [user@example.com](mailto:user@example.com) \| Valid \| \| userexample.com \| Format error \| \| Left blank \| Required error \| \| Exceeds maximum length \| Limit error \| 18

---

## Slide 19 — GUI automation: Checkpoints và Assertions

Dừng tại các điểm quan trọng trong luồng kiểm thử để so sánh trạng thái thực tế của giao diện với kết quả mong đợi. Checkpoint Điểm trong kịch bản cần kiểm tra trạng thái giao diện. Assertion Điều kiện dùng để xác nhận kết quả có đúng hay không Ví dụ assertion: • Nút “Đăng ký” phải hiển thị. • Nút phải bị vô hiệu hóa khi thiếu dữ liệu. • Thông báo lỗi phải xuất hiện khi nhập email sai. • Trang xác nhận phải mở sau khi đăng ký thành công. Cẩn thận với False Positive • Test báo đạt nhưng giao diện thực tế đang lỗi. • Ví dụ: chữ “Đăng ký thành công” tồn tại trong HTML nhưng đang bị ẩn trên giao diện. Không chỉ kiểm tra thao tác đã thực hiện; phải kiểm tra kết quả người dùng thực sự nhìn thấy. 19

---

## Slide 20 — How to maintain stable tests?

Use robust locators

- Prioritize selecting locators that reflect how users identify elements E.g.: role, display name, label, or test ID. Use Auto-wait The pause between each step should be based on actual conditions:  
- Element is ready to interact.  
- Wait for notification or result to appear. Limit fixed time waits. Clean state  
- Each test should start with clear data and state.  
- Do not let the state of the previous test affect the next test. → 3 GUI automation techniques: Record and Playback creates actions, Data Driven expands data, and Checkpoints & Assertions confirm results. → Stable locators, Auto-wait, and Clean State will help tests be less prone to flakiness. 20

---

## Slide 21 — CƠ CHẾ CỦA TỪNG FRAMEWORK

- Se  
- cypress  
- SELENIUM  
- CYPRESS  
- PLAYWRIGHT  
- 21

---

## Slide 22 — ĐIỂM CHUNG CỦA CÁC FRAMEWORK NÀY LÀ GÌ ?

Đều thao tác trên giao diện web và đối chiếu kết quả bằng assertions. 01 — MỞ WEBSITE • Nhận URL và kịch bản test. • Mở website trong trình duyệt. 02 — TƯƠNG TÁC GUI • Dùng locator tìm phần tử trong DOM. • Nhập liệu, click và đọc trạng thái. 03 — XÁC MINH KẾT QUẢ • Dùng assertions đối chiếu kết quả thực tế với mong đợi. • Báo PASS hoặc FAIL. ARRANGE ACT ASSERT 22

---

## Slide 23 — CƠ CHẾ HOẠT ĐỘNG CỦA SELENIUM

HOST SYSTEM WebDriver Bindings

+ Support classes Driver eg. ChromeDriver Browser Kiến trúc Selenium WebDriver Nguồn: [https\://www\.selenium.dev/documentation/overview/components](https://www.selenium.dev/documentation/overview/components) (20/10/2026) 23

---

## Slide 24 — CƠ CHẾ HOẠT ĐỘNG CỦA CYPRESS

Cypress Architecture Cypress Node Backend Browser Cyress Test Runner Your App @amirrustam Kiến trúc Cypress 24 Nguồn: [https\://speakerdeck.com/amir/next-generation-web-application-end-to-end-testing-with-cypress](https://speakerdeck.com/amir/next-generation-web-application-end-to-end-testing-with-cypress) (20/10/2026)

---

## Slide 25 — CƠ CHẾ HOẠT ĐỘNG CỦA PLAYWRIGHT

How Playwright works

- Developer writes tests  
- Pages run tests inside Browsers and BrowserContexts  
- Actions are performed (abc, cba)  
- Assertions are made on the results of actions (Page loads, Buttons work, Headers present)  
- Traces record the results for debugging  
- Playwright notifies the developer if there’s a problem they need to fix (To: Front-end developer)  
- Confirm the problem is fixed by re-running tests Kiến trúc Playwright Nguồn: [https\://www\.contentful.com/blog/playwright-automated-browser-testing](https://www.contentful.com/blog/playwright-automated-browser-testing) (20/10/2026) 25

---

## Slide 26 — ƯU ĐIỂM & HẠN CHẾ

Cả ba hỗ trợ ba kỹ thuật cốt lõi; khác biệt ở cách triển khai và công sức bảo trì. 01 SELENIUM ƯU ĐIỂM • Đa ngôn ngữ, linh hoạt tích hợp. • Hệ sinh thái WebDriver/Grid rộng. HẠN CHẾ • Cần ghép runner, assertions, • Báo cáo và chiến lược chờ. 02 CYPRESS ƯU ĐIỂM • Debug trực quan từng bước. • Tích hợp E2E & Component Testing. HẠN CHẾ • Chủ yếu JavaScript/TypeScript; • Hạn chế đa tab, đa browser. 03 PLAYWRIGHT ƯU ĐIỂM • Auto-wait, trace, chạy song song. • Thuận tiện nhiều tab và phiên. HẠN CHẾ • Browser binaries tốn dung lượng; • Cần quản lý tài nguyên khi chạy. 26

---

## Slide 27 — Video demo (27.mp4)

*Slide video — phát trực tiếp khi trình chiếu bằng `Slide/Presenter.html`, hoặc xem trong video YouTube trên.*

---

## Slide 28 — LINK CHECKER

- [www\.fit.hcmus.edu.vn](http://www.fit.hcmus.edu.vn)  
- This check has reached the maximum number of links allowed by your subscription. Click here to upgrade.  
- Overview  
- Summary of the key results of the link check.  
- All Links 1,500  
- Issues  
- All Issues 27  
- Broken 27  
- Blacklisted 0  
- Soft errors 0  
- Outbound 423  
- Unsupported 1  
- Blocked 18  
- Subscriptions: Lite  
- Max links per website: 1,500  
- Project [www\.fit.hcmus.edu.vn](http://www.fit.hcmus.edu.vn)  
- Check started 20 October 2026, 09:50:37  
- Check completed 20 October 2026, 09:55:24 (4 minutes, 47 seconds)  
- Rerun Check  
- Project Settings  
- Delete Project  
- Add Project  
- Total Links 1,500  
- Links with Issues 27  
- New Links n/a  
- Issue Types  
- 404 Not found 16  
- Host not found 6  
- Timeout 3  
- 403 Forbidden 1  
- 5xx Server error 1  
- Link Types  
- <a href> 854
- <img src> 426  
- CSS url() 92  
- <link rel=stylesheet> 75
- <script src> 45
- <frame src> 2  
- Start URL 1  
- Social meta tag 1  
- Other 4  
- Top Hosts  
- [www\.fit.hcmus.edu.vn](http://www.fit.hcmus.edu.vn) 964  
- drive.google.com 213  
- doi.org 45  
- link.springer.com 17  
- ieeexplore.ieee.org 16  
- fonts.googleapis.com 14  
- [www\.ctda.hcmus.edu.vn](http://www.ctda.hcmus.edu.vn) 14  
- link.hcmus.edu.vn 8  
- dl.acm.org 6  
- forms.gle 6  
- Link Schemes  
- https 1,413  
- data 67  
- http 15  
- mailto 4  
- Other 1  
- Redirects  
- Temporary HTTP redirect 85  
- Permanent HTTP redirect 31  
- JavaScript redirect 2  
- Dofollow/Nofollow 1,500  
- Link checker cho trang fit.hcmus.edu.vn  
- 28

---

## Slide 29 — Video demo (29.mp4)

*Slide video — phát trực tiếp khi trình chiếu bằng `Slide/Presenter.html`, hoặc xem trong video YouTube trên.*

---

## Slide 30 — BrowserStack

- Switch Browser  
- Local Testing  
- Zoom \- \+  
- Capture a bug  
- DevTools BETA  
- Settings  
- Show Home Screen  
- Rotate Device  
- Change Location  
- Files & Media New  
- Throttle Network  
- Screen Reader  
- iPhone 12 Pr... v16  
- Stop Session  
- Throttle Network  
- Turn off network simulation  
- Edge \- good  
- 250kbps 150kbps 0% Loss 300ms Latency  
- 3G \- good  
- 400kbps 400kbps 0% Loss 100ms Latency  
- 4G \- good  
- 1800kbps 900kbps 0% Loss 100ms Latency  
- 4G \- high latency  
- 1800kbps 900kbps 0% Loss 3000ms Latency  
- Offline New  
- 0kbps 0kbps 0% Loss 0ms Latency  
- Custom profile  
- Set Values  
- 12:49  
- premierleague.com  
- Sign In  
- Tables  
- First Team  
- PL  
- U18  
- Filter  
- Premier League  
- LIVE League Table  
- Club  
- Pl  
- W  
- D  
- L  
- GD  
- Pts  
- 1 TOT 8 6 2 0 10 20  
- 2 MCI 7 6 0 1 12 18  
- 3 ARS 7 5 2 0 9 17  
- 4 LIV 7 5 1 1 9 16  
- 5 AVL 7 5 0 2 7 15  
- 6 BHA 7 5 0 2 5 15  
- 7 WHU 7 4 1 2 3 13  
- 8 NEW 7 4 0 3 1 12  
- 9 CRY 7 3 2 2 0 11  
- 10 MUN 7 3 1 3 0 10  
- Screenshot  
- You are testing on a  
- Simulator Real Device\!

- # Serial Number G0NDR5Z4XXXX

- Purchase Date 21st Dec, 2020  
- Device Location Frankfurt, Germany  
- Buy a plan 30

---

## Slide 31 — Các công cụ kiểm thử GUI thủ công

- W3C  
- dead link checker  
- LINK CHECKER  
- Tự động thu thập toàn bộ hyperlink trên trang để phát hiện sớm các liên kết bị lỗi (404 Not Found), lỗi máy chủ hoặc chuỗi chuyển hướng vòng lặp mà kiểm thử thủ công bằng mắt dễ bỏ sót.  
- Responsively App  
- RESPONSIVE TESTING  
- Kiểm tra tính hiển thị của một ứng dụng ở nhiều kích thước màn hình khác nhau (Mobile 375px, Tablet 768px, Desktop 1440px)  
- BrowserStack  
- CROSS-BROWSER TESTING  
- Kiểm tra ứng dụng web có hoạt động đúng với đặc tả khi vận hành trên nhiều trình duyệt khác nhau (Safari, Chrome, Firefox...)  
- 31

---

## Slide 32 — CASE STUDY: SAUCEDEMO

Minh họa một luồng GUI end-to-end: từ hành động của người dùng đến bằng chứng kiểm thử.

- SUT & SETUP  
- Website: saucedemo.com  
- Tài khoản demo: standard\_user  
- Công cụ: Playwright  
- TEST ENVIRONMENT  
- TEST SCENARIO  
- Đăng nhập vào ứng dụng  
- Chọn Add to cart  
- Mở giỏ và kiểm tra sản phẩm  
- LOGIN → CART  
- CHECK & EVIDENCE  
- Assert URL và giỏ hàng  
- Đối chiếu expected result  
- Phân tích trace nếu test fail  
- ASSERTIONS • TRACE 32

---

