// TODO: Translation, styling of text and fix the bottom

import React from "react";
// import useTranslation from "next-translate/useTranslation";

import Layout from "../components/layouts/index";

function PrivacyPolicyPage() {
  // const { t } = useTranslation("common");

  return (
    <Layout footer={null}>
      <div className="relative -top-32 flex justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 py-32">
        <div className="flex flex-col items-center gap-10">
          <div className="mx-10 my-10 flex max-w-6xl flex-col gap-8 rounded-xl bg-white p-10 shadow-2xl">
            <h1 className="text-2xl font-bold">Privacy Policy</h1>

            <p>
              Evergreen is committed to protecting the privacy of its users. This Privacy Policy
              explains how we collect, use, and disclose information about our users.
            </p>

            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-bold">How We Use Your Information:</h1>
              <ol>
                <li>
                  <p>
                    1. User information: We collect information such as your name, email address,
                    and Github username when you sign up for our service.
                  </p>
                </li>
                <li>
                  <p>
                    2. Repository information: We collect repository information from your Github
                    account in order to provide our service. This includes repository names,
                    descriptions, and other metadata. We don’t store any of your code or any other
                    intellectual property.
                  </p>
                </li>
                <li>
                  <p>
                    3. Usage data: We collect usage data such as how often you use our service, and
                    what features you use the most. We use this information to improve our service.
                  </p>
                </li>
              </ol>
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-bold">Information We Collect:</h1>
              <p>
                We use your information to provide and improve our service, and to communicate with
                you. Specifically, we use your information to:
              </p>
              <ol>
                <li>
                  <p>
                    1. Create pull requests on your repositories to keep documentation up to date
                    and perform other maintenance using AI.
                  </p>
                </li>
                <li>
                  <p>2. Send you notifications about changes to your repositories.</p>
                </li>
                <li>
                  <p>3. Analyse how you use our service to improve it.</p>
                </li>
                <li>
                  <p>4. Communicate with you about our service and any updates.</p>
                </li>
                <li>
                  <p>5. Respond to any support requests or inquiries.</p>
                </li>
              </ol>
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-bold">Data Security:</h1>
              <p className="text-gray-500">
                We take data security very seriously, and we take steps to protect your information.
                We use industry-standard encryption to protect your information in transit, and we
                store your information in secure data centers with access controls and monitoring in
                place.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-bold">Sharing Your Information:</h1>
              <p className="text-gray-500">
                We do not share your personal information with any third parties, except as required
                by law or as necessary to provide our service.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-bold">Changes to this Policy:</h1>
              <p className="text-gray-500">
                We may update this privacy policy from time to time. If we make any material
                changes, we will notify you by email or by posting a notice on our website.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-lg font-bold">Contact Us:</h1>
              <p className="text-gray-500">
                If you have any questions about our privacy policy or how we collect and use your
                information, please contact us at{" "}
                <a href="mailto:support@ever-green.io" className="text-blue-400 hover:underline">
                  support@ever-green.io
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PrivacyPolicyPage;
