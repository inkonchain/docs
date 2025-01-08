import Image from "next/image";
import { useTheme } from "nextra-theme-docs";

interface InkLogoProps {
  className?: string;
}

export const InkLogo: React.FC<InkLogoProps> = ({
  className = "text-magic-purple",
}) => {
  const { resolvedTheme } = useTheme();
  const logoSrc =
    resolvedTheme === "dark"
      ? "/logo/ink-logo-dark.svg"
      : "/logo/ink-logo-light.svg";

  return (
    <Image
      className={className}
      src={logoSrc}
      alt="Ink logo"
      width={85}
      height={28}
      priority
    />
  );
};
