const DEFAULT_HOST = "https://www.ever-green.io";

function getGithubAuthUrl(_origin: string | null) {
  const origin = _origin || DEFAULT_HOST;

  let redirectUri = `${DEFAULT_HOST}/app`;

  if (typeof window !== "undefined") {
    const searchParams = new URLSearchParams(window.location.search);
    redirectUri = searchParams.get("redirect_url") || `${origin}/app`;
  } else if (origin) {
    redirectUri = `${origin}/app`;
  }

  const params = new URLSearchParams({
    client_id: "Iv1.57a1bcccc340ebe9",
    response_type: "token",
    provider: "github",
    redirect_uri: redirectUri,
  });

  const qs = new URLSearchParams(params);

  return `${process.env["NEXT_PUBLIC_EVERGREEN_AUTH_URL"]}/authorize?${qs.toString()}`;
}

export { getGithubAuthUrl };
