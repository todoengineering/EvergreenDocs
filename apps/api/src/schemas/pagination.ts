import { ZodTypeAny, z } from "zod";

const PaginationResult = <T extends ZodTypeAny>(items: T) =>
  z.object({
    items,
    nextCursor: z.string().nullish(),
  });

const PaginationQuery = z.object({
  limit: z.number().min(1).max(100),
  cursor: z.string().nullish(),
});

export { PaginationResult, PaginationQuery };
