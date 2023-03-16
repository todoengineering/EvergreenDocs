import { TranslatePresetConfig } from "../schema/presets/index.js";
import ConfigError from "../config-error.js";

import { BasePreset } from "./base.js";

class TranslatePreset extends BasePreset<TranslatePresetConfig> {
  async hasUpdates(): Promise<boolean> {
    const response = await this.githubRepositoryService.fetchCommit(this.pushEvent.after);

    return (
      response.files?.some(
        (file) => file.filename.toLowerCase() === this.presetConfig.inputPath.toLowerCase()
      ) ?? false
    );
  }

  async fetchFiles() {
    this.files = await this.githubRepositoryService.fetchFiles([this.presetConfig.inputPath]);

    return this.files;
  }

  createPrompt(): string {
    if (!this.files?.length) {
      throw new ConfigError(
        `Files not fetched for .inputPath value [${this.presetConfig.inputPath}]`
      );
    }

    const fileName =
      this.presetConfig.inputPath.split("/")[this.presetConfig.inputPath.split("/").length - 1];
    this._branchName = `evergreen-translate-${fileName}-${this.presetConfig.language}`;

    if (this.presetConfig.type === "md") {
      const prompt = `${this.files[0].content}

Please translate the above text to the ISO 639-1 code ${this.presetConfig.language}:`;

      return prompt.replace(/\r?\n/g, "\n");
    }

    const prompt = `${this.files[0].content}

Please translate the values in the above JSON to the ISO 639-1 code ${this.presetConfig.language}:`;

    return prompt.replace(/\r?\n/g, "\n");
  }
}

export default TranslatePreset;
