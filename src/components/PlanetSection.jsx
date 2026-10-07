import React from 'react';
import Planet3DView from './Planet3DView';
import { ChevronDown, Sparkles } from 'lucide-react';

export default function PlanetSection({ planet, isLast, onNext, lang = 'uz' }) {
  const isUz = lang === 'uz';

  const title = isUz ? (planet.nameUz || planet.name) : (planet.nameEn || planet.name);
  const type = isUz ? (planet.typeUz || planet.type) : (planet.typeEn || planet.type);
  const subtitle = isUz ? (planet.subtitleUz || planet.subtitle) : (planet.subtitleEn || planet.subtitle);
  const tagline = isUz ? (planet.taglineUz || planet.tagline) : (planet.taglineEn || planet.tagline);
  const description = isUz ? (planet.descriptionUz || planet.description) : (planet.descriptionEn || planet.description);
  const funFact = isUz ? (planet.funFactUz || planet.funFact) : (planet.funFactEn || planet.funFact);

  return (
    <section 
      id={planet.id}
      className="min-h-screen w-full flex items-center justify-center px-4 sm:px-8 lg:px-16 py-20 relative snap-start"
    >
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: 360° Interactive 3D Sphere */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <Planet3DView planetId={planet.id} />
        </div>

        {/* Right Column: Clean Telemetry Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-start">
          <div className="w-full max-w-lg rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/10 p-6 sm:p-8 shadow-2xl text-slate-100">
            {/* Stage Badge & Type */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium border ${planet.colorTheme?.badge || 'border-sky-500/30 text-sky-300'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {subtitle}
              </span>
              <span className="text-[11px] font-mono text-slate-300">
                {String(planet.index + 1).padStart(2, '0')} / 10
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1">
              {title}
            </h2>

            {/* Type & Tagline */}
            <div className="text-[11px] font-mono text-slate-300 uppercase tracking-widest mb-3">
              {type}
            </div>
            <p className="text-xs sm:text-sm font-mono text-sky-300 mb-4">
              ▶ {tagline}
            </p>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-6">
              {description}
            </p>

            {/* Key Specs Grid (Clean 2x3 Grid) */}
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {planet.specs.map((item, idx) => (
                <div 
                  key={idx}
                  className="rounded-xl bg-slate-900/60 border border-white/5 p-3 flex flex-col justify-between"
                >
                  <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider mb-1">
                    {isUz ? (item.labelUz || item.label) : (item.labelEn || item.label)}
                  </span>
                  <div>
                    <div className="text-sm sm:text-base font-bold text-white font-mono">
                      {item.value}
                    </div>
                    <div className="text-[10px] font-mono text-slate-300 mt-0.5">
                      {isUz ? (item.noteUz || item.note) : (item.noteEn || item.note)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interesting Fact Footer */}
            <div className="pt-3.5 border-t border-white/10 flex items-start gap-2 text-xs font-mono text-slate-300">
              <span className="text-amber-400 font-bold shrink-0">💡 {isUz ? 'Fakt:' : 'Fact:'}</span>
              <span className="leading-snug text-slate-300">{funFact}</span>
            </div>

            {/* Scroll down action prompt */}
            {!isLast && (
              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-300">
                <span>{isUz ? 'Keyingi bekat' : 'Next destination'}</span>
                <button
                  onClick={onNext}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/40 transition-all duration-200 cursor-pointer"
                >
                  <span>{isUz ? 'Oldinga' : 'Next'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
