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
        "font-bold py-5 px-8 inline-flex items-center transition-all rounded-full text-xl backdrop-blur-[32px]",
        {
          "text-magic-white bg-magic-purple shadow-[0px_3px_84px_-10px_rgba(63,107,175,0.5)]":
            variant === "primary",
          "text-magic-purple bg-magic-semi-deep-purple/15 shadow-[0px_3px_84px_-10px_rgba(63,107,175,0.5)]":
            variant === "secondary",
        }
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
