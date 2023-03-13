import Link from "next/link";
import Image from "next/image";
import { GetServerSideProps, InferGetServerSidePropsType } from "next/types";

import Github from "../components/icons/github";
import Layout from "../components/layouts/index";

const DEFAULT_HOST = "www.ever-green.io";

function getGitHubUrl(host: string | null) {
  const redirectUri = host ? `https://${host}/app` : `http://${DEFAULT_HOST}/app`;

  const params = new URLSearchParams({
    client_id: "Iv1.57a1bcccc340ebe9",
    response_type: "token",
    provider: "github",
    redirect_uri: redirectUri,
  });

  const qs = new URLSearchParams(params);

  return `${process.env["NEXT_PUBLIC_EVERGREEN_AUTH_URL"]}/authorize?${qs.toString()}`;
}

const getServerSideProps: GetServerSideProps<{ host: string | null }> = async ({ req }) => {
  let host = req.headers.host;

  if (
    req &&
    req.headers["x-forwarded-host"] &&
    typeof req.headers["x-forwarded-host"] === "string"
  ) {
    host = req.headers["x-forwarded-host"];
  }

  return {
    props: {
      host: host || null,
    },
  };
};

function LoginPage({ host }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const clientAndServerHost = typeof window !== "undefined" ? window.location.host : host;
  return (
    <Layout header={null} footer={null}>
      <div className="absolute top-0 flex h-screen w-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 pb-32">
        <div className="flex flex-col items-center gap-10">
          <Link href="/" className="font-display flex items-center text-2xl font-bold">
            <Image src="/images/logo.svg" alt="Evergreen Docs" width={32} height={32} />
            <p className="tracking-wide">EvergreenDocs</p>
          </Link>

          <div className="flex w-96 flex-col gap-8 rounded-xl bg-white p-10 shadow-2xl">
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-bold">Create your account</h1>
              <p className="text-gray-500">to continue to Evergreen Docs</p>
            </div>
            <a
              className="flex items-center gap-5 rounded-lg border border-gray-200 px-7 py-2 text-sm transition duration-150 hover:bg-gray-100"
              href={getGitHubUrl(clientAndServerHost)}
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
export { getServerSideProps };
