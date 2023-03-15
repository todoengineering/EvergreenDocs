import Link from "next/link";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";

import Github from "../components/icons/github";
import Layout from "../components/layouts/index";
import { getGithubAuthUrl } from "../url";

function LoginPage() {
  // TODO: Can this be passed in as a prop?
  const [githubUrl, setGithubUrl] = useState("");
  const { t } = useTranslation("common");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGithubUrl(getGithubAuthUrl(window.location.origin));
    }
  }, []);

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
              <h1 className="text-lg font-bold">{t("auth.create.account1")}</h1>
              <p className="text-gray-500">{t("auth.create.account2")} Evergreen Docs</p>
            </div>
            <a
              className="flex items-center gap-5 rounded-lg border border-gray-200 px-7 py-2 text-sm transition duration-150 hover:bg-gray-100"
              href={githubUrl}
              role="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
            >
              <Github />
              {t("auth.continue-with-github")}
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default LoginPage;
