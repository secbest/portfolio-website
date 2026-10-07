# Pac-Man hero scene (draft, currently disabled)

A fourth scene for the hero particle morph: Pac-Man chomps along a blue corridor eating pellets while a red ghost chases him. It was working and verified in the browser, then removed from the cycle by request. It is kept here so it can be brought back.

## What it looks like

- Two blue rounded walls form a corridor.
- Pac-Man is a yellow disc of particles whose mouth opens and closes.
- Pellets along the corridor disappear as he passes; the end pellets are larger and pulse.
- A red ghost with eyes follows about two seconds behind, its hem wobbling.
- Both characters leave through the tunnel ends (size fades to zero) and the lap restarts every 7 seconds.
- Layout is about 4.4 units wide, so it overlaps the left edge of the hero text on narrower desktops. Shrink WALL and RUN if you bring it back.

## How to re-enable it

1. Paste the helper and the function below into src/lib/hero-shapes.ts. They rely on Builder, oundedRect, mulberry32, WHITE and the RGB type, which already live in that file.
2. Add it to the list in uildShapes:

```ts
export function buildShapes(): Shape[] {
  return [networkShape(), faceShape(), computerShape(), pacmanShape()];
}
```

3. Nothing else needs to change. Hero3D.tsx reads the shape list generically, so the cycle, line fades and morphs pick it up automatically. The scene rests for hold: 7.5 seconds.

## Code

Helper (put it above the Builder class):

```ts
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
```

Scene (put it above uildShapes):

```ts
/** Pac-Man chomping along a corridor, chased by a ghost. */
function pacmanShape(): Shape {
  const rand = mulberry32(33);
  const b = new Builder("pacman");
  const BLUE: RGB = [0.2, 0.4, 1];
  const YELLOW: RGB = [1, 0.85, 0.1];
  const RED: RGB = [1, 0.22, 0.3];
  const PERIOD = 7;
  const WALL = 2.2;
  const RUN = 2.5;

  // Corridor walls.
  b.polyline(roundedRect(0, 1.0, WALL * 2, 0.35, 0.12, 0.05), BLUE, 0.05, true);
  b.polyline(roundedRect(0, -1.0, WALL * 2, 0.35, 0.12, 0.05), BLUE, 0.05, true);

  // Characters slide in and out through the tunnel ends.
  const tunnel = (x: number) => 1 - smooth(WALL - 0.35, WALL + 0.1, Math.abs(x));
  const pacX = (t: number) => -RUN + 2 * RUN * ((t / PERIOD) % 1);

  // Pellets, eaten as Pac-Man passes.
  for (let m = 0; m < 12; m++) {
    const x = -1.9 + m * 0.345;
    const power = m === 0 || m === 11;
    const reps = power ? 7 : 3;
    for (let k = 0; k < reps; k++) {
      const a = (k / reps) * Math.PI * 2;
      const rad = power ? 0.07 : 0.02;
      b.animated((t, set) => {
        const eaten = pacX(t) > x - 0.1;
        const pulse = power ? 0.05 + 0.02 * Math.sin(t * 8) : 0.045;
        set(x + Math.cos(a) * rad, Math.sin(a) * rad, WHITE, eaten ? 0 : pulse);
      });
    }
  }

  // Pac-Man: a disc with a mouth that opens and closes.
  const PAC = 250;
  const R = 0.46;
  for (let k = 0; k < PAC; k++) {
    const r = R * Math.sqrt((k + 0.5) / PAC);
    const phi0 = Math.atan2(Math.sin(k * 2.39996), Math.cos(k * 2.39996));
    b.animated((t, set) => {
      const mouth = 0.04 + 0.6 * (0.5 + 0.5 * Math.sin(t * 7));
      const phi = Math.abs(phi0) < mouth ? Math.sign(phi0 || 1) * mouth : phi0;
      const cx = pacX(t);
      set(cx + r * Math.cos(phi), r * Math.sin(phi), YELLOW, 0.05 * tunnel(cx));
    });
  }

  // Ghost chasing a short way behind.
  const GR = 0.42;
  // The ghost runs the same lap, a couple of seconds behind.
  const wrapGhost = (t: number) => pacX(t - 1.96);
  for (let row = 0; row <= 12; row++) {
    const y = -GR + row * 0.07;
    const halfW = y > 0 ? Math.sqrt(Math.max(0, GR * GR - y * y)) : GR;
    const n = Math.max(1, Math.round((halfW * 2) / 0.06));
    for (let k = 0; k < n; k++) {
      const x = n === 1 ? 0 : -halfW + (k / (n - 1)) * halfW * 2;
      const bottom = row <= 1;
      b.animated((t, set) => {
        const gx = wrapGhost(t);
        const wave = bottom ? 0.045 * Math.sin(x * 14 + t * 9) : 0;
        set(gx + x, y + wave, RED, 0.05 * tunnel(gx));
      });
    }
  }
  for (const side of [-1, 1]) {
    for (let k = 0; k < 7; k++) {
      const a = (k / 7) * Math.PI * 2;
      b.animated((t, set) => {
        const gx = wrapGhost(t);
        set(gx + side * 0.15 + Math.cos(a) * 0.08, 0.1 + Math.sin(a) * 0.08, WHITE, 0.045 * tunnel(gx));
      });
    }
    b.animated((t, set) => {
      const gx = wrapGhost(t);
      set(gx + side * 0.15 + 0.06, 0.1, BLUE, 0.06 * tunnel(gx));
    });
  }

  return b.finish(rand, { lineOpacity: 0.35, lean: 0.15, hold: 7.5 });
}
```
