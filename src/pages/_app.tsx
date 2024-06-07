// These styles apply to every route in the application
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";

import "../globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <div className="bg-magic-white dark:bg-magic-black">
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}
