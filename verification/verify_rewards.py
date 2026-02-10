
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Navigate to the Reward Intelligence page
    # The preview server runs on port 5173 by default
    page.goto("http://localhost:5173/rewards")

    # Wait for the page to load
    page.wait_for_selector("text=Reward Intelligence")

    # Wait for the multiplier to appear (it might start as static "1.45" then update)
    # We just want to ensure the component rendered and shows a multiplier
    # Check for the specific structure: "1.45x" or similar

    # Take a screenshot
    screenshot_path = "verification/verify_rewards.png"
    page.screenshot(path=screenshot_path)
    print(f"Screenshot saved to {screenshot_path}")

    browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
