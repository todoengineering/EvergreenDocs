import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/core";
import minimatch from "minimatch";
import { operations as Operations } from "@octokit/openapi-types";

import { WorkflowProcessorFile } from "../types/index.js";
import config from "../config.js";

type GithubRepoOptions = {
  installationId: number;
  repoOwner: string;
  repoName: string;
};

class GithubRepo extends Octokit {
  readonly repoOwner: string;
  readonly repoName: string;

  constructor({ installationId, repoOwner, repoName }: GithubRepoOptions) {
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

  async fetchFiles(fileGlobs: string[], branch = "main") {
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

    const fileWithContents: WorkflowProcessorFile[] = [];

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

  async fetchCommit(commitSha: string) {
    const getCommitResponse = await this.request("GET /repos/{owner}/{repo}/commits/{ref}", {
      owner: this.repoOwner,
      repo: this.repoName,
      ref: commitSha,
    });

    return getCommitResponse.data;
  }

  async createBranch(branchProps: { branchName: string }) {
    const getBranchResponse = await this.request("GET /repos/{owner}/{repo}/branches/{branch}", {
      owner: this.repoOwner,
      repo: this.repoName,
      branch: "main",
    });

    try {
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
    } catch (error) {
      if (error instanceof Error && error.message.includes("Reference already exists")) {
        console.log("Branch already exists", {
          repository: `${this.repoOwner}/${this.repoName}`,
          branchName: branchProps.branchName,
        });
      } else {
        throw error;
      }
    }
  }

  async commitFile(commitFileProps: {
    branchName: string;
    path: string;
    content: string;
    message: string;
  }) {
    const updateFileOptions: Operations["repos/create-or-update-file-contents"]["requestBody"]["content"]["application/json"] &
      Operations["repos/create-or-update-file-contents"]["parameters"]["path"] = {
      owner: this.repoOwner,
      repo: this.repoName,
      path: commitFileProps.path,
      branch: commitFileProps.branchName,
      message: commitFileProps.message,
      content: Buffer.from(commitFileProps.content).toString("base64"),
    };

    try {
      const getCurrentFileResponse = await this.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner: this.repoOwner,
          repo: this.repoName,
          path: commitFileProps.path,
          ref: commitFileProps.branchName,
        }
      );

      updateFileOptions.sha =
        "sha" in getCurrentFileResponse.data ? getCurrentFileResponse.data.sha : "";
    } catch (error) {
      if (error instanceof Error && error.message.includes("Not Found")) {
        console.log("File does not exist, creating new file", {
          repository: `${this.repoOwner}/${this.repoName}`,
          branchName: commitFileProps.branchName,
          path: commitFileProps.path,
        });
      } else {
        throw error;
      }
    }

    const updateFileResponse = await this.request(
      "PUT /repos/{owner}/{repo}/contents/{path}",
      updateFileOptions
    );

    console.log("Committed file to repo", {
      repository: `${this.repoOwner}/${this.repoName}`,
      branchName: commitFileProps.branchName,
      path: commitFileProps.path,
      commitSha: updateFileResponse.data.commit.sha,
    });

    return updateFileResponse.data;
  }

  async createPullRequest(pullRequestProps: { branchName: string; title: string }) {
    try {
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
    } catch (error) {
      if (error instanceof Error && error.message.includes("A pull request already exists")) {
        console.log("Pull request already exists", {
          repository: `${this.repoOwner}/${this.repoName}`,
          title: pullRequestProps.title,
          branchName: pullRequestProps.branchName,
        });

        const getPullRequestResponse = await this.request("GET /repos/{owner}/{repo}/pulls", {
          owner: this.repoOwner,
          repo: this.repoName,
          head: pullRequestProps.branchName,
        });

        if (getPullRequestResponse.data.length === 0) {
          throw new Error("Could not find pull request");
        }

        return getPullRequestResponse.data[0];
      } else {
        throw error;
      }
    }
  }
}

export default GithubRepo;
