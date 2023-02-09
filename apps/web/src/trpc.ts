import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@evergreendocs/api";

export const trpc = createTRPCReact<AppRouter>();
