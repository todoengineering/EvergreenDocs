import type { AppRouter } from "@evergreendocs/api";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { createTRPCNext } from "@trpc/next";
import { GetServerSidePropsContext, NextPageContext } from "next";
import { NextRequest } from "next/server";
import superjson from "superjson";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

import config from "./config";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

const trpc = createTRPCNext<AppRouter, NextPageContext, Record<string, never>>({
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
            (config.get.nodeEnv === "development" && typeof window !== "undefined") ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: config.get.apiUrl,
          async headers() {
            const cookies = document.cookie.split(";").reduce((acc, cookie) => {
              const [key, value] = cookie.split("=");
              return { ...acc, [key.trim()]: value };
            }, {} as Record<string, string>);
            const accessToken = cookies["accessToken"];

            return accessToken ? { Authorization: `bearer ${accessToken}` } : {};
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

const getTrpcClient = (req: NextRequest | GetServerSidePropsContext["req"]) =>
  createTRPCProxyClient<AppRouter>({
    links: [
      loggerLink({
        enabled: (opts) =>
          (config.get.nodeEnv === "development" && typeof window !== "undefined") ||
          (opts.direction === "down" && opts.result instanceof Error),
      }),
      httpBatchLink({
        url: config.get.apiUrl,
        async headers() {
          let accessToken: string | null = null;

          if (req.cookies instanceof RequestCookies) {
            accessToken = req.cookies.get("accessToken")?.value ?? null;
          } else if (req.cookies) {
            accessToken = req.cookies["accessToken"] ?? null;
          }

          return accessToken ? { Authorization: `bearer ${accessToken}` } : {};
        },
      }),
    ],
    transformer: superjson,
  });

export { trpc, getTrpcClient };
export type { RouterInput, RouterOutput };
