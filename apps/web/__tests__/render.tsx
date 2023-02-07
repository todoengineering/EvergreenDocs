import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render as reactTestingLibraryRender } from "@testing-library/react";
import { httpBatchLink } from "@trpc/react-query";
import { OpenReadmeTypes } from "@openreadme/api";

import { trpc } from "../src/trpc.js";
import { UserContext } from "../src/context/user.jsx";

const render = (ui: React.ReactElement, options?: { user?: OpenReadmeTypes.User }) => {
  const { user } = options || {};

  const trpcClient = trpc.createClient({
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
  });

  const queryClient = new QueryClient();

  return reactTestingLibraryRender(
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={{ user, isLoading: false }}>{ui}</UserContext.Provider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default render;
