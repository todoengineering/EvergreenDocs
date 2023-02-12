import minimatch from "minimatch";

import { ReadmePresetConfig } from "../schema/evergreen-config";
import { JSONSchemaForNPMPackageJsonFiles } from "../types/index.js";

import { BasePreset } from "./base-preset.js";

const packageJsonGlob = "**/package.json";

class ReadmePreset extends BasePreset<ReadmePresetConfig> {
  async hasUpdates(): Promise<boolean> {
    return true;
  }

  async fetchFiles() {
    this.files = await this.githubRepositoryService.fetchFiles([packageJsonGlob]);

    return this.files;
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
    const { name, description, keywords, engines, license } = packageJson;

    let prompt = `Developer: Hello, I'm glad I could work with a copywriter so experienced. I have a GitHub repository called ${name} and it is described as "${description}". Other details about the repository are:`;

    if (keywords) {
      prompt += `\n - Keywords: ${keywords.join(", ")}`;
    }

    if (license) {
      prompt += `\n - License: ${license}`;
    }

    if (engines?.node) {
      prompt += `\n - Node version: ${engines.node}`;
    }

    if (packageJson.packageManager) {
      prompt += `\n - Package manager: ${packageJson.packageManager}`;
    }

    if (packageJson.workspaces) {
      prompt += `\n - Workspaces:`;
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

    const dependenciesList = { ...dependencies, ...devDependencies, ...peerDependencies };

    let prompt = ` - ${name}`;

    if (description) {
      prompt += `\n - Description: ${description}`;
    }

    if (keywords) {
      prompt += `\n - Keywords: ${keywords.join(", ")}`;
    }

    if (license) {
      prompt += `\n - License: ${license}`;
    }

    if (dependenciesList) {
      prompt += `\n - Dependencies: ${Object.keys(dependenciesList).join(", ")}`;
    }

    if (scripts) {
      prompt += `\n - Scripts: ${Object.entries(scripts || {})
        .map(([key, value]) => `      - ${key}: ${value}`)
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

    const rootPackageJsonFile = this.files.find((file) => file.path === "package.json");

    if (!rootPackageJsonFile?.content) {
      throw new Error("package.json not found");
    }

    const rootPackageJson: JSONSchemaForNPMPackageJsonFiles = JSON.parse(
      rootPackageJsonFile.content
    );

    const workspacePackageJsons = this.extractWorkspacesPackageJsons(rootPackageJson);

    let prompt = this.buildRootPrompt(rootPackageJson);

    for (const workspacePackageJson of workspacePackageJsons) {
      prompt += `\n${this.buildWorkspacePrompt(workspacePackageJson)}`;
    }

    prompt += `\nCould you please generate me a README.md in your next message?
You:`;

    return prompt.replace(/\r?\n/g, "\n");
  }
}

export default ReadmePreset;
