import { PushEvent } from "@octokit/webhooks-types";

import type { PresetConfig } from "../schema/evergreen-config.js";
import GithubRepo from "../services/github-repo.js";
import ConfigError from "../config-error.js";

import CodeCommentPreset from "./code-comment.js";
import { BasePreset } from "./base.js";
import ReadmePreset from "./readme.js";
import TranslatePreset from "./translate.js";

const unknownPresetError = (input: never) =>
  new ConfigError(`Unknown preset: ${JSON.stringify(input, null, 2)}`);

function presetFactory(
  presetConfig: PresetConfig,
  githubEvent: PushEvent,
  githubRepositoryService: GithubRepo
): BasePreset {
  switch (presetConfig.preset) {
    case "readme":
      return new ReadmePreset(presetConfig, githubEvent, githubRepositoryService);

    case "translate":
      return new TranslatePreset(presetConfig, githubEvent, githubRepositoryService);

    case "code-comment":
      return new CodeCommentPreset(presetConfig, githubEvent, githubRepositoryService);

    default:
      throw unknownPresetError(presetConfig);
  }
}

export default presetFactory;
