from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mobile viewport (iPhone 12 Pro dimensions)
        context = browser.new_context(viewport={"width": 390, "height": 844})
        page = context.new_page()

        print("Navigating to mobile view...")
        page.goto("http://localhost:5173")
        page.wait_for_selector("text=HashPlay AI") # Wait for load

        # Wait for "Connect" text inside button (meaning bridge ready)
        # Selector for SkewButton inside Navbar header
        connect_btn = page.locator("header button")

        try:
            # Wait for text "Connect" (case sensitive usually) or partial match
            # "Connect" is the text when ready and disconnected
            btn_with_text = connect_btn.filter(has_text="Connect").first
            btn_with_text.wait_for(state="visible", timeout=10000)
            print("PASS: Connect button became visible on mobile.")
        except Exception as e:
            print(f"FAIL: Connect button timed out or never showed 'Connect': {e}")
            # debugging
            print("Page content snippet:")
            print(page.content()[:500])

        browser.close()

if __name__ == "__main__":
    run()
