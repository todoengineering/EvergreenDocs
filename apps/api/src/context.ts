import { inferAsyncReturnType } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import cookie from "cookie";

import cognitoService from "./services/cognito.js";

type Context = inferAsyncReturnType<typeof createContext>;

async function createContext({ req, res }: CreateFastifyContextOptions) {
  const cookies = cookie.parse(req.raw.headers.cookie || "");
  let accessToken = cookies.accessToken;
  let refreshToken = cookies.refreshToken;

  try {
    // If we have a refresh token but no access token, try to refresh the access token with the refresh token
    if (!accessToken && refreshToken) {
      const data = await cognitoService.fetchOAuthTokens({ refreshToken });

      accessToken = data.accessToken;
      refreshToken = data.refreshToken;

      const accessTokenCookie = cookie.serialize("accessToken", data.accessToken, {
        maxAge: data.expiresIn,
      });
      const refreshTokenCookie = cookie.serialize("refreshToken", data.refreshToken, {
        maxAge: 30,
      });
      res.header("Set-Cookie", accessTokenCookie);
      res.header("Set-Cookie", refreshTokenCookie);
    }

    if (accessToken) {
      const user = await cognitoService.fetchUser({ accessToken });

      return { req, res, user };
    }
  } catch (e) {
    console.error("Failed to refresh access token", e);

    // We assume that the tokens are invalid if we get an error, so we clear it
    const refreshTokenCookie = cookie.serialize("refreshToken", refreshToken, {
      maxAge: 0,
    });

    res.header("Set-Cookie", refreshTokenCookie);
  }

  return { req, res };
}

export default createContext;
export type { Context };
