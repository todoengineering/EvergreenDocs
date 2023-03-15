/* eslint-disable import/first */
import "../styles/globals.css";

import type { AppProps } from "next/app";
import cx from "classnames";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { Provider as RWBProvider } from "react-wrap-balancer";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { trpc } from "../trpc";

const sfPro = localFont({
  src: "../styles/SF-Pro-Display-Medium.otf",
  variable: "--font-sf",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

function MyApp({ Component, pageProps: { ...pageProps } }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const hash = router.asPath.split("#")[1];

    if (!hash) {
      return;
    }

    const accessToken = new URLSearchParams(hash).get("access_token");

    if (!accessToken) {
      return;
    }

    document.cookie = `accessToken=${accessToken}; path=/; max-age=31536000; SameSite=Lax;`;
    router.replace(router.asPath.split("#")[0]);
  }, [router]);

  return (
    <RWBProvider>
      <div className={cx(sfPro.variable, inter.variable)}>
        <Component {...pageProps} />
      </div>
    </RWBProvider>
  );
}

export default trpc.withTRPC(MyApp);
