import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

/**
 * Unified Texture Loader Helper with sRGB color space
 */
function usePlanetTexture(path) {
  return useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(path);
    if ('colorSpace' in tex && THREE.SRGBColorSpace) {
      tex.colorSpace = THREE.SRGBColorSpace;
    }
    return tex;
  }, [path]);
}

/**
 * 1-PRIORITET (c): UnrealBloomPass Post-Processing
 * threshold: 0.88, strength: 0.42, radius: 0.4
 * Gives realistic astronomical glare to stars, solar corona, and atmosphere rims
 */
function CosmicBloom() {
  const { gl, scene, camera, size } = useThree();
  const composer = useMemo(() => {
    const comp = new EffectComposer(gl);
    comp.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      0.42, // strength
      0.4,  // radius
      0.88  // threshold
    );
    comp.addPass(bloomPass);
    comp.addPass(new OutputPass());
    return comp;
  }, [gl, scene, camera, size.width, size.height]);

  useEffect(() => {
    composer.setSize(size.width, size.height);
    return () => {
      composer.dispose();
    };
  }, [composer, size.width, size.height]);

  useFrame(() => {
    composer.render();
  }, 1);

  return null;
}

/**
 * 1-PRIORITET (a & b): 360° Equirectangular Milky Way Sky Sphere + 2 Parallax Star Layers
 */
function SpaceEnvironment() {
  const skyRef = useRef();
  const layer1Ref = useRef();
  const layer2Ref = useRef();
  const milkyWayTex = usePlanetTexture('/textures/milky_way.jpg');

  // Layer 1: Distant micro-stars (count 2400, radius 320-410, size 0.85)
  const [l1Positions] = useMemo(() => {
    const count = 2400;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 320 + Math.random() * 90;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return [pos];
  }, []);

  // Layer 2: Near twinkling stars with stellar spectral classes (count 650, radius 120-240, size 2.2)
  const [l2Positions, l2Colors] = useMemo(() => {
    const count = 650;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    // Stellar spectral classes: O/B (blue-white), A (pure white), F/G (yellow), K/M (orange/red)
    const palette = [
      new THREE.Color('#93c5fd'), // O/B: hot electric blue-white
      new THREE.Color('#bae6fd'), // B/A: blue-white
      new THREE.Color('#f8fafc'), // A: pure crystalline white
      new THREE.Color('#fef08a'), // F/G: solar gold
      new THREE.Color('#fdba74'), // K: warm amber
      new THREE.Color('#fca5a5'), // M: cool red
    ];

    for (let i = 0; i < count; i++) {
      const r = 120 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, []);

  useFrame((state, delta) => {
    if (skyRef.current) {
      skyRef.current.rotation.y += delta * 0.003;
    }
    if (layer1Ref.current) {
      layer1Ref.current.rotation.y += delta * 0.006;
      layer1Ref.current.rotation.x += delta * 0.002;
    }
    if (layer2Ref.current) {
      layer2Ref.current.rotation.y += delta * 0.012; // Layer 2 moves faster for parallax depth
      const time = state.clock.getElapsedTime();
      // Sine wave twinkling between 0.6 and 1.0 opacity
      const twinkle = 0.6 + 0.4 * Math.sin(time * 2.8);
      if (layer2Ref.current.material) {
        layer2Ref.current.material.opacity = twinkle;
      }
    }
  });

  return (
    <group>
      {/* 360° Equirectangular Milky Way Sky Sphere */}
      <mesh ref={skyRef}>
        <sphereGeometry args={[450, 48, 48]} />
        <meshBasicMaterial
          map={milkyWayTex}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Layer 1: Distant micro-stars */}
      <points ref={layer1Ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2400}
            array={l1Positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#cbd5e1"
          size={0.9}
          sizeAttenuation
          transparent
          opacity={0.75}
          depthWrite={false}
        />
      </points>

      {/* Layer 2: Near spectral twinkling stars */}
      <points ref={layer2Ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={650}
            array={l2Positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={650}
            array={l2Colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={2.2}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/**
 * 2-PRIORITET (d): Atmosphere Fresnel / Rayleigh Glow Shader
 * Based on authentic NASA & Three.js Rayleigh scattering
 */
function AtmosphereGlow({ color = '#4db2ff', radius = 2.0, scale = 1.03, power = 3.0, coefficient = 0.68 }) {
  const shaderMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(color) }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(${coefficient.toFixed(2)} - dot(vNormal, vec3(0.0, 0.0, 1.0)), ${power.toFixed(1)});
          gl_FragColor = vec4(glowColor, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });
  }, [color, power, coefficient]);

  return (
    <mesh material={shaderMat}>
      <sphereGeometry args={[radius * scale, 64, 64]} />
    </mesh>
  );
}

/**
 * 3-PRIORITET: Saturn Ring Geometry with precise radial UV-mapping
 * Maps U from 0.0 (inner ring) to 1.0 (outer ring) across 64 radial segments
 * allowing the Cassini division and radial ring density to render at full resolution.
 */
function createSaturnRingGeometry(innerRadius, outerRadius, thetaSegments = 160, phiSegments = 64) {
  const geo = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments);
  const pos = geo.attributes.position;
  const uvs = geo.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const r = Math.sqrt(x * x + y * y);
    const u = (r - innerRadius) / (outerRadius - innerRadius);
    uvs.setXY(i, u, 0.5);
  }
  uvs.needsUpdate = true;
  return geo;
}

// 1. Photorealistic Sun
function SunMesh() {
  const meshRef = useRef();
  const sunMap = usePlanetTexture('/textures/planets/sunmap.jpg');

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.5, 96, 96]} />
        <meshBasicMaterial map={sunMap} />
      </mesh>
      {/* Corona Atmosphere Layer 1 */}
      <AtmosphereGlow color="#f59e0b" radius={2.5} scale={1.06} power={2.2} coefficient={0.75} />
      {/* Outer Corona Flare Layer 2 */}
      <mesh>
        <sphereGeometry args={[2.85, 48, 48]} />
        <meshBasicMaterial
          color="#ff7a00"
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={4.5} color="#fff7ed" distance={60} />
    </group>
  );
}

// 2. Photorealistic Mercury
function MercuryMesh() {
  const meshRef = useRef();
  const mercuryMap = usePlanetTexture('/textures/planets/mercurymap.jpg');

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.06;
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[1.65, 96, 96]} />
      <meshStandardMaterial
        map={mercuryMap}
        roughness={0.92}
        metalness={0.15}
      />
    </mesh>
  );
}

// 3. Photorealistic Venus
function VenusMesh() {
  const meshRef = useRef();
  const venusMap = usePlanetTexture('/textures/planets/venusmap.jpg');

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y -= delta * 0.05;
  });

  return (
    <group rotation={[(177.3 * Math.PI) / 180, 0, 0]}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[2.1, 96, 96]} />
        <meshStandardMaterial
          map={venusMap}
          roughness={0.52}
          metalness={0.05}
        />
      </mesh>
      {/* Sulfuric Acid Atmospheric Glow */}
      <AtmosphereGlow color="#f59e0b" radius={2.1} scale={1.028} power={3.2} coefficient={0.70} />
    </group>
  );
}

// 4. Photorealistic Earth (Upgraded to PBR MeshStandardMaterial)
function EarthMesh() {
  const earthRef = useRef();
  const cloudsRef = useRef();

  const earthMap = usePlanetTexture('/textures/planets/earth_atmos_2048.jpg');
  const normalMap = usePlanetTexture('/textures/planets/earth_normal_2048.jpg');
  const specMap = usePlanetTexture('/textures/planets/earth_specular_2048.jpg');
  const cloudsMap = usePlanetTexture('/textures/planets/earth_clouds_1024.png');

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.09;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.13;
  });

  const RADIUS = 2.2;
  const TILT = (23.4 * Math.PI) / 180;

  return (
    <group rotation={[0, 0, TILT]}>
      {/* 1. Earth Body (Surface PBR + Normal bump + Specular reflection) */}
      <mesh ref={earthRef} castShadow receiveShadow>
        <sphereGeometry args={[RADIUS, 128, 128]} />
        <meshStandardMaterial
          map={earthMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.85, 0.85)}
          roughnessMap={specMap}
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Floating Atmospheric Clouds Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[RADIUS * 1.008, 128, 128]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.58}
          depthWrite={false}
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* 3. Rayleigh Scattering Blue Atmospheric Glow */}
      <AtmosphereGlow
        color="#38bdf8"
        radius={RADIUS}
        scale={1.032}
        power={3.0}
        coefficient={0.68}
      />
    </group>
  );
}

// 5. Photorealistic Mars
function MarsMesh() {
  const meshRef = useRef();
  const marsMap = usePlanetTexture('/textures/planets/marsmap.jpg');

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.09;
  });

  const TILT = (25.2 * Math.PI) / 180;

  return (
    <group rotation={[0, 0, TILT]}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[1.75, 96, 96]} />
        <meshStandardMaterial
          map={marsMap}
          roughness={0.88}
          metalness={0.12}
        />
      </mesh>
      {/* Thin Dusty Orange Atmospheric Glow */}
      <AtmosphereGlow color="#ea580c" radius={1.75} scale={1.024} power={3.6} coefficient={0.72} />
    </group>
  );
}

// 6. Photorealistic Jupiter
function JupiterMesh() {
  const meshRef = useRef();
  const jupiterMap = usePlanetTexture('/textures/planets/jupitermap.jpg');

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.16;
  });

  const TILT = (3.1 * Math.PI) / 180;

  return (
    <group rotation={[0, 0, TILT]}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[2.7, 128, 128]} />
        <meshStandardMaterial
          map={jupiterMap}
          roughness={0.58}
          metalness={0.0}
        />
      </mesh>
      {/* Jovian Gas Rim Glow */}
      <AtmosphereGlow color="#d97706" radius={2.7} scale={1.02} power={3.4} coefficient={0.70} />
    </group>
  );
}

// 7. Photorealistic Saturn & Rings (2K Authentic Bands + Cassini Division + Shadows)
function SaturnMesh() {
  const planetRef = useRef();
  const ringsRef = useRef();

  const saturnMap = usePlanetTexture('/textures/planets/saturnmap.jpg');
  const ringAlpha = usePlanetTexture('/textures/planets/saturnringalpha.png');

  const ringGeometry = useMemo(() => {
    return createSaturnRingGeometry(2.7, 5.4, 160, 64);
  }, []);

  useFrame((_, delta) => {
    if (planetRef.current) planetRef.current.rotation.y += delta * 0.14;
  });

  const TILT = (26.7 * Math.PI) / 180;

  return (
    <group rotation={[0.4, 0, TILT]}>
      {/* Planet Sphere with cast & receive shadow */}
      <mesh ref={planetRef} castShadow receiveShadow>
        <sphereGeometry args={[2.35, 96, 96]} />
        <meshStandardMaterial
          map={saturnMap}
          roughness={0.55}
          metalness={0.0}
        />
      </mesh>

      {/* Atmospheric Amber Haze */}
      <AtmosphereGlow color="#fde047" radius={2.35} scale={1.025} power={3.3} coefficient={0.70} />

      {/* Majestic Rings with Cassini Division and Real Shadows */}
      <mesh ref={ringsRef} geometry={ringGeometry} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          map={ringAlpha}
          side={THREE.DoubleSide}
          transparent
          alphaTest={0.02}
          roughness={0.65}
          metalness={0.0}
        />
      </mesh>
    </group>
  );
}

// 8. Photorealistic Uranus
function UranusMesh() {
  const meshRef = useRef();
  const uranusMap = usePlanetTexture('/textures/planets/uranusmap.jpg');

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.11;
  });

  const TILT = (97.8 * Math.PI) / 180;

  return (
    <group rotation={[0.2, 0, TILT]}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[2.05, 96, 96]} />
        <meshStandardMaterial
          map={uranusMap}
          roughness={0.50}
          metalness={0.0}
        />
      </mesh>

      {/* Cyan Methane Atmosphere Glow */}
      <AtmosphereGlow color="#22d3ee" radius={2.05} scale={1.03} power={3.0} coefficient={0.68} />

      {/* Faint Tilted Ring System */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.55, 2.9, 96]} />
        <meshBasicMaterial color="#7dd3fc" side={THREE.DoubleSide} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// 9. Photorealistic Neptune (2K Authentic Cloud Belts + Cobalt Azure Glow)
function NeptuneMesh() {
  const meshRef = useRef();
  const neptuneMap = usePlanetTexture('/textures/planets/neptunemap.jpg');

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.12;
  });

  const TILT = (28.3 * Math.PI) / 180;

  return (
    <group rotation={[0, 0, TILT]}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[2.05, 96, 96]} />
        <meshStandardMaterial
          map={neptuneMap}
          roughness={0.48}
          metalness={0.0}
        />
      </mesh>

      {/* Deep Vivid Cobalt Azure Rayleigh Scattering Glow */}
      <AtmosphereGlow color="#38bdf8" radius={2.05} scale={1.034} power={3.0} coefficient={0.68} />
    </group>
  );
}

// 10. Sagittarius A* (Relativistic Doppler Beaming + Gravitational Lensing)
function BlackHoleMesh() {
  const diskRef = useRef();
  const lensArcRef = useRef();

  const diskMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vPosition;

        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                     mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
        }

        void main() {
          float r = length(vPosition.xy);
          float ang = atan(vPosition.y, vPosition.x);

          // Keplerian differential rotation: plasma speeds up closer to horizon
          float omega = 1.8 / pow(r, 1.35);
          float n1 = noise(vec2(r * 4.5, ang * 3.0 - uTime * omega * 2.5));
          float n2 = noise(vec2(r * 10.0 + n1 * 2.0, ang * 7.0 - uTime * omega * 4.0));
          float streak = 0.45 + 0.55 * n2;

          // Temperature gradient: inner white-hot (r ~ 1.65), outer orange-red (r ~ 4.9)
          float t = clamp((r - 1.65) / (4.9 - 1.65), 0.0, 1.0);
          vec3 hotCol = vec3(1.4, 1.35, 1.15);
          vec3 midCol = vec3(1.15, 0.65, 0.18);
          vec3 coolCol = vec3(0.9, 0.22, 0.06);
          vec3 baseColor = mix(hotCol, mix(midCol, coolCol, pow(t, 0.75)), t);

          // Relativistic Doppler Beaming
          // Approaching side is boosted in luminosity & blueshifted, receding side is dimmed
          float dop = clamp(pow(max(0.15, 1.0 + 0.85 * sin(ang)), 2.0), 0.25, 2.4);
          vec3 finalColor = baseColor * dop;
          if (sin(ang) > 0.0) {
            finalColor = mix(finalColor, vec3(1.3, 1.5, 1.9), sin(ang) * 0.3);
          }

          // Inner ISCO boundary fade & outer disk boundary fade
          float innerFade = smoothstep(1.65, 1.85, r);
          float outerFade = 1.0 - smoothstep(4.4, 4.9, r);
          float alpha = innerFade * outerFade * streak * (0.8 + 0.2 * dop);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }, []);

  useFrame((state, delta) => {
    if (diskMaterial) {
      diskMaterial.uniforms.uTime.value = state.clock.getElapsedTime();
    }
    if (lensArcRef.current) {
      lensArcRef.current.rotation.z += delta * 0.25;
    }
  });

  return (
    <group>
      {/* Absolute Black Event Horizon Sphere */}
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Blazing Photon Sphere Ring */}
      <mesh>
        <sphereGeometry args={[1.58, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.5}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Relativistic Accretion Disk with Doppler Beaming */}
      <mesh ref={diskRef} rotation={[-Math.PI / 2.3, 0, 0]} material={diskMaterial}>
        <ringGeometry args={[1.65, 4.9, 128, 48]} />
      </mesh>

      {/* Gravitational Lensing Halo (Einstein ring warped light) */}
      <mesh ref={lensArcRef} rotation={[0, 0, 0]}>
        <ringGeometry args={[1.62, 3.2, 96]} />
        <meshBasicMaterial
          color="#f59e0b"
          side={THREE.DoubleSide}
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function Planet3DView({ planetId }) {
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '250px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const renderPlanetMesh = () => {
    switch (planetId) {
      case 'quyosh':
        return <SunMesh />;
      case 'merkuriy':
        return <MercuryMesh />;
      case 'venera':
        return <VenusMesh />;
      case 'yer':
        return <EarthMesh />;
      case 'mars':
        return <MarsMesh />;
      case 'jupiter':
        return <JupiterMesh />;
      case 'saturn':
        return <SaturnMesh />;
      case 'uran':
        return <UranusMesh />;
      case 'neptun':
        return <NeptuneMesh />;
      case 'singulyarlik':
        return <BlackHoleMesh />;
      default:
        return <EarthMesh />;
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-[340px] sm:h-[420px] md:h-[480px] relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950/40 backdrop-blur-md shadow-2xl flex items-center justify-center"
    >
      {/* 3D Interactive Controls Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 border border-white/10 text-[10px] font-mono text-sky-300">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        <span>360° REALISTIK 3D (NASA XARITASI • AYLANTIRING)</span>
      </div>

      {isInView ? (
        <Canvas
          shadows
          camera={{ position: [0, 0, 6.2], fov: 46 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
            outputColorSpace: THREE.SRGBColorSpace,
            powerPreference: 'high-performance'
          }}
          dpr={[1, 2]}
        >
          {/* 1-PRIORITET: 360° Equirectangular Milky Way Sky Sphere + 2 Parallax Star Layers */}
          <SpaceEnvironment />

          {/* Ambient Cosmic Illumination */}
          <ambientLight intensity={planetId === 'quyosh' || planetId === 'singulyarlik' ? 1.0 : 0.45} />

          {/* Primary Sun Directional Light with Shadows */}
          {planetId !== 'quyosh' && (
            <directionalLight
              position={[-8, 3.5, 6]}
              intensity={2.8}
              color="#ffffff"
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-near={0.5}
              shadow-camera-far={25}
              shadow-camera-left={-6}
              shadow-camera-right={6}
              shadow-camera-top={6}
              shadow-camera-bottom={-6}
              shadow-bias={-0.0005}
            />
          )}

          {/* Soft Rim Light for cinematic planet edge contrast */}
          <directionalLight position={[6, -3, -4]} intensity={0.4} color="#4a6fa5" />

          {renderPlanetMesh()}

          {/* 1-PRIORITET: UnrealBloomPass Cosmic Glow */}
          <CosmicBloom />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.65}
            dampingFactor={0.08}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={(3 * Math.PI) / 4}
          />
        </Canvas>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-24 h-24 rounded-full border border-sky-500/20 bg-sky-950/20 animate-pulse flex items-center justify-center">
            <span className="w-12 h-12 rounded-full bg-sky-400/10" />
          </div>
          <span className="text-xs font-mono text-slate-500">Realistik 3D Model</span>
        </div>
      )}
    </div>
  );
}
