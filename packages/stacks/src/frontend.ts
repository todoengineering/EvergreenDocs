import { StackContext, NextjsSite } from "sst/constructs";

async function frontendStack({ stack }: StackContext) {
  const site = new NextjsSite(stack, "Site", {
    path: "apps/web",
  });

  stack.addOutputs({
    URL: site.url || "localhost",
  });
}

export default frontendStack;
