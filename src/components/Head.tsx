import { useRouter } from "next/router";
import { useConfig } from "nextra-theme-docs";

export const Head = () => {
  const { asPath, defaultLocale, locale } = useRouter();
  const { frontMatter, title: pageTitle } = useConfig();
  const baseUrl = "https://docs.inkonchain.com";
  // Drop the query string and normalise a trailing slash so og:url and the
  // canonical link both point at the single canonical form of this page.
  const path = (defaultLocale === locale ? asPath : `/${locale}${asPath}`)
    .split(/[?#]/)[0]
    .replace(/\/+$/, "");
  const url = baseUrl + path;
  const documentTitle =
    path === ""
      ? "Ink Docs - The Official Developer Guide for Ink"
      : `${pageTitle} | Ink Docs`;
  // og:title / meta title should mirror <title>: the page's own title, not
  // the site-wide default (front matter rarely sets `title`).
  const title = frontMatter.title || documentTitle;
  const description =
    frontMatter.description ||
    "Comprehensive documentation for Ink, a cutting-edge Layer 2 (L2) blockchain built on Optimism's Superchain. Learn how to build, integrate, and leverage Ink's DeFi capabilities.";
  const ogImage = frontMatter.image || `${baseUrl}/images/og-docs.jpg`;

  return (
    <>
      <title>{documentTitle}</title>

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
      <meta property="og:image:alt" content="Ink Docs" />
      <meta property="og:site_name" content="Ink Documentation" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:site" content="@inkonchain" />
      <meta property="twitter:creator" content="@inkonchain" />

      {/* Canonical URL — trailing-slash and query variants of a page resolve
          here instead of competing as duplicate content. */}
      <link rel="canonical" href={url} />

      {/* Favicon */}
      <link
        rel="icon"
        href="/img/icons/favicon.ico"
        sizes="256x256"
        type="image/x-icon"
      />
      <link rel="icon" href="/img/icons/ink-icon.svg" type="image/svg+xml" />
    </>
  );
};
