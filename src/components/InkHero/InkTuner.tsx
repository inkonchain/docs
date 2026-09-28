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
const THUMB = 24;

const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const PlusMinus = ({ plus }: { plus?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className="size-4"
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
 * − / slider / + under the home animation. Moves the ink and, through
 * `--round`, how rounded the whole site is.
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

  const fromPointer = (clientX: number) => {
    const rect = track.current!.getBoundingClientRect();
    return (clientX - rect.left - THUMB / 2) / Math.max(1, rect.width - THUMB);
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

  const button =
    "inline-flex size-9 items-center justify-center rounded-full border border-outline-subtle bg-background text-primary transition-[background-color,transform] hover:bg-container-2 active:scale-95";

  return (
    // Floats over the bottom of the animation, as a frosted bar
    <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
      <div className="pointer-events-auto flex items-center gap-4 rounded-full border border-white/40 bg-background/50 p-1.5 shadow-lg backdrop-blur-md">
        <button
          type="button"
          aria-label="Less ink"
          className={button}
          onClick={() => nudge(-1)}
        >
          <PlusMinus />
        </button>
        <div
          ref={track}
          role="slider"
          tabIndex={0}
          aria-label="Ink and corner roundness"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((tune ?? 0) * 100)}
          onKeyDown={onKeyDown}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            dragging.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            apply(fromPointer(event.clientX));
          }}
          onPointerMove={(event) => {
            if (dragging.current) apply(fromPointer(event.clientX));
          }}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
          className="relative h-9 w-32 cursor-pointer touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ink-light sm:w-40"
        >
          <span className="absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-primary/30" />
          {tune !== undefined && (
            <span
              className="absolute top-1/2 size-6 -translate-y-1/2 rounded-full border border-outline-subtle bg-background shadow-sm"
              style={{ left: `calc(${tune} * (100% - ${THUMB}px))` }}
            />
          )}
        </div>
        <button
          type="button"
          aria-label="More ink"
          className={button}
          onClick={() => nudge(1)}
        >
          <PlusMinus plus />
        </button>
      </div>
    </div>
  );
};
