from playwright.sync_api import sync_playwright, expect
import time
import os

def run():
    print("Starting verification...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Desktop
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        print("Navigating to app...")
        page.goto("http://localhost:5173")
        page.wait_for_timeout(3000)

        # Ensure no wallet is connected
        print("Clearing localStorage...")
        page.evaluate("localStorage.removeItem('hashconnectData')")
        page.reload()
        page.wait_for_timeout(3000)

        # Verify no wallet connected by checking if 'DICE GAME' is visible (it should be)
        # Use first=True to pick the first one, or be more specific. Here we pick the H2.
        expect(page.locator("h2", has_text="DICE GAME")).to_be_visible()

        # Set Wager to enable button
        print("Setting wager...")
        page.fill("input[placeholder='0.00']", "10")

        # Click Roll (Dice)
        print("Clicking ROLL...")
        roll_btn = page.locator("button", has_text="ROLL")
        roll_btn.click()

        # Check for Toast
        print("Checking for Toast...")
        # The toast contains text "Please connect wallet first"
        # And it should be visible
        try:
            toast = page.locator("text=Please connect wallet first")
            expect(toast).to_be_visible(timeout=5000)
            print("PASS: Toast appeared.")
        except Exception as e:
            print("FAIL: Toast did not appear or timed out.")
            # Capture what IS visible
            page.screenshot(path="verification/toast_fail.png")
            raise e

        # Take screenshot
        page.screenshot(path="verification/toast_verify.png")
        print("Captured verification screenshot.")

        browser.close()

if __name__ == "__main__":
    run()
