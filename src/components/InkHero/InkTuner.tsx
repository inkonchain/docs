import { useCallback, useEffect, useRef, useState } from "react";

import {
  applyTune,
  clampTune,
  inkValueFor,
  inkZoomFor,
  readStoredTune,
  storeTune,
  TUNE_STEP,
} from "./tune";

// Spring from the homepage slider: −/+ give it a kick, and it bounces softly
// off either end.
const STIFFNESS = 165;
const DAMPING = 8;
const MASS = 1.2;
const IMPULSE = 3.4;
const BOUNCE = 0.4;
const THUMB = 16;

const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const PlusMinus = ({ plus }: { plus?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className="size-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d={plus ? "M5 12h14M12 5v14" : "M5 12h14"} />
  </svg>
);

/**
 * + / vertical slider / − on the right edge of the home animation. Moves the
 * ink and, through `--round`, how rounded the whole site is.
 */
export const InkTuner = () => {
  const [tune, setTune] = useState<number>();
  const value = useRef(0);
  const target = useRef(0);
  const velocity = useRef(0);
  const frame = useRef(0);
  const lastStamp = useRef(0);
  const dragging = useRef(false);
  const track = useRef<HTMLDivElement>(null);

  const write = useCallback((next: number) => {
    value.current = next;
    setTune(next);
    applyTune(next);
    // Via the attribute, not the `value` property: the custom element may not
    // be upgraded yet, and an own property would shadow its setter
    const ink = document.querySelector<HTMLElement>("interactive-ink");
    ink?.setAttribute("value", String(inkValueFor(next)));
    ink?.setAttribute("zoom", String(inkZoomFor(next)));
  }, []);

  const stopSpring = () => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    velocity.current = 0;
    lastStamp.current = 0;
  };

  const step = useCallback(
    (stamp: number) => {
      const dt = Math.min(
        0.032,
        lastStamp.current ? (stamp - lastStamp.current) / 1000 : 1 / 60
      );
      lastStamp.current = stamp;
      const accel =
        (-STIFFNESS * (value.current - target.current) -
          DAMPING * velocity.current) /
        MASS;
      velocity.current += accel * dt;
      let next = value.current + velocity.current * dt;
      if (next < 0) {
        next = 0;
        velocity.current = Math.abs(velocity.current) * BOUNCE;
      } else if (next > 1) {
        next = 1;
        velocity.current = -Math.abs(velocity.current) * BOUNCE;
      }
      write(next);
      if (
        Math.abs(velocity.current) < 0.012 &&
        Math.abs(next - target.current) < 0.002
      ) {
        write(target.current);
        stopSpring();
        storeTune(target.current);
        return;
      }
      frame.current = requestAnimationFrame(step);
    },
    [write]
  );

  const apply = useCallback(
    (next: number, impulse?: number) => {
      const clamped = clampTune(next);
      target.current = clamped;
      if (impulse === undefined || reduceMotion()) {
        stopSpring();
        write(clamped);
        storeTune(clamped);
        return;
      }
      velocity.current += impulse;
      if (!frame.current) {
        lastStamp.current = 0;
        frame.current = requestAnimationFrame(step);
      }
    },
    [step, write]
  );

  // Start from the stored position (also applied site-wide in _app)
  useEffect(() => {
    const initial = readStoredTune();
    target.current = initial;
    write(initial);
    return () => cancelAnimationFrame(frame.current);
  }, [write]);

  const nudge = (dir: -1 | 1) => {
    const atEnd =
      (dir < 0 && target.current <= 0) || (dir > 0 && target.current >= 1);
    apply(
      atEnd ? target.current : target.current + dir * TUNE_STEP,
      dir * IMPULSE
    );
  };

  // Vertical: top is the far right of the scale (most ink)
  const fromPointer = (clientY: number) => {
    const rect = track.current!.getBoundingClientRect();
    return (
      1 - (clientY - rect.top - THUMB / 2) / Math.max(1, rect.height - THUMB)
    );
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowLeft: -TUNE_STEP,
      ArrowDown: -TUNE_STEP,
      ArrowRight: TUNE_STEP,
      ArrowUp: TUNE_STEP,
      PageDown: -TUNE_STEP * 2,
      PageUp: TUNE_STEP * 2,
    };
    if (event.key in keys) apply(value.current + keys[event.key]);
    else if (event.key === "Home") apply(0);
    else if (event.key === "End") apply(1);
    else return;
    event.preventDefault();
  };

  // Always light: the ink animation draws on a light surface in both themes
  const button =
    "inline-flex size-7 items-center justify-center rounded-full border border-black/10 bg-white text-black transition-[background-color,transform] hover:bg-neutral-100 active:scale-95";

  return (
    // Floats on the right edge of the animation, as a small frosted bar
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <div className="pointer-events-auto flex flex-col items-center gap-2 rounded-full border border-white/60 bg-white/50 p-1 shadow-lg backdrop-blur-md">
        <button
          type="button"
          aria-label="More ink"
          className={button}
          onClick={() => nudge(1)}
        >
          <PlusMinus plus />
        </button>
        <div
          ref={track}
          role="slider"
          tabIndex={0}
          aria-label="Ink and corner roundness"
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((tune ?? 0) * 100)}
          onKeyDown={onKeyDown}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            dragging.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            apply(fromPointer(event.clientY));
          }}
          onPointerMove={(event) => {
            if (dragging.current) apply(fromPointer(event.clientY));
          }}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
          className="relative h-24 w-7 cursor-pointer touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ink-light"
        >
          <span className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-black/25" />
          {tune !== undefined && (
            <span
              className="absolute left-1/2 size-4 -translate-x-1/2 rounded-full border border-black/10 bg-white shadow-sm"
              style={{ top: `calc(${1 - tune} * (100% - ${THUMB}px))` }}
            />
          )}
        </div>
        <button
          type="button"
          aria-label="Less ink"
          className={button}
          onClick={() => nudge(-1)}
        >
          <PlusMinus />
        </button>
      </div>
    </div>
  );
};
