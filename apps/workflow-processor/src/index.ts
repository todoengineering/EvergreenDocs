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
      headCommitMessage: body.head_commit?.message || "Unknown commit message",
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

  if (!config) {
    await workflowLoggingService.entities.workflow
      .patch({ headCommit })
      .set({ status: "skipped", reason: "No config" })
      .go();

    return true;
  }

  let parsedConfig;

  try {
    parsedConfig = EvergreenConfig.parse(JSON.parse(config.content));
  } catch (error) {
    await workflowLoggingService.entities.workflow
      .patch({ headCommit })
      .set({ status: "failed", reason: "Invalid config" })
      .go();

    return true;
  }

  await Promise.all(
    parsedConfig.generates.map(async (generate, presetIndex) => {
      try {
        const preset = presetFactory(generate, body, githubRepositoryService);

        await workflowLoggingService.entities.task
          .create({
            headCommit,
            preset: generate.preset,
            index: presetIndex,
            status: "in_progress",
            repositoryFullName,
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
            .patch({ headCommit, preset: generate.preset, index: presetIndex })
            .set({ status: "skipped", reason: "No updates" })
            .go();

          return;
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
        const commit = await githubRepositoryService.commitFile({
          branchName: preset.branchName,
          path: "path" in generate ? generate.path : generate.outputPath,
          content: output,
          message: preset.branchName,
        });
        // TODO: Make this smarter/configurable
        const pullRequest = await githubRepositoryService.createPullRequest({
          branchName: preset.branchName,
          title: preset.branchName,
        });

        await workflowLoggingService.entities.task
          .patch({ headCommit, preset: generate.preset, index: presetIndex })
          .set({
            status: "success",
            outputPullRequestUrl: pullRequest.html_url,
            outputCommit: commit.commit.sha || "Unknown commit sha",
            outputCommitMessage: commit.commit.message || "Unknown commit message",
          })
          .go();

        console.log("Updated preset", {
          preset: generate.preset,
          repository: body.repository?.full_name,
          ref: body.ref,
          commits: body.commits.map((commit) => commit.id),
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Internal error";

        console.error("Failed to update preset", {
          error: errorMessage,
          preset: generate.preset,
          repository: body.repository?.full_name,
          ref: body.ref,
          commits: body.commits.map((commit) => commit.id),
        });

        await workflowLoggingService.entities.task
          .patch({ headCommit, preset: generate.preset, index: presetIndex })
          // TODO: make this not give away internal errors to the user
          .set({ status: "failed", reason: errorMessage })
          .go();
      }
    })
  );

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
