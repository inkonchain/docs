import { useEffect, useState } from "react";

interface BannerTyperProps {
  text: string;
}

const START_DELAY = 400;
const TYPE_DELAY = 55;
const HOLD = 4000;
const ERASE_DELAY = 28;
const PAUSE = 700;

/**
 * Banner text typed out like the code panel on inkonchain.com: a `$` prompt,
 * the message character by character, and a blinking block caret. It holds,
 * erases and types again on a loop.
 */
export const BannerTyper = ({ text }: BannerTyperProps) => {
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
    <span className="ink-banner-typer" aria-label={text}>
      <span aria-hidden="true">
        <span className="ink-banner-typer__prompt">$ </span>
        {text.slice(0, count)}
        <span className="ink-banner-typer__caret" />
      </span>
    </span>
  );
};
