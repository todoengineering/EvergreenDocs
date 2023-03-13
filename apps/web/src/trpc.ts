import { AppRouter } from "@evergreendocs/api";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { createTRPCNext } from "@trpc/next";
import { NextPageContext } from "next";
import { NextRequest } from "next/server";
import superjson from "superjson";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

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
            (process.env["NODE_ENV"] === "development" && typeof window !== "undefined") ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          // TODO: move to config file
          url: process.env["NEXT_PUBLIC_EVERGREEN_API_URL"] as string,
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

const getTrpcClient = (req: NextRequest) =>
  createTRPCProxyClient<AppRouter>({
    links: [
      loggerLink({
        enabled: (opts) =>
          (process.env["NODE_ENV"] === "development" && typeof window !== "undefined") ||
          (opts.direction === "down" && opts.result instanceof Error),
      }),
      httpBatchLink({
        // TODO: move to config file
        url: process.env["NEXT_PUBLIC_EVERGREEN_API_URL"] as string,
        async headers() {
          const accessToken = req.cookies.get("accessToken");

          return accessToken?.value ? { Authorization: `bearer ${accessToken.value}` } : {};
        },
      }),
    ],
    transformer: superjson,
  });

export { trpc, getTrpcClient };
