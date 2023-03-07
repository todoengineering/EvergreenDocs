import { router, publicProcedure } from "../trpc.js";

const workflowLogRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "Hello World!";
  }),
});

export default workflowLogRouter;
