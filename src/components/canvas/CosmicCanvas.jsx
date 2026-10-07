import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import StarFieldWarp from './StarFieldWarp';
import NebulaDust from './NebulaDust';
import EarthScene from './EarthScene';
import MarsScene from './MarsScene';
import JupiterScene from './JupiterScene';
import BlackHoleScene from './BlackHoleScene';

/**
 * Camera Controller handling Scroll travel, Mouse parallax and camera rumble
 */
function CameraController({ scrollProgress, scrollVelocity, gravityMultiplier, mousePos }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 7.5));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    // Parallax offset from mouse
    const px = mousePos.current.x * 1.8;
    const py = mousePos.current.y * 1.2;

    // Rumble effect when warp speed is high or gravity > 60g
    let rumbleX = 0;
    let rumbleY = 0;
    if (Math.abs(scrollVelocity) > 0.08 || gravityMultiplier > 65) {
      const rumbleAmount = (Math.abs(scrollVelocity) * 0.3) + (Math.max(0, gravityMultiplier - 65) * 0.004);
      rumbleX = (Math.random() - 0.5) * rumbleAmount;
      rumbleY = (Math.random() - 0.5) * rumbleAmount;
    }

    // Camera travels through Z-space according to scrollProgress (0 to 1)
    // 0.00: Earth (Z: 7.5)
    // 0.33: Mars (Z: -20, X: 1.2)
    // 0.66: Jupiter (Z: -48, X: -1.2)
    // 1.00: Black Hole (Z: -86, X: 0)
    let camZ = 7.5;
    let camX = 0;
    let camY = 0;
    let lookZ = 0;
    let lookX = 0;

    if (scrollProgress < 0.33) {
      const t = scrollProgress / 0.33;
      camZ = THREE.MathUtils.lerp(7.5, -20, t);
      camX = THREE.MathUtils.lerp(0, 1.2, t);
      lookZ = THREE.MathUtils.lerp(0, -28, t);
      lookX = THREE.MathUtils.lerp(0, 2.5, t);
    } else if (scrollProgress < 0.66) {
      const t = (scrollProgress - 0.33) / 0.33;
      camZ = THREE.MathUtils.lerp(-20, -48, t);
      camX = THREE.MathUtils.lerp(1.2, -1.2, t);
      lookZ = THREE.MathUtils.lerp(-28, -58, t);
      lookX = THREE.MathUtils.lerp(2.5, -2.5, t);
    } else {
      const t = (scrollProgress - 0.66) / 0.34;
      camZ = THREE.MathUtils.lerp(-48, -86, t);
      camX = THREE.MathUtils.lerp(-1.2, 0, t);
      lookZ = THREE.MathUtils.lerp(-58, -95, t);
      lookX = THREE.MathUtils.lerp(-2.5, 0, t);
    }

    targetPos.current.set(camX + px + rumbleX, camY + py + rumbleY, camZ);
    targetLook.current.set(lookX, 0, lookZ);

    // Smooth lerp camera movement
    camera.position.lerp(targetPos.current, 0.06);
    camera.lookAt(targetLook.current);
  });

  return null;
}

export default function CosmicCanvas({
  scrollProgress = 0,
  scrollVelocity = 0,
  gravityMultiplier = 1,
  mousePos,
}) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 60, near: 0.1, far: 350 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#020208']} />
        <fog attach="fog" args={['#020208', 35, 220]} />

        {/* Dynamic Camera Rig */}
        <CameraController
          scrollProgress={scrollProgress}
          scrollVelocity={scrollVelocity}
          gravityMultiplier={gravityMultiplier}
          mousePos={mousePos}
        />

        {/* Ambient Cosmic Illumination */}
        <ambientLight intensity={0.25} color="#0f172a" />

        {/* 6500+ Deep Space Stars with Warp Streaks */}
        <StarFieldWarp
          scrollVelocity={scrollVelocity}
          gravityMultiplier={gravityMultiplier}
        />

        {/* Volumetric Cosmic Nebula Dust */}
        <NebulaDust />

        {/* Waypoint 1: Earth */}
        <EarthScene scrollProgress={scrollProgress} />

        {/* Waypoint 2: Mars */}
        <MarsScene scrollProgress={scrollProgress} />

        {/* Waypoint 3: Jupiter */}
        <JupiterScene
          scrollProgress={scrollProgress}
          gravityMultiplier={gravityMultiplier}
        />

        {/* Waypoint 4: Black Hole Singularity */}
        <BlackHoleScene
          scrollProgress={scrollProgress}
          gravityMultiplier={gravityMultiplier}
        />
      </Canvas>
    </div>
  );
}
