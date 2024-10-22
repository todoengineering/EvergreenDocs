import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";
import { parameterStoreService } from "@evergreendocs/services";

import jsonArrayFrom from "./json-array-from.js";
import { DB } from "./generated/db.js";
import config from "./config.js";

const databaseCredentials = await parameterStoreService.getSecretJson({
  stage: config.stage,
  parameter: "rds",
});

const db = new Kysely<DB>({
  dialect: new PlanetScaleDialect({
    url: `mysql://${databaseCredentials.username}:${databaseCredentials.password}@${databaseCredentials.host}/${databaseCredentials.database}`,
  }),
});

export * from "kysely";

export default db;
export { jsonArrayFrom };
