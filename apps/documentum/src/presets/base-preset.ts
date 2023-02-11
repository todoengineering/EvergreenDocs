import { PresetConfig } from "../schema/evergreen-config.js";
import GithubRepositoryService from "../services/github-repository-service.js";
import type { DocumentumFile } from "../types/index.js";

abstract class BasePreset<T = PresetConfig> {
  protected presetConfig: T;
  protected _branchName?: string;
  protected files?: DocumentumFile[];
  protected githubRepositoryService: GithubRepositoryService;

  constructor(presetConfig: T, githubRepositoryService: GithubRepositoryService) {
    this.presetConfig = presetConfig;
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
