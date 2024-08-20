
const cheerio = require('cheerio');

const fs = require('fs');
const path = require('path');

function find_title(text) {
  for(let i = text.length-2; i > 0; i--) { 
    if (text[i] == "/") {
      return text.substring(i+1, text.length-1)
    }
  }
}

function scrape_poem(link_name) {
  const html = fs.readFileSync(path.join(__dirname, 'websites', `${link_name}.html`), 'utf8');
  const $ = cheerio.load(html);
  
  let final_text = ""

  $('.prosody-shadowline').each((i, shadowline) => {
    const realAttr = $(shadowline).attr('real');
    
    let fullText = '';
    $(shadowline).find('.prosody-shadowsyllable').each((j, syllable) => {
      fullText += $(syllable).text().trim() + ' ';
    });
    
    fullText = fullText.trim();
    
    final_text += realAttr + '\n'
    final_text += fullText + '\n'
  });

  final_text += '\n'

  fs.writeFile(`./poems/${link_name}.txt`, final_text, (err) => {
      if (err) {
          console.log('ERROR: cannot get link. Link: ' + link_name);
          console.log(err)
      };
    })
}

module.exports = { scrape_poem, find_title }