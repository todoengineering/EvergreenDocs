import * as trpc from "@trpc/server";
import { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import { APIGatewayProxyEventV2 } from "aws-lambda";

type Session = {
  readonly id: string;
  readonly userId: string;
  readonly lastActiveAt: number;
  readonly expireAt: number;
  readonly createdAt: number;
};

type User = {
  readonly id: string;
  readonly externalId: string | null;
  readonly provider: string;
  readonly profileImageUrl: string;
  readonly birthday: string;
  readonly emailAddress: string | null;
  readonly phoneNumber: string | null;
  readonly gender: string;
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly lastSignInAt: number | null;
};

const createContext = async ({}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => {
  const user: User = {
    id: "1",
    externalId: null,
    provider: "oauth_github",
    profileImageUrl: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
    birthday: "1991-01-01",
    emailAddress: "",
    phoneNumber: null,
    gender: "",
    firstName: "John",
    lastName: "Doe",
    createdAt: 0,
    updatedAt: 0,
    lastSignInAt: 0,
  };

  const session: Session = {
    id: "1",
    userId: "1",
    lastActiveAt: 0,
    expireAt: 0,
    createdAt: 0,
  };

  return { user, session };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export default createContext;
export type { Context };
