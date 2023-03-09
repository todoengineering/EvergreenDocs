import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

import Github from "../components/icons/github";
import Layout from "../components/layouts/index";

function getGitHubUrl(from: string) {
  const rootURl = "https://github.com/login/oauth/authorize";

  const options = {
    client_id: "Iv1.57a1bcccc340ebe9",
    redirect_uri: "http://localhost:3000/api/login/callback",
    scope: "read:user,user:email",
    state: from,
  };

  const qs = new URLSearchParams(options);

  return `${rootURl}?${qs.toString()}`;
}

function LoginPage() {
  const router = useRouter();

  return (
    <Layout header={null} footer={null}>
      <div className="absolute top-0 flex h-screen w-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 pb-32">
        <div className="flex flex-col items-center gap-10">
          <Link href="/" className="font-display flex items-center text-2xl font-bold">
            <Image src="/images/logo.svg" alt="Evergreen Docs" width={32} height={32} />
            <p>Evergreen Docs</p>
          </Link>

          <div className="flex w-96 flex-col gap-8 rounded-xl bg-white p-10 shadow-2xl">
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-bold">Create your account</h1>
              <p className="text-gray-500">to continue to Evergreen Docs</p>
            </div>
            <a
              className="flex items-center gap-5 rounded-lg border border-gray-200 px-7 py-2 text-sm transition duration-150 hover:bg-gray-100"
              href={getGitHubUrl(router.pathname)}
              role="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
            >
              <Github />
              Continue with GitHub
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default LoginPage;
