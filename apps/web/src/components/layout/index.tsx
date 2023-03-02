// import Image from "next/image";
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

import useScroll from "../../hooks/use-scroll";
import Github from "../icons/github";

import Meta from "./meta";

type LayoutProps = {
  meta?: {
    title?: string;

    description?: string;
    image?: string;
  };
  children: ReactNode;
};

export default function Layout({ meta, children }: LayoutProps) {
  const scrolled = useScroll(50);

  return (
    <>
      <Meta {...meta} />

      <div
        className={`fixed top-0 w-full ${
          scrolled ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl" : "bg-white/0"
        } z-20 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <Link href="/" className="font-display flex items-center text-2xl font-bold">
            <Image src="/images/logo.svg" alt="Evergreen Docs" width={32} height={32} />
            <p>Evergreen Docs</p>
          </Link>
          <div className="flex gap-1">
            <a
              className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
              href="https://github.com/apps/evergreen-docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github />
              <p>Install App</p>
            </a>
            <div className="flex items-center justify-center space-x-5">
              <button className="flex max-w-fit items-center justify-center space-x-2 rounded-full bg-emerald-500 px-5 py-2 text-sm text-white shadow-md transition-colors hover:bg-emerald-600">
                <p>Get Started</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="w-screen py-32">{children}</main>
      <div className=" relative bottom-0 w-full border-t border-gray-200 bg-white py-5 text-center">
        <p className="text-gray-500">Some stuff in here</p>
      </div>
    </>
  );
}
