import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { User } from "../users/users.schema.js";
import config from "../config.js";

const cognitoClient = new CognitoIdentityProviderClient({
  region: "eu-west-1",
});

interface OAuth2TokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  token_type: "Bearer";
}

const cognitoService = {
  fetchOAuthTokens: async function ({
    code,
    refreshToken,
  }: { code: string; refreshToken?: undefined } | { code?: undefined; refreshToken: string }) {
    const body = new URLSearchParams({
      client_id: config.aws.cognito.clientId,
      redirect_uri: "http://localhost:3000/login/callback",
    });

    if (code) {
      body.append("grant_type", "authorization_code");
      body.append("code", code);
    } else if (refreshToken) {
      body.append("grant_type", "refresh_token");
      body.append("refresh_token", refreshToken);
    }

    const response = await fetch(`${config.aws.cognito.baseUrl}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      console.log(JSON.stringify({ response }));
      throw new Error(
        `Failed to fetch tokens from Cognito: ${JSON.stringify({
          body: response?.json() || {},
          status: response?.status,
        })}`
      );
    }

    const data = (await response.json()) as OAuth2TokenResponse;

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      idToken: data.id_token,
      refreshToken: data.refresh_token,
      tokenType: data.token_type,
    };
  },

  fetchUser: async function ({ accessToken }: { accessToken: string }) {
    const cognitoUser = await cognitoClient.send(
      new GetUserCommand({
        AccessToken: accessToken,
      })
    );

    return User.parse({
      id: cognitoUser.Username,
      email: cognitoUser.UserAttributes?.find((attr) => attr.Name === "email")?.Value,
    });
  },
};

export default cognitoService;
