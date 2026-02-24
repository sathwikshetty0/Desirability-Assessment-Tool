# DAT | Desirability Assessment Tool

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Aesthetics](https://img.shields.io/badge/design-Premium%20SaaS-purple.svg)

**Desirability Assessment Tool (DAT)** is a high-performance, premium web application designed to validate startup problem statements, project theses, and market case studies. It utilizes a structured 9-dimension framework to quantify market demand.

---

## ✨ Features

-   **Premium SaaS Aesthetic**: Modern glassmorphism design with dynamic "mesh" background effects and micro-animations.
-   **9-Dimension Analysis**: Evaluate problem awareness, solution friction, value perception, and market sizing (TAM/SAM/SOM).
-   **Real-time Scoring**: Instant visual feedback via an animated gauge and pillar-by-pillar breakdown.
-   **Automated Cloud Sync**: One-click data export to **Google Sheets** for centralized team tracking.
-   **Professional Export**: Generates a high-fidelity PDF "Strategic Brief" for stakeholders.
-   **Dual-Theme Support**: Seamlessly toggle between deep dark mode and a clean light theme.

---

## 📊 The DAT Framework

The tool evaluates ventures across four critical pillars:

1.  **Problem Awareness**: Measures if the market recognizes the pain point.
2.  **Solution Friction**: Analyzes the effort and frustration customers currently face.
3.  **Willingness to Pay**: Determines if the solution is a "painkiller" or a "vitamin."
4.  **Market Viability**: Calculates the realistic capture potential of the target segment.

---

## 🚀 Setup & Installation

The project is built with **Vanilla JS, CSS3, and HTML5**—no heavy frameworks required.

1.  Clone the repository or download the files.
2.  Open `index.html` in any modern web browser.
3.  (Optional) Setup the Google Sheets integration (see below).

---

## ☁️ Google Sheets Integration

To enable cloud saving, follow these steps:

### 1. Google Script Setup
1.  Create a new **Google Sheet**.
2.  Go to **Extensions > Apps Script**.
3.  Copy the contents of `google_sheets_script.js` into the editor.
4.  Click **Save** and name it "DAT Backend".

### 2. Deployment
1.  Click **Deploy > New Deployment**.
2.  Select **Web App**.
3.  **Execute as**: "Me".
4.  **Who has access**: "Anyone". (Note: For workspace accounts, ensure it is not restricted to your organization).
5.  Copy the **Web App URL**.

### 3. Connection
1.  Open `script.js` in your editor.
2.  Find the `SHEET_URL` constant near the end of the file.
3.  Paste your copied URL:
    ```javascript
    const SHEET_URL = "https://script.google.com/.../exec";
    ```

---

## 🛠️ Tech Stack

-   **Structure**: Semantic HTML5
-   **Styling**: Modern CSS3 (Variables, Flexbox, Grid, Glassmorphism)
-   **Animations**: CSS Keyframes & JavaScript RequestAnimationFrame
-   **Exporting**: `html2pdf.js` for report generation
-   **Interactive Elements**: `canvas-confetti` for result celebrations

---

## 📝 Usage Guide

1.  **Venture Definition**: Start by entering the project name, team, and evaluator.
2.  **The Wizard**: Answer each of the 9 questions. **Crucial**: Provide "Evidence & Context" in the text areas to ensure the assessment is grounded in reality.
3.  **View Verdict**: Review the final desirability score (0-45).
4.  **Export**: Click "Export Professional Report" to trigger the Google Sheets sync and generate your PDF.

---

*Designed for high-performance innovation teams and strategic evaluators.*
