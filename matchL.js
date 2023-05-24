require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const { user } = require('./user');

const { OpenAI } = require("langchain/llms/openai");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { PromptTemplate, ChatMessagePromptTemplate, ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } = require("langchain/prompts");
const { StructuredOutputParser } = require("langchain/output_parsers");
const { HumanChatMessage, SystemChatMessage } = require("langchain/schema");

class StructuredOutputParser {
  getFormatInstructions() {
    return (
      `
      The output should have the answer to the prompt, and the answer only.
      There should be no punctuation, quotes, or any extra output.
      For example, if the answer is Jane, then the answer should produce: Jane 
      If the answer is not a string, it should produce one item.
      For example, a link would be: https://www.linkedin.com/in/alex-giange/
      A phone number would be: 9728443577
      Again, the output should have the answer to the prompt, and nothing else.
      `
    )
  }

  parse(raw) {
    // ...
  }

  parseWithPrompt(text, prompt) {
    // ...
  }
}


class MatchL {
  /* Matches a field to the appropriate answer based on the user */
  constructor() {
    this.openai = new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 });
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

    const parser = StructuredOutputParser.fromNamesAndDescriptions({
      answer: "answer to the user's question",
      source: "source used to answer the user's question",
    });
    
    const formatInstructions = parser.getFormatInstructions();
    
    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "The user is filling out a form. You are a helpful assistant that helps the user decide what to put into each field. \n{format_instructions}"
      ),
      HumanMessagePromptTemplate.fromTemplate("The current field is {field}. Here is information about the user: \n{user}"),
    ]);

    const input = await chatPrompt.format({
      format_instructions: formatInstructions,
      field: inputField,
      user: user.toString(),
    });

    const response = await this.openai.call([
      new HumanChatMessage(input)
    ]);

    // const parsedResponse = await parser.parse(response)
    
    return response
  }

  async fillSelectField(user, selectField) {
    
  }
}

async function run() {

  const match = new MatchL();

  const response = await match.fillInputField(user, "first name");

  console.log(response)
}

run();


module.exports = MatchL;