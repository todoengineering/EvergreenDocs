import { useRef, useEffect } from "react";

import config from "../../config";

const buildCognitoLoginUrl = () => {
  const params = new URLSearchParams({
    client_id: config.aws.cognito.clientId,
    response_type: "code",
    scope: "aws.cognito.signin.user.admin email openid phone profile",
    redirect_uri: `${window.location.origin}/login/callback${window.location.search}`,
  });

  return `${config.aws.cognito.baseUrl}/login?${params.toString()}`;
};

function Login() {
  const firstRender = useRef(true);

  useEffect(() => {
    if (!firstRender.current) {
      return;
    }

    firstRender.current = false;

    if (typeof window !== "undefined") {
      window.location.replace(buildCognitoLoginUrl());
    }
  }, []);

  return null;
}

export default Login;
