import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function StarFieldWarp({ scrollVelocity = 0, gravityMultiplier = 1 }) {
  const pointsRef = useRef();
  const lineSegmentsRef = useRef();

  const count = 6500;

  // Star points buffer
  const [positions, colors, originalZ] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const origZ = new Float32Array(count);

    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#dbeafe'),
      new THREE.Color('#a5f3fc'),
      new THREE.Color('#e9d5ff'),
      new THREE.Color('#fef08a'),
    ];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 160;
      const y = (Math.random() - 0.5) * 160;
      const z = -Math.random() * 220 + 20;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      origZ[i] = z;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, col, origZ];
  }, [count]);

  // Warp streak lines buffer (for high-speed hyperspace streaks)
  const streakCount = 400;
  const streakPositions = useMemo(() => {
    const pos = new Float32Array(streakCount * 2 * 3);
    for (let i = 0; i < streakCount; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = -Math.random() * 180 + 10;
      // Start vertex
      pos[i * 6] = x;
      pos[i * 6 + 1] = y;
      pos[i * 6 + 2] = z;
      // End vertex
      pos[i * 6 + 3] = x;
      pos[i * 6 + 4] = y;
      pos[i * 6 + 5] = z - 2;
    }
    return pos;
  }, [streakCount]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const speedMultiplier = 1 + Math.abs(scrollVelocity) * 18 + (gravityMultiplier - 1) * 0.15;
    const baseStep = delta * 12 * speedMultiplier;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const posArr = posAttr.array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3 + 2;
      posArr[idx] += baseStep;

      // Recycle when passing the camera view plane
      if (posArr[idx] > 20) {
        posArr[idx] = -200;
        posArr[i * 3] = (Math.random() - 0.5) * 160;
        posArr[i * 3 + 1] = (Math.random() - 0.5) * 160;
      }
    }
    posAttr.needsUpdate = true;

    // Animate hyperspace streaks when velocity is significant
    if (lineSegmentsRef.current) {
      const streakAttr = lineSegmentsRef.current.geometry.attributes.position;
      const sArr = streakAttr.array;
      const streakLength = Math.min(18, 1.5 + Math.abs(scrollVelocity) * 35);
      const isWarping = Math.abs(scrollVelocity) > 0.05 || gravityMultiplier > 25;

      lineSegmentsRef.current.material.opacity = isWarping 
        ? Math.min(0.95, (Math.abs(scrollVelocity) * 1.5) + (gravityMultiplier / 120)) 
        : 0.05;

      for (let i = 0; i < streakCount; i++) {
        const headIdx = i * 6 + 2;
        const tailIdx = i * 6 + 5;

        sArr[headIdx] += baseStep * 1.3;
        sArr[tailIdx] = sArr[headIdx] - streakLength;

        if (sArr[headIdx] > 25) {
          sArr[headIdx] = -190;
          sArr[tailIdx] = sArr[headIdx] - streakLength;
          const nx = (Math.random() - 0.5) * 110;
          const ny = (Math.random() - 0.5) * 110;
          sArr[i * 6] = nx;
          sArr[i * 6 + 3] = nx;
          sArr[i * 6 + 1] = ny;
          sArr[i * 6 + 4] = ny;
        }
      }
      streakAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* 5000+ Deep Space Stars */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.65}
          vertexColors
          transparent
          opacity={0.88}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Hyperspace Warp Lines */}
      <lineSegments ref={lineSegmentsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={streakCount * 2}
            array={streakPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          linewidth={2}
        />
      </lineSegments>
    </group>
  );
}
