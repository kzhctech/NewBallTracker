const puppeteer = require('puppeteer-core');

let updatedValues = {};

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

  Object.assign(updatedValues, initialValues);

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
                if (mutation.type === 'characterData' || mutation.type === 'childList') {
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

const main = async (url) => {
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

    await page.exposeFunction('observeElmData', (data) => {
      updatedValues[data.label] = data.newValue;
   //   console.log(data);
     console.log('Updated values:', updatedValues);
    });

    const startUrl = url;

    await page.goto(startUrl);
    console.log('Going');

    const selectors = {
  Last: 'div.result-box > span',
  Name: 'div > h1.name-wrapper > span',
  Status: 'div.final-result.m-none',
  Run: 'div.team-score span:nth-child(1)',
  Over: 'div.team-score span:nth-child(2)',
  B1name: 'app-match-live-player div.batsmen-partnership:nth-child(1) div.batsmen-name',
  B1run: 'app-match-live-player div.batsmen-partnership:nth-child(1) div.batsmen-score p:nth-child(1)',
  B1Ball: 'app-match-live-player div.batsmen-partnership:nth-child(1) div.batsmen-score p:nth-child(2)',
  B1Four: 'app-match-live-player div.batsmen-partnership:nth-child(1) div.strike-rate:nth-child(1) span:nth-child(2)',
  B1Six: 'app-match-live-player div.batsmen-partnership:nth-child(1) div.strike-rate:nth-child(2) span:nth-child(2)',
  B1SR: 'app-match-live-player div.batsmen-partnership:nth-child(1) div.strike-rate:nth-child(3) span:nth-child(2)',
  B2name: 'app-match-live-player > div > div:nth-child(3) div.batsmen-name',
  B2run: 'app-match-live-player > div > div:nth-child(3) div.batsmen-score p:nth-child(1)',
  B2Ball: 'app-match-live-player > div > div:nth-child(3) div.batsmen-score p:nth-child(2)',
  B2Four: 'app-match-live-player > div > div:nth-child(3) div.strike-rate:nth-child(1) span:nth-child(2)',
  B2Six: 'app-match-live-player > div > div:nth-child(3) div.strike-rate:nth-child(2) span:nth-child(2)',
  B2SR: 'app-match-live-player > div > div:nth-child(3) div.strike-rate:nth-child(3) span:nth-child(2)',
BLname: 'app-match-live-player > div > div:nth-child(4) div.batsmen-name',
BLWkRun: 'app-match-live-player > div > div:nth-child(4) div.batsmen-score p:nth-child(1)',
BLOver: 'app-match-live-player > div > div:nth-child(4) div.batsmen-score p:nth-child(2)',
//BLEco: 'app-match-live-player > div > div:nth-child(4) div.strike-rate:nth-child(3) span:nth-child(2)'
};


    const initialValues = await observeElements(page, selectors);
    Object.assign(updatedValues, initialValues);

    console.log('Initial values:', initialValues);
    console.log('Updated values:', updatedValues);

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

let lbElement = document.querySelector('div.live-data div.overs');
let rrElement = document.querySelector('div.live-score-card div.team-run-rate');

        let lbValue = lbElement ? lbElement.textContent.trim() : '';
        let rrValue = rrElement ? rrElement.textContent.trim() : '';



              return {
                comment: commentValue,
                over: overValue,
	        LBs: lbValue,
                RR: rrValue,
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


          updatedValues.LBs = result.LBs;
          updatedValues.RR = result.RR;
      


		// Update the updatedValues variable with the new values
       //   updatedValues.Comment = result.comment;
        //  updatedValues.Over = result.over;
        //  console.log('Updated values:', updatedValues);
		
        }
      } else {
        console.log('No non-empty value found in child divs');
      }
    }, 1000);

  //  await browser.close();
  } catch (err) {
    console.log(err);
  }
};

main("https://crex.live/scoreboard/L0U/1G6/1st-TEST/T/U/pak-vs-sl-1st-test-pakistan-tour-of-sri-lanka-2023/live");
