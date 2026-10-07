import React from 'react';
import { PLANETS_DATA } from '../data/planetsData';
import { soundEngine } from '../utils/audioEngine';

export default function WaypointDock({ activeId, onSelect, lang = 'uz' }) {
  const isUz = lang === 'uz';

  return (
    <aside className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 pointer-events-auto max-w-[96vw] print:hidden">
      <nav 
        aria-label="Fazoviy bekatlar paneli"
        className="flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-2xl backdrop-blur-xl bg-slate-950/85 border border-white/10 shadow-2xl overflow-x-auto no-scrollbar max-w-full"
      >
        {PLANETS_DATA.map((p) => {
          const isActive = activeId === p.id;
          const name = isUz ? (p.nameUz || p.name) : (p.nameEn || p.name);

          return (
            <button
              key={p.id}
              onClick={() => {
                onSelect(p.id);
                soundEngine.playClick();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-mono transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-sky-500/20 text-white border-sky-400 font-bold shadow-subtle-glow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent'
              }`}
            >
              <span 
                className="w-2 h-2 rounded-full shrink-0" 
                style={{ backgroundColor: p.colorTheme?.accent || '#38bdf8' }} 
              />
              <span>{name}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
