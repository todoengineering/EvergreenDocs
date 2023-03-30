import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

type Stages = "isaac-development" | "dan-development" | "production";

type SecretJson = {
  githubapp: {
    appId: string;
    clientId: string;
    clientSecret: string;
    webhookSecret: string;
  };
  openai: {
    key: string;
  };
  rds: {
    username: string;
    password: string;
    host: string;
    database: string;
  };
};

class SecretsManagerService extends SecretsManagerClient {
  constructor() {
    super({ region: "eu-west-1" });
  }

  async getSecret(secretId: string) {
    const response = await this.send(new GetSecretValueCommand({ SecretId: secretId }));

    return response.SecretString || "";
  }

  async getSecretJson<T extends keyof SecretJson>(
    secretId: `${Stages}/evergreendocs/${T}`
  ): Promise<SecretJson[T]> {
    const secretString = await this.getSecret(secretId);

    return JSON.parse(secretString);
  }
}

export default new SecretsManagerService();
