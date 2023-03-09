import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

import Layout from "../../components/layouts";
import { trpc } from "../../trpc";

function Header() {
  return (
    <div className={`fixed top-0 z-20 w-full bg-white/0 transition-all`}>
      <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
        <Link href="/app" className="font-display flex items-center text-2xl font-bold">
          <Image src="/images/logo.svg" alt="Evergreen Docs" width={32} height={32} />
          <p>Evergreen Docs</p>
        </Link>

        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}

type TableConfig = {
  name: string;
  getter?: (item: (typeof data)[0]) => React.ReactNode;
};

const tableConfig = [
  {
    name: "0 Workflow Runs",
    getter: (item: (typeof data)[0]) => item.name,
  },
  {
    name: "Status",
    getter: (item: (typeof data)[0]) => item.status,
  },
  {
    name: "Actions",
    getter: (item: (typeof data)[0]) => item.actions,
  },
] satisfies TableConfig[];

const data = [
  {
    name: 'Apple MacBook Pro 17"',
    status: "running",
    actions: "2",
  },
  {
    name: 'Apple MacBook Pro 17"',
    status: "running",
    actions: "2",
  },
  {
    name: 'Apple MacBook Pro 17"',
    status: "running",
    actions: "2",
  },
  {
    name: 'Apple MacBook Pro 17"',
    status: "failed",
    actions: "2",
  },
  {
    name: 'Apple MacBook Pro 17"',
    status: "cancelled",
    actions: "2",
  },
  {
    name: 'Apple MacBook Pro 17"',
    status: "success",
    actions: "2",
  },
  {
    name: 'Apple MacBook Pro 17"',
    status: "success",
    actions: "2",
  },
];

function AppPage() {
  const { data: workflowLogs } = trpc.workflowLog.getLoggedInUserWorkflowLogs.useQuery({});

  console.log(workflowLogs);
  return (
    <Layout header={<Header />} footer={null}>
      <div className="absolute top-0 flex h-screen h-max w-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 pb-32">
        <div className="flex flex-col items-center">
          <div className="overflow-x-auto rounded shadow-md">
            <table className="text-left text-sm text-white ">
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
                {data.map((item) => (
                  <tr className="border-b bg-white text-black " key={item.name}>
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
      </div>
    </Layout>
  );
}

export default AppPage;
