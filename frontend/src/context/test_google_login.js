const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });

  // Listen to console messages and page errors
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));

  // Determine port
  const url = 'http://localhost:5173/login';
  console.log(`Navigating to ${url}...`);
  try {
    await page.goto(url, { waitUntil: 'networkidle0' });
  } catch (e) {
    console.log("Port 5173 failed. Trying Port 5174...");
    await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle0' });
  }

  // Click the Google Sign-in button
  console.log("Clicking Google sign-in button...");
  
  // We can listen for the popup target created by the browser
  const newTargetPromise = new Promise(resolve => browser.once('targetcreated', resolve));

  await page.evaluate(() => {
    const btn = document.querySelector('.auth-google-btn');
    if (btn) {
      btn.click();
    } else {
      console.log("Google button not found!");
    }
  });

  console.log("Waiting for popup window...");
  try {
    const newTarget = await Promise.race([
      newTargetPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout waiting for popup")), 10000))
    ]);

    const popupPage = await newTarget.page();
    if (popupPage) {
      await new Promise(r => setTimeout(r, 4000)); // Wait for popup redirects
      const popupUrl = await popupPage.url();
      const popupTitle = await popupPage.title();
      console.log(`Popup window detected! URL: ${popupUrl} | Title: ${popupTitle}`);
    } else {
      console.log("Popup target created but no page resolved.");
    }
  } catch (err) {
    console.log("Error during popup wait:", err.message);
  }

  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'C:\\Users\\shaik samiuddin\\.gemini\\antigravity\\brain\\38a30a5f-4dab-4ad5-b18c-d0c9e9bfa025\\scratch\\google_login_page.png' });
  console.log("Page screenshot captured.");

  await browser.close();
  console.log("Browser closed.");
})();
