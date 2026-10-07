import React, { useEffect, useRef } from 'react';

export default function Starfield() {
  const canvasRef = useRef(null);

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

    // Multi-spectral stellar palette
    const spectralColors = [
      '220, 235, 255', // O/B: hot electric blue-white
      '248, 250, 252', // A: pure white
      '254, 240, 138', // G: solar yellow
      '253, 186, 116', // K: warm amber
      '254, 202, 202', // M: soft red
    ];

    // 1600 Multi-spectral stars with 2-layer parallax
    const starCount = 1600;
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      const isLayer2 = Math.random() < 0.25; // 25% near prominent twinkling stars
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height * 5,
        radius: isLayer2 ? Math.random() * 1.2 + 1.2 : Math.random() * 0.7 + 0.35,
        baseAlpha: isLayer2 ? Math.random() * 0.3 + 0.65 : Math.random() * 0.5 + 0.3,
        twinkleSpeed: isLayer2 ? Math.random() * 0.04 + 0.02 : Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        parallaxSpeed: isLayer2 ? Math.random() * 0.45 + 0.3 : Math.random() * 0.15 + 0.08,
        colorRgb: spectralColors[Math.floor(Math.random() * spectralColors.length)],
        isLayer2,
      });
    }

    let scrollY = window.scrollY;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let clock = 0;
    let animId;

    const render = () => {
      clock += 0.016;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep Space background (#020617)
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Subtle procedural Milky Way galactic dust band (diagonal cosmic glow)
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, 'rgba(3, 7, 18, 1)');
      grad.addColorStop(0.3, 'rgba(15, 23, 42, 0.9)');
      grad.addColorStop(0.48, 'rgba(30, 27, 75, 0.45)'); // Galactic dust violet
      grad.addColorStop(0.52, 'rgba(12, 74, 110, 0.4)');  // Azure starburst
      grad.addColorStop(0.7, 'rgba(15, 23, 42, 0.9)');
      grad.addColorStop(1, 'rgba(3, 7, 18, 1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render stars with authentic spectral hues and sine-wave twinkling
      for (let i = 0; i < starCount; i++) {
        const s = stars[i];

        // Parallax vertical offset
        const py = (s.y - scrollY * s.parallaxSpeed) % height;
        const finalY = py < 0 ? py + height : py;

        // Twinkle sinusoidal pulsation
        const twinkle = Math.sin(clock * 3 * s.twinkleSpeed * 30 + s.twinklePhase) * 0.22;
        const alpha = Math.max(0.2, Math.min(1.0, s.baseAlpha + twinkle));

        ctx.beginPath();
        ctx.arc(s.x, finalY, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.colorRgb}, ${alpha})`;
        ctx.fill();

        // Subtle bloom halo for prominent near stars
        if (s.isLayer2 && alpha > 0.75) {
          ctx.beginPath();
          ctx.arc(s.x, finalY, s.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.colorRgb}, ${(alpha - 0.75) * 0.35})`;
          ctx.fill();
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
