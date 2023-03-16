import { PushEvent } from "@octokit/webhooks-types";

import { PresetConfig } from "../schema/evergreen-config.js";
import GithubRepo from "../services/github-repo.js";
import type { WorkflowProcessorFile } from "../types/index.js";

abstract class BasePreset<T = PresetConfig> {
  protected presetConfig: T;
  protected pushEvent: PushEvent;
  protected _branchName?: string;
  protected files?: WorkflowProcessorFile[];
  protected githubRepositoryService: GithubRepo;

  constructor(presetConfig: T, pushEvent: PushEvent, githubRepositoryService: GithubRepo) {
    this.presetConfig = presetConfig;
    this.pushEvent = pushEvent;
    this.githubRepositoryService = githubRepositoryService;
  }

  public get branchName() {
    if (!this._branchName) {
      throw new Error("Branch name not set");
    }

    return this._branchName;
  }

  abstract hasUpdates(): Promise<boolean>;
  abstract fetchFiles(): Promise<WorkflowProcessorFile[]>;
  abstract createPrompt(): string;
}

export { BasePreset };
