import { workflowLoggingService, WorkflowLoggingServiceTypes } from "@evergreendocs/services";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Octokit } from "@octokit/core";

import { router, publicProcedure } from "../trpc.js";
import { isAuthorisedSession } from "../context/session.js";

const workflowLogRouter = router({
  getLoggedInUserWorkflowLogs: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(25),
        cursor: z.string().nullish(),
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

      // Can this be done cleaner?
      const workflowLogs1 = (
        await Promise.all(
          userRepositoriesResponse.data.map(async (repository) => {
            const workflowsResponse = await workflowLoggingService.collections
              .workflowTasksByRepositoryName({
                repositoryFullName: repository.full_name,
              })
              .go();

            return workflowsResponse.data.workflow.length ? workflowsResponse.data : [];
          })
        )
      ).flat();

      const workflows: (WorkflowLoggingServiceTypes.Workflow & {
        tasks: WorkflowLoggingServiceTypes.Task[];
      })[] = [];

      for (const workflowLogs of workflowLogs1) {
        for (const workflowLog of workflowLogs.workflow) {
          workflows.push({
            ...workflowLog,
            tasks: workflowLogs.task.filter((task) => task.headCommit === workflowLog.headCommit),
          });
        }
      }

      return {
        items: workflows,
      };
    }),

  getWorkflowLogByCommit: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    if (!isAuthorisedSession(ctx.session)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view your workflow logs",
      });
    }

    const accessToken = await ctx.session.getAccessToken();

    const octokit = new Octokit({ auth: accessToken });
    const userRepositoriesResponse = await octokit.request("GET /user/repos");

    const workflowLogResponse = await workflowLoggingService.entities.workflow.query
      .workflow({
        headCommit: input,
      })
      .go();
    const workflowLog = workflowLogResponse?.data?.[0];

    if (!workflowLog) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Workflow log not found",
      });
    }

    if (
      !userRepositoriesResponse.data.some(
        (repository) => repository.full_name === workflowLog.repositoryFullName
      )
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You do not have access to this workflow log",
      });
    }

    return workflowLog;
  }),
});

export default workflowLogRouter;
