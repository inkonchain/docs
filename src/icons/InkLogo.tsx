import { InkMark } from "./InkMark";

interface InkLogoProps {
  className?: string;
}

export const InkLogo: React.FC<InkLogoProps> = ({
  className = "text-primary",
}) => {
  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="Ink Docs"
    >
      <InkMark className="size-6" />
      <span className="text-lg font-bold tracking-tight">INK</span>
      <span className="mx-2 h-3 w-px bg-outline" aria-hidden="true" />
      <span className="text-[15px] font-medium tracking-tight text-ink-light">
        Docs
      </span>
    </span>
  );
};
