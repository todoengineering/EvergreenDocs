import { router } from "../trpc.js";

import workflowLogRouter from "./workflow-log.js";
import userRouter from "./user.js";

const appRouter = router({
  user: userRouter,
  workflowLog: workflowLogRouter,
});

export default appRouter;
export type AppRouter = typeof appRouter;
