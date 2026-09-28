import { useEffect, useState } from "react";
import { useTheme } from "nextra-theme-docs";

import { MoonIcon } from "../icons/Moon";
import { SunIcon } from "../icons/Sun";

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  const onToggleTheme = () => {
    if (resolvedTheme == "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
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
