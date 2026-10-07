import React, { useState } from 'react';
import { 
  Radio, 
  Volume2, 
  VolumeX, 
  Globe2, 
  Orbit, 
  Atom, 
  Compass, 
  Award, 
  Sliders 
} from 'lucide-react';
import { soundEngine } from '../utils/audioEngine';

export default function TopNav({ activeMode, setActiveMode, lang, setLang }) {
  const [isAudioOn, setIsAudioOn] = useState(false);

  const toggleSound = () => {
    const active = soundEngine.toggle();
    setIsAudioOn(active);
    if (active) soundEngine.playClick();
  };

  const isUz = lang === 'uz';

  const modes = [
    {
      id: 'sayohat',
      nameUz: '3D Odisseya',
      nameEn: '3D Voyage',
      icon: Compass,
      color: 'text-sky-400'
    },
    {
      id: 'sandbox',
      nameUz: 'Orbital Sandbox',
      nameEn: 'Gravity Sandbox',
      icon: Orbit,
      color: 'text-amber-400'
    },
    {
      id: 'relativity',
      nameUz: 'Nisbiylik Lab',
      nameEn: 'Relativity Lab',
      icon: Atom,
      color: 'text-purple-400'
    },
    {
      id: 'jump',
      nameUz: 'Sakrash Fizikasi',
      nameEn: 'Jump Physics',
      icon: Sliders,
      color: 'text-emerald-400'
    },
    {
      id: 'quiz',
      nameUz: 'Viktorina & Sertifikat',
      nameEn: 'Quiz & Certificate',
      icon: Award,
      color: 'text-rose-400'
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 py-2.5 backdrop-blur-xl bg-slate-950/80 border-b border-white/10 print:hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Logo & Mission Badge */}
        <div 
          onClick={() => {
            setActiveMode('sayohat');
            soundEngine.playClick();
          }}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-sky-950/70 border border-sky-400/40 text-sky-300 group-hover:border-sky-300 transition-all">
            <Radio className="w-4 h-4 animate-pulse text-sky-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono tracking-widest text-sky-400 font-bold uppercase">
                ODISSEYA-01
              </span>
              <span className="w-1 h-1 rounded-full bg-sky-400" />
            </div>
            <h1 className="text-xs sm:text-sm font-extrabold tracking-wider bg-gradient-to-r from-white via-sky-200 to-sky-400 bg-clip-text text-transparent font-sans">
              GRAVITAS
            </h1>
          </div>
        </div>

        {/* Center: Module Mode Switcher (Desktop & Tablet) */}
        <nav 
          aria-label="Asosiy modullar"
          className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-mono shadow-inner overflow-x-auto max-w-2xl"
        >
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = activeMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setActiveMode(m.id);
                  soundEngine.playClick();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white/15 text-white font-bold border border-sky-400/50 shadow-subtle-glow'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                <span>{isUz ? m.nameUz : m.nameEn}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Audio + Language Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Kosmik audio rejimini yoqish/o'chirish"
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border font-mono text-xs flex items-center gap-2 transition-all cursor-pointer ${
              isAudioOn
                ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-subtle-glow'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title={isAudioOn ? 'Ovozni o‘chirish' : 'Ovozni yoqish'}
          >
            {isAudioOn ? (
              <>
                <Volume2 className="w-4 h-4 text-sky-400 animate-pulse" />
                <span className="hidden sm:inline text-[11px] font-bold">432Hz</span>
                <span className="flex gap-0.5 items-end h-3">
                  <span className="w-0.5 h-2.5 bg-sky-400 animate-bounce" />
                  <span className="w-0.5 h-1.5 bg-sky-300 animate-pulse" />
                  <span className="w-0.5 h-3 bg-sky-400 animate-bounce delay-75" />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline text-[11px]">JIM</span>
              </>
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => {
              setLang(isUz ? 'en' : 'uz');
              soundEngine.playClick();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Tilni almashtirish / Switch Language"
          >
            <Globe2 className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-bold">{isUz ? 'UZ' : 'EN'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Mode Switcher Scrollbar */}
      <div className="flex md:hidden items-center gap-1.5 pt-2 mt-2 border-t border-white/5 overflow-x-auto no-scrollbar">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                setActiveMode(m.id);
                soundEngine.playClick();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-sky-500/20 text-white font-bold border border-sky-400/50'
                  : 'bg-white/5 text-slate-400 border border-transparent'
              }`}
            >
              <Icon className={`w-3 h-3 ${m.color}`} />
              <span>{isUz ? m.nameUz : m.nameEn}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
