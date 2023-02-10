const banner = [
  // WORKAROUND: Add `crypto` octokit - https://github.com/serverless-stack/open-next#workaround-nextauth-middleware
  "import crypto from 'node:crypto';",
  "Object.assign(globalThis, {",
  "  crypto,",
  "  self: {},",
  "});",
].join("");

export default banner;
