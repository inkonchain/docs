import Link from "next/link";

import { InkMark } from "@/icons/InkMark";
import { URLS } from "@/utils/urls";

const linkClassName =
  "text-[13px] font-medium text-secondary underline decoration-outline underline-offset-4 transition-colors hover:text-primary";

const docsLinks = [
  { label: "About Ink", href: "/general/about" },
  { label: "Network Information", href: "/general/network-information" },
  { label: "Connect Wallet", href: "/general/connect-wallet" },
  { label: "Bridges", href: "/tools/bridges" },
  { label: "Faucets", href: "/tools/faucets" },
];

const externalLinks = [
  { label: "Terms", href: "https://inkonchain.com/en-US/terms" },
  { label: "Privacy", href: "https://inkonchain.com/en-US/privacy" },
  { label: "Status", href: URLS.statusPageUrl },
  { label: "GitHub", href: URLS.githubOrgUrl },
  { label: "App", href: URLS.appUrl },
];

// Mirrors the INK token website footer: two link columns, the coin rising
// from the bottom edge, and the mark + copyright underneath.
export const Footer = () => {
  return (
    <footer className="ink-footer relative mt-24 overflow-hidden md:mt-32">
      <div className="mx-auto grid max-w-[var(--layout-width)] grid-cols-2 px-6 lg:px-10 pb-40 md:pb-48">
        <div className="col-span-2 mb-10 border-t border-outline-subtle" />
        <ul className="space-y-2.5">
          {docsLinks.map(({ label, href }) => (
            <li key={href}>
              <Link className={linkClassName} href={href}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="space-y-2.5 text-right">
          {externalLinks.map(({ label, href }) => (
            <li key={href}>
              <a
                className={linkClassName}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ink-coin.png"
          alt=""
          width={761}
          height={387}
          loading="lazy"
          decoding="async"
          className="w-[560px] max-w-[85vw] translate-y-[15%] md:w-[680px]"
        />
      </div>

      <div className="relative mx-auto flex max-w-[var(--layout-width)] items-end justify-between px-6 lg:px-10 pb-6">
        <span className="inline-flex size-9 items-center justify-center rounded-full text-ink-light ring-1 ring-ink-light/50">
          <InkMark className="size-5" />
        </span>
        <span className="text-xs text-secondary">
          © Ink {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
};
