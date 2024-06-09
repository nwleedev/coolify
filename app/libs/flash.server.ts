import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

let flashAi: GenerativeModel;
const apiKey = process.env.GEMINI_FLASH_KEY;
const aiInstance = new GoogleGenerativeAI(apiKey);

if (process.env.NODE_ENV === "production") {
  flashAi = aiInstance.getGenerativeModel({ model: "gemini-1.5-flash" });
} else {
  if (!global._DEV_FLASH_AI) {
    global._DEV_FLASH_AI = aiInstance.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
  }
  flashAi = global._DEV_FLASH_AI;
}

async function textCreate(prompt: string) {
  const resp = await flashAi.generateContent(prompt);

  const text = resp.response.text();
  return text;
}

const ai = {
  textCreate,
};

export default ai;
