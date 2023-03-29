import {
  AliasNode,
  ColumnNode,
  IdentifierNode,
  Kysely,
  RawBuilder,
  ReferenceNode,
  SelectQueryBuilder,
  sql,
} from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";

import { DB } from "./generated/db.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jsonArrayFrom<O>(expr: SelectQueryBuilder<any, any, O>): RawBuilder<O[]> {
  const node = expr.toOperationNode();

  const props = node.selections?.flatMap(({ selection: sel }) => {
    if (ReferenceNode.is(sel) && ColumnNode.is(sel.column)) {
      return [sql.literal(sel.column.column.name), sql.id("agg", sel.column.column.name)];
    } else if (ColumnNode.is(sel)) {
      return [sql.literal(sel.column.name), sql.id("agg", sel.column.name)];
    } else if (AliasNode.is(sel) && IdentifierNode.is(sel.alias)) {
      return [sql.literal(sel.alias.name), sql.id("agg", sel.alias.name)];
    } else {
      throw new Error("I was too lazy to handle more cases");
    }
  });

  return sql`(select cast(coalesce(json_arrayagg(json_object(${sql.join(
    props ?? []
  )})), '[]') as JSON) from ${expr} as agg)`;
}

const db = new Kysely<DB>({
  dialect: new PlanetScaleDialect({
    url: "mysql://fqv29tlqcut9b9f165bh:pscale_pw_COSbVGFVzSLHCrYdBFg9M36eWESzfCXTet8ZzJuimlF@aws-eu-west-2.connect.psdb.cloud/evergreen",
  }),
});

export * from "kysely";

export default db;
export { jsonArrayFrom };
