import { NextApiResponse, NextApiRequest } from "next";
import { createAppAuth } from "@octokit/auth-app";
import { secretsManagerService } from "@evergreendocs/services";

let appAuth: Awaited<ReturnType<typeof createAppAuth>> | null = null;

type GitHubAppAuth = {
  appId: string;
  clientId: string;
  clientSecret: string;
};

const getAppAuth = async () => {
  if (!appAuth) {
    const githubAppAuth = await secretsManagerService.getSecretJson<GitHubAppAuth>(
      "development/evergreendocs/githubapp"
    );

    const githubAppPrivateKey = await secretsManagerService.getSecret(
      "development/evergreendocs/githubapp/privatekey"
    );

    appAuth = createAppAuth({
      appId: githubAppAuth?.appId,
      clientId: githubAppAuth?.clientId,
      clientSecret: githubAppAuth?.clientSecret,
      privateKey: githubAppPrivateKey,
    });
  }

  return appAuth;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query["code"];

  if (!code || typeof code !== "string") {
    return res.status(400).json({ message: "Missing code" });
  }

  const appAuth = await getAppAuth();

  const userAuthentication = await appAuth({ type: "oauth-user", code: code });

  return res.status(200).json(userAuthentication.token);
}
