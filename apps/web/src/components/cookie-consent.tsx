// TODO: Get rid of react-cookie-consent library and use our own implementation
import Link from "next/link";
import ReactCookieConsent from "react-cookie-consent";

function CookieConsent() {
  return (
    <ReactCookieConsent
      disableStyles
      buttonText="Accept 🍪"
      cookieName="cookieConsent"
      containerClasses="bottom-0 items-center bg-gray-800 text-white flex-wrap justify-between flex left-0 fixed w-full z-999 px-5 flex-col md:flex-row"
      contentClasses="flex-1 my-6 lg:mx-44"
      buttonClasses="space-x-2 rounded-full bg-emerald-500 px-5 py-2 text-white transition-colors hover:bg-emerald-600 width-full md:width-auto"
    >
      To improve your experience, this website utilizes cookies which will be stored on your device.
      {/* TODO: Link to privacy policy here */}
      By using this website, you consent to the use of cookies. View our{" "}
      <Link href="/privacy-policy" className="text-blue-400 hover:underline">
        Privacy Policy.
      </Link>
    </ReactCookieConsent>
  );
}

export default CookieConsent;
