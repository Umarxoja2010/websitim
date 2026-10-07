import React, { useState } from 'react';
import { 
  Compass, 
  Gauge, 
  Volume2, 
  VolumeX, 
  Activity, 
  Radio, 
  Zap, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { soundEngine } from '../../utils/audioEngine';

export default function TopHud({ 
  currentPlanet, 
  scrollProgress, 
  scrollVelocity, 
  gravityMultiplier 
}) {
  const [isAudioActive, setIsAudioActive] = useState(false);

  const toggleSound = () => {
    const active = soundEngine.toggle();
    setIsAudioActive(active);
    if (active) {
      soundEngine.playBeep(1200, 0.12);
    }
  };

  // Speed in units of 'c' (speed of light)
  const baseSpeed = 0.8;
  const warpSpeed = (baseSpeed + Math.abs(scrollVelocity) * 12 + (gravityMultiplier / 20)).toFixed(2);

  // Status badge depending on planet and gravity
  let statusColor = 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30';
  let statusText = 'NORMAL GRAVITATSIYA';
  if (currentPlanet.id === 'mars') {
    statusColor = 'text-orange-400 border-orange-500/40 bg-orange-950/30';
    statusText = 'PAST GRAVITATSIYA (-62%)';
  } else if (currentPlanet.id === 'jupiter') {
    statusColor = 'text-amber-400 border-amber-500/40 bg-amber-950/30';
    statusText = 'YUQORI TORTISHISH KUCHI';
  } else if (currentPlanet.id === 'blackhole') {
    statusColor = 'text-fuchsia-400 border-fuchsia-500/40 bg-fuchsia-950/30 animate-pulse';
    statusText = 'KRITIK SINGULYARLIK ANOMALIYASI';
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-3 md:p-5 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Mission Brand & Logo */}
        <div className="glass-panel px-4 py-2.5 rounded-xl flex items-center gap-3.5 pointer-events-auto border border-cyan-500/20 shadow-neon-cyan/20">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-950/70 border border-cyan-400/40 text-cyan-300">
            <Radio className="w-5 h-5 animate-pulse text-cyan-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-widest font-mono text-cyan-400/80 font-bold uppercase">
                ODISSEYA-01 // MISSIYA
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>
            <h1 className="text-xs md:text-sm font-orbitron font-extrabold tracking-wider bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              KOSMOS & GRAVITATSIYA
            </h1>
          </div>
        </div>

        {/* Center: Live Telemetry & Coordinates (Desktop) */}
        <div className="hidden lg:flex items-center gap-4 glass-panel px-5 py-2 rounded-xl pointer-events-auto font-mono text-xs text-slate-300 border-slate-700/50">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span className="text-slate-400 text-[11px]">KOORDINATA:</span>
            <span className="text-cyan-300 font-semibold">{currentPlanet.coordinates}</span>
          </div>
          <span className="w-px h-4 bg-slate-700" />
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400 text-[11px]">TEZLIK:</span>
            <span className="text-purple-300 font-semibold font-mono tracking-wider">
              {warpSpeed}c
            </span>
            <span className="text-[10px] text-purple-400/80">({(warpSpeed * 299792).toLocaleString('uz-UZ')} km/s)</span>
          </div>
        </div>

        {/* Right: Gravity Sensor & Audio Controller */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Status Badge */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-[11px] font-semibold tracking-wider ${statusColor}`}>
            <Activity className="w-3.5 h-3.5" />
            <span>{statusText}</span>
          </div>

          {/* Sound / Ambient Audio Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Kosmik audio rejimini yoqish/o'chirish"
            className={`glass-panel px-3.5 py-2 rounded-xl flex items-center gap-2.5 transition-all duration-300 border ${
              isAudioActive
                ? 'border-cyan-400 text-cyan-300 shadow-neon-cyan'
                : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-medium hidden sm:inline">AUDIO: FAOL</span>
                <span className="flex gap-0.5 items-end h-3.5">
                  <span className="w-0.5 h-3 bg-cyan-400 animate-bounce" />
                  <span className="w-0.5 h-2 bg-cyan-300 animate-pulse" />
                  <span className="w-0.5 h-3.5 bg-cyan-400 animate-bounce delay-75" />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-mono font-medium hidden sm:inline">AUDIO: JIM</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
