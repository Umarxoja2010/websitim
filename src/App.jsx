import React, { useState, useEffect } from 'react';
import Starfield from './components/Starfield';
import TopNav from './components/TopNav';
import PlanetSection from './components/PlanetSection';
import WaypointDock from './components/WaypointDock';
import GravitySandbox from './components/sandbox/GravitySandbox';
import RelativitySimulator from './components/relativity/RelativitySimulator';
import ExoJumpCalculator from './components/calculator/ExoJumpCalculator';
import CosmicQuizCertificate from './components/quiz/CosmicQuizCertificate';
import { PLANETS_DATA } from './data/planetsData';
import { 
  ArrowUp, 
  Compass, 
  Orbit, 
  Atom, 
  Sliders, 
  Award, 
  Sparkles, 
  Radio, 
  ChevronDown 
} from 'lucide-react';
import { soundEngine } from './utils/audioEngine';

export default function App() {
  const [activeMode, setActiveMode] = useState('sayohat'); // sayohat, sandbox, relativity, jump, quiz
  const [lang, setLang] = useState('uz'); // uz, en
  const [activePlanetId, setActivePlanetId] = useState('quyosh');

  // Track active planet in viewport during sayohat scroll
  useEffect(() => {
    if (activeMode !== 'sayohat') return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      for (const planet of PLANETS_DATA) {
        const el = document.getElementById(planet.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActivePlanetId(planet.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeMode]);

  const scrollToPlanet = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isUz = lang === 'uz';

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* 1. Deep Space Starfield Background */}
      <Starfield />

      {/* 2. Top Futuristic HUD Navigation */}
      <TopNav
        activeMode={activeMode}
        setActiveMode={(m) => {
          setActiveMode(m);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
        setLang={setLang}
      />

      {/* 3. Main Workspace Based on Active Mode */}
      <main className="relative z-10 pt-16">
        {activeMode === 'sayohat' && (
          <div>
            {/* Hero Section Banner */}
            <header className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto py-12 relative">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950/60 border border-sky-500/30 text-sky-300 font-mono text-xs mb-6 shadow-subtle-glow">
                <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span>{isUz ? 'MISSIYA ODISSEYA-01 // ILMIY PARVOZ' : 'MISSION ODYSSEY-01 // SCIENTIFIC EXPEDITION'}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight font-sans">
                {isUz ? (
                  <>
                    Koinot, Gravitatsiya va <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300">
                      Nisbiylik Laboratoriyasi
                    </span>
                  </>
                ) : (
                  <>
                    Cosmic Gravity & <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300">
                      Relativity Laboratory
                    </span>
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
                {isUz 
                  ? 'Quyoshning qaynoq tojidan tortib, Sagittarius A* qora tuynugining hodisalar gorizontigacha bo‘lgan 3D sayohat. Har bir sayyorani 360° tekshiring, uning gravitatsiyasini his eting!'
                  : 'A 3D voyage from the blazing solar corona to the event horizon of Sagittarius A*. Explore planets in 360° and experience relativistic astrophysics!'}
              </p>

              {/* Quick Feature Shortcut Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl mb-10 text-left font-mono">
                <button
                  onClick={() => {
                    setActiveMode('sandbox');
                    soundEngine.playClick();
                  }}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 hover:border-amber-400/50 hover:bg-white/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-amber-400 mb-1">
                    <Orbit className="w-4 h-4" />
                    <span className="text-xs font-bold">{isUz ? 'Sandbox' : 'Sandbox'}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 group-hover:text-slate-200">
                    {isUz ? 'Orbital fizika' : 'Orbital mechanics'}
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveMode('relativity');
                    soundEngine.playClick();
                  }}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 hover:border-purple-400/50 hover:bg-white/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-purple-400 mb-1">
                    <Atom className="w-4 h-4" />
                    <span className="text-xs font-bold">{isUz ? 'Nisbiylik' : 'Relativity'}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 group-hover:text-slate-200">
                    {isUz ? 'Atom soatlari' : 'Atomic clocks'}
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveMode('jump');
                    soundEngine.playClick();
                  }}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 hover:border-emerald-400/50 hover:bg-white/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-emerald-400 mb-1">
                    <Sliders className="w-4 h-4" />
                    <span className="text-xs font-bold">{isUz ? 'Sakrash' : 'Jump Lab'}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 group-hover:text-slate-200">
                    {isUz ? 'Vazn datchigi' : 'Weight physics'}
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveMode('quiz');
                    soundEngine.playClick();
                  }}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 hover:border-rose-400/50 hover:bg-white/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-rose-400 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-bold">{isUz ? 'Sertifikat' : 'Certificate'}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 group-hover:text-slate-200">
                    {isUz ? 'Viktorina sinovi' : 'Cosmic academy'}
                  </div>
                </button>
              </div>

              {/* Scroll Down Call to Action */}
              <button
                onClick={() => scrollToPlanet('quyosh')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg hover:shadow-sky-500/25 cursor-pointer"
              >
                <span>{isUz ? 'PARVOZNI BOSHLASH' : 'BEGIN EXPEDITION'}</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </button>
            </header>

            {/* 10 Natural Scroll Celestial Sections */}
            {PLANETS_DATA.map((planet, index) => {
              const nextPlanet = PLANETS_DATA[index + 1];
              return (
                <PlanetSection
                  key={planet.id}
                  planet={planet}
                  isLast={index === PLANETS_DATA.length - 1}
                  onNext={() => nextPlanet && scrollToPlanet(nextPlanet.id)}
                  lang={lang}
                />
              );
            })}

            {/* Waypoint Bottom Jump Dock */}
            <WaypointDock
              activeId={activePlanetId}
              onSelect={scrollToPlanet}
              lang={lang}
            />

            {/* Ending Voyage Footer */}
            <footer className="w-full py-16 text-center text-xs font-mono text-slate-400 relative z-20 border-t border-white/5 bg-slate-950/80 backdrop-blur-md">
              <div className="max-w-md mx-auto space-y-4 px-4">
                <p className="text-slate-300">
                  {isUz 
                    ? 'Quyosh tizimining 10 ta asosiy bekatlari bo‘ylab sayohat yakunlandi.' 
                    : 'The journey across the 10 major stations of the solar system is complete.'}
                </p>
                <button
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-sky-400/40 transition-all duration-200 cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-sky-400" />
                  <span>{isUz ? 'Boshiga qaytish (Quyoshga)' : 'Return to top (The Sun)'}</span>
                </button>
                <p className="text-[10px] text-slate-400 pt-4">
                  NASA, ESA va Solar System ilmiy parametrlari asosida tayyorlandi.
                </p>
              </div>
            </footer>
          </div>
        )}

        {/* Module 2: Gravity Sandbox */}
        {activeMode === 'sandbox' && (
          <GravitySandbox lang={lang} />
        )}

        {/* Module 3: Relativity Simulator */}
        {activeMode === 'relativity' && (
          <RelativitySimulator lang={lang} />
        )}

        {/* Module 4: Exo-Jump Calculator */}
        {activeMode === 'jump' && (
          <ExoJumpCalculator lang={lang} />
        )}

        {/* Module 5: Quiz & Certificate Generator */}
        {activeMode === 'quiz' && (
          <CosmicQuizCertificate lang={lang} />
        )}
      </main>
    </div>
  );
}
