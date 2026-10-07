import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createAccretionDiskTexture } from '../../utils/proceduralTextures';

export default function BlackHoleScene({ scrollProgress = 0, gravityMultiplier = 50 }) {
  const groupRef = useRef();
  const accretionDiskRef = useRef();
  const lensingHaloRef = useRef();
  const vortexParticlesRef = useRef();

  const diskTex = useMemo(() => createAccretionDiskTexture(), []);

  // 600 swirling relativistic vortex particles
  const particleCount = 600;
  const particles = useMemo(() => {
    const list = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.5 + Math.random() * 9.0;
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.0 + Math.random() * 2.0;
      const height = (Math.random() - 0.5) * 1.5;
      list.push({ radius, angle, speed, height, initialRadius: radius });
    }
    return list;
  }, [particleCount]);

  const [particlePositions, particleColors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color('#ffffff'), // White photon sphere
      new THREE.Color('#00f0ff'), // Blue Doppler shift
      new THREE.Color('#c084fc'), // Relativistic purple
      new THREE.Color('#f43f5e'), // Redshifted perimeter
    ];

    particles.forEach((p, i) => {
      pos[i * 3] = Math.cos(p.angle) * p.radius;
      pos[i * 3 + 1] = p.height;
      pos[i * 3 + 2] = Math.sin(p.angle) * p.radius;

      const c = colorPalette[i % colorPalette.length];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    });

    return [pos, col];
  }, [particles]);

  useFrame((state, delta) => {
    // Dynamic gravity scaling
    const speedScale = (gravityMultiplier / 20) * 1.5;

    // Rotate accretion disk
    if (accretionDiskRef.current) {
      accretionDiskRef.current.rotation.z += delta * 0.8 * speedScale;
    }
    // Rotate vertical gravitational lensing arc
    if (lensingHaloRef.current) {
      lensingHaloRef.current.rotation.z -= delta * 0.4 * speedScale;
    }

    // Infall vortex particles
    if (vortexParticlesRef.current) {
      const posAttr = vortexParticlesRef.current.geometry.attributes.position;
      const arr = posAttr.array;

      particles.forEach((p, i) => {
        // High orbital speed near event horizon
        const velocity = (p.speed * 4.5 / Math.max(1.8, p.radius)) * speedScale;
        p.angle += delta * velocity;

        // Inward suction into event horizon
        p.radius -= delta * 0.8 * speedScale;
        // Flatten height towards disk plane as it approaches horizon
        p.height *= 0.99;

        if (p.radius < 1.8) {
          // Re-emerge at outer boundary
          p.radius = p.initialRadius + Math.random() * 2;
          p.height = (Math.random() - 0.5) * 1.5;
        }

        arr[i * 3] = Math.cos(p.angle) * p.radius;
        arr[i * 3 + 1] = p.height;
        arr[i * 3 + 2] = Math.sin(p.angle) * p.radius;
      });
      posAttr.needsUpdate = true;
    }

    if (groupRef.current) {
      // Black hole enters as scrollProgress passes 0.70
      let entranceFactor = 0;
      if (scrollProgress >= 0.68) {
        entranceFactor = Math.min(1, (scrollProgress - 0.68) / 0.22);
      }

      // Gravitational shake if gravity is high
      const shakeIntensity = gravityMultiplier > 60 ? (gravityMultiplier - 60) * 0.003 : 0;
      const shakeX = (Math.random() - 0.5) * shakeIntensity;
      const shakeY = (Math.random() - 0.5) * shakeIntensity;

      const targetZ = -95 + (1 - entranceFactor) * -40;
      const targetScale = entranceFactor * 1.25;

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, shakeX, 0.1);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, shakeY, 0.1);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.1);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1));
      groupRef.current.visible = groupRef.current.scale.x > 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -95]} scale={0}>
      {/* 1. Pure Pitch Black Event Horizon */}
      <mesh>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Photon Sphere Rim (Super thin blazing boundary) */}
      <mesh>
        <ringGeometry args={[2.02, 2.12, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2. Horizontal Primary Accretion Disk */}
      <mesh ref={accretionDiskRef} rotation={[-Math.PI / 2.3, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshBasicMaterial
          map={diskTex}
          transparent
          opacity={0.92}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Kip Thorne / Interstellar Gravitational Lensing Halo (Upper Vertical Arc) */}
      <mesh ref={lensingHaloRef} rotation={[0, 0, 0]}>
        <ringGeometry args={[2.2, 5.8, 64]} />
        <meshBasicMaterial
          map={diskTex}
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 4. Spiral Infall Vortex Particles */}
      <points ref={vortexParticlesRef} rotation={[-Math.PI / 2.3, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={particleColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.6}
          vertexColors
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Outer Eerie Purple Glow */}
      <pointLight position={[0, 0, 0]} intensity={4.5} distance={30} color="#a855f7" />
      <pointLight position={[0, 2, 2]} intensity={2.5} distance={20} color="#00f0ff" />
    </group>
  );
}
