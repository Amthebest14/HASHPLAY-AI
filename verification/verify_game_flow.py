from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Desktop
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        print("Navigating to app...")
        page.goto("http://localhost:5173")
        page.wait_for_timeout(2000)

        # 1. Verify Module Renaming
        expect(page.locator("button", has_text="[ DICE GAME ]")).to_be_visible()
        expect(page.locator("button", has_text="[ COIN FLIP ]")).to_be_visible()
        print("PASS: Modules renamed to DICE GAME / COIN FLIP.")

        # 2. Verify Testnet Badge Width (Visual Check via Screenshot)
        # Inject fake wallet
        page.evaluate("""
            localStorage.setItem('hashconnectData', JSON.stringify({
                accountIds: ['0.0.123456']
            }));
            window.dispatchEvent(new Event('hashconnect-pairing'));
        """)
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/ui_final_check.png")
        print("Captured UI Final Check.")

        # 3. Game Flow Mock
        # Click Roll (we can't easily mock the wallet sign, but we can check if button is reachable)
        # We need to set wager
        page.fill("input[type=number]", "10")
        roll_btn = page.locator("button", has_text="ROLL")
        if roll_btn.is_visible():
            print("PASS: Roll button visible.")
            # roll_btn.click() # This would trigger wallet, which fails in headless without extension mock

        browser.close()

if __name__ == "__main__":
    run()
