const puppeteer = require('puppeteer');
const { user } = require('./user');
const Match = require('./match');
const MatchL = require('./matchL');

// const URL = "https://wellfound.com/company/via-transportation/jobs/1841647-strategic-finance-associate?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic"

const URL = 'https://www.tesla.com/careers/search/job/apply/117786';

class Form {
  /* Fills out an entire form */
  constructor() {
    this.match = new MatchL();
    this.user = user.toString();
    this.url = URL;
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async handleInput(page, fieldName) {
    var response;
    const element = await page.$(`[name="${fieldName}"]`);
    if (element !== null) {
        response = await this.match.fillInputField(this.user, fieldName)
        await page.type(`input[name="${fieldName}"]`, response);
        await this.sleep(500);
    }
  }

  async handleSelect(page, fieldName) {
    var response;
    const element = await page.$(`[name="${fieldName}"]`);
    if (element !== null) {
        response = await this.match.fillSelectField(this.user, fieldName)
        await page.select(`[name="${fieldName}"]`, response);
        await this.sleep(500);
    }
  }

  async main() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(this.url, { waitUntil: 'networkidle2' });

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
      await this.handleInput(page, field);
    }

    for (const field of selectFields) {
      await this.handleSelect(page, field);
    }

    await browser.close();
  }
}

async function run() {
  const form = new Form();
  form.main();
}

run();