require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const User = require('./user');
const { Configuration, OpenAIApi } = require("openai");

// const { OpenAI } = require("langchain/llms/openai");
// const { PromptTemplate } = require("langchain/prompts");
// const { StructuredOutputParser } = require("langchain/output_parsers");

// const parser = StructuredOutputParser.fromNamesAndDescriptions({
//   answer: "answer to the user's question",
//   source: "source used to answer the user's question, should be a dictionary",
// });

// const formatInstructions = parser.getFormatInstructions();

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
    let question = `What should the user enter in the "${inputField}" field? Respond with one word and no punctuation.`;

    return [
      { role: "system", content: context },
      { role: "user", content: question }
    ];
  }

  async fillField(user, inputField) {
    const prompt = this.createPrompt(user, inputField);

    // const prompt = new PromptTemplate({
    //   template:
    //     "Answer the users question as best as possible.\n{format_instructions}\n{question}",
    //   inputVariables: ["question"],
    //   partialVariables: { format_instructions: formatInstructions },
    // });

    // const model = new OpenAI({ temperature: 0 });

    // const input = await prompt.format({
    //   question: "What is the capital of France?",
    // });
    // const response = await model.call(input);
    
    // console.log(input);
    // console.log(response);

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

async function run() {

  const match = new Match();
  const user = new User("John", "Doe", "cheesegamerisabella@gmail.com", "5162542654", "123 Main St, Anytown, USA", "/path/to/resume.pdf");

  try {
    const response = await match.fillField(user, "firstname");
    console.log("Response:", response);
  } catch (error) {
    console.error("Error:", error);
  }
}

run();


module.exports = Match;
