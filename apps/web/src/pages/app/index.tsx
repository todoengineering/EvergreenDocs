import { GetServerSideProps } from "next";

import { getTrpcClient } from "../../trpc";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const trpcClient = getTrpcClient(context.req);

  const repositories = await trpcClient.user.getRepositories.query();

  return {
    redirect: {
      destination: `/app/repository/${repositories[0].full_name}`,
      permanent: false,
    },
  };
};

function AppPage() {
  return <>You got no repos bro</>;
}

export default AppPage;
