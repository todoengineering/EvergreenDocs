import db, { jsonArrayFrom, sql } from "@evergreendocs/rds";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Octokit } from "@octokit/core";

import { router, publicProcedure } from "../trpc.js";
import { isAuthorisedSession } from "../context/session.js";

const workflowLogRouter = router({
  getWorkflowsByRepository: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(25),
        page: z.number().default(1),
        repositoryFullName: z.string().optional(),
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

      if (input.repositoryFullName) {
        const isUserRepository = userRepositoriesResponse.data.some(
          (repository) => repository.full_name === input.repositoryFullName
        );

        if (!isUserRepository) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to view your workflow logs",
          });
        }
      }

      const itemsPromise = db
        .selectFrom("Workflows")
        .select([
          "Workflows.head_commit as headCommit",
          "Workflows.repository_full_name as repositoryFullName",
          "Workflows.head_commit_message as headCommitMessage",
          "Workflows.status as status",
          "Workflows.reason as reason",
          "Workflows.started_at as startedAt",
          "Workflows.completed_at as completedAt",
          (eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("Tasks")
                .select([
                  "id",
                  "head_commit",
                  "preset",
                  "status",
                  "output_pull_request_url",
                  "output_commit",
                  "output_commit_message",
                  "reason",
                  "started_at",
                  "completed_at",
                ])
                .whereRef("Tasks.head_commit", "=", sql`headCommit`)
            ).as("tasks"),
        ])
        .groupBy("Workflows.head_commit")
        .orderBy("Workflows.started_at", "desc")
        .$if(!input.includeSkippedWorkflows, (eb) => eb.where("Workflows.status", "!=", "SKIPPED"))
        .$if(Boolean(input.repositoryFullName), (eb) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          eb.where("Workflows.repository_full_name", "=", input.repositoryFullName!)
        )
        .$if(!input.repositoryFullName, (eb) =>
          eb.where(
            "Workflows.repository_full_name",
            "in",
            userRepositoriesResponse.data.map((repository) => repository.full_name)
          )
        )
        .limit(input.limit)
        .offset((input.page - 1) * input.limit)
        .execute();

      // TODO: Can we do this in a single query? With the above query maybe? Also should probably extract these to a service/repository
      const countPromise = db
        .selectFrom("Workflows")
        .select(db.fn.count("Workflows.started_at").as("count"))
        .orderBy("Workflows.started_at", "desc")
        .$if(!input.includeSkippedWorkflows, (eb) => eb.where("Workflows.status", "!=", "SKIPPED"))
        .$if(Boolean(input.repositoryFullName), (eb) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          eb.where("Workflows.repository_full_name", "=", input.repositoryFullName!)
        )
        .$if(!input.repositoryFullName, (eb) =>
          eb.where(
            "Workflows.repository_full_name",
            "in",
            userRepositoriesResponse.data.map((repository) => repository.full_name)
          )
        )
        .execute();

      const [items, count] = await Promise.all([itemsPromise, countPromise]);

      const total =
        typeof count[0].count === "string" ? parseInt(count[0].count, 10) : Number(count[0].count);

      return {
        items,
        total,
        hasMore: count[0].count > input.limit * input.page,
      };
    }),
});

export default workflowLogRouter;
