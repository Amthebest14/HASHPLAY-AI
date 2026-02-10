from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()

    # Pre-set some garbage data to simulate stale session
    page.add_init_script("localStorage.setItem('hashconnectData', '{\"garbage\": \"true\"}')")

    print("Navigating to app...")
    page.goto("http://localhost:5173")

    # Wait for init to likely happen (it happens in useEffect on mount)
    page.wait_for_timeout(2000)

    # Check storage
    data = page.evaluate("localStorage.getItem('hashconnectData')")

    if data is None:
        print("PASS: hashconnectData was cleared from localStorage.")
    else:
        print(f"FAIL: hashconnectData still exists: {data}")

    browser.close()
