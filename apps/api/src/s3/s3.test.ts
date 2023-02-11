import { randomUUID } from "node:crypto";
import assert from "node:assert";
import { describe, test } from "node:test";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import { TRPCError } from "@trpc/server";

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

      await assert.rejects(callPromise, (err: TRPCError) => {
        assert.strictEqual(err.name, "TRPCError");
        assert.strictEqual(err.message, "User not authorized to create presigned url");
        assert.strictEqual(err.code, "UNAUTHORIZED");
        return true;
      });
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

      await assert.rejects(callPromise, (err: TRPCError) => {
        assert.strictEqual(err.name, "TRPCError");
        assert.strictEqual(
          err.message,
          "User not authorized to create presigned url for this user"
        );
        assert.strictEqual(err.code, "UNAUTHORIZED");
        return true;
      });
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

      assert.equal(response.method, "PUT");
      assert.match(
        response.signedImageUrl,
        new RegExp(
          `^https:\/\/evergreendocs-image-repository-development.s3.eu-west-1.amazonaws.com\/${fakeUser.id}\/fake-object-key.*&x-id=PutObject.*`
        )
      );
      assert.match(response.imageKey, new RegExp(`^${fakeUser.id}\/fake-object-key$`));
    });
  });
});
