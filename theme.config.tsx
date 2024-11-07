import { clsx } from "clsx";
import { useRouter } from "next/router";
import { DocsThemeConfig } from "nextra-theme-docs";

import { Footer } from "@/components/Footer";
import { Head } from "@/components/Head";
import { SidebarTitleComponent } from "@/components/SidebarTitleComponent";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toc } from "@/components/Toc";
import { InkLogo } from "@/icons/InkLogo";
import { URLS } from "@/utils/urls";

const config: DocsThemeConfig = {
  logo: <InkLogo/>,
  darkMode: false,
  project: {
    link: URLS.githubOrgUrl,
  },
  chat: {
    link: "https://discord.gg/inkonchain",
  },
  docsRepositoryBase: URLS.repositoryUrl,
  head: Head,
  components: {
    a(props: { href?: string }) {
      const isExternal = props.href?.startsWith('http');
      return (
        <a
          {...props}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="text-magic-purple underline decoration-1 transition-all hover:text-magic-purple/80 dark:text-magic-soft-pink dark:hover:text-magic-soft-pink/80"
        />
      );
    },
    code(props) {
      return (
        <code
          {...props}
          className={clsx(
            "bg-magic-semi-deep-purple/15 text-magic-purple dark:text-magic-white text-sm rounded-md px-2 py-0.5"
          )}
        />
      );
    },
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    autoCollapse: true,
    titleComponent: SidebarTitleComponent,
  },
  navbar: {
    extraContent: ThemeToggle,
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
    text: (
      <a
        className="!text-white hover:!text-white/80"
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Documentation Status"
      >
        🏗️ Documentation is under active development. Testnet is live!
      </a>
    ),
  },
  useNextSeoProps() {
    const { asPath } = useRouter()
    return {
      titleTemplate: asPath === '/' ? "Ink Docs - The Official Developer Guide for Ink" : '%s | Ink Docs'
    }
  },
};

export default config;
