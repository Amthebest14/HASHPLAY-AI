import re
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("Navigating to local deployment...")
        page.goto("http://localhost:5173")

        # Wait for HealthCheck footer
        health_check = page.locator("div.fixed.bottom-0")
        expect(health_check).to_be_visible()
        print("HealthCheck footer is visible.")

        # Check for LEDs
        bridge_led = health_check.locator("div.rounded-full").nth(0)
        wallet_led = health_check.locator("div.rounded-full").nth(1)
        relay_led = health_check.locator("div.rounded-full").nth(2)

        # Bridge LED might start yellow (pulse) then turn green
        expect(bridge_led).to_have_class(re.compile(r"bg-(green|yellow)-500"))
        print("Bridge LED verified.")

        expect(wallet_led).to_have_class(re.compile(r"bg-(green|red)-500"))
        print("Wallet LED verified.")

        # Relay LED should be RED if disconnected
        expect(relay_led).to_have_class(re.compile(r"bg-red-500"))
        print("Relay LED verified (RED).")

        console_logs = []
        page.on("console", lambda msg: console_logs.append(msg.text))

        # Wait for "Loading..." to disappear and "Connect" to appear
        # The button exists but text changes
        connect_btn = page.locator("header button")

        # Wait for button to be enabled (meaning bridge ready)
        # It might take up to 5s (timeout) + a bit
        try:
            # Check if we can find a button that eventually says "Connect"
            btn_with_text = connect_btn.filter(has_text="CONNECT WALLET").first
            btn_with_text.wait_for(state="visible", timeout=8000)
            print("Connect button is visible and ready.")

            if btn_with_text.is_disabled():
                print("Connect button is disabled.")
            else:
                btn_with_text.click()
                print("Clicked Connect button.")

                page.wait_for_timeout(2000)

                found_modal_log = any("Opening HashConnect modal" in log for log in console_logs)
                if found_modal_log:
                    print("Log 'Opening HashConnect modal' found.")
                else:
                    print("Log 'Opening HashConnect modal' NOT found.")

        except Exception as e:
            print(f"Error finding/clicking connect button: {e}")
            # debugging
            print("Page content snippet:")
            print(page.content()[:500])

        browser.close()

if __name__ == "__main__":
    run()
