# CIS Report Export Guide

## Overview
This guide explains how to export the Customer Information Sheet (CIS) HTML reports to PDF using your web browser. The reports are designed to be self-contained with embedded images, ensuring a consistent layout.

## Prerequisites
- A modern web browser (Google Chrome, Microsoft Edge, Firefox, or Safari).
- The HTML report files:
  - `EXTERNAL-CIS-BUSINESS.html`
  - `EXTERNAL-CIS-INDIVIDUAL.html`

## Export Instructions

### 1. Open the Report
Double-click the desired HTML file (`EXTERNAL-CIS-BUSINESS.html` or `EXTERNAL-CIS-INDIVIDUAL.html`) to open it in your default web browser.

### 2. Print to PDF
1.  Press **Ctrl + P** (Windows/Linux) or **Cmd + P** (Mac) to open the print dialog.
2.  **Destination / Printer**: Select **"Save as PDF"** or **"Microsoft Print to PDF"**.
3.  **Layout**: Ensure **Portrait** is selected.
4.  **Paper Size**: Ensure **A4** is selected.
5.  **Margins**: Select **Default** or **None** (The document has built-in margins).
    *   *Note*: If you see double margins, select "None".
6.  **Options / More Settings**:
    *   **Background graphics**: Check this box if available (ensures colors and backgrounds print correctly).
    *   **Headers and footers**: Uncheck this box (the report has its own internal footers).

### 3. Save the File
1.  Click **Save**.
2.  Navigate to your desired save location.
3.  Name the file using the convention:
    `CIS-[TYPE]-[CUSTOMER_NAME]-[DDMMYYYY].pdf`
    
    **Examples:**
    - `CIS-BUSINESS-ARDEAL-CONCRETE-02122025.pdf`
    - `CIS-INDIVIDUAL-GAVRIL-POP-02122025.pdf`

## Troubleshooting

### Images are missing or broken
- Ensure the `base64_images.json` data was correctly embedded (the HTML files are self-contained).
- If you see a placeholder image, it means the image data was not loaded. Refresh the page.

### Blank pages appearing
- Check the **Margins** setting in the print dialog. Try setting it to **Minimum** or **None**.
- Ensure **Paper Size** is strictly **A4**. Letter size may cause overflow.

### Layout looks distorted
- Ensure you are using a desktop browser. Mobile browsers may render the print view differently.
- Verify **Scale** is set to **100%** or **Default**.

## Browser Compatibility
| Browser | Status | Notes |
| :--- | :--- | :--- |
| **Google Chrome** | Recommended | Best fidelity and easiest "Save as PDF" workflow. |
| **Microsoft Edge** | Supported | Uses same engine as Chrome. |
| **Firefox** | Supported | Ensure "Print Backgrounds" is enabled in Page Setup. |
| **Safari** | Supported | Use "Export as PDF" or Print -> Save as PDF. |
