export const CELESTIAL_DATA = [
  {
    id: 'yer',
    index: 0,
    name: 'YER',
    subtitle: 'BOSHLANISH: HAYOT VA GRAVITATSIYA',
    tagline: 'Bizni koinotga bog‘lab turuvchi ko‘rinmas kuch beshigi',
    description:
      'Yer gravitatsiyasi (9.81 m/s²) atmosferamizni ushlab turadi, suv havzalarining oqimini ta\'minlaydi va biologik hayotning me\'yorda rivojlanishiga imkon beradi. Parvoz boshlanishi bilan biz bu ko\'rinmas gravitatsion zanjirni yorib o\'tamiz va chuqur koinot tomon yo\'l olamiz.',
    gravity: 9.81,
    gravityRatio: '1.0g (Baza)',
    temperature: '+15°C',
    pressure: '101.3 kPa (1 atm)',
    mass: '5.97 × 10²⁴ kg',
    diameter: '12,742 km',
    escapeVelocity: '11.18 km/s',
    coordinates: 'RA 00h 00m / DEC +00° 00\'',
    distanceFromEarth: '0 km (Boshlang‘ich nuqta)',
    colorTheme: {
      primary: '#00f0ff',
      secondary: '#3b82f6',
      accent: '#22c55e',
      borderClass: 'border-cyan-500/30',
      glowClass: 'shadow-neon-cyan',
      textGrad: 'from-cyan-400 via-sky-300 to-blue-500'
    },
    facts: [
      { label: 'Gravitatsion Tezlanish', value: '9.81 m/s²' },
      { label: 'Birinchi Kosmik Tezlik', value: '7.9 km/s' },
      { label: 'Atmosfera Tarkibi', value: '78% N₂, 21% O₂, 1% Ar' },
      { label: 'Magnitosfera', value: 'Kuchli dipol (Qalqon)' }
    ]
  },
  {
    id: 'mars',
    index: 1,
    name: 'MARS',
    subtitle: 'QIZIL SAYYORA VA GIPER-GRAVITATSIYA TAFOVUTI',
    tagline: 'Temir oksidi changlari va past tortishish qudrati',
    description:
      'Marsda gravitatsiya Yerdagiga nisbatan 62% ga kuchsizroq (atigi 0.38g). Bu yerda siz Yerga qaraganda qariyb 3 barobar balandroq sakrashingiz mumkin. Biroq zaif tortishish kuchi sabab uning atmosferasi nihoyatda siyrak bo‘lib, Quyosh shamoli ta\'sirida asta-sekin fazoga sochilib ketgan.',
    gravity: 3.72,
    gravityRatio: '0.38g (-62%)',
    temperature: '-63°C',
    pressure: '0.61 kPa (Siyrak)',
    mass: '6.42 × 10²³ kg',
    diameter: '6,779 km',
    escapeVelocity: '5.03 km/s',
    coordinates: 'RA 04h 32m / DEC +18° 45\'',
    distanceFromEarth: '225 million km',
    colorTheme: {
      primary: '#f97316',
      secondary: '#ef4444',
      accent: '#fdba74',
      borderClass: 'border-orange-500/30',
      glowClass: 'shadow-neon-amber',
      textGrad: 'from-orange-400 via-red-400 to-amber-300'
    },
    facts: [
      { label: 'Gravitatsion Kuchi', value: '3.72 m/s²' },
      { label: 'Vazn Qisqarishi', value: '100 kg ➔ 38 kg' },
      { label: 'Eng Baland Cho‘qqi', value: 'Olimp (21.9 km)' },
      { label: 'Orbital Yo‘ldoshlar', value: 'Fobos va Deymos' }
    ]
  },
  {
    id: 'jupiter',
    index: 2,
    name: 'YUPITER',
    subtitle: 'GAZ GIGANTI VA TORTISHISH MAYDONI',
    tagline: 'Quyosh sistemasining eng kuchli magnit va gravitatsion qalqoni',
    description:
      'Yupiter barcha boshqa sayyoralar yig‘indisidan 2.5 barobar og‘irroq. Uning shafqatsiz gravitatsiyasi (24.79 m/s²) o‘tib ketayotgan kometalar va asteroidlarni o‘ziga tortib, Yerni halokatli to‘qnashuvlardan himoya qiluvchi ulkan "kosmik changyutgich" vazifasini bajaradi.',
    gravity: 24.79,
    gravityRatio: '2.53g (+153%)',
    temperature: '-110°C',
    pressure: '200+ kPa (Chuqurlikda Mbar)',
    mass: '1.90 × 10²⁷ kg',
    diameter: '139,820 km',
    escapeVelocity: '59.5 km/s',
    coordinates: 'RA 18h 55m / DEC -23° 10\'',
    distanceFromEarth: '778 million km',
    colorTheme: {
      primary: '#eab308',
      secondary: '#ca8a04',
      accent: '#fbbf24',
      borderClass: 'border-yellow-500/30',
      glowClass: 'shadow-neon-amber',
      textGrad: 'from-amber-300 via-yellow-400 to-orange-500'
    },
    facts: [
      { label: 'Gravitatsion Kuchi', value: '24.79 m/s²' },
      { label: 'Buyuk Qizil Dog‘', value: '350 yillik gigant bo‘ron' },
      { label: 'Magnit Maydoni', value: 'Yerdan 20,000 marta kuchli' },
      { label: 'Tabiiy Yo‘ldoshlar', value: '95 ta tasdiqlangan' }
    ]
  },
  {
    id: 'blackhole',
    index: 3,
    name: 'SINGULARLIK: QORA TUYNUK',
    subtitle: 'GRAVITATSIYA ANOMALIYASI VA FAZO-VAQT BURALISHI',
    tagline: 'Hatto yorug‘lik ham qochib qutula olmaydigan chegarasiz qudrat',
    description:
      'Hodisalar gorizontida (Event Horizon) Eynshteynning umumiy nisbiylik nazariyasi to‘liq hukmronlik qiladi. Gravitatsiya kuchi shu qadar cheksizki, fazo-vaqt geometriyasi girdobga aylanadi. Fotonlar akkretsiya diskida aylanadi, tashqi kuzatuvchi uchun esa bu nuqtada vaqt butunlay to‘xtab qoladi.',
    gravity: 981.0,
    gravityRatio: '100g+ (Ekstremal)',
    temperature: '0.00000006 K (Xoking nurlanishi)',
    pressure: 'Cheksiz (Singulyarlik)',
    mass: '4.3 × 10⁶ Quyosh massasi',
    diameter: '24 million km (Shvarsshild)',
    escapeVelocity: '≥ 299,792 km/s (≥ c)',
    coordinates: 'Sagittarius A* (Markaz)',
    distanceFromEarth: '26,000 yorug‘lik yili',
    colorTheme: {
      primary: '#a855f7',
      secondary: '#c084fc',
      accent: '#e879f9',
      borderClass: 'border-purple-500/40',
      glowClass: 'shadow-neon-purple',
      textGrad: 'from-purple-400 via-fuchsia-300 to-cyan-300'
    },
    facts: [
      { label: 'Vaqt Dilatatsiyasi', value: 'γ ➔ ∞ (To‘xtagan vaqt)' },
      { label: 'Gravitatsion Linzalanish', value: 'Fazo egriligi 360°' },
      { label: 'Akkretsiya Diski', value: '0.5c relyativistik aylanish' },
      { label: 'Spagetifikatsiya', value: 'Atom darajasida cho‘zilish' }
    ]
  }
];
