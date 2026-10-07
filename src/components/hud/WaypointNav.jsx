import React from 'react';
import { Globe, Disc, CircleDot, Eye } from 'lucide-react';
import { soundEngine } from '../../utils/audioEngine';

export default function WaypointNav({ activeIndex, onSelectWaypoint }) {
  const waypoints = [
    { id: 'yer', name: 'Yer', icon: Globe, color: 'text-cyan-400' },
    { id: 'mars', name: 'Mars', icon: CircleDot, color: 'text-orange-400' },
    { id: 'jupiter', name: 'Yupiter', icon: Disc, color: 'text-amber-400' },
    { id: 'blackhole', name: 'Qora Tuynuk', icon: Eye, color: 'text-purple-400' },
  ];

  const handleClick = (index) => {
    soundEngine.playBeep(950 + index * 150, 0.08);
    onSelectWaypoint(index);
  };

  return (
    <aside className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      <nav 
        aria-label="Fazoviy bekatlar navigatsiyasi"
        className="glass-panel px-3 py-2 rounded-2xl flex items-center gap-1.5 md:gap-3 border border-cyan-500/20 shadow-neon-cyan/20"
      >
        {waypoints.map((wp, idx) => {
          const Icon = wp.icon;
          const isActive = activeIndex === idx;

          return (
            <button
              key={wp.id}
              onClick={() => handleClick(idx)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-cyan-500/20 border border-cyan-400/60 text-white shadow-neon-cyan'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? wp.color : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{wp.name}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
