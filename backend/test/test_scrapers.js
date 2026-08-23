const axios = require('axios');

async function testGFGDirectScrape(username) {
  try {
    const { data: html } = await axios.get(`https://www.geeksforgeeks.org/user/${encodeURIComponent(username)}/`, {
      timeout: 12000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    const scoreMatch = html.match(/\\?"score\\?"\s*:\s*(\d+)/i) || html.match(/score[^0-9]{1,10}(\d+)/i);
    const solvedMatch = html.match(/\\?"total_problems_solved\\?"\s*:\s*(\d+)/i) || html.match(/total_problems_solved[^0-9]{1,10}(\d+)/i);
    const rankMatch = html.match(/\\?"institute_rank\\?"\s*:\s*(\d+)/i);

    console.log(`GFG Direct Scrape for [${username}]:`);
    console.log('Score:', scoreMatch ? scoreMatch[1] : 'Not found');
    console.log('Total Solved:', solvedMatch ? solvedMatch[1] : 'Not found');
    console.log('Institute Rank:', rankMatch ? rankMatch[1] : 'Not found');
  } catch (e) {
    console.log(`GFG Direct Scrape Error for [${username}]:`, e.message);
  }
}

async function run() {
  await testGFGDirectScrape('kunaldhafzmv');
}

run();
