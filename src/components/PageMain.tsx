import { PropsWithChildren } from "react";
import { useConfig } from "nextra-theme-docs";

import { PencilIcon } from "@/icons/Pencil";
import { URLS } from "@/utils/urls";

// Wraps every page's content (themeConfig.main) to add the edit link at the
// bottom of the page, pointing at that page's source file.
export const PageMain = ({ children }: PropsWithChildren) => {
  const { filePath } = useConfig();

  return (
    <>
      {children}
      {filePath && (
        <div className="ink-edit-link mt-8">
          <a
            href={`${URLS.repositoryUrl}/blob/main/${filePath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ink-button inline-flex items-center gap-1.5 rounded-full bg-container px-4 py-2 text-[13px] font-semibold !text-primary !no-underline transition-colors hover:bg-container-2"
          >
            <PencilIcon className="size-4" />
            Edit this page on GitHub
          </a>
        </div>
      )}
    </>
  );
};
