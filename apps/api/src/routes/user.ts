import { TRPCError } from "@trpc/server";

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
});

export default userRouter;
