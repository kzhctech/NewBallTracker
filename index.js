const puppeteer = require('puppeteer-core');


screenshot('https://crex.live/scoreboard/IM5/1BQ/Final/Q/O/ind-vs-aus-final-icc-world-test-championship-final-2023/live').then(() => console.log('screenshot saved'));

async function screenshot(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-gpu",
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1080});
  await page.goto(url, {
    timeout: 0,
    waitUntil: 'networkidle0',
  });
 
 title = await page.evaluate(() => {
    return document.querySelector(".updated-data").textContent.trim();
  });
  console.log(title);

  await page.close();
  await browser.close();
}
