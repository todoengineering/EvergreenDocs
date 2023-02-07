import { useRouter } from "next/router";
import { useMemo } from "react";

import { trpc } from "../../trpc";

function LoginCallback() {
  const router = useRouter();

  let code: string | null = null;

  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    code = urlParams.get("code") as string;
  }

  const { isSuccess } = trpc.auth.login.useQuery(
    useMemo(
      () => ({
        code: code as string,
      }),
      [code]
    ),
    { enabled: Boolean(code) }
  );

  if (isSuccess) {
    router.push("/");
  }

  return null;
}

export default LoginCallback;
