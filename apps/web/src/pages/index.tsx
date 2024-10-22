import Balancer from "react-wrap-balancer";
import cx from "classnames";
import useTranslation from "next-translate/useTranslation";
import { motion } from "framer-motion";

import Layout from "../components/layouts/index";
import Button from "../components/common/button";

const features = [
  {
    title: "Translate",
    description:
      "Our translate preset lets you effortlessly translate any file into any language. Once you specify your language preference, we'll automatically translate your file every time you make changes to your repository. Helping you to reach a global audience with no manual effort required.",
    generates: {
      preset: "translate",
      inputPath: "README.md",
      outputPath: "README.fr.md",
      language: "fr",
    },
    imageSrc: "/images/preset-translate-example-fr.png",
  },
  {
    title: "i18n Translate",
    description:
      "Our i18n translate preset lets you effortlessly translate any file into any language. Once you specify your language preference, we'll automatically translate your file every time you make changes to your repository. Helping you to reach a global audience with no manual effort required.",
    generates: {
      preset: "translate",
      type: "json",
      inputPath: "apps/web/locales/en/common.json",
      outputPath: "apps/web/locales/fr/common.json",
      language: "fr",
    },
    imageSrc: "/images/i18n-translate-example-fr.png",
  },
];

function Section({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <motion.div
      className={cx(className, "relative -top-32 flex justify-center")}
      variants={FADE_IN_VARIANT}
    >
      <div className="max-w-4xl px-5 xl:px-0">{children}</div>
    </motion.div>
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

const FADE_IN_VARIANT = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

function Index() {
  const { t } = useTranslation("common");

  return (
    <Layout>
      <motion.div
        initial="hidden"
        whileInView="show"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <Section className="mt-32 flex justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 py-32">
          <motion.h1
            className=" py-10 text-center text-4xl font-bold text-black drop-shadow-sm md:text-7xl"
            variants={FADE_IN_VARIANT}
          >
            <Balancer>{t("value-proposition")}</Balancer>
          </motion.h1>
          <motion.p
            className="mt-6 text-center text-gray-500 drop-shadow-sm md:text-xl"
            variants={FADE_IN_VARIANT}
          >
            <Balancer>{t("app-description")}</Balancer>
          </motion.p>

          <motion.div
            className="mx-auto mt-6 flex items-center justify-center space-x-5"
            variants={FADE_IN_VARIANT}
          >
            <Button href="/login">
              <p>{t("get-started-button")}</p>
            </Button>
          </motion.div>
        </Section>

        {features.map((feature) => (
          <FeatureSection key={feature.title} feature={feature} />
        ))}
      </motion.div>
    </Layout>
  );
}

export default Index;
