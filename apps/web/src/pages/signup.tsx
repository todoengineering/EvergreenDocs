import { SignUp } from "@clerk/nextjs";

import Layout from "../components/layouts/index";

function SignupPage() {
  return (
    <Layout header={null} footer={null}>
      <div className="absolute top-0 flex h-screen h-max w-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 pb-32">
        <div className="flex flex-col items-center">
          <SignUp
            path="/signup"
            routing="path"
            signInUrl="/login"
            appearance={{
              layout: {
                logoPlacement: "outside",
                logoImageUrl: "/images/logo.svg",
                socialButtonsVariant: "blockButton",
              },
              elements: {
                logoBox:
                  "after:content-['EvergreenDocs'] after:flex after:items-center after:text-2xl font-bold flex justify-center",
              },
            }}
            afterSignInUrl="/app"
            redirectUrl="/app"
          />
        </div>
      </div>
    </Layout>
  );
}

export default SignupPage;
