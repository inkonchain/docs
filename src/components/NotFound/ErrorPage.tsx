import { useEffect } from "react";
import Link from "next/link";

import type {} from "./interactive-ascii";

interface ErrorPageProps {
  code: string;
  title: string;
  description: string;
}

/**
 * 404 / 500: the ASCII ink animation from inkonchain.com/builders behind a
 * centred message and a way back home.
 */
export const ErrorPage = ({ code, title, description }: ErrorPageProps) => {
  useEffect(() => {
    import("./interactive-ascii");
  }, []);

  // As with the home hero, React 18 won't turn `className` into `class` on a
  // custom element, so layout lives on the wrapper.
  return (
    <div className="relative mt-16 flex h-[min(70vh,40rem)] w-full items-center justify-center overflow-hidden rounded-3xl border border-outline-subtle">
      <interactive-ascii
        style={{ position: "absolute", inset: 0 }}
        value="3"
        speed="0.9"
        interaction="0.9"
        phase="12"
      />
      <div className="pointer-events-none relative flex flex-col items-center rounded-3xl border border-white/40 bg-background/70 px-10 py-8 text-center shadow-lg backdrop-blur-md">
        <p
          className="text-6xl text-primary"
          style={{ fontFamily: "var(--font-departure-mono), monospace" }}
        >
          {code}
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-primary">
          {title}
        </h1>
        <p className="mt-2 max-w-sm text-sm font-medium text-secondary">
          {description}
        </p>
        <Link
          href="/"
          className="ink-button pointer-events-auto mt-6 inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold !text-background !no-underline transition-opacity hover:opacity-85"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};
