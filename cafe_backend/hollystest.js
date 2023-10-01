const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const sites = ['https://www.hollys.co.kr/menu/espresso.do'];

  for (const site of sites) {
    await page.goto(site);

    const scrapedData = {};

    for (let i = 1; i <= 900; i++) {
      const elementId = `menuView1_${i}`;
      const menuViewElement = await page.$(`#${elementId}`);

      if (menuViewElement) {
        const menuDetailElement = await menuViewElement.$('.menu_detail');
        const menuInfoElement = await menuDetailElement.$('p.menu_info');

        if (menuInfoElement) {
          const text = await page.evaluate(el => el.textContent.trim(), menuInfoElement);
          scrapedData[elementId] = { text: text };
        } else {
          // 'menu_info' 요소가 없는 경우 빈 객체로 저장
          scrapedData[elementId] = {};
        }
      }
    }

    const jsonData = JSON.stringify({ prodInfo: scrapedData }, null, 2);
    const fileName = site.split('/').pop().split('.')[0] + '_infozzzzz.json';
    fs.writeFileSync(fileName, jsonData);

    console.log(`Data from ${site} has been saved to ${fileName}`);
  }

  await browser.close();
})();
