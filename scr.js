const puppeteer = require('puppeteer-core');
const fs = require('fs');

screenshot('https://www.crex.live/scoreboard/IM5/1BQ/Final/Q/O/ind-vs-aus-final-icc-world-test-championship-final-2023/live').then(() => console.log('screenshot saved'));

async function screenshot(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-gpu",
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({width: 320, height: 720});
  await page.goto(url, {
    timeout: 120000
  });
  const screenData = await page.screenshot({encoding: 'binary', type: 'jpeg', quality: 100});
  if (!!screenData) {
    fs.writeFileSync('screenshots/screenshot.jpg', screenData);
  } else {
    throw Error('Unable to take screenshot');
  }

  await page.close();
  await browser.close();
}
