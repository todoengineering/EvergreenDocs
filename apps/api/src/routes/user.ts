import { Octokit } from "@octokit/core";

import { router, protectedProcedure } from "../trpc.js";

const userRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    console.log(`Fetched user`);

    return ctx.session.properties.user;
  }),
  getRepositories: protectedProcedure.query(async ({ ctx }) => {
    const accessToken = await ctx.session.getAccessToken();

    const octokit = new Octokit({ auth: accessToken });
    const userRepositoriesResponse = await octokit.request("GET /user/repos");

    console.log(`Fetched ${userRepositoriesResponse.data.length} repositories`);

    // Try and keep this a subset of the GitHub API response so that we don't break much if we have to add more data from the GitHub API
    return userRepositoriesResponse.data.map((repository) => ({
      full_name: repository.full_name,
    }));
  }),
});

export default userRouter;
