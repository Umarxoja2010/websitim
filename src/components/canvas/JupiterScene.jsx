import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createJupiterTexture } from '../../utils/proceduralTextures';

export default function JupiterScene({ scrollProgress = 0, gravityMultiplier = 1 }) {
  const jupiterRef = useRef();
  const groupRef = useRef();
  const asteroidSwarmRef = useRef();

  const jupiterTex = useMemo(() => createJupiterTexture(), []);

  // 120 orbiting and spiraling asteroids pulled by Jupiter's gravity
  const asteroidCount = 120;
  const asteroids = useMemo(() => {
    const list = [];
    for (let i = 0; i < asteroidCount; i++) {
      const angle = (i / asteroidCount) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 5.5 + Math.random() * 8.5;
      const speed = 0.3 + Math.random() * 0.4;
      const height = (Math.random() - 0.5) * 3;
      list.push({
        angle,
        dist,
        speed,
        height,
        size: 0.08 + Math.random() * 0.12,
        initialDist: dist
      });
    }
    return list;
  }, [asteroidCount]);

  // Buffer positions for asteroids
  const [asteroidPositions, asteroidSizes] = useMemo(() => {
    const pos = new Float32Array(asteroidCount * 3);
    const sz = new Float32Array(asteroidCount);
    asteroids.forEach((ast, i) => {
      pos[i * 3] = Math.cos(ast.angle) * ast.dist;
      pos[i * 3 + 1] = ast.height;
      pos[i * 3 + 2] = Math.sin(ast.angle) * ast.dist;
      sz[i] = ast.size;
    });
    return [pos, sz];
  }, [asteroids]);

  useFrame((state, delta) => {
    if (jupiterRef.current) {
      // Differential slow rotation for gas giant
      jupiterRef.current.rotation.y += delta * 0.12;
    }

    // Simulate gravitational pulling of asteroids
    if (asteroidSwarmRef.current) {
      const posAttr = asteroidSwarmRef.current.geometry.attributes.position;
      const arr = posAttr.array;
      const gPull = 0.05 * (gravityMultiplier / 2.5);

      asteroids.forEach((ast, i) => {
        // Orbit speed increases as it gets closer (Kepler's Law)
        const currentSpeed = ast.speed * (8 / Math.max(4.2, ast.dist));
        ast.angle += delta * currentSpeed;

        // Inward gravitational pull
        ast.dist -= delta * gPull * 0.2;
        if (ast.dist < 4.1) {
          // Reset asteroid back to outer belt once consumed by Jupiter
          ast.dist = ast.initialDist + Math.random() * 3;
          ast.angle = Math.random() * Math.PI * 2;
        }

        arr[i * 3] = Math.cos(ast.angle) * ast.dist;
        arr[i * 3 + 1] = ast.height + Math.sin(ast.angle * 2) * 0.3;
        arr[i * 3 + 2] = Math.sin(ast.angle) * ast.dist;
      });
      posAttr.needsUpdate = true;
    }

    if (groupRef.current) {
      // Jupiter is active around scrollProgress 0.48 - 0.78
      let entranceFactor = 0;
      if (scrollProgress >= 0.40 && scrollProgress <= 0.82) {
        if (scrollProgress < 0.56) {
          entranceFactor = (scrollProgress - 0.40) / (0.56 - 0.40);
        } else if (scrollProgress > 0.72) {
          entranceFactor = 1 - (scrollProgress - 0.72) / (0.82 - 0.72);
        } else {
          entranceFactor = 1;
        }
      }
      entranceFactor = Math.max(0, Math.min(1, entranceFactor));

      // Rises up majestically from bottom
      const targetY = (1 - entranceFactor) * -8;
      const targetX = -3.2 + (1 - entranceFactor) * -6;
      const targetZ = -58 + (1 - entranceFactor) * -25;
      const targetScale = entranceFactor * 1.0;

      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.08);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.08);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.08));
      groupRef.current.visible = groupRef.current.scale.x > 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[-3.2, -8, -58]} scale={0}>
      {/* Giant Jupiter Sphere */}
      <mesh ref={jupiterRef}>
        <sphereGeometry args={[4.0, 64, 64]} />
        <meshStandardMaterial
          map={jupiterTex}
          roughness={0.75}
          metalness={0.1}
        />
      </mesh>

      {/* Atmospheric Golden Glow */}
      <mesh>
        <sphereGeometry args={[4.25, 32, 32]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Faint Jovian Ring System */}
      <mesh rotation={[-Math.PI / 2.3, 0.1, 0]}>
        <ringGeometry args={[5.2, 7.8, 64]} />
        <meshBasicMaterial
          color="#d97706"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Gravitational Asteroid Swarm */}
      <points ref={asteroidSwarmRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={asteroidCount}
            array={asteroidPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.2}
          color="#fdba74"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Strong Dramatic Directional Lighting */}
      <directionalLight position={[-6, 4, 8]} intensity={2.8} color="#fffbeb" />
    </group>
  );
}
