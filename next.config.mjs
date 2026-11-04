import nextra from "nextra";
import path from "path";
import remarkCodeImport from "remark-code-import";
import { fileURLToPath } from "url";

import {
  inkShikiLightTheme,
  inkShikiTheme,
} from "./src/utils/shiki-ink-theme.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  defaultShowCopyCode: true,
  mdxOptions: {
    remarkPlugins: [remarkCodeImport],
    rehypePrettyCodeOptions: {
      theme: { light: inkShikiLightTheme, dark: inkShikiTheme },
    },
  },
});

const config = withNextra({
  async redirects() {
    return [
      {
        // Kraken Verify is no longer available. Temporary redirect so the
        // published URL keeps resolving instead of 404ing.
        source: "/build/verify",
        destination: "/",
        permanent: false,
      },
      {
        // /status was a client-side stub that opened the status page via
        // window.open (blocked by popup blockers) and then navigated back.
        // Redirect server-side instead; the sidebar already links out via
        // _meta, so the stub page is removed.
        source: "/status",
        destination: "https://status.inkonchain.com/",
        permanent: false,
      },
    ];
  },
  // Keep plain .ts out of pageExtensions so Next's route-export validation
  // doesn't treat Nextra's _meta.ts files as pages (Nextra discovers them itself).
  pageExtensions: ["tsx"],
  images: {
    unoptimized: true,
  },
  // Don't let `next dev` generate AGENTS.md: remark lints every markdown
  // file in the repo as MDX and chokes on the HTML comments it contains.
  agentRules: false,
  // Nextra 3 is webpack-only (its page-map and search index are webpack
  // plugins), so `dev`/`build` opt out of Next 16's default Turbopack with
  // `--webpack`. Without the flag Next 16 refuses to build when a webpack
  // config is present.
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.join(__dirname, "src"),
    };
    return config;
  },
  experimental: {
    mdxRs: true,
  },
});

export default config;
