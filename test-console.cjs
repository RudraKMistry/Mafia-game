const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));
  page.on('requestfailed', request => console.log('BROWSER_REQ_FAIL:', request.url(), request.failure().errorText));

  console.log("Navigating to http://localhost:5173");
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  await browser.close();
})();
