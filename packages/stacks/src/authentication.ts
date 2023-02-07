import { Cognito, StackContext } from "sst/constructs";
import {
  ProviderAttribute,
  UserPool,
  UserPoolClientIdentityProvider,
  UserPoolIdentityProviderGoogle,
  UserPoolDomain,
} from "aws-cdk-lib/aws-cognito";
import { SecretValue } from "aws-cdk-lib";

function authenticationStack({ stack }: StackContext) {
  if (!process.env["GOOGLE_CLIENT_ID"] || !process.env["GOOGLE_CLIENT_SECRET"]) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set");
  }

  const userPool = new UserPool(stack, "openreadme-user-pool", {
    userPoolName: `openreadme-user-pool-${stack.stage}`,
    signInAliases: { email: true },
    standardAttributes: {
      email: { required: true, mutable: true },
    },
    autoVerify: { email: true },
    passwordPolicy: {
      minLength: 8,
      requireLowercase: true,
      requireDigits: true,
      requireSymbols: false,
      requireUppercase: true,
    },
    signInCaseSensitive: false,
    deviceTracking: { deviceOnlyRememberedOnUserPrompt: true, challengeRequiredOnNewDevice: true },
    selfSignUpEnabled: true,
  });

  new UserPoolDomain(stack, `openreadme-user-pool-domain`, {
    cognitoDomain: {
      domainPrefix: `openreadme-${stack.stage}`,
    },
    userPool,
  });

  const googleProvider = new UserPoolIdentityProviderGoogle(
    stack,
    `openreadme-user-pool-provider-google`,
    {
      userPool,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientId: process.env["GOOGLE_CLIENT_ID"]!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientSecretValue: SecretValue.unsafePlainText(process.env["GOOGLE_CLIENT_SECRET"]!),
      scopes: ["email"],
      attributeMapping: {
        email: ProviderAttribute.GOOGLE_EMAIL,
        fullname: ProviderAttribute.GOOGLE_NAME,
        phoneNumber: ProviderAttribute.GOOGLE_PHONE_NUMBERS,
        preferredUsername: ProviderAttribute.other("sub"),
      },
    }
  );

  const auth = new Cognito(stack, "openreadme-cognito", {
    login: ["email"],
    identityPoolFederation: false,
    cdk: {
      userPool: userPool,
      userPoolClient: {
        supportedIdentityProviders: [UserPoolClientIdentityProvider.GOOGLE],
        oAuth: {
          callbackUrls: ["http://localhost:3000/login/callback"],
          logoutUrls: ["http://localhost:3000/logout/callback"],
        },
      },
    },
  });
  auth.node.addDependency(googleProvider);
}

export default authenticationStack;
