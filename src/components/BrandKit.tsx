import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { CheckIcon } from "@/icons/Check";

import { notifyCopied } from "./CopyToast";

/*
 * Brand Kit page building blocks, drawn in code from the same tokens as the
 * new Ink website (instead of exported PNGs that go stale with the brand).
 * Swatches use fixed hex values so they read the same in light and dark.
 */

interface Swatch {
  name: string;
  hex: string;
  // Text color that sits on the swatch
  light?: boolean;
}

const INK: Swatch = { name: "Ink Purple", hex: "#7132F5", light: true };

const NEUTRALS: Swatch[] = [
  { name: "Black", hex: "#000000", light: true },
  { name: "White", hex: "#FFFFFF" },
];

const SUPPORTING: Swatch[] = [
  { name: "Ink Light", hex: "#9E70FF" },
  { name: "Ink Soft", hex: "#F2ECFF" },
];

const toRgb = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(", ");

const CopyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const SwatchCard = ({
  swatch,
  className,
}: {
  swatch: Swatch;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = () => {
    navigator.clipboard?.writeText(swatch.hex).then(() => {
      notifyCopied();
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    // The whole card copies; the corner pill just makes that discoverable
    <button
      type="button"
      title={`Copy ${swatch.hex}`}
      onClick={copy}
      className={clsx(
        "group relative flex flex-col justify-end gap-0.5 p-5 text-left ring-1 ring-inset ring-outline-subtle transition-transform active:scale-[0.99]",
        swatch.light ? "text-white" : "text-black",
        className
      )}
      style={{ backgroundColor: swatch.hex }}
    >
      <span
        className={clsx(
          "absolute right-4 top-4 flex size-9 items-center justify-center rounded-full transition-colors",
          swatch.light
            ? "bg-white/15 group-hover:bg-white/25"
            : "bg-black/5 group-hover:bg-black/10"
        )}
      >
        {copied ? <CheckIcon className="size-4" /> : <CopyIcon />}
      </span>
      <span className="text-sm font-semibold">{swatch.name}</span>
      <span className="text-xs font-medium opacity-70">
        {swatch.hex}
        <span className="hidden sm:inline"> · RGB {toRgb(swatch.hex)}</span>
      </span>
    </button>
  );
};

export const BrandColors = () => (
  <div className="my-8 flex flex-col gap-3">
    <SwatchCard swatch={INK} className="h-56 rounded-3xl sm:h-72" />
    <div className="grid grid-cols-2 gap-3">
      {NEUTRALS.map((swatch) => (
        <SwatchCard
          key={swatch.hex}
          swatch={swatch}
          className="h-40 rounded-3xl sm:h-52"
        />
      ))}
    </div>
    <div className="grid grid-cols-2 gap-3">
      {SUPPORTING.map((swatch) => (
        <SwatchCard
          key={swatch.hex}
          swatch={swatch}
          className="h-32 rounded-2xl"
        />
      ))}
    </div>
  </div>
);

export const BrandTypography = () => (
  <div className="flex flex-col gap-8 rounded-3xl bg-container p-8 sm:p-10">
    <div className="text-6xl font-bold tracking-tight text-primary sm:text-7xl">
      Satoshi
    </div>
    <div className="text-sm font-medium leading-relaxed text-secondary">
      ABCDEFGHIJKLMNOPQRSTUVWXYZ
      <br />
      abcdefghijklmnopqrstuvwxyz
      <br />
      0123456789 !?&$€@
    </div>
  </div>
);
