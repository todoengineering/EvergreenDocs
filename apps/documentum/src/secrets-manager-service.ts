import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

class SecretsManagerService extends SecretsManagerClient {
  constructor() {
    super({ region: "eu-west-1" });
  }

  async getSecret(secretId: string) {
    const response = await this.send(new GetSecretValueCommand({ SecretId: secretId }));

    return response.SecretString || "";
  }

  async getSecretJson<T>(secretId: string): Promise<T> {
    const secretString = await this.getSecret(secretId);

    return JSON.parse(secretString);
  }
}

export default new SecretsManagerService();
