import { Configuration, OpenAIApi } from "openai";

import config from "./config.js";
import type { JSONSchemaForNPMPackageJsonFiles } from "./types/package-json.js";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: config.openAi.key,
  })
);

const createGenerateReadmePrompt = (projectName: string, packageJson: string) => {
  const packageJsonParsed: JSONSchemaForNPMPackageJsonFiles = JSON.parse(packageJson);

  const name = packageJsonParsed.name;
  const description = packageJsonParsed.description;
  const keywords = packageJsonParsed.keywords;
  const dependencies = [
    ...Object.keys(packageJsonParsed.dependencies || {}),
    ...Object.keys(packageJsonParsed.devDependencies || {}),
  ];
  const scripts = Object.keys(packageJsonParsed.scripts || {});
  const nodeVersion = packageJsonParsed.engines?.node || "unknown";
  const packageManager = packageJsonParsed.packageManager || "unknown";
  const workspaces = packageJsonParsed.workspaces || "unknown";

  const prompt =
    `I have a gituhub repository called ${projectName}. This is all the information I know about it:
- Name: ${name}
- Description: ${description}
- Keywords: ${keywords?.join(", ")}
- Dependencies: ${dependencies.join(", ")}
- Scripts: ${scripts.join(", ")}
- Node version: ${nodeVersion}
- Package manager: ${packageManager}
- Workspaces: ${workspaces}

I want to generate a README.md file for this project. The README.md file should contain the following sections:
- Project name
- Project description
- Table of contents
- Features
- Getting started
- Built with
- Contributing
- License

Write a complete README.md file below for this project in raw markdown format.
`.replace(/\r?\n/g, "\\n");

  console.log(`Created readme prompt: ${prompt}`);

  return prompt;
};

const generate = async (prompt: string) => {
  const response = await openai.createCompletion({
    model: config.openAi.model,
    prompt,
    temperature: 0.2,
    max_tokens: 2048 - prompt.length,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  console.log(`Generated: ${response.data.choices[0].text}`);

  return response.data.choices[0].text;
};

export { generate, createGenerateReadmePrompt };
