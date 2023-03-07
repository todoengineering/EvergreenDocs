import workflowLoggingService from "@evergreendocs/workflow-logging-service";
import { TRPCError } from "@trpc/server";

import { router, publicProcedure } from "../trpc.js";

const workflowLogRouter = router({
  getLoggedInUserWorkflowLogs: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view your workflow logs",
      });
    }

    const workflowLogs = await workflowLoggingService.entities.workflow.query
      .byUser({
        userId: ctx.user?.id,
      })
      .go();

    return { workflowLogs };
  }),
});

export default workflowLogRouter;
