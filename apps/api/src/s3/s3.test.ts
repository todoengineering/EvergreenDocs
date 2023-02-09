import { randomUUID } from "node:crypto";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { describe, expect, test } from "vitest";
import { mockClient } from "aws-sdk-client-mock";

import appRouter from "../router.js";
import fakeRequest from "../__tests__/__mocks__/request.js";
import fakeResponse from "../__tests__/__mocks__/response.js";
import fakeUser from "../__tests__/__mocks__/user.js";

const s3Mock = mockClient(S3Client);

describe("s3", () => {
  describe("createPresignedUrl", async () => {
    test("should return UNAUTHORIZED code when user is not authenticated", async () => {
      const caller = appRouter.createCaller({ req: fakeRequest, res: fakeResponse });

      const callPromise = caller.s3.createPresignedUrl({
        userId: "fake-user-id",
        objectKey: "fake-object-key",
        contentType: "fake-content-type",
      });

      await expect(callPromise).rejects.toStrictEqual(
        expect.objectContaining({ code: "UNAUTHORIZED" })
      );
    });

    test("should return UNAUTHORIZED code when the userId provided doesn't match the authorised user", async () => {
      const caller = appRouter.createCaller({
        user: fakeUser,
        req: fakeRequest,
        res: fakeResponse,
      });

      const callPromise = caller.s3.createPresignedUrl({
        userId: randomUUID(),
        objectKey: "fake-object-key",
        contentType: "fake-content-type",
      });

      await expect(callPromise).rejects.toStrictEqual(
        expect.objectContaining({ code: "UNAUTHORIZED" })
      );
    });

    test("should return the signed url when the userId provided matches the authorised user", async () => {
      s3Mock.on(PutObjectCommand).resolves({});
      const caller = appRouter.createCaller({
        user: fakeUser,
        req: fakeRequest,
        res: fakeResponse,
      });

      const response = await caller.s3.createPresignedUrl({
        userId: fakeUser.id,
        objectKey: "fake-object-key",
        contentType: "fake-content-type",
      });

      expect(response.method).toBe("PUT");
      expect(response.signedImageUrl).toMatch(
        new RegExp(
          `^https:\/\/evergreendocs-image-repository-development.s3.eu-west-1.amazonaws.com\/${fakeUser.id}\/fake-object-key.*&x-id=PutObject.*`
        )
      );
      expect(response.imageKey).toMatch(new RegExp(`^${fakeUser.id}\/fake-object-key$`));
    });
  });
});
