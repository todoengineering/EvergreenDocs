import minimatch from "minimatch";

import { ReadmePresetConfig } from "../schema/presets/index.js";
import { JSONSchemaForNPMPackageJsonFiles } from "../types/index.js";

import { BasePreset } from "./base.js";

const packageJsonGlob = "**/package.json";

class ReadmePreset extends BasePreset<ReadmePresetConfig> {
  async hasUpdates(): Promise<boolean> {
    return true;
  }

  async fetchFiles() {
    this.files = await this.githubRepositoryService.fetchFiles(
      [packageJsonGlob],
      this.pushEvent.ref.replace("refs/heads/", "")
    );

    return this.files;
  }

  cleanDependencyList(dependencies: string[]): string[] {
    const groupedDependenciesWithSubPackages: Record<string, string[]> = {};

    for (const dependency of dependencies) {
      const [group, name] = dependency.split("/");
      if (!groupedDependenciesWithSubPackages[group]) {
        groupedDependenciesWithSubPackages[group] = [];
      }

      if (name) {
        groupedDependenciesWithSubPackages[group].push(name);
      }
    }

    const groupedDependencies = Object.entries(groupedDependenciesWithSubPackages).map(
      ([group, names]) => {
        if (names.length === 1) {
          return `${group}/${names[0]}`;
        } else {
          return group;
        }
      }
    );

    return groupedDependencies;
  }

  extractWorkspacesPackageJsons(
    _workspaces: JSONSchemaForNPMPackageJsonFiles["workspaces"]
  ): JSONSchemaForNPMPackageJsonFiles[] {
    if (!this.files) {
      return [];
    }

    const workspaces = Array.isArray(_workspaces) ? _workspaces : _workspaces?.packages || [];

    // We assume that any workspace that ends with "/*"" can be converted to a glob by adding a trailing *
    const workspacesGlobs = workspaces.map((workspace) =>
      workspace.endsWith("/*") ? `${workspace}*` : workspace
    );
    const workspacePackageJsonFiles: JSONSchemaForNPMPackageJsonFiles[] = [];

    for (const file of this.files) {
      if (!file.path || !minimatch(file.path, packageJsonGlob)) {
        continue;
      }

      const matchingGlob = workspacesGlobs.find((glob) => file.path && minimatch(file.path, glob));

      if (matchingGlob) {
        workspacePackageJsonFiles.push(JSON.parse(file.content));
      }
    }
    return workspacePackageJsonFiles;
  }

  buildRootPrompt(packageJson: JSONSchemaForNPMPackageJsonFiles): string {
    const { name, description, keywords, engines, license, packageManager } = packageJson;

    let prompt = `Please help me populate the following Github project introduction into a complete Github README. I want the following constraints to be applied when writing the README:
 - The README should be written in markdown format
 - The README should list as few dependencies as possible
 - The README should use emojis as appropriate`;

    if (this.presetConfig.sections?.length) {
      prompt += `\n - The README should contain the following sections: ${this.presetConfig.sections
        .map((section) => section.name)
        .join(", ")}`;
    }

    prompt += "\n\nHere is an overview of the project:";

    if (name) {
      prompt += `\n - Name: ${name}`;
    }

    if (description) {
      prompt += `\n - Description: ${description}`;
    }

    if (keywords) {
      prompt += `\n - Keywords: ${keywords.join(", ")}`;
    }

    if (license) {
      prompt += `\n - License: ${license}`;
    }

    if (engines) {
      prompt += `\n - Node version: ${engines.node}`;
    }

    if (packageManager) {
      prompt += `\n - Package manager: ${packageManager}`;
    }

    return prompt;
  }

  buildWorkspacePrompt(packageJson: JSONSchemaForNPMPackageJsonFiles): string {
    const {
      name,
      description,
      keywords,
      scripts,
      license,
      devDependencies,
      peerDependencies,
      dependencies,
    } = packageJson;

    if (!name) {
      console.warn("Workspace without name found");
      return "";
    }

    const dependenciesList = this.cleanDependencyList(
      Object.keys({
        ...dependencies,
        ...devDependencies,
        ...peerDependencies,
      })
    );

    let prompt = ` - ${name}`;

    if (description?.length) {
      prompt += `\n   - Description: ${description}`;
    }

    if (keywords?.length) {
      prompt += `\n   - Keywords: ${keywords.join(", ")}`;
    }

    if (license?.length) {
      prompt += `\n   - License: ${license}`;
    }

    if (dependenciesList.length) {
      prompt += `\n   - Dependencies: ${dependenciesList.join(", ")}`;
    }

    if (Object.keys(scripts || {}).length) {
      prompt += `\n   - Scripts: ${Object.entries(scripts || {})
        .map(([key, value]) => `      - ${key}: "${value}"`)
        .join("\n")}`;
    }

    return prompt;
  }

  createPrompt(): string {
    if (!this.files) {
      throw new Error("Files not fetched");
    }

    // TODO: Get ChatGPT to generate branch name
    this._branchName = "evergreen-generated-readme";
    this._commitMessage = `Evergreen update README.md`;

    const rootPackageJsonFile = this.files.find((file) => file.path === "package.json");

    if (!rootPackageJsonFile?.content) {
      throw new Error("package.json not found");
    }
    const rootPackageJson: JSONSchemaForNPMPackageJsonFiles = JSON.parse(
      rootPackageJsonFile.content
    );

    const workspacePackageJsons = this.extractWorkspacesPackageJsons(rootPackageJson.workspaces);

    let prompt = this.buildRootPrompt(rootPackageJson);

    for (const workspacePackageJson of workspacePackageJsons) {
      prompt += `\n${this.buildWorkspacePrompt(workspacePackageJson)}`;
    }

    prompt += `\nREADME.md:\n`;

    return prompt.replace(/\r?\n/g, "\n");
  }
}

export default ReadmePreset;
