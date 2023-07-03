require("dotenv").config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const { user } = require("./user");

const { OpenAI } = require("langchain/llms/openai");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const {
  PromptTemplate,
  ChatMessagePromptTemplate,
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} = require("langchain/prompts");
const { StructuredOutputParser } = require("langchain/output_parsers");
const { HumanChatMessage, SystemChatMessage } = require("langchain/schema");

class TextStructuredOutputParser extends StructuredOutputParser {
  getFormatInstructions() {
    return `
      The output should have the answer to the prompt, and the answer only.
      There should be no punctuation, quotes, or any extra output.
      For example, if the answer is Jane, then the answer should produce: Jane 
      If the answer is not a string, it should produce one item.
      For example, a link would be: https://www.linkedin.com/in/alex-giange/
      A phone number would be: 9728443577
      Again, the output should have the answer to the prompt, and nothing else.
      `;
  }

  parse(raw) {
    return JSON.parse(raw);
  }

  parseWithPrompt(text, prompt) {}
}

class SelectStructuredOutputParser extends StructuredOutputParser {
  getFormatInstructions() {
    return `
    The output should have the selection for the select field.
    If the select field has options like "Yes", "No", the output should be one of these options.
    For example, if the answer is "Yes", then the answer should produce: Yes
    The output should be the most appropriate option based on the user's information.
    There should be no punctuation, quotes, or any extra output.
    Again, the output should have the answer to the prompt, and nothing else.
    `;
  }

  parse(raw) {
    return JSON.parse(raw);
  }

  parseWithPrompt(text, prompt) {}
}

class TextAreaStructuredOutputParser extends StructuredOutputParser {
  getFormatInstructions() {
    return `
      The output should have the text for the text area field.
      Text area fields are often used for larger amounts of text, so the output can be a paragraph or multiple sentences.
      Make sure the output is in line with the field's requirements (e.g. a personal statement, a description, feedback).
      There should be no unnecessary punctuation, quotes, or any extra output.
    `;
  }

  parse(raw) {
    return JSON.parse(raw);
  }

  parseWithPrompt(text, prompt) {}
}

class MatchL {
  /* Matches a field to the appropriate answer based on the user */
  constructor() {
    this.openai = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0,
    });
  }

  async fillInputField(user, inputField) {
    const parser = TextStructuredOutputParser.fromNamesAndDescriptions({
      answer: "answer to the user's question",
      source: "source used to answer the user's question",
    });

    const formatInstructions = parser.getFormatInstructions();

    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "The user is filling out a form. You are a helpful assistant that helps the user decide what to put into each field. \n{format_instructions}"
      ),
      HumanMessagePromptTemplate.fromTemplate(
        "The current field is {field}. Here is information about the user: \n{user}"
      ),
    ]);

    const input = await chatPrompt.format({
      format_instructions: formatInstructions,
      field: inputField,
      user: user.toString(),
    });

    const response = await this.openai.call([new HumanChatMessage(input)]);

    // const parsedResponse = await parser.parse(response)

    return response.text;
  }

  async fillSelectField(user, selectField) {
    const parser = SelectStructuredOutputParser.fromNamesAndDescriptions({
      answer: "answer to the user's question",
      source: "source used to answer the user's question",
    });

    const formatInstructions = parser.getFormatInstructions();

    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "The user is filling out a form. You are a helpful assistant that helps the user decide what to put into each field. \n{format_instructions}"
      ),
      HumanMessagePromptTemplate.fromTemplate(
        "The current field is {field}. Here is information about the user: \n{user}"
      ),
    ]);

    const input = await chatPrompt.format({
      format_instructions: formatInstructions,
      field: selectField,
      user: user.toString(),
    });

    const response = await this.openai.call([new HumanChatMessage(input)]);

    // const parsedResponse = await parser.parse(response)

    return response.text;
  }

  async findCorrectFile(user, selectField) {
    const path = require("path");
    const filePath = path.resolve(__dirname, "data", `AlexGiangResume.pdf`);

    return filePath;
  }

  async fillTextAreaField(user, inputField) {
    const parser = TextAreaStructuredOutputParser.fromNamesAndDescriptions({
      answer: "answer to the user's question",
      source: "source used to answer the user's question",
    });

    const formatInstructions = parser.getFormatInstructions();

    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "The user is filling out a form. You are a helpful assistant that helps the user fill out questions. \n{format_instructions}"
      ),
      HumanMessagePromptTemplate.fromTemplate(
        "The current field is {field}. Here is information about the user: \n{user}"
      ),
    ]);

    const input = await chatPrompt.format({
      format_instructions: formatInstructions,
      field: inputField,
      user: user.toString(),
    });

    const response = await this.openai.call([new HumanChatMessage(input)]);

    // const parsedResponse = await parser.parse(response)

    return response.text;
  }
}

// async function run() {
//   const match = new MatchL();

//   const response = await match.fillInputField(user, "first name");

//   console.log(response);
// }

// run();

module.exports = MatchL;
