import { useRouter } from "next/router";
import { useConfig } from "nextra-theme-docs";

export const Head = () => {
  const { asPath, defaultLocale, locale } = useRouter();
  const { frontMatter } = useConfig();
  const url =
    "https://docs.Ink.io" +
    (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

  return (
    <>
      <meta property="og:url" content={url} />
      <meta property="og:title" content={frontMatter.title || "Ink Docs"} />
      <meta
        property="og:description"
        content={frontMatter.description || "Ink Docs for developers"}
      />
      <link rel="icon" href="/img/icons/favicon.ico" type="image/x-icon" />
    </>
  );
};
