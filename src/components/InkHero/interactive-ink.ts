// @ts-nocheck
// Ported as-is from inkfoundation/ink-web-app (feat/homepage-redesign):
// src/app/[locale]/_components/HomeBoard/interactive-ink.ts
// Keep the two copies in sync when the shader changes.
// Docs-only addition: a `zoom` attribute (uZoom), driven by the home tuner,
// so the ink fills our wide hero as it thickens (the homepage panel is tall).
const vertexShader = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragmentShader = `
precision highp float;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uValue;
uniform float uHover;
uniform float uInteraction;
uniform float uEdge;
uniform float uZoom;
uniform vec4 uRipples[24];

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.,0.)), f.x), mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(.80, -.60, .60, .80);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = r * p * 2.03 + 9.7;
    a *= .5;
  }
  return v;
}

float smin(float a, float b, float k) {
  float h = clamp(.5 + .5 * (b-a) / k, 0., 1.);
  return mix(b, a, h) - k * h * (1.-h);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv - .5;
  p.x *= uResolution.x / uResolution.y;
  vec2 mouse = uPointer - .5;
  mouse.x *= uResolution.x / uResolution.y;
  float level = (uValue - 1.) / 4.;
  // Swing is centred on the rest value so the default pose stays put.
  // A fixed pose offset (not elapsed * level) keeps slider motion the same
  // after a minute as it is on the first frame.
  float swing = level - .5;
  float t = uTime * .205 + swing * 1.25;
  p *= 1.0 - swing * .28;
  p /= uZoom;

  float flow = fbm(p * (1.475 + swing * .55) + vec2(t * .22, -t * .15));
  float detail = fbm(p * 3.1 - vec2(t * .31, t * .19) + flow);
  vec2 warp = vec2(flow - .5, detail - .5) * (.40 + swing * .36);

  float pointerDistance = length(p - mouse);
  float pull = exp(-pointerDistance * pointerDistance * 60.) * uHover * uInteraction;
  vec2 water = (p - mouse) * pull * .62;
  float shimmer = 0.;
  for (int i = 0; i < 24; i++) {
    vec2 origin = uRipples[i].xy - .5;
    origin.x *= uResolution.x / uResolution.y;
    vec2 offset = p - origin;
    float distance = length(offset);
    float age = uRipples[i].z;
    float crest = distance - age * .12;
    float lifetime = 1. - smoothstep(3.5, 5., age);
    float envelope = exp(-crest * crest * 950.) * exp(-age * .52) * smoothstep(0., .18, age) * lifetime * uRipples[i].w * uInteraction;
    float wave = sin(crest * 95.) * envelope;
    water += offset / max(distance, .001) * wave * .030;
    // A broad depression remains along the path behind the travelling rings.
    float wake = exp(-distance * distance * 110.) * exp(-age * .72) * smoothstep(0., .12, age) * lifetime * uRipples[i].w * uInteraction;
    water += offset * wake * .085;
    shimmer += wave;
  }
  p += warp + water;

  float ribbonA = abs(p.x + .20 * sin(p.y * 2.2 + t) - .10 * sin(p.y * 5. - t * .6)) - (.1075 + swing * .14);
  float ribbonB = abs((p.x + p.y * .43) - .18 * sin(p.y * 2.7 - t * .78) + .17) - (.0575 + swing * .09);
  vec2 c1 = p - vec2(.16 + .13 * sin(t * .67) + swing * .10, .05 + .28 * sin(t * .39));
  c1.x *= 1.45;
  float bulb = length(c1) - (.22 + .07 * sin(t * .5) + swing * .08);
  vec2 c2 = p - vec2(-.24 + .11 * cos(t * .53), -.36 + .13 * sin(t * .61) - swing * .08);
  c2.y *= 1.35;
  float bulb2 = length(c2) - (.1775 + swing * .12);
  float d = smin(ribbonA, ribbonB, .11);
  d = smin(d, bulb, .14);
  d = smin(d, bulb2, .09);

  // Hollow membranes keep the mass looking translucent and cellular.
  float membrane = abs(length(c1) - (.115 + .03 * sin(t + p.y * 4.))) - .022;
  d = max(d, -membrane);
  d += (detail - .5) * (.035 + level * .022);

  float aa = 1.5 / uResolution.y;
  // A slow focus field makes the contour breathe between crisp and diffused.
  float edgeFlow = fbm(p * 1.75 + vec2(-t * .52, t * .31) + flow * .28);
  edgeFlow = smoothstep(.18, .82, edgeFlow);
  float edgeWidth = mix(.0015, .065, uEdge) * mix(.24, 1.82, edgeFlow);
  float body = 1. - smoothstep(-edgeWidth - aa, edgeWidth + aa, d);
  float softBody = 1. - smoothstep(.015, .115 + level * .03, d);
  float bloomFalloff = (19. - level * 4.) * mix(1.45, .58, edgeFlow);
  float bloom = exp(-max(d, 0.) * bloomFalloff) * (1. - body);
  float rim = exp(-abs(d) * mix(68., 31., edgeFlow)) * mix(.22, .82, edgeFlow);

  vec3 paper = vec3(.987, .982, 1.0);
  vec3 violet = vec3(.34, .20, .92);
  vec3 lilac = vec3(.69, .57, 1.0);
  vec3 color = paper;
  color = mix(color, lilac, bloom * (.22 + level * .18) * mix(.32, 1.55, edgeFlow));
  color = mix(color, violet, rim * (.25 + level * .12));
  vec3 ink = vec3(.004, .003, .009) + violet * max(0., flow - .60) * .16;
  color = mix(color, ink, body * (.93 + .07 * smoothstep(.35,.7,detail)));
  color += violet * softBody * (1.-body) * mix(.018, .105, edgeFlow);
  color += vec3(.36, .28, .55) * shimmer * .055;
  float grain = hash(gl_FragCoord.xy + floor(uTime * 24.)) - .5;
  color += grain * .010;
  color *= .99 + .03 * smoothstep(.9,.15,length(uv-.5));
  gl_FragColor = vec4(color, 1.0);
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(shader));
  return shader;
}

// HTMLElement does not exist in Node. Extending a dummy base keeps this
// module importable during server rendering, where the element is never
// instantiated; the browser build still extends the real HTMLElement.
const HTMLElementBase =
  typeof HTMLElement !== "undefined" ? HTMLElement : class {};

class InteractiveInk extends HTMLElementBase {
  static observedAttributes = [
    "value",
    "speed",
    "interaction",
    "edge",
    "blur",
    "phase",
    "zoom",
  ];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<style>:host{display:block;contain:layout paint;overflow:hidden;background:var(--surface-page,#fff)}canvas{display:block;width:100%;height:100%;touch-action:pan-y;transform-origin:center;transition:filter 180ms cubic-bezier(.2,0,0,1),transform 180ms cubic-bezier(.2,0,0,1)}div{display:none;height:100%;place-items:center;color:var(--text-secondary,#808080);font:12px/16px var(--board-font,system-ui);background:radial-gradient(circle at 45% 35%,color-mix(in srgb,var(--accent,#9e70ff) 28%,transparent),transparent 26%),var(--surface-page,#fff)}:host([fallback]) div{display:grid}:host([fallback]) canvas{display:none}@media(prefers-reduced-motion:reduce){canvas{transition-duration:0ms}}</style><canvas part="canvas"></canvas><div>Ink animation requires WebGL</div>`;
    this.canvas = this.shadowRoot.querySelector("canvas");
    this.pointer = [0.5, 0.5];
    this.pointerTarget = [0.5, 0.5];
    this.hover = 0;
    this.hoverTarget = 0;
    this.elapsed = 0;
    this.waterTime = 0;
    this.lastRipple = -1;
    this.ripples = [];
    this.rippleData = new Float32Array(96);
    this.lastFrame = 0;
    this.playing = true;
    this.visible = true;
    this.reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  wantsFrames() {
    return this.playing && this.visible && !document.hidden;
  }

  startLoop() {
    if (this.raf) return;
    this.lastFrame = 0;
    this.raf = requestAnimationFrame(this.render);
  }

  stopLoop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.lastFrame = 0;
  }

  onPageVisibility = () => {
    if (this.wantsFrames()) this.startLoop();
    else this.stopLoop();
  };

  connectedCallback() {
    try {
      this.setupGL();
    } catch (error) {
      console.warn(error);
      this.setAttribute("fallback", "");
      return;
    }
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this);
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.wantsFrames()) this.startLoop();
      else this.stopLoop();
    });
    this.intersectionObserver.observe(this);
    document.addEventListener("visibilitychange", this.onPageVisibility);
    this.canvas.addEventListener("pointerenter", this.onEnter);
    this.canvas.addEventListener("pointermove", this.onMove);
    this.canvas.addEventListener("pointerleave", this.onLeave);
    this.canvas.addEventListener("pointercancel", this.onLeave);
    this.canvas.addEventListener("pointerdown", this.onPress);
    this.canvas.addEventListener("pointerup", this.onRelease);
    this.canvas.addEventListener("webglcontextlost", this.onContextLost);
    this.updateCanvasStyle();
    this.resize();
    this.startLoop();
  }

  disconnectedCallback() {
    this.stopLoop();
    document.removeEventListener("visibilitychange", this.onPageVisibility);
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
  }

  attributeChangedCallback(name) {
    if (name === "blur") this.updateCanvasStyle();
    if (name === "phase") this.elapsed = this.phase;
    // The active animation loop will draw the latest value. Drawing here as
    // well made slider updates render the entire canvas twice in one frame.
    if (this.gl && this.visible && !document.hidden && !this.raf) this.draw();
  }
  get value() {
    const value = Number(this.getAttribute("value"));
    return this.hasAttribute("value") && Number.isFinite(value)
      ? Math.max(1, Math.min(5, value))
      : 3;
  }
  set value(next) {
    this.setAttribute("value", String(Math.max(1, Math.min(5, Number(next)))));
  }
  get speed() {
    const value = Number(this.getAttribute("speed"));
    return this.hasAttribute("speed") && Number.isFinite(value)
      ? Math.max(0, value)
      : 1;
  }
  set speed(next) {
    this.setAttribute("speed", String(Math.max(0, Number(next) || 0)));
  }
  get interaction() {
    const value = Number(this.getAttribute("interaction"));
    return this.hasAttribute("interaction") && Number.isFinite(value)
      ? Math.max(0, Math.min(1, value))
      : 0.7;
  }
  set interaction(next) {
    this.setAttribute(
      "interaction",
      String(Math.max(0, Math.min(1, Number(next) || 0)))
    );
  }
  get edge() {
    const value = Number(this.getAttribute("edge"));
    return this.hasAttribute("edge") && Number.isFinite(value)
      ? Math.max(0, Math.min(1, value))
      : 0;
  }
  set edge(next) {
    this.setAttribute(
      "edge",
      String(Math.max(0, Math.min(1, Number(next) || 0)))
    );
  }
  get blur() {
    const value = Number(this.getAttribute("blur"));
    return this.hasAttribute("blur") && Number.isFinite(value)
      ? Math.max(0, Math.min(18, value))
      : 0;
  }
  set blur(next) {
    this.setAttribute(
      "blur",
      String(Math.max(0, Math.min(18, Number(next) || 0)))
    );
  }
  // Docs-only: magnifies the ink around the centre (1 = homepage framing)
  get zoom() {
    const value = Number(this.getAttribute("zoom"));
    return this.hasAttribute("zoom") && Number.isFinite(value)
      ? Math.max(0.25, Math.min(4, value))
      : 1;
  }
  // Animation seconds to seed the clock with, so the first frame is a chosen pose
  // rather than always the t = 0 one. Setting it later re-seeks the animation.
  get phase() {
    const value = Number(this.getAttribute("phase"));
    return this.hasAttribute("phase") && Number.isFinite(value)
      ? Math.max(0, value)
      : 0;
  }
  set phase(next) {
    this.setAttribute("phase", String(Math.max(0, Number(next) || 0)));
  }
  updateCanvasStyle() {
    if (!this.canvas) return;
    this.canvas.style.filter = `blur(${this.blur}px)`;
    this.canvas.style.transform = `scale(${1 + this.blur / 150})`;
  }
  pause() {
    this.playing = false;
    this.stopLoop();
  }
  play() {
    this.playing = true;
    if (this.visible && !document.hidden) this.startLoop();
  }

  setupGL() {
    const gl = (this.gl = this.canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
      // nav-glass.js samples this canvas with drawImage, which reads black once
      // the frame has been composited unless the drawing buffer is preserved.
      preserveDrawingBuffer: true,
    }));
    if (!gl) throw new Error("WebGL unavailable");
    const program = (this.program = gl.createProgram());
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentShader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const location = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    this.uniforms = Object.fromEntries(
      [
        "uResolution",
        "uPointer",
        "uTime",
        "uValue",
        "uHover",
        "uInteraction",
        "uEdge",
        "uZoom",
      ].map((name) => [name, gl.getUniformLocation(program, name)])
    );
    this.uniforms.uRipples = gl.getUniformLocation(program, "uRipples[0]");
  }

  resize() {
    if (!this.gl) return;
    const rect = this.getBoundingClientRect();
    // Keep the last valid frame during transient zero-size responsive layouts.
    if (rect.width < 1 || rect.height < 1) return;
    const scale = Math.min(devicePixelRatio || 1, 1.75);
    const width = Math.round(rect.width * scale);
    const height = Math.round(rect.height * scale);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.gl.viewport(0, 0, width, height);
      // Resizing clears WebGL's drawing buffer; repaint before the browser
      // composites the frame so the canvas never flashes black.
      this.draw();
    }
  }

  addRipple(strength = 0.5) {
    if (this.reduceMotion) return;
    this.ripples.push({
      x: this.pointerTarget[0],
      y: this.pointerTarget[1],
      time: this.waterTime,
      strength,
    });
    if (this.ripples.length > 24) this.ripples.shift();
    this.lastRipple = this.waterTime;
  }
  onEnter = (event) => {
    this.onMove(event);
    this.pointer = [...this.pointerTarget];
    this.hoverTarget = 1;
    this.addRipple(0.85);
  };
  onPress = (event) => {
    this.onMove(event);
    this.hoverTarget = 1;
    this.addRipple(1.6);
  };
  onRelease = (event) => {
    if (event.pointerType === "touch") this.onLeave();
  };
  onLeave = () => {
    this.hoverTarget = 0;
  };
  onMove = (event) => {
    const rect = this.canvas.getBoundingClientRect();
    const next = [
      (event.clientX - rect.left) / rect.width,
      1 - (event.clientY - rect.top) / rect.height,
    ];
    const movement = Math.hypot(
      next[0] - this.pointerTarget[0],
      next[1] - this.pointerTarget[1]
    );
    this.pointerTarget = next;
    if (
      this.hoverTarget &&
      movement > 0.001 &&
      this.waterTime - this.lastRipple > 0.12
    )
      this.addRipple(Math.min(1.1, 0.5 + movement * 14));
  };
  onContextLost = (event) => {
    event.preventDefault();
    cancelAnimationFrame(this.raf);
    this.setAttribute("fallback", "");
  };

  render = (now) => {
    const delta = this.lastFrame
      ? Math.min((now - this.lastFrame) / 1000, 0.05)
      : 0;
    this.lastFrame = now;
    this.waterTime += delta;
    if (this.playing && this.visible)
      this.elapsed += delta * this.speed * (this.reduceMotion ? 0.12 : 1);
    const easing = 1 - Math.pow(0.002, delta || 0.016);
    this.pointer[0] += (this.pointerTarget[0] - this.pointer[0]) * easing;
    this.pointer[1] += (this.pointerTarget[1] - this.pointer[1]) * easing;
    this.hover +=
      (this.hoverTarget - this.hover) *
      (1 - Math.exp(-delta * (this.hoverTarget ? 4 : 1.7)));
    if (this.visible) this.draw();
    if (this.wantsFrames()) this.raf = requestAnimationFrame(this.render);
    else this.raf = 0;
  };

  draw() {
    const gl = this.gl;
    if (!gl) return;
    gl.uniform2f(
      this.uniforms.uResolution,
      this.canvas.width,
      this.canvas.height
    );
    gl.uniform2f(this.uniforms.uPointer, this.pointer[0], this.pointer[1]);
    gl.uniform1f(this.uniforms.uTime, this.elapsed);
    gl.uniform1f(this.uniforms.uValue, this.value);
    gl.uniform1f(this.uniforms.uHover, this.hover);
    gl.uniform1f(this.uniforms.uInteraction, this.interaction);
    gl.uniform1f(this.uniforms.uEdge, this.edge);
    gl.uniform1f(this.uniforms.uZoom, this.zoom);
    this.rippleData.fill(0);
    this.ripples = this.ripples.filter(
      (ripple) => this.waterTime - ripple.time < 5
    );
    this.ripples.forEach((ripple, index) =>
      this.rippleData.set(
        [ripple.x, ripple.y, this.waterTime - ripple.time, ripple.strength],
        index * 4
      )
    );
    gl.uniform4fv(this.uniforms.uRipples, this.rippleData);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    this.dispatchEvent(new Event("inkframe"));
  }
}

if (
  typeof customElements !== "undefined" &&
  !customElements.get("interactive-ink")
)
  customElements.define("interactive-ink", InteractiveInk);
export { InteractiveInk };

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "interactive-ink": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        value?: string;
        speed?: string;
        interaction?: string;
        edge?: string;
        blur?: string;
        phase?: string;
      };
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "interactive-ink": InteractiveInk;
  }
}
