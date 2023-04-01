// TODO: More logging in here

import "@evergreendocs/tsconfig/session";

import { AuthHandler, GithubAdapter } from "sst/node/future/auth";
import { Octokit } from "@octokit/core";
import { parameterStoreService, cacheService, CacheServiceTypes } from "@evergreendocs/services";

const githubAppAuth = await parameterStoreService.getSecretJson({
  stage: "production",
  parameter: "githubapp",
});

export const handler = AuthHandler({
  clients: async () => ({
    local: "http://localhost:3000",
  }),
  providers: {
    github: GithubAdapter({
      scope: "read:user user:email",
      clientID: githubAppAuth.clientId,
      clientSecret: githubAppAuth.clientSecret,
    }),
  },

  async onSuccess(input) {
    console.log(`User logged in with ${input.provider}`);

    if (input.provider === "github") {
      if (!input.tokenset.access_token) {
        throw new Error("Missing access token");
      }

      const octokit = new Octokit({
        auth: input.tokenset.access_token,
      });

      const githubUser = await octokit.request("GET /user");

      console.log(`Fetched user ${githubUser.data.id} from GitHub`);

      const user = {
        id: String(githubUser.data.id),
        provider: input.provider,
        profileImageUrl: githubUser.data.avatar_url as string,
        emailAddress: githubUser.data.email || null,
        firstName: githubUser.data.name?.split(" ")[0] || null,
        lastName: githubUser.data.name?.split(" ")[1] || null,
      };

      if (!input.tokenset.expires_at) {
        throw new Error("Missing expires_at");
      }

      // TODO: tokens should be encrypted
      const session: CacheServiceTypes.Session = {
        externalId: String(user.id),
        provider: user.provider,
        accessToken: input.tokenset.access_token,
        accessTokenExpiresAt: new Date(input.tokenset.expires_at * 1000).toISOString(),
      };

      if (input.tokenset.refresh_token) {
        session.refreshToken = input.tokenset.refresh_token;
      }

      if (typeof input.tokenset.refresh_token_expires_in === "number") {
        session.ttl = Math.floor(Date.now() / 1000) + input.tokenset.refresh_token_expires_in;
      }

      await cacheService.entities.session.upsert(session).go();

      console.log("Updated session in DynamoDB");

      return {
        type: "user",
        properties: { user },
      };
    }

    throw new Error("Unknown provider");
  },
  async onError() {
    console.error("Auth failed");

    return {
      statusCode: 400,
      headers: {
        "Content-Type": "text/plain",
      },
      body: "Auth failed",
    };
  },
});
