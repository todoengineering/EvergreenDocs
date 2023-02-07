import { useRouter } from "next/router";

import { trpc } from "../../trpc";

function LogoutCallback() {
  const router = useRouter();

  const { isSuccess } = trpc.auth.logout.useQuery();

  if (isSuccess) {
    router.push("/");
  }

  return null;
}

export default LogoutCallback;
