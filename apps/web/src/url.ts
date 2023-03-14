import { IncomingMessage } from "node:http";

const DEFAULT_HOST = "https://www.ever-green.io";

function absoluteUrl(req?: IncomingMessage, localhostAddress = "localhost:3000") {
  let host = (req?.headers ? req.headers.host : window.location.host) || localhostAddress;
  let protocol = isLocalNetwork(host) ? "http:" : "https:";

  if (
    req &&
    req.headers["x-forwarded-host"] &&
    typeof req.headers["x-forwarded-host"] === "string"
  ) {
    host = req.headers["x-forwarded-host"];
  }

  if (
    req &&
    req.headers["x-forwarded-proto"] &&
    typeof req.headers["x-forwarded-proto"] === "string"
  ) {
    protocol = `${req.headers["x-forwarded-proto"]}:`;
  }

  return {
    protocol,
    host,
    origin: protocol + "//" + host,
  };
}

function isLocalNetwork(hostname = window.location.host) {
  return (
    hostname.startsWith("localhost") ||
    hostname.startsWith("127.0.0.1") ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.0.") ||
    hostname.endsWith(".local")
  );
}

function getGithubAuthUrl(_origin: string | null) {
  const origin = typeof window !== "undefined" ? window.location.origin : _origin || DEFAULT_HOST;

  const redirectUri = origin ? `${origin}/app` : `${DEFAULT_HOST}/app`;

  const params = new URLSearchParams({
    client_id: "Iv1.57a1bcccc340ebe9",
    response_type: "token",
    provider: "github",
    redirect_uri: redirectUri,
  });

  const qs = new URLSearchParams(params);

  return `${process.env["NEXT_PUBLIC_EVERGREEN_AUTH_URL"]}/authorize?${qs.toString()}`;
}

export { getGithubAuthUrl, absoluteUrl };
