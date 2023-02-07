import React, { useState } from "react";
import type { AppProps } from "next/app";
import { Container, MantineProvider } from "@mantine/core";
import { QueryClient, Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Lato, Ultra } from "@next/font/google";
import { httpBatchLink } from "@trpc/react-query";

import emotionCache from "../emotion-cache";
import { trpc } from "../trpc";
import { UserContextProvider } from "../context/user";

const ultraFont = Ultra({
  subsets: ["latin"],
  weight: "400",
});

const latoFont = Lato({
  subsets: ["latin"],
  weight: "700",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:4000",
          fetch: async (input, init?) => {
            return fetch(input, {
              ...init,
              credentials: "include",
            });
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            emotionCache={emotionCache}
            theme={{
              headings: {
                fontFamily: ultraFont.style.fontFamily,
              },
              fontFamily: latoFont.style.fontFamily,
              colors: {
                brand: [
                  "#eff0f6",
                  "#ced2e3",
                  "#aeb3d1",
                  "#8d95bf",
                  "#6c77ac",
                  "#535d93",
                  "#404872",
                  "#2e3451",
                  "#1c1f31",
                  "#090a10",
                ],
              },
              primaryColor: "brand",
              primaryShade: 6,
            }}
          >
            <UserContextProvider>
              <Container m={0} maw="unset">
                <Component {...pageProps} />
              </Container>
            </UserContextProvider>
          </MantineProvider>
        </Hydrate>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
