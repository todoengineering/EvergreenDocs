import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { publicProcedure, router } from "../trpc.js";

import s3Service from "./s3.service.js";

const s3Router = router({
  createPresignedUrl: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        objectKey: z.string(),
        contentType: z.string(),
      })
    )
    .output(
      z.object({
        signedImageUrl: z.string(),
        method: z.literal("PUT"),
        imageKey: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { userId, objectKey, contentType } = input;

      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authorized to create presigned url",
        });
      }

      if (userId !== ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authorized to create presigned url for this user",
        });
      }

      const key = `${userId}/${objectKey}`;

      const signedImageUrl = await s3Service.createPresignedUrl({
        Key: key,
        ContentType: contentType,
      });

      return {
        method: "PUT" as const,
        signedImageUrl: signedImageUrl,
        // Remove the leading slash from the signedImageUrl
        imageKey: new URL(signedImageUrl).pathname.slice(1),
      };
    }),
});

export default s3Router;
