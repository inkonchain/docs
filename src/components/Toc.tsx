import Link from "next/link";
import type { Heading } from "nextra";

import { PencilIcon } from "@/icons/Pencil";
import { ThumbUpIcon } from "@/icons/ThumbUp";
import { URLS } from "@/utils/urls";

interface TocProps {
  toc: Heading[];
  filePath: string;
}

export const Toc: React.FC<TocProps> = ({ toc: headings, filePath }) => {
  // `filePath` is relative to the project root, e.g. "src/pages/general/rpc.mdx"
  const editUrl = filePath
    ? `${URLS.editDocsOnGithubBase}/${filePath}`
    : URLS.repositoryUrl;

  return (
    <div className="flex flex-col items-start justify-start py-5 sticky top-14">
      {headings.length > 0 && (
        <div className="flex flex-col gap-2 border-b pb-4 mb-6">
          <h5 className="font-bold text-magic-black dark:text-magic-white">
            On this page
          </h5>

          <ul>
            {headings.map(({ id, value }) => (
              <li key={id} className="group mb-2">
                <Link className="text-sm toc-link" href={`#${id}`}>
                  {value}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Link href={editUrl} className="group text-xs flex items-center gap-1">
          <PencilIcon className="size-4 toc-link" />
          <span className="toc-link">Edit this page on GitHub</span>
        </Link>
      </div>
    </div>
  );
};
