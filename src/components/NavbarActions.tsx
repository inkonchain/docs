import { useEffect } from "react";
import { useRouter } from "next/router";

import { URLS } from "@/utils/urls";

import { ThemeToggle } from "./ThemeToggle";

const pillClassName =
  "inline-flex items-center whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold !no-underline transition-colors max-md:hidden";

const blurSearch = () => {
  const active = document.activeElement;
  if (
    active instanceof HTMLInputElement &&
    active.type === "search" &&
    active.closest(".nextra-nav-container")
  ) {
    active.blur();
  }
};

export const NavbarActions = () => {
  const router = useRouter();

  // Picking a result navigates, but headlessui hands focus back to the input
  // right after — which would keep the modal open. Close it once the
  // navigation (or same-page #hash jump) completes.
  useEffect(() => {
    // Focus comes back a tick after the navigation settles, so blur again
    // once the next frame has run
    const closeAfterNavigation = () => {
      blurSearch();
      requestAnimationFrame(() => setTimeout(blurSearch, 50));
    };
    router.events.on("routeChangeComplete", closeAfterNavigation);
    router.events.on("hashChangeComplete", closeAfterNavigation);
    return () => {
      router.events.off("routeChangeComplete", closeAfterNavigation);
      router.events.off("hashChangeComplete", closeAfterNavigation);
    };
  }, [router.events]);

  // The search modal is the focused navbar search input (see globals.css), so
  // Esc closes it by blurring the input.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") blurSearch();
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
