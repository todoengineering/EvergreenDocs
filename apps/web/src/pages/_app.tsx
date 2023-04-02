/* eslint-disable import/first */
import "../styles/globals.css";

import type { AppProps } from "next/app";
import cx from "classnames";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { Provider as RWBProvider } from "react-wrap-balancer";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { getCookieConsentValue } from "react-cookie-consent";

import { trpc } from "../trpc";
import CookieConsent from "../components/cookie-consent";

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

    const newDocumentCookies = `accessToken=${accessToken}; path=/; max-age=31536000; SameSite=Lax;`;
    router.replace(router.asPath.split("#")[0]);

    if (!getCookieConsentValue("cookieConsent")) {
      // TODO: Show a message that the user needs to accept cookies to use the app
      console.log("Cookie consent not given, not setting cookie");
      return;
    }

    document.cookie = newDocumentCookies;

    window.location.reload();
  }, [router]);

  return (
    <RWBProvider>
      <div className={cx(sfPro.variable, inter.variable)}>
        <Component {...pageProps} />
        <CookieConsent />
      </div>
    </RWBProvider>
  );
}

export default trpc.withTRPC(MyApp);
