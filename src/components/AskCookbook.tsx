import React from "react";
import BaseAskCookbook from "@cookbookdev/docsbot/react";

/** It's going to be exposed in HTTP requests anyway so it's fine to just hardcode it here */
const COOKBOOK_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_COOKBOOK_API_KEY;
export const AskCookbook = () => {
  return <BaseAskCookbook apiKey={COOKBOOK_PUBLIC_API_KEY} />;
};
