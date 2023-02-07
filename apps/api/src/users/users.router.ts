import { TRPCError } from "@trpc/server";

import { router, publicProcedure } from "../trpc.js";

import { User } from "./users.schema.js";

const usersRouter = router({
  me: publicProcedure.output(User).query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    return ctx.user;
  }),
});

export default usersRouter;
