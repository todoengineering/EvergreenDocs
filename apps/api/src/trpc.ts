import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

const middleware = t.middleware;
const router = t.router;
const publicProcedure = t.procedure;

export { middleware, router, publicProcedure };
