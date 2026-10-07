// Turns scripts/face-source.png into the point graph used by the hero morph.
// Usage: node scripts/generate-face-points.mjs [targetPoints] [previewPath]
// Output: src/data/face.ts (points are x, y, z, tone; edges are index pairs).
//
// The source is a front-facing photo on a plain light background. Points are
// stippled where the image has "ink" (hair, glasses, brows, eyes, nose, mouth,
// jaw, collar) and sparsely over flat skin, then joined to nearest neighbours.
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const TARGET = Number(process.argv[2] ?? 3000);
const PREVIEW = process.argv[3];
const SIZE = 300;

// Head layout inside the 300px crop (tuned for scripts/face-source.png: hair to chin).
const CX = 150;
const CY = 150;
const HEAD_RX = 112;
const HEAD_RY = 142;
// Vertical centre of the whole face, so the group is centred on screen.
const OUT_CY = 150;

const raw = (img) => img.raw().toBuffer();
const base = () =>
  sharp("scripts/face-source.png").greyscale().resize(SIZE, SIZE, { kernel: "lanczos3" });

const plain = await raw(base().normalise());
const local = await raw(base().clahe({ width: 40, height: 40, maxSlope: 3 }).normalise());
const blurred = await raw(
  base().clahe({ width: 40, height: 40, maxSlope: 3 }).normalise().blur(SIZE / 28),
);

// Redness picks out the lips; skin is red too, so use the local difference.
const rgb = await sharp("scripts/face-source.png")
  .resize(SIZE, SIZE, { kernel: "lanczos3" })
  .removeAlpha()
  .raw()
  .toBuffer();
const redRaw = Buffer.alloc(SIZE * SIZE);
for (let i = 0; i < SIZE * SIZE; i++) {
  const v = 128 + (rgb[i * 3] - rgb[i * 3 + 1]) * 3;
  redRaw[i] = Math.min(255, Math.max(0, v));
}
const redBlur = await sharp(redRaw, { raw: { width: SIZE, height: SIZE, channels: 1 } })
  .blur(SIZE / 30)
  .toColourspace("b-w")
  .raw()
  .toBuffer();

const at = (buf, x, y) =>
  buf[Math.min(SIZE - 1, Math.max(0, y)) * SIZE + Math.min(SIZE - 1, Math.max(0, x))] / 255;

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
// Neck and collar below the chin.
const inLower = (x, y) => y > 255 && Math.abs(x - CX) < 72;

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

// Per-pixel measurements: sampling weight and tone (brightness of the dot).
// Features (edges, eyes, brows, glasses, lips) get dense, bright dots so they
// read as contours; dark hair is a mid-bright mass; plain skin is sparse and dim.
function measure(x, y) {
  if (!inHead(x, y) && !inLower(x, y)) return null;
  const l = at(plain, x, y);
  // Square-root boost so faint contours (nose sides, philtrum, jaw) register too.
  const edge = Math.min(1, Math.pow(grad[y * SIZE + x] / gMax, 0.6) * 2);
  const dog = Math.max(0, at(blurred, x, y) - at(local, x, y));
  const red = Math.max(0, at(redRaw, x, y) - at(redBlur, x, y));
  const feat = Math.min(1, edge * 0.7 + dog * 7 + red * 4);
  const dark = Math.min(1, Math.max(0, (0.55 - l) / 0.4));
  return {
    w: Math.min(1, 0.28 + 0.3 * dark + 0.9 * feat),
    tone: Math.min(1, 0.18 + 0.32 * dark + 0.9 * feat),
  };
}
// Blue-noise dart throwing: dense on ink, sparse on flat skin.
function sample(scale) {
  const rand = mulberry32(11);
  const pts = [];
  for (let i = 0; i < 600000; i++) {
    const x = Math.floor(rand() * SIZE);
    const y = Math.floor(rand() * SIZE);
    const m = measure(x, y);
    if (!m || rand() > m.w) continue;
    const r = scale * (2.4 - 1.8 * m.w);
    if (pts.some((p) => (p.x - x) ** 2 + (p.y - y) ** 2 < r * r)) continue;
    pts.push({ x, y, tone: m.tone });
  }
  return pts;
}

// Tune the spacing so the count lands near the target.
let lo = 0.5;
let hi = 6;
let points = [];
for (let i = 0; i < 12; i++) {
  const mid = (lo + hi) / 2;
  points = sample(mid);
  if (points.length > TARGET) lo = mid;
  else hi = mid;
}

// Join each point to its nearest neighbours to form a constellation graph.
const edgeSet = new Set();
const maxDist = 16;
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
  0.4 * Math.sqrt(Math.max(0, 1 - ((x - CX) / 125) ** 2 - ((y - OUT_CY) / 160) ** 2)) - 0.2;

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
      `<line x1="${a.x * k}" y1="${a.y * k}" x2="${b.x * k}" y2="${b.y * k}" stroke="#22d3ee" stroke-opacity="0.3"/>`,
    );
  }
  const dots = points.map((p) => {
    const c = p.tone > 0.6 ? "#fff" : "#22d3ee";
    return `<circle cx="${p.x * k}" cy="${p.y * k}" r="${1.6 + p.tone * 1.6}" fill="${c}"/>`;
  });
  const svg = `<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#0a0a0a"/>${lines.join("")}${dots.join("")}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(PREVIEW);
}










