import React from 'react';
import { Compass, Gauge, Radio, ShieldCheck } from 'lucide-react';

export default function HeaderHud({ activeStation, scrollVelocity, gravityValue }) {
  const currentSpeed = (0.8 + Math.abs(scrollVelocity) * 12 + gravityValue * 0.1).toFixed(2);

  const coordinates = [
    'RA 00h 00m // DEC +00°00\'',
    'RA 02h 45m // DEC +12°10\'',
    'RA 04h 32m // DEC +18°45\'',
    'Sgr A* // R_s 24M km',
  ][activeStation.index] || 'RA 00h 00m';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3.5 backdrop-blur-md bg-gray-950/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mission Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-950/60 border border-sky-500/30 text-sky-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                ODISSEYA // ILMIY PARVOZ
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            </div>
            <h1 className="text-xs sm:text-sm font-semibold tracking-wide text-white uppercase font-sans">
              KOSMOS & GRAVITATSIYA
            </h1>
          </div>
        </div>

        {/* Center: Live Telemetry (Desktop) */}
        <div className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">KOORDINATA:</span>
            <span className="text-slate-200 font-medium">{coordinates}</span>
          </div>
          <span className="w-px h-3.5 bg-white/10" />
          <div className="flex items-center gap-2">
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">TEZLIK:</span>
            <span className="text-sky-300 font-semibold">{currentSpeed}c</span>
          </div>
        </div>

        {/* Right: Stage indicator badge */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            {activeStation.name}
          </span>
          <span className="text-xs font-mono text-sky-400 bg-sky-950/60 border border-sky-500/30 px-2.5 py-1 rounded-md font-medium">
            {activeStation.gravityLabel}
          </span>
        </div>
      </div>
    </header>
  );
}
