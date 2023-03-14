// TODO: Not sure what I'm doing with this file...but it's good enough for now

import { Configuration, OpenAIApi } from "openai";

import config from "../config.js";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: config.openAi.key,
  })
);

const createCompletion = async (prompt: string) => {
  const response = await openai.createChatCompletion({
    model: config.openAi.model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  if (!response.data.choices[0].message?.content) {
    throw new Error("No generated text");
  }

  // TODO: Less logging here. Maybe we should save in dynamo or something
  console.log(`Generated: ${response.data.choices[0].message?.content}`);

  return response.data.choices[0].message?.content;
};

export { createCompletion };
