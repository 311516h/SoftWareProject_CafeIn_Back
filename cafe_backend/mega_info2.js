// // const puppeteer = require('puppeteer');
// // const cheerio = require('cheerio');
// // const fs = require('fs');

// // (async () => {
// //   const browser = await puppeteer.launch({ headless: "new" });
// //   const page = await browser.newPage();

// //   const products = [];
// //   let currentPage = 1;
  
// //   const result = [];

// //   try {
// //     await page.goto(`https://www.mega-mgccoffee.com/menu/?menu_category1=1&menu_category2=1`, {
// //       waitUntil: 'domcontentloaded', // 페이지 DOM이 로드될 때까지 기다립니다.
// //       timeout: 0, // 타임아웃 시간을 무한으로 설정합니다.
// //     });

// //     // "board_page_first" 클래스를 가진 링크를 찾아서 클릭
// //     const firstPageLink = await page.$('li.board_page_first a');
// //     if (firstPageLink) {
// //       await firstPageLink.click();
// //     }

// //     while (true) {
// //       const html = await page.content();
// //       const $ = cheerio.load(html);

// //       // 필요한 데이터 추출
// //       const productInfo = await page.evaluate(() => {
// //         const prodName = document.querySelector('.cont_text_wrap li .cont_gallery_list_box b').textContent;

// //         return {
// //           prodName
// //         }

// //         //result.push(productInfo);
// //       });

// //       result.push(productInfo);

// //       // "board_page_next" 클래스를 가진 링크가 없으면 루프 종료
// //       const nextPageLink = await page.$('a.board_page_next');
// //       if (!nextPageLink) {
// //         break;
// //       }

// //       // 다음 페이지로 이동
// //       await nextPageLink.click();

// //       try {
// //         await page.waitForTimeout(2000); // 페이지 이동 후 대기
// //       } catch (error) {
// //         console.error('대기 중 오류 발생:', error);
// //       }
// //     }
// //   } catch (error) {
// //     console.error('페이지 이동 중 오류 발생:', error);
// //   } finally {
// //     // 결과 JSON 파일에 저장
// //     fs.writeFileSync('mega_info2.json', JSON.stringify(result, null, 2), 'utf-8');
// //     console.log('모든 페이지의 결과가 mega_info2.json 파일에 저장되었습니다.');
// //     await browser.close();
// //   }
// // })();


// ///////////////////

// const puppeteer = require('puppeteer');
// const cheerio = require('cheerio');
// const fs = require('fs');

// (async () => {
//   const browser = await puppeteer.launch({ headless: "new" });
//   const page = await browser.newPage();

//   const result = [];

//   try {
//     await page.goto(`https://www.mega-mgccoffee.com/menu/?menu_category1=1&menu_category2=1`, {
//       waitUntil: 'domcontentloaded',
//       timeout: 0,
//     });

//     while (true) {
//       const html = await page.content();
//       const $ = cheerio.load(html);

//       // 각 페이지의 모든 데이터 추출
//       $(".cont_text_wrap li .inner_modal").each((index, element) => {
//         const prodName = $(element).find(".cont_text_box b").text();
//         const text = $(element).find(".cont_text").eq(2).text();

//         result.push({
//           prodName,
//           text,
//           // 다른 데이터를 추출하려면 이 부분을 수정하세요.
//           // const volume = ...;
//           // const kcal = ...;
//           // ...
//         });
//       });


//       // const productInfos = await page.evaluate(() => {
//       //   const productElements = document.querySelectorAll(".cont_text_wrap li .cont_gallery_list_box b");
//       //   const products = [];

//       //   productElements.forEach((element) => {
//       //     const prodName = element.textContent;
          

//       //     products.push({
//       //       prodName,
//       //       // volume,
//       //       // kcal,
//       //       // ...
//       //     });
//       //   });

//       //   return products;
//       // });

//       //result.push(...productInfos);

//       const nextPageLink = await page.$('a.board_page_next');
//       if (!nextPageLink) {
//         break;
//       }

//       await nextPageLink.click();

//       try {
//         await page.waitForTimeout(2000);
//       } catch (error) {
//         console.error('대기 중 오류 발생:', error);
//       }
//     }
//   } catch (error) {
//     console.error('페이지 이동 중 오류 발생:', error);
//   } finally {
//     fs.writeFileSync('mega_info2.json', JSON.stringify(result, null, 2), 'utf-8');
//     console.log('모든 페이지의 결과가 mega_info2.json 파일에 저장되었습니다.');
//     await browser.close();
//   }
// })();


const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const products = [];
  let currentPage = 1;

  try {
    await page.goto(`https://www.mega-mgccoffee.com/menu/?menu_category1=1&menu_category2=1`, {
      waitUntil: 'domcontentloaded', // 페이지 DOM이 로드될 때까지 기다립니다.
      timeout: 0, // 타임아웃 시간을 무한으로 설정합니다.
    });

    // "board_page_first" 클래스를 가진 링크를 찾아서 클릭
    const firstPageLink = await page.$('li.board_page_first a');
    if (firstPageLink) {
      await firstPageLink.click();
    }

    while (true) {
      const html = await page.content();
      const $ = cheerio.load(html);

      // 필요한 데이터 추출
      $('.cont_text_wrap li .inner_modal').each((index, element) => {
        const prodName = $(element).find('.cont_text_box b').text();
        const text = $(element).find(".cont_text").eq(2).text().trim(); // trim()을 사용하여 앞뒤 공백 제거
        products.push({ prodName, text });
      });

      // "board_page_next" 클래스를 가진 링크가 없으면 루프 종료
      const nextPageLink = await page.$('a.board_page_next');
      if (!nextPageLink) {
        break;
      }

      // 다음 페이지로 이동
      await nextPageLink.click();

      try {
        await page.waitForTimeout(2000); // 페이지 이동 후 대기
      } catch (error) {
        console.error('대기 중 오류 발생:', error);
      }
    }
  } catch (error) {
    console.error('페이지 이동 중 오류 발생:', error);
  } finally {
    // 결과 JSON 파일에 저장
    fs.writeFileSync('mega_info2.json', JSON.stringify(products, null, 2), 'utf-8');
    console.log('모든 페이지의 결과가 mega_info2.json 파일에 저장되었습니다.');
    await browser.close();
  }
})();

