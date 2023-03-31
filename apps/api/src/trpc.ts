import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";

import { Context } from "./context";
import { isAuthorisedSession } from "./context/session";

const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/v10/data-transformers
   */
  transformer: superjson,
  /**
   * @see https://trpc.io/docs/v10/error-formatting
   */
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(
  t.middleware(({ ctx, next }) => {
    if (!isAuthorisedSession(ctx.session)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to access this resource",
      });
    }

    return next({ ctx: { ...ctx, session: ctx.session } });
  })
);
export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;
