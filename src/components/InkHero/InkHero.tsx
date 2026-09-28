import { useEffect } from "react";

import { InkTuner } from "./InkTuner";
import type {} from "./interactive-ink";

/**
 * Interactive WebGL ink animation from the inkonchain.com homepage.
 * The custom element is registered on the client only.
 */
export const InkHero = () => {
  useEffect(() => {
    import("./interactive-ink");
  }, []);

  // React 18 passes `className` through to custom elements verbatim (it never
  // becomes `class`), so the layout styles live on a wrapper div instead.
  return (
    <div className="relative mt-8 aspect-[4/3] w-full sm:aspect-[12/5] overflow-hidden rounded-3xl border border-outline-subtle">
      <interactive-ink
        style={{ display: "block", width: "100%", height: "100%" }}
        value="3"
        speed="1"
        interaction="0.7"
        edge="0"
        blur="0"
        phase="28"
      />
      <InkTuner />
    </div>
  );
};
