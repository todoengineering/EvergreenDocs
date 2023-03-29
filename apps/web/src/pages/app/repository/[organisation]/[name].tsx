import Image from "next/image";

import Layout from "../../../../components/layouts";
import WorkflowTable from "../../../../components/workflow-table";
import Button from "../../../../components/common/button";

function Header() {
  return (
    <div className={`z-20 w-full bg-white/0 transition-all`}>
      <div className="mx-5 my-2 flex items-end justify-between gap-10">
        <Button
          variant="clear"
          href="/"
          className="font-display flex items-center text-2xl font-bold"
        >
          <Image src="/images/logo.svg" alt="Evergreen Docs" width={32} height={32} />
          <p className="tracking-wide">EvergreenDocs</p>
        </Button>
      </div>
    </div>
  );
}

function AppPage() {
  return (
    <Layout header={<Header />} footer={null}>
      <div className="absolute top-0 flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />

      <div className="flex justify-center">
        <div className="flex w-full flex-col">
          <WorkflowTable />
        </div>
      </div>
    </Layout>
  );
}

export default AppPage;
