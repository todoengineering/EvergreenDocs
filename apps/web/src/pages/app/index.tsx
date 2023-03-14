import Link from "next/link";
import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { IconCalendarStats, IconClockHour3 } from "@tabler/icons";

import Layout from "../../components/layouts";
import { RouterOutput, trpc } from "../../trpc";

dayjs.extend(relativeTime);

function Header() {
  return (
    <div className="fixed top-0 z-20 w-full">
      <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
        <Link href="/app" className="font-display flex items-center text-2xl font-bold">
          <Image src="/images/logo.svg" alt="Evergreen Docs" width={32} height={32} />
          <p className="tracking-wide">EvergreenDocs</p>
        </Link>
      </div>
    </div>
  );
}

type TableConfig = {
  name: string;
  getter?: (
    item: RouterOutput["workflowLog"]["getLoggedInUserWorkflowLogs"]["items"][number]
  ) => React.ReactNode;
};

// Not too sure about all this
const tableConfig = [
  {
    // TODO: Change this to count workflow runs similar to github
    name: "Project",
    getter: (item: RouterOutput["workflowLog"]["getLoggedInUserWorkflowLogs"]["items"][number]) => (
      <a
        href={`https://www.github.com/${item.repositoryFullName}`}
        target="_blank"
        rel="noreferrer"
        className="font-bold hover:text-blue-500 hover:underline"
      >
        {item.repositoryFullName}
      </a>
    ),
  },
  {
    name: "Commit",
    getter: (item: RouterOutput["workflowLog"]["getLoggedInUserWorkflowLogs"]["items"][number]) => (
      <>
        <p className="">{item.headCommitMessage}</p>
        <a
          href={`https://www.github.com/${item.repositoryFullName}/commit/${item.headCommit}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-gray-500 hover:text-blue-500 hover:underline"
        >
          {item.headCommit}
        </a>
      </>
    ),
  },
  {
    name: "Status",
    getter: (item: RouterOutput["workflowLog"]["getLoggedInUserWorkflowLogs"]["items"][number]) => {
      const statusClassMap: Record<typeof item.status, string> = {
        success: "bg-green-500 border-green-500",
        failed: "bg-red-500 border-red-500",
        cancelled: "border-2 border-gray-500",
        in_progress: "bg-yellow-500 border-blue-500",
        skipped: "border-2 border-gray-500",
      };

      return (
        <div className="flex flex-row items-center gap-3">
          <div className={`h-3 w-3 rounded-full ${statusClassMap[item.status]}`}></div>
          <div className="flex flex-col">
            <p className="inline-flex items-center gap-1">
              <IconCalendarStats size={15} />
              {dayjs().to(item.startedAt)}
            </p>
            <p className="inline-flex items-center gap-1">
              <IconClockHour3 size={15} />
              {dayjs(item.completedAt).to(item.startedAt, true)}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    name: "Actions",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getter: (item: RouterOutput["workflowLog"]["getLoggedInUserWorkflowLogs"]["items"][number]) => (
      <>{item.tasks.length} action</>
    ),
  },
] satisfies TableConfig[];

function AppPage() {
  const { data: workflowLogs } = trpc.workflowLog.getLoggedInUserWorkflowLogs.useQuery({});

  return (
    <Layout header={<Header />} footer={null}>
      <div className="absolute top-0 flex h-screen h-max w-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 " />

      <div className="flex w-screen justify-center">
        <div className="absolute flex w-full max-w-screen-xl flex-col overflow-x-auto px-5 xl:px-0">
          <table className="border-collapse overflow-hidden rounded text-left text-sm shadow-md">
            <thead className=" bg-gray-200 text-xs uppercase text-black">
              <tr>
                {tableConfig.map((config) => (
                  <th scope="col" className="px-6 py-3" key={config.name}>
                    {config.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {workflowLogs?.items.map((item) => (
                <tr className="border-b bg-white text-black " key={item.headCommit}>
                  {tableConfig.map((config) => (
                    <td className="px-6 py-4" key={config.name}>
                      {config.getter ? config.getter(item) : "unknown"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default AppPage;
