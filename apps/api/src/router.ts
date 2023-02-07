import usersRouter from "./users/users.router.js";
import authenticationRouter from "./auth/auth.router.js";
import s3Router from "./s3/s3.router.js";
import { router } from "./trpc.js";

type AppRouter = typeof appRouter;

const appRouter = router({
  users: usersRouter,
  auth: authenticationRouter,
  s3: s3Router,
});

export default appRouter;
export type { AppRouter };
