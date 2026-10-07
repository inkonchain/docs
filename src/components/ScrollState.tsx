import { useEffect } from "react";

/**
 * Sets `data-scrolled` on <html> once the page leaves the top, so the navbar
 * can switch from transparent to a blurred background with a bottom border.
 */
export const ScrollState = () => {
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      root.toggleAttribute("data-scrolled", window.scrollY > 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return null;
};
