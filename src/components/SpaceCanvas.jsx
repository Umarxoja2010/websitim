import React, { useEffect, useRef } from 'react';

export default function SpaceCanvas({
  scrollProgress = 0,
  scrollVelocity = 0,
  gravityValue = 1.0,
}) {
  const canvasRef = useRef(null);
  const animFrameId = useRef(null);

  // Mouse parallax state
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    // Track mouse for gentle parallax
    const onMouseMove = (e) => {
      mousePos.current.targetX = (e.clientX / width - 0.5) * 40;
      mousePos.current.targetY = (e.clientY / height - 0.5) * 40;
    };
    window.addEventListener('mousemove', onMouseMove);

    // 1800 Crisp 3D Stars
    const starCount = 1800;
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2400,
        y: (Math.random() - 0.5) * 2400,
        z: Math.random() * 1800 + 1,
        prevZ: 1000,
        baseSize: Math.random() * 0.8 + 0.6, // 0.6px to 1.4px
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        isBlueish: Math.random() > 0.7,
      });
    }

    // 250 Black hole vortex particles
    const vortexParticles = [];
    for (let i = 0; i < 260; i++) {
      vortexParticles.push({
        radius: Math.random() * 140 + 50,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.015,
        size: Math.random() * 1.2 + 0.5,
        alpha: Math.random() * 0.6 + 0.4,
      });
    }

    let planetRotation = 0;
    let clock = 0;

    // Render loop
    const render = () => {
      clock += 0.016;

      // Mouse lerp
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep space background with subtle astronomical navy nebula
      const bgGrad = ctx.createRadialGradient(
        width * 0.5 + mousePos.current.x * 0.5,
        height * 0.45 + mousePos.current.y * 0.5,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, '#0a1020'); // Subtle deep cosmic core
      bgGrad.addColorStop(0.45, '#060a15');
      bgGrad.addColorStop(1, '#030712'); // Deepest space black

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Starfield (Crisp 1-2px, High-DPI anti-aliased)
      const cx = width * 0.5 + mousePos.current.x;
      const cy = height * 0.5 + mousePos.current.y;
      const fov = 450;

      // Dynamic forward speed on scroll / gravity
      const speedMultiplier = 1 + Math.abs(scrollVelocity) * 25 + (gravityValue - 1) * 0.5;
      const step = 0.8 * speedMultiplier;

      const isWarping = Math.abs(scrollVelocity) > 0.04 || gravityValue > 4.5;

      for (let i = 0; i < starCount; i++) {
        const s = stars[i];
        s.prevZ = s.z;
        s.z -= step;

        if (s.z <= 1) {
          s.z = 1800;
          s.prevZ = 1800;
          s.x = (Math.random() - 0.5) * 2400;
          s.y = (Math.random() - 0.5) * 2400;
        }

        const sx = cx + (s.x / s.z) * fov;
        const sy = cy + (s.y / s.z) * fov;

        // Skip offscreen
        if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) continue;

        // Star depth size (crisp sub-pixel circle)
        const depthRatio = 1 - s.z / 1800;
        const radius = s.baseSize * (0.6 + depthRatio * 0.8);
        const twinkle = Math.sin(clock * 2 + s.twinklePhase) * 0.15;
        const currentAlpha = Math.max(0.15, Math.min(1, s.alpha + twinkle));

        if (isWarping) {
          // Cinema-grade hairline warp streaks
          const prevSx = cx + (s.x / s.prevZ) * fov;
          const prevSy = cy + (s.y / s.prevZ) * fov;

          ctx.beginPath();
          ctx.moveTo(prevSx, prevSy);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = s.isBlueish
            ? `rgba(186, 230, 253, ${currentAlpha * 0.8})`
            : `rgba(255, 255, 255, ${currentAlpha * 0.75})`;
          ctx.lineWidth = Math.min(1.5, radius * 1.1);
          ctx.stroke();
        } else {
          // Crystal-clear round star dot
          ctx.beginPath();
          ctx.arc(sx, sy, radius, 0, Math.PI * 2);
          ctx.fillStyle = s.isBlueish
            ? `rgba(186, 230, 253, ${currentAlpha})`
            : `rgba(255, 255, 255, ${currentAlpha})`;
          ctx.fill();
        }
      }

      // Draw Current Celestial Station
      // Layout: Sphere placed in the left-center area on desktop, leaving right side 100% free for HUD
      const planetCenterX = width > 1024 ? width * 0.35 + mousePos.current.x * 0.3 : width * 0.5;
      const planetCenterY = height * 0.5 + mousePos.current.y * 0.3;
      const baseRadius = Math.min(width, height) * 0.22;

      planetRotation += 0.003 * Math.max(0.5, gravityValue * 0.5);

      drawCelestialStage(
        ctx,
        scrollProgress,
        planetCenterX,
        planetCenterY,
        baseRadius,
        planetRotation,
        clock,
        gravityValue,
        vortexParticles
      );

      ctx.restore();
      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [scrollProgress, scrollVelocity, gravityValue]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

/**
 * Draws the celestial sphere or singularity with soft NASA-style lighting
 */
function drawCelestialStage(
  ctx,
  progress,
  px,
  py,
  radius,
  rotation,
  clock,
  gravityValue,
  vortexParticles
) {
  // Determine active stage: 0=Yer, 1=Oy, 2=Mars, 3=Singulyarlik
  let stage = 0;
  let stageTransition = 0;

  if (progress < 0.28) {
    stage = 0;
    stageTransition = progress / 0.28;
  } else if (progress < 0.56) {
    stage = 1;
    stageTransition = (progress - 0.28) / 0.28;
  } else if (progress < 0.82) {
    stage = 2;
    stageTransition = (progress - 0.56) / 0.26;
  } else {
    stage = 3;
    stageTransition = (progress - 0.82) / 0.18;
  }

  ctx.save();

  if (stage === 0) {
    // STAGE 1: YER (EARTH)
    drawEarth(ctx, px, py, radius, rotation, clock);
  } else if (stage === 1) {
    // STAGE 2: OY (MOON) - Microgravity float
    const floatY = py + Math.sin(clock * 1.2) * 8;
    drawMoon(ctx, px, floatY, radius * 0.75, rotation * 0.7);
  } else if (stage === 2) {
    // STAGE 3: MARS
    drawMars(ctx, px, py, radius * 0.82, rotation * 1.1);
  } else {
    // STAGE 4: QORA TUYNUK (SINGULARITY / GRAVITATIONAL LENSING)
    drawBlackHole(ctx, px, py, radius * 0.9, clock, gravityValue, vortexParticles);
  }

  ctx.restore();
}

/**
 * 1. Photorealistic Minimalist Earth
 */
function drawEarth(ctx, x, y, r, rotation, clock) {
  // Atmosphere soft halo
  const atmoGrad = ctx.createRadialGradient(x, y, r * 0.95, x, y, r * 1.18);
  atmoGrad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
  atmoGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.08)');
  atmoGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');

  ctx.beginPath();
  ctx.arc(x, y, r * 1.18, 0, Math.PI * 2);
  ctx.fillStyle = atmoGrad;
  ctx.fill();

  // Ocean base with chiaroscuro sphere lighting (sun from upper-left)
  const sphereGrad = ctx.createRadialGradient(
    x - r * 0.35,
    y - r * 0.35,
    r * 0.1,
    x,
    y,
    r
  );
  sphereGrad.addColorStop(0, '#2563eb'); // Bright ocean highlight
  sphereGrad.addColorStop(0.4, '#1d4ed8');
  sphereGrad.addColorStop(0.7, '#0f2963');
  sphereGrad.addColorStop(1, '#050b1a'); // Dark night side terminator

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = sphereGrad;
  ctx.fill();

  // Continents (geometric stylized landmasses that smoothly rotate)
  ctx.fillStyle = 'rgba(34, 197, 94, 0.35)'; // Earth lush green/ochre
  for (let i = 0; i < 4; i++) {
    const angle = rotation + (i * Math.PI) / 2;
    const landX = x + Math.cos(angle) * (r * 0.65);
    const landY = y + Math.sin(angle * 0.7) * (r * 0.35);

    ctx.beginPath();
    ctx.ellipse(landX, landY, r * 0.45, r * 0.28, angle * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cloud layer
  ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
  for (let i = 0; i < 3; i++) {
    const cAngle = rotation * 1.4 + (i * Math.PI) / 1.5;
    const cloudX = x + Math.cos(cAngle) * (r * 0.7);
    const cloudY = y + Math.sin(cAngle * 0.8) * (r * 0.45);

    ctx.beginPath();
    ctx.ellipse(cloudX, cloudY, r * 0.5, r * 0.15, -0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Shadow overlay across sphere to simulate celestial phase
  const shadowGrad = ctx.createLinearGradient(x - r, y, x + r, y);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  shadowGrad.addColorStop(0.65, 'rgba(3, 7, 18, 0.2)');
  shadowGrad.addColorStop(1, 'rgba(3, 7, 18, 0.85)');
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);

  ctx.restore();

  // Subtle limb rim border
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

/**
 * 2. Cratered Lunar Moon
 */
function drawMoon(ctx, x, y, r, rotation) {
  // Lunar sphere lighting (subtle grey/silver)
  const sphereGrad = ctx.createRadialGradient(
    x - r * 0.35,
    y - r * 0.35,
    r * 0.08,
    x,
    y,
    r
  );
  sphereGrad.addColorStop(0, '#f1f5f9');
  sphereGrad.addColorStop(0.4, '#cbd5e1');
  sphereGrad.addColorStop(0.75, '#64748b');
  sphereGrad.addColorStop(1, '#090d16');

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = sphereGrad;
  ctx.fill();

  // Distinct craters
  ctx.fillStyle = 'rgba(71, 85, 105, 0.35)';
  const craters = [
    { ox: -0.2, oy: -0.3, cr: 0.18 },
    { ox: 0.25, oy: -0.15, cr: 0.24 },
    { ox: -0.35, oy: 0.2, cr: 0.15 },
    { ox: 0.1, oy: 0.35, cr: 0.28 },
    { ox: -0.05, oy: 0.05, cr: 0.12 },
  ];

  craters.forEach((c) => {
    const cx = x + (c.ox + Math.sin(rotation) * 0.08) * r;
    const cy = y + c.oy * r;
    ctx.beginPath();
    ctx.arc(cx, cy, c.cr * r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Shadow overlay for crescent shadow
  const shadowGrad = ctx.createLinearGradient(x - r, y, x + r, y);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  shadowGrad.addColorStop(0.6, 'rgba(5, 8, 15, 0.3)');
  shadowGrad.addColorStop(1, 'rgba(5, 8, 15, 0.9)');
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);

  ctx.restore();

  // Thin silver rim
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

/**
 * 3. Terracotta/Ochre Mars
 */
function drawMars(ctx, x, y, r, rotation) {
  // Mars warm subtle halo
  const atmoGrad = ctx.createRadialGradient(x, y, r * 0.95, x, y, r * 1.15);
  atmoGrad.addColorStop(0, 'rgba(249, 115, 22, 0.18)');
  atmoGrad.addColorStop(0.6, 'rgba(234, 88, 12, 0.05)');
  atmoGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.beginPath();
  ctx.arc(x, y, r * 1.15, 0, Math.PI * 2);
  ctx.fillStyle = atmoGrad;
  ctx.fill();

  // Rust red sphere
  const sphereGrad = ctx.createRadialGradient(
    x - r * 0.35,
    y - r * 0.35,
    r * 0.1,
    x,
    y,
    r
  );
  sphereGrad.addColorStop(0, '#fb923c');
  sphereGrad.addColorStop(0.4, '#ea580c');
  sphereGrad.addColorStop(0.75, '#9a3412');
  sphereGrad.addColorStop(1, '#170602');

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = sphereGrad;
  ctx.fill();

  // Dark basalt features (Syrtis Major / Valles Marineris)
  ctx.fillStyle = 'rgba(67, 20, 7, 0.35)';
  for (let i = 0; i < 3; i++) {
    const angle = rotation + (i * Math.PI) / 1.5;
    const bx = x + Math.cos(angle) * (r * 0.6);
    const by = y + Math.sin(angle * 0.8) * (r * 0.3);
    ctx.beginPath();
    ctx.ellipse(bx, by, r * 0.45, r * 0.2, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Polar Ice Cap (White)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.ellipse(x - r * 0.05, y - r * 0.85, r * 0.28, r * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();

  // Shadow terminator
  const shadowGrad = ctx.createLinearGradient(x - r, y, x + r, y);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  shadowGrad.addColorStop(0.65, 'rgba(3, 7, 18, 0.25)');
  shadowGrad.addColorStop(1, 'rgba(3, 7, 18, 0.88)');
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);

  ctx.restore();

  // Clean rim stroke
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(251, 146, 60, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

/**
 * 4. Interstellar / Gargantua Gravitational Lensing Singularity
 */
function drawBlackHole(ctx, x, y, r, clock, gravityValue, vortexParticles) {
  const gFactor = Math.max(0.5, gravityValue * 0.6);

  // Outer Gravitational Lensing Halo (Einstein Ring)
  const lensGrad = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 1.9);
  lensGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  lensGrad.addColorStop(0.48, 'rgba(56, 189, 248, 0.35)');
  lensGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0.85)'); // Blazing photon ring
  lensGrad.addColorStop(0.65, 'rgba(147, 197, 253, 0.3)');
  lensGrad.addColorStop(0.95, 'rgba(59, 130, 246, 0.05)');
  lensGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.beginPath();
  ctx.arc(x, y, r * 1.9, 0, Math.PI * 2);
  ctx.fillStyle = lensGrad;
  ctx.fill();

  // Relativistic Accretion Disk (horizontal ellipse)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(x, y, r * 1.7, r * 0.38, -0.15, 0, Math.PI * 2);
  const diskGrad = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 1.7);
  diskGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  diskGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.8)');
  diskGrad.addColorStop(0.7, 'rgba(129, 140, 248, 0.4)');
  diskGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = diskGrad;
  ctx.fill();
  ctx.restore();

  // Swirling Vortex Infall Particles
  if (vortexParticles) {
    vortexParticles.forEach((p) => {
      p.angle += p.speed * gFactor;
      p.radius -= 0.3 * gFactor;
      if (p.radius < r * 0.65) {
        p.radius = r * 1.8 + Math.random() * 40;
      }

      const px = x + Math.cos(p.angle) * p.radius;
      const py = y + Math.sin(p.angle) * (p.radius * 0.38);

      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(224, 242, 254, ${p.alpha})`;
      ctx.fill();
    });
  }

  // Pure Pitch-Black Event Horizon (Singularity Sphere)
  ctx.beginPath();
  ctx.arc(x, y, r * 0.7, 0, Math.PI * 2);
  ctx.fillStyle = '#000000';
  ctx.fill();

  // Razor-sharp photon ring border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}
