import React from 'react';
import { 
  Compass, 
  Weight, 
  Thermometer, 
  Gauge, 
  Rocket, 
  Layers, 
  Info,
  ChevronRight
} from 'lucide-react';

export default function PlanetCard({ station, onNext }) {
  if (!station) return null;

  return (
    <div className="w-full max-w-lg nasa-card rounded-2xl p-6 sm:p-8 text-slate-100 transition-all duration-300">
      {/* Top Header Badge */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium border ${station.colorTheme.badge}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {station.subtitle}
        </span>
        <span className="text-[11px] font-mono text-slate-400">
          0{station.index + 1} / 04
        </span>
      </div>

      {/* Planet Title */}
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1.5">
        {station.name}
      </h2>

      {/* Tagline */}
      <p className="text-xs sm:text-sm text-sky-300/90 font-mono mb-4">
        {station.tagline}
      </p>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
        {station.description}
      </p>

      {/* Key Metric Gauges (Clean 2x2 Grid) */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {station.metrics.map((metric, idx) => (
          <div 
            key={idx} 
            className="nasa-card-subtle rounded-xl p-3 border border-white/5 flex flex-col justify-between"
          >
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              {metric.label}
            </span>
            <div>
              <div className="text-base sm:text-lg font-bold text-white font-mono">
                {metric.value}
              </div>
              <div className="text-[10px] font-mono text-sky-400/80">
                {metric.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional scientific summary row */}
      <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs font-mono mb-4">
        <div>
          <span className="block text-[10px] text-slate-400 uppercase">Massa</span>
          <span className="font-semibold text-slate-200">{station.mass}</span>
        </div>
        <div>
          <span className="block text-[10px] text-slate-400 uppercase">Diametr</span>
          <span className="font-semibold text-slate-200">{station.diameter}</span>
        </div>
        <div>
          <span className="block text-[10px] text-slate-400 uppercase">II-Tezlik</span>
          <span className="font-semibold text-slate-200">{station.escapeVelocity}</span>
        </div>
      </div>

      {/* Next station button */}
      {station.index < 3 && (
        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <span>↓</span> Keyingi bekatga o‘tish
          </span>
          <button
            onClick={onNext}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all duration-200 hover:border-sky-400/50"
          >
            <span>Davom etish</span>
            <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
          </button>
        </div>
      )}
    </div>
  );
}
