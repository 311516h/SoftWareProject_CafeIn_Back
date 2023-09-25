const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });

  const page = await browser.newPage();

  await page.goto("https://www.ediya.com/contents/drink.html");

  // 페이지 내용 가져오기
  const html = await page.content();

  // 필요한 데이터 추출
  const products = [];

  const $ = cheerio.load(html);

  $(".block_hot .menu_tt a").each((index, element) => {
    const prodName = $(element).find("a span").text();
    const prodImage = $(element).find("a img").attr("src");
    products.push({ prodName, prodImage });
  });

  const fs = require("fs");
  const https = require("https");

  const imageUrl = "/files/menu/IMG_1692174584126.png";
  const baseUrl = "https://www.ediya.com";

  // 이미지의 절대 URL 생성
  const absoluteImageUrl = baseUrl + imageUrl;

  // 이미지 다운로드
  https.get(absoluteImageUrl, (response) => {
    const chunks = [];

    response.on("data", (chunk) => {
      chunks.push(chunk);
    });

    response.on("end", () => {
      const imageData = Buffer.concat(chunks);

      // 이미지를 파일로 저장
      fs.writeFile("downloaded_image.png", imageData, (err) => {
        if (err) {
          console.error("이미지 저장 중 오류 발생:", err);
        } else {
          console.log("이미지 다운로드 및 저장 완료");
        }
      });
    });
  });

  // 결과를 JSON 형식으로 변환
  const resultJson = JSON.stringify(products, null, 2);

  // 결과를 JSON 파일에 저장
  fs.writeFileSync("ediya_menu.json", resultJson, "utf-8");

  console.log("결과가 ediya_menu.json 파일에 저장되었습니다.");

  await browser.close();
})();
