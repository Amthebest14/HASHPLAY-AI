from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Scenario 1: Desktop View - Health Check & Header
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("Navigating to Desktop view...")
        page.goto("http://localhost:5173")

        # Wait for HealthCheck
        health_check = page.locator("div.fixed.bottom-0")
        expect(health_check).to_be_visible()

        # Wait for Connect Button to be ready (shows "Connect")
        connect_btn = page.locator("header button").filter(has_text="Connect").first
        try:
            connect_btn.wait_for(state="visible", timeout=10000)
            print("Connect button ready.")
        except:
            print("Connect button timed out.")

        # Take screenshot of the whole page
        page.screenshot(path="verification/desktop_overview.png")

        # Take screenshot of the Health Check specifically
        health_check.screenshot(path="verification/health_check_component.png")
        print("Captured Health Check component.")

        # Scenario 2: Mobile View - Header visibility
        context_mobile = browser.new_context(viewport={"width": 390, "height": 844})
        page_mobile = context_mobile.new_page()

        print("Navigating to Mobile view...")
        page_mobile.goto("http://localhost:5173")

        # Wait for Connect Button on mobile
        connect_btn_mobile = page_mobile.locator("header button").filter(has_text="Connect").first
        try:
            connect_btn_mobile.wait_for(state="visible", timeout=10000)
            print("Mobile Connect button ready.")
        except:
             print("Mobile Connect button timed out.")

        # Take screenshot of the mobile header
        header = page_mobile.locator("header")
        header.screenshot(path="verification/mobile_header.png")
        print("Captured Mobile Header.")

        browser.close()

if __name__ == "__main__":
    run()
