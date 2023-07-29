const puppeteer = require('puppeteer-core');

const main = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 420,
      height: 980,
    });

    // Expose the `elm` element on the page
    await page.exposeFunction('observeElmData', (data) => {
      console.log('Latest data:', data);
    });

    const startUrl = 'https://crex.live/scoreboard/JND/1BU/3rd-Match/2Q/2T/nrk-vs-smp-3rd-match-tamil-nadu-premier-league-2023/live';

    await page.goto(startUrl);
    console.log("going");

    var elmSelector = 'body > app-root div.result-box';
    await page.waitForSelector(elmSelector);
    let element = await page.$(elmSelector);

    // Get the initial value of the element
    let initialValue = await page.evaluate(el => el.textContent.trim(), element);
    console.log('Initial value:', initialValue);

    // Observe changes to the element
    await page.evaluate((elmSelector) => {
      const target = document.querySelector(elmSelector);
      const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.type === 'characterData') {
            const character = {
              type: 'character',
              value: mutation.target.textContent.trim(),
            };
            observeElmData(character);
          }
        }
      });
      observer.observe(target, { characterData: true, subtree: true });
    }, elmSelector);

    // await browser.close();
  } catch (err) {
    console.log(err);
  }
};

main();

