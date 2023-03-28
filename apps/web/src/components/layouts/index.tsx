import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import useTranslation from "next-translate/useTranslation";

import useScroll from "../../hooks/use-scroll";
import { RenderIf } from "../common";

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
        <Link href="/" className="font-display flex items-center text-2xl font-bold">
          <Image src="/images/logo.svg" alt="Evergreen Docs" width={32} height={32} />
          <p className="tracking-wide">EvergreenDocs</p>
        </Link>

        <div className="flex-grow font-bold">
          <Link href="/pricing" className="transition-colors hover:text-emerald-800 ">
            {t("pricing.title")}
          </Link>
        </div>

        <div className="flex gap-1">
          <RenderIf condition={false}>
            <Link
              href="/app"
              className="flex max-w-fit items-center justify-center space-x-2 rounded-full bg-emerald-500 px-5 py-2 text-sm text-white shadow-md transition-colors hover:bg-emerald-600"
            >
              {t("gotoapp-button")}
            </Link>
          </RenderIf>

          <RenderIf condition={true}>
            <Link
              href="/login"
              className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white shadow-md transition-colors hover:bg-white hover:text-black"
            >
              {t("login-button")}
            </Link>

            <Link
              href="/signup"
              className="flex max-w-fit items-center justify-center space-x-2 rounded-full bg-emerald-500 px-5 py-2 text-sm text-white shadow-md transition-colors hover:bg-emerald-600"
            >
              {t("signup-button")}
            </Link>
          </RenderIf>
        </div>
      </div>
    </div>
  );
}

function DefaultFooter() {
  return (
    <div className=" bottom-0 w-full border-t border-gray-200 bg-white p-5 ">
      <Link href="/privacy-policy" className="text-grey-500 text-sm hover:underline">
        Privacy Policy
      </Link>
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
