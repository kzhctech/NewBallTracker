const puppeteer = require('puppeteer-core');

const getInitialValues = async (page, selectors) => {
  const initialValues = {};

  for (const [label, selector] of Object.entries(selectors)) {
    await page.waitForSelector(selector);
    const element = await page.$(selector);
    const value = await page.evaluate((el) => el.textContent.trim(), element);
    initialValues[label] = value;
  }

  return initialValues;
};

const observeElementChanges = async (page, selectors) => {
  for (const [label, selector] of Object.entries(selectors)) {
    await page.evaluate(
      (label, selector) => {
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'characterData') {
              const newValue = mutation.target.textContent.trim();
		    
              observeElmData({ label,newValue });
            }
          }
        });

        observer.observe(document.querySelector(selector), {
          characterData: true,
          subtree: true,
          attributes: true,
        });
      },
      label,
      selector
    );
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
      args: ['--no-sandbox', '--disable-gpu'],
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

    const startUrl =
      'https://crex.live/scoreboard/K8C/1F9/33rd-Match/T/V/sl-vs-wi-33rd-match-icc-world-cup-qualifiers-2023/live';

    await page.goto(startUrl);
    console.log('Going');

    const selectors = {
      Last: 'div.result-box > span',
      Name: 'div > h1.name-wrapper > span',
      Status: 'div.final-result.m-none',
      Run: 'div.team-score span:nth-child(1)',
      Over: 'div.team-score span:nth-child(2)',
      Batsman1: 'app-match-live-player >  div > div:nth-child(3)'
    };

    const initialValues = await observeElements(page, selectors);

    console.log('Initial values:', initialValues);



let previousValue = '';

setInterval(async () => {
        //await page.waitForSelector('div#topDiv');
  let result = await page.evaluate(() => {
    let topDiv = document.querySelector('app-match-commentary div#topDiv');
    let childDivs = topDiv.querySelectorAll('div');

    for (let i = 0; i < childDivs.length; i++) {
      let spanComment = childDivs[i].querySelector('span.cm-b-comment-c2');
      let spanOver = childDivs[i].querySelector('span.cm-b-over');

      if (spanComment) {
        let commentValue = spanComment.textContent.trim();
        if (commentValue !== '') {
          let overValue = spanOver ? spanOver.textContent.trim() : '';
          return {
            comment: commentValue,
            over: overValue
          };
        }
      }
    }

    return null;
  });

  if (result !== null) {
    if (result.comment !== previousValue) {
      console.log('Comment:', result.comment);
      console.log('Over:', result.over);
      previousValue = result.comment;
    }
  } else {
    console.log('No non-empty value found in child divs');
  }
}, 1000);








    //await browser.close();
  } catch (err) {
    console.log(err);
  }
};

main();

