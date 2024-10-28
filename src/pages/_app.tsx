// These styles apply to every route in the application
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";

import { inter, plus_jakarta_sans } from "../fonts";

import "../globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <div className={`${inter.variable} ${plus_jakarta_sans.variable} font-sans`}>
        <div className="bg-white dark:bg-magic-black">
          <Component {...pageProps} />
        </div>
      </div>
    </ThemeProvider>
  );
}
