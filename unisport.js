import puppeteer from "puppeteer";
import "dotenv/config";

const LOGIN = "https://hochschulsport.uni-heidelberg.de/oa_oeff/login.php";
const COURSES = "gr_info.php?krs=";

async function login(page) {
  await page.type('input[name="email"]', process.env.E_MAIL);
  await page.type('input[name="passw"]', process.env.PW);
  await page.click('input[type="submit"]');
}

async function bookTicket(page, courseShort) {
  await page.goto(
    `https://hochschulsport.uni-heidelberg.de/oa_oeff/qr_info.php?krs=${courseShort}`
  );

  await page.click('input[name="buchen"');
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(LOGIN);

  try {
    await login(page);
    await bookTicket(page, "ULT");
    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();