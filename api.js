// api.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
// const dotenv = require("dotenv");
// dotenv.config();

// api ket
const gemini_api_key ="AIzaSyDH1vsvIubkoFdknuSR-YkoVSbv7nJtiuc";

// getinf the ai 
const googleAI = new GoogleGenerativeAI(gemini_api_key);

const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,

};

const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  geminiConfig,
});
// feaching result fron api
export const generate = async (text) => {
  try {
    const prompt = text;
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.log("response error", error);
  }
};
