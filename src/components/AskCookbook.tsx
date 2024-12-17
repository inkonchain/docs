import React from "react";
import BaseAskCookbook from "@cookbookdev/docsbot/react";

/** It's going to be exposed in HTTP requests anyway so it's fine to just hardcode it here */
const COOKBOOK_PUBLIC_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzNlNTU5ZjBjOWIwZGRjZTE5OTAwMTIiLCJpYXQiOjE3MzIxMzgzOTksImV4cCI6MjA0NzcxNDM5OX0.L7-tnJwEIoDwxtju0yr5T4Xb9ahjIae8ob4dVbzoADM";
export const AskCookbook = () => {
  return <BaseAskCookbook apiKey={COOKBOOK_PUBLIC_API_KEY} />;
};
