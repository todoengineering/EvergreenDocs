// TODO: styling of text and fix the bottom

import React from "react";
import useTranslation from "next-translate/useTranslation";

import Layout from "../components/layouts/index";
import RenderIf from "../components/render-if";

function PrivacyPolicyPage() {
  const { t } = useTranslation("common");

  const privacyPolicySections = Object.values(
    t("privacyPolicy.sections", {}, { returnObjects: true })
  ) as {
    title: string;
    description?: string;
    points?: string[];
  }[];

  return (
    <Layout footer={null}>
      <div className="relative -top-32 flex justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 py-32">
        <div className="flex flex-col items-center gap-10">
          <div className="mx-10 my-10 flex max-w-6xl flex-col gap-8 rounded-xl bg-white p-10 shadow-2xl">
            <h1 className="text-2xl font-bold">{t("privacyPolicy.title")}</h1>
            <p>{t("privacyPolicy.description")}</p>
            {privacyPolicySections.map((section) => (
              <div className="flex flex-col gap-1" key={section.title}>
                <h1 className="text-lg font-bold">{section.title}:</h1>

                <RenderIf condition={Boolean(section.description)}>
                  <p>{section.description}</p>
                </RenderIf>

                <RenderIf condition={Boolean(section.points?.length)}>
                  <ol>
                    {section.points?.map((point, index) => (
                      <li key={point}>
                        <p>
                          {index + 1}. {point}
                        </p>
                      </li>
                    ))}
                  </ol>
                </RenderIf>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PrivacyPolicyPage;
