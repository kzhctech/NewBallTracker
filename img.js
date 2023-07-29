const puppeteer = require('puppeteer-core');

const searchGoogle = async (searchQuery) => {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.google.com');

    await page.waitForSelector('input');
    await page.type('input', searchQuery);
    await page.keyboard.press('Enter');

    await page.waitForNavigation();

    const searchResults = await page.evaluate(() => {
      const results = [];
      const searchElements = document.querySelectorAll('div.g');

      for (const element of searchElements) {
        const titleElement = element.querySelector('h3');
        const linkElement = element.querySelector('a');

        if (titleElement && linkElement) {
          results.push({
            title: titleElement.textContent.trim(),
            link: linkElement.href,
          });
        }
      }

      return results;
    });

    console.log('Search Results:', searchResults);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
};

// Usage
const searchQuery = 'M Ali ENG profile espncricinfo PNG';
searchGoogle(searchQuery);

