// The "tune" control from the inkonchain.com homepage (ink-web-app
// HomeBoard/init-nav-glass.ts): one value in [0, 1] drives both the ink
// animation and how rounded the site's corners are.

/**
 * Default position — today's radii and ink value 3. The homepage rests at
 * ~0.11; the docs rest further right so square → default spreads over a
 * third of the slider instead of its first sliver.
 */
export const TUNE_REST = 0.35;
/** −/+ and arrow keys: two steps from rest to square, four to the far right. */
export const TUNE_STEP = TUNE_REST / 2;

const STORAGE_KEY = "ink-docs-tune";

export const clampTune = (n: number) => Math.min(1, Math.max(0, n));

/** Ink `value` (1–5) for a tune position, as on the homepage. */
export const inkValueFor = (tune: number) => {
  const position = clampTune(tune);
  return position <= TUNE_REST
    ? 1 + (position / TUNE_REST) * 2
    : 3 + ((position - TUNE_REST) / (1 - TUNE_REST)) * 2;
};

/**
 * Ink `zoom` (docs-only shader attribute): pulls back a little towards the
 * left and fills the wide hero towards the right, so the thicker ink reads.
 */
export const inkZoomFor = (tune: number) => {
  const position = clampTune(tune);
  return position <= TUNE_REST
    ? 0.85 + (position / TUNE_REST) * 0.15
    : 1 + ((position - TUNE_REST) / (1 - TUNE_REST)) * 0.9;
};

/**
 * `--round` at the far right: where the largest card radius (2xl, 16px →
 * 40px cap in tailwind.config.js) tops out, so the whole slider stays useful.
 */
const MAX_ROUND = 2.5;

/**
 * `--round` scales the Tailwind radii (see tailwind.config.js): 0 is square,
 * 1 is the default look at rest, MAX_ROUND at the far right.
 */
export const roundFor = (tune: number) => {
  const position = clampTune(tune);
  return position <= TUNE_REST
    ? position / TUNE_REST
    : 1 + ((position - TUNE_REST) / (1 - TUNE_REST)) * (MAX_ROUND - 1);
};

export const applyTune = (tune: number) => {
  document.documentElement.style.setProperty("--round", String(roundFor(tune)));
};

export const readStoredTune = () => {
  try {
    const stored = Number.parseFloat(localStorage.getItem(STORAGE_KEY) ?? "");
    return Number.isFinite(stored) ? clampTune(stored) : TUNE_REST;
  } catch {
    return TUNE_REST;
  }
};

export const storeTune = (tune: number) => {
  try {
    localStorage.setItem(STORAGE_KEY, String(tune));
  } catch {
    // Storage can be unavailable (private mode, blocked site data)
  }
};
