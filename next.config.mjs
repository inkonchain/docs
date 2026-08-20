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

// SECURITY FIX: The vulnerable `ignoreDuringBuilds: true` bypass has been removed 
// from the ESLint configuration, ensuring production builds enforce repository linting rules.
const config = withNextra({
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