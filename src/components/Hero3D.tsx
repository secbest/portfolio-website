"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import {
  AdditiveBlending,
  BufferAttribute,
  DynamicDrawUsage,
  type Group,
  type LineBasicMaterial,
  type PointsMaterial,
  type ShaderMaterial,
  Vector3,
} from "three";
import FaceGreeting from "@/components/FaceGreeting";
import { MORPH_SECONDS, N, buildShapes, mulberry32 } from "@/lib/hero-shapes";

const ACCENT = "#22d3ee";
const PULSES = 36;

const shapes = buildShapes();
const NETWORK = 0;
const FACE = shapes.findIndex((s) => s.name === "face");
const CYCLE = shapes.reduce((sum, s) => sum + s.hold + MORPH_SECONDS, 0);

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Which shape we're on, which is next, and how far the morph between them is (0..1). */
function stateAt(t: number) {
  let p = t % CYCLE;
  for (let i = 0; i < shapes.length; i++) {
    const next = (i + 1) % shapes.length;
    if (p < shapes[i].hold) return { a: i, b: next, m: 0 };
    p -= shapes[i].hold;
    if (p < MORPH_SECONDS) return { a: i, b: next, m: p / MORPH_SECONDS };
    p -= MORPH_SECONDS;
  }
  return { a: 0, b: 1, m: 0 };
}

// Per-particle randomness: staggered start and a curved path through space.
const rand = mulberry32(5);
const delay = new Float32Array(N);
const swirl = new Float32Array(N * 3);
for (let i = 0; i < N; i++) {
  const ang = rand() * Math.PI * 2;
  swirl.set([Math.cos(ang), Math.sin(ang), (rand() - 0.5) * 2], i * 3);
  delay[i] = rand();
}

// Live buffers shared by the points and every line set.
const positions = new Float32Array(shapes[NETWORK].pos);
const colors = new Float32Array(shapes[NETWORK].color);
const sizes = new Float32Array(shapes[NETWORK].size);
const positionAttr = new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage);
const colorAttr = new BufferAttribute(colors, 3).setUsage(DynamicDrawUsage);
const sizeAttr = new BufferAttribute(sizes, 1).setUsage(DynamicDrawUsage);
const lineIndex = shapes.map((s) => new BufferAttribute(s.edges, 1));
const pulsePositions = new Float32Array(PULSES * 3);

const networkEdges = shapes[NETWORK].edges;
const pulseSeeds = Array.from({ length: PULSES }, (_, i) => ({
  edge: (i * 13) % (networkEdges.length / 2),
  t: (i * 0.137) % 1,
  speed: 0.15 + ((i * 7) % 10) * 0.025,
}));

const pointsVertex = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  uniform float uPx;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    // GPUs draw a 1px dot even at size 0, so park unused particles off-screen.
    if (aSize < 0.002) {
      gl_Position = vec4(10.0, 10.0, 10.0, 1.0);
      gl_PointSize = 0.0;
      return;
    }
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPx / -mv.z;
  }
`;

const pointsFragment = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor, smoothstep(0.5, 0.15, d));
  }
`;

type GreetingPos = { show: boolean; x: number; y: number };
const anchor = new Vector3();

function Scene({
  animate,
  onGreeting,
}: {
  animate: boolean;
  onGreeting: (g: GreetingPos) => void;
}) {
  const group = useRef<Group>(null);
  const pointsMat = useRef<ShaderMaterial>(null);
  const lineMats = useRef<(LineBasicMaterial | null)[]>([]);
  const pulseMat = useRef<PointsMaterial>(null);
  const pulseAttr = useRef<BufferAttribute>(null);
  const pulseState = useRef(pulseSeeds.map((p) => ({ ...p })));
  const { viewport, size, gl, camera } = useThree();
  const greetingShown = useRef(false);
  // Which static shape is already in the buffers, so we can skip redundant work.
  const settled = useRef(-1);

  const wide = viewport.width > 8;
  const scale = Math.min(1, viewport.width / 7.5);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const { a, b, m } = animate ? stateAt(state.clock.elapsedTime) : { a: 0, b: 0, m: 0 };
    const from = shapes[a];
    const to = shapes[b];

    // Greet once the face has mostly formed, and hide as it starts to dissolve.
    const faceVisible = animate && ((b === FACE && m > 0.75) || (a === FACE && m < 0.2));
    if (faceVisible !== greetingShown.current) {
      greetingShown.current = faceVisible;
      // Project the spot under the chin to screen pixels for the HTML overlay.
      anchor.set(g.position.x, g.position.y - 2.15 * scale, 0).project(camera);
      onGreeting({
        show: faceVisible,
        x: (anchor.x * 0.5 + 0.5) * size.width,
        y: (-anchor.y * 0.5 + 0.5) * size.height,
      });
    }

    if (animate) {
      from.update?.(state.clock.elapsedTime);
      if (m > 0) to.update?.(state.clock.elapsedTime);
    }

    // Per-particle morph with a staggered start and an arc through space.
    // Static shapes at rest are already in the buffers, so skip the work.
    const idle = m === 0 && !from.update;
    const redraw = !(idle && settled.current === a);
    settled.current = idle ? a : -1;
    for (let i = 0; redraw && i < N; i++) {
      const local = Math.min(1, Math.max(0, (m - delay[i] * 0.35) / 0.65));
      const e = easeInOut(local);
      const arc = Math.sin(Math.PI * e) * 0.9;
      const k = i * 3;
      for (let c = 0; c < 3; c++) {
        positions[k + c] =
          from.pos[k + c] + (to.pos[k + c] - from.pos[k + c]) * e + swirl[k + c] * arc;
        colors[k + c] = from.color[k + c] + (to.color[k + c] - from.color[k + c]) * e;
      }
      sizes[i] = from.size[i] + (to.size[i] - from.size[i]) * e;
    }
    if (redraw) {
      positionAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;
    }

    if (pointsMat.current) {
      const fovRad = ((camera as { fov?: number }).fov ?? 45) * (Math.PI / 180);
      pointsMat.current.uniforms.uPx.value =
        (size.height * gl.getPixelRatio()) / (2 * Math.tan(fovRad / 2));
    }

    // Each shape's lines fade out as it leaves and in as it arrives.
    const weight = (s: number) =>
      a === b
        ? s === a
          ? 1
          : 0
        : (s === a ? 1 - smooth(0, 0.3, m) : 0) + (s === b ? smooth(0.7, 1, m) : 0);
    shapes.forEach((s, i) => {
      const mat = lineMats.current[i];
      if (!mat) return;
      const opacity = s.lineOpacity * weight(i);
      mat.opacity = opacity;
      mat.visible = opacity > 0.004; // fully faded line sets cost nothing to draw
    });
    const networkWeight = weight(NETWORK);
    if (pulseMat.current) {
      pulseMat.current.opacity = networkWeight;
      pulseMat.current.visible = networkWeight > 0.01;
    }

    if (!animate) return;

    // Tilt toward the pointer, less so for scenes that should face the camera.
    const lean = from.lean + (to.lean - from.lean) * m;
    g.rotation.y += (state.pointer.x * 0.5 * lean - g.rotation.y) * 0.03;
    g.rotation.x += (-state.pointer.y * 0.3 * lean - g.rotation.x) * 0.03;

    // Signals travelling along the network connections.
    const attr = pulseAttr.current;
    if (attr && networkWeight > 0.01) {
      const out = attr.array as Float32Array;
      const edges = networkEdges.length / 2;
      pulseState.current.forEach((p, i) => {
        p.t += delta * p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.edge = (p.edge + 7 + i) % edges;
        }
        const ia = networkEdges[p.edge * 2] * 3;
        const ib = networkEdges[p.edge * 2 + 1] * 3;
        for (let k = 0; k < 3; k++) {
          out[i * 3 + k] = positions[ia + k] + (positions[ib + k] - positions[ia + k]) * p.t;
        }
      });
      attr.needsUpdate = true;
    }
  });

  return (
    <group ref={group} position={[wide ? 2.7 : 0, 0, 0]} scale={scale}>
      {shapes.map((s, i) => (
        <lineSegments key={s.name} frustumCulled={false}>
          <bufferGeometry>
            <primitive object={positionAttr} attach="attributes-position" />
            <primitive object={lineIndex[i]} attach="index" />
          </bufferGeometry>
          <lineBasicMaterial
            ref={(mat) => {
              lineMats.current[i] = mat;
            }}
            color={ACCENT}
            transparent
            opacity={i === NETWORK ? s.lineOpacity : 0}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      ))}

      <points frustumCulled={false}>
        <bufferGeometry>
          <primitive object={positionAttr} attach="attributes-position" />
          <primitive object={colorAttr} attach="attributes-aColor" />
          <primitive object={sizeAttr} attach="attributes-aSize" />
        </bufferGeometry>
        <shaderMaterial
          ref={pointsMat}
          vertexShader={pointsVertex}
          fragmentShader={pointsFragment}
          uniforms={{ uPx: { value: 800 } }}
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            ref={pulseAttr}
            attach="attributes-position"
            args={[pulsePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={pulseMat}
          color={ACCENT}
          size={0.22}
          sizeAttenuation
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default function Hero3D() {
  const reduced = useReducedMotion();
  const animate = !reduced;
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  // `run` changes every time the face arrives, so the greeting types out again.
  const [greeting, setGreeting] = useState({ show: false, run: 0, x: 0, y: 0 });

  // Stop rendering entirely while the hero is scrolled out of view.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onGreeting = useCallback((g: GreetingPos) => {
    setGreeting((prev) => ({ ...g, run: g.show ? prev.run + 1 : prev.run }));
  }, []);

  return (
    <div ref={wrap} className="relative h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7], fov: 45 }}
        frameloop={animate ? (inView ? "always" : "never") : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Scene animate={animate} onGreeting={onGreeting} />
      </Canvas>
      {greeting.show && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: greeting.x, top: greeting.y }}
        >
          <FaceGreeting key={greeting.run} />
        </div>
      )}
    </div>
  );
}
