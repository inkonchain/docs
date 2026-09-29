import { useEffect } from "react";
import type { AppProps } from "next/app";
import Script from "next/script";
import { ThemeProvider } from "next-themes";

import { CopyToast } from "../components/CopyToast";
import { applyTune, readStoredTune } from "../components/InkHero/tune";
import { ScrollState } from "../components/ScrollState";
import { SearchBar } from "../components/SearchBar";
import { SidebarIndicator } from "../components/SidebarIndicator";
import { departureMono, satoshi } from "../fonts";

import "../globals.css";

export default function App({ Component, pageProps }: AppProps) {
  // Portaled UI (search results, dropdowns) renders outside the wrapper div
  // below, so expose the font variables on <html> as well.
  useEffect(() => {
    document.documentElement.classList.add(
      satoshi.variable,
      departureMono.variable
    );
    // Corner roundness picked with the home page's ink tuner
    applyTune(readStoredTune());
  }, []);

  return (
    <ThemeProvider attribute="class">
      <ScrollState />
      <SidebarIndicator />
      <Script
        id="schema-markup"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Ink Documentation",
            description:
              "Comprehensive documentation for Ink, a Layer 2 (L2) blockchain built on Optimism's Superchain",
            url: "https://docs.inkonchain.com",
            publisher: {
              "@type": "Organization",
              name: "Ink",
              url: "https://inkonchain.com",
              sameAs: [
                "https://x.com/inkonchain",
                "https://github.com/inkonchain",
                "https://t.me/inkonchain",
              ],
            },
          }),
        }}
      />
      <div
        className={`${satoshi.variable} ${departureMono.variable} font-sans`}
      >
        <div className="bg-background">
          <Component {...pageProps} />
          <CopyToast />
          <SearchBar />
        </div>
      </div>
    </ThemeProvider>
  );
}
