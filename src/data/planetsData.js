import * as THREE from 'three';

// Procedural texture generators for 100% offline, zero-latency rendering

export function generateSunTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#ff7a00');
  grad.addColorStop(0.5, '#ffaa00');
  grad.addColorStop(1, '#ff5500');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = Math.random() * 35 + 10;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(255, 255, 200, 0.45)');
    g.addColorStop(0.5, 'rgba(255, 140, 0, 0.2)');
    g.addColorStop(1, 'rgba(255, 60, 0, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function generateMercuryTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const base = ctx.createLinearGradient(0, 0, 0, 512);
  base.addColorStop(0, '#78716c');
  base.addColorStop(0.5, '#57534e');
  base.addColorStop(1, '#44403c');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 1024, 512);

  // Basalt craters and ray systems
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = Math.random() * 24 + 4;
    ctx.fillStyle = 'rgba(28, 25, 23, 0.45)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(214, 211, 209, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r + 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function generateVenusTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const base = ctx.createLinearGradient(0, 0, 0, 512);
  base.addColorStop(0, '#fef08a');
  base.addColorStop(0.3, '#f59e0b');
  base.addColorStop(0.7, '#d97706');
  base.addColorStop(1, '#b45309');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 1024, 512);

  // Swirling sulfuric acid cloud bands
  for (let i = 0; i < 20; i++) {
    const y = i * 26;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(254, 243, 199, 0.35)' : 'rgba(180, 83, 9, 0.25)';
    ctx.beginPath();
    ctx.ellipse(512, y, 600, 18, 0.05 * Math.sin(i), 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function generateEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const ocean = ctx.createLinearGradient(0, 0, 0, 512);
  ocean.addColorStop(0, '#0f3860');
  ocean.addColorStop(0.5, '#0b2545');
  ocean.addColorStop(1, '#081c33');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = '#2d6a4f';
  for (let i = 0; i < 16; i++) {
    const cx = (i * 68) % 1024;
    const cy = 120 + ((i * 47) % 280);
    ctx.beginPath();
    ctx.ellipse(cx, cy, 75 + (i % 4) * 20, 45 + (i % 3) * 15, i * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, 1024, 35);
  ctx.fillRect(0, 477, 1024, 35);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function generateEarthCloudsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 1024, 512);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';

  for (let i = 0; i < 28; i++) {
    const x = (i * 42) % 1024;
    const y = 80 + (i * 24) % 350;
    ctx.beginPath();
    ctx.ellipse(x, y, 90 + (i % 3) * 25, 18 + (i % 4) * 8, -0.15, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function generateMoonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(0, 0, 1024, 512);

  // Lunar Maria (dark basalt plains)
  ctx.fillStyle = 'rgba(51, 65, 85, 0.55)';
  for (let i = 0; i < 12; i++) {
    const x = (i * 92) % 1024;
    const y = 150 + ((i * 35) % 220);
    ctx.beginPath();
    ctx.arc(x, y, 55 + (i % 3) * 20, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function generateMarsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const rust = ctx.createLinearGradient(0, 0, 0, 512);
  rust.addColorStop(0, '#c2410c');
  rust.addColorStop(0.5, '#9a3412');
  rust.addColorStop(1, '#7c2d12');
  ctx.fillStyle = rust;
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = 'rgba(67, 20, 7, 0.4)';
  for (let i = 0; i < 30; i++) {
    const cx = (i * 55) % 1024;
    const cy = 100 + ((i * 37) % 310);
    ctx.beginPath();
    ctx.arc(cx, cy, 18 + (i % 5) * 8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(512, 18, 95, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function generateJupiterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const bands = [
    '#e2d5c3', '#b48154', '#f1e6d0', '#9c6644', 
    '#d4a373', '#faedcd', '#bc6c25', '#dda15e', 
    '#fefae0', '#8b5a2b', '#e9d8a6', '#6f4518'
  ];

  const bandH = 512 / bands.length;
  bands.forEach((color, idx) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, idx * bandH, 1024, bandH + 2);
  });

  // The Great Red Spot
  const grs = ctx.createRadialGradient(620, 340, 5, 620, 340, 50);
  grs.addColorStop(0, '#b91c1c');
  grs.addColorStop(0.7, '#ea580c');
  grs.addColorStop(1, 'rgba(234, 88, 12, 0)');
  ctx.fillStyle = grs;
  ctx.beginPath();
  ctx.ellipse(620, 340, 60, 32, -0.15, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function generateSaturnTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const bands = [
    '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24',
    '#f59e0b', '#d97706', '#b45309', '#fde68a',
    '#fcd34d', '#fef3c7'
  ];

  const bandH = 512 / bands.length;
  bands.forEach((color, idx) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, idx * bandH, 1024, bandH + 2);
  });

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function generateSaturnRingsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(0.15, 'rgba(254, 243, 199, 0.85)');
  grad.addColorStop(0.45, 'rgba(251, 191, 36, 0.7)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.05)'); // Cassini Division
  grad.addColorStop(0.65, 'rgba(245, 158, 11, 0.8)');
  grad.addColorStop(0.9, 'rgba(217, 119, 6, 0.4)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 64);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function generateUranusTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#bae6fd');
  grad.addColorStop(0.5, '#7dd3fc');
  grad.addColorStop(1, '#38bdf8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function generateNeptuneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#2563eb');
  grad.addColorStop(0.5, '#1d4ed8');
  grad.addColorStop(1, '#1e40af');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // White methane storm streaks (Scooter)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  for (let i = 0; i < 10; i++) {
    const y = 200 + i * 20;
    ctx.beginPath();
    ctx.ellipse(300 + i * 50, y, 70, 6, 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function generateBlackHoleDiskTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const center = 256;

  ctx.clearRect(0, 0, 512, 512);

  const grad = ctx.createRadialGradient(center, center, 45, center, center, 250);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(0.2, 'rgba(255, 255, 255, 1)'); // Photon ring
  grad.addColorStop(0.35, 'rgba(56, 189, 248, 0.95)'); // Relativistic blue
  grad.addColorStop(0.55, 'rgba(192, 132, 252, 0.85)'); // Hot violet
  grad.addColorStop(0.8, 'rgba(244, 63, 94, 0.6)'); // Redshifted outer
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export const PLANETS_DATA = [
  {
    id: 'quyosh',
    index: 0,
    nameUz: 'QUYOSH',
    nameEn: 'THE SUN',
    typeUz: 'SARIQ MITTI YULDUZ (G2V)',
    typeEn: 'YELLOW DWARF STAR (G2V)',
    subtitleUz: '01 // QUYOSH TIZIMINING YURAGI',
    subtitleEn: '01 // THE HEART OF THE SOLAR SYSTEM',
    taglineUz: 'Tizimimizning 99.86% massasini jamlagan energiya manbayi',
    taglineEn: 'Holds 99.86% of all mass in our solar system',
    descriptionUz:
      'Quyosh — Quyosh tizimining markaziy yulduzi bo‘lib, uning shafqatsiz gravitatsiyasi barcha 8 ta sayyora, kometalar va asteroidlar kamarini o‘z orbitasida ushlab turadi. Markazidagi termoyadroviy sintez har soniyada 600 million tonna vodorodni geliyga aylantiradi.',
    descriptionEn:
      'The Sun is the star at the center of the Solar System. Its immense gravity holds the planets, asteroids, and comets in orbit. Every second, nuclear fusion in its core fuses 600 million tons of hydrogen into helium.',
    colorTheme: {
      accent: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.35)',
      badge: 'border-amber-500/30 text-amber-300 bg-amber-950/40',
    },
    gravity: 274.0,
    gravityRatio: '27.9g',
    escapeVelocity: '617.5 km/s',
    diameter: '1,392,700 km',
    specs: [
      { labelUz: 'Ekvatorial Diametr', labelEn: 'Equatorial Diameter', value: '1,392,700 km', noteUz: 'Yerdan 109x katta', noteEn: '109x Earth' },
      { labelUz: 'Sirt Harorati', labelEn: 'Surface Temp', value: '5,500°C', noteUz: 'Yadroda ~15,000,000°C', noteEn: 'Core ~15,000,000°C' },
      { labelUz: 'Massasi', labelEn: 'Mass', value: '1.989 × 10³⁰ kg', noteUz: '333,000 ta Yer', noteEn: '333,000 Earth masses' },
      { labelUz: 'Gravitatsiya (g)', labelEn: 'Surface Gravity', value: '274.0 m/s²', noteUz: '27.9g (Yerga nisbatan)', noteEn: '27.9g relative to Earth' },
      { labelUz: 'Qochish Tezligi', labelEn: 'Escape Velocity', value: '617.5 km/s', noteUz: 'Yerdan 55 barobar tez', noteEn: '55x Earth escape speed' },
      { labelUz: 'Aylanish Davri', labelEn: 'Rotation Period', value: '25 – 35 kun', noteUz: 'Differensial aylanish', noteEn: 'Differential rotation' },
    ],
    funFactUz: 'Quyosh shu qadar kattaki, uning ichiga 1.3 millionta Yer sayyorasi bemalol sig‘ishi mumkin.',
    funFactEn: 'About 1.3 million Earths could fit inside the Sun.'
  },
  {
    id: 'merkuriy',
    index: 1,
    nameUz: 'MERKURIY',
    nameEn: 'MERCURY',
    typeUz: 'ENG KICHIK TOSH SAYYORA',
    typeEn: 'SMALLEST TERRESTRIAL PLANET',
    subtitleUz: '02 // QUYOSHGA ENG YAQIN QO‘SHNI',
    subtitleEn: '02 // CLOSEST NEIGHBOR TO THE SUN',
    taglineUz: 'Ekstremal harorat tebranishlari va kraterlar olami',
    taglineEn: 'Extreme temperature swings and cratered basalt world',
    descriptionUz:
      'Merkuriy — Quyoshga eng yaqin va Quyosh tizimidagi eng mitti sayyora. Uning zich temir yadrosi butun hajmining 85 foizini tashkil qiladi. Atmosferasi yo‘qligi sabab kunduzi +430°C gacha qiziydi, tunda esa -180°C gacha soviydi.',
    descriptionEn:
      'Mercury is the closest planet to the Sun and the smallest in the solar system. It has a giant metallic core occupying 85% of its volume. Without an atmosphere to regulate heat, daytime temperatures soar to +430°C while nights plunge to -180°C.',
    colorTheme: {
      accent: '#a8a29e',
      glow: 'rgba(168, 162, 158, 0.3)',
      badge: 'border-stone-500/30 text-stone-300 bg-stone-950/40',
    },
    gravity: 3.7,
    gravityRatio: '0.38g',
    escapeVelocity: '4.25 km/s',
    diameter: '4,879 km',
    specs: [
      { labelUz: 'Ekvatorial Diametr', labelEn: 'Diameter', value: '4,879 km', noteUz: 'Oydan bir oz katta', noteEn: 'Slightly larger than Moon' },
      { labelUz: 'Quyoshdan Masofa', labelEn: 'Distance from Sun', value: '57.9 mln km', noteUz: '0.39 AU', noteEn: '0.39 AU' },
      { labelUz: 'Gravitatsiya (g)', labelEn: 'Surface Gravity', value: '3.70 m/s²', noteUz: '0.38g (Yerga nisbatan -62%)', noteEn: '0.38g (-62% Earth)' },
      { labelUz: 'Orbita Davri (1 Yil)', labelEn: 'Orbital Period', value: '88 kun', noteUz: 'Eng tezkor sayyora (47 km/s)', noteEn: 'Fastest planet (47 km/s)' },
      { labelUz: 'Kunduzgi Harorat', labelEn: 'Day Temp', value: '+430°C', noteUz: 'Qo‘rg‘oshinni eritadi', noteEn: 'Melts lead' },
      { labelUz: 'Tungi Harorat', labelEn: 'Night Temp', value: '-180°C', noteUz: 'Chuqur kosmik sovuqlik', noteEn: 'Deep freeze' },
    ],
    funFactUz: 'Merkuriyda bir kun (quyosh chiqishidan botishigacha) 176 Yer kuniga teng, ya’ni uning bitta kuni bitta yilidan uzunroq!',
    funFactEn: 'A solar day on Mercury lasts 176 Earth days, meaning one day is twice as long as its entire year!'
  },
  {
    id: 'venera',
    index: 2,
    nameUz: 'VENERA',
    nameEn: 'VENUS',
    typeUz: 'ISSIQXONA DO‘ZAXI',
    typeEn: 'GREENHOUSE INFERNO',
    subtitleUz: '03 // YERNING ZAHARLI EGIZAGI',
    subtitleEn: '03 // EARTH\'S TOXIC TWIN',
    taglineUz: 'Quyosh tizimidagi eng issiq va eng zich atmosferali sayyora',
    taglineEn: 'The hottest planet in the solar system trapped in runaway greenhouse effect',
    descriptionUz:
      'Venera hajmi va massasi bo‘yicha Yerga juda yaqin, ammo uning 96% karbonat angidriddan iborat ulkan atmosferasi dahshatli issiqxona effektini hosil qiladi. Sirt bosimi Yerdagidan 92 marta kuchli bo‘lib, okeanning 900 metr chuqurligiga teng.',
    descriptionEn:
      'Venus is similar in size and mass to Earth, but choked by a thick CO2 atmosphere that traps heat in a runaway greenhouse effect. Its surface atmospheric pressure is 92 times Earth\'s, equivalent to being 900 meters under the ocean.',
    colorTheme: {
      accent: '#eab308',
      glow: 'rgba(234, 179, 8, 0.3)',
      badge: 'border-yellow-500/30 text-yellow-300 bg-yellow-950/40',
    },
    gravity: 8.87,
    gravityRatio: '0.90g',
    escapeVelocity: '10.36 km/s',
    diameter: '12,104 km',
    specs: [
      { labelUz: 'Ekvatorial Diametr', labelEn: 'Diameter', value: '12,104 km', noteUz: 'Yerdan atigi 5% kichik', noteEn: '95% Earth size' },
      { labelUz: 'Sirt Harorati', labelEn: 'Surface Temp', value: '+465°C', noteUz: 'Merkuriydan ham issiqroq', noteEn: 'Hotter than Mercury' },
      { labelUz: 'Atmosfera Bosimi', labelEn: 'Surface Pressure', value: '9.3 MPa (92 atm)', noteUz: 'Titan suvosti kemasidek', noteEn: '92 Earth atmospheres' },
      { labelUz: 'Gravitatsiya (g)', labelEn: 'Surface Gravity', value: '8.87 m/s²', noteUz: '0.90g (Yerga juda yaqin)', noteEn: '0.90g' },
      { labelUz: 'Aylanish Yo‘nalishi', labelEn: 'Rotation', value: 'Teskari (Retrograd)', noteUz: 'Quyosh g‘arbdan chiqadi', noteEn: 'Retrograde spin' },
      { labelUz: 'Bulutlar Tarkibi', labelEn: 'Clouds', value: 'Sulfat kislotasi (H₂SO₄)', noteUz: 'Kislotali yomg‘irlar', noteEn: 'Sulfuric acid' },
    ],
    funFactUz: 'Venerada Quyosh g‘arbdan chiqib, sharqqa botadi, chunki u o‘z o‘qi atrofida boshqa barcha sayyoralarga teskari aylanadi.',
    funFactEn: 'On Venus, the Sun rises in the west and sets in the east due to its backward retrograde rotation.'
  },
  {
    id: 'yer',
    index: 3,
    nameUz: 'YER',
    nameEn: 'EARTH',
    typeUz: 'HAYOT BESHIGI (TERRESTRIAL)',
    typeEn: 'CRADLE OF LIFE (TERRESTRIAL)',
    subtitleUz: '04 // BIZNING TUG‘ILGAN UYIMIZ',
    subtitleEn: '04 // OUR HOME PLANET',
    taglineUz: 'Koinotda hayot mavjudligi isbotlangan yagona ma’lum voha',
    taglineEn: 'The only known world in the universe confirmed to harbor life',
    descriptionUz:
      'Yer — Quyoshdan uchinchi sayyora bo‘lib, yuzasining 71 foizi suyuq suv bilan qoplangan. Kuchli magnitosferamiz va 1.0g barqaror gravitatsiyamiz atmosferani quyosh shamollaridan himoya qilib, milliardlab yillar davomida biologik hayotning gullab-yashnashini ta’minlab kelmoqda.',
    descriptionEn:
      'Earth is the third planet from the Sun and the only astronomical object known to harbor life. With 71% of its surface covered in liquid water and a protective geomagnetic shield, it provides the perfect 1.0g gravitational cradle for civilization.',
    colorTheme: {
      accent: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.3)',
      badge: 'border-sky-500/30 text-sky-300 bg-sky-950/40',
    },
    gravity: 9.81,
    gravityRatio: '1.0g',
    escapeVelocity: '11.18 km/s',
    diameter: '12,742 km',
    specs: [
      { labelUz: 'Ekvatorial Diametr', labelEn: 'Diameter', value: '12,742 km', noteUz: '5-o‘rinda turuvchi sayyora', noteEn: '5th largest planet' },
      { labelUz: 'Quyoshdan Masofa', labelEn: 'Distance to Sun', value: '149.6 mln km', noteUz: '1 Astronomik Birlik (AU)', noteEn: '1 Astronomical Unit' },
      { labelUz: 'Gravitatsiya (g)', labelEn: 'Surface Gravity', value: '9.81 m/s²', noteUz: '1.0g bazaviy me’yor', noteEn: '1.0g baseline reference' },
      { labelUz: 'Tabiiy Yo‘ldoshi', labelEn: 'Moon', value: '1 ta (Oy / Selene)', noteUz: 'Diametri: 3,474 km', noteEn: 'Diameter: 3,474 km' },
      { labelUz: 'Orbita Tezligi', labelEn: 'Orbital Speed', value: '29.78 km/s', noteUz: '107,200 km/soat', noteEn: '107,200 km/h' },
      { labelUz: 'O‘rtacha Harorat', labelEn: 'Avg Temperature', value: '+15°C', noteUz: 'Suv 3 agregat holatda', noteEn: 'Water in all 3 states' },
    ],
    funFactUz: 'Yer sathidagi eng chuqur nuqta Mariana botig‘i (11,034 m), eng baland cho‘qqi esa Everest (8,848 m) dir.',
    funFactEn: 'The deepest known trench is the Mariana Trench (11,034 m), while the highest peak is Mt. Everest (8,848 m).'
  },
  {
    id: 'mars',
    index: 4,
    nameUz: 'MARS',
    nameEn: 'MARS',
    typeUz: 'QIZIL SAYYORA (TERRESTRIAL)',
    typeEn: 'THE RED PLANET',
    subtitleUz: '05 // KELAJAK KOLONIZATSIYASI',
    subtitleEn: '05 // FRONTIER OF COLONIZATION',
    taglineUz: 'Temir oksidi qumlari, gigant kanyonlar va muzlagan qutblar',
    taglineEn: 'Rust-tinted dunes, colossal volcanoes, and sub-surface water ice',
    descriptionUz:
      'Mars — Quyoshdan to‘rtinchi sayyora. Uning sirtidagi temir oksidi changlari sayyoraga xarakterli qizil-jigar rang baxsh etadi. Marsda Quyosh tizimidagi eng ulkan vulqon — Olimp cho‘qqisi (21.9 km) va 4,000 km uzunlikdagi Mariner kanyonlar vodiysi joylashgan.',
    descriptionEn:
      'Mars is the fourth planet from the Sun. Iron oxide dust gives it its iconic reddish hue. Mars hosts the tallest volcano in the Solar System — Olympus Mons (21.9 km high) — and the colossal Valles Marineris canyon network stretching over 4,000 km.',
    colorTheme: {
      accent: '#f97316',
      glow: 'rgba(249, 115, 22, 0.3)',
      badge: 'border-orange-500/30 text-orange-300 bg-orange-950/40',
    },
    gravity: 3.72,
    gravityRatio: '0.38g',
    escapeVelocity: '5.03 km/s',
    diameter: '6,779 km',
    specs: [
      { labelUz: 'Ekvatorial Diametr', labelEn: 'Diameter', value: '6,779 km', noteUz: 'Yerdan 2 barobar kichik', noteEn: 'Half of Earth diameter' },
      { labelUz: 'Quyoshdan Masofa', labelEn: 'Distance to Sun', value: '227.9 mln km', noteUz: '1.52 AU masofa', noteEn: '1.52 AU' },
      { labelUz: 'Gravitatsiya (g)', labelEn: 'Surface Gravity', value: '3.72 m/s²', noteUz: '0.38g (Yerga nisbatan -62%)', noteEn: '0.38g (-62% Earth)' },
      { labelUz: 'Olimp Vulqoni', labelEn: 'Olympus Mons', value: '21.9 km baland', noteUz: 'Everestdan 2.5x baland', noteEn: '2.5x taller than Everest' },
      { labelUz: 'Tabiiy Yo‘ldoshlar', labelEn: 'Moons', value: '2 ta (Fobos, Deymos)', noteUz: 'Qadimiy asteroidlar', noteEn: 'Phobos and Deimos' },
      { labelUz: 'Atmosfera Tarkibi', labelEn: 'Atmosphere', value: '95% CO₂', noteUz: 'Juda siyrak (0.6 kPa)', noteEn: 'Very thin (0.6% Earth)' },
    ],
    funFactUz: 'Marsda kun uzunligi (Sol) 24 soat 37 daqiqani tashkil qilib, Yer kuniga deyarli teng!',
    funFactEn: 'A Martian day (called a Sol) lasts 24 hours and 37 minutes, almost identical to Earth!'
  },
  {
    id: 'jupiter',
    index: 5,
    nameUz: 'YUPITER',
    nameEn: 'JUPITER',
    typeUz: 'GAZ GIGANTI (JOVIAN)',
    typeEn: 'GAS GIANT (JOVIAN)',
    subtitleUz: '06 // QUYOSH TIZIMINING HUKMRONI',
    subtitleEn: '06 // KING OF THE SOLAR SYSTEM',
    taglineUz: 'Barcha boshqa sayyoralar umumiy massasidan 2.5 barobar og‘irroq gigant',
    taglineEn: 'Massive guardian holding 2.5x the mass of all other planets combined',
    descriptionUz:
      'Yupiter — ulkan gaz gumbazi bo‘lib, asosan vodorod va geliydan iborat. Qattiq sirti mavjud emas. Uning atmosferasida yuzlab yillardan buyon aylanayotgan "Buyuk Qizil Dog‘" bo‘roni butun Yer sayyorasidan kattaroqdir. Kuchli gravitatsiyasi kometalarni tutib, ichki sayyoralarni to‘qnashuvlardan asraydi.',
    descriptionEn:
      'Jupiter is a gas giant primarily made of hydrogen and helium with no solid surface. The Great Red Spot is a gargantuan anticyclonic storm larger than Earth that has raged for over 350 years. Its immense gravitational shield pulls in comets, protecting Earth from catastrophic strikes.',
    colorTheme: {
      accent: '#eab308',
      glow: 'rgba(234, 179, 8, 0.3)',
      badge: 'border-yellow-500/30 text-yellow-300 bg-yellow-950/40',
    },
    gravity: 24.79,
    gravityRatio: '2.53g',
    escapeVelocity: '59.5 km/s',
    diameter: '139,820 km',
    specs: [
      { labelUz: 'Ekvatorial Diametr', labelEn: 'Diameter', value: '139,820 km', noteUz: 'Yerdan 11 barobar keng', noteEn: '11x Earth diameter' },
      { labelUz: 'Quyoshdan Masofa', labelEn: 'Distance to Sun', value: '778.5 mln km', noteUz: '5.20 AU masofa', noteEn: '5.20 AU' },
      { labelUz: 'Gravitatsiya (g)', labelEn: 'Surface Gravity', value: '24.79 m/s²', noteUz: '2.53g (Eng kuchli tortishish)', noteEn: '2.53g (Strongest planet)' },
      { labelUz: 'Yo‘ldoshlar Soni', labelEn: 'Moons', value: '95 ta tasdiqlangan', noteUz: 'Ganimed, Yevropa, Io', noteEn: 'Ganymede, Europa, Io' },
      { labelUz: 'Aylanish Tezligi', labelEn: 'Rotation Period', value: '9 soat 55 daq', noteUz: 'Eng tez aylanuvchi sayyora', noteEn: 'Fastest spinning planet' },
      { labelUz: 'Magnit Maydoni', labelEn: 'Magnetic Field', value: 'Yerdan 20,000x', noteUz: 'Ulkan nurlanish kamari', noteEn: '20,000x Earth\'s field' },
    ],
    funFactUz: 'Yupiterning eng katta yo‘ldoshi Ganimed hatto Merkuriy sayyorasidan ham kattaroqdir.',
    funFactEn: 'Jupiter\'s moon Ganymede is larger than the entire planet Mercury.'
  },
  {
    id: 'saturn',
    index: 6,
    nameUz: 'SATURN',
    nameEn: 'SATURN',
    typeUz: 'HALQALI GAZ GIGANTI',
    typeEn: 'RINGED GAS GIANT',
    subtitleUz: '07 // KOINOT JEZVA GO‘ZALLIGI',
    subtitleEn: '07 // JEWEL OF THE SOLAR SYSTEM',
    taglineUz: 'Muz va tosh kristallaridan iborat afsonaviy halqalar toji',
    taglineEn: 'Crowned with majestic rings of pure water ice and rocky debris',
    descriptionUz:
      'Saturn — Quyosh tizimidagi eng maftunkor sayyora. Uning diametri 282,000 km ga cho‘zilgan ko‘rkam halqalari milliardlab mayda muz va chang donachalaridan tashkil topgan bo‘lsa-da, qalinligi atigi 10-30 metr atrofida. Saturn o‘rtacha zichligi bo‘yicha suvdan ham yengil (0.69 g/cm³) yagona sayyoradir.',
    descriptionEn:
      'Saturn is renowned for its iconic ring system spanning 282,000 km across yet only 10 to 30 meters thick, composed primarily of water ice chunks. Remarkably, Saturn\'s average density (0.69 g/cm³) is less than water — it would float in a giant bathtub!',
    colorTheme: {
      accent: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.3)',
      badge: 'border-amber-400/30 text-amber-200 bg-amber-950/40',
    },
    gravity: 10.44,
    gravityRatio: '1.06g',
    escapeVelocity: '35.5 km/s',
    diameter: '116,460 km',
    specs: [
      { labelUz: 'Ekvatorial Diametr', labelEn: 'Diameter', value: '116,460 km', noteUz: 'Yerdan 9.1 barobar katta', noteEn: '9.1x Earth' },
      { labelUz: 'Quyoshdan Masofa', labelEn: 'Distance to Sun', value: '1.43 milliard km', noteUz: '9.58 AU masofa', noteEn: '9.58 AU' },
      { labelUz: 'Gravitatsiya (g)', labelEn: 'Surface Gravity', value: '10.44 m/s²', noteUz: '1.06g (Yerga deyarli teng)', noteEn: '1.06g (Close to Earth)' },
      { labelUz: 'Halqalar Kengligi', labelEn: 'Ring Width', value: '~282,000 km', noteUz: 'Qalinligi atigi ~10-30 m', noteEn: 'Thickness only 10-30m' },
      { labelUz: 'O‘rtacha Zichligi', labelEn: 'Density', value: '0.687 g/cm³', noteUz: 'Suvda suzib yurishi mumkin!', noteEn: 'Lighter than water!' },
      { labelUz: 'Yo‘ldoshlar Soni', labelEn: 'Moons', value: '146 ta (Lider)', noteUz: 'Titan (atmosferali yo‘ldosh)', noteEn: 'Titan, Enceladus' },
    ],
    funFactUz: 'Saturnning yo‘ldoshi Titanda suyuq metan ko‘llari va zich atmosfera mavjud bo‘lib, hayot qidirilayotgan asosiy ob’yektlardan biridir.',
    funFactEn: 'Saturn\'s moon Titan has rivers and lakes of liquid methane and a nitrogen-rich atmosphere.'
  },
  {
    id: 'uran',
    index: 7,
    nameUz: 'URAN',
    nameEn: 'URANUS',
    typeUz: 'MUZ GIGANTI (ICE GIANT)',
    typeEn: 'ICE GIANT',
    subtitleUz: '08 // YONBOSHLAB AYLANUVCHI SAYYORA',
    subtitleEn: '08 // THE TILTED GIANT',
    taglineUz: 'Metan muzlari, 98° burchak ostida qulagan aylanish o‘qi',
    taglineEn: 'Cyan methane skies orbiting the sun on its side with a 98° axial tilt',
    descriptionUz:
      'Uran — Quyosh tizimidagi eng g‘alati sayyoralardan biri. U o‘z orbitasida yonboshlagan holda (o‘qi 97.77° egilgan) aylanadi. Atmosferasidagi metan gazi qizil nurlarni yutib, sayyoraga o‘ziga xos moviy-yashil zumrad tus beradi. Sirt harorati -224°C gacha yetib, eng sovuq atmosfera hisoblanadi.',
    descriptionEn:
      'Uranus is unique with its 97.8-degree axial tilt, effectively rolling on its side around the Sun. Atmospheric methane absorbs red light, giving the planet its serene aquamarine cyan color. It holds the record for the coldest atmospheric temperature at -224°C.',
    colorTheme: {
      accent: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.3)',
      badge: 'border-cyan-500/30 text-cyan-300 bg-cyan-950/40',
    },
    gravity: 8.69,
    gravityRatio: '0.89g',
    escapeVelocity: '21.3 km/s',
    diameter: '50,724 km',
    specs: [
      { labelUz: 'Ekvatorial Diametr', labelEn: 'Diameter', value: '50,724 km', noteUz: 'Yerdan 4 barobar katta', noteEn: '4x Earth diameter' },
      { labelUz: 'Quyoshdan Masofa', labelEn: 'Distance to Sun', value: '2.87 milliard km', noteUz: '19.2 AU', noteEn: '19.2 AU' },
      { labelUz: 'Gravitatsiya (g)', labelEn: 'Surface Gravity', value: '8.69 m/s²', noteUz: '0.89g (Yerdan 11% yengil)', noteEn: '0.89g' },
      { labelUz: 'Eng Past Harorat', labelEn: 'Min Temp', value: '-224°C', noteUz: 'Eng sovuq sayyora', noteEn: 'Coldest planetary atmosphere' },
      { labelUz: 'O‘q Qiyaligi', labelEn: 'Axial Tilt', value: '97.77°', noteUz: 'Qutblarida 42 yil kunduz!', noteEn: '42 years daylight at poles' },
      { labelUz: 'Yo‘ldoshlar Soni', labelEn: 'Moons', value: '28 ta', noteUz: 'Miranda, Titaniya, Oberon', noteEn: 'Miranda, Titania, Oberon' },
    ],
    funFactUz: 'Uran o‘z o‘qi atrofida yonboshlab aylangani sababli, uning qutblarida 42 yil uzluksiz kunduz va 42 yil qorong‘u tun hukm suradi.',
    funFactEn: 'Because Uranus rolls on its side, each pole gets 42 continuous years of uninterrupted sunlight followed by 42 years of darkness.'
  },
  {
    id: 'neptun',
    index: 8,
    nameUz: 'NEPTUN',
    nameEn: 'NEPTUNE',
    typeUz: 'ENG SHAFQATSIZ BO‘RONLAR SAYYORASI',
    typeEn: 'WINDIEST ICE GIANT',
    subtitleUz: '09 // QUYOSH TIZIMINING CHETKI QO‘RIQCHISI',
    subtitleEn: '09 // OUTPOST OF THE SOLAR SYSTEM',
    taglineUz: 'Tovush tezligidan tezroq (2,100 km/soat) esuvchi shafqatsiz dovullar',
    taglineEn: 'Supersonic winds whipping past at 2,100 km/h in deep cobalt oceans',
    descriptionUz:
      'Neptun — Quyoshdan eng uzoqda joylashgan sakkizinchi sayyora. U Quyosh tizimidagi eng tezkor va shafqatsiz shamollarga ega bo‘lib, shamol tezligi 2,100 km/soat ga yetadi. Uning yo‘ldoshi Triton esa teskari yo‘nalishda aylanuvchi va sirtida suyuq azot geyzerlari otiluvchi muzli olamdir.',
    descriptionEn:
      'Neptune is the most distant major planet in our solar system. It harbors supersonic winds exceeding 2,100 km/h — the fastest recorded anywhere in the Solar System. Its retrograding moon Triton erupts geysers of liquid nitrogen.',
    colorTheme: {
      accent: '#3b82f6',
      glow: 'rgba(59, 130, 246, 0.3)',
      badge: 'border-blue-500/30 text-blue-300 bg-blue-950/40',
    },
    gravity: 11.15,
    gravityRatio: '1.14g',
    escapeVelocity: '23.5 km/s',
    diameter: '49,244 km',
    specs: [
      { labelUz: 'Ekvatorial Diametr', labelEn: 'Diameter', value: '49,244 km', noteUz: 'Yerdan 3.9 barobar katta', noteEn: '3.9x Earth diameter' },
      { labelUz: 'Quyoshdan Masofa', labelEn: 'Distance to Sun', value: '4.5 milliard km', noteUz: '30.1 AU', noteEn: '30.1 AU' },
      { labelUz: 'Gravitatsiya (g)', labelEn: 'Surface Gravity', value: '11.15 m/s²', noteUz: '1.14g (Yerdan 14% ortiq)', noteEn: '1.14g (+14% Earth)' },
      { labelUz: 'Shamol Tezligi', labelEn: 'Wind Speeds', value: '2,100 km/soat', noteUz: 'Tovushdan 1.7x tez', noteEn: 'Mach 1.7 supersonic' },
      { labelUz: 'Orbita Davri (1 Yil)', labelEn: 'Orbital Period', value: '164.8 Yer yili', noteUz: 'Kashf etilgandan beri 1 marta', noteEn: 'Only 1 orbit since discovery' },
      { labelUz: 'Yo‘ldoshlar Soni', labelEn: 'Moons', value: '16 ta', noteUz: 'Triton (Muz geyzerlari)', noteEn: 'Triton (Nitrogen geysers)' },
    ],
    funFactUz: 'Neptun matematik hisob-kitoblar (Nyutonning gravitatsiya qonuni) orqali teleskopda ko‘rilishidan oldin kashf qilingan yagona sayyoradir!',
    funFactEn: 'Neptune was the first planet located through mathematical predictions rather than empirical observation.'
  },
  {
    id: 'singulyarlik',
    index: 9,
    nameUz: 'SAGITTARIUS A* (QORA TUYNUK)',
    nameEn: 'SAGITTARIUS A* (SUPERMASSIVE BLACK HOLE)',
    typeUz: 'GRAVITATSION SINGULYARLIK & FAZO-VAQT GIRDOBI',
    typeEn: 'GRAVITATIONAL SINGULARITY & SPACETIME VORTEX',
    subtitleUz: '10 // CHEKSIZ GRAVITATSIYA VA VAQTNING TO‘XTAWISHI',
    subtitleEn: '10 // INFINITE GRAVITY & STOPPED TIME',
    taglineUz: 'Hatto yorug‘lik ham qochib qutula olmaydigan chegarasiz qudrat',
    taglineEn: 'Event horizon beyond which nothing, not even light, can ever escape',
    descriptionUz:
      'Sagittarius A* — Somon Yo‘li galaktikamiz markazidagi 4.3 million Quyosh massasiga ega supermassiv qora tuynuk. Hodisalar gorizonti (Event Horizon) chegarasida Eynshteynning umumiy nisbiylik nazariyasi to‘liq namoyon bo‘ladi: gravitatsion vaqt dilatatsiyasi cheksizlikka intiladi va tashqi kuzatuvchi uchun vaqt butunlay to‘xtab qoladi.',
    descriptionEn:
      'Sagittarius A* is the supermassive black hole at the center of the Milky Way galaxy, containing 4.3 million times the mass of our Sun. At the Event Horizon, relativistic time dilation approaches infinity — for an outside observer, falling objects appear frozen forever in time.',
    colorTheme: {
      accent: '#c084fc',
      glow: 'rgba(192, 132, 252, 0.4)',
      badge: 'border-purple-500/40 text-purple-300 bg-purple-950/50',
    },
    gravity: 999999.0,
    gravityRatio: '∞ g (Singulyar)',
    escapeVelocity: '≥ 299,792 km/s (≥ c)',
    diameter: '24,000,000 km (Shvarsshild)',
    specs: [
      { labelUz: 'Massasi', labelEn: 'Mass', value: '4.3 × 10⁶ Quyosh massasi', noteUz: '8.5 × 10³⁶ kg', noteEn: '4.3 million solar masses' },
      { labelUz: 'Hodisalar Gorizonti', labelEn: 'Event Horizon (Rs)', value: '12.7 million km', noteUz: 'Merkuriy orbitasidan kichik', noteEn: 'Schwarzschild radius' },
      { labelUz: 'Qochish Tezligi', labelEn: 'Escape Velocity', value: '299,792 km/s (c)', noteUz: 'Yorug‘lik tezligiga teng', noteEn: 'Speed of light' },
      { labelUz: 'Vaqt Dilatatsiyasi', labelEn: 'Time Dilation', value: 'γ ➔ ∞', noteUz: 'Gorizontda vaqt to‘xtaydi', noteEn: 'Time stops at horizon' },
      { labelUz: 'Yerdan Masofa', labelEn: 'Distance to Earth', value: '26,000 yorug‘lik yili', noteUz: 'Galaktikamiz yadrosi', noteEn: 'Center of Milky Way' },
      { labelUz: 'Akkretsiya Diski', labelEn: 'Accretion Disk', value: '0.9c relyativistik', noteUz: 'Millionlab daraja plazma', noteEn: '0.9c relativistic plasma' },
    ],
    funFactUz: 'Qora tuynuk yaqinida gravitatsion linzalanish sababli uning orqasidagi yulduzlar qora tuynuk atrofida yorug‘ halqa (Eynshteyn halqasi) kabi ko‘rinadi!',
    funFactEn: 'Gravitational lensing bends light so strongly that you can see stars directly behind the black hole warped into a luminous halo.'
  }
];
