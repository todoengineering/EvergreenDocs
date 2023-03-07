import { SignIn } from "@clerk/nextjs";

import Layout from "../components/layouts/index";

function LoginPage() {
  return (
    <Layout header={null} footer={null}>
      <div className="absolute top-0 flex h-screen w-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 pb-32">
        <div className="flex flex-col items-center">
          <SignIn
            path="/login"
            routing="path"
            signUpUrl="/signup"
            appearance={{
              layout: {
                logoPlacement: "outside",
                logoImageUrl: "/images/logo.svg",
                socialButtonsVariant: "blockButton",
              },
              elements: {
                logoBox:
                  "after:content-['EvergreenDocs'] after:flex after:items-center after:text-2xl after:font-bold flex justify-center",
              },
            }}
            redirectUrl="/app"
          />
        </div>
      </div>
    </Layout>
  );
}

export default LoginPage;
