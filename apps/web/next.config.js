// eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
const nextTranslate = require("next-translate-plugin");
/** @type {import('next').NextConfig} */
// eslint-disable-next-line unicorn/prefer-module
module.exports = nextTranslate({
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    swcPlugins: [["next-superjson-plugin", { excluded: [] }]],
  },
});
