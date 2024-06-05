// These styles apply to every route in the application
import type { AppProps } from "next/app";

import "../globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
