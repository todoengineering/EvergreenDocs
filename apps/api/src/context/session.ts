import "@evergreendocs/tsconfig/session";

import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SessionValue } from "sst/node/future/auth";
import { cacheService } from "@evergreendocs/services";

interface AuthorisedSession extends Extract<SessionValue, { type: "user" }> {
  getAccessToken: ReturnType<typeof getAccessToken>;
}

type UnauthorisedSession = Extract<SessionValue, { type: "public" }>;

type Context = {
  session: AuthorisedSession | UnauthorisedSession;
  request: APIGatewayProxyEventV2;
};

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
      throw new Error("Session not found");
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
