import nextra from "nextra";
import path from "path";
import remarkCodeImport from "remark-code-import";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  defaultShowCopyCode: true,
  mdxOptions: {
    remarkPlugins: [remarkCodeImport],
  },
});

const config = withNextra({
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
