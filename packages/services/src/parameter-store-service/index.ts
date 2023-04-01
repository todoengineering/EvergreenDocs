import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";
import { z } from "zod";

type Stages = "isaac-development" | "dan-development" | "production";

const parameterJsonMap = {
  githubapp: z.object({
    appId: z.string(),
    clientId: z.string(),
    clientSecret: z.string(),
    webhookSecret: z.string(),
    privatekey: z.string(),
  }),
  openai: z.object({
    key: z.string(),
  }),
  rds: z.object({
    username: z.string(),
    password: z.string(),
    host: z.string(),
    database: z.string(),
  }),
} as const;

class ParameterStoreService extends SSMClient {
  constructor() {
    super({ region: "eu-west-1" });
  }

  async getSecretJson<T extends keyof typeof parameterJsonMap>(input: {
    parameter: T;
    stage: Stages;
  }): Promise<z.infer<(typeof parameterJsonMap)[T]>> {
    const { parameter, stage } = input;

    const parameterNames = parameterJsonMap[parameter]
      .keyof()
      .options.map((key: string) => `/${stage}/evergreendocs/${parameter}/${key}`);

    const response = await this.send(
      new GetParametersCommand({
        Names: parameterNames,
        WithDecryption: true,
      })
    );

    const parameters: Record<string, string | undefined> = {};

    response.Parameters?.forEach((parameter) => {
      const name = parameter.Name?.split("/").pop() || "";

      parameters[name] = parameter.Value;
    });

    return parameterJsonMap[parameter].parse(parameters);
  }
}

export default new ParameterStoreService();
