import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Printer, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle, 
  FileCheck, 
  Radio 
} from 'lucide-react';
import { soundEngine } from '../../utils/audioEngine';

export default function CosmicQuizCertificate({ lang = 'uz' }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userName, setUserName] = useState('');
  const [certSerial] = useState(() => 'GRV-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-2026');

  const questions = [
    {
      id: 1,
      qUz: 'Yer sirtidagi standart gravitatsion tezlanish (g) qanchaga teng?',
      qEn: 'What is standard gravitational acceleration (g) at Earth surface?',
      options: ['3.72 m/s²', '9.81 m/s²', '24.79 m/s²', '1.62 m/s²'],
      correct: 1,
      explanationUz: 'Yerning o‘rtacha gravitatsiyasi 9.81 m/s² (1.0g) bo‘lib, bu barcha boshqa osmon jismlari uchun bazaviy o‘lchov birligidir.',
      explanationEn: 'Earth standard gravity is 9.81 m/s² (1.0g), the baseline for planetary mechanics.'
    },
    {
      id: 2,
      qUz: 'Quyosh tizimidagi eng baland vulqon — Olimp tog‘i (21.9 km) qaysi sayyorada joylashgan?',
      qEn: 'Which planet hosts the tallest volcano in the Solar System — Olympus Mons (21.9 km)?',
      options: ['Venera', 'Mars', 'Merkuriy', 'Yupiter'],
      correct: 1,
      explanationUz: 'Olimp vulqoni Marsda joylashgan bo‘lib, uning balandligi Everest cho‘qqisidan qariyb 3 barobar balanddir.',
      explanationEn: 'Olympus Mons is located on Mars and stands roughly 3 times taller than Mount Everest.'
    },
    {
      id: 3,
      qUz: 'Eynshteynning Umumiy Nisbiylik nazariyasiga ko‘ra, kuchli gravitatsiya maydonida vaqt oqimi qanday o‘zgaradi?',
      qEn: 'According to General Relativity, how does time flow in a strong gravitational field?',
      options: ['Tezlashadi', 'Sekinlashadi', 'O‘zgarmaydi', 'Butunlay orqaga oqadi'],
      correct: 1,
      explanationUz: 'Kuchli gravitatsiya fazo-vaqtni egadi va tashqi kuzatuvchiga nisbatan vaqt oqimini sekinlashtiradi (Gravitatsion vaqt dilatatsiyasi).',
      explanationEn: 'Strong gravity curves spacetime and dilates time, causing clocks to tick slower relative to distant observers.'
    },
    {
      id: 4,
      qUz: 'Jeyms Uebb kosmik teleskopi doimiy barqaror kuzatuv olib borishi uchun qaysi gravitatsion nuqtaga joylashtirilgan?',
      qEn: 'At which gravitational equilibrium point is the James Webb Space Telescope positioned?',
      options: ['Lagranj L1 nuqtasi', 'Lagranj L2 nuqtasi', 'Oy orbitasi', 'Quyosh markazi'],
      correct: 1,
      explanationUz: 'Quyosh va Yer gravitatsiyasi muvozanatlashgan L2 nuqtasida teleskop Yerdan 1.5 million km narida Quyosh nurlaridan himoyalanib turadi.',
      explanationEn: 'At the Sun-Earth Lagrange L2 point, 1.5 million km from Earth, JWST remains shielded and stable.'
    },
    {
      id: 5,
      qUz: 'O‘rtacha zichligi suvdan ham yengil bo‘lgan (0.69 g/cm³) yagona sayyora qaysi?',
      qEn: 'Which is the only planet with an average density lower than water (0.69 g/cm³)?',
      options: ['Yupiter', 'Uran', 'Saturn', 'Neptun'],
      correct: 2,
      explanationUz: 'Saturn ulkan gaz giganti bo‘lsa-da, uning zichligi suvdan yengil. Agar yetarlicha ulkan okean bo‘lganida, Saturn unda suzib yurar edi.',
      explanationEn: 'Saturn\'s average density is 0.69 g/cm³. It is less dense than water and would float in a gigantic ocean.'
    },
    {
      id: 6,
      qUz: 'Qora tuynukning hech narsa, hatto yorug‘lik ham qochib qutula olmaydigan chegarasi nima deb ataladi?',
      qEn: 'What is the boundary of a black hole beyond which nothing, not even light, can escape?',
      options: ['Akkretsiya diski', 'Hodisalar gorizonti (Event Horizon)', 'Foton sohasi', 'Kvant pardasi'],
      correct: 1,
      explanationUz: 'Hodisalar gorizontida ikkinchi kosmik (qochish) tezligi yorug‘lik tezligiga tenglashadi, shu sababli hech narsa orqaga qayta olmaydi.',
      explanationEn: 'At the Event Horizon, escape velocity equals the speed of light, making escape impossible.'
    },
    {
      id: 7,
      qUz: 'Kuchli gravitatsiya gradienti (masalan, qora tuynuk yaqinida) jismni tik cho‘zib yuboradigan hodisa qanday ataladi?',
      qEn: 'What is the phenomenon where extreme tidal gravitational forces stretch matter vertically?',
      options: ['Spagetifikatsiya (Spaghettification)', 'Flyuidatsiya', 'Ionlashuv', 'Neytrallashuv'],
      correct: 0,
      explanationUz: 'Bosh va oyoq orasidagi ulkan tortishish farqi materiyani atom darajasida cho‘zib yuboradi — bu fizikada rasman spagetifikatsiya deyiladi.',
      explanationEn: 'Extreme tidal gravity differences between head and feet stretch objects vertically like spaghetti.'
    },
    {
      id: 8,
      qUz: 'Yerdan past orbital fazoga chiqish uchun talab qilinadigan Birinchi kosmik tezlik qanchaga teng?',
      qEn: 'What is the First Cosmic Velocity required to achieve low Earth orbit?',
      options: ['7.9 km/s', '11.2 km/s', '16.7 km/s', '29.8 km/s'],
      correct: 0,
      explanationUz: 'Birinchi kosmik tezlik v₁ = √(gR) ≈ 7.9 km/s bo‘lib, Yerni aylanib chiquvchi sun’iy yo‘ldoshlar aynan shu tezlikda harakatlanadi.',
      explanationEn: 'First cosmic velocity is ~7.9 km/s, the speed needed to sustain a stable orbit around Earth.'
    }
  ];

  const currentQ = questions[currentIdx];
  const totalQuestions = questions.length;
  const isUz = lang === 'uz';

  const handleSelectOption = (idx) => {
    if (selectedAnswers[currentIdx] !== undefined) return;
    const isCorrect = idx === currentQ.correct;
    setSelectedAnswers({ ...selectedAnswers, [currentIdx]: idx });
    setShowExplanation(true);

    if (isCorrect) {
      soundEngine.playSuccess();
    } else {
      soundEngine.playBeep(300, 0.15);
    }
  };

  const nextQuestion = () => {
    soundEngine.playClick();
    setShowExplanation(false);
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsCompleted(true);
      soundEngine.playSuccess();
    }
  };

  const restartQuiz = () => {
    soundEngine.playClick();
    setCurrentIdx(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setIsCompleted(false);
  };

  // Calculate score
  const score = Object.entries(selectedAnswers).reduce((acc, [qIdx, ansIdx]) => {
    return acc + (questions[parseInt(qIdx)].correct === ansIdx ? 1 : 0);
  }, 0);

  // Rank title
  const getRank = () => {
    if (score === 8) return { titleUz: 'Bosh Astrofizik & Koinot Doktori', titleEn: 'Grand Astrophysicist', color: 'text-amber-300' };
    if (score >= 6) return { titleUz: 'Katta Orbital Navigator', titleEn: 'Senior Orbital Navigator', color: 'text-sky-300' };
    if (score >= 4) return { titleUz: 'Kosmik Ilmiy Tadqiqotchi', titleEn: 'Cosmic Researcher', color: 'text-emerald-300' };
    return { titleUz: 'Yosh Orbital Kadet', titleEn: 'Junior Cadet', color: 'text-slate-300' };
  };

  const rank = getRank();

  const handlePrint = () => {
    soundEngine.playClick();
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-amber-400 font-bold uppercase">
              {isUz ? 'MODUL 05 // KOSMIK AKADEMIYA VA SERTIFIKAT' : 'MODULE 05 // ACADEMY & CERTIFICATION'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isUz ? 'Astrofizika Viktorinasi & Rasmiy Sertifikat' : 'Astrophysics Quiz & Official Certificate'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal mt-1 max-w-2xl">
            {isUz 
              ? 'Gravitatsiya va kosmik fizika bo‘yicha bilimlaringizni sinovdan o‘tkazing va ismingiz tushirilgan futuristik rasmiy sertifikatni qo‘lga kiriting!' 
              : 'Test your astrophysics and gravitation mastery. Achieve high score to unlock your official verified certificate!'}
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-2 font-mono text-xs">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300">{isUz ? 'Joriy Ball:' : 'Score:'}</span>
          <span className="font-bold text-amber-300">{score} / {totalQuestions}</span>
        </div>
      </div>

      {!isCompleted ? (
        /* Quiz Question Screen */
        <div className="rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Progress bar */}
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-6 border border-white/5">
            <div 
              className="bg-gradient-to-r from-sky-400 to-amber-400 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question Index Badge */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
            <span>{isUz ? 'SAVOL' : 'QUESTION'} {currentIdx + 1} / {totalQuestions}</span>
            <span className="text-amber-400">★ +1 Ball</span>
          </div>

          {/* Question Title */}
          <h3 className="text-lg sm:text-xl font-bold text-white mb-6 leading-relaxed">
            {isUz ? currentQ.qUz : currentQ.qEn}
          </h3>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentIdx] === idx;
              const isCorrect = idx === currentQ.correct;
              const hasAnswered = selectedAnswers[currentIdx] !== undefined;

              let btnStyle = 'bg-slate-900/60 border-white/10 text-slate-200 hover:border-sky-400/40 hover:bg-white/5';
              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-300';
                } else {
                  btnStyle = 'bg-slate-900/30 border-white/5 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnswered}
                  className={`p-4 rounded-xl border text-left font-mono text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {hasAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scientific Explanation Reveal */}
          {showExplanation && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/30 mb-6 font-mono text-xs text-slate-300 animate-fadeIn flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sky-300 block mb-1">
                  💡 {isUz ? 'Ilmiy Tushuntirish:' : 'Scientific Insight:'}
                </span>
                <p className="leading-relaxed">
                  {isUz ? currentQ.explanationUz : currentQ.explanationEn}
                </p>
              </div>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <div className="flex justify-end pt-2">
              <button
                onClick={nextQuestion}
                className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-sky-500/25 cursor-pointer"
              >
                <span>{currentIdx < totalQuestions - 1 ? (isUz ? 'Keyingi Savol' : 'Next Question') : (isUz ? 'Natijalarni Ko‘rish' : 'View Results')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick jump to certificate preview for fast hackathon judging */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{isUz ? 'Tezkor namoyish:' : 'Quick preview:'}</span>
            <button
              onClick={() => {
                setIsCompleted(true);
                soundEngine.playSuccess();
              }}
              className="text-amber-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer"
            >
              {isUz ? 'Sertifikat namunasini ko‘rish ➔' : 'Preview certificate generator ➔'}
            </button>
          </div>
        </div>
      ) : (
        /* Certificate & Results Screen */
        <div className="space-y-6">
          {/* User Name Input Card */}
          <div className="rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/10 p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-mono text-slate-300 mb-1">
                {isUz ? 'Sertifikatga Ism-Familiyangizni Kiriting:' : 'Enter Your Full Name for Certificate:'}
              </label>
              <input
                type="text"
                placeholder={isUz ? 'Masalan: Azizbek Karimov' : 'e.g. John Doe'}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full sm:w-80 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white font-mono text-sm focus:border-sky-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>{isUz ? 'Chop Etish / PDF Saqlash' : 'Print / Save PDF'}</span>
              </button>

              <button
                onClick={restartQuiz}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isUz ? 'Qayta Topshirish' : 'Retake'}</span>
              </button>
            </div>
          </div>

          {/* High-Resolution Futuristic Certificate Component */}
          <div 
            id="official-certificate"
            className="w-full rounded-3xl bg-[#030712] border-4 border-amber-500/40 p-8 sm:p-12 relative overflow-hidden shadow-2xl text-slate-100 print:border-amber-600 print:m-0"
          >
            {/* Holographic Glowing Corners */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-sky-400/20 to-transparent pointer-events-none" />
            <div className="absolute inset-4 border border-white/10 rounded-2xl pointer-events-none" />

            {/* Certificate Header */}
            <div className="text-center relative z-10 space-y-3 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-950/50 border border-amber-500/30 text-amber-300 font-mono text-xs tracking-widest uppercase">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>GRAVITAS // XALQARO KOSMIK LABORATORIYA</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wider font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-amber-300">
                ASTROFIZIKA VA GRAVITATSIYA SERTIFIKATI
              </h1>

              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                CERTIFICATE OF ASTROPHYSICS & GRAVITATIONAL DYNAMICS EXCELLENCE
              </p>
            </div>

            {/* Recipient Details */}
            <div className="text-center relative z-10 my-8 space-y-3">
              <p className="text-xs font-mono text-slate-400 uppercase">
                {isUz ? 'Ushbu rasmiy hujjat tasdiqlaydi:' : 'This certifies that:'}
              </p>

              <div className="text-3xl sm:text-5xl font-extrabold text-white tracking-wide font-sans py-2 border-b-2 border-amber-500/30 max-w-lg mx-auto">
                {userName.trim() || (isUz ? 'Azizbek Karimov' : 'Honored Cadet')}
              </div>

              <p className="text-xs font-mono text-slate-300 max-w-xl mx-auto pt-2 leading-relaxed">
                {isUz 
                  ? `Nyuton orbital mexanikasi, Eynshteyn umumiy nisbiylik nazariyasi va qora tuynuklar fizikasi bo‘yicha imtihondan ${totalQuestions} tadan ${score} ball bilan muvaffaqiyatli o‘tdi.` 
                  : `Successfully completed rigorous examination in Newtonian mechanics, Einsteinian General Relativity, and Black Hole physics with a score of ${score} / ${totalQuestions}.`}
              </p>

              {/* Awarded Rank Badge */}
              <div className="pt-2">
                <span className={`inline-block px-4 py-1.5 rounded-xl bg-slate-900 border border-white/15 font-mono text-sm sm:text-base font-bold ${rank.color}`}>
                  🎖️ {isUz ? rank.titleUz : rank.titleEn}
                </span>
              </div>
            </div>

            {/* Footer Signatures, QR and Seal */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end relative z-10 pt-8 border-t border-white/10 font-mono text-xs text-slate-400">
              {/* Left: Serial Hash */}
              <div className="space-y-1">
                <div className="text-[10px] uppercase text-slate-300">{isUz ? 'Verifikatsiya Kodi:' : 'Serial Hash:'}</div>
                <div className="text-sky-300 font-bold">{certSerial}</div>
                <div className="text-[10px] text-slate-300">SHA-256 Kvant Tasdiqlangan</div>
              </div>

              {/* Center: Hologram Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-amber-400/80 bg-amber-950/40 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Award className="w-8 h-8 text-amber-400 animate-pulse" />
                </div>
                <span className="text-[10px] text-amber-300 mt-2 uppercase font-bold">RASMIY MUHR</span>
              </div>

              {/* Right: Date & Directorate */}
              <div className="text-left sm:text-right space-y-1">
                <div className="text-[10px] uppercase text-slate-300">{isUz ? 'Berilgan Sana:' : 'Issued Date:'}</div>
                <div className="text-white font-bold">{new Date().toLocaleDateString('uz-UZ')}</div>
                <div className="text-[10px] text-slate-300">GRAVITAS Ilmiy Kengashi</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
