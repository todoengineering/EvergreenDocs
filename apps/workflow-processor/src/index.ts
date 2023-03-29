import { EventBridgeHandler } from "aws-lambda";
import { PushEvent } from "@octokit/webhooks-types";
import db from "@evergreendocs/rds";

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

  await db
    .insertInto("Workflows")
    .values({
      head_commit: headCommit,
      head_commit_message: body.head_commit?.message || "Unknown commit message",
      repository_full_name: repositoryFullName,
      status: "IN_PROGRESS",
    })
    .execute();

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
    await db
      .updateTable("Workflows")
      .set({ status: "SKIPPED", reason: "No config" })
      .where("Workflows.head_commit", "=", headCommit)
      .execute();

    return true;
  }

  let parsedConfig;

  try {
    parsedConfig = EvergreenConfig.parse(JSON.parse(config.content));
  } catch (error) {
    await db
      .updateTable("Workflows")
      .set({ status: "FAILED", reason: "Invalid config" })
      .where("Workflows.head_commit", "=", headCommit)
      .execute();

    return true;
  }

  const taskLogs = await Promise.all(
    parsedConfig.generates.map(async (generate) => {
      const preset = presetFactory(generate, body, githubRepositoryService);

      const [task] = await db
        .insertInto("Tasks")
        .values({
          head_commit: headCommit,
          preset: generate.preset,
          status: "IN_PROGRESS",
        })
        .returning("id")
        .execute();

      try {
        const hasUpdates = await preset.hasUpdates();

        if (!hasUpdates) {
          console.log("No updates for preset", {
            preset: generate.preset,
            repository: body.repository?.full_name,
            ref: body.ref,
            commits: body.commits.map((commit) => commit.id),
            commitBranch,
          });

          await db
            .updateTable("Tasks")
            .set({ status: "SKIPPED", reason: "No updates" })
            .where("Tasks.id", "=", task.id)
            .execute();

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

        await db
          .updateTable("Tasks")
          .set({
            status: "SUCCEEDED",
            output_pull_request_url: pullRequest.html_url,
            output_commit: commit.commit.sha || "Unknown commit sha",
            output_commit_message: commit.commit.message || "Unknown commit message",
          })
          .where("Tasks.id", "=", task.id)
          .execute();

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

        const [taskLog] = await db
          .updateTable("Tasks")
          .set({ status: "FAILED", reason: errorMessage })
          .where("Tasks.id", "=", task.id)
          .returningAll()
          .execute();

        return taskLog;
      }
    })
  );

  const skippedTasks = taskLogs.filter((taskLog) => !taskLog || taskLog?.status === "SKIPPED");
  const status = skippedTasks.length === taskLogs.length ? "SKIPPED" : "SUCCEEDED";

  await db.updateTable("Workflows").set({ status }).where("head_commit", "=", headCommit).execute();

  console.log("Processed event", {
    repository: body.repository?.full_name,
    ref: body.ref,
    commits: body.commits.map((commit) => commit.id),
  });

  return true;
};

export { handler };
