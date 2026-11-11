import { isValidElement, type ReactNode, useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import type { Heading } from "nextra";

interface TocProps {
  toc: Heading[];
  filePath: string;
}

// Nextra types heading values as strings, but at runtime they can be React nodes
// (e.g. a heading written as a link). Flatten to text so the TOC link never
// wraps another <a>, which breaks hydration.
const toText = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (isValidElement<{ children?: ReactNode }>(node))
    return toText(node.props.children);
  return "";
};

// A heading counts as "current" once it has scrolled above this line
// (navbar height + a little breathing room).
const ACTIVE_OFFSET = 120;

// Plain list like aave.com/docs: no title or rules, the current section is
// highlighted as you scroll, and the whole list fades in once the page is
// scrolled (html[data-scrolled], see ScrollState + globals.css).
export const Toc: React.FC<TocProps> = ({ toc: headings }) => {
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    if (headings.length === 0) return;

    const update = () => {
      let current = headings[0].id;
      for (const { id } of headings) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= ACTIVE_OFFSET) {
          current = id;
        }
      }
      setActiveId(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [headings]);

  if (headings.length === 0) return null;

  const minDepth = Math.min(...headings.map(({ depth }) => depth));

  return (
    <nav
      aria-label="On this page"
      className="ink-toc sticky top-[var(--nextra-navbar-height)] pt-16 pb-5"
    >
      <ul className="flex flex-col gap-2.5">
        {headings.map(({ id, value, depth }) => (
          <li key={id} style={{ paddingLeft: `${(depth - minDepth) * 12}px` }}>
            <Link
              href={`#${id}`}
              className={clsx(
                "toc-link block text-sm font-medium leading-5 transition-colors",
                id === activeId && "!text-primary"
              )}
            >
              {toText(value)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
