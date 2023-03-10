import { StackContext, Table } from "sst/constructs";

async function cacheStack({ stack }: StackContext) {
  const cacheTable = new Table(stack, "cache", {
    primaryIndex: { partitionKey: "pk", sortKey: "sk" },
    fields: {
      pk: "string",
      sk: "string",
      gsi1pk: "string",
      gsi1sk: "string",
    },
    globalIndexes: {
      "gsi1pk-gsi1sk-index": {
        partitionKey: "gsi1pk",
        sortKey: "gsi1sk",
        projection: "all",
      },
    },
    timeToLiveAttribute: "ttl",
  });

  return {
    cacheTable,
  };
}

export default cacheStack;
