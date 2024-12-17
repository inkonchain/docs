// Solves the following error: "Cannot find module ... or its corresponding type declarations. There are types at ..., but this result could not be resolved under your current 'moduleResolution' setting. Consider updating to 'node16', 'nodenext', or 'bundler'. [2307]"
declare module "@cookbookdev/docsbot/react" {
  export { default } from "@cookbookdev/docsbot/dist/react/index.d.ts";
}
