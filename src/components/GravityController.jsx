import React from 'react';
import { Sliders, RotateCcw, AlertCircle, Compass } from 'lucide-react';

export default function GravityController({ gravityValue, setGravityValue }) {
  // Relativistic time dilation calculation
  const timeFactor = (1 / Math.sqrt(Math.max(0.01, 1 - (gravityValue / 11)))).toFixed(2);
  const curvaturePercent = Math.min(100, Math.round((gravityValue / 10) * 100));

  const presets = [
    { label: '0.16g (Oy)', value: 0.16 },
    { label: '0.38g (Mars)', value: 0.38 },
    { label: '1.0g (Yer)', value: 1.0 },
    { label: '10.0g (Singulyarlik)', value: 10.0 },
  ];

  return (
    <div className="w-full max-w-lg nasa-card rounded-2xl p-6 sm:p-8 text-slate-100 border border-sky-500/20 shadow-subtle-glow">
      {/* Title */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-slate-200">
            GRAVITATSIYANI BOSHQARISH
          </h3>
        </div>
        <span className="text-[11px] font-mono text-sky-400/90 font-bold px-2 py-0.5 rounded bg-sky-950/50 border border-sky-500/30">
          {gravityValue.toFixed(2)}g
        </span>
      </div>

      <p className="text-xs text-slate-400 font-normal mb-5 leading-relaxed">
        Gravitatsiya kuchini o‘zgartiring: bu yulduzlar oqimi tezligini, zarrachalar aylanishini va fazo-vaqt egriligini real vaqtda o‘zgartiradi.
      </p>

      {/* Slider Input */}
      <div className="nasa-card-subtle p-4 rounded-xl border border-white/5 mb-4">
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
          <span>0.0g (Vaznsizlik)</span>
          <span className="text-white font-bold">{gravityValue.toFixed(1)}g</span>
          <span>10.0g (Ekstremal)</span>
        </div>

        <input
          type="range"
          min="0.0"
          max="10.0"
          step="0.1"
          value={gravityValue}
          onChange={(e) => setGravityValue(parseFloat(e.target.value))}
          className="w-full cursor-pointer"
        />
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => setGravityValue(p.value)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-150 border ${
              Math.abs(gravityValue - p.value) < 0.1
                ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-semibold'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Relativistic Real-time Metrics */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs font-mono">
        <div>
          <span className="block text-[10px] text-slate-400 uppercase">Vaqt Dilatatsiyasi</span>
          <span className="font-semibold text-sky-300">{timeFactor}x sekinroq</span>
        </div>
        <div>
          <span className="block text-[10px] text-slate-400 uppercase">Fazo Egriligi</span>
          <span className="font-semibold text-slate-200">{curvaturePercent}% deformatsiya</span>
        </div>
      </div>
    </div>
  );
}
