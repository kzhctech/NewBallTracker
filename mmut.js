const puppeteer = require('puppeteer-core');

const getInitialValues = async (page, selectors) => {
  const initialValues = {};

  for (const [label, selector] of Object.entries(selectors)) {
    await page.waitForSelector(selector);
    const element = await page.$(selector);
    const value = await page.evaluate(el => el.textContent.trim(), element);
  //  console.log(`Initial value for ${label}:`, value);
    initialValues[label] = value;
  }

  return initialValues;
};

const observeElementChanges = async (page, selectors) => {
  for (const selector of Object.values(selectors)) {
    await page.evaluate((elm) => {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'characterData') {
            const newValue  = mutation.target.textContent.trim();
            observeElmData(newValue);
          }
        }
      });

      observer.observe(document.querySelector(elm), { characterData: true, subtree: true ,attributes: true});
    }, selector);
  }
};

const observeElements = async (page, selectors) => {
  const initialValues = await getInitialValues(page, selectors);
  await observeElementChanges(page, selectors);
  return initialValues;
};

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

    // Expose the `observeElmData` function on the page
    await page.exposeFunction('observeElmData', (data) => {
      console.log('Latest data:', data);
    });

    const startUrl = 'https://crex.live/scoreboard/K5I/1AC/Only-Match/W/Y/afg-vs-ban-only-match-afghanistan-tour-of-bangladesh-2023/live';

    await page.goto(startUrl);
    console.log("going");

    const selectors = {
      'Last': 'div.result-box > span',
      'Name': 'div > h1.name-wrapper > span',
      'Status': 'div.final-result.m-none',
      'Run':'div.team-score span:nth-child(1)',
      'Over':'div.team-score span:nth-child(2)'
    };

    const initialValues = await observeElements(page, selectors);

    console.log('Initial values:', initialValues);


    let previousValue = '';

setInterval(async () => {
  let value = await page.evaluate(() => {
    let topDiv = document.querySelector('div#topDiv');
    let childDivs = topDiv.querySelectorAll('div');

    for (let i = 0; i < childDivs.length; i++) {
      let span = childDivs[i].querySelector('span.cm-b-comment-c2');
      if (span) {
        let spanValue = span.textContent.trim();
        if (spanValue !== '') {
          return spanValue;
        }
      }
    }

    return '';
  });

  if (value !== previousValue) {
    console.log(value);
    previousValue = value;
  }
}, 1000);


    //await browser.close();
  } catch (err) {
    console.log(err);
  }
};

main();


/*

'app-root > app-match-details > app-matc
h-commentary  div#topDiv > div span.cm-b-comment-c1:nth-child(1)'
*/
