import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fromIni } from "@aws-sdk/credential-providers";

import config from "../config.js";

const s3ClientConfig: S3ClientConfig = {
  region: "eu-west-1",
};

if (config.aws.profile) {
  s3ClientConfig.credentials = fromIni({ profile: config.aws.profile });
}

const s3Client = new S3Client(s3ClientConfig);

const s3Service = {
  createPresignedUrl: (input: Omit<PutObjectCommandInput, "Bucket">) => {
    return getSignedUrl(
      s3Client,
      new PutObjectCommand({
        Bucket: "evergreendocs-image-repository-development",
        ...input,
      })
    );
  },
  deleteObject: (input: Omit<DeleteObjectCommandInput, "Bucket">) => {
    return s3Client.send(
      new DeleteObjectCommand({
        Bucket: "evergreendocs-image-repository-development",
        ...input,
      })
    );
  },
};

export default s3Service;
