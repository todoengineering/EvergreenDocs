// TODO: Not sure what I'm doing with this file...but it's good enough for now

import { Configuration, OpenAIApi } from "openai";

import config from "../config.js";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: config.openAi.key,
  })
);

const createCompletion = async (prompt: string) => {
  const response = await openai.createCompletion({
    model: config.openAi.model,
    prompt,
    temperature: 0.5,
    max_tokens: 2048 - prompt.length,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0,
  });

  if (!response.data.choices[0].text) {
    throw new Error("No generated test");
  }

  // TODO: Less logging here. Maybe we should save in dynamo or something
  console.log(`Generated: ${response.data.choices[0].text}`);

  return response.data.choices[0].text;
};

export { createCompletion };
