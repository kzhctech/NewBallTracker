
const puppeteer = require('puppeteer-core');

const main = async () => {
    try {
        const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-gpu",
    ]
  });
        const page = await browser.newPage()
	await page.setViewport({
    width: 420,
    height: 980,
  });
        const startUrl = 'https://crex.live/scoreboard/HXJ/1AN/31st-Match/21/2A/ham-vs-lancs-31st-match-county-championship-division-one-2023/live'
	//await page.emulate(iPhone);
        await page.goto(startUrl)
        console.log("going");

/*

async function waitForElement(page, selector) {
  const element = await page.waitForSelector(selector);
  return element;
}

// Usage:
const element = await waitForElement(page, 'div.result-box');

*/


	  setInterval(async () => {

	    var elm = 'div.result-box';
	    await page.waitForSelector(elm);
	    let element = await page.$(elm)

        let value = await page.evaluate(el => el.textContent.trim(), element)
        console.log(value);

	  } ,1000);

	 




	
    } catch (err) {
        console.log(err);
    }
}
main()
