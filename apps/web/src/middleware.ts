import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getTrpcClient } from "./trpc";

const appPathRegex = new RegExp(`^\/app`);
const requiresAuthorization = (path: string) => {
  return appPathRegex.test(path);
};

async function middleware(request: NextRequest) {
  // TODO: Check if the user is signed in on login/signup pages and redirect to app if they are
  if (!requiresAuthorization(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  try {
    const trpcClient = getTrpcClient(request);
    const user = await trpcClient.user.me.query(undefined);

    if (!user) {
      throw new Error("User not found");
    }

    return NextResponse.next();
  } catch {
    const logInUrl = new URL("/login", request.url);
    logInUrl.searchParams.set("redirect_url", request.url);

    return NextResponse.redirect(logInUrl);
  }
}

const config = { matcher: "/((?!_next/image|_next/static|favicon.ico).*)" };

export { config };
export default middleware;
