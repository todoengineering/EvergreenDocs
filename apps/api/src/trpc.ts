import { initTRPC } from "@trpc/server";

import { Context } from "./context.js";

const t = initTRPC.context<Context>().create();

const middleware = t.middleware;
const router = t.router;
const publicProcedure = t.procedure;

export { middleware, router, publicProcedure };
