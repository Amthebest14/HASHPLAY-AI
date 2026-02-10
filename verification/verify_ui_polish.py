from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Desktop
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        print("Navigating to app...")
        page.goto("http://localhost:5173")
        page.wait_for_timeout(3000) # Wait for init

        # 1. Verify Toggle Buttons
        try:
            dice_tab = page.locator("button", has_text="[ DICE GAME ]")
            coin_tab = page.locator("button", has_text="[ COIN FLIP ]")

            expect(dice_tab).to_be_visible()
            expect(coin_tab).to_be_visible()
            print("PASS: Toggle tabs found.")
        except:
            print("FAIL: Toggle tabs not found. Layout mismatch.")

        # 2. Verify Default State (Dice Active)
        try:
            # Dice module has "DICE GAME" header
            expect(page.locator("h2", has_text="DICE GAME")).to_be_visible()
            print("PASS: Default state (Dice) correct.")
        except:
            print("FAIL: Dice module not visible by default.")

        # 3. Test Switch to Coin
        print("Clicking Coin Tab...")
        coin_tab.click()
        page.wait_for_timeout(1000) # Wait for animation

        try:
            expect(page.locator("h2", has_text="COIN FLIP")).to_be_visible()
            # Dice should be gone (or hidden)
            expect(page.locator("h2", has_text="DICE GAME")).not_to_be_visible()
            print("PASS: Switched to Coin module.")
        except:
            print("FAIL: Coin switch failed.")

        # 4. Mock Wallet Connection to verify Balance Header
        print("Injecting fake wallet connection...")

        # We simulate the storage event and dispatch the window event
        page.evaluate("""
            localStorage.setItem('hashconnectData', JSON.stringify({
                accountIds: ['0.0.123456']
            }));
            window.dispatchEvent(new Event('hashconnect-pairing'));
        """)

        page.wait_for_timeout(2000)

        # Check for Balance Elements
        # The selector depends on the exact classes in Navbar.jsx
        # "hidden lg:flex items-center gap-4 text-xs font-mono"
        balance_container = page.locator("div.hidden.lg\\:flex.items-center.gap-4.text-xs.font-mono")

        try:
            expect(balance_container).to_be_visible()

            # Check for content "HBAR" and "$HASHPLAY"
            # Since fetch might fail in test env (network restricted?), it might show "0 HBAR"

            hbar_text = balance_container.locator("span", has_text="HBAR")
            token_text = balance_container.locator("span", has_text="$HASHPLAY")

            expect(hbar_text).to_be_visible()
            expect(token_text).to_be_visible()
            print("PASS: Clean Balance Header visible when connected.")
        except Exception as e:
            print(f"FAIL: Balance header not visible. {e}")
            print(page.content()[:1000])

        browser.close()

if __name__ == "__main__":
    run()
