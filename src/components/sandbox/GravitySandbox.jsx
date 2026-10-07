import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Trash2, 
  PlusCircle, 
  Sparkles, 
  Sliders, 
  Compass, 
  Info, 
  Zap, 
  ShieldAlert, 
  Gauge 
} from 'lucide-react';
import { soundEngine } from '../../utils/audioEngine';

export default function GravitySandbox({ lang = 'uz' }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1.0);
  const [gravityG, setGravityG] = useState(1.2);
  const [trailLength, setTrailLength] = useState(40);
  const [selectedBodyType, setSelectedBodyType] = useState('planet'); // star, planet, moon, blackhole
  const [presetKey, setPresetKey] = useState('binary');
  const [collisionEnabled, setCollisionEnabled] = useState(true);

  // Dragging state for launching
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragCurrent = useRef({ x: 0, y: 0 });

  // Bodies state ref
  const bodiesRef = useRef([]);
  const sparksRef = useRef([]);
  const animFrameRef = useRef(null);
  const [stats, setStats] = useState({ count: 0, totalMass: 0, energy: 0 });

  const bodyTypes = {
    star: {
      mass: 800,
      radius: 14,
      color: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.4)',
      nameUz: 'Yulduz',
      nameEn: 'Star'
    },
    planet: {
      mass: 40,
      radius: 7,
      color: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.3)',
      nameUz: 'Sayyora',
      nameEn: 'Planet'
    },
    moon: {
      mass: 6,
      radius: 4,
      color: '#a7f3d0',
      glow: 'rgba(167, 243, 208, 0.2)',
      nameUz: 'Yo‘ldosh',
      nameEn: 'Moon'
    },
    blackhole: {
      mass: 2500,
      radius: 11,
      color: '#c084fc',
      glow: 'rgba(192, 132, 252, 0.6)',
      nameUz: 'Qora Tuynuk',
      nameEn: 'Black Hole'
    }
  };

  // Load Presets
  const loadPreset = useCallback((preset) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    soundEngine.playClick();
    sparksRef.current = [];

    if (preset === 'binary') {
      // Binary Stars + 1 planet
      bodiesRef.current = [
        {
          id: 1,
          x: cx - 90,
          y: cy,
          vx: 0,
          vy: 1.6,
          mass: 750,
          radius: 12,
          color: '#f59e0b',
          glow: 'rgba(245, 158, 11, 0.4)',
          trail: [],
        },
        {
          id: 2,
          x: cx + 90,
          y: cy,
          vx: 0,
          vy: -1.6,
          mass: 750,
          radius: 12,
          color: '#fbbf24',
          glow: 'rgba(251, 191, 36, 0.4)',
          trail: [],
        },
        {
          id: 3,
          x: cx,
          y: cy - 240,
          vx: 2.7,
          vy: 0,
          mass: 25,
          radius: 6,
          color: '#38bdf8',
          glow: 'rgba(56, 189, 248, 0.3)',
          trail: [],
        },
        {
          id: 4,
          x: cx,
          y: cy + 300,
          vx: -2.3,
          vy: 0,
          mass: 20,
          radius: 5,
          color: '#a7f3d0',
          glow: 'rgba(167, 243, 208, 0.3)',
          trail: [],
        }
      ];
    } else if (preset === 'lagrange') {
      // Sun + Earth + James Webb Telescope at L2
      bodiesRef.current = [
        {
          id: 1,
          x: cx,
          y: cy,
          vx: 0,
          vy: 0,
          mass: 2000,
          radius: 16,
          color: '#f59e0b',
          glow: 'rgba(245, 158, 11, 0.5)',
          trail: [],
          fixed: true,
        },
        {
          id: 2,
          x: cx + 220,
          y: cy,
          vx: 0,
          vy: 3.3,
          mass: 60,
          radius: 8,
          color: '#38bdf8',
          glow: 'rgba(56, 189, 248, 0.4)',
          trail: [],
        },
        {
          id: 3,
          x: cx + 252, // L2 point slightly outside Earth's orbit
          y: cy,
          vx: 0,
          vy: 3.52,
          mass: 2,
          radius: 3.5,
          color: '#f43f5e',
          glow: 'rgba(244, 63, 94, 0.6)',
          trail: [],
        }
      ];
    } else if (preset === 'threebody') {
      // Three-Body Problem (Equal mass triangle)
      const d = 140;
      bodiesRef.current = [
        {
          id: 1,
          x: cx,
          y: cy - d,
          vx: 1.8,
          vy: 0,
          mass: 550,
          radius: 10,
          color: '#ec4899',
          glow: 'rgba(236, 72, 153, 0.4)',
          trail: [],
        },
        {
          id: 2,
          x: cx - d * 0.866,
          y: cy + d * 0.5,
          vx: -0.9,
          vy: -1.56,
          mass: 550,
          radius: 10,
          color: '#06b6d4',
          glow: 'rgba(6, 182, 212, 0.4)',
          trail: [],
        },
        {
          id: 3,
          x: cx + d * 0.866,
          y: cy + d * 0.5,
          vx: -0.9,
          vy: 1.56,
          mass: 550,
          radius: 10,
          color: '#eab308',
          glow: 'rgba(234, 179, 8, 0.4)',
          trail: [],
        }
      ];
    } else if (preset === 'slingshot') {
      // Gravitational Slingshot (Voyager past Jupiter)
      bodiesRef.current = [
        {
          id: 1,
          x: cx,
          y: cy,
          vx: 0,
          vy: 0.1,
          mass: 1800,
          radius: 17,
          color: '#eab308',
          glow: 'rgba(234, 179, 8, 0.4)',
          trail: [],
        },
        {
          id: 2,
          x: cx - 340,
          y: cy + 120,
          vx: 2.8,
          vy: -0.8,
          mass: 3,
          radius: 4,
          color: '#38bdf8',
          glow: 'rgba(56, 189, 248, 0.5)',
          trail: [],
        }
      ];
    } else if (preset === 'blackhole') {
      // Central Black hole + 18 particles swarm
      const list = [
        {
          id: 1,
          x: cx,
          y: cy,
          vx: 0,
          vy: 0,
          mass: 3500,
          radius: 13,
          color: '#a855f7',
          glow: 'rgba(168, 85, 247, 0.8)',
          trail: [],
          isBlackHole: true,
          fixed: true
        }
      ];

      for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2;
        const dist = 120 + Math.random() * 160;
        const speed = Math.sqrt((gravityG * 3500) / dist) * (0.9 + Math.random() * 0.2);
        list.push({
          id: i + 2,
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: -Math.sin(angle) * speed,
          vy: Math.cos(angle) * speed,
          mass: 4 + Math.random() * 8,
          radius: 3 + Math.random() * 3,
          color: i % 2 === 0 ? '#38bdf8' : '#f43f5e',
          glow: 'rgba(255, 255, 255, 0.3)',
          trail: [],
        });
      }
      bodiesRef.current = list;
    }
  }, [gravityG]);

  // Canvas Resize & init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    };

    resize();
    window.addEventListener('resize', resize);
    loadPreset('binary');

    return () => window.removeEventListener('resize', resize);
  }, [loadPreset]);

  // Main Physics & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dt = 0.5 * simSpeed;
    const G = gravityG * 0.05;
    const softening = 14; // softens close singularities

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;

      // 1. Physics update
      if (isPlaying) {
        const bodies = bodiesRef.current;
        const n = bodies.length;

        // Calculate pairwise gravitational forces
        for (let i = 0; i < n; i++) {
          const b1 = bodies[i];
          if (b1.fixed) continue;

          let fx = 0;
          let fy = 0;

          for (let j = 0; j < n; j++) {
            if (i === j) continue;
            const b2 = bodies[j];

            const dx = b2.x - b1.x;
            const dy = b2.y - b1.y;
            const distSq = dx * dx + dy * dy + softening * softening;
            const dist = Math.sqrt(distSq);

            const f = (G * b1.mass * b2.mass) / distSq;
            fx += f * (dx / dist);
            fy += f * (dy / dist);
          }

          // Acceleration a = F / m
          const ax = fx / b1.mass;
          const ay = fy / b1.mass;

          b1.vx += ax * dt;
          b1.vy += ay * dt;
        }

        // Update positions and trails
        for (let i = 0; i < n; i++) {
          const b = bodies[i];
          if (!b.fixed) {
            b.x += b.vx * dt;
            b.y += b.vy * dt;
          }

          // Append trail
          if (trailLength > 0) {
            b.trail.push({ x: b.x, y: b.y });
            if (b.trail.length > trailLength) {
              b.trail.shift();
            }
          } else {
            b.trail = [];
          }
        }

        if (collisionEnabled) {
          let merged = false;
          do {
            merged = false;
            const currentBodies = bodiesRef.current;
            for (let i = 0; i < currentBodies.length; i++) {
              for (let j = i + 1; j < currentBodies.length; j++) {
                const b1 = currentBodies[i];
                const b2 = currentBodies[j];
                const dx = b2.x - b1.x;
                const dy = b2.y - b1.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < (b1.radius + b2.radius) * 0.8) {
                  const [bigger, smaller] = b1.mass >= b2.mass ? [b1, b2] : [b2, b1];
                  const totalM = bigger.mass + smaller.mass;
                  bigger.vx = (bigger.vx * bigger.mass + smaller.vx * smaller.mass) / totalM;
                  bigger.vy = (bigger.vy * bigger.mass + smaller.vy * smaller.mass) / totalM;
                  bigger.mass = totalM;
                  bigger.radius = Math.min(28, Math.sqrt(bigger.radius * bigger.radius + smaller.radius * smaller.radius));

                  for (let k = 0; k < 14; k++) {
                    const spAngle = Math.random() * Math.PI * 2;
                    const spSpeed = Math.random() * 3 + 1;
                    sparksRef.current.push({
                      x: (b1.x + b2.x) / 2,
                      y: (b1.y + b2.y) / 2,
                      vx: Math.cos(spAngle) * spSpeed,
                      vy: Math.sin(spAngle) * spSpeed,
                      alpha: 1.0,
                      color: bigger.color,
                    });
                  }
                  soundEngine.playBeep(280, 0.08);

                  bodiesRef.current = currentBodies.filter((b) => b !== smaller);
                  merged = true;
                  break;
                }
              }
              if (merged) break;
            }
          } while (merged && bodiesRef.current.length > 1);
        }

        // Update sparks
        const sparks = sparksRef.current;
        for (let i = sparks.length - 1; i >= 0; i--) {
          const sp = sparks[i];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.alpha -= 0.035;
          if (sp.alpha <= 0) {
            sparks.splice(i, 1);
          }
        }

        // Update stats
        let totalMass = 0;
        let kineticEnergy = 0;
        bodiesRef.current.forEach((b) => {
          totalMass += b.mass;
          const v2 = b.vx * b.vx + b.vy * b.vy;
          kineticEnergy += 0.5 * b.mass * v2;
        });
        setStats({
          count: bodiesRef.current.length,
          totalMass: Math.round(totalMass),
          energy: Math.round(kineticEnergy)
        });
      }

      // 2. Render Frame
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      // Draw subtle orbital grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Center of Canvas Crosshair
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 8, 0, Math.PI * 2);
      ctx.stroke();

      // Render Trails
      bodiesRef.current.forEach((b) => {
        if (b.trail.length < 2) return;
        ctx.strokeStyle = b.color;
        ctx.lineWidth = Math.min(2.5, b.radius * 0.35);

        for (let i = 1; i < b.trail.length; i++) {
          const p1 = b.trail[i - 1];
          const p2 = b.trail[i];
          const alpha = (i / b.trail.length) * 0.45;
          ctx.strokeStyle = b.color;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
      });

      // Render Sparks
      sparksRef.current.forEach((sp) => {
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = Math.max(0, sp.alpha);
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Render Bodies
      bodiesRef.current.forEach((b) => {
        // Outer Glow
        const grad = ctx.createRadialGradient(b.x, b.y, b.radius * 0.2, b.x, b.y, b.radius * 2.8);
        grad.addColorStop(0, b.glow);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Main Body Circle
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        // Special Black Hole event horizon core
        if (b.isBlackHole) {
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius * 0.75, 0, Math.PI * 2);
          ctx.fill();
        }

        // Highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Render Dragging Launch Vector
      if (isDragging.current) {
        const start = dragStart.current;
        const cur = dragCurrent.current;
        const dx = start.x - cur.x;
        const dy = start.y - cur.y;

        // Projected line
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(start.x + dx, start.y + dy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Launch Preview Circle
        const bDef = bodyTypes[selectedBodyType];
        ctx.fillStyle = bDef.color;
        ctx.beginPath();
        ctx.arc(start.x, start.y, bDef.radius, 0, Math.PI * 2);
        ctx.fill();

        // Arrow tip
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(start.x + dx, start.y + dy, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, simSpeed, gravityG, trailLength, collisionEnabled, selectedBodyType]);

  // Mouse Handlers for Drag & Shoot
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const x = (e.clientX - rect.left) * dpr;
    const y = (e.clientY - rect.top) * dpr;

    isDragging.current = true;
    dragStart.current = { x, y };
    dragCurrent.current = { x, y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    dragCurrent.current = {
      x: (e.clientX - rect.left) * dpr,
      y: (e.clientY - rect.top) * dpr
    };
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const start = dragStart.current;
    const cur = dragCurrent.current;
    const vx = (start.x - cur.x) * 0.04;
    const vy = (start.y - cur.y) * 0.04;

    const bDef = bodyTypes[selectedBodyType];
    const newBody = {
      id: Date.now(),
      x: start.x,
      y: start.y,
      vx,
      vy,
      mass: bDef.mass,
      radius: bDef.radius,
      color: bDef.color,
      glow: bDef.glow,
      trail: [],
      isBlackHole: selectedBodyType === 'blackhole'
    };

    bodiesRef.current.push(newBody);
    soundEngine.playJump();
  };

  // Touch Handlers for Mobile & Tablet
  const handleTouchStart = (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    }
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const clearAll = () => {
    bodiesRef.current = [];
    sparksRef.current = [];
    soundEngine.playClick();
  };

  const isUz = lang === 'uz';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header telemetry */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-sky-400 font-bold uppercase">
              {isUz ? 'MODUL 02 // NYUTON GRAVITATSIYA DVIGATELI' : 'MODULE 02 // NEWTONIAN GRAVITY ENGINE'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isUz ? 'Orbital Fizika va Gravitatsiya Sandboxi' : 'Orbital Physics & Gravity Sandbox'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal mt-1 max-w-2xl">
            {isUz 
              ? 'Nyutonning Butun Olam Tortishish Qonuni (F = G · m₁m₂ / r²) asosidagi interaktiv simulyator. Sichqoncha bilan bosib torting va yangi sayyoralarni orbital tezlik bilan fazoga uchiring!' 
              : 'Interactive real-time N-Body orbital simulator governed by Newton’s Law of Universal Gravitation. Click and drag to shoot planets with velocity vectors!'}
          </p>
        </div>

        {/* Live Gauges */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-2.5 font-mono text-xs">
            <Compass className="w-4 h-4 text-sky-400" />
            <div>
              <div className="text-[10px] text-slate-300 uppercase">{isUz ? 'Jismlar' : 'Bodies'}</div>
              <div className="font-bold text-white">{stats.count}</div>
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-2.5 font-mono text-xs">
            <Zap className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-300 uppercase">{isUz ? 'Umumiy Massa' : 'Total Mass'}</div>
              <div className="font-bold text-amber-300">{stats.totalMass} M☉</div>
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-2.5 font-mono text-xs">
            <Gauge className="w-4 h-4 text-purple-400" />
            <div>
              <div className="text-[10px] text-slate-300 uppercase">{isUz ? 'Kinetik Energiya' : 'Kinetic Energy'}</div>
              <div className="font-bold text-purple-300">{stats.energy} J</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Canvas Screen */}
        <div className="lg:col-span-9 relative rounded-2xl overflow-hidden border border-sky-500/30 bg-[#030712] shadow-2xl">
          {/* Top Canvas Bar Controls */}
          <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            {/* Play/Pause & Speed */}
            <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
              <button
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  soundEngine.playClick();
                }}
                className={`p-2 rounded-lg font-mono text-xs transition-all ${
                  isPlaying ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
                title={isPlaying ? 'Pauza' : 'Davom ettirish'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              {[0.5, 1.0, 2.0].map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    setSimSpeed(spd);
                    soundEngine.playClick();
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-all ${
                    simSpeed === spd
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}

              <button
                onClick={clearAll}
                className="p-2 rounded-lg text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-all ml-1"
                title={isUz ? 'Tozalash' : 'Clear All'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Hint Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-300">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span>{isUz ? 'Sichqonchani bosing va otish yo‘nalishiga torting' : 'Drag to launch body'}</span>
            </div>
          </div>

          {/* Interactive Canvas */}
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'none' }}
            className="w-full h-[450px] sm:h-[550px] cursor-crosshair block select-none"
          />

          {/* Bottom HUD bar */}
          <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none text-xs font-mono">
            {/* Spawn Body Selector */}
            <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-950/85 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-300 px-2 uppercase">{isUz ? 'Tur:' : 'Type:'}</span>
              {Object.entries(bodyTypes).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedBodyType(key);
                    soundEngine.playClick();
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all border ${
                    selectedBodyType === key
                      ? 'bg-white/15 border-sky-400 text-white font-bold'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{isUz ? item.nameUz : item.nameEn}</span>
                </button>
              ))}
            </div>

            {/* Collision Toggle */}
            <button
              onClick={() => {
                setCollisionEnabled(!collisionEnabled);
                soundEngine.playClick();
              }}
              className={`pointer-events-auto px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-mono transition-all flex items-center gap-1.5 ${
                collisionEnabled 
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                  : 'bg-slate-950/80 border-white/10 text-slate-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isUz ? `To‘qnashuv: ${collisionEnabled ? 'YOQILGAN' : 'O‘CHIK'}` : `Collisions: ${collisionEnabled ? 'ON' : 'OFF'}`}</span>
            </button>
          </div>
        </div>

        {/* Right Sidebar: Scientific Presets & Sliders */}
        <div className="lg:col-span-3 space-y-4">
          {/* Scientific Presets Card */}
          <div className="rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/10 p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                {isUz ? 'Ilmiy Ssenariylar (Presets)' : 'Scientific Presets'}
              </h3>
            </div>

            <div className="space-y-2">
              {[
                {
                  key: 'binary',
                  titleUz: 'Qo‘shaloq Yulduz & Sayyora',
                  titleEn: 'Binary Star System',
                  descUz: '2 ta markaziy yulduz va barqaror 8-simon orbitadagi sayyoralar'
                },
                {
                  key: 'lagrange',
                  titleUz: 'Lagranj L2 & Jeyms Uebb',
                  titleEn: 'Lagrange L2 & JWST',
                  descUz: 'Yer-Quyosh gravitatsion muvozanat nuqtasi namoyishi'
                },
                {
                  key: 'threebody',
                  titleUz: 'Uch Jism Muammosi',
                  titleEn: 'Three-Body Problem',
                  descUz: 'Teng massali 3 ta yulduzning xaos harakati dinamikasi'
                },
                {
                  key: 'slingshot',
                  titleUz: 'Gravitatsion Manyovr (Slingshot)',
                  titleEn: 'Gravity Assist (Slingshot)',
                  descUz: 'Voyager zondi kabi gigant sayyora orqali tezlanish olish'
                },
                {
                  key: 'blackhole',
                  titleUz: 'Qora Tuynuk Akkretsiyasi',
                  titleEn: 'Black Hole Infall',
                  descUz: 'Supermassiv singulyarlikka tushayotgan asteroidlar klasteri'
                }
              ].map((p) => (
                <button
                  key={p.key}
                  onClick={() => {
                    setPresetKey(p.key);
                    loadPreset(p.key);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    presetKey === p.key
                      ? 'bg-sky-500/15 border-sky-400/60 shadow-subtle-glow'
                      : 'bg-slate-900/40 border-white/5 hover:border-white/15 hover:bg-white/5'
                  }`}
                >
                  <div className="text-xs font-bold text-white font-mono flex items-center justify-between">
                    <span>{isUz ? p.titleUz : p.titleEn}</span>
                    {presetKey === p.key && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1 leading-snug">
                    {p.descUz}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Physics Parameters Sliders */}
          <div className="rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/10 p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                {isUz ? 'Fizik Parametrlar' : 'Physics Parameters'}
              </h3>
            </div>

            {/* Gravity Constant G */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-300">{isUz ? 'Gravitatsiya Doimiysi (G):' : 'Gravity Constant (G):'}</span>
                <span className="text-sky-300 font-bold">{gravityG.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="4.0"
                step="0.1"
                value={gravityG}
                onChange={(e) => setGravityG(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Trail Length */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-300">{isUz ? 'Traektoriya Izi Uzunligi:' : 'Orbit Trail Length:'}</span>
                <span className="text-sky-300 font-bold">{trailLength}</span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                step="5"
                value={trailLength}
                onChange={(e) => setTrailLength(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Formula badge */}
            <div className="pt-3 border-t border-white/5 font-mono text-[11px] text-slate-300">
              <span className="text-sky-400 font-bold block mb-1">▶ {isUz ? 'Asosiy Tenglama:' : 'Governing Equation:'}</span>
              <span className="bg-slate-900/80 px-2 py-1 rounded block text-center text-slate-200 border border-white/5">
                F = G · (m₁ · m₂) / (r² + ε²)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
