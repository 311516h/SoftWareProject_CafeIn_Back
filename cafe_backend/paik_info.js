const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });

  const page = await browser.newPage();

  await page.goto("https://paikdabang.com/menu/menu_coffee/");

  // 페이지 내용 가져오기
  const html = await page.content();

  // 필요한 데이터 추출
  const products = [];

  const $ = cheerio.load(html);

  $(".container .menu_list.clear ul li .hover").each((index, element) => {
    const prodInfo = $(element).find("p.txt").text();
    const volume = $(element).find("p.menu_ingredient_basis").text();
    const firstDiv = $(element).find("li:nth-child(1) div:nth-child(2)");
    const caffeine = firstDiv.text();
    const secondDiv = $(element).find("li:nth-child(2) div:nth-child(2)");
    const kcal = secondDiv.text();
    const thirdDiv = $(element).find("li:nth-child(3) div:nth-child(2)");
    const sodium = thirdDiv.text();
    const fourthDiv = $(element).find("li:nth-child(4) div:nth-child(2)");
    const sugars = fourthDiv.text();
    const fifthDiv = $(element).find("li:nth-child(5) div:nth-child(2)");
    const sat_FAT = fifthDiv.text();

    products.push({ prodInfo, volume, kcal, caffeine, sodium, sugars, sat_FAT });
  });

  // JSON 파일에 저장
  const resultJSON = JSON.stringify(products, null, 2);
  fs.writeFileSync("paik_info.json", resultJSON, "utf-8");

  console.log("결과가 paik_info.json 파일에 저장되었습니다.");

  await browser.close();
})();
