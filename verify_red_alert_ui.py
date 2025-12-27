
import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    # Read the content of index.html
    with open('src/index.html', 'r') as f:
        html_content = f.read()

    # Read the content of the resolution component
    with open('src/app/features/resolution/resolution.component.html', 'r') as f:
        component_html = f.read()

    # Inject the component HTML into the <app-root> of index.html
    # and add the sov-red-alert class to the body
    modified_html = html_content.replace(
        '<body>',
        '<body class="sov-red-alert">'
    ).replace(
        '<app-root></app-root>',
        f'<app-root>{component_html}</app-root>'
    )

    # Ensure the verification directory exists
    os.makedirs('/home/jules/verification', exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Use set_content to load the modified HTML
        await page.set_content(modified_html, wait_until='networkidle')

        # Take a screenshot
        screenshot_path = '/home/jules/verification/red_alert_active.png'
        await page.screenshot(path=screenshot_path)

        await browser.close()
        print(f"Screenshot saved to {screenshot_path}")

if __name__ == "__main__":
    asyncio.run(main())
