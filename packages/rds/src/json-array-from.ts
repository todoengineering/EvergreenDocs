import {
  AliasNode,
  ColumnNode,
  IdentifierNode,
  RawBuilder,
  ReferenceNode,
  SelectQueryBuilder,
  sql,
} from "kysely";

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

export default jsonArrayFrom;
