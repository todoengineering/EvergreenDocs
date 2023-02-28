import Balancer from "react-wrap-balancer";
import cx from "classnames";

const features = [
  {
    title: "Translate",
    description:
      "Our translate preset lets you effortlessly translate any file into any language. Once you specify your language preference, we&apos;ll automatically translate your file every time you make changes to your repository. Helping you to reach a global audience with no manual effort required.",
    generates: {
      preset: "translate",
      inputPath: "README.md",
      outputPath: "README.fr.md",
      language: "fr",
    },
    imageSrc: "/images/preset-translate-example-fr.png",
  },
  {
    title: "Code Comment",
    description:
      "With our code comment preset, you can easily create code comments for your programming language of choice. This powerful tool automatically generates documentation for your code, helping you save time and effort.",
    generates: {
      preset: "code-comment",
      path: "./apps/documentum/src/presets/code-comment.ts",
      type: "class",
      name: "CodeCommentPreset",
    },
    imageSrc: "/images/preset-translate-example-fr.png",
  },
  {
    title: "Code Comment",
    description:
      "With our changelog preset, you can easily create a changelog for your repository. This powerful tool automatically generates a changelog for your repository, helping you save time and effort.",
    generates: {
      preset: "changelog",
    },
    imageSrc: "/images/preset-translate-example-fr.png",
  },
];

function Section({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cx(className, "relative -top-32 flex w-screen justify-center")}>
      <div className="max-w-4xl px-5 xl:px-0">{children}</div>
    </div>
  );
}

const FeatureSection = ({ feature }: { feature: (typeof features)[number] }) => {
  return (
    <Section className="my-10">
      <h2 className="text-center text-5xl font-extrabold text-emerald-500 ">
        <Balancer>{feature.title}</Balancer>
      </h2>
      <p className="text-center text-gray-500 drop-shadow-sm ">
        <Balancer>{feature.description}</Balancer>
      </p>

      <div className="relative">
        <pre className="absolute -left-5 -bottom-5 inline-flex rounded-xl border-4 border-black bg-black/5 p-2 text-xs text-black backdrop-blur-lg">
          {JSON.stringify({ name: "Evergreen Docs", generates: [feature.generates] }, null, 2)}
        </pre>

        <img
          src={feature.imageSrc}
          alt="Example of the image preset translating a README.md file to french"
          className="mt-6 rounded-xl border-4 border-black"
        />
      </div>
    </Section>
  );
};

function Index() {
  return (
    <>
      <Section className="flex w-screen justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 py-32">
        <h1 className=" text-center text-4xl font-bold text-black drop-shadow-sm md:text-7xl">
          <Balancer>Keep your documentation green and fresh</Balancer>
        </h1>
        <p className="mt-6 text-center text-gray-500 drop-shadow-sm md:text-xl">
          <Balancer>
            Effortlessly manage and maintain documentation with Evergreen Docs - the Github App that
            automates updates, generates READMEs, translates docs, and keeps a changelog, all based
            on contextual data from your repository.
          </Balancer>
        </p>

        <div className="mx-auto mt-6 flex items-center justify-center space-x-5">
          <button className="flex max-w-fit items-center justify-center space-x-2 rounded-full bg-emerald-500 px-5 py-2 text-sm text-white shadow-md transition-colors hover:bg-emerald-600">
            <p>Get Started</p>
          </button>
        </div>
      </Section>

      {features.map((feature) => (
        <FeatureSection key={feature.title} feature={feature} />
      ))}
    </>
  );
}

export default Index;
