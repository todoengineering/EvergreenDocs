import Image from "next/image";
import { ReactNode } from "react";
import useTranslation from "next-translate/useTranslation";

import useScroll from "../../hooks/use-scroll";
import { RenderIf } from "../common";
import Button from "../common/button";

import Meta from "./meta";

type LayoutProps = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
};

function DefaultHeader() {
  const { t } = useTranslation("common");
  const scrolled = useScroll(50);

  return (
    <div
      className={`fixed top-0 w-full ${
        scrolled ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl" : "bg-white/0"
      } z-20 transition-all`}
    >
      <div className="mx-5 my-2 flex max-w-screen-xl items-end justify-between gap-10 xl:mx-auto">
        <Button
          variant="clear"
          href="/"
          className="font-display flex items-center text-2xl font-bold"
        >
          <Image src="/images/logo.svg" alt="Evergreen Docs" width={32} height={32} />
          <p className="tracking-wide">EvergreenDocs</p>
        </Button>

        <div className="flex-grow font-bold">
          <Button variant="text" href="/pricing" className="text-base">
            {t("pricing.title")}
          </Button>
        </div>

        <div className="flex gap-1">
          <RenderIf condition={false}>
            <Button href="/app">{t("gotoapp-button")}</Button>
          </RenderIf>

          <RenderIf condition={true}>
            <Button href="/login" variant="black">
              {t("login-button")}
            </Button>

            <Button href="/signup">{t("signup-button")}</Button>
          </RenderIf>
        </div>
      </div>
    </div>
  );
}

function DefaultFooter() {
  return (
    <div className=" bottom-0 w-full border-t border-gray-200 bg-white p-5 ">
      <Button href="/privacy-policy" variant="text">
        Privacy Policy
      </Button>
    </div>
  );
}
export default function Layout({ children, header: _header, footer: _footer }: LayoutProps) {
  const header = _header === undefined ? <DefaultHeader /> : _header;
  const footer = _footer === undefined ? <DefaultFooter /> : _footer;

  return (
    <>
      <Meta />

      {header}
      <main>{children}</main>
      {footer}
    </>
  );
}
