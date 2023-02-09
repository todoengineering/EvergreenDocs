import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { PushEvent } from "@octokit/webhooks-types";

import {
  commitFilesToRepo,
  createBranch,
  createPullRequest,
  retrieveFilesFromRepo,
} from "./github.js";
import { createGenerateReadmePrompt, generate } from "./open-ai.js";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const body = JSON.parse(event?.body || "{}") as PushEvent;

  if (!body?.commits?.length || body?.ref !== "refs/heads/main") {
    return {
      statusCode: 200,
    };
  }

  console.info("Received request", event, body);

  const repoOwner = body.repository?.owner?.login;
  const repoName = body.repository?.name;
  const installationId = body.installation?.id;

  if (!repoOwner || !repoName || !installationId) {
    return {
      statusCode: 400,
      headers: {},
      body: "Missing required parameters",
      isBase64Encoded: false,
      cookies: [],
    };
  }

  const files = await retrieveFilesFromRepo({ repoOwner, repoName, installationId }, [
    "package.json",
  ]);

  const prompt = createGenerateReadmePrompt("next-saas-starter", files[0]);

  const generatedReadme = await generate(prompt);

  await createBranch({ repoOwner, repoName, installationId }, "this-is-generated-from-my-lambda");

  await commitFilesToRepo(
    { repoOwner, repoName, installationId },
    "this-is-generated-from-my-lambda",
    generatedReadme!
  );

  await createPullRequest(
    { repoOwner, repoName, installationId },
    "this-is-generated-from-my-lambda"
  );

  console.info("Processed request", event);

  return {
    statusCode: 200,
    headers: {},
    body: generatedReadme,
    isBase64Encoded: false,
    cookies: [],
  };
};

export default handler;
