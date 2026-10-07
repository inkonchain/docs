// Home page sections (used from src/pages/index.mdx): guide cards, use-case
// link lists, tool cards, the Builder Program banner and resource pills.
// Card language from inkonchain.com/builders: white cards with a hairline
// border and violet outline-circle icons.
import { useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";

import type {} from "@/components/NotFound/interactive-ascii";
import { URLS } from "@/utils/urls";

import { Typewriter } from "../Typewriter";

import { IconName, icons } from "./icons";

// Violet icon in a thin circle, as on inkonchain.com/builders
const IconBadge = ({ name }: { name: IconName }) => (
  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-ink-light text-ink-light">
    {icons[name]}
  </span>
);

const card =
  "rounded-3xl border border-outline-subtle bg-background transition-colors";

// Links in these components aren't prose links. (Plain divs rather than
// p/ul/li throughout: the prose rules in globals.css target those.)
const plain = "ink-button !no-underline";

const isExternal = (href: string) => href.startsWith("http");

const SmartLink = ({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) =>
  isExternal(href) ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(plain, className)}
    >
      {children}
    </a>
  ) : (
    <Link href={href} className={clsx(plain, className)}>
      {children}
    </Link>
  );

/* ------------------------------------------------------------------ */
/* Get started                                                         */
/* ------------------------------------------------------------------ */

const guides: {
  title: string;
  description: string;
  href: string;
  icon: IconName;
}[] = [
  {
    title: "Connect to Ink",
    description: "Add Ink to your wallet",
    href: "/general/connect-wallet",
    icon: "wallet",
  },
  {
    title: "Network information",
    description: "Chain IDs, RPC endpoints and explorers",
    href: "/general/network-information",
    icon: "network",
  },
  {
    title: "Get testnet ETH",
    description: "Fund your wallet on Ink Sepolia",
    href: "/tools/faucets",
    icon: "droplet",
  },
  {
    title: "Bridge to Ink",
    description: "Move assets onto Ink",
    href: "/tools/bridges",
    icon: "bridge",
  },
  {
    title: "Deploy a contract",
    description: "With Foundry, Hardhat or Remix",
    href: "/build/tutorials",
    icon: "rocket",
  },
];

export const GetStarted = () => (
  <div className="mt-6 grid gap-3 sm:grid-cols-6">
    {guides.map(({ title, description, href, icon }, index) => (
      <SmartLink
        key={href}
        href={href}
        className={clsx(
          card,
          "block p-6 hover:bg-container/60",
          // Two wide cards, then three
          index < 2 ? "sm:col-span-3" : "sm:col-span-2"
        )}
      >
        <IconBadge name={icon} />
        <span className="mt-5 block text-base font-semibold leading-6 !text-primary">
          {title}
        </span>
        <span className="mt-1 block text-sm font-medium leading-5 !text-secondary">
          {description}
        </span>
      </SmartLink>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Build on Ink                                                        */
/* ------------------------------------------------------------------ */

const useCases: {
  title: string;
  description: string;
  links: { label: string; href: string }[];
}[] = [
  {
    title: "Deploy contracts",
    description: "Ship and verify contracts on Ink",
    links: [
      {
        label: "Deploy with Foundry",
        href: "/build/tutorials/deploying-a-smart-contract/foundry",
      },
      {
        label: "Deploy with Hardhat",
        href: "/build/tutorials/deploying-a-smart-contract/hardhat",
      },
      {
        label: "Deploy with Remix",
        href: "/build/tutorials/deploying-a-smart-contract/remix",
      },
      {
        label: "Verify a contract",
        href: "/build/tutorials/verify-smart-contract",
      },
    ],
  },
  {
    title: "Gasless transactions",
    description: "Let users pay gas in stablecoins",
    links: [
      { label: "Ink Paymaster", href: "/build/paymaster-integration" },
      {
        label: "Pay gas with stablecoins",
        href: "/build/paymaster-integration/prepaid",
      },
      { label: "EIP-7702", href: "/build/paymaster-integration/eip-7702" },
      {
        label: "Payment tokens",
        href: "/build/paymaster-integration/payment-tokens",
      },
    ],
  },
  {
    title: "Superchain",
    description: "Build across the Superchain",
    links: [
      { label: "The Superchain", href: "/useful-information/the-superchain" },
      {
        label: "Deploy a SuperchainERC20",
        href: "/build/tutorials/deploying-a-superchainerc20",
      },
      {
        label: "Shipping on the Superchain",
        href: "/build/tutorials/shipping-on-the-superchain",
      },
      { label: "Crosschain infrastructure", href: "/tools/crosschain" },
    ],
  },
];

// Columns between hairlines with grey pill links, like the steps row on the
// INK token website (unnumbered: these are topics, not steps)
export const BuildOnInk = () => (
  <div className="mt-6 grid border-t border-outline-subtle lg:grid-cols-3">
    {useCases.map(({ title, description, links }) => (
      <div
        key={title}
        className="border-outline-subtle py-8 max-lg:border-b lg:px-8 lg:first:pl-0 lg:[&:not(:first-child)]:border-l"
      >
        <div className="text-xl font-semibold leading-7 tracking-[-0.02em] !text-primary">
          {title}
        </div>
        <div className="mt-1 text-sm font-medium leading-5 !text-secondary">
          {description}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {links.map(({ label, href }) => (
            <SmartLink
              key={href}
              href={href}
              className="inline-flex items-center rounded-full bg-container px-3.5 py-1.5 text-[13px] font-semibold !text-primary transition-colors hover:bg-container-2"
            >
              {label}
            </SmartLink>
          ))}
        </div>
      </div>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Tools & infrastructure                                              */
/* ------------------------------------------------------------------ */

const tools: {
  title: string;
  description: string;
  href: string;
  icon: IconName;
}[] = [
  {
    title: "RPC",
    description: "Private RPC endpoints",
    href: "/tools/rpc",
    icon: "server",
  },
  {
    title: "Block explorers",
    description: "Inspect transactions",
    href: "/tools/block-explorers",
    icon: "search",
  },
  {
    title: "Indexers",
    description: "Query onchain data",
    href: "/tools/indexers",
    icon: "database",
  },
  {
    title: "Oracles",
    description: "Price feeds on Ink",
    href: "/tools/oracles",
    icon: "chart",
  },
  {
    title: "Account abstraction",
    description: "Smart accounts and bundlers",
    href: "/tools/account-abstraction",
    icon: "user",
  },
  {
    title: "Multisig",
    description: "Shared wallets for teams",
    href: "/tools/multisig",
    icon: "shield",
  },
];

export const Tools = () => (
  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {tools.map(({ title, description, href, icon }) => (
      <SmartLink
        key={href}
        href={href}
        className={clsx(
          card,
          "flex items-center gap-4 px-5 py-[18px] hover:bg-container/60"
        )}
      >
        <IconBadge name={icon} />
        <span className="min-w-0">
          <span className="block text-sm font-semibold leading-5 !text-primary">
            {title}
          </span>
          <span className="mt-1 block text-[13px] font-medium leading-5 !text-secondary">
            {description}
          </span>
        </span>
      </SmartLink>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Builder Program banner                                              */
/* ------------------------------------------------------------------ */

export const BuilderProgram = () => {
  useEffect(() => {
    import("@/components/NotFound/interactive-ascii");
  }, []);

  return (
    <div className={clsx(card, "relative mt-12 overflow-hidden px-8 py-9")}>
      {/* ASCII ink from inkonchain.com/builders, fading out to the left */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 sm:block"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 45%)",
        }}
        aria-hidden="true"
      >
        <interactive-ascii
          style={{ position: "absolute", inset: 0 }}
          value="3"
          speed="0.9"
          interaction="0.9"
          phase="12"
        />
      </div>
      <div className="relative max-w-md">
        <div className="text-2xl !text-primary">
          <Typewriter text="Ink Builder Program" />
        </div>
        <div className="mt-2 text-sm font-medium !text-secondary">
          Funding, guidance and recognition for teams building on Ink, including
          milestone-based grants of up to 200,000 USDC.
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <SmartLink
            href="/ink-builder-program/overview"
            className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold !text-background transition-opacity hover:opacity-85"
          >
            Explore the program
          </SmartLink>
          <SmartLink
            href="/ink-builder-program/office-hours"
            className="inline-flex items-center rounded-full bg-container px-5 py-2.5 text-sm font-semibold !text-primary transition-colors hover:bg-container-2"
          >
            Book office hours
          </SmartLink>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Resources                                                           */
/* ------------------------------------------------------------------ */

const resources: { label: string; href: string; icon: IconName }[] = [
  { label: "GitHub", href: URLS.githubOrgUrl, icon: "github" },
  { label: "Support", href: "/general/support", icon: "help" },
  { label: "Status", href: URLS.statusPageUrl, icon: "status" },
  { label: "Community", href: "/work-with-ink/community", icon: "users" },
  { label: "Brand kit", href: "/work-with-ink/brand-kit", icon: "palette" },
  { label: "FAQ", href: "/faq", icon: "help" },
];

export const Resources = () => (
  <div className="mt-6 flex flex-wrap gap-2">
    {resources.map(({ label, href, icon }) => (
      <SmartLink
        key={label}
        href={href}
        className="inline-flex items-center gap-2 rounded-full bg-container py-2.5 pl-2.5 pr-4 text-sm font-semibold leading-5 !text-primary transition-colors hover:bg-container-2"
      >
        {icons[icon]}
        {label}
      </SmartLink>
    ))}
  </div>
);
