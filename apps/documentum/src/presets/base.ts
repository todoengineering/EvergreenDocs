import { PushEvent } from "@octokit/webhooks-types";

import { PresetConfig } from "../schema/evergreen-config.js";
import GithubRepositoryService from "../services/github-repository-service.js";
import type { DocumentumFile } from "../types/index.js";

abstract class BasePreset<T = PresetConfig> {
  protected presetConfig: T;
  protected pushEvent: PushEvent;
  protected _branchName?: string;
  protected files?: DocumentumFile[];
  protected githubRepositoryService: GithubRepositoryService;

  constructor(
    presetConfig: T,
    pushEvent: PushEvent,
    githubRepositoryService: GithubRepositoryService
  ) {
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
  abstract fetchFiles(): Promise<DocumentumFile[]>;
  abstract createPrompt(): string;
}

export { BasePreset };
