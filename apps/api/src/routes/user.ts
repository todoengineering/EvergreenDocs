import { TRPCError } from "@trpc/server";
import { Octokit } from "@octokit/core";

import { router, publicProcedure } from "../trpc.js";
import { isAuthorisedSession } from "../context/session.js";

const userRouter = router({
  me: publicProcedure.query(async ({ ctx }) => {
    if (!isAuthorisedSession(ctx.session)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to access this resource",
      });
    }

    return ctx.session.properties.user;
  }),
  getRepositories: publicProcedure.query(async ({ ctx }) => {
    if (!isAuthorisedSession(ctx.session)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view your workflow logs",
      });
    }

    const accessToken = await ctx.session.getAccessToken();

    const octokit = new Octokit({ auth: accessToken });
    const userRepositoriesResponse = await octokit.request("GET /user/repos");

    // Try and keep this a subset of the GitHub API response so that we don't break much if we have to add more data from the GitHub API
    return userRepositoriesResponse.data.map((repository) => ({
      full_name: repository.full_name,
    }));
  }),
});

export default userRouter;
