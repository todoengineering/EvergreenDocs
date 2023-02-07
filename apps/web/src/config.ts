function env<T extends string, U = T>(varName: string, fallback: U): T {
  return (process.env[varName] || fallback) as T;
}

const config = {
  aws: {
    cognito: {
      baseUrl: env(
        "COGNITO_BASE_URL",
        "https://openreadme-development.auth.eu-west-1.amazoncognito.com"
      ),
      clientId: env("COGNITO_CLIENT_ID", "1i5rbdfii23dfa4g5ukkar92vl"),
    },
    cloudFrontUrl: env("CLOUDFRONT_URL", "https://d2hvy9hb541t3u.cloudfront.net"),
  },
};

export default config;
