import { CodeCommentPresetConfig } from "../schema/presets/index.js";

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
    this.files = await this.githubRepositoryService.fetchFiles([this.presetConfig.path]);

    return this.files;
  }

  extractFunction() {
    const file = this.files?.[0];

    if (!file) {
      throw new Error(`No files found for ${this.presetConfig.path}`);
    }

    const { content } = file;

    const functionRegex = functionRegexExtractor(this.presetConfig.name);

    const matches = content.matchAll(functionRegex.named);

    for (const match of matches) {
      if (match.groups?.function) {
        return match.groups.function;
      }
    }

    throw new Error(`No function found for ${this.presetConfig.path}`);
  }

  createPrompt(): string {
    if (!this.files?.[0]) {
      throw new Error(`No files found for ${this.presetConfig.path}`);
    }

    return this.files[0].content;
  }
}

export default CodeCommentPreset;
