const puppeteer = require('puppeteer-core');                                                        const main = async () => {                            try {                                                 const browser = await puppeteer.launch({      headless: true,
    args: [
      "--no-sandbox",
      "--disable-gpu",                                ]
  });                                                     const page = await browser.newPage()
        await page.setViewport({                      width: 420,
    height: 980,
  });
        const startUrl = 'http://localhost:4000/match/633fab347293b2efad9af4e6'
        //await page.emulate(iPhone);   
	
	await page.goto(startUrl)
        console.log("going");

	



const targetSelector = 'div#okbox';
    let previousValue = '';

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          puppeteerLogMutation();
        }
      }
    });

    observer.observe(await page.$(targetSelector), { childList: true });

    // Function to log the updated value
    async function puppeteerLogMutation() {
      const updatedValue = await page.$eval(targetSelector, element => element.textContent);
      if (updatedValue !== previousValue) {
        previousValue = updatedValue;
        console.log('Updated value:', updatedValue);
      }
    }

    await page.exposeFunction('puppeteerLogMutation', puppeteerLogMutation);

    






  await page.evaluate(() => {
    document.querySelector('body').appendChild(document.createElement('br'));
  });

} catch (err) {
        console.log(err);                                      }

    }

main();
