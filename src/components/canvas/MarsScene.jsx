import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createMarsTexture } from '../../utils/proceduralTextures';

export default function MarsScene({ scrollProgress = 0 }) {
  const marsRef = useRef();
  const groupRef = useRef();
  const phobosRef = useRef();
  const deimosRef = useRef();

  const marsTex = useMemo(() => createMarsTexture(), []);

  // Orbit parameters
  const phobosOrbitRadius = 3.8;
  const deimosOrbitRadius = 5.2;

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (marsRef.current) {
      marsRef.current.rotation.y += delta * 0.18;
    }

    // Moons orbital motion
    if (phobosRef.current) {
      phobosRef.current.position.x = Math.cos(time * 0.8) * phobosOrbitRadius;
      phobosRef.current.position.z = Math.sin(time * 0.8) * phobosOrbitRadius;
      phobosRef.current.position.y = Math.sin(time * 0.4) * 0.5;
    }
    if (deimosRef.current) {
      deimosRef.current.position.x = Math.cos(time * 0.45 + 1.5) * deimosOrbitRadius;
      deimosRef.current.position.z = Math.sin(time * 0.45 + 1.5) * deimosOrbitRadius;
      deimosRef.current.position.y = Math.cos(time * 0.3) * 0.8;
    }

    if (groupRef.current) {
      // Mars is active around scrollProgress 0.25 - 0.50
      // Enter from right as scroll approaches 0.25, exit to left as scroll goes past 0.50
      let entranceFactor = 0;
      if (scrollProgress >= 0.15 && scrollProgress <= 0.60) {
        if (scrollProgress < 0.32) {
          entranceFactor = (scrollProgress - 0.15) / (0.32 - 0.15);
        } else if (scrollProgress > 0.46) {
          entranceFactor = 1 - (scrollProgress - 0.46) / (0.60 - 0.46);
        } else {
          entranceFactor = 1;
        }
      }
      entranceFactor = Math.max(0, Math.min(1, entranceFactor));

      // Smooth position and scale
      const targetX = 3.2 - (1 - entranceFactor) * 8; // slides into view from right
      const targetZ = -28 + (1 - entranceFactor) * -20;
      const targetScale = entranceFactor * 1.0;

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.08);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.08);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.08));
      groupRef.current.visible = groupRef.current.scale.x > 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[3.2, 0, -28]} scale={0}>
      {/* Mars Globe */}
      <mesh ref={marsRef}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshStandardMaterial
          map={marsTex}
          roughness={0.8}
          metalness={0.15}
        />
      </mesh>

      {/* Atmospheric Haze Glow */}
      <mesh>
        <sphereGeometry args={[2.35, 32, 32]} />
        <meshBasicMaterial
          color="#f97316"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbital ring track 1: Phobos */}
      <mesh rotation={[-Math.PI / 2.2, 0, 0]}>
        <ringGeometry args={[phobosOrbitRadius - 0.02, phobosOrbitRadius + 0.02, 64]} />
        <meshBasicMaterial
          color="#fdba74"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Phobos Satellite */}
      <mesh ref={phobosRef}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#a8a29e" roughness={0.9} />
      </mesh>

      {/* Orbital ring track 2: Deimos */}
      <mesh rotation={[-Math.PI / 2.5, 0.2, 0]}>
        <ringGeometry args={[deimosOrbitRadius - 0.02, deimosOrbitRadius + 0.02, 64]} />
        <meshBasicMaterial
          color="#f97316"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Deimos Satellite */}
      <mesh ref={deimosRef}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#78716c" roughness={0.9} />
      </mesh>

      {/* Point Light to illuminate Mars dramatically */}
      <pointLight position={[6, 4, 4]} intensity={2.5} color="#fff1e6" />
    </group>
  );
}
