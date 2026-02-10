from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Desktop
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        print("Navigating to app...")
        page.goto("http://localhost:5173")
        page.wait_for_timeout(2000)

        # 1. Take screenshot of Dice Game with new Button Text
        page.screenshot(path="verification/game_dice_updated.png")
        print("Captured Dice Game.")

        # 2. Switch to Coin Flip
        page.locator("button", has_text="[ COIN FLIP ]").click()
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/game_coin_updated.png")
        print("Captured Coin Flip.")

        # 3. Verify Testnet Badge Width (Connected Header)
        page.evaluate("""
            localStorage.setItem('hashconnectData', JSON.stringify({
                accountIds: ['0.0.123456']
            }));
            window.dispatchEvent(new Event('hashconnect-pairing'));
        """)
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/header_badge_check.png")
        print("Captured Header Badge.")

        browser.close()

if __name__ == "__main__":
    run()
