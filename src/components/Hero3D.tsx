"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { AdditiveBlending, type BufferAttribute, type Group } from "three";

const ACCENT = "#22d3ee";
const LAYERS = [4, 6, 6, 4];
const PULSES = 36;

// Deterministic PRNG so the network looks identical on every render.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildNetwork() {
  const rand = mulberry32(7);
  const nodes: [number, number, number][] = [];
  const layerStart: number[] = [];

  LAYERS.forEach((count, l) => {
    layerStart.push(nodes.length);
    const x = (l - (LAYERS.length - 1) / 2) * 1.7;
    for (let i = 0; i < count; i++) {
      const y = (i - (count - 1) / 2) * 0.8;
      nodes.push([x, y, (rand() - 0.5) * 1.2]);
    }
  });

  const edges: [number, number][] = [];
  for (let l = 0; l < LAYERS.length - 1; l++) {
    for (let a = 0; a < LAYERS[l]; a++) {
      for (let b = 0; b < LAYERS[l + 1]; b++) {
        edges.push([layerStart[l] + a, layerStart[l + 1] + b]);
      }
    }
  }

  const nodePositions = new Float32Array(nodes.flat());
  const linePositions = new Float32Array(
    edges.flatMap(([a, b]) => [...nodes[a], ...nodes[b]]),
  );

  const dust = new Float32Array(
    Array.from({ length: 160 * 3 }, () => (rand() - 0.5) * 12),
  );

  const pulses = Array.from({ length: PULSES }, () => ({
    edge: Math.floor(rand() * edges.length),
    t: rand(),
    speed: 0.15 + rand() * 0.25,
  }));

  return { nodes, edges, nodePositions, linePositions, dust, pulses };
}

const net = buildNetwork();

function Network({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null);
  const pulseAttr = useRef<BufferAttribute>(null);
  const pulseState = useRef(net.pulses.map((p) => ({ ...p })));
  const { viewport } = useThree();

  const wide = viewport.width > 8;
  const scale = Math.min(1, viewport.width / 7.5);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || !animate) return;
    g.rotation.y += (state.pointer.x * 0.5 - g.rotation.y) * 0.03;
    g.rotation.x += (-state.pointer.y * 0.3 - g.rotation.x) * 0.03;

    const attr = pulseAttr.current;
    if (!attr) return;
    const out = attr.array as Float32Array;
    pulseState.current.forEach((p, i) => {
      p.t += delta * p.speed;
      if (p.t >= 1) {
        p.t = 0;
        p.edge = (p.edge + 7 + i) % net.edges.length;
      }
      const [a, b] = net.edges[p.edge];
      for (let k = 0; k < 3; k++) {
        out[i * 3 + k] = net.nodes[a][k] + (net.nodes[b][k] - net.nodes[a][k]) * p.t;
      }
    });
    attr.needsUpdate = true;
  });

  const initialPulses = useMemo(() => new Float32Array(PULSES * 3), []);

  return (
    <group ref={group} position={[wide ? 2.2 : 0, 0, 0]} scale={scale}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[net.linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={ACCENT}
          transparent
          opacity={0.18}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[net.nodePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={0.14}
          sizeAttenuation
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute
            ref={pulseAttr}
            attach="attributes-position"
            args={[initialPulses, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={ACCENT}
          size={0.22}
          sizeAttenuation
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[net.dust, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#6b7cff"
          size={0.04}
          sizeAttenuation
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default function Hero3D() {
  const reduced = useReducedMotion();
  const animate = !reduced;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7], fov: 45 }}
      frameloop={animate ? "always" : "demand"}
      gl={{ antialias: true, alpha: true }}
    >
      <Network animate={animate} />
    </Canvas>
  );
}

