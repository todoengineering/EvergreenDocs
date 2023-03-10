import "@evergreendocs/tsconfig/session";

import { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { useSession } from "sst/node/future/auth";

import {
  AuthorisedSession,
  getAccessToken,
  isAuthorisedSession,
  UnauthorisedSession,
} from "./session.js";

type Context = {
  session: AuthorisedSession | UnauthorisedSession;
  request: APIGatewayProxyEventV2;
};

const createContext = async ({
  event,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>): Promise<Context> => {
  const session = useSession() satisfies Context["session"];

  if (!isAuthorisedSession(session)) {
    return { session, request: event };
  }

  const authorisedSession: AuthorisedSession = {
    ...session,
    getAccessToken: getAccessToken(session),
  };

  return { session: authorisedSession, request: event };
};

export default createContext;
export type { Context };
