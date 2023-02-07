import prismaClient from "../../prisma";
import env from "../../env.js";

async function truncateDb() {
  const schema = env("POSTGRES_SCHEMA_NAME", null);

  if (!schema) {
    throw new Error("POSTGRES_SCHEMA_NAME is required to truncate the database");
  }

  const tableNames = await prismaClient.read.$queryRawUnsafe<
    Array<{ tablename: string }>
    // SQL Injection is not possible here because the schema name is provided by the environment variable
  >(`SELECT tablename FROM pg_tables WHERE schemaname = $1;`, schema);

  for (const { tablename } of tableNames) {
    if (tablename !== "_prisma_migrations") {
      try {
        await prismaClient.write.$executeRawUnsafe(
          // Same as above, SQL Injection is not possible here because the schema name is provided by the environment variable
          `TRUNCATE TABLE "${schema}"."${tablename}" CASCADE;`
        );
      } catch (error) {
        console.log({ error });
      }
    }
  }
}

export { truncateDb };
