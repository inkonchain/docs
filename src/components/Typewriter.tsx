import { useEffect, useState } from "react";
import clsx from "clsx";

interface TypewriterProps {
  text: string;
  /** Grey `$ ` before the text, as on the banner */
  prompt?: boolean;
  className?: string;
}

const START_DELAY = 400;
const TYPE_DELAY = 55;
const HOLD = 4000;
const ERASE_DELAY = 28;
const PAUSE = 700;

/**
 * Text typed out like the code panel on inkonchain.com, in Departure Mono:
 * character by character with a blinking block caret, then it holds,
 * erases and types again on a loop. Used for the banner and home titles.
 */
export const Typewriter = ({
  text,
  prompt = false,
  className,
}: TypewriterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    const type = (next: number) => {
      setCount(next);
      timer =
        next < text.length
          ? setTimeout(() => type(next + 1), TYPE_DELAY)
          : setTimeout(() => erase(next - 1), HOLD);
    };
    const erase = (next: number) => {
      setCount(next);
      timer =
        next > 0
          ? setTimeout(() => erase(next - 1), ERASE_DELAY)
          : setTimeout(() => type(1), PAUSE);
    };

    timer = setTimeout(() => type(1), START_DELAY);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <span className={clsx("ink-typer", className)} aria-label={text}>
      <span aria-hidden="true">
        {prompt && <span className="ink-typer__prompt">$ </span>}
        {text.slice(0, count)}
        <span className="ink-typer__caret" />
      </span>
    </span>
  );
};
