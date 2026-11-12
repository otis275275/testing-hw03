# AI CRITIQUE (MANDATORY — HW03)

- **Student:** Lê Trung Thành Đạt — **MSSV:** `23120228` (`23120228@student.hcmus.edu.vn`)
- **Role / Scope:** Member M2 (Home, Product Detail, Header & Footer; Flow F2)
- **AI Tools Used:** Gemini 3.8 Flash (via Antigravity)

---

## Critical Reflection on AI Collaboration

During HW03, the AI served as a fast drafting assistant for the initial 40-item GUI checklist, Playwright cross-browser scripts, and report scaffolding, yet it repeatedly exhibited three blind spots: incomplete boundary coverage, over-optimism about nominal UI code, and subtle inconsistencies across generated artifacts. First, in Task 1, the AI's initial checklist tested happy-path inputs (such as valid quantities `1` or `2` and normal search keywords) while overlooking negative boundary values (`0.5` decimals and `2,000,000,000` extremes in `CHK-21` and `CHK-22`), dynamic hover feedback (`CHK-13`), pagination under scale (`CHK-29`), logout cart state desynchronization (`CHK-41`), and HTML or SQL error rendering (`CHK-14`, `CHK-27`, `CHK-39`). Second, it missed the first-click dead-click defect on the Add-to-Cart button (`CHK-40`) when reading surface JSX because it assumed an attached `onClick` handler implied immediate execution without tracing the stateful `clickCount === 0` branch. Third, across sessions the AI introduced numeric drift (initially reporting a 33/16 split instead of the actual 40/9 breakdown), left stale workspace paths, and in Task 2 could have misread a participant's reversed score on negatively worded SUS item Q6 without explicit verification flags. These failures occurred because prompt-driven LLMs optimize for plausible structure and common patterns rather than adversarial runtime state transitions or browser-specific quirks (such as Firefox allowing `"abc"` inside `<input type="number">`). The core principle learned is **structured human-in-the-loop verification**: let AI accelerate breadth, formatting, and automation, while humans enforce scope boundaries, negative and stateful edge cases, cross-artifact arithmetic checks, and real-user ground truth.
