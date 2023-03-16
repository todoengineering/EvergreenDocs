import "@evergreendocs/tsconfig/session";

import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SessionValue } from "sst/node/future/auth";
import { cacheService, CacheServiceTypes, secretsManagerService } from "@evergreendocs/services";
import { TRPCError } from "@trpc/server";

interface AuthorisedSession extends Extract<SessionValue, { type: "user" }> {
  getAccessToken: ReturnType<typeof getAccessToken>;
}

type UnauthorisedSession = Extract<SessionValue, { type: "public" }>;

type Context = {
  session: AuthorisedSession | UnauthorisedSession;
  request: APIGatewayProxyEventV2;
};

type RefreshTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
  token_type: string;
};

type GitHubAppAuth = {
  appId: string;
  clientId: string;
  clientSecret: string;
};

const githubAppAuth = await secretsManagerService.getSecretJson<GitHubAppAuth>(
  "development/evergreendocs/githubapp"
);

async function refreshAccessToken(refreshToken: string, session: AuthorisedSession) {
  const refreshTokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: githubAppAuth.clientId,
      client_secret: githubAppAuth.clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const refreshTokenData = (await refreshTokenResponse.json()) as RefreshTokenResponse;

  // TODO: tokens should be encrypted
  const newSession: CacheServiceTypes.Session = {
    externalId: String(session.properties.user.id),
    provider: session.properties.user.provider,
    accessToken: refreshTokenData.access_token,
    accessTokenExpiresAt: new Date(Date.now() + refreshTokenData.expires_in * 1000).toISOString(),
  };

  if (refreshTokenData.refresh_token) {
    newSession.refreshToken = refreshTokenData.refresh_token;
  }

  if (typeof refreshTokenData.refresh_token_expires_in === "number") {
    newSession.ttl = Math.floor(Date.now() / 1000) + refreshTokenData.refresh_token_expires_in;
  }

  await cacheService.entities.session.upsert(newSession).go();

  return newSession;
}

function getAccessToken(session: AuthorisedSession) {
  let accessToken: string | null = null;

  return async () => {
    if (accessToken) {
      return accessToken;
    }

    const ddbSession = await cacheService.entities.session
      .get({
        externalId: session.properties.user.id,
        provider: session.properties.user.provider,
      })
      .go();

    if (!ddbSession.data?.accessToken) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Session does not have an access token",
      });
    }

    if (new Date(ddbSession.data?.accessTokenExpiresAt) < new Date()) {
      if (!ddbSession.data?.refreshToken) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Session does not have a refresh token",
        });
      }

      const newSession = await refreshAccessToken(ddbSession.data.refreshToken, session);

      return newSession.accessToken;
    }

    accessToken = ddbSession.data?.accessToken;

    return ddbSession.data?.accessToken;
  };
}

function isAuthorisedSession(session: SessionValue): session is AuthorisedSession {
  return session.type === "user";
}

export { isAuthorisedSession, getAccessToken };
export type { Context, AuthorisedSession, UnauthorisedSession };
