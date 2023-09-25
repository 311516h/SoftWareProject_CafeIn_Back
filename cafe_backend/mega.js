const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto('https://www.mega-mgccoffee.com/menu/?menu_category1=1&menu_category2');

  // 페이지 내용 가져오기
  const html = await page.content();

  // 필요한 데이터 추출
  const products = [];

  const $ = cheerio.load(html);

  $('.cont_text_wrap li .cont_gallery_list_box').each((index, element) => {
    const prodName = $(element).find('b').text();
    const prodImage = $(element).find('img').attr('src');
    products.push({ prodName, prodImage });
  });

  // 결과 JSON 파일에 저장
  fs.writeFileSync('mega_menu.json', JSON.stringify(products, null, 2), 'utf-8');
  console.log('결과가 mega_menu.json 파일에 저장되었습니다.');

  // 결과 텍스트 파일에 저장
  const resultText = products.map(({ prodName, prodImage }) => `${prodName}: ${prodImage}`).join('\n');
  fs.writeFileSync('mega_menu.txt', resultText, 'utf-8');
  console.log('결과가 mega_menu.txt 파일에 저장되었습니다.');

  await browser.close();
})();
