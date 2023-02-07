import { describe, expect, test } from "vitest";

import appRouter from "../router.js";
import fakeRequest from "../__tests__/__mocks__/request.js";
import fakeResponse from "../__tests__/__mocks__/response.js";
import fakeUser from "../__tests__/__mocks__/user.js";

describe("users", () => {
  describe("me", async () => {
    test("should return UNAUTHORIZED code when user is not authenticated", async () => {
      const caller = appRouter.createCaller({ req: fakeRequest, res: fakeResponse });

      const callPromise = caller.users.me();

      await expect(callPromise).rejects.toStrictEqual(
        expect.objectContaining({ code: "UNAUTHORIZED" })
      );
    });

    test("should return the user within the context when user is authenticated", async () => {
      const caller = appRouter.createCaller({
        user: fakeUser,
        req: fakeRequest,
        res: fakeResponse,
      });

      const user = await caller.users.me();

      expect(user).toStrictEqual(fakeUser);
    });
  });
});
