import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "nextra-theme-docs";

import { MoonIcon } from "../icons/Moon";
import { SunIcon } from "../icons/Sun";

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // Like inkonchain.com: the new theme wipes in from the bottom (View
  // Transitions, styled in globals.css), with a plain colour fade elsewhere.
  const onToggleTheme = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    // The new snapshot is taken when this returns, so apply the theme now:
    // next-themes only sets the class in an effect.
    const apply = () => {
      flushSync(() => setTheme(next));
      root.classList.toggle("dark", next === "dark");
      root.classList.toggle("light", next === "light");
      root.style.colorScheme = next;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }

    if (document.startViewTransition) {
      document.startViewTransition(apply);
      return;
    }

    root.classList.add("theme-fallback-transition");
    apply();
    window.setTimeout(
      () => root.classList.remove("theme-fallback-transition"),
      460
    );
  };

  /**
   * This is not ideal, but it's the best solution we have to avoid rendering the button
   * with the wrong color
   */
  useEffect(() => {
    setIsMounted(true);
  }, [setIsMounted]);

  if (!isMounted) {
    // Same footprint as the button so the navbar doesn't shift on mount
    return <span className="inline-block size-9" aria-hidden="true" />;
  }

  return (
    <button
      className="inline-flex size-9 items-center justify-center rounded-full bg-container text-primary transition-colors hover:bg-container-2"
      type="button"
      aria-label="Toggle theme"
      onClick={onToggleTheme}
    >
      {resolvedTheme === "light" ? (
        <SunIcon className="size-[18px]" />
      ) : (
        <MoonIcon className="size-[18px]" />
      )}
    </button>
  );
};
