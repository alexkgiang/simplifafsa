const puppeteer = require('puppeteer');
const User = require('./user');
const Match = require('./match')

const match = new Match();
const user = new User("John", "Doe", "cheesegamerisabella@gmail.com", "5162542654", "mobile", "123 Main St, Anytown, USA", "united states", "/path/to/resume.pdf", "https://www.linkedin.com/in/alex-giange/");

//fills out an entire form

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleInput(page, fieldName) {
  var response;
  const element = await page.$(`[name="${fieldName}"]`);
  if (element !== null) {
      response = await match.fillInputField(user, fieldName)
      await page.type(`input[name="${fieldName}"]`, response);
      await sleep(1000);
  }
}

async function handleSelect(page, fieldName) {
  var response;
  const element = await page.$(`[name="${fieldName}"]`);
  if (element !== null) {
      response = await match.fillSelectField(user, fieldName)
      await page.select(`[name="${fieldName}"]`, response);
      await sleep(1000);
  }
}

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  const url = 'https://www.tesla.com/careers/search/job/apply/117786';
  await page.goto(url, { waitUntil: 'networkidle2' });

  const inputFields = await page.$$eval('input', fields =>
    fields.map(field => field.name)
  );

  const selectFields = await page.$$eval('select', fields =>
    fields.map(field => field.name)
  );

  const buttonFields = await page.$$eval('button', fields =>
    fields.map(field => field.name)
  );

  for (const field of inputFields) {
    await handleInput(page, field);
  }

  for (const field of selectFields) {
    await handleSelect(page, field);
  }

  await browser.close();
})();
