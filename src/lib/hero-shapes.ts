import { FACE_EDGES, FACE_POINT_COUNT, FACE_POINTS } from "@/data/face";

/**
 * Every hero scene is a layout for the same pool of N particles. Hero3D
 * morphs the pool from one shape to the next, so adding a scene means adding
 * a builder here and listing it in `buildShapes`.
 */
export const N = FACE_POINT_COUNT;

type RGB = [number, number, number];

export type Shape = {
  name: string;
  /** Per-particle position, colour and world-space size. */
  pos: Float32Array;
  color: Float32Array;
  size: Float32Array;
  /** Index pairs for connecting lines. */
  edges: Uint16Array;
  lineOpacity: number;
  /** How much the scene follows the pointer (1 = fully). */
  lean: number;
  /** Seconds to rest on this shape before morphing on. */
  hold: number;
  /** Animates the dynamic particles; called every frame while visible. */
  update?: (t: number) => void;
};

const CYAN: RGB = [0.13, 0.83, 0.93];
const WHITE: RGB = [1, 1, 1];
const VIOLET: RGB = [0.42, 0.49, 1];

// Deterministic PRNG so the scenes look identical on every render.
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class Builder {
  pos = new Float32Array(N * 3);
  color = new Float32Array(N * 3);
  size = new Float32Array(N);
  edges: number[] = [];
  dynamic: Array<(t: number) => void> = [];
  next = 0;

  constructor(private name: string) {}

  set(i: number, x: number, y: number, z: number, c: RGB, s: number) {
    this.pos[i * 3] = x;
    this.pos[i * 3 + 1] = y;
    this.pos[i * 3 + 2] = z;
    this.color.set(c, i * 3);
    this.size[i] = s;
  }

  alloc() {
    if (this.next >= N) {
      throw new Error(`hero shape "${this.name}" needs more than ${N} particles`);
    }
    return this.next++;
  }

  point(x: number, y: number, c: RGB, s: number) {
    const i = this.alloc();
    this.set(i, x, y, 0, c, s);
    return i;
  }

  /** A line of particles joined by edges. */
  polyline(pts: [number, number][], c: RGB, s: number, closed = false) {
    const ids = pts.map(([x, y]) => this.point(x, y, c, s));
    for (let k = 0; k < ids.length - 1; k++) this.edges.push(ids[k], ids[k + 1]);
    if (closed && ids.length > 2) this.edges.push(ids[ids.length - 1], ids[0]);
    return ids;
  }

  /** A particle whose position, colour or size is recomputed every frame. */
  animated(fn: (t: number, set: (x: number, y: number, c: RGB, s: number) => void) => void) {
    const i = this.alloc();
    const set = (x: number, y: number, c: RGB, s: number) => this.set(i, x, y, 0, c, s);
    this.dynamic.push((t) => fn(t, set));
    set(0, 0, CYAN, 0);
  }

  finish(rand: () => number, extra: Omit<Shape, "pos" | "color" | "size" | "edges" | "name">): Shape {
    // Unused particles stay invisible until another shape needs them.
    for (let i = this.next; i < N; i++) {
      this.set(i, (rand() - 0.5) * 1.2, (rand() - 0.5) * 1.2, (rand() - 0.5) * 0.6, CYAN, 0);
    }
    const dynamic = this.dynamic;
    const update = dynamic.length
      ? (t: number) => {
          for (const fn of dynamic) fn(t);
        }
      : undefined;
    return {
      name: this.name,
      pos: this.pos,
      color: this.color,
      size: this.size,
      edges: Uint16Array.from(this.edges),
      update,
      ...extra,
    };
  }
}

/** Points around a rounded rectangle, spaced roughly `step` apart. */
function roundedRect(cx: number, cy: number, w: number, h: number, r: number, step: number) {
  const pts: [number, number][] = [];
  const hw = w / 2 - r;
  const hh = h / 2 - r;
  const side = (x0: number, y0: number, x1: number, y1: number) => {
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / step));
    for (let k = 0; k < n; k++) pts.push([x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n]);
  };
  const arc = (ax: number, ay: number, a0: number) => {
    const n = Math.max(2, Math.round((r * (Math.PI / 2)) / step));
    for (let k = 0; k < n; k++) {
      const a = a0 - ((Math.PI / 2) * k) / n;
      pts.push([ax + r * Math.cos(a), ay + r * Math.sin(a)]);
    }
  };
  side(cx - hw, cy + hh + r, cx + hw, cy + hh + r);
  arc(cx + hw, cy + hh, Math.PI / 2);
  side(cx + hw + r, cy + hh, cx + hw + r, cy - hh);
  arc(cx + hw, cy - hh, 0);
  side(cx + hw, cy - hh - r, cx - hw, cy - hh - r);
  arc(cx - hw, cy - hh, -Math.PI / 2);
  side(cx - hw - r, cy - hh, cx - hw - r, cy + hh);
  arc(cx - hw, cy + hh, Math.PI);
  return pts;
}

function networkShape(): Shape {
  const LAYERS = [4, 6, 6, 4];
  const DUST_COUNT = 160;
  const rand = mulberry32(7);
  const b = new Builder("network");

  const nodes: [number, number, number][] = [];
  const layerStart: number[] = [];
  LAYERS.forEach((count, l) => {
    layerStart.push(nodes.length);
    const x = (l - (LAYERS.length - 1) / 2) * 1.7;
    for (let i = 0; i < count; i++) {
      nodes.push([x, (i - (count - 1) / 2) * 0.8, (rand() - 0.5) * 1.2]);
    }
  });
  nodes.forEach(([x, y, z]) => {
    const i = b.alloc();
    b.set(i, x, y, z, WHITE, 0.16);
  });
  for (let l = 0; l < LAYERS.length - 1; l++) {
    for (let a = 0; a < LAYERS[l]; a++) {
      for (let c = 0; c < LAYERS[l + 1]; c++) {
        b.edges.push(layerStart[l] + a, layerStart[l + 1] + c);
      }
    }
  }
  for (let d = 0; d < DUST_COUNT; d++) {
    const i = b.alloc();
    b.set(i, (rand() - 0.5) * 12, (rand() - 0.5) * 12, (rand() - 0.5) * 12, VIOLET, 0.05);
  }
  // Hidden particles wait along random connections, ready to bloom into the next shape.
  const edgeCount = b.edges.length / 2;
  for (let i = b.next; i < N; i++) {
    const e = Math.floor(rand() * edgeCount) * 2;
    const a = nodes[b.edges[e]];
    const c = nodes[b.edges[e + 1]];
    const t = rand();
    b.set(
      i,
      a[0] + (c[0] - a[0]) * t + (rand() - 0.5) * 0.3,
      a[1] + (c[1] - a[1]) * t + (rand() - 0.5) * 0.3,
      a[2] + (c[2] - a[2]) * t + (rand() - 0.5) * 0.3,
      CYAN,
      0,
    );
  }
  b.next = N;
  return b.finish(rand, { lineOpacity: 0.18, lean: 1, hold: 4.5 });
}

function faceShape(): Shape {
  const FACE_SCALE = 1.75;
  const b = new Builder("face");
  for (let i = 0; i < N; i++) {
    const tone = FACE_POINTS[i * 4 + 3];
    const k = Math.pow(tone, 1.4);
    const col: RGB = [
      0.13 * 0.8 * (1 - k) + k,
      0.83 * 0.8 * (1 - k) + k,
      0.93 * 0.8 * (1 - k) + k,
    ];
    b.set(
      i,
      FACE_POINTS[i * 4] * FACE_SCALE,
      FACE_POINTS[i * 4 + 1] * FACE_SCALE,
      FACE_POINTS[i * 4 + 2] * FACE_SCALE,
      col,
      0.022 + 0.026 * tone,
    );
  }
  b.next = N;
  b.edges = FACE_EDGES.slice();
  return b.finish(mulberry32(1), { lineOpacity: 0.24, lean: 0.2, hold: 4.5 });
}

/** A desktop computer whose screen runs an "AI chat" animation. */
function computerShape(): Shape {
  const rand = mulberry32(21);
  const b = new Builder("computer");
  const SCREEN_Y = 0.4;

  // Static hardware.
  b.polyline(roundedRect(0, SCREEN_Y, 3.6, 2.4, 0.14, 0.05), CYAN, 0.05, true);
  b.polyline(roundedRect(0, SCREEN_Y, 3.2, 2.0, 0.08, 0.05), VIOLET, 0.04, true);
  b.polyline(
    [[-0.22, -0.8], [-0.3, -1.15], [0.3, -1.15], [0.22, -0.8]],
    CYAN,
    0.05,
  );
  b.polyline(roundedRect(0, -1.24, 1.5, 0.12, 0.05, 0.05), CYAN, 0.05, true);
  b.polyline(roundedRect(0, -1.82, 3.0, 0.5, 0.08, 0.05), CYAN, 0.045, true);

  // Keyboard keys twinkle as if someone is typing.
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 12; col++) {
      const x = -1.3 + col * 0.236;
      const y = -1.7 - row * 0.12;
      const phase = rand() * 10;
      b.animated((t, set) => {
        const k = 0.5 + 0.5 * Math.sin(t * 5 + phase);
        set(x, y, k > 0.85 ? WHITE : VIOLET, 0.035 + 0.02 * k);
      });
    }
  }

  // AI sparkle (four-point star) pulsing in the corner of the screen.
  const STAR = 90;
  for (let k = 0; k < STAR; k++) {
    const th = (k / STAR) * Math.PI * 2;
    b.animated((t, set) => {
      const s = 0.3 * (1 + 0.22 * Math.sin(t * 2.2));
      const x = -1.1 + Math.cos(th) ** 3 * s;
      const y = SCREEN_Y + 0.62 + Math.sin(th) ** 3 * s;
      set(x, y, WHITE, 0.04 + 0.015 * Math.sin(t * 3 + k));
    });
  }

  // Lines of "text" typing themselves out, then clearing.
  const lengths = [1.9, 2.2, 1.5, 2.0, 1.1];
  lengths.forEach((len, line) => {
    const y = SCREEN_Y + 0.78 - line * 0.3;
    const count = Math.floor(len / 0.045);
    for (let j = 0; j < count; j++) {
      const x = -0.75 + j * 0.045;
      b.animated((t, set) => {
        const phase = (t * 0.32 + line * 0.19) % 1.9;
        const typed = phase < 1.5 ? Math.min(1, phase / 1.0) : 0;
        const reach = j * 0.045;
        const visible = reach < len * typed;
        const head = reach > len * typed - 0.12;
        set(x, y, head ? WHITE : CYAN, visible ? 0.04 : 0);
      });
    }
  });

  // Three bouncing "thinking" dots.
  for (let g = 0; g < 3; g++) {
    for (let k = 0; k < 7; k++) {
      const a = (k / 7) * Math.PI * 2;
      b.animated((t, set) => {
        const lift = 0.1 * Math.abs(Math.sin(t * 3 - g * 0.8));
        set(-1.25 + g * 0.22 + Math.cos(a) * 0.05, SCREEN_Y - 0.5 + lift + Math.sin(a) * 0.05, VIOLET, 0.04);
      });
    }
  }

  // Scan line sweeping down the screen.
  for (let k = 0; k < 40; k++) {
    const x = -1.55 + (k / 39) * 3.1;
    b.animated((t, set) => {
      const y = SCREEN_Y + 0.98 - ((t * 0.45) % 1) * 1.96;
      set(x, y, CYAN, 0.03);
    });
  }

  return b.finish(rand, { lineOpacity: 0.4, lean: 0.35, hold: 6.5 });
}

export function buildShapes(): Shape[] {
  return [networkShape(), faceShape(), computerShape()];
}

export const MORPH_SECONDS = 2.4;

