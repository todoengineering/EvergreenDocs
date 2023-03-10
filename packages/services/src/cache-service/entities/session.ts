import { Entity } from "electrodb";

import config from "../config.js";
import ddbClient from "../ddb-client.js";

const session = new Entity(
  {
    model: {
      entity: "session",
      version: "1",
      service: "cacheService",
    },
    attributes: {
      externalId: {
        type: "string",
        required: true,
      },
      provider: {
        type: "string",
        required: true,
      },
      accessToken: {
        type: "string",
        required: true,
      },
      accessTokenExpiresAt: {
        type: "string",
        required: true,
      },
      refreshToken: {
        type: "string",
      },
      // When the refresh token expires
      ttl: {
        type: "number",
      },
    },
    indexes: {
      session: {
        pk: {
          field: "pk",
          composite: ["externalId", "provider"],
        },
        sk: {
          field: "sk",
          composite: [],
        },
      },
    },
  },
  { table: config.tableName, client: ddbClient }
);

export default session;
