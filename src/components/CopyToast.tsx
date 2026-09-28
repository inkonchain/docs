import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { CheckIcon } from "@/icons/Check";

const EVENT = "ink:copied";
const VISIBLE_MS = 1800;

/** Shows the "Copied" toast (see CopyToast). */
export const notifyCopied = () => window.dispatchEvent(new Event(EVENT));

/**
 * Black pill that slides up from the bottom of the screen after anything is
 * copied — our CopyButton calls notifyCopied(), and Nextra's code-block copy
 * buttons are picked up with a delegated click listener.
 */
export const CopyToast = () => {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const show = () => {
      setVisible(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setVisible(false), VISIBLE_MS);
    };
    const onClick = (event: MouseEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest('.nextra-code button[title="Copy code"]')
      ) {
        show();
      }
    };

    window.addEventListener(EVENT, show);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener(EVENT, show);
      document.removeEventListener("click", onClick);
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        "pointer-events-none fixed inset-x-0 bottom-8 z-[70] flex justify-center transition-all duration-300 ease-[cubic-bezier(.2,.9,.3,1.3)] motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      )}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#050506]/80 px-3 py-1.5 text-xs font-semibold text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md dark:bg-container-2/80 dark:ring-white/15">
        <CheckIcon className="size-3.5 text-positive" />
        Copied
      </span>
    </div>
  );
};
