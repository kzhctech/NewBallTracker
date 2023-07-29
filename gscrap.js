const axios = require('axios');
const cheerio = require('cheerio');

async function performGoogleSearch(query) {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(searchUrl);
    const $ = cheerio.load(response.data);

    // Extract search results
    const searchResults = [];
    $('div.g').each((index, element) => {
      const title = $(element).find('h3').text();
      const url = $(element).find('a').attr('href');
      searchResults.push({ title, url });
    });

    return searchResults;
  } catch (error) {
    console.error('Error performing Google search:', error);
    return [];
  }
}

const query = 'Node.js tutorials';
performGoogleSearch(query)
  .then(results => {
    console.log('Search results:', results);
  })
  .catch(error => {
    console.error('Error:', error);
  });

