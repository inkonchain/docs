import { ReactNode, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";

import { pageToMarkdown } from "@/utils/page-to-markdown";

import { notifyCopied } from "./CopyToast";

const BASE_URL = "https://docs.inkonchain.com";

const getMarkdown = () => {
  const main = document.querySelector<HTMLElement>(".nextra-content main");
  return main ? pageToMarkdown(main, window.location.origin) : "";
};

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

const MarkdownIcon = () => (
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
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M6 15V9l3 3 3-3v6M16 9v6m-2-2 2 2 2-2" />
  </svg>
);

const ExternalIcon = () => (
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
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

interface MenuItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  onSelect: () => void;
}

const MenuItem = ({ icon, title, description, onSelect }: MenuItemProps) => (
  <button
    type="button"
    role="menuitem"
    onClick={onSelect}
    className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-container"
  >
    <span className="mt-0.5 text-secondary">{icon}</span>
    <span>
      <span className="block text-sm font-semibold text-primary">{title}</span>
      <span className="block text-[13px] font-medium text-secondary">
        {description}
      </span>
    </span>
  </button>
);

/**
 * "Copy page" split button next to each page title: copy the page as
 * Markdown, view it as plain text, or open it in ChatGPT / Claude.
 */
export const PageActions = () => {
  const { asPath } = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const run = (action: () => void) => () => {
    setOpen(false);
    action();
  };

  const copyPage = async () => {
    try {
      await navigator.clipboard.writeText(getMarkdown());
      notifyCopied();
    } catch (error) {
      console.error("Failed to copy page:", error);
    }
  };

  const viewMarkdown = () => {
    const blob = new Blob([getMarkdown()], {
      type: "text/plain;charset=utf-8",
    });
    window.open(URL.createObjectURL(blob), "_blank", "noopener");
  };

  const openIn = (base: string) => {
    const pageUrl = `${BASE_URL}${asPath.split("#")[0]}`;
    const prompt = `Read ${pageUrl} and help me answer questions about it.`;
    window.open(
      `${base}${encodeURIComponent(prompt)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const half =
    "inline-flex h-8 items-center bg-container text-primary transition-colors hover:bg-container-2";

  return (
    <div ref={ref} className="ink-page-actions relative shrink-0">
      <div className="flex gap-0.5">
        <button
          type="button"
          onClick={copyPage}
          className={clsx(
            half,
            "gap-2 rounded-l-full pl-3.5 pr-3 text-[13px] font-semibold"
          )}
        >
          <CopyIcon />
          Copy page
        </button>
        <button
          type="button"
          aria-label="More page actions"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className={clsx(half, "rounded-r-full pl-2 pr-2.5")}
        >
          <svg
            viewBox="0 0 24 24"
            className={clsx(
              "size-4 transition-transform",
              open && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 w-72 rounded-2xl border border-outline-subtle bg-background p-1.5 shadow-xl"
        >
          <MenuItem
            icon={<CopyIcon />}
            title="Copy page"
            description="Copy page as Markdown for LLMs"
            onSelect={run(copyPage)}
          />
          <MenuItem
            icon={<MarkdownIcon />}
            title="View as Markdown"
            description="View this page as plain text"
            onSelect={run(viewMarkdown)}
          />
          <MenuItem
            icon={<ExternalIcon />}
            title="Open in ChatGPT"
            description="Ask questions about this page"
            onSelect={run(() => openIn("https://chatgpt.com/?q="))}
          />
          <MenuItem
            icon={<ExternalIcon />}
            title="Open in Claude"
            description="Ask questions about this page"
            onSelect={run(() => openIn("https://claude.ai/new?q="))}
          />
        </div>
      )}
    </div>
  );
};
