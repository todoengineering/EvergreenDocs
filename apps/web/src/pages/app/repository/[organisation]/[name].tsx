import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { GetServerSideProps } from "next";

import Layout from "../../../../components/layouts";
import WorkflowTable from "../../../../components/workflow-table";
import Button from "../../../../components/common/button";
import { RouterOutput, getTrpcClient } from "../../../../trpc";

type Props = {
  initialWorkflowLogs: RouterOutput["workflowLog"]["getWorkflowsByRepository"];
  userRepositories: RouterOutput["user"]["getRepositories"];
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { organisation, name } = context.query;

  const trpcClient = getTrpcClient(context.req);
  const workflowLogsPromise = trpcClient.workflowLog.getWorkflowsByRepository.query({
    repositoryFullName: `${organisation}/${name}`,
    includeSkippedWorkflows: true,
    limit: 25,
    page: 1,
  });

  const userRepositoriesPromise = trpcClient.user.getRepositories.query();

  const [workflowLogs, repositories] = await Promise.all([
    workflowLogsPromise,
    userRepositoriesPromise,
  ]);

  return {
    props: {
      initialWorkflowLogs: workflowLogs,
      userRepositories: repositories,
    },
  };
};

function Header() {
  const { t } = useTranslation("common");

  return (
    <div className="z-20 w-full transition-all">
      <div className="mx-5 my-2 flex items-end justify-between gap-10">
        <Button
          variant="clear"
          href="/"
          className="font-display flex items-center text-2xl font-bold"
        >
          <Image src="/images/logo.svg" alt="Evergreen Docs" width={32} height={32} />
          <p className="tracking-wide">EvergreenDocs</p>
        </Button>

        <a href="/logout">{t("logout-button")}</a>
      </div>
    </div>
  );
}

function AppPage({ initialWorkflowLogs, userRepositories }: Props) {
  return (
    <Layout header={<Header />} footer={null}>
      <div className="flex justify-center">
        <div className="flex w-full flex-col">
          <WorkflowTable
            initialWorkflowLogs={initialWorkflowLogs}
            userRepositories={userRepositories}
          />
        </div>
      </div>
    </Layout>
  );
}

export default AppPage;
