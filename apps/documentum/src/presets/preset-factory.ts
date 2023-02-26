import { PushEvent } from "@octokit/webhooks-types";

import GithubRepositoryService from "../services/github-repository-service.js";
import type { EvergreenConfig } from "../schema/evergreen-config.js";

import { BasePreset } from "./base.js";
import ReadmePreset from "./readme.js";
import TranslatePreset from "./translate.js";
import CodeCommentPreset from "./code-comment.js";

const unknownPresetError = (input: never) =>
  new Error(`Unknown preset: ${JSON.stringify(input, null, 2)}`);

function presetFactory(
  generates: EvergreenConfig["generates"][number],
  githubEvent: PushEvent,
  githubRepositoryService: GithubRepositoryService
): BasePreset {
  switch (generates.preset) {
    case "readme":
      return new ReadmePreset(generates, githubEvent, githubRepositoryService);

    case "translate":
      return new TranslatePreset(generates, githubEvent, githubRepositoryService);

    case "code-comment":
      return new CodeCommentPreset(generates, githubEvent, githubRepositoryService);

    default:
      throw unknownPresetError(generates);
  }
}

export default presetFactory;
