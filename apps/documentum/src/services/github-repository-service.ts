import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/core";
import minimatch from "minimatch";

import { DocumentumFile } from "../types/index.js";
import config from "../config.js";

type GithubRepositoryServiceOptions = {
  installationId: number;
  repoOwner: string;
  repoName: string;
};

class GithubRepositoryService extends Octokit {
  readonly repoOwner: string;
  readonly repoName: string;

  constructor({ installationId, repoOwner, repoName }: GithubRepositoryServiceOptions) {
    super({
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

  async fetchFiles(fileGlobs: string[], branch = "main"): Promise<DocumentumFile[]> {
    const getBranchResponse = await this.request("GET /repos/{owner}/{repo}/branches/{branch}", {
      owner: this.repoOwner,
      repo: this.repoName,
      branch,
    });

    const getBranchTreeResponse = await this.request(
      "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
      {
        owner: this.repoOwner,
        repo: this.repoName,
        tree_sha: getBranchResponse.data.commit.commit.tree.sha,
        recursive: "true",
      }
    );

    const filesInRepo = getBranchTreeResponse.data.tree.filter((file) =>
      fileGlobs.some((fileGlob) => file.path && minimatch(file.path, fileGlob))
    );

    const fileWithContents: DocumentumFile[] = [];

    for (const file of filesInRepo) {
      if (!file.sha) {
        continue;
      }

      const getFileResponse = await this.request("GET /repos/{owner}/{repo}/git/blobs/{file_sha}", {
        owner: this.repoOwner,
        repo: this.repoName,
        file_sha: file.sha,
      });

      const content = Buffer.from(getFileResponse.data.content, "base64").toString("utf-8");

      fileWithContents.push({
        ...file,
        content,
      });
    }

    console.log(`Retrieved ${fileWithContents.length} files from repo`);

    return fileWithContents;
  }

  async createBranch(branchProps: { branchName: string }) {
    const getBranchResponse = await this.request("GET /repos/{owner}/{repo}/branches/{branch}", {
      owner: this.repoOwner,
      repo: this.repoName,
      branch: "main",
    });

    const createBranchResponse = await this.request("POST /repos/{owner}/{repo}/git/refs", {
      owner: this.repoOwner,
      repo: this.repoName,
      ref: `refs/heads/${branchProps.branchName}`,
      sha: getBranchResponse.data["commit"]["sha"],
    });

    console.log("Created branch", {
      repository: `${this.repoOwner}/${this.repoName}`,
      branchName: branchProps.branchName,
    });

    return createBranchResponse.data;
  }

  async commitFile(commitFileProps: {
    branchName: string;
    path: string;
    content: string;
    message: string;
  }) {
    const getCurrentFileResponse = await this.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: this.repoOwner,
      repo: this.repoName,
      path: commitFileProps.path,
      ref: commitFileProps.branchName,
    });

    const sha = "sha" in getCurrentFileResponse.data ? getCurrentFileResponse.data.sha : "";

    const updateFileResponse = await this.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner: this.repoOwner,
      repo: this.repoName,
      path: commitFileProps.path,
      branch: commitFileProps.branchName,
      message: commitFileProps.message,
      content: Buffer.from(commitFileProps.content).toString("base64"),
      sha,
    });

    console.log("Committed file to repo", {
      repository: `${this.repoOwner}/${this.repoName}`,
      branchName: commitFileProps.branchName,
      path: commitFileProps.path,
      commitSha: updateFileResponse.data.commit.sha,
    });

    return updateFileResponse.data;
  }

  async createPullRequest(pullRequestProps: { branchName: string; title: string }) {
    const createPullRequestResponse = await this.request("POST /repos/{owner}/{repo}/pulls", {
      owner: this.repoOwner,
      repo: this.repoName,
      title: pullRequestProps.title,
      head: pullRequestProps.branchName,
      base: "main",
    });

    console.log("Created pull request", {
      repository: `${this.repoOwner}/${this.repoName}`,
      title: pullRequestProps.title,
      branchName: pullRequestProps.branchName,
    });

    return createPullRequestResponse.data;
  }
}

export default GithubRepositoryService;
