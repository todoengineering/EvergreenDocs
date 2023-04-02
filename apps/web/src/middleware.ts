import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getTrpcClient } from "./trpc";

const appPathRegex = new RegExp(`^\/app`);
const isAppPage = (path: string) => {
  return appPathRegex.test(path);
};

const authPathRegex = new RegExp(`^\/(login|signup)`);
const isAuthPage = (path: string) => {
  return authPathRegex.test(path);
};
const isLogoutPage = (path: string) => {
  return path === "/logout";
};

async function middleware(request: NextRequest) {
  if (isLogoutPage(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url), {
      headers: {
        "Set-Cookie": "accessToken=; path=/; max-age=0; SameSite=Lax;",
      },
    });
  }

  if (!isAppPage(request.nextUrl.pathname) && !isAuthPage(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  try {
    const trpcClient = getTrpcClient(request);
    const user = await trpcClient.user.me.query(undefined);

    if (!user) {
      if (isAuthPage(request.nextUrl.pathname)) {
        return NextResponse.next();
      }

      throw new Error("User not found");
    }

    if (isAuthPage(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/app", request.url));
    }

    return NextResponse.next();
  } catch (e) {
    if (isAppPage(request.nextUrl.pathname)) {
      const logInUrl = new URL("/login", request.url);

      logInUrl.searchParams.set("redirect_url", request.url);

      return NextResponse.redirect(logInUrl);
    }

    return NextResponse.next();
  }
}

const config = { matcher: "/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)" };

export { config };
export default middleware;
