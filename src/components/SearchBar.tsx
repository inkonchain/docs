import { useEffect, useState } from "react";

/**
 * Sticky "Search the docs…" pill at the bottom of every page: a bigger entry
 * point to the navbar search, which opens as the centred modal when its input
 * is focused (see globals.css). Hidden while the modal is open.
 */
export const SearchBar = () => {
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(navigator.userAgent.includes("Mac"));
  }, []);

  const openSearch = () => {
    document
      .querySelector<HTMLInputElement>(
        '.nextra-nav-container input[type="search"]'
      )
      ?.focus();
  };

  return (
    <div className="ink-search-bar pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 print:hidden">
      <button
        type="button"
        onClick={openSearch}
        className="pointer-events-auto flex h-12 w-[min(20rem,100%)] items-center gap-3 rounded-full border border-outline-subtle bg-background/70 pl-4 pr-3 text-left shadow-xl backdrop-blur-xl transition-colors hover:bg-background/90"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-[18px] shrink-0 text-secondary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-secondary">
          Search the docs…
        </span>
        <kbd className="shrink-0 rounded-md border border-outline-subtle bg-background px-1.5 py-0.5 font-sans text-[11px] font-semibold text-secondary">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>
    </div>
  );
};
