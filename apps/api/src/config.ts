function env<T extends string, U = T>(varName: string, fallback: U): T {
  return (process.env[varName] || fallback) as T;
}

const config = {
  aws: {
    region: env("AWS_REGION", "eu-west-1"),
    profile: env("AWS_PROFILE", null),
    cognito: {
      baseUrl: env(
        "COGNITO_BASE_URL",
        "https://evergreendocs-development.auth.eu-west-1.amazoncognito.com"
      ),
      clientId: env("COGNITO_CLIENT_ID", "1i5rbdfii23dfa4g5ukkar92vl"),
    },
  },
};

export default config;
