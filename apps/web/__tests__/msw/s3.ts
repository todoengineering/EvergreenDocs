import { rest } from "msw";
import { faker } from "@faker-js/faker";

const signedImageUrl = faker.internet.url();

const createPresignedUrlHandler = rest.get(
  `http://localhost:4000/s3.createPresignedUrl`,
  (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          result: {
            data: {
              signedImageUrl,
              method: "PUT",
              imageUrl: signedImageUrl,
            },
          },
        },
      ])
    );
  }
);

const executePresignedUrlHandler = rest.put(signedImageUrl, (_req, res, ctx) => {
  return res(ctx.status(200));
});

const s3Handlers = [createPresignedUrlHandler, executePresignedUrlHandler];

export default s3Handlers;
