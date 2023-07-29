const puppeteer = require('puppeteer-core');

const getInitialValues = async (page, selectors) => {
  const initialValues = {};

  for (const [label, selector] of Object.entries(selectors)) {
    if (Array.isArray(selector)) {
      initialValues[label] = {};

      for (const item of selector) {
        const { label: subLabel, selector: subSelector } = item;
        await page.waitForSelector(subSelector);
        const element = await page.$(subSelector);
        const value = await page.evaluate((el) => el.textContent.trim(), element);
        initialValues[label][subLabel] = value;
      }
    } else {
      await page.waitForSelector(selector);
      const element = await page.$(selector);
      const value = await page.evaluate((el) => el.textContent.trim(), element);
      initialValues[label] = value;
    }
  }

  return initialValues;
};

const observeElementChanges = async (page, selectors) => {
  for (const [label, selector] of Object.entries(selectors)) {
    if (Array.isArray(selector)) {
      for (const item of selector) {
        const { label: subLabel, selector: subSelector } = item;
        await page.evaluate(
          (subLabel, subSelector) => {
            const observer = new MutationObserver((mutations) => {
              for (const mutation of mutations) {
                if (mutation.type === 'characterData') {
                  const newValue = mutation.target.textContent.trim();
                  observeElmData({ label: subLabel, newValue });
                }
              }
            });

            observer.observe(document.querySelector(subSelector), {
              characterData: true,
              subtree: true,
              attributes: true,
            });
          },
          subLabel,
          subSelector
        );
      }
    } else {
      await page.evaluate(
        (label, selector) => {
          const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
              if (mutation.type === 'characterData') {
                const newValue = mutation.target.textContent.trim();
                observeElmData({ label, newValue });
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
      'https://crex.live/scoreboard/K5K/1AC/2nd-ODI/W/Y/afg-vs-ban-2nd-odi-afghanistan-tour-of-bangladesh-2023/live';

    await page.goto(startUrl);
    console.log('Going');

    const selectors = {
      Last: 'div.result-box > span',
      Name: 'div > h1.name-wrapper > span',
      Status: 'div.final-result.m-none',
      Run: 'div.team-score span:nth-child(1)',
      Over: 'div.team-score span:nth-child(2)',
      Batsman1: [
        { label: 'B1name', selector: 'app-match-live-player div.batsmen-partnership:nth-child(1) div.batsmen-name' },
        { label: 'B1run', selector: 'app-match-live-player div.batsmen-partnership:nth-child(1) div.batsmen-score p:nth-child(1)' },
	      { label: 'B1Ball', selector: 'app-match-live-player div.batsmen-partnership:nth-child(1) div.batsmen-score p:nth-child(2)' },
	      { label: 'B1Four', selector: 'app-match-live-player div.batsmen-partnership:nth-child(1) div.strike-rate:nth-child(1) span:nth-child(2)' },
	      { label: 'B1Six', selector: 'app-match-live-player div.batsmen-partnership:nth-child(1) div.strike-rate:nth-child(2) span:nth-child(2)' },
	      { label: 'B1SR', selector: 'app-match-live-player div.batsmen-partnership:nth-child(1) div.strike-rate:nth-child(3) span:nth-child(2)' },
      ],

Batsman2: [
        { label: 'B2name', selector: 'app-match-live-player >  div > div:nth-child(3) div.batsmen-name' },
        { label: 'B2run', selector: 'app-match-live-player >  div > div:nth-child(3) div.batsmen-score p:nth-child(1)' },
              { label: 'B2Ball', selector: 'app-match-live-player >  div > div:nth-child(3) div.batsmen-score p:nth-child(2)' },
              { label: 'B2Four', selector: 'app-match-live-player >  div > div:nth-child(3) div.strike-rate:nth-child(1) span:nth-child(2)' },
              { label: 'B2Six', selector: 'app-match-live-player >  div > div:nth-child(3) div.strike-rate:nth-child(2) span:nth-child(2)' },
              { label: 'B2SR', selector: 'app-match-live-player >  div > div:nth-child(3) div.strike-rate:nth-child(3) span:nth-child(2)' }],
    };

    const initialValues = await observeElements(page, selectors);

    console.log('Initial values:', initialValues);

    let previousValue = '';

    setInterval(async () => {
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
                over: overValue,
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

    // await browser.close();
  } catch (err) {
    console.log(err);
  }
};

main();

