import db from "@evergreendocs/rds";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Octokit } from "@octokit/core";
import { sql } from "kysely";
import { Tasks } from "@evergreendocs/rds/src/generated/db.js";

import { router, publicProcedure } from "../trpc.js";
import { isAuthorisedSession } from "../context/session.js";

const workflowLogRouter = router({
  getWorkflowsByRepository: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(25),
        cursor: z.string().nullish(),
        repositoryFullName: z.string(),
        includeSkippedWorkflows: z.boolean().default(true),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!isAuthorisedSession(ctx.session)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to view your workflow logs",
        });
      }

      const accessToken = await ctx.session.getAccessToken();

      const octokit = new Octokit({ auth: accessToken });
      const userRepositoriesResponse = await octokit.request("GET /user/repos");

      const isUserRepository = userRepositoriesResponse.data.some(
        (repository) => repository.full_name === input.repositoryFullName
      );

      if (!isUserRepository) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to view your workflow logs",
        });
      }

      const result = await db
        .selectFrom("Workflows")
        .select([
          "Workflows.head_commit as headCommit",
          "Workflows.repository_full_name as repositoryFullName",
          "Workflows.head_commit_message as headCommitMessage",
          "Workflows.status as status",
          "Workflows.reason as reason",
          "Workflows.started_at as startedAt",
          "Workflows.completed_at as completedAt",
          // TODO: Can we get these to be camelCase?
          sql<Tasks[]>`JSON_ARRAYAGG(JSON_OBJECT(
            'id', Tasks.id,
            'head_commit', Tasks.head_commit,
            'preset', Tasks.preset,
            'status', Tasks.status,
            'output_pull_request_url', Tasks.output_pull_request_url,
            'output_commit', Tasks.output_commit,
            'output_commit_message', Tasks.output_commit_message,
            'reason', Tasks.reason,
            'started_at', Tasks.started_at,
            'completed_at', Tasks.completed_at
          ))`.as("tasks"),
        ])
        .leftJoin("Tasks", "Tasks.head_commit", "Workflows.head_commit")
        .groupBy("Workflows.head_commit")

        .execute();

      return {
        items: result,
        // nextCursor: workflowsResponse.cursor,
      };
    }),
});

export default workflowLogRouter;
