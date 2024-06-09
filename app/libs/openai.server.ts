import OpenAI from "openai";

let openai: OpenAI;

if (process.env.NODE_ENV === "production") {
  openai = new OpenAI();
} else {
  if (!global._DEV_OPEN_AI) {
    global._DEV_OPEN_AI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORG_ID,
    });
  }
  openai = global._DEV_OPEN_AI;
}

async function text(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  hasJson: boolean = false
) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    temperature: 1,
    response_format: {
      type: hasJson ? "json_object" : "text",
    },
  });

  const content = response.choices
    .map((choice) => choice.message.content)
    .join("\n");
  return {
    content,
  };
}

async function image(prompt: string) {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    quality: "hd",
    response_format: "url",
    style: "vivid",
  });

  return {
    content: response.data[0].url,
  };
}

const ai = {
  text,
  image,
};

export default ai;
