import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function NebulaDust() {
  const groupRef = useRef();
  const count = 1200;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const nebulaPalette = [
      new THREE.Color('#3b82f6'), // Royal blue
      new THREE.Color('#8b5cf6'), // Purple
      new THREE.Color('#ec4899'), // Magenta
      new THREE.Color('#06b6d4'), // Cyan
      new THREE.Color('#6366f1'), // Indigo
    ];

    for (let i = 0; i < count; i++) {
      // Cluster along an organic cosmic arm
      const angle = Math.random() * Math.PI * 2;
      const radius = 15 + Math.random() * 65;
      const spreadY = (Math.random() - 0.5) * 35;
      const z = -Math.random() * 200 + 10;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = spreadY;
      pos[i * 3 + 2] = z;

      const c = nebulaPalette[Math.floor(Math.random() * nebulaPalette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z += delta * 0.02;
    groupRef.current.rotation.y += delta * 0.01;
  });

  return (
    <group ref={groupRef}>
      <points>
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
          size={3.5}
          vertexColors
          transparent
          opacity={0.35}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
