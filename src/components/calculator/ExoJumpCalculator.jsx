import React, { useState, useEffect, useRef } from 'react';
import { 
  Weight, 
  ArrowUpCircle, 
  Play, 
  RotateCcw, 
  Sliders, 
  Sparkles, 
  Compass, 
  Zap, 
  Check, 
  TrendingUp 
} from 'lucide-react';
import { soundEngine } from '../../utils/audioEngine';

export default function ExoJumpCalculator({ lang = 'uz' }) {
  const [earthWeight, setEarthWeight] = useState(70); // kg
  const [earthJumpHeightCm, setEarthJumpHeightCm] = useState(45); // cm
  const [selectedWorldId, setSelectedWorldId] = useState('oy');

  // Animation state
  const [isJumping, setIsJumping] = useState(false);
  const [jumpY, setJumpY] = useState(0); // in pixels for visual render
  const animRef = useRef(null);
  const jumpStartTime = useRef(null);

  const worlds = [
    {
      id: 'pluton',
      nameUz: 'Pluton',
      nameEn: 'Pluto',
      typeUz: 'Mitti Muz Sayyora',
      typeEn: 'Dwarf Planet',
      g: 0.62,
      color: '#94a3b8',
      descUz: 'Deyarli vaznsizlik — bir sakrashda uy balandligiga parvoz!'
    },
    {
      id: 'titan',
      nameUz: 'Titan (Saturn yo‘ldoshi)',
      nameEn: 'Titan (Moon of Saturn)',
      typeUz: 'Atmosferali Muz Yo‘ldosh',
      typeEn: 'Icy Moon',
      g: 1.35,
      color: '#fde047',
      descUz: 'Zich metan atmosferasida qo‘lga qanot taqib ucha olasiz!'
    },
    {
      id: 'oy',
      nameUz: 'Oy (Selene)',
      nameEn: 'The Moon',
      typeUz: 'Tabiiy Yo‘ldosh',
      typeEn: 'Natural Satellite',
      g: 1.62,
      color: '#cbd5e1',
      descUz: 'Apollon fazogirlarining sekinlashtirilgan mashhur parvozlari.'
    },
    {
      id: 'merkuriy',
      nameUz: 'Merkuriy',
      nameEn: 'Mercury',
      typeUz: 'Tosh Sayyora',
      typeEn: 'Terrestrial',
      g: 3.70,
      color: '#a8a29e',
      descUz: 'Mars bilan deyarli bir xil tortishish kuchi.'
    },
    {
      id: 'mars',
      nameUz: 'Mars',
      nameEn: 'Mars',
      typeUz: 'Qizil Sayyora',
      typeEn: 'Red Planet',
      g: 3.72,
      color: '#f97316',
      descUz: 'Yerdan 2.6 barobar balandroq va yengilroq sakrash.'
    },
    {
      id: 'venera',
      nameUz: 'Venera',
      nameEn: 'Venus',
      typeUz: 'Issiqxona Do‘zaxi',
      typeEn: 'Terrestrial',
      g: 8.87,
      color: '#eab308',
      descUz: 'Yerga eng yaqin tortishish, ammo 92 atmosfera bosimi ostida.'
    },
    {
      id: 'yer',
      nameUz: 'Yer (Baza)',
      nameEn: 'Earth (Baseline)',
      typeUz: 'Bizning Uyimiz',
      typeEn: 'Home World',
      g: 9.81,
      color: '#38bdf8',
      descUz: 'Biz o‘rganib qolgan tabiiy 1.0g gravitatsion me’yor.'
    },
    {
      id: 'saturn',
      nameUz: 'Saturn',
      nameEn: 'Saturn',
      typeUz: 'Halqali Gaz Giganti',
      typeEn: 'Gas Giant',
      g: 10.44,
      color: '#fbbf24',
      descUz: 'Gigant hajmiga qaramay, past zichligi sabab tortishish Yerga yaqin.'
    },
    {
      id: 'neptun',
      nameUz: 'Neptun',
      nameEn: 'Neptune',
      typeUz: 'Muz Giganti',
      typeEn: 'Ice Giant',
      g: 11.15,
      color: '#3b82f6',
      descUz: 'Yerdan 14% og‘irroq, sakrash sezilarli qiyinlashadi.'
    },
    {
      id: 'jupiter',
      nameUz: 'Yupiter',
      nameEn: 'Jupiter',
      typeUz: 'Gaz Giganti',
      typeEn: 'Gas Giant',
      g: 24.79,
      color: '#d97706',
      descUz: 'Vazningiz 2.5 barobar oshadi, zo‘rg‘a bir necha santimetr sakraysiz!'
    },
    {
      id: 'quyosh',
      nameUz: 'Quyosh',
      nameEn: 'The Sun',
      typeUz: 'Yulduz',
      typeEn: 'Yellow Dwarf',
      g: 274.0,
      color: '#ef4444',
      descUz: 'Inson o‘z vazni ostida (2 tonna) lahzada yanchilib ketadi.'
    }
  ];

  const selectedWorld = worlds.find((w) => w.id === selectedWorldId) || worlds[2];

  // Kinematic calculations
  const gEarth = 9.81;
  const hEarthM = earthJumpHeightCm / 100;
  // v0 = sqrt(2 * g * h)
  const v0 = Math.sqrt(2 * gEarth * hEarthM);

  // Jump on target world
  const hTargetM = (v0 * v0) / (2 * selectedWorld.g);
  const hTargetCm = Math.round(hTargetM * 100);
  const hangTimeSec = (2 * v0) / selectedWorld.g;
  const targetWeightKg = Math.round((earthWeight * (selectedWorld.g / gEarth)) * 10) / 10;

  // Real-time Physics Jump Simulation Animation
  const triggerJump = () => {
    if (isJumping) return;
    setIsJumping(true);
    soundEngine.playJump();
    jumpStartTime.current = performance.now();

    // Scale visual jump height so it fits well on canvas (max ~180px)
    const visualScale = Math.min(180 / Math.max(0.45, hTargetM), 120);

    const animate = (currentTime) => {
      const elapsedSec = (currentTime - jumpStartTime.current) / 1000;

      // Kinematic equation: y(t) = v0 * t - 0.5 * g * t^2
      const currentHeightM = Math.max(0, v0 * elapsedSec - 0.5 * selectedWorld.g * elapsedSec * elapsedSec);

      if (elapsedSec >= hangTimeSec || (elapsedSec > 0.05 && currentHeightM <= 0)) {
        setJumpY(0);
        setIsJumping(false);
        soundEngine.playLand();
        return;
      }

      setJumpY(currentHeightM * visualScale);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const isUz = lang === 'uz';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
              {isUz ? 'MODUL 04 // EKSO-KINEMATIKA VA VAZN KALKULYATORI' : 'MODULE 04 // EXO-KINEMATICS & WEIGHT LAB'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isUz ? 'Sayyoralararo Vazn va Sakrash Fizikasi' : 'Interplanetary Weight & Jump Dynamics'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal mt-1 max-w-2xl">
            {isUz 
              ? 'Haqiqiy kinematik qonunlar (v₀ = √(2gh) va h = v₀² / 2g) asosida hisoblangan interaktiv dinamika. O‘z vazningiz va sakrash balandligingizni kiriting va Quyosh tizimi bo‘ylab sinab ko‘ring!' 
              : 'Real kinematic equations simulating jump trajectory and weight across worlds. Enter your Earth baseline and launch the astronaut!'}
          </p>
        </div>

        {/* Selected target quick card */}
        <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: selectedWorld.color }} />
          <div className="font-mono text-xs">
            <div className="text-[10px] text-slate-300 uppercase">{isUz ? 'Hozirgi Manzil' : 'Current World'}</div>
            <div className="font-bold text-white">{isUz ? selectedWorld.nameUz : selectedWorld.nameEn} ({selectedWorld.g} m/s²)</div>
          </div>
        </div>
      </div>

      {/* Main Controls & Live Jump Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
        {/* Left: Input Sliders */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/10 p-6 shadow-2xl space-y-6">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                {isUz ? 'Sizning Jismoniy Parametrlaringiz' : 'Your Physical Parameters'}
              </h3>
            </div>

            {/* Earth Weight Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-300">{isUz ? 'Vazningiz (Yerda):' : 'Weight (on Earth):'}</span>
                <span className="text-emerald-300 font-bold text-base">{earthWeight} kg</span>
              </div>
              <input
                type="range"
                min="30"
                max="150"
                step="1"
                value={earthWeight}
                onChange={(e) => setEarthWeight(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-300 mt-1">
                <span>30 kg</span>
                <span>70 kg (O‘rtacha)</span>
                <span>150 kg</span>
              </div>
            </div>

            {/* Earth Jump Height Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-300">{isUz ? 'Sakrash Balandligi (Yerda):' : 'Jump Height (on Earth):'}</span>
                <span className="text-emerald-300 font-bold text-base">{earthJumpHeightCm} sm ({(earthJumpHeightCm / 100).toFixed(2)} m)</span>
              </div>
              <input
                type="range"
                min="15"
                max="100"
                step="1"
                value={earthJumpHeightCm}
                onChange={(e) => setEarthJumpHeightCm(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-300 mt-1">
                <span>15 sm</span>
                <span>45 sm (O‘rtacha)</span>
                <span>100 sm (Atlet)</span>
              </div>
            </div>

            {/* Live Result Summary for Selected World */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="text-[10px] text-slate-300 uppercase">{isUz ? 'Yangi Vazn' : 'Target Weight'}</div>
                <div className="text-base font-extrabold text-white mt-0.5">{targetWeightKg} kg</div>
                <div className="text-[10px] text-emerald-400">
                  {targetWeightKg < earthWeight ? `-${Math.round((1 - targetWeightKg / earthWeight) * 100)}%` : `+${Math.round((targetWeightKg / earthWeight - 1) * 100)}%`}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="text-[10px] text-slate-300 uppercase">{isUz ? 'Yangi Sakrash' : 'Target Jump'}</div>
                <div className="text-base font-extrabold text-emerald-300 mt-0.5">{hTargetCm} sm</div>
                <div className="text-[10px] text-slate-300">{(hTargetM).toFixed(2)} metr</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="text-[10px] text-slate-300 uppercase">{isUz ? 'Parvoz Vaqti' : 'Hang Time'}</div>
                <div className="text-base font-extrabold text-sky-300 mt-0.5">{hangTimeSec.toFixed(2)} sek</div>
                <div className="text-[10px] text-slate-300">v₀: {v0.toFixed(2)} m/s</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Jump Stage Canvas / SVG */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/10 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[420px]">
            {/* Stage Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  {isUz ? 'Jonli Kinematik Sakrash Maydonchasi' : 'Live Kinematic Jump Stage'}
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-300">
                g = {selectedWorld.g} m/s²
              </span>
            </div>

            {/* Animated Jump Arena */}
            <div className="relative w-full h-[260px] flex items-end justify-center my-4 overflow-hidden">
              {/* Planetary Ground Line */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-4 border-t-2 transition-all duration-500"
                style={{ 
                  backgroundColor: `${selectedWorld.color}22`,
                  borderColor: selectedWorld.color 
                }}
              />

              {/* Height Measurement Scale Ruler */}
              <div className="absolute right-4 bottom-4 top-4 flex flex-col justify-between text-[10px] font-mono text-slate-400 select-none border-l border-white/10 pl-2">
                <span>▲ {Math.max(2, Math.round(hTargetM * 1.2))} m</span>
                <span>{(hTargetM * 0.75).toFixed(1)} m</span>
                <span>{(hTargetM * 0.5).toFixed(1)} m</span>
                <span>{(hTargetM * 0.25).toFixed(1)} m</span>
                <span>0.0 m (Sirt)</span>
              </div>

              {/* Trajectory Guide Arc */}
              <div 
                className="absolute bottom-4 w-32 border-dashed border-t-2 rounded-t-full pointer-events-none transition-all duration-300"
                style={{
                  height: `${Math.min(220, Math.max(30, (hTargetM / 2) * 120))}px`,
                  borderColor: `${selectedWorld.color}55`
                }}
              />

              {/* Interactive Astronaut Character */}
              <div
                className="flex flex-col items-center select-none transition-transform duration-75"
                style={{
                  transform: `translateY(-${jumpY}px)`,
                }}
              >
                {/* Astronaut SVG Avatar */}
                <div className="relative w-16 h-24 flex items-center justify-center">
                  <svg viewBox="0 0 64 96" className="w-full h-full drop-shadow-lg">
                    {/* Backpack / Life Support */}
                    <rect x="14" y="24" width="36" height="42" rx="6" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                    {/* Suit Body */}
                    <rect x="18" y="28" width="28" height="38" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                    {/* Suit Chest Emblem */}
                    <circle cx="26" cy="38" r="3" fill="#38bdf8" />
                    <rect x="32" y="36" width="10" height="4" rx="2" fill="#ef4444" />
                    {/* Helmet */}
                    <circle cx="32" cy="22" r="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                    {/* Visor */}
                    <ellipse cx="32" cy="22" rx="11" ry="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                    <ellipse cx="30" cy="20" rx="4" ry="2" fill="#ffffff" opacity="0.6" />
                    {/* Legs */}
                    <rect x="20" y="64" width="8" height="24" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                    <rect x="36" y="64" width="8" height="24" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                    {/* Boots */}
                    <rect x="18" y="84" width="12" height="8" rx="3" fill="#334155" />
                    <rect x="34" y="84" width="12" height="8" rx="3" fill="#334155" />
                  </svg>
                </div>

                {/* Ground Shadow that shrinks as astronaut rises */}
                <div 
                  className="w-12 h-2 rounded-full bg-black/60 blur-xs transition-all duration-75"
                  style={{
                    transform: `scale(${Math.max(0.2, 1 - jumpY / 150)})`,
                    opacity: Math.max(0.1, 1 - jumpY / 180)
                  }}
                />
              </div>
            </div>

            {/* Launch Action Button */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 z-10">
              <div className="text-xs font-mono text-slate-300">
                {isJumping ? (
                  <span className="text-emerald-400 font-bold animate-pulse">
                    🚀 {isUz ? 'PARVOZ DAVOM ETMOQDA...' : 'IN FLIGHT...'}
                  </span>
                ) : (
                  <span>{isUz ? 'Hozirgi manzil:' : 'Current target:'} <strong className="text-white">{isUz ? selectedWorld.nameUz : selectedWorld.nameEn}</strong></span>
                )}
              </div>

              <button
                onClick={triggerJump}
                disabled={isJumping}
                className={`px-6 py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
                  isJumping
                    ? 'bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:shadow-emerald-500/25 cursor-pointer transform hover:-translate-y-0.5'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isUz ? 'SAKRASH (JUMP!)' : 'LAUNCH JUMP!'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Grid: All 11 Worlds */}
      <div className="rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              {isUz ? 'Quyosh Tizimi Bo‘ylab Vazn va Sakrash Taqqoslovi' : 'Full Solar System Comparison'}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-300">
            {isUz ? 'Taqqoslash uchun sayyorani tanlang' : 'Click to select world'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {worlds.map((w) => {
            const wTargetJumpCm = Math.round(((v0 * v0) / (2 * w.g)) * 100);
            const wTargetWeight = Math.round((earthWeight * (w.g / gEarth)) * 10) / 10;
            const isSelected = w.id === selectedWorldId;

            return (
              <button
                key={w.id}
                onClick={() => {
                  setSelectedWorldId(w.id);
                  soundEngine.playClick();
                }}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-400 shadow-subtle-glow'
                    : 'bg-slate-900/40 border-white/5 hover:border-white/15 hover:bg-white/5'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-400" />
                )}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: w.color }} />
                  <span className="text-xs font-bold text-white font-mono truncate">
                    {isUz ? w.nameUz : w.nameEn}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-300">
                  g = {w.g} m/s²
                </div>

                <div className="mt-2 pt-2 border-t border-white/5 space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-300 text-[10px]">{isUz ? 'Vazn:' : 'Weight:'}</span>
                    <span className="font-bold text-white">{wTargetWeight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300 text-[10px]">{isUz ? 'Sakrash:' : 'Jump:'}</span>
                    <span className="font-bold text-emerald-300">{wTargetJumpCm} sm</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
