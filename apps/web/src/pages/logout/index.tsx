import { useRef, useEffect } from "react";

import config from "../../config";

const buildCognitoLogoutUrl = () => {
  const params = new URLSearchParams({
    client_id: config.aws.cognito.clientId,
    response_type: "code",
    scope: "aws.cognito.signin.user.admin email openid phone profile",
    logout_uri: `${window.location.origin}/logout/callback${window.location.search}`,
  });

  return `${config.aws.cognito.baseUrl}/logout?${params.toString()}`;
};

function Logout() {
  const firstRender = useRef(true);

  useEffect(() => {
    if (!firstRender.current) {
      return;
    }

    firstRender.current = false;

    if (typeof window !== "undefined") {
      window.location.replace(buildCognitoLogoutUrl());
    }
  }, []);

  return null;
}

export default Logout;
