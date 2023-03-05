import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

import Layout from "../../components/layouts";

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

function AppPage() {
  return (
    <Layout header={<Header />} footer={null}>
      <div className="absolute top-0 flex h-screen h-max w-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 pb-32">
        <div className="flex flex-col items-center">Some stuff is gonna go in here</div>
      </div>
    </Layout>
  );
}

export default AppPage;
