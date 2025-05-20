import React from "react";
import dynamic from "next/dynamic";

// Dynamically import the original AskCookbook component with SSR disabled
const AskCookbookDynamic = dynamic(
  () => import("./AskCookbook").then((mod) => mod.AskCookbook),
  {
    ssr: false,
  }
);

// This wrapper component simply renders the dynamically imported one
const ClientOnlyAskCookbook: React.FC = () => {
  return <AskCookbookDynamic />;
};

export default ClientOnlyAskCookbook;
