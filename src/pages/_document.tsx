import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    // suppressHydrationWarning: the theme sets its own attributes on <html>
    // on the client, so React would otherwise warn about the mismatch.
    <Html lang="en" suppressHydrationWarning>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
