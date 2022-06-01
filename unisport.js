import puppeteer from "puppeteer";
import { scheduleJob } from "node-schedule";
import "dotenv/config";

/**
 * In der .env-Datei werden die Zugangsdaten für den Unisport im Format
 * E_MAIL="loremipsum"
 * PW="loremipsum"
 * abgelegt
 */

const LOGIN = "https://hochschulsport.uni-heidelberg.de/oa_oeff/login.php";

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

/**
 * Der String mit den Sternen beschreibt, wann der folgende Code ausgeführt werden soll
 * Siehe auch https://crontab.guru/#1_7_*_*_3
 * 1 7 * * 3 führt den Code beispielsweise immer Mittwochs um 07:01 aus
 */

scheduleJob('13 * * * *', function () {
  (async () => {
    console.log('Waiting for scheduled time')
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(LOGIN);
  
    try {
      await login(page);
      await bookTicket(page,"ULT");
      await browser.close();
    } catch (error) {
      console.log(error);
    }
  })();
});