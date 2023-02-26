import { EventBridgeHandler } from "aws-lambda";
import { PushEvent } from "@octokit/webhooks-types";

import { createCompletion } from "./services/open-ai-service.js";
import presetFactory from "./presets/preset-factory.js";
import GithubRepositoryService from "./services/github-repository-service.js";
import EvergreenConfig from "./schema/evergreen-config.js";

const handler: EventBridgeHandler<"push", PushEvent, boolean> = async (event) => {
  const body = event?.detail;

  if (!body?.commits?.length || body?.ref !== "refs/heads/main") {
    return true;
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
    return false;
  }

  const githubRepositoryService = new GithubRepositoryService({
    repoOwner,
    repoName,
    installationId,
  });

  const [config] = await githubRepositoryService.fetchFiles(["evergreen.config.json"]);

  const parsedConfig = EvergreenConfig.parse(JSON.parse(config.content));

  for (const generate of parsedConfig.generates) {
    const preset = presetFactory(generate, githubRepositoryService);

    const hasUpdates = await preset.hasUpdates();

    if (!hasUpdates) {
      continue;
    }

    console.log("Found updates for preset", {
      preset: generate.preset,
      repository: body.repository?.full_name,
      ref: body.ref,
      commits: body.commits.map((commit) => commit.id),
    });

    await preset.fetchFiles();
    const prompt = preset.createPrompt();

    const output = await createCompletion(prompt);

    // TODO: Make this smarter/configurable
    await githubRepositoryService.createBranch({ branchName: preset.branchName });
    await githubRepositoryService.commitFile({
      branchName: preset.branchName,
      path: "path" in generate ? generate.path : generate.outputPath,
      content: output,
      message: "Update readme",
    });
    // TODO: Make this smarter/configurable
    await githubRepositoryService.createPullRequest({
      branchName: preset.branchName,
      title: preset.branchName,
    });

    console.log("Updated preset", {
      preset: generate.preset,
      repository: body.repository?.full_name,
      ref: body.ref,
      commits: body.commits.map((commit) => commit.id),
    });
  }

  console.log("Processed event", {
    repository: body.repository?.full_name,
    ref: body.ref,
    commits: body.commits.map((commit) => commit.id),
  });

  return true;
};

export { handler };
