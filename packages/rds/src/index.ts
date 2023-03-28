import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";

import { DB } from "./generated/db.js";

const db = new Kysely<DB>({
  dialect: new PlanetScaleDialect({
    url: "mysql://fqv29tlqcut9b9f165bh:pscale_pw_COSbVGFVzSLHCrYdBFg9M36eWESzfCXTet8ZzJuimlF@aws-eu-west-2.connect.psdb.cloud/evergreen",
  }),
});

export default db;
