import { ComponentProps } from "react";
import { useRouter } from "next/router";

import { PageActions } from "./PageActions";

// MDX `h1` (themeConfig.components): the title row with the page actions.
// The home page has the hero right under its title, so no actions there.
export const PageTitle = (props: ComponentProps<"h1">) => {
  const { pathname } = useRouter();

  return (
    <div className="ink-page-title">
      <h1 {...props} />
      {pathname !== "/" && <PageActions />}
    </div>
  );
};
