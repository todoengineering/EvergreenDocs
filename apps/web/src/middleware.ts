import { withClerkMiddleware, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Set the paths that don't require the user to be signed in
const appPathRegex = new RegExp(`^\/app`);

const isPublic = (path: string) => {
  return !appPathRegex.test(path);
};

export default withClerkMiddleware((request: NextRequest) => {
  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // if the user is not signed in redirect them to the sign in page.
  const res = getAuth(request);

  // console.log(userId, request);
  if (!res.userId) {
    // redirect the users to /pages/sign-in/[[...index]].ts

    const logInUrl = new URL("/login", request.url);
    logInUrl.searchParams.set("redirect_url", request.url);
    return NextResponse.redirect(logInUrl);
  }
  return NextResponse.next();
});

export const config = { matcher: "/((?!_next/image|_next/static|favicon.ico).*)" };
