import { AppRouter } from "@evergreendocs/api";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { createTRPCNext } from "@trpc/next";
import type { inferProcedureOutput } from "@trpc/server";
import { NextPageContext } from "next";
import superjson from "superjson";

// NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createReactQueryHooks`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */

export const trpc = createTRPCNext<AppRouter, NextPageContext, Record<string, never>>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */

    return {
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            (process.env["NODE_ENV"] === "development" && typeof window !== "undefined") ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `https://v5gmnhbywzku5hzf6llxg77ote0ebcxz.lambda-url.eu-west-1.on.aws`,
          async headers() {
            const token = await window.Clerk.session?.getToken();

            return token
              ? {
                  Authorization: token,
                }
              : {};
          },
        }),
      ],
      /**
       * @link https://trpc.io/docs/data-transformers
       */
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
});

// export const transformer = superjson;
/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
export type inferQueryOutput<TRouteKey extends keyof AppRouter["_def"]["queries"]> =
  inferProcedureOutput<AppRouter["_def"]["queries"][TRouteKey]>;
