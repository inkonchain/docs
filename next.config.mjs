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
        // ink-token-contracts was a client-side stub redirecting to
        // ink-contracts. Redirect server-side instead (mirrors #644 which
        // does the same for the general/faucet stub).
        source: "/useful-information/ink-token-contracts",
        destination: "/useful-information/ink-contracts",
        permanent: false,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Keep plain .ts out of pageExtensions so Next 15's route-export validation
  // doesn't treat Nextra's _meta.ts files as pages (Nextra discovers them itself).
  pageExtensions: ["tsx"],
  images: {
    unoptimized: true,
  },
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
