from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})

    page.goto('http://localhost:5174/')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)  # Wait for images to load

    # Take full page screenshot
    page.screenshot(path='/tmp/cambodia-tv-ui.png', full_page=True)
    print("Screenshot saved to /tmp/cambodia-tv-ui.png")

    # Check for broken images
    images = page.locator('img').all()
    print(f"\nFound {len(images)} images on page")

    broken_images = []
    for i, img in enumerate(images):
        src = img.get_attribute('src')
        alt = img.get_attribute('alt')
        # Check if image loaded correctly by checking naturalWidth
        natural_width = img.evaluate('el => el.naturalWidth')
        if natural_width == 0:
            broken_images.append({'src': src, 'alt': alt})
            print(f"BROKEN: {alt} - {src}")
        else:
            print(f"OK: {alt}")

    print(f"\n{len(broken_images)} broken images found")

    browser.close()
