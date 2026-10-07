import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Activity, 
  AlertTriangle, 
  Zap, 
  RotateCcw, 
  Sliders, 
  ShieldAlert, 
  Eye, 
  Compass, 
  Info, 
  Radio 
} from 'lucide-react';
import { soundEngine } from '../../utils/audioEngine';

export default function RelativitySimulator({ lang = 'uz' }) {
  // Inputs
  const [bhMassTier, setBhMassTier] = useState(1); // 0: Stellar (10 M☉), 1: Intermediate (1,000 M☉), 2: Supermassive (4.3M M☉ Sagittarius A*)
  const [distanceFactor, setDistanceFactor] = useState(1.4); // Multiple of Schwarzschild radius (1.02 to 8.0)
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // Spacetime canvas ref
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  // Black hole presets
  const bhPresets = [
    { nameUz: 'Yulduz Massali Qora Tuynuk', nameEn: 'Stellar Black Hole', massSol: 10, rsKm: 29.5 },
    { nameUz: 'O‘rta Massali Qora Tuynuk', nameEn: 'Intermediate Black Hole', massSol: 1000, rsKm: 2950 },
    { nameUz: 'Sagittarius A* (Supermassiv)', nameEn: 'Sagittarius A* (Supermassive)', massSol: 4300000, rsKm: 12700000 },
  ];

  const currentBh = bhPresets[bhMassTier];

  // Relativistic calculations
  // Time dilation factor: sqrt(1 - rs / r)
  const rsRatio = 1 / Math.max(1.002, distanceFactor);
  const timeDilationFactor = Math.sqrt(Math.max(0.0001, 1 - rsRatio));
  const dilationRatio = (1 / timeDilationFactor); // How many times faster Earth time ticks

  // Tidal force (Spaghettification)
  // Delta F ~ 2 * G * M * m * delta_h / r^3
  // Scaled for human body 70kg, 1.8m
  const tidalGravityG = (currentBh.massSol * 1e4) / Math.pow(distanceFactor * 3, 3);
  const isSpaghettified = tidalGravityG > 15;
  const isDeadly = tidalGravityG > 100;

  // Redshift factor z = 1/sqrt(1 - rs/r) - 1
  const redshiftZ = (1 / timeDilationFactor) - 1;
  const emittedWavelengthNm = 450; // Royal Blue photon
  const observedWavelengthNm = Math.min(2500, Math.round(emittedWavelengthNm * (1 + redshiftZ)));

  // Sound alert on critical approach
  useEffect(() => {
    if (distanceFactor < 1.15) {
      soundEngine.playWarning();
    }
  }, [distanceFactor]);

  // Clock tick timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Earth equivalent time for 1 hour on astronaut's clock
  const earthHoursForOneAstronautHour = dilationRatio;
  const earthDays = earthHoursForOneAstronautHour / 24;
  const earthYears = earthDays / 365.25;

  // Format equivalent string
  const formatEarthTimeEquivalent = () => {
    if (earthYears >= 1000) {
      return `${Math.round(earthYears).toLocaleString()} yil`;
    }
    if (earthYears >= 1) {
      const yrs = Math.floor(earthYears);
      const days = Math.floor((earthYears - yrs) * 365.25);
      return `${yrs} yil, ${days} kun`;
    }
    if (earthDays >= 1) {
      const days = Math.floor(earthDays);
      const hrs = Math.floor((earthDays - days) * 24);
      return `${days} kun, ${hrs} soat`;
    }
    return `${earthHoursForOneAstronautHour.toFixed(1)} soat`;
  };

  const distanceRef = useRef(distanceFactor);
  const massTierRef = useRef(bhMassTier);
  useEffect(() => {
    distanceRef.current = distanceFactor;
  }, [distanceFactor]);
  useEffect(() => {
    massTierRef.current = bhMassTier;
  }, [bhMassTier]);

  // Spacetime Grid Canvas Animation (Gravitational Funnel)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.02;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2 - 20;
      const curDist = distanceRef.current;

      // Draw 3D-projected curved rubber sheet mesh
      const rows = 18;
      const cols = 28;
      const spacingX = w / cols;
      const spacingY = h / rows;

      ctx.lineWidth = 1;

      // Project grid lines
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const x0 = c * spacingX;
          const y0 = r * spacingY;

          // Distance from center
          const dx = x0 - cx;
          const dy = y0 - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Funnel depth based on black hole mass and proximity
          const maxFunnel = (2.5 / Math.max(1.05, curDist)) * 75;
          const depth = maxFunnel / (1 + (dist * 0.035));

          // Isometric 3D tilt
          const px = cx + dx;
          const py = cy + dy * 0.55 + depth + Math.sin(time + dist * 0.05) * 1.5;

          if (c === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        const alpha = Math.max(0.08, 0.4 - (r / rows) * 0.3);
        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.stroke();
      }

      // Draw Center Singularity & Event Horizon
      const ehRadius = (1 / curDist) * 45;
      const grad = ctx.createRadialGradient(cx, cy + 40, 2, cx, cy + 40, ehRadius * 2);
      grad.addColorStop(0, '#000000');
      grad.addColorStop(0.5, 'rgba(192, 132, 252, 0.8)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy + 40, ehRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Black Hole core
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(cx, cy + 40, ehRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Astronaut Position Marker
      const astroDist = ehRadius * curDist;
      const astroAngle = time * 0.6;
      const ax = cx + Math.cos(astroAngle) * astroDist;
      const ay = cy + 40 + Math.sin(astroAngle) * astroDist * 0.55;

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(ax, ay, 5, 0, Math.PI * 2);
      ctx.fill();

      // Astronaut beacon ring
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(ax, ay, 8 + Math.sin(time * 4) * 3, 0, Math.PI * 2);
      ctx.stroke();

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const isUz = lang === 'uz';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-purple-400 font-bold uppercase">
              {isUz ? 'MODUL 03 // EYNSHTEYN NISBIYLIK LABORATORIYASI' : 'MODULE 03 // EINSTEIN RELATIVITY LAB'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isUz ? 'Umumiy Nisbiylik va Vaqt Dilatatsiyasi' : 'General Relativity & Time Dilation'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal mt-1 max-w-2xl">
            {isUz 
              ? 'Gravitatsiya faqat tortishish kuchi emas, balki fazo va vaqt to‘qimasining egriligidir. Qora tuynukning hodisalar gorizontiga yaqinlashganda vaqtning dramatik sekinlashishini real vaqtda kuzating!' 
              : 'Gravity curves spacetime. Experience Einstein’s relativistic time dilation and extreme gravitational physics near a black hole event horizon!'}
          </p>
        </div>

        {/* Status Badge */}
        <div className={`px-4 py-2 rounded-xl border font-mono text-xs flex items-center gap-2 ${
          distanceFactor < 1.15 
            ? 'bg-rose-950/60 border-rose-500/50 text-rose-300 animate-pulse' 
            : 'bg-purple-950/50 border-purple-500/30 text-purple-300'
        }`}>
          <AlertTriangle className="w-4 h-4" />
          <span>{distanceFactor < 1.15 ? (isUz ? 'KRITIK HODISALAR GORIZONTI!' : 'CRITICAL EVENT HORIZON!') : (isUz ? 'BARQAROR GRAVITATSION MAYDON' : 'STABLE GRAVITATIONAL FIELD')}</span>
        </div>
      </div>

      {/* Main Grid: Telemetry, Clocks, and Spacetime Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Dual Atomic Clocks & Gargantua Ratio */}
        <div className="lg:col-span-5 space-y-6">
          {/* Dual Atomic Clocks Card */}
          <div className="rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  {isUz ? 'Sinxron Relyativistik Atom Soatlari' : 'Synchronized Atomic Clocks'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/30">
                133-Cs Kvant
              </span>
            </div>

            {/* Clocks Comparison Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Earth Reference Clock */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-slate-300 uppercase">
                    {isUz ? 'Yer Soati' : 'Earth Clock'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
                  {sessionSeconds} <span className="text-xs font-normal text-slate-300">sek</span>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1">
                  1.00x (Standart me’yor)
                </div>
              </div>

              {/* Astronaut Horizon Clock */}
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-purple-300 uppercase">
                    {isUz ? 'Fazogir Soati' : 'Astronaut Clock'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-purple-300">
                  {(sessionSeconds * timeDilationFactor).toFixed(2)} <span className="text-xs font-normal text-slate-300">sek</span>
                </div>
                <div className="text-[10px] font-mono text-purple-400 mt-1">
                  {timeDilationFactor.toFixed(3)}x sekinroq
                </div>
              </div>
            </div>

            {/* Interstellar / Gargantua Ratio Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/50 via-slate-900/60 to-purple-950/50 border border-purple-500/30">
              <div className="text-[11px] font-mono text-purple-300 mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{isUz ? 'Gargantua (Miller Sayyorasi) Effekti:' : 'Gargantua Time Shift Effect:'}</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white font-mono leading-snug">
                1 {isUz ? 'soat fazogir uchun =' : 'hour for astronaut ='} <span className="text-amber-300 underline decoration-amber-400/50">{formatEarthTimeEquivalent()}</span> {isUz ? 'Yerda' : 'on Earth'}!
              </div>
              <div className="text-[10px] font-mono text-slate-300 mt-1.5">
                {isUz 
                  ? 'Eynshteyn formulasi: t\' = t · √(1 - 2GM / rc²)' 
                  : 'Einstein formula: t\' = t · √(1 - 2GM / rc²)'}
              </div>
            </div>
          </div>

          {/* Spaghettification & Tidal Force Stress */}
          <div className="rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  {isUz ? 'Spagetifikatsiya (To‘lqinli Cho‘zilish)' : 'Spaghettification & Tidal Force'}
                </h3>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                isDeadly 
                  ? 'bg-rose-950 text-rose-400 border border-rose-500/60 animate-pulse' 
                  : isSpaghettified 
                  ? 'bg-amber-950 text-amber-400 border border-amber-500/60' 
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-500/60'
              }`}>
                {isDeadly ? 'HALOKATLI' : isSpaghettified ? 'XAVFLI' : 'XAVFSIZ'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {isUz 
                ? 'Fazogir tanasining boshi va oyog‘i orasidagi tortishish kuchi farqi (ΔF = 2GMmΔh / r³). Supermassiv qora tuynuklarda bu kuch kichikroq bo‘ladi, yulduz massali qora tuynuklarda esa odamni bir zumda simdek cho‘zib yuboradi!'
                : 'Differential gravitational pull between head and feet. While stellar black holes instantly shred matter, supermassive black holes have gentle tidal gradients at the horizon!'}
            </p>

            {/* Stress Level Bar */}
            <div className="w-full bg-slate-900 rounded-full h-3 border border-white/5 overflow-hidden mb-2">
              <div 
                className={`h-full transition-all duration-300 ${
                  isDeadly ? 'bg-gradient-to-r from-amber-500 to-rose-600' : isSpaghettified ? 'bg-amber-500' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, (tidalGravityG / 150) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-300">
              <span>0g (0 N)</span>
              <span className="text-white font-bold">{Math.round(tidalGravityG)}g tortishish gradiyenti</span>
              <span>150g+ (Parchalanish)</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Spacetime Funnel & Sliders */}
        <div className="lg:col-span-7 space-y-6">
          {/* Spacetime Funnel Canvas */}
          <div className="rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/10 p-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  {isUz ? 'Fazo-Vaqt Egriligi (Gravitatsion Girdob)' : 'Spacetime Curvature Funnel'}
                </h3>
              </div>
              <div className="text-[11px] font-mono text-purple-300">
                r = {distanceFactor.toFixed(2)} Rs
              </div>
            </div>

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={640}
              height={320}
              className="w-full h-[260px] sm:h-[300px] rounded-xl block border border-purple-500/20 shadow-inner"
            />

            {/* Proximity Warning Overlay */}
            {distanceFactor < 1.15 && (
              <div className="absolute bottom-7 left-7 right-7 p-3 rounded-xl bg-rose-950/80 backdrop-blur-md border border-rose-500/60 flex items-center gap-3 text-xs font-mono text-rose-200">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
                <div>
                  <div className="font-bold text-white">{isUz ? 'HODISALAR GORIZONTI OSTONASIDA!' : 'AT THE EVENT HORIZON!'}</div>
                  <div className="text-[11px] text-rose-300">{isUz ? 'Fotonlar aylanma harakatda. Qaytish yo‘li yopildi.' : 'Photons trapped. No escape possible.'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Parameters Controls */}
          <div className="rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/10 p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                {isUz ? 'Eynshteyn Parametrlari Datchigi' : 'Einstein Parameters Controller'}
              </h3>
            </div>

            {/* Black hole Tier buttons */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2">
                {isUz ? '1. Qora Tuynuk Massasi:' : '1. Black Hole Mass Scale:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {bhPresets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setBhMassTier(idx);
                      soundEngine.playClick();
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all ${
                      bhMassTier === idx
                        ? 'bg-purple-500/20 border-purple-400 text-purple-200 font-bold shadow-subtle-glow'
                        : 'bg-slate-900/50 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="font-semibold">{isUz ? p.nameUz : p.nameEn}</div>
                    <div className="text-[10px] text-slate-300 mt-0.5">{p.massSol.toLocaleString()} M☉ (Rs: {p.rsKm.toLocaleString()} km)</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Distance to Horizon Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-300">
                  {isUz ? '2. Hodisalar Gorizontigacha Masofa (r / Rs):' : '2. Proximity to Event Horizon (r / Rs):'}
                </span>
                <span className="text-purple-300 font-bold">
                  {distanceFactor.toFixed(2)}x Rs ({Math.round(distanceFactor * currentBh.rsKm).toLocaleString()} km)
                </span>
              </div>
              <input
                type="range"
                min="1.02"
                max="6.0"
                step="0.02"
                value={distanceFactor}
                onChange={(e) => setDistanceFactor(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-300 mt-1">
                <span className="text-rose-400">1.02 Rs (Kritik chegara)</span>
                <span>3.00 Rs (Foton sohasi)</span>
                <span className="text-sky-400">6.00 Rs (Xavfsiz orbita)</span>
              </div>
            </div>

            {/* Gravitational Redshift Gauge */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-300 uppercase block">{isUz ? 'Gravitatsion Qizil Siljish' : 'Gravitational Redshift'}</span>
                <span className="text-white font-bold">{emittedWavelengthNm} nm ➔ {observedWavelengthNm} nm</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-300">Z = {redshiftZ.toFixed(2)}</span>
                <div 
                  className="w-7 h-7 rounded-lg border border-white/20 shadow-md"
                  style={{
                    backgroundColor: observedWavelengthNm > 750 ? '#881337' : observedWavelengthNm > 600 ? '#ea580c' : observedWavelengthNm > 520 ? '#16a34a' : '#2563eb'
                  }}
                  title="Foton to‘lqin uzunligi rangi"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
