import { CodeCommentPresetConfig } from "../schema/presets/index.js";
import ConfigError from "../config-error.js";

import { BasePreset } from "./base.js";

const functionRegexExtractor = (functionName: string) => ({
  named: new RegExp(`(?<function>function\s+${functionName}\s*\([^)]*\)\s*\{)`),
  anonymous: new RegExp(
    `(?<function>(let|const|var)\s+${functionName}\s*=\s*(async\s+)?function\s*\([^)]*\)\s*\{)`
  ),
  arrow: new RegExp(
    `(?<function>(let|const|var)\s+${functionName}\s*=\s*(async\s+)?\([^)]*\)\s*=>)`
  ),
});

class CodeCommentPreset extends BasePreset<CodeCommentPresetConfig> {
  async hasUpdates(): Promise<boolean> {
    return true;
  }

  async fetchFiles() {
    this.files = await this.githubRepositoryService.fetchFiles(
      [this.presetConfig.path],
      this.pushEvent.ref.replace("refs/heads/", "")
    );

    if (!this.files?.length) {
      throw new ConfigError(`No files found for .path value [${this.presetConfig.path}]`);
    }

    return this.files;
  }

  extractFunction() {
    const file = this.files?.[0];

    if (!file) {
      throw new ConfigError(`No files found for .path value [${this.presetConfig.path}]`);
    }

    const { content } = file;

    const functionRegex = functionRegexExtractor(this.presetConfig.name);

    const matches = content.matchAll(functionRegex.named);

    for (const match of matches) {
      if (match.groups?.function) {
        return match.groups.function;
      }
    }

    throw new ConfigError(`No function found for .path value [${this.presetConfig.name}]`);
  }

  createPrompt(): string {
    if (!this.files?.[0]) {
      throw new ConfigError(`No files found for .path value [${this.presetConfig.path}]`);
    }

    return this.files[0].content;
  }
}

export default CodeCommentPreset;
