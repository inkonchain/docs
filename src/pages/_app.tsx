// These styles apply to every route in the application
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";

import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <div className={`${inter.variable} font-sans`}>
        <div className="bg-white dark:bg-magic-black">
          <Component {...pageProps} />
        </div>
      </div>
    </ThemeProvider>
  );
}
