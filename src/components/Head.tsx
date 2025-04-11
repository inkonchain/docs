import { useRouter } from "next/router";
import { useConfig } from "nextra-theme-docs";

export const Head = () => {
  const { asPath, defaultLocale, locale } = useRouter();
  const { frontMatter } = useConfig();
  const baseUrl = "https://docs.inkonchain.com/";
  const url =
    baseUrl + (defaultLocale === locale ? asPath : `/${locale}${asPath}`);
  const title = frontMatter.title || "The Official Developer Guide for Ink";
  const description =
    frontMatter.description || "Comprehensive documentation for Ink.";
  const ogImage =
    frontMatter.image ||
    `${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=${encodeURIComponent(frontMatter.type || "default")}`;

  return (
    <>
      {/* Basic Meta Tags */}
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Ink Documentation" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:site" content="@inkonchain" />
      <meta property="twitter:creator" content="@inkonchain" />

      {/* Favicon */}
      <link rel="icon" href="/img/icons/favicon.ico" type="image/x-icon" />
    </>
  );
};
