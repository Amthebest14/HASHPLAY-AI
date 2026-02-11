from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to app...")
        page.goto("http://localhost:5173/")

        # Wait for DiceModule to be visible
        print("Waiting for Dice game...")
        page.wait_for_selector("text=DICE GAME")

        # Take initial screenshot
        page.screenshot(path="verification/dice_initial.png")
        print("Initial screenshot taken.")

        # Interact with wager input
        print("Changing wager...")
        wager_input = page.locator("input[placeholder='0.00']")
        wager_input.fill("100")

        # Take screenshot after interaction
        page.screenshot(path="verification/dice_interaction.png")
        print("Interaction screenshot taken.")

        browser.close()

if __name__ == "__main__":
    run()
