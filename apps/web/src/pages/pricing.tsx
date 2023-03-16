import useTranslation from "next-translate/useTranslation";
import Balancer from "react-wrap-balancer";
import { IconBrandGithub, IconCircleCheck } from "@tabler/icons";
import Link from "next/link";

import Layout from "../components/layouts/index";

function Index() {
  const { t } = useTranslation("common");

  return (
    <Layout>
      <div className="relative -top-32 flex w-screen flex-col items-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 py-32">
        <div className="flex max-w-4xl flex-col items-center px-5 xl:px-0">
          <h1 className="pt-10 text-center text-4xl font-bold text-black drop-shadow-sm md:text-7xl">
            {t("pricing-link")}
          </h1>

          <p className="my-6 text-center text-gray-500 drop-shadow-sm md:text-xl">
            <Balancer>{t("pricing-description")}</Balancer>
          </p>

          <div className="flex w-3/4 flex-col gap-3 rounded-xl bg-white p-5 shadow-lg">
            <p className="text-xl font-bold">Pro</p>

            <p className="text-3xl">
              $5 <span className="text-xs">/ month</span>
            </p>

            <p className="text-xs text-gray-500">
              Flat price to help every team keep their projects evergreen
            </p>

            <Link
              href="https://github.com/apps/evergreen-docs"
              className=" flex w-full max-w-fit items-center justify-center space-x-2 rounded-full bg-emerald-500 px-5 py-2 text-sm text-white shadow-md transition-colors hover:bg-emerald-600"
            >
              <IconBrandGithub size={20} />
              <p>{t("install-app-button")}</p>
            </Link>

            <ul className="flex flex-col gap-2">
              <li className="inline-flex">
                <IconCircleCheck />
                Unlimited projects
              </li>
              <li className="inline-flex">
                <IconCircleCheck />
                Unlimited users
              </li>
              <li className="inline-flex">
                <IconCircleCheck />
                Unlimited integrations
              </li>
              <li className="inline-flex">
                <IconCircleCheck />
                Unlimited storage
              </li>
              <li className="inline-flex">
                <IconCircleCheck />
                Unlimited support
              </li>
              <li className="inline-flex">
                <IconCircleCheck />
                Unlimited everything
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Index;
