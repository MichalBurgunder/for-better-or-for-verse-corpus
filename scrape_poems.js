const axios = require('axios')

const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const { scrape_poem, find_title } = require('./poem_analysis.js')

const download_poem = async (url) => {
  try {
    const title =  find_title(url)
    const filename = './websites/' + title + '.html'

    const filePath = path.join(__dirname, 'websites', `${title}.html`);

    if(fs.existsSync(filePath)) { 
        return true
    }
    // Fetch the HTML content using Axios
    const response = await axios.get(url);
    const htmlContent = response.data;

    fs.writeFileSync(filename, htmlContent, (err) => {
        if (err) {
            console.log('ERROR: cannot get link. Error:');
            console.log(err)
        };
      })
    

    scrape_poem(title)
    } catch (error) {
        console.log(error)
        console.error(`Error downloading ${url}. Link name: ${url}` );
      }
}

// first get the full website with wget (for example), save it as an html file,
// and traverse the website from there. 
const html = fs.readFileSync('for_better_for_verse.html', 'utf8');
const $ = cheerio.load(html);

const urls = [];
$('.poem-results .titles li a').each((i, element) => {
  const url = $(element).attr('href');
  urls.push(url);
});

unique_links = [...new Set(urls)] 

for(let i=0; i<unique_links.length;i++) {
    download_poem(unique_links[i])
}
