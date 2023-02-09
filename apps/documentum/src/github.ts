import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/core";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({
  region: "us-east-1",
});

const response = await client.send(
  new GetSecretValueCommand({
    SecretId: "development/evergreendocs/githubapp",
  })
);

type GithubAppAuthSecret = {
  appId?: number;
  privateKey?: string;
  clientId?: string;
  clientSecret?: string;
};

const githubAppAuth = JSON.parse(response.SecretString || "{}") as GithubAppAuthSecret;

const baseAuth = {
  type: "app",
  appId: githubAppAuth.appId,
  privateKey: githubAppAuth.privateKey,
  clientId: githubAppAuth.clientId,
  clientSecret: githubAppAuth.clientSecret,
};

const retrieveFilesFromRepo = async (
  {
    repoOwner,
    repoName,
    installationId,
  }: { repoOwner: string; repoName: string; installationId: number },
  files: string[]
) => {
  console.log("Retrieving files from repo", { repoOwner, repoName, files });

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: { ...baseAuth, installationId },
  });

  const getBranchResponse = await octokit.request("GET /repos/{owner}/{repo}/branches/{branch}", {
    owner: repoOwner,
    repo: repoName,
    branch: "main",
    installationId: installationId,
  });

  const treeSha = getBranchResponse.data.commit.commit.tree.sha;

  const getBranchTreeResponse = await octokit.request(
    "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
    {
      owner: repoOwner,
      repo: repoName,
      tree_sha: treeSha,
      recursive: "true",
    }
  );

  const filesInRepo = getBranchTreeResponse.data.tree.filter((file) =>
    files.some((fileName) => file.path?.includes(fileName))
  );

  const fileContents = await Promise.all(
    filesInRepo.map(async (file) => {
      const getFileResponse = await octokit.request(
        "GET /repos/{owner}/{repo}/git/blobs/{file_sha}",
        {
          owner: repoOwner,
          repo: repoName,
          file_sha: file.sha!,
        }
      );

      return Buffer.from(getFileResponse.data.content, "base64").toString("utf-8");
    })
  );

  console.log(`Retrieved ${fileContents.length} files from repo`);

  return fileContents;
};

const createBranch = async (
  {
    repoOwner,
    repoName,
    installationId,
  }: { repoOwner: string; repoName: string; installationId: number },
  branchName: string
) => {
  console.log("Creating branch", { repoOwner, repoName, branchName });

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: { ...baseAuth, installationId },
  });

  const getBranchResponse = await octokit.request("GET /repos/{owner}/{repo}/branches/{branch}", {
    owner: repoOwner,
    repo: repoName,
    branch: "main",
  });

  const createBranchResponse = await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
    owner: repoOwner,
    repo: repoName,
    ref: `refs/heads/${branchName}`,
    sha: getBranchResponse.data["commit"]["sha"],
  });

  console.log("Created branch", createBranchResponse.data);

  return createBranchResponse.data;
};

const commitFilesToRepo = async (
  {
    repoOwner,
    repoName,
    installationId,
  }: { repoOwner: string; repoName: string; installationId: number },
  branchName: string,
  contents: string
) => {
  console.log("Committing files to repo", { repoOwner, repoName, branchName, contents });

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: { ...baseAuth, installationId },
  });

  const data = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: repoOwner,
    repo: repoName,
    path: "README.md",
    ref: branchName,
  });

  const sha = "sha" in data.data ? data.data.sha : "";

  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: repoOwner,
    repo: repoName,
    path: "README.md",
    branch: branchName,
    message: "This is created from the lambda!!!!!",
    content: Buffer.from(contents).toString("base64"),
    sha,
  });
};

const createPullRequest = async (
  {
    repoOwner,
    repoName,
    installationId,
  }: { repoOwner: string; repoName: string; installationId: number },
  branchName: string
) => {
  console.log("Creating pull request", { repoOwner, repoName, branchName });

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: { ...baseAuth, installationId },
  });

  const createPullRequestResponse = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
    owner: repoOwner,
    repo: repoName,
    title: "This is a pull request from the lambda",
    head: branchName,
    base: "main",
  });

  console.log("Created pull request", createPullRequestResponse.data);

  return createPullRequestResponse.data;
};

export { retrieveFilesFromRepo, createBranch, commitFilesToRepo, createPullRequest };
