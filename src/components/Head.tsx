import { useRouter } from "next/router";
import { useConfig } from "nextra-theme-docs";

export const Head = () => {
  const { asPath, defaultLocale, locale } = useRouter();
  const { frontMatter } = useConfig();
  const baseUrl = "https://docs.inkonchain.com";
  const url =
    baseUrl + (defaultLocale === locale ? asPath : `/${locale}${asPath}`);
  const title = frontMatter.title || "Ink Docs - The Official Developer Guide for Ink";
  const description =
    frontMatter.description ||
    "Comprehensive documentation for Ink, a cutting-edge Layer 2 (L2) blockchain built on Optimism's Superchain. Learn how to build, integrate, and leverage Ink's DeFi capabilities.";
  const ogImage = frontMatter.image || `${baseUrl}/logo/build-the-future.png`;

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
      <meta property="og:image:width" content="1080" />
      <meta property="og:image:height" content="1080" />
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
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    </>
  );
};
