import { DocsThemeConfig } from "nextra-theme-docs";

import { BannerTyper } from "@/components/BannerTyper";
import { Footer } from "@/components/Footer";
import { Head } from "@/components/Head";
import { NavbarActions } from "@/components/NavbarActions";
import { PageMain } from "@/components/PageMain";
import { PageTitle } from "@/components/PageTitle";
import { Toc } from "@/components/Toc";
import { InkLogo } from "@/icons/InkLogo";
import { URLS } from "@/utils/urls";

const config: DocsThemeConfig = {
  logo: <InkLogo />,
  darkMode: false,
  // ink #7132f5 (light) / ink-light #9e70ff (dark)
  color: {
    hue: 259,
    saturation: { light: 91, dark: 100 },
    lightness: { light: 58, dark: 72 },
  },
  // background token (see src/globals.css)
  backgroundColor: {
    light: "255,255,255",
    dark: "5,5,6",
  },
  docsRepositoryBase: URLS.repositoryUrl,
  head: Head,
  main: PageMain,
  components: {
    h1: PageTitle,
    // Link colours live in globals.css; this only opens external links in a
    // new tab.
    a(props: { href?: string }) {
      const isExternal = props.href?.startsWith("http");
      return (
        <a
          {...props}
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        />
      );
    },
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    autoCollapse: true,
    toggleButton: false,
  },
  navbar: {
    extraContent: NavbarActions,
  },
  footer: {
    component: Footer,
  },
  toc: {
    backToTop: true,
    component: Toc,
  },
  banner: {
    key: "docs-wip",
    content: (
      <a
        className="!text-white hover:!text-white/80"
        href="/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <BannerTyper text="Mainnet is LIVE!" />
      </a>
    ),
  },
};

export default config;
