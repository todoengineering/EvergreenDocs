// eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
const { i18n } = require("./next-i18next.config");
/** @type {import('next').NextConfig} */
// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
};
