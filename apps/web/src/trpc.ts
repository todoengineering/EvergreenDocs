import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@openreadme/api";

export const trpc = createTRPCReact<AppRouter>();
