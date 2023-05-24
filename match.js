require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const { user } = require('./user');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
class Match {
  /* Matches a field to the appropriate answer based on the user */
  constructor() {
    this.openai = new OpenAIApi(configuration);
  }

  createPrompt(user, inputField) {
    let context = `The user is filling a form. The current field is "${inputField}". The user information is as follows: ${JSON.stringify(user)}.`;
    let question = `What should the user enter in the "${inputField}" field? Respond with one word, or if the output is not a word, then one item.`;

    return [
      { role: "system", content: context },
      { role: "user", content: question }
    ];
  }

  async fillInputField(user, inputField) {
    const prompt = this.createPrompt(user, inputField);

    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: prompt,
      });
      const assistantResponse = response.data.choices[0].message.content;
      return assistantResponse;
    } catch (error) {
      return error;
    }
  }

  async fillSelectField(user, selectField) {
    const prompt = this.createPrompt(user, selectField);

    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: prompt,
      });
      const assistantResponse = response.data.choices[0].message.content;
      return assistantResponse;
    } catch (error) {
      return error;
    }
  }
}

// async function run() {

//   const match = new Match();

//   try {
//     const response = await match.fillInputField(user, "firstname");
//     console.log("Response:", response);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// run();


module.exports = Match;
