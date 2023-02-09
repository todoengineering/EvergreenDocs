import React, { createContext, useMemo } from "react";
import type { EvergreenDocsTypes } from "@evergreendocs/api";

import { trpc } from "../trpc";

type UserContextProps = {
  user: EvergreenDocsTypes.User | undefined;
  isLoading: boolean;
};

const UserContext = createContext<UserContextProps>({ user: undefined, isLoading: true });

const useUser = () => React.useContext(UserContext);

function UserContextProvider({ children }: { children: React.ReactNode }) {
  const queryEnabled =
    typeof window !== "undefined"
      ? window?.document?.cookie?.includes("accessToken") ||
        window?.document?.cookie?.includes("refreshToken")
      : false;

  const { data, isLoading } = trpc.users.me.useQuery(undefined, {
    retry: false,
    enabled: queryEnabled,
  });

  const value = useMemo(() => ({ user: data, isLoading }), [data, isLoading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export { UserContextProvider, useUser, UserContext };
