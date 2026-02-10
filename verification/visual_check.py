from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Desktop
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        print("Navigating to app...")
        page.goto("http://localhost:5173")
        page.wait_for_timeout(2000)

        # 1. Take screenshot of default Dice View
        page.screenshot(path="verification/ui_dice_view.png")
        print("Captured Dice View.")

        # 2. Switch to Coin and take screenshot
        page.locator("button", has_text="[ MODULE 02: COIN ]").click()
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/ui_coin_view.png")
        print("Captured Coin View.")

        # 3. Inject Fake Wallet and capture Header
        page.evaluate("""
            localStorage.setItem('hashconnectData', JSON.stringify({
                accountIds: ['0.0.123456']
            }));
            window.dispatchEvent(new Event('hashconnect-pairing'));
        """)
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/ui_connected_header.png")
        print("Captured Connected Header.")

        browser.close()

if __name__ == "__main__":
    run()
