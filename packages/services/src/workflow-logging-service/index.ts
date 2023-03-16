import { Service } from "electrodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import config from "./config.js";
import { workflow, task } from "./entities/index.js";
import type { Types } from "./types.js";

const ddbClient = new DynamoDBClient({ region: "eu-west-1" });

const workflowLoggingService = new Service(
  { workflow, task },
  { table: config.tableName, client: ddbClient }
);

export default workflowLoggingService;
export type { Types as WorkflowLoggingServiceTypes };
