import { minimatch } from "minimatch";

import { DocumentumFile, JSONSchemaForNPMPackageJsonFiles } from "./types/index.js";

// TODO: Validate package.json
function parsePackageJsonString(
  packageJsonString: string | undefined
): JSONSchemaForNPMPackageJsonFiles {
  if (!packageJsonString) {
    throw new Error("package.json not found");
  }

  return JSON.parse(packageJsonString);
}

/**
 * This function groups the repository files by their corresponding workspaces.
 * The grouping is done based on the glob patterns specified in the "workspaces" field of the NPM package.json file.
 * If a file path matches the glob pattern of a workspace, it is added to that workspace's list of files.
 *
 * @param repositoryFiles - The array of DocumentumFiles to be grouped by workspaces.
 * @param workspaces - The "workspaces" field of the NPM package.json file, which defines the glob patterns for each workspace.
 * @returns A record where the keys are the names of the workspaces and the values are arrays of DocumentumFiles belonging to that workspace.
 */
function groupRepositoryFilesByWorkspace(
  repositoryFiles: DocumentumFile[],
  workspaces: NonNullable<JSONSchemaForNPMPackageJsonFiles["workspaces"]>
): Record<string, DocumentumFile[]> {
  const workspaceFiles: Record<string, DocumentumFile[]> = {};

  const workspaceGlobPatternsArray = Array.isArray(workspaces)
    ? workspaces
    : workspaces.packages || [];

  for (const workspaceGlobPattern of workspaceGlobPatternsArray.concat("*")) {
    const directoryDepth = workspaceGlobPattern.split("/").length;

    for (const file of repositoryFiles) {
      const pathParts =
        workspaceGlobPattern !== "*"
          ? file.path?.split("/")?.slice(0, directoryDepth)?.join("/")
          : file.path;

      if (pathParts && minimatch(pathParts, workspaceGlobPattern)) {
        const workspaceName = workspaceGlobPattern === "*" ? "root" : pathParts;

        if (!workspaceFiles[workspaceName]) {
          workspaceFiles[workspaceName] = [];
        }

        workspaceFiles[workspaceName].push(file);
      }
    }
  }

  return workspaceFiles;
}

const generatePromptFromRootWorkspace = (rootWorkspace: DocumentumFile[]) => {
  const packageJson = parsePackageJsonString(
    rootWorkspace.find((file) => file.path?.endsWith("package.json"))?.content
  );

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
};

function generatePromptFromWorkspace(workspace: DocumentumFile[]) {
  const packageJson = parsePackageJsonString(
    workspace.find((file) => file.path?.endsWith("package.json"))?.content
  );

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

function writeReadmePrompt(workspaceFeatures: Record<string, DocumentumFile[]>) {
  const { root: rootWorkspace, ...workspaces } = workspaceFeatures;

  let prompt = generatePromptFromRootWorkspace(rootWorkspace);

  for (const workspace of Object.values(workspaces)) {
    prompt += generatePromptFromWorkspace(workspace);
  }

  return (prompt += `

Could you please generate me a README.md file?

You: `);
}

function createReadmePrompt(repositoryFiles: DocumentumFile[]) {
  const rootPackageJson = parsePackageJsonString(
    repositoryFiles.find((file) => file.path === "package.json")?.content
  );

  const { workspaces = [] } = rootPackageJson;

  const workspaceFiles = groupRepositoryFilesByWorkspace(repositoryFiles, workspaces);

  const readmePrompt = writeReadmePrompt(workspaceFiles);

  console.log(readmePrompt);

  return readmePrompt;
}

export { createReadmePrompt };
