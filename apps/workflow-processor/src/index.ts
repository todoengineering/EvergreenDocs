import { EventBridgeHandler } from "aws-lambda";
import { PushEvent } from "@octokit/webhooks-types";
import { workflowLoggingService } from "@evergreendocs/services";

import { createCompletion } from "./services/open-ai-service.js";
import presetFactory from "./presets/preset-factory.js";
import GithubRepositoryService from "./services/github-repository-service.js";
import EvergreenConfig from "./schema/evergreen-config.js";

const handler: EventBridgeHandler<"push", PushEvent, boolean> = async (event) => {
  const body = event?.detail;

  if (!body?.commits?.length) {
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
  const headCommit = body.head_commit?.id;
  const repositoryFullName = body.repository?.full_name;
  const commitBranch = body.ref.replace("refs/heads/", "");

  if (!repoOwner || !repoName || !installationId || !headCommit) {
    return false;
  }

  await workflowLoggingService.entities.workflow
    .create({
      headCommit,
      repositoryFullName,
      status: "in_progress",
    })
    .go();

  const githubRepositoryService = new GithubRepositoryService({
    repoOwner,
    repoName,
    installationId,
  });

  const [config] = await githubRepositoryService.fetchFiles(
    ["evergreen.config.json"],
    commitBranch
  );

  const parsedConfig = EvergreenConfig.parse(JSON.parse(config.content));

  for (const generate of parsedConfig.generates) {
    try {
      const preset = presetFactory(generate, body, githubRepositoryService);

      await workflowLoggingService.entities.task
        .create({
          headCommit,
          preset: generate.preset,
          status: "in_progress",
        })
        .go();

      const hasUpdates = await preset.hasUpdates();

      if (!hasUpdates) {
        console.log("No updates for preset", {
          preset: generate.preset,
          repository: body.repository?.full_name,
          ref: body.ref,
          commits: body.commits.map((commit) => commit.id),
          commitBranch,
        });

        await workflowLoggingService.entities.task
          .patch({ headCommit, preset: generate.preset })
          .set({ status: "skipped" })
          .go();

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

      await workflowLoggingService.entities.task
        .patch({ headCommit, preset: generate.preset })
        .set({ status: "success" })
        .go();

      console.log("Updated preset", {
        preset: generate.preset,
        repository: body.repository?.full_name,
        ref: body.ref,
        commits: body.commits.map((commit) => commit.id),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error(error);
      console.error("Failed to update preset", {
        error: errorMessage,
        preset: generate.preset,
        repository: body.repository?.full_name,
        ref: body.ref,
        commits: body.commits.map((commit) => commit.id),
      });

      await workflowLoggingService.entities.task
        .patch({ headCommit, preset: generate.preset })
        .set({ status: "failed" })
        .go();
    }
  }

  await workflowLoggingService.entities.workflow
    .patch({ headCommit })
    .set({ status: "success" })
    .go();

  console.log("Processed event", {
    repository: body.repository?.full_name,
    ref: body.ref,
    commits: body.commits.map((commit) => commit.id),
  });

  return true;
};

export { handler };
