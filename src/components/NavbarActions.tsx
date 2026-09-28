import { useEffect } from "react";

import { URLS } from "@/utils/urls";

import { ThemeToggle } from "./ThemeToggle";

const pillClassName =
  "inline-flex items-center whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold !no-underline transition-colors max-md:hidden";

export const NavbarActions = () => {
  // The search modal is the focused navbar search input (see globals.css), so
  // Esc closes it by blurring the input.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const active = document.activeElement;
      if (
        event.key === "Escape" &&
        active instanceof HTMLInputElement &&
        active.type === "search" &&
        active.closest(".nextra-nav-container")
      ) {
        active.blur();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex items-center gap-3">
      {/* Only visible while the search modal is open (see globals.css).
          Pressing it moves focus off the search input, which closes it. */}
      <button
        type="button"
        aria-label="Close search"
        className="ink-search-close"
        onClick={(event) => event.currentTarget.blur()}
      >
        <svg
          viewBox="0 0 24 24"
          className="size-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
      <ThemeToggle />
      <a
        href={URLS.githubOrgUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${pillClassName} bg-container !text-primary hover:bg-container-2`}
      >
        GitHub
      </a>
      <a
        href={URLS.appUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${pillClassName} bg-primary !text-background hover:opacity-85`}
      >
        Go to App
      </a>
    </div>
  );
};
