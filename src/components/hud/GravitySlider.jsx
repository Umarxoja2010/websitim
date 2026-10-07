import React from 'react';
import { Sliders, Zap, AlertTriangle, Flame, RotateCcw, ShieldAlert } from 'lucide-react';

export default function GravitySlider({ gravityMultiplier, setGravityMultiplier }) {
  // Calculated relativistic effects
  const timeDilationFactor = (1 / Math.sqrt(Math.max(0.01, 1 - (gravityMultiplier / 105)))).toFixed(2);
  const curvaturePercent = Math.min(100, Math.round((gravityMultiplier / 100) * 100));

  const presets = [
    { label: '0g (Vaznsizlik)', value: 0 },
    { label: '1g (Yer)', value: 1 },
    { label: '2.5g (Yupiter)', value: 2.5 },
    { label: '100g (Singulyarlik)', value: 100 },
  ];

  return (
    <div className="w-full max-w-xl mx-auto glass-panel-purple p-6 md:p-8 rounded-2xl relative overflow-hidden border border-purple-500/40 shadow-neon-purple/40">
      {/* Sci-fi tech corner decorations */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-purple-500/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-cyan-500/40 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-900/60 border border-purple-400/40 text-purple-300">
            <Sliders className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-purple-300 font-bold uppercase">
              RELYATIVISTIK TA'SIR SIMULYATORI
            </span>
            <h3 className="text-xl md:text-2xl font-orbitron font-extrabold text-white tracking-wide">
              GRAVITATSIYA KUCHINI BOSHQARISH
            </h3>
          </div>
        </div>

        {gravityMultiplier > 60 && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/60 text-red-400 text-xs font-mono font-bold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            SINGULARLIK!
          </span>
        )}
      </div>

      <p className="text-xs md:text-sm text-slate-300 font-light mb-6">
        Gravitatsiya kuchini o‘zgartiring: bu 3D zarrachalar tezligiga, akkretsiya diskining aylanishiga, fazo-vaqt egriligi va kamera tebranishiga bevosita ta'sir qiladi.
      </p>

      {/* Main Slider Display */}
      <div className="mb-6 p-4 rounded-xl bg-slate-950/70 border border-purple-500/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-slate-400">GRAVITATSION MAYDON QUDRATI:</span>
          <span className="text-2xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-300">
            {gravityMultiplier}g
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={gravityMultiplier}
          onChange={(e) => setGravityMultiplier(parseFloat(e.target.value))}
          className="w-full accent-purple-500 cursor-pointer"
        />

        <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2">
          <span>0g (0.0 m/s²)</span>
          <span>50g (O‘rtacha)</span>
          <span>100g (Kritik chegara)</span>
        </div>
      </div>

      {/* Preset Quick Select Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => setGravityMultiplier(preset.value)}
            className={`px-2.5 py-2 rounded-lg text-xs font-mono font-medium transition-all duration-200 border ${
              Math.abs(gravityMultiplier - preset.value) < 0.2
                ? 'bg-purple-600/40 border-purple-400 text-purple-200 shadow-neon-purple'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Relativistic Real-Time Outputs */}
      <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs font-mono">
        <div className="flex flex-col">
          <span className="text-slate-400 text-[10px] uppercase">Vaqt Sekinlashishi (γ-faktor):</span>
          <span className="text-cyan-300 font-bold text-sm">
            {timeDilationFactor}x sekinroq
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            (Yerdagi 1 soat = bu yerda {Math.round(timeDilationFactor)} soat)
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400 text-[10px] uppercase">Fazo-Vaqt Egriligi:</span>
          <span className="text-purple-300 font-bold text-sm">
            {curvaturePercent}% egrilangan
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            Relyativistik tenzor: R_μν ≠ 0
          </span>
        </div>
      </div>
    </div>
  );
}
