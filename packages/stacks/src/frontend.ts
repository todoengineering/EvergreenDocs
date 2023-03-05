import { StackContext, NextjsSite } from "sst/constructs";

async function frontendStack({ stack }: StackContext) {
  if (!process.env["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"]) {
    throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set");
  }

  if (!process.env["CLERK_SECRET_KEY"]) {
    throw new Error("CLERK_SECRET_KEY is not set");
  }

  const site = new NextjsSite(stack, "Site", {
    path: "apps/web",
    environment: {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"],
      CLERK_SECRET_KEY: process.env["CLERK_SECRET_KEY"],
    },
  });

  stack.addOutputs({
    URL: site.url || "localhost",
  });
}

export default frontendStack;
