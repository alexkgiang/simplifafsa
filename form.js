const puppeteer = require("puppeteer");
const { user } = require("./user.js");
const MatchL = require("./matchL.js");

// const URL = "https://wellfound.com/company/via-transportation/jobs/1841647-strategic-finance-associate?utm_campaign=google_jobs_apply&utm_source=google_jobs_apply&utm_medium=organic"

const URL = "https://www.tesla.com/careers/search/job/apply/117786";

class Form {
  /* Fills out an entire form */
  constructor() {
    this.match = new MatchL();
    this.user = user.toString();
    this.url = URL;
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async handleInput(page, fieldName, fieldType) {
    var response;
    const element = await page.$(`[name="${fieldName}"]`);
    if (element !== null) {
      //handle file input
      if (fieldType === 'text') { //text input
        response = await this.match.fillInputField(this.user, fieldName);
        await page.type(`input[name="${fieldName}"]`, response);
      }
      else if (fieldType === 'file') {
        console.log('helo')
        response = await this.match.findCorrectFile(this.user, fieldName);
        console.log(response)
        await element.uploadFile(response);
      }
    }
  }

  async handleSelect(page, fieldName) {
    var response;
    const element = await page.$(`[name="${fieldName}"]`);
    if (element !== null) {
      response = await this.match.fillSelectField(this.user, fieldName);
      await page.select(`[name="${fieldName}"]`, response);
      await this.sleep(500);
    }
  }

  async handleTextarea(page, fieldName) {
    const element = await page.$(`[name="${fieldName}"]`);
    if (element !== null) {
      const response = await this.match.fillInputField(this.user, fieldName);
      await page.type(`textarea[name="${fieldName}"]`, response);
      await this.sleep(500);
    }
  }

  async main() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(this.url, { waitUntil: "networkidle2" });

    // text input, file input
    const inputFields = await page.$$eval('input', fields =>
      fields.map(field => ({ name: field.name, type: field.type }))
    );

    // dropdown select
    const selectFields = await page.$$eval("select", (fields) =>
      fields.map((field) => field.name)
    );

    // text area
    const textareaFields = await page.$$eval("textarea", (fields) =>
      fields.map((field) => field.name)
    );

    const buttonFields = await page.$$eval("button", (fields) =>
      fields.map((field) => field.name)
    );

    for (const field of inputFields) {
      await this.handleInput(page, field.name, field.type);
    }

    for (const field of selectFields) {
      await this.handleSelect(page, field);
    }

    for (const field of textareaFields) {
      await this.handleTextarea(page, field);
    }

    await this.sleep(2000);
    await browser.close();
  }
}

async function run() {
  const form = new Form();
  form.main();
}

run();
