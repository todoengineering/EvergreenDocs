import assert from "node:assert";
import { describe, test } from "node:test";

import { TRPCError } from "@trpc/server";

import appRouter from "../router.js";
import fakeRequest from "../__tests__/__mocks__/request.js";
import fakeResponse from "../__tests__/__mocks__/response.js";
import fakeUser from "../__tests__/__mocks__/user.js";

describe("users", () => {
  describe("me", async () => {
    test("should return UNAUTHORIZED code when user is not authenticated", async () => {
      const caller = appRouter.createCaller({ req: fakeRequest, res: fakeResponse });

      const callPromise = caller.users.me();

      await assert.rejects(callPromise, (err: TRPCError) => {
        assert.strictEqual(err.name, "TRPCError");
        assert.strictEqual(err.message, "User not authenticated");
        assert.strictEqual(err.code, "UNAUTHORIZED");
        return true;
      });
    });

    test("should return the user within the context when user is authenticated", async () => {
      const caller = appRouter.createCaller({
        user: fakeUser,
        req: fakeRequest,
        res: fakeResponse,
      });

      const user = await caller.users.me();

      assert.deepEqual(user, fakeUser);
    });
  });
});
