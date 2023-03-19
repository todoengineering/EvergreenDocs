import { workflowLoggingService } from "@evergreendocs/services";
import { PushEvent } from "@octokit/webhooks-types";

import presetFactory from "./presets/preset-factory.js";
import { PresetConfig } from "./schema/evergreen-config.js";
import GithubRepo from "./services/github-repo.js";
import * as openai from "./services/open-ai-service.js";

class Task {
  constructor(
    private presetConfig: PresetConfig,
    private presetIndex: number,
    private event: PushEvent,
    private githubRepo: GithubRepo
  ) {}

  async run() {
    const preset = presetFactory(this.presetConfig, this.event, this.githubRepo);

    const repoOwner = this.event.repository?.owner?.login;
    const repoName = this.event.repository?.name;
    const installationId = this.event.installation?.id;
    const headCommit = this.event.head_commit?.id;
    const repositoryFullName = this.event.repository?.full_name;
    const commitBranch = this.event.ref.replace("refs/heads/", "");

    if (!repoOwner || !repoName || !installationId || !headCommit) {
      throw new Error("Missing required data");
    }

    await workflowLoggingService.entities.task
      .create({
        headCommit,
        preset: this.presetConfig.preset,
        index: this.presetIndex,
        status: "in_progress",
        repositoryFullName,
      })
      .go();

    const hasUpdates = await preset.hasUpdates();

    if (!hasUpdates) {
      console.log("No updates for preset", {
        preset: this.presetConfig.preset,
        repository: this.event.repository?.full_name,
        ref: this.event.ref,
        commits: this.event.commits.map((commit) => commit.id),
        commitBranch,
      });

      await workflowLoggingService.entities.task
        .patch({ headCommit, preset: this.presetConfig.preset, index: this.presetIndex })
        .set({ status: "skipped", reason: "No updates" })
        .go();

      return;
    }

    console.log("Found updates for preset", {
      preset: this.presetConfig.preset,
      repository: this.event.repository?.full_name,
      ref: this.event.ref,
      commits: this.event.commits.map((commit) => commit.id),
    });

    await preset.fetchFiles();
    const prompt = preset.createPrompt();

    const output = await openai.createCompletion(prompt);

    // TODO: Make this smarter/configurable
    await this.githubRepo.createBranch({ branchName: preset.branchName });
    const commit = await this.githubRepo.commitFile({
      branchName: preset.branchName,
      path: "path" in this.presetConfig ? this.presetConfig.path : this.presetConfig.outputPath,
      content: output,
      message: preset.branchName,
    });

    // TODO: Make this smarter/configurable
    const pullRequest = await this.githubRepo.createPullRequest({
      branchName: preset.branchName,
      title: preset.branchName,
    });

    await workflowLoggingService.entities.task
      .patch({ headCommit, preset: this.presetConfig.preset, index: this.presetIndex })
      .set({
        status: "success",
        outputPullRequestUrl: pullRequest.html_url,
        outputCommit: commit.commit.sha || "Unknown commit sha",
        outputCommitMessage: commit.commit.message || "Unknown commit message",
      })
      .go();

    console.log("Updated preset", {
      preset: this.presetConfig.preset,
      repository: this.event.repository?.full_name,
      ref: this.event.ref,
      commits: this.event.commits.map((commit) => commit.id),
    });
  }
}

export default Task;
