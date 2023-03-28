import { useRouter } from "next/router";
import { useEffect } from "react";

import { trpc } from "../../trpc";

function AppPage() {
  const router = useRouter();
  const { data: userRepositories } = trpc.user.getRepositories.useQuery();

  useEffect(() => {
    if (userRepositories) {
      router.push(`/app/repository/${userRepositories[0].full_name}`);
    }
  }, [userRepositories, router]);

  return <></>;
}

export default AppPage;
