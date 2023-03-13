import { StackContext } from "sst/constructs";
import {
  OpenIdConnectProvider,
  OpenIdConnectPrincipal,
  Role,
  PolicyDocument,
  PolicyStatement,
  Effect,
} from "aws-cdk-lib/aws-iam";
import { Duration } from "aws-cdk-lib";

async function githubActionsPermissionsStack({ stack }: StackContext) {
  if (stack.stage !== "production") {
    return;
  }

  /**
   * Create an Identity provider for GitHub inside your AWS Account. This
   * allows GitHub to present itself to AWS IAM and assume a role.
   */
  const provider = new OpenIdConnectProvider(stack, "MyProvider", {
    url: "https://token.actions.githubusercontent.com",
    clientIds: ["sts.amazonaws.com"],
  });

  const githubOrganisation = "EvergreenDocs";
  const repoName = "EvergreenDocs";
  /**
   * Create a principal for the OpenID; which can allow it to assume
   * deployment roles.
   */
  const GitHubPrincipal = new OpenIdConnectPrincipal(provider).withConditions({
    StringLike: {
      "token.actions.githubusercontent.com:sub": `repo:${githubOrganisation}/${repoName}:*`,
    },
  });

  new Role(stack, "GitHubActionsRole", {
    assumedBy: GitHubPrincipal.grantPrincipal,
    description: "Role assumed by GitHubPrincipal for deploying from CI using aws cdk",
    roleName: "github-ci-role",
    maxSessionDuration: Duration.hours(1),
    inlinePolicies: {
      CdkDeploymentPolicy: new PolicyDocument({
        assignSids: true,
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ["cloudformation:*"],
            resources: [`arn:aws:cloudformation:${stack.region}:${stack.account}:stack/*/*`],
          }),
        ],
      }),
    },
  });
}

export default githubActionsPermissionsStack;
