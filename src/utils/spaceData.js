export const STATIONS = [
  {
    id: 'yer',
    index: 0,
    name: 'YER',
    subtitle: '1-BOSQICH // BAZAVIY GRAVITATSIYA',
    tagline: 'Bizni koinotga bog‘lab turuvchi 1.0g ko‘rinmas muvozanat',
    description:
      'Yer gravitatsiyasi (9.81 m/s²) atmosferani ushlab turadi, suv havzalarining oqimini ta\'minlaydi va biologik hayotning me\'yorda rivojlanishiga imkon beradi. Parvoz boshlanishi bilan ushbu bazaviy tortishish maydonidan uzoqlashib, vaznsizlik sari yo‘l olamiz.',
    gravity: 9.81,
    gravityLabel: '1.0g (Bazaviy)',
    mass: '5.97 × 10²⁴ kg',
    diameter: '12,742 km',
    escapeVelocity: '11.2 km/s',
    temperature: '+15°C',
    pressure: '101.3 kPa',
    colorTheme: {
      accent: '#38bdf8',
      badge: 'border-sky-500/30 text-sky-400 bg-sky-950/40',
      gradient: 'from-sky-400 to-blue-500',
    },
    metrics: [
      { label: 'Gravitatsion Tezlanish', value: '9.81 m/s²', sub: '1.0g Yer me\'yori' },
      { label: 'Birinchi Kosmik Tezlik', value: '7.91 km/s', sub: 'Orbital tezlik' },
      { label: 'Atmosfera Bosimi', value: '101.3 kPa', sub: 'Dengiz sathida' },
      { label: 'O‘rtacha Harorat', value: '+15°C', sub: 'Barqaror iqlim' },
    ]
  },
  {
    id: 'oy',
    index: 1,
    name: 'OY',
    subtitle: '2-BOSQICH // MIKRO-GRAVITATSIYA',
    tagline: 'Vaznsizlik va yuqori sakrash effekti',
    description:
      'Oyda tortishish kuchi Yerdagiga nisbatan 6 marta zaif (atigi 0.16g). 80 kg og‘irlikdagi inson bu yerda o‘zini 13 kg deb his qiladi va bir sakrashda 3 metrgacha balandlikka ko‘tarila oladi. Atmosfera deyarli mavjud emas, kraterlar esa millionlab yillar davomida o‘zgarishsiz saqlanadi.',
    gravity: 1.62,
    gravityLabel: '0.16g (-84%)',
    mass: '7.34 × 10²² kg',
    diameter: '3,474 km',
    escapeVelocity: '2.38 km/s',
    temperature: '-130°C / +120°C',
    pressure: '3 × 10⁻¹⁰ Pa',
    colorTheme: {
      accent: '#e2e8f0',
      badge: 'border-slate-400/30 text-slate-300 bg-slate-900/50',
      gradient: 'from-slate-200 to-zinc-400',
    },
    metrics: [
      { label: 'Gravitatsion Kuchi', value: '1.62 m/s²', sub: 'Yerga nisbatan 16.5%' },
      { label: 'Vazn Farqi', value: '100 kg ➔ 16 kg', sub: '6 barobar yengil' },
      { label: 'Harorat Amplitudasi', value: '250°C farq', sub: 'Kun va tun oralig‘i' },
      { label: 'Yerdan Masofa', value: '384,400 km', sub: '1.3 yorug‘lik soniyasi' },
    ]
  },
  {
    id: 'mars',
    index: 2,
    name: 'MARS',
    subtitle: '3-BOSQICH // QIZIL SAYYORA VA KOLONIZATSIYA',
    tagline: 'Temir oksidi qumlari va siyrak atmosfera',
    description:
      'Mars gravitatsiyasi 0.38g bo‘lib, kelajakdagi insoniyat koloniyasi uchun eng qulay ikkinchi manzil sanaladi. Past tortishish sababli uning atmosferasi juda siyrak bo‘lib (Yerdan 160 barobar kam), Quyosh nurlari va fazoviy radiatsiyadan zaif himoyalangan.',
    gravity: 3.72,
    gravityLabel: '0.38g (-62%)',
    mass: '6.42 × 10²³ kg',
    diameter: '6,779 km',
    escapeVelocity: '5.03 km/s',
    temperature: '-63°C',
    pressure: '0.61 kPa',
    colorTheme: {
      accent: '#f97316',
      badge: 'border-amber-500/30 text-amber-400 bg-amber-950/40',
      gradient: 'from-amber-300 to-orange-500',
    },
    metrics: [
      { label: 'Gravitatsion Kuchi', value: '3.72 m/s²', sub: 'Yerga nisbatan 38%' },
      { label: 'Eng Baland Vulqon', value: 'Olimp (21.9 km)', sub: 'Quyosh tizimida №1' },
      { label: 'Atmosfera Bosimi', value: '0.61 kPa', sub: '95% CO₂' },
      { label: 'Kun Davomiyligi', value: '24 soat 37 daq', sub: '1 Sol' },
    ]
  },
  {
    id: 'singularity',
    index: 3,
    name: 'SINGULYARLIK: QORA TUYNUK',
    subtitle: '4-BOSQICH // RELYATIVISTIK ANOMALIYA',
    tagline: 'Eynshteyn nazariyasining cheksiz fazo-vaqt egriligi',
    description:
      'Hodisalar gorizontida (Event Horizon) tortishish kuchi chegarasiz darajaga yetadi. Fotonlar akkretsiya diskida aylanadi, yorug‘lik nurlari esa gravitatsion linzalanish sababli buralib ketadi. Quyidagi interaktiv slayder yordamida gravitatsiya quvvatini o‘zgartirib, real vaqtda harakatni boshqarishingiz mumkin.',
    gravity: 98.1,
    gravityLabel: '10.0g+ (Ekstremal)',
    mass: '4.1 × 10⁶ M☉',
    diameter: '24 mln km',
    escapeVelocity: '≥ 299,792 km/s (c)',
    temperature: '0.00000006 K',
    pressure: 'Cheksiz',
    colorTheme: {
      accent: '#38bdf8',
      badge: 'border-sky-400/40 text-sky-300 bg-sky-950/50',
      gradient: 'from-sky-300 via-indigo-200 to-white',
    },
    metrics: [
      { label: 'Vaqt Dilatatsiyasi', value: 'γ ➔ ∞', sub: 'Vaqt to‘xtashi' },
      { label: 'Hodisalar Gorizonti', value: 'R_s = 2GM/c²', sub: 'Qaytmas chegara' },
      { label: 'Linzalanish Egriligi', value: '360° Foton halqasi', sub: 'Kip Thorne modeli' },
      { label: 'Akkretsiya Tezligi', value: '~0.6c', sub: 'Relyativistik aylanish' },
    ]
  }
];
