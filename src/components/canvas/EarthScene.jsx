import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createEarthTexture, createCloudsTexture } from '../../utils/proceduralTextures';

// Atmospheric Fresnel glow shader
const AtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
      gl_FragColor = vec4(0.0, 0.85, 1.0, 1.0) * intensity * 1.5;
    }
  `
};

export default function EarthScene({ scrollProgress = 0 }) {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const groupRef = useRef();

  const earthTex = useMemo(() => createEarthTexture(), []);
  const cloudsTex = useMemo(() => createCloudsTexture(), []);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.15;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.22;
      cloudsRef.current.rotation.x += delta * 0.02;
    }

    if (groupRef.current) {
      // Transition out when scrolling past Section 1 (0 to 0.25)
      // As scroll goes from 0 to 0.3, Earth recedes into the distance
      const exitT = Math.max(0, Math.min(1, (scrollProgress - 0.08) / 0.18));
      
      const targetZ = -exitT * 35;
      const targetScale = Math.max(0.001, 1 - exitT * 0.85);
      const targetOpacity = Math.max(0, 1 - exitT * 1.2);

      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.1);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1));
      groupRef.current.visible = groupRef.current.scale.x > 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main Earth Sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial
          map={earthTex}
          roughness={0.65}
          metalness={0.1}
        />
      </mesh>

      {/* Cloud Sphere */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.53, 64, 64]} />
        <meshStandardMaterial
          map={cloudsTex}
          transparent
          opacity={0.7}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Atmospheric Fresnel Glow */}
      <mesh>
        <sphereGeometry args={[2.75, 64, 64]} />
        <shaderMaterial
          vertexShader={AtmosphereShader.vertexShader}
          fragmentShader={AtmosphereShader.fragmentShader}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
        />
      </mesh>

      {/* Subtle Directional Sunlight */}
      <directionalLight position={[5, 3, 5]} intensity={2.2} color="#ffffff" />
      <ambientLight intensity={0.2} color="#0c1a2e" />
    </group>
  );
}
