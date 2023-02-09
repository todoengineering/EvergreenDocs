import { PrismaClient, Prisma } from "@prisma/client";

import env from "./env.js";

async function getDatabaseUrls() {
  const username: string | undefined = "postgres";
  const password: string | undefined = "postgres";
  const writeHost = env("POSTGRES_WRITE_HOST", "localhost");
  const readHost = env("POSTGRES_READ_HOST", "localhost");
  const port = env("POSTGRES_PORT", "5432");
  const database = env("POSTGRES_DATABASE_NAME", "evergreendocs");
  const schema = env("POSTGRES_SCHEMA_NAME", "public");

  return {
    writeUrl: `postgresql://${username}:${password}@${writeHost}:${port}/${database}?schema=${schema}`,
    readUrl: `postgresql://${username}:${password}@${readHost}:${port}/${database}?schema=${schema}`,
  };
}

const { writeUrl, readUrl } = await getDatabaseUrls();

const prismaWriter = new PrismaClient({
  datasources: {
    db: {
      url: writeUrl,
    },
  },
});

const prismaReader = new PrismaClient({
  datasources: {
    db: {
      url: readUrl,
    },
  },
});

const prismaClient = {
  write: prismaWriter,
  read: prismaReader,
};

export default prismaClient;
export { Prisma };
