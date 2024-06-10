import { PropsWithChildren } from "react";
import clsx from "clsx";

interface ButtonProps {
  variant: "primary" | "secondary";
  onClick?: () => void;
}

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  variant,
  onClick,
}) => {
  return (
    <button
      className={clsx(
        "font-semibold py-2 px-4 rounded-xl inline-flex items-center transition-all",
        {
          "text-magic-white bg-magic-purple": variant === "primary",
          "text-magic-purple bg-magic-semi-deep-purple/15 ":
            variant === "secondary",
        }
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
