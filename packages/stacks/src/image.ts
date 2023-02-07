import { StackContext, Bucket } from "sst/constructs";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";
import { HttpMethods } from "aws-cdk-lib/aws-s3";

export function ImageStack({ stack }: StackContext) {
  const imageRepositoryBucket = new Bucket(stack, "image-repository", {
    name: `openreadme-image-repository-${stack.stage}3`,
    cdk: {
      bucket: {
        eventBridgeEnabled: true,
        cors: [
          {
            allowedHeaders: ["*"],
            allowedMethods: [HttpMethods.PUT],
            allowedOrigins: ["http://localhost:3000"],
          },
        ],
        blockPublicAccess: {
          blockPublicAcls: true,
          blockPublicPolicy: true,
          ignorePublicAcls: true,
          restrictPublicBuckets: true,
        },
      },
    },
  });

  new cloudfront.Distribution(stack, "image-distribution", {
    enableLogging: true,
    defaultBehavior: {
      origin: new cloudfrontOrigins.S3Origin(imageRepositoryBucket.cdk.bucket),
    },
  });
}

export default ImageStack;
