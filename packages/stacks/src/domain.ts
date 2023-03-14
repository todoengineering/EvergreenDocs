import { Stack } from "sst/constructs";

const getStackSubdomain = (stack: Stack, subDomain: string) => {
  if (stack.stage === "production") {
    return subDomain;
  }

  return `${stack.stage}.${subDomain}`;
};

export { getStackSubdomain };
