const puppeteer = require('puppeteer-core');

const searchGoogle = async (searchQuery) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();

  try {

	console.time('Execution Time');
  
    await page.goto('https://www.google.com');

    await page.waitForSelector('input.gNO89b');
	const inputElement = await page.$('input.gNO89b'); // Find the input element
    const inputOuterHTML = await page.evaluate(element => element.outerHTML, inputElement);

    console.log('Input OuterHTML:', inputOuterHTML);

    await page.type('input', searchQuery);
    await page.keyboard.press('Enter');

    await page.waitForNavigation();

    const firstResult = await page.evaluate(() => {
      const firstElement = document.querySelector('div.g');

      const titleElement = firstElement.querySelector('h3');
      const linkElement = firstElement.querySelector('a');

      const title = titleElement ? titleElement.textContent.trim() : '';
      const link = linkElement ? linkElement.href : '';

      return {
        title,
        link,
      };
    });

    console.log('First Search Result:', firstResult);

    // Navigate to the first URL
    await page.goto(firstResult.link);

    // Wait for the page to load
    await page.waitForSelector('img');
    // Get the text content of the page
    const pageContent = await page.evaluate(() => {
      return document.body.textContent;
    });

   // console.log('Page Content:', pageContent);
	  

const imageUrl = await page.evaluate(() => {
      const imageElement = document.querySelector('img');
      return imageElement ? imageElement.src : null;
    });

    console.log('First Image URL:', imageUrl);


console.timeEnd('Execution Time');



  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
};

// Usage
const searchQuery = 'M Rahaman profile espncricinfo.com';
searchGoogle(searchQuery);

