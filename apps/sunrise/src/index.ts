import crypto from "node:crypto";

import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";

import config from "./config.js";

const eventBridgeClient = new EventBridgeClient({
  region: "eu-west-1",
});

function getJsonPayload(event: APIGatewayProxyEventV2) {
  const contentType = event.headers?.["content-type"];
  if (contentType !== "application/json") {
    throw new Error(`Unsupported content-type: ${contentType}`);
  }

  if (!event.body) {
    throw new Error("Missing payload");
  }

  const payload = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf-8")
    : event.body;

  try {
    JSON.parse(payload);
  } catch (err) {
    throw new Error(`Invalid JSON payload: ${payload}`);
  }

  return payload;
}

function containsValidSignature(event: APIGatewayProxyEventV2): boolean {
  const signatureString = event.headers["x-hub-signature-256"] || event.headers["x-hub-signature"];

  if (!signatureString || !event.body) {
    return false;
  }

  const [algorithm] = signatureString.split("=");
  const signature = Buffer.from(signatureString, "utf8");
  const hmac = crypto.createHmac(algorithm, config.github.webhookSecret);
  const digest = Buffer.from(`${algorithm}=${hmac.update(event.body).digest("hex")}`, "utf8");

  return signature.length === digest.length && crypto.timingSafeEqual(digest, signature);
}

const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const jsonPayload = getJsonPayload(event);

    console.info("Received request", event, jsonPayload);

    const headers = event.headers;

    const detailType = headers["x-github-event"] || "github-webhook-lambda";

    if (!containsValidSignature(event)) {
      console.error("401 Unauthorized - Invalid Signature", headers);

      return { statusCode: 401, body: "Invalid Signature" };
    }

    console.log({
      Entries: [
        {
          EventBusName: "default",
          Source: "github.com",
          DetailType: detailType,
          Detail: jsonPayload,
        },
      ],
    });

    const response = await eventBridgeClient.send(
      new PutEventsCommand({
        Entries: [
          {
            EventBusName: "default",
            Source: "github.com",
            DetailType: detailType,
            Detail: jsonPayload,
          },
        ],
      })
    );

    if (response.FailedEntryCount && response.FailedEntryCount > 0) {
      console.error(
        "500 FailedEntry Error - The event was not successfully forwarded to Amazon EventBridge",
        response.Entries?.[0],
        headers
      );
      return {
        statusCode: 500,
        body: "FailedEntry Error - The entry could not be successfully forwarded to Amazon EventBridge",
      };
    }

    return { statusCode: 202, body: "Message forwarded to Amazon EventBridge" };
  } catch (err) {
    console.error(`500 Internal Server Error\nUnexpected error: ${err}, ${typeof err}`);

    return { statusCode: 500, body: "Internal Server Error" };
  }
};

export { handler };
