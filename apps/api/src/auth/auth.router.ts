import { z } from "zod";
import cookie from "cookie";

import { router, publicProcedure } from "../trpc.js";
import cognitoService from "../services/cognito.js";

const authenticationRouter = router({
  login: publicProcedure
    .input(
      z.union([
        z.object({ code: z.string(), refreshToken: z.undefined().optional() }),
        z.object({ code: z.undefined().optional(), refreshToken: z.string() }),
      ])
    )
    .query(async ({ input, ctx }) => {
      const data = await cognitoService.fetchOAuthTokens(input);

      const accessTokenCookie = cookie.serialize("accessToken", data.accessToken, {
        maxAge: data.expiresIn,
      });
      const refreshTokenCookie = cookie.serialize("refreshToken", data.refreshToken, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
      ctx.res.header("Set-Cookie", accessTokenCookie);
      ctx.res.header("Set-Cookie", refreshTokenCookie);

      return {
        accessToken: data.accessToken,
      };
    }),
  logout: publicProcedure.query(async ({ ctx }) => {
    const cookies = cookie.parse(ctx.req.raw.headers.cookie || "");

    if (cookies.accessToken !== undefined) {
      const accessTokenCookie = cookie.serialize("accessToken", cookies.accessToken, {
        maxAge: 0,
      });
      ctx.res.header("Set-Cookie", accessTokenCookie);
    }

    if (cookies.refreshToken !== undefined) {
      const refreshTokenCookie = cookie.serialize("refreshToken", cookies.refreshToken, {
        maxAge: 0,
      });
      ctx.res.header("Set-Cookie", refreshTokenCookie);
    }

    return {};
  }),
});

export default authenticationRouter;
