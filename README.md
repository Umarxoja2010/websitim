# 🌌 GRAVITAS // Koinot, Nisbiylik va Gravitatsiya Laboratoriyasi

> **IT Tanlovi va Musobaqalar uchun maxsus yaratilgan interaktiv 3D astrofizika va nisbiylik ta'limiy platformasi.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r172-000000?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Loyiha Haqida

**GRAVITAS** — bu foydalanuvchiga Quyosh tizimining barcha sayyoralarini, relyativistik astrofizika qonunlarini va gravitatsion maydonlarni real vaqtda bevosita his qilish imkonini beruvchi ilg'or veb-laboratoriya. Loyiha maktab va universitet o'quvchilari hamda astrofizika qiziquvchilari uchun murakkab fizik tushunchalarni (Eynshteyn nisbiylik nazariyasi, Shvarsshild qora tuynuklari, N-jism orbital mexanikasi) ko'rgazmali va interaktiv shaklda taqdim etadi.

---

## 🚀 Asosiy Imkoniyatlar va Modullar

### 1. 🪐 360° Realistik 3D Quyosh Tizimi (Fotorealizm)
- **NASA & SolarSystemScope 2K PBR Teksturalari**: Quyosh, Merkuriy, Venera, Yer, Mars, Yupiter, Saturn, Uran, Neptun va Sagittarius A* qora tuynugi.
- **360° Somon Yo'li Osmon Sferasi**: Radiusi 450 birlik bo'lgan panoramik fon, haqiqiy galaktika markazi va yulduzlar tumanligi.
- **2 Qatlamli Dinamik Yulduzlar**: 2400 ta uzoq mikro-yulduzlar + 650 ta astronomik spektral ranglarga ega ($O, B, A, F, G, K, M$) miltillovchi yaqin yulduzlar.
- **UnrealBloomPass Post-Processing**: Realistik kosmik yog'du va yulduzlar toji nurlanishi.
- **Cassini Bo'shlig'i bilan Saturn Halqalari**: 2048x125 radial UV xaritasi va quyosh nuri ostida sayyora yuzasiga tushuvchi real fizik soyalar.
- **Rayleigh Scattering Atmosfera Porlashi**: Har bir sayyora uchun xos Fresnel atmosfera shaderlari.

### 2. 🕳️ Sagittarius A* (Supermassiv Qora Tuynuk)
- **Relyativistik Akkretsiya Diski**: Kepler differensial aylanishi ($\Omega \propto r^{-1.35}$).
- **Doppler Beaming**: Kuzatuvchi tomon aylanayotgan plazma oqimining $2.4\times$ ortishi va ko'kish-oqqa siljishi, uzoqlashayotgan tomonining esa xiralashishi.
- **Gravitatsion Linzalanish**: Eynshteyn halqasi va hodisalar gorizonti ortidagi egrilangan yorug'lik nurlari.

### 3. 🎯 Real-Vaqt Gravitatsiya Sandboxi (Orbital Mexanika)
- Nyuton gravitatsiya qonuni: $F = G \frac{m_1 m_2}{r^2}$.
- Sichqoncha yoki sensor orqali yangi sayyoralarni tezlik vektori bilan fazoga uchirish.
- Haqiqiy orbital harakatlar, to'qnashuvlar va massalar qo'shilishi (merger).
- 4 xil oldindan tayyorlangan stsenariy: Yer-Oy orbitasi, Uch Jism Muammosi (Three-Body Problem), Quyosh Tizimi, Barqaror Halqalar.

### 4. ⏱️ Eynshteyn Nisbiylik Simulyatori (Vaqt Egrilanishi)
- **Maxsus Nisbiylik**: Lorents koeffitsiyenti ($\gamma = \frac{1}{\sqrt{1 - v^2/c^2}}$) orqali vaqt sekinlashuvi (Ekizaklar paradoksi).
- **Umumiy Nisbiylik**: Shvarsshild metriki bo'yicha kuchli gravitatsion maydonda atom soatlarining sekinlashishi: $t' = t \sqrt{1 - \frac{2GM}{rc^2}}$.
- Spacetime matosi (funnel) 60 FPS real-vaqt to'r animatsiyasi.

### 5. 🏃 Ekzosayyoralar Sakrash Kalkulyatori
- Foydalanuvchining Yerda sakrash balandligini kiritib, uni Oy, Mars, Yupiter yoki Venerada qancha balandlikka sakrashi va parvoz davomiyligini parabolik fizika asosida hisoblash.

### 6. 🏆 Kosmik Bilimlar Viktorinasi va Sertifikat
- 8 ta ilmiy savoldan iborat test sinovi.
- Test yakunida hakamlar va ishtirokchilar uchun chop etishga yaroqli rasmiy sertifikat generatsiyasi.

### 7. 🔊 Protsessual Kosmik Audio
- Web Audio API yordamida tashqi mp3 fayllarsiz toza fazoviy fon droni va interfeys tovushlari.

---

## 🛠️ Texnologiyalar Steki

- **Frontend**: React 18, Vite 6
- **3D Graphics & WebGL**: Three.js r172, @react-three/fiber, @react-three/drei
- **Post-processing**: EffectComposer, UnrealBloomPass, RenderPass, OutputPass
- **Stil va UI**: Tailwind CSS, Lucide React Icons, Framer Motion
- **Matematika & Fizika**: Runge-Kutta va Eyler integrallari, GLSL Custom Shaders

---

## 💻 Mahalliy O'rnatish va Ishga Tushirish

Loyihani o'zingizda ishga tushirish uchun quyidagi buyruqlarni ketma-ket bajaring:

```bash
# 1. Repozitoriyani klonlash
git clone https://github.com/<sizning-username>/kosmos-gravitatsiya.git

# 2. Loyiha papkasiga o'tish
cd kosmos-gravitatsiya

# 3. Kerakli paketlarni o'rnatish
npm install

# 4. Dasturni ishga tushirish
npm run dev
```

Brauzerda oching:
👉 **http://localhost:3000**

---

## 📦 Production Build

```bash
npm run build
npm run preview
```

---

## 📄 Litsenziya

MIT Litsenziyasi asosida ochiq tarqatiladi. O'quv va tanlov maqsadlarida erkin foydalanish mumkin.
