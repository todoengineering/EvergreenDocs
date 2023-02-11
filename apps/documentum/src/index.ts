import { EventBridgeHandler, APIGatewayProxyResultV2 } from "aws-lambda";
import { PushEvent } from "@octokit/webhooks-types";

import { createReadmePrompt } from "./prompt.js";
import { generate } from "./open-ai.js";
import GithubRepositoryService from "./github-service.js";

const keyFiles = ["package.json"];

const handler: EventBridgeHandler<"push", PushEvent, APIGatewayProxyResultV2> = async (event) => {
  const body = event?.detail;

  if (!body?.commits?.length || body?.ref !== "refs/heads/main") {
    return {
      statusCode: 200,
    };
  }

  console.log("Received event", {
    repository: body.repository?.full_name,
    ref: body.ref,
    commits: body.commits.map((commit) => commit.id),
  });

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

  const files = await githubRepositoryService.fetchFiles(keyFiles);

  const prompt = createReadmePrompt(files);

  const generatedReadme = await generate(prompt);

  const branchName = "this-is-generated-from-my-lambda";
  await githubRepositoryService.createBranch(branchName);
  await githubRepositoryService.commitFile(branchName, "README.md", generatedReadme);
  await githubRepositoryService.createPullRequest(branchName);

  console.log("Processed event", {
    repository: body.repository?.full_name,
    ref: body.ref,
    commits: body.commits.map((commit) => commit.id),
  });

  return {
    statusCode: 200,
    headers: {},
    body: generatedReadme,
    isBase64Encoded: false,
    cookies: [],
  };
};

export { handler };
