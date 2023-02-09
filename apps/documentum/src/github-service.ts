import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/core";

import config from "./config.js";

type GithubRepositoryServiceOptions = {
  installationId: number;
  repoOwner: string;
  repoName: string;
};

class GithubRepositoryService {
  readonly repoOwner: string;
  readonly repoName: string;
  octokit: Octokit;

  constructor({ installationId, repoOwner, repoName }: GithubRepositoryServiceOptions) {
    this.octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        type: "app",
        appId: config.github.appId,
        privateKey: config.github.privateKey,
        clientId: config.github.clientId,
        clientSecret: config.github.clientSecret,
        installationId,
      },
    });

    this.repoOwner = repoOwner;
    this.repoName = repoName;
  }

  async fetchFiles(files: string[], branch = "main") {
    const getBranchResponse = await this.octokit.request(
      "GET /repos/{owner}/{repo}/branches/{branch}",
      {
        owner: this.repoOwner,
        repo: this.repoName,
        branch,
      }
    );

    const getBranchTreeResponse = await this.octokit.request(
      "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
      {
        owner: this.repoOwner,
        repo: this.repoName,
        tree_sha: getBranchResponse.data.commit.commit.tree.sha,
        recursive: "true",
      }
    );

    const filesInRepo = getBranchTreeResponse.data.tree.filter((file) =>
      files.some((fileName) => file.path?.includes(fileName))
    );

    const fileContents: string[] = [];

    for (const file of filesInRepo) {
      if (!file.sha) {
        continue;
      }

      const getFileResponse = await this.octokit.request(
        "GET /repos/{owner}/{repo}/git/blobs/{file_sha}",
        {
          owner: this.repoOwner,
          repo: this.repoName,
          file_sha: file.sha,
        }
      );

      fileContents.push(Buffer.from(getFileResponse.data.content, "base64").toString("utf-8"));
    }

    console.log(`Retrieved ${fileContents.length} files from repo`);

    return fileContents;
  }

  async createBranch(branchName: string) {
    const getBranchResponse = await this.octokit.request(
      "GET /repos/{owner}/{repo}/branches/{branch}",
      {
        owner: this.repoOwner,
        repo: this.repoName,
        branch: "main",
      }
    );

    const createBranchResponse = await this.octokit.request("POST /repos/{owner}/{repo}/git/refs", {
      owner: this.repoOwner,
      repo: this.repoName,
      ref: `refs/heads/${branchName}`,
      sha: getBranchResponse.data["commit"]["sha"],
    });

    console.log("Created branch", createBranchResponse.data);

    return createBranchResponse.data;
  }

  async commitFile(branchName: string, path: string, content: string) {
    const getCurrentFileResponse = await this.octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: this.repoOwner,
        repo: this.repoName,
        path: path,
        ref: branchName,
      }
    );

    const sha = "sha" in getCurrentFileResponse.data ? getCurrentFileResponse.data.sha : "";

    const updateFileResponse = await this.octokit.request(
      "PUT /repos/{owner}/{repo}/contents/{path}",
      {
        owner: this.repoOwner,
        repo: this.repoName,
        path: path,
        branch: branchName,
        message: "This is created from the lambda!!!!!",
        content: Buffer.from(content).toString("base64"),
        sha,
      }
    );

    console.log("Committed files to repo", {
      repoOwner: this.repoOwner,
      repoName: this.repoName,
      branchName,
      content,
    });

    return updateFileResponse.data;
  }

  async createPullRequest(branchName: string) {
    const createPullRequestResponse = await this.octokit.request(
      "POST /repos/{owner}/{repo}/pulls",
      {
        owner: this.repoOwner,
        repo: this.repoName,
        title: "This is a pull request from the lambda",
        head: branchName,
        base: "main",
      }
    );

    console.log("Created pull request", createPullRequestResponse.data);

    return createPullRequestResponse.data;
  }
}

export default GithubRepositoryService;
