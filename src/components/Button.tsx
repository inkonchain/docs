import { PropsWithChildren } from "react";
import clsx from "clsx";

interface ButtonProps {
  variant: "primary" | "secondary";
  onClick?: () => void;
  // Renders an external link styled as the button instead of a <button>
  href?: string;
  className?: string;
}

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  variant,
  onClick,
  href,
  className,
}) => {
  const classes = clsx(
    "font-semibold py-2.5 px-5 inline-flex items-center justify-center gap-1.5 transition-colors rounded-full text-sm cursor-pointer",
    {
      // Same as the navbar's "Go to App": black on light, light on dark
      // (white on ink-light was 3.4:1, failing WCAG AA)
      "text-background bg-primary hover:opacity-85": variant === "primary",
      "text-primary bg-container hover:bg-container-2": variant === "secondary",
    },
    className
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        // `ink-button` opts out of the global content-link colors
        className={clsx("ink-button !no-underline", classes)}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
};
