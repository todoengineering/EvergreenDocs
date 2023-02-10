import { EventBridgeHandler, APIGatewayProxyResultV2 } from "aws-lambda";
import { PushEvent } from "@octokit/webhooks-types";

import { createGenerateReadmePrompt, generate } from "./open-ai.js";
import GithubRepositoryService from "./github-service.js";

const handler: EventBridgeHandler<"push", PushEvent, APIGatewayProxyResultV2> = async (event) => {
  const body = event?.detail;

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

  const githubRepositoryService = new GithubRepositoryService({
    repoOwner,
    repoName,
    installationId,
  });

  const files = await githubRepositoryService.fetchFiles(["package.json"]);

  const prompt = createGenerateReadmePrompt("next-saas-starter", files[0]);

  const generatedReadme = await generate(prompt);

  if (!generatedReadme) {
    return {
      statusCode: 500,
      body: "Failed to generate readme",
    };
  }

  const branchName = "this-is-generated-from-my-lambda";
  await githubRepositoryService.createBranch(branchName);
  await githubRepositoryService.commitFile(branchName, "README.md", generatedReadme);
  await githubRepositoryService.createPullRequest(branchName);

  console.info("Processed request", event);

  return {
    statusCode: 200,
    headers: {},
    body: generatedReadme,
    isBase64Encoded: false,
    cookies: [],
  };
};

export { handler };
