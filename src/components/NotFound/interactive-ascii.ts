// Ported as-is from inkfoundation/ink-web-app (feat/homepage-redesign):
// src/app/[locale]/_components/HomeBoard/interactive-ascii.ts
// Keep the two copies in sync when it changes. Colours come from
// --surface-page / --text-primary (see globals.css).
type Ripple = {
  x: number;
  y: number;
  startedAt: number;
  strength: number;
};

type HoverArea = {
  x: number;
  y: number;
  startedAt: number;
  seed: number;
};

const CHARACTERS = ".--->>>";
const MAX_RIPPLES = 8;
const MAX_HOVER_AREAS = 24;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const smoothstep = (start: number, end: number, value: number) => {
  const amount = clamp((value - start) / (end - start));
  return amount * amount * (3 - 2 * amount);
};

const glyphNoise = (column: number, row: number) => {
  const value = Math.sin(column * 12.9898 + row * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const colorWithAlpha = (color: string, alpha: number) => {
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
  }
  if (color.startsWith("rgba(")) {
    return color.replace(/,[^,]+\)$/, `, ${alpha})`);
  }
  return `color-mix(in srgb, ${color} ${alpha * 100}%, transparent)`;
};

// HTMLElement does not exist in Node. Extending a dummy base keeps this
// module importable during server rendering, where the element is never
// instantiated; the browser build still extends the real HTMLElement.
const HTMLElementBase = (
  typeof HTMLElement !== "undefined" ? HTMLElement : class {}
) as typeof HTMLElement;

class InteractiveAscii extends HTMLElementBase {
  static observedAttributes = ["value", "speed", "interaction", "phase"];

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;
  private themeObserver?: MutationObserver;
  private animationFrame = 0;
  private lastFrame = 0;
  private elapsed = 0;
  private interactionTime = 0;
  private visible = true;
  private playing = true;
  private pointer = { x: 0.5, y: 0.5 };
  private pointerTarget = { x: 0.5, y: 0.5 };
  private hoverTarget = 0;
  private hoverAreas: HoverArea[] = [];
  private lastHoverAreaAt = -1;
  private ripples: Ripple[] = [];
  private width = 1;
  private height = 1;
  private background = "#ffffff";
  private foreground = "#000000";
  private readonly frameEvent = new Event("inkframe");
  private readonly reduceMotion = matchMedia("(prefers-reduced-motion: reduce)")
    .matches;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          contain: layout paint;
          overflow: hidden;
          background: var(--surface-page, #fff);
        }
        canvas {
          display: block;
          width: 100%;
          height: 100%;
          touch-action: pan-y;
        }
      </style>
      <canvas part="canvas" aria-hidden="true"></canvas>
    `;
    this.canvas = shadow.querySelector("canvas")!;
    this.context = this.canvas.getContext("2d", { alpha: false })!;
    this.elapsed = this.phase;
  }

  connectedCallback() {
    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(this);
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.wantsFrames()) this.startLoop();
      else this.stopLoop();
    });
    this.intersectionObserver.observe(this);
    this.themeObserver = new MutationObserver(this.refreshPalette);
    this.themeObserver.observe(document.documentElement, {
      attributeFilter: ["class", "data-theme"],
    });
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    this.canvas.addEventListener("pointerenter", this.onPointerEnter);
    this.canvas.addEventListener("pointermove", this.onPointerMove);
    this.canvas.addEventListener("pointerleave", this.onPointerLeave);
    this.canvas.addEventListener("pointercancel", this.onPointerLeave);
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    this.refreshPalette();
    this.resize();
    this.startLoop();
  }

  disconnectedCallback() {
    this.stopLoop();
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.themeObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.canvas.removeEventListener("pointerenter", this.onPointerEnter);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerleave", this.onPointerLeave);
    this.canvas.removeEventListener("pointercancel", this.onPointerLeave);
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    if (name === "phase") this.elapsed = this.phase;
    // The active animation loop will draw the latest value. Drawing here as
    // well made slider updates render the entire canvas twice in one frame.
    if (this.visible && !this.animationFrame) this.draw();
  }

  get value() {
    const value = Number(this.getAttribute("value"));
    return this.hasAttribute("value") && Number.isFinite(value)
      ? clamp(value, 1, 5)
      : 3;
  }

  set value(next: number) {
    this.setAttribute("value", String(clamp(Number(next), 1, 5)));
  }

  get speed() {
    const value = Number(this.getAttribute("speed"));
    return this.hasAttribute("speed") && Number.isFinite(value)
      ? Math.max(0, value)
      : 1;
  }

  set speed(next: number) {
    this.setAttribute("speed", String(Math.max(0, Number(next) || 0)));
  }

  get interaction() {
    const value = Number(this.getAttribute("interaction"));
    return this.hasAttribute("interaction") && Number.isFinite(value)
      ? clamp(value)
      : 0.85;
  }

  set interaction(next: number) {
    this.setAttribute("interaction", String(clamp(Number(next) || 0)));
  }

  get phase() {
    const value = Number(this.getAttribute("phase"));
    return this.hasAttribute("phase") && Number.isFinite(value)
      ? Math.max(0, value)
      : 0;
  }

  set phase(next: number) {
    this.setAttribute("phase", String(Math.max(0, Number(next) || 0)));
  }

  pause() {
    this.playing = false;
    this.stopLoop();
  }

  play() {
    this.playing = true;
    if (this.wantsFrames()) this.startLoop();
  }

  private wantsFrames() {
    return this.playing && this.visible && !document.hidden;
  }

  private startLoop() {
    if (this.animationFrame) return;
    this.lastFrame = 0;
    this.animationFrame = requestAnimationFrame(this.render);
  }

  private stopLoop() {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;
    this.lastFrame = 0;
  }

  private onVisibilityChange = () => {
    if (this.wantsFrames()) this.startLoop();
    else this.stopLoop();
  };

  private refreshPalette = () => {
    const rootStyles = getComputedStyle(document.documentElement);
    this.background =
      rootStyles.getPropertyValue("--surface-page").trim() || "#ffffff";
    this.foreground =
      rootStyles.getPropertyValue("--text-primary").trim() || "#000000";
    if (this.visible && !this.animationFrame) this.draw();
  };

  private resize = () => {
    const rect = this.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const scale = Math.min(devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = rect.height;
    const width = Math.round(rect.width * scale);
    const height = Math.round(rect.height * scale);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.context.setTransform(scale, 0, 0, scale, 0, 0);
      this.draw();
    }
  };

  private updatePointer(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointerTarget = {
      x: clamp((event.clientX - rect.left) / rect.width),
      y: clamp((event.clientY - rect.top) / rect.height),
    };
  }

  private onPointerEnter = (event: PointerEvent) => {
    this.updatePointer(event);
    this.pointer = { ...this.pointerTarget };
    this.hoverTarget = 1;
    this.addHoverArea();
  };

  private onPointerMove = (event: PointerEvent) => {
    this.updatePointer(event);
  };

  private onPointerLeave = () => {
    this.hoverTarget = 0;
  };

  private onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    this.updatePointer(event);
    this.ripples.push({
      x: this.pointerTarget.x,
      y: this.pointerTarget.y,
      startedAt: this.elapsed,
      strength: 1.35,
    });
    if (this.ripples.length > MAX_RIPPLES) this.ripples.shift();
  };

  private addHoverArea() {
    this.hoverAreas.push({
      x: this.pointer.x,
      y: this.pointer.y,
      startedAt: this.interactionTime,
      seed: glyphNoise(
        Math.round(this.pointer.x * 1000),
        Math.round(this.pointer.y * 1000)
      ),
    });
    if (this.hoverAreas.length > MAX_HOVER_AREAS) this.hoverAreas.shift();
    this.lastHoverAreaAt = this.interactionTime;
  }

  private render = (now: number) => {
    const delta = this.lastFrame
      ? Math.min((now - this.lastFrame) / 1000, 0.05)
      : 0;
    this.lastFrame = now;
    this.elapsed += delta * this.speed * (this.reduceMotion ? 0.08 : 1) * 0.72;
    this.interactionTime += delta;
    const pointerEase = 1 - Math.exp(-delta * 8);
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * pointerEase;
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * pointerEase;
    if (
      this.hoverTarget &&
      this.interactionTime - this.lastHoverAreaAt > 0.11
    ) {
      this.addHoverArea();
    }
    this.hoverAreas = this.hoverAreas.filter(
      (area) => this.interactionTime - area.startedAt < 1.7
    );
    this.ripples = this.ripples.filter(
      (ripple) => this.elapsed - ripple.startedAt < 3.8
    );
    this.draw();
    if (this.wantsFrames()) {
      this.animationFrame = requestAnimationFrame(this.render);
    } else {
      this.animationFrame = 0;
    }
  };

  private draw() {
    if (!this.context || this.width < 1 || this.height < 1) return;
    const level = (this.value - 1) / 4;
    const cellWidth = 10 - level * 1.5;
    const cellHeight = 15 - level * 2;
    const columns = Math.ceil(this.width / cellWidth) + 1;
    const rows = Math.ceil(this.height / cellHeight) + 1;
    const aspect = this.width / this.height;
    const time = this.elapsed;

    const activeRipples = this.ripples.map((ripple) => {
      const age = time - ripple.startedAt;
      return {
        ...ripple,
        age,
        decay: Math.exp(-age * 0.7) * ripple.strength * this.interaction,
      };
    });
    const activeHoverAreas = this.hoverAreas.map((area) => ({
      ...area,
      fade:
        (1 - smoothstep(0.18, 1.7, this.interactionTime - area.startedAt)) *
        this.interaction,
    }));
    const correctedAspect = Math.max(aspect, 0.45);

    this.context.fillStyle = this.background;
    this.context.fillRect(0, 0, this.width, this.height);

    this.context.font = `${Math.max(9, cellHeight - 3)}px var(--font-departure-mono, ui-monospace, monospace)`;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";

    for (let row = 0; row < rows; row += 1) {
      const v = row / Math.max(1, rows - 1);
      const rowOffset = Math.sin(v * 7 + time) * 1.5;
      for (let column = 0; column < columns; column += 1) {
        const u = column / Math.max(1, columns - 1);
        const x = (u - 0.5) * aspect;
        const y = v - 0.5;
        const drift =
          Math.sin(x * (7 + level * 2) + Math.sin(y * 5 - time) * 1.8 - time) +
          Math.cos(
            y * (9 - level) + Math.sin(x * 4 + time * 0.7) * 1.5 + time * 0.62
          ) +
          Math.sin((x + y) * (11 + level * 3) - time * 0.9) * 0.65;
        let rippleWave = 0;
        for (const ripple of activeRipples) {
          const distance = Math.hypot(
            u - ripple.x,
            (v - ripple.y) / correctedAspect
          );
          const crest = distance - ripple.age * 0.19;
          rippleWave +=
            Math.sin(crest * 62) *
            Math.exp(-crest * crest * 260) *
            ripple.decay;
        }
        const field = drift + rippleWave;
        const threshold = 1.15 - level;
        let hoverArea = 0;
        for (const area of activeHoverAreas) {
          const areaX = u - area.x;
          const areaY = (v - area.y) / correctedAspect;
          // Beyond this box the exponential contribution is visually zero.
          if (Math.abs(areaX) > 0.45 || Math.abs(areaY) > 0.45) continue;
          const irregularity =
            Math.sin((u + area.seed) * 19) *
            Math.sin((v - area.seed) * 13) *
            0.018;
          const distance = Math.max(
            0,
            Math.hypot(areaX * 0.82, areaY * 1.12) + irregularity
          );
          hoverArea = Math.max(
            hoverArea,
            Math.exp(-distance * distance * 25) * area.fade
          );
        }
        const hoverResponse =
          hoverArea *
          (0.38 + smoothstep(threshold - 0.72, threshold + 0.16, field) * 0.62);
        const mass = smoothstep(threshold, threshold + 0.58, field);
        const edgeDistance = Math.abs(field - threshold);
        const flow =
          (1 - smoothstep(0.04, 0.52, edgeDistance)) *
          (1 - mass) *
          (0.32 + level * 0.28);
        const visibility = Math.max(mass, flow, hoverResponse * 0.54);
        if (visibility < 0.12) continue;
        const noise = glyphNoise(column, row);
        const glyphDensity =
          mass > flow
            ? clamp(0.42 + mass * 0.46 + noise * 0.12)
            : clamp(flow * 0.3 + hoverResponse * 0.12 + noise * 0.16);
        const character =
          CHARACTERS[Math.floor(glyphDensity * (CHARACTERS.length - 1))];
        const interactionLift = clamp(Math.abs(rippleWave) * 0.24);
        this.context.fillStyle = colorWithAlpha(
          this.foreground,
          clamp(
            0.18 + visibility * 0.68 + hoverResponse * 0.82 + interactionLift,
            0,
            0.98
          )
        );
        this.context.fillText(
          character,
          column * cellWidth + rowOffset,
          row * cellHeight
        );
      }
    }
    this.dispatchEvent(this.frameEvent);
  }
}

if (
  typeof customElements !== "undefined" &&
  !customElements.get("interactive-ascii")
) {
  customElements.define("interactive-ascii", InteractiveAscii);
}

export { InteractiveAscii };

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "interactive-ascii": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        value?: string;
        speed?: string;
        interaction?: string;
        phase?: string;
      };
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "interactive-ascii": InteractiveAscii;
  }
}
