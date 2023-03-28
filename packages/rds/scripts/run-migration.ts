import * as path from "node:path";
import { promises as fs } from "node:fs";
import url from "node:url";

import { Migrator, FileMigrationProvider } from "kysely";

import db from "../src/index.js";

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(path.dirname(url.fileURLToPath(import.meta.url)), "../migrations"),
  }),
});

const { error, results } = await migrator.migrateToLatest();

results?.forEach((it) => {
  if (it.status === "Success") {
    console.log(`migration "${it.migrationName}" was executed successfully`);
  } else if (it.status === "Error") {
    console.error(`failed to execute migration "${it.migrationName}"`);
  }
});

if (error) {
  console.error("failed to migrate");
  console.error(error);
  process.exit(1);
}

await db.destroy();
