import { PropsWithChildren } from "react";
import clsx from "clsx";

interface ButtonProps {
  variant: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  variant,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      className={clsx(
        "font-semibold py-2.5 px-5 inline-flex items-center justify-center gap-1.5 transition-colors rounded-full text-sm cursor-pointer",
        {
          // Same as the navbar's "Go to App": black on light, light on dark
          // (white on ink-light was 3.4:1, failing WCAG AA)
          "text-background bg-primary hover:opacity-85": variant === "primary",
          "text-primary bg-container hover:bg-container-2":
            variant === "secondary",
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
