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
      className={clsx(
        "font-semibold py-2.5 px-5 inline-flex items-center justify-center gap-1.5 transition-colors rounded-full text-sm cursor-pointer",
        {
          "text-white bg-ink-light hover:bg-ink": variant === "primary",
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
