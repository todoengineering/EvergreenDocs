import GithubRepositoryService from "../services/github-repository-service.js";
import type { EvergreenConfig } from "../schema/evergreen-config.js";

import { BasePreset } from "./base-preset.js";
import ReadmePreset from "./readme-preset.js";

function presetFactory(
  generates: EvergreenConfig["generates"][number],
  githubRepositoryService: GithubRepositoryService
): BasePreset {
  switch (generates.preset) {
    case "readme":
      return new ReadmePreset(generates, githubRepositoryService);

    default:
      throw new Error(`Unknown preset: ${generates.preset}`);
  }
}

export default presetFactory;
