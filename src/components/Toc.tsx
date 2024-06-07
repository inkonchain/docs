import Link from "next/link";

import { PencilIcon } from "@/icons/Pencil";
import { ThumpUpIcon } from "@/icons/ThumpUp";
import { URLS } from "@/utils/urls";

interface Heading {
  id: string;
  depth: number;
  value: string;
}

interface TocProps {
  headings: Heading[];
}

export const Toc: React.FC<TocProps> = ({ headings }) => {
  return (
    <div className="flex flex-col items-start justify-start py-5 sticky top-14">
      {headings.length > 0 && (
        <div className="flex flex-col gap-2 border-b pb-4 mb-6">
          <h5 className="font-bold text-magic-black">On this page</h5>

          <ul>
            {headings.map(({ id, value }) => (
              <li key={id} className="mb-2">
                <Link className="text-sm cursor-pointer" href={`#${id}`}>
                  {value}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Link
          href={URLS.developerWailistUrl}
          className="text-xs flex items-center gap-1"
        >
          <ThumpUpIcon className="size-4 text-magic-purple" />
          Give us feedback
        </Link>

        <Link
          href={URLS.editDocsOnGithub}
          className="text-xs flex items-center gap-1"
        >
          <PencilIcon className="size-4 text-magic-purple" />
          Edit this page on Github
        </Link>
      </div>
    </div>
  );
};
