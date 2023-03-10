import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Set the paths that don't require the user to be signed in
const appPathRegex = new RegExp(`^\/app`);

const isPublic = (path: string) => {
  return !appPathRegex.test(path);
};

function middleware(request: NextRequest) {
  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // if the user is not signed in redirect them to the sign in page.
  const res = { userId: 1234 };

  if (!res.userId) {
    // redirect the users to /pages/sign-in/[[...index]].ts

    const logInUrl = new URL("/login", request.url);
    logInUrl.searchParams.set("redirect_url", request.url);
    return NextResponse.redirect(logInUrl);
  }
  return NextResponse.next();
}

const config = { matcher: "/((?!_next/image|_next/static|favicon.ico).*)" };

export { config };
export default middleware;
