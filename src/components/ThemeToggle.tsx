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
    return null;
  }

  return (
    <button className="w-6 h-6 ml-2" type="button" onClick={onToggleTheme}>
      {resolvedTheme === "light" ? (
        <SunIcon className="w-6 h-6 text-magic-black" />
      ) : (
        <MoonIcon className="w-6 h-6 text-white" />
      )}
    </button>
  );
};
