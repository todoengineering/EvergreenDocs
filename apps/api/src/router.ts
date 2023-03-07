import { router } from "./trpc.js";
import workflowLogRouter from "./workflow-log/workflow-log.router.js";

const appRouter = router({
  workflowLog: workflowLogRouter,
});

export default appRouter;
export type AppRouter = typeof appRouter;
