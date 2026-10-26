// Turns scripts/face-source.png into the point graph used by the hero morph.
// Usage: node scripts/generate-face-points.mjs [targetPoints] [previewPath]
// Output: src/data/face.ts (points are x, y, z, tone; edges are index pairs).
//
// The source is a front-facing photo on a plain light background. Points are
// stippled like a halftone print: density and brightness follow the photo's own
// tones, so lit skin is a fine bright scatter while hair, brows, eyes and glasses
// stay sparse and dim, with a light edge boost to keep contours crisp. The
// background is masked out by flood-filling from the border.
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const TARGET = Number(process.argv[2] ?? 4200);
const PREVIEW = process.argv[3];
const SIZE = 400;
// Layout constants below were tuned on a 300px grid.
const F = SIZE / 300;

// Head layout inside the crop (tuned for scripts/face-source.png: hair to chin).
const CX = 150 * F;
const CY = 150 * F;
const HEAD_RX = 112 * F;
const HEAD_RY = 142 * F;
// Vertical centre of the whole face, so the group is centred on screen.
const OUT_CY = 150 * F;

const raw = (img) => img.raw().toBuffer();
const base = () =>
  sharp("scripts/face-source.png").greyscale().resize(SIZE, SIZE, { kernel: "lanczos3" });

const plain = await raw(base().normalise().blur(1.1));
const local = await raw(base().clahe({ width: 50, height: 50, maxSlope: 3 }).normalise().blur(1.1));

const rgb = await sharp("scripts/face-source.png")
  .resize(SIZE, SIZE, { kernel: "lanczos3" })
  .removeAlpha()
  .raw()
  .toBuffer();

const at = (buf, x, y) =>
  buf[Math.min(SIZE - 1, Math.max(0, y)) * SIZE + Math.min(SIZE - 1, Math.max(0, x))] / 255;

// Background mask: flood fill from the border over pixels close to the wall colour.
const bgSamples = [];
for (let i = 0; i < SIZE; i += 4) {
  for (const [x, y] of [[i, 2], [2, Math.floor(i * 0.5)], [SIZE - 3, Math.floor(i * 0.5)]]) {
    bgSamples.push([0, 1, 2].map((c) => rgb[(y * SIZE + x) * 3 + c]));
  }
}
const bgColor = [0, 1, 2].map((c) => {
  const v = bgSamples.map((s) => s[c]).sort((a, b) => a - b);
  return v[Math.floor(v.length / 2)];
});
const BG_TOLERANCE = 34;
const nearWall = (x, y) => {
  const i = (y * SIZE + x) * 3;
  return Math.hypot(rgb[i] - bgColor[0], rgb[i + 1] - bgColor[1], rgb[i + 2] - bgColor[2]) < BG_TOLERANCE;
};
const isBg = new Uint8Array(SIZE * SIZE);
const stack = [];
for (let i = 0; i < SIZE; i++) stack.push([i, 0], [0, i], [SIZE - 1, i]);
while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) continue;
  const k = y * SIZE + x;
  if (isBg[k] || !nearWall(x, y)) continue;
  isBg[k] = 1;
  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

// Sobel edge strength on the locally-contrasted image, normalised to 0..1.
const grad = new Float32Array(SIZE * SIZE);
let gMax = 0;
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const l = (dx, dy) => at(local, x + dx, y + dy);
    const gx = -l(-1, -1) - 2 * l(-1, 0) - l(-1, 1) + l(1, -1) + 2 * l(1, 0) + l(1, 1);
    const gy = -l(-1, -1) - 2 * l(0, -1) - l(1, -1) + l(-1, 1) + 2 * l(0, 1) + l(1, 1);
    const g = Math.hypot(gx, gy);
    grad[y * SIZE + x] = g;
    gMax = Math.max(gMax, g);
  }
}

const inHead = (x, y) => ((x - CX) / HEAD_RX) ** 2 + ((y - CY) / HEAD_RY) ** 2 <= 1;
// Neck below the chin (the white shirt is masked out with the wall).
const inLower = (x, y) => y > 255 * F && Math.abs(x - CX) < 72 * F;

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Thin dark details (eyes, brows, lens rims, lips, nostrils) are darker than their blurred surroundings.
const blurred = await raw(
  base().clahe({ width: 50, height: 50, maxSlope: 3 }).normalise().blur(SIZE / 40),
);

// Stretch brightness over the subject so skin shading uses the full range.
const subject = (x, y) => !isBg[y * SIZE + x] && (inHead(x, y) || inLower(x, y));
const lumAt = (x, y) => 0.5 * at(plain, x, y) + 0.5 * at(local, x, y);
const lums = [];
for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) if (subject(x, y)) lums.push(lumAt(x, y));
lums.sort((a, b) => a - b);
const LUM_LO = lums[Math.floor(lums.length * 0.04)];
const LUM_HI = lums[Math.floor(lums.length * 0.96)];

// Per-pixel measurements: sampling weight and tone (brightness of the dot).
// Lit skin is a dim-to-mid scatter shaped by the photo's shading; dark detail
// gets dense bright dots so it reads as contour; big dark masses (hair) stay sparse.
function measure(x, y) {
  if (!subject(x, y)) return null;
  const lum = Math.min(1, Math.max(0, (lumAt(x, y) - LUM_LO) / (LUM_HI - LUM_LO)));
  const lit = Math.pow(lum, 1.6);
  const edge = Math.min(1, Math.pow(grad[y * SIZE + x] / gMax, 0.6) * 1.4);
  const detail = Math.max(0, at(blurred, x, y) - at(local, x, y));
  const feat = Math.min(1, edge * 0.45 + detail * 6);
  // Large dark regions (the hair) get a mid-density, mid-tone mass so the head keeps its shape.
  const mass = Math.min(1, Math.max(0, (0.4 - at(blurred, x, y)) / 0.3));
  return {
    w: Math.min(1, 0.2 + 0.4 * lit + 0.8 * feat + 0.3 * mass),
    tone: Math.min(1, 0.08 + 0.42 * lit + 0.75 * feat + 0.32 * mass),
  };
}

// Blue-noise dart throwing: dense where the photo is lit, sparse where it is dark.
function sample(scale) {
  const rand = mulberry32(11);
  const cell = Math.max(1, scale * 2.4);
  const grid = new Map();
  const pts = [];
  for (let i = 0; i < 900000; i++) {
    const x = Math.floor(rand() * SIZE);
    const y = Math.floor(rand() * SIZE);
    const m = measure(x, y);
    if (!m || rand() > m.w) continue;
    const r = scale * (2.4 - 1.8 * m.w);
    const gx = Math.floor(x / cell);
    const gy = Math.floor(y / cell);
    let clash = false;
    for (let dx = -1; dx <= 1 && !clash; dx++) {
      for (let dy = -1; dy <= 1 && !clash; dy++) {
        const bucket = grid.get(`${gx + dx},${gy + dy}`);
        if (bucket && bucket.some((p) => (p.x - x) ** 2 + (p.y - y) ** 2 < r * r)) clash = true;
      }
    }
    if (clash) continue;
    const p = { x, y, tone: m.tone };
    pts.push(p);
    const key = `${gx},${gy}`;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key).push(p);
  }
  return pts;
}

// Tune the spacing so the count lands near the target.
let lo = 0.5;
let hi = 8;
let points = [];
for (let i = 0; i < 12; i++) {
  const mid = (lo + hi) / 2;
  points = sample(mid);
  if (points.length > TARGET) lo = mid;
  else hi = mid;
}

// Join each point to its nearest neighbours to form a constellation graph.
const edgeSet = new Set();
const maxDist = 16 * F;
points.forEach((p, i) => {
  points
    .map((q, j) => ({ j, d: Math.hypot(p.x - q.x, p.y - q.y) }))
    .filter(({ j, d }) => j !== i && d < maxDist)
    .sort((a, b) => a.d - b.d)
    .slice(0, 3)
    .forEach(({ j }) => edgeSet.add(i < j ? `${i},${j}` : `${j},${i}`));
});
const edges = [...edgeSet].flatMap((s) => s.split(",").map(Number));

// Gentle dome so the head has depth when it tilts.
const depth = (x, y) =>
  0.4 * Math.sqrt(Math.max(0, 1 - ((x - CX) / (125 * F)) ** 2 - ((y - OUT_CY) / (160 * F)) ** 2)) - 0.2;

const r3 = (n) => Math.round(n * 1000) / 1000;
const half = SIZE / 2;
const flat = points.flatMap((p) => [
  r3((p.x - CX) / half),
  r3(-(p.y - OUT_CY) / half),
  r3(depth(p.x, p.y)),
  r3(p.tone),
]);

writeFileSync(
  "src/data/face.ts",
  `// Generated by scripts/generate-face-points.mjs. Do not edit by hand.
// points: flat [x, y, z, tone] per point; edges: flat [a, b] index pairs.
export const FACE_POINT_COUNT = ${points.length};
export const FACE_POINTS: number[] = ${JSON.stringify(flat)};
export const FACE_EDGES: number[] = ${JSON.stringify(edges)};
`,
);
console.log(`points=${points.length} edges=${edges.length / 2}`);

if (PREVIEW) {
  const S = 840;
  const k = S / SIZE;
  const lines = [];
  for (let i = 0; i < edges.length; i += 2) {
    const a = points[edges[i]];
    const b = points[edges[i + 1]];
    lines.push(
      `<line x1="${a.x * k}" y1="${a.y * k}" x2="${b.x * k}" y2="${b.y * k}" stroke="#22d3ee" stroke-opacity="0.18"/>`,
    );
  }
  const dots = points.map((p) => {
    const t = Math.pow(p.tone, 1.4);
    const c = [0.13 * 0.8, 0.83 * 0.8, 0.93 * 0.8].map((v) => Math.round((v * (1 - t) + t) * 255));
    return `<circle cx="${p.x * k}" cy="${p.y * k}" r="${1.2 + p.tone * 1.6}" fill="rgb(${c})"/>`;
  });
  const svg = `<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#0a0a0a"/>${lines.join("")}${dots.join("")}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(PREVIEW);
}
