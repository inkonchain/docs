import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

// The static deployment for this site has no 404 page: every unknown path
// answers with the 500 page and a 500 status (see the pull request for the
// evidence). Serve a real not-found page by placing one in public/, which is
// merged into the deployment root next to the prerendered pages.
const source = ".next/server/pages/404.html";
const target = "public/404.html";

if (!existsSync(source)) {
  console.warn(`[copy-404] ${source} not found; skipping`);
  process.exit(0);
}

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);
console.log(`[copy-404] ${source} -> ${target}`);
