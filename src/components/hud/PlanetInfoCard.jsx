import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Orbit, 
  Thermometer, 
  Gauge, 
  Weight, 
  Maximize2, 
  Rocket, 
  Info, 
  Layers,
  ChevronRight
} from 'lucide-react';

export default function PlanetInfoCard({ planet, onNextPlanet }) {
  if (!planet) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={planet.id}
        initial={{ opacity: 0, x: -40, scale: 0.94 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 40, scale: 0.94 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl relative"
      >
        {/* Sci-Fi Decorative Corner Brackets */}
        <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />
        <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
        <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />

        {/* Main Glassmorphic Card Body */}
        <div className={`glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden backdrop-blur-2xl border ${planet.colorTheme.borderClass} ${planet.colorTheme.glowClass}`}>
          {/* Subtle Cyber scanline background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
          
          {/* Header Tag & Subtitle */}
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[11px] font-mono tracking-widest text-cyan-300 font-bold uppercase">
                {planet.subtitle}
              </span>
            </div>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
              BEKAT 0{planet.index + 1}/04
            </span>
          </div>

          {/* Planet Big Title */}
          <h2 className={`text-3xl md:text-5xl font-orbitron font-black tracking-tight mb-2 bg-gradient-to-r ${planet.colorTheme.textGrad} bg-clip-text text-transparent`}>
            {planet.name}
          </h2>

          <p className="text-xs md:text-sm text-cyan-200/90 font-mono tracking-wide mb-4 flex items-center gap-1.5">
            <span className="text-cyan-400">▶</span> {planet.tagline}
          </p>

          {/* Descriptive text */}
          <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-6 font-light">
            {planet.description}
          </p>

          {/* Key Metric Gauges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
            {/* 1. Gravitatsiya */}
            <div className="bg-slate-900/70 border border-cyan-500/20 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
                <Weight className="w-4 h-4" />
                <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Gravitatsiya</span>
              </div>
              <div>
                <div className="text-base sm:text-lg font-orbitron font-bold text-white">
                  {planet.gravity} <span className="text-xs font-sans text-slate-400">m/s²</span>
                </div>
                <div className="text-[11px] font-mono text-cyan-300 font-medium">
                  {planet.gravityRatio}
                </div>
              </div>
            </div>

            {/* 2. Harorat */}
            <div className="bg-slate-900/70 border border-purple-500/20 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-purple-400 mb-1">
                <Thermometer className="w-4 h-4" />
                <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Harorat</span>
              </div>
              <div>
                <div className="text-base sm:text-lg font-orbitron font-bold text-white">
                  {planet.temperature}
                </div>
                <div className="text-[11px] font-mono text-purple-300">
                  O‘rtacha
                </div>
              </div>
            </div>

            {/* 3. Bosim */}
            <div className="bg-slate-900/70 border border-amber-500/20 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                <Gauge className="w-4 h-4" />
                <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Bosim</span>
              </div>
              <div>
                <div className="text-sm sm:text-base font-orbitron font-bold text-white truncate">
                  {planet.pressure.split(' ')[0]}
                </div>
                <div className="text-[11px] font-mono text-amber-300 truncate">
                  {planet.pressure.split('(')[1]?.replace(')', '') || 'Atmosfera'}
                </div>
              </div>
            </div>

            {/* 4. Kosmik Tezlik */}
            <div className="bg-slate-900/70 border border-emerald-500/20 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                <Rocket className="w-4 h-4" />
                <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Qochish tezligi</span>
              </div>
              <div>
                <div className="text-sm sm:text-base font-orbitron font-bold text-white">
                  {planet.escapeVelocity}
                </div>
                <div className="text-[11px] font-mono text-emerald-300">
                  II-kosmik
                </div>
              </div>
            </div>
          </div>

          {/* Scientific Fact List */}
          <div className="space-y-2 mb-6">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Ilmiy Parametrlar va Xususiyatlar:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {planet.facts.map((fact, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                  <span className="text-slate-400">{fact.label}:</span>
                  <span className="text-cyan-200 font-semibold">{fact.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          {planet.index < 3 && (
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <span className="inline-block animate-bounce">↓</span> Sahifani pastga aylantiring
              </span>
              <button
                onClick={onNextPlanet}
                className="group flex items-center gap-2 text-xs font-mono font-semibold px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-all duration-300 hover:shadow-neon-cyan"
              >
                <span>Keyingi Bekat</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
