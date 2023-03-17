import Link from "next/link";
import Image from "next/image";

import Layout from "../../components/layouts";
import WorkflowTable from "../../components/workflow-table";

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

function AppPage() {
  return (
    <Layout header={<Header />} footer={null}>
      <div className="absolute top-0 flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 " />

      <div className="flex justify-center">
        <div className="absolute flex w-full max-w-screen-xl flex-col overflow-x-auto px-5 xl:px-0">
          <WorkflowTable />
        </div>
      </div>
    </Layout>
  );
}

export default AppPage;
