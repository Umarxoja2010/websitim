import * as THREE from 'three';

// Fast noise / pseudorandom helpers
function simpleNoise(x, y, seed = 42) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

function fbm(x, y, octaves = 4, seed = 42) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * simpleNoise(x * frequency, y * frequency, seed + i * 17);
    frequency *= 2;
    amplitude *= 0.5;
  }
  return value;
}

/**
 * Procedural Earth Texture
 */
export function createEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const w = canvas.width;
  const h = canvas.height;

  // Ocean base gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
  oceanGrad.addColorStop(0, '#10395c');
  oceanGrad.addColorStop(0.5, '#0c2340');
  oceanGrad.addColorStop(1, '#0e2f4f');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, w, h);

  // Draw landmasses
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  for (let y = 0; y < h; y++) {
    const ny = y / h;
    for (let x = 0; x < w; x++) {
      const nx = x / w;
      const idx = (y * w + x) * 4;

      // Latitude effect for polar ice
      const latDist = Math.abs(ny - 0.5) * 2;
      const continentNoise = fbm(nx * 5, ny * 5, 4, 101);

      // Polar caps
      if (latDist > 0.82 + (Math.sin(nx * 30) * 0.04)) {
        data[idx] = 230;     // R
        data[idx + 1] = 245; // G
        data[idx + 2] = 255; // B
        continue;
      }

      // Continents threshold
      if (continentNoise > 0.48) {
        const elevation = (continentNoise - 0.48) * 2;
        if (elevation > 0.6) {
          // Mountains / desert
          data[idx] = 160 + elevation * 40;
          data[idx + 1] = 140 + elevation * 30;
          data[idx + 2] = 100;
        } else {
          // Lush land
          data[idx] = 34 + elevation * 50;
          data[idx + 1] = 110 + elevation * 60;
          data[idx + 2] = 50 + elevation * 20;
        }
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Soft atmospheric cloud streaks
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  for (let i = 0; i < 24; i++) {
    ctx.beginPath();
    const cy = (h * 0.15) + (h * 0.7) * (i / 24);
    const cx = (i * 97) % w;
    ctx.ellipse(cx, cy, 120 + (i % 5) * 40, 20 + (i % 3) * 15, (i * 0.2), 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Procedural Earth Clouds Texture
 */
export function createCloudsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, w, h);

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  for (let y = 0; y < h; y++) {
    const ny = y / h;
    for (let x = 0; x < w; x++) {
      const nx = x / w;
      const idx = (y * w + x) * 4;

      const cloudN = fbm(nx * 8 + 0.3, ny * 6, 4, 303);
      if (cloudN > 0.44) {
        const density = Math.min(255, Math.floor((cloudN - 0.44) * 450));
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = density;
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Procedural Mars Texture
 */
export function createMarsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;

  for (let y = 0; y < h; y++) {
    const ny = y / h;
    const latDist = Math.abs(ny - 0.5) * 2;

    for (let x = 0; x < w; x++) {
      const nx = x / w;
      const idx = (y * w + x) * 4;

      // Polar ice caps on Mars
      if (latDist > 0.88 + (Math.sin(nx * 20) * 0.03)) {
        data[idx] = 240;
        data[idx + 1] = 230;
        data[idx + 2] = 235;
        data[idx + 3] = 255;
        continue;
      }

      const mNoise = fbm(nx * 7, ny * 7, 4, 555);
      const craterNoise = fbm(nx * 20, ny * 20, 3, 777);

      // Rusty reddish tones
      const r = Math.floor(160 + mNoise * 75 - craterNoise * 20);
      const g = Math.floor(55 + mNoise * 45 - craterNoise * 15);
      const b = Math.floor(25 + mNoise * 25);

      data[idx] = Math.min(255, Math.max(0, r));
      data[idx + 1] = Math.min(255, Math.max(0, g));
      data[idx + 2] = Math.min(255, Math.max(0, b));
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Canyon cuts (Valles Marineris)
  ctx.strokeStyle = 'rgba(70, 20, 10, 0.6)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(w * 0.35, h * 0.52);
  ctx.bezierCurveTo(w * 0.45, h * 0.55, w * 0.55, h * 0.48, w * 0.7, h * 0.53);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Procedural Jupiter Texture
 */
export function createJupiterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;

  // Jupiter color palette bands
  const colors = [
    { r: 230, g: 220, b: 195 }, // White zone
    { r: 180, g: 115, b: 65 },  // Brown belt
    { r: 245, g: 235, b: 215 }, // Light zone
    { r: 195, g: 130, b: 70 },  // Dark belt
    { r: 215, g: 175, b: 120 }, // Orange belt
    { r: 240, g: 225, b: 200 }, // Equatorial zone
    { r: 170, g: 100, b: 50 },  // Southern belt
    { r: 220, g: 205, b: 180 }, // Tropical zone
    { r: 160, g: 90, b: 50 },   // Polar region
  ];

  for (let y = 0; y < h; y++) {
    const ny = y / h;
    for (let x = 0; x < w; x++) {
      const nx = x / w;
      const idx = (y * w + x) * 4;

      // Bands with wavy turbulence
      const wave = Math.sin(nx * 12 + ny * 20) * 0.02 + Math.cos(nx * 24) * 0.01;
      const bandIndex = Math.floor(((ny + wave) * colors.length * 1.5)) % colors.length;
      const baseCol = colors[Math.abs(bandIndex)];

      const turbulence = fbm(nx * 15, ny * 15, 3, 999);
      const r = Math.floor(baseCol.r * (0.85 + turbulence * 0.3));
      const g = Math.floor(baseCol.g * (0.85 + turbulence * 0.3));
      const b = Math.floor(baseCol.b * (0.85 + turbulence * 0.3));

      data[idx] = Math.min(255, Math.max(0, r));
      data[idx + 1] = Math.min(255, Math.max(0, g));
      data[idx + 2] = Math.min(255, Math.max(0, b));
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // The Great Red Spot (Katta Qizil Dog')
  const grsX = w * 0.62;
  const grsY = h * 0.65;
  const grsRadiusX = 55;
  const grsRadiusY = 32;

  const grsGrad = ctx.createRadialGradient(grsX, grsY, 5, grsX, grsY, grsRadiusX);
  grsGrad.addColorStop(0, '#c23b22');
  grsGrad.addColorStop(0.5, '#d35400');
  grsGrad.addColorStop(0.8, '#e67e22');
  grsGrad.addColorStop(1, 'rgba(230, 126, 34, 0)');

  ctx.fillStyle = grsGrad;
  ctx.beginPath();
  ctx.ellipse(grsX, grsY, grsRadiusX, grsRadiusY, -0.15, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Procedural Black Hole Accretion Disk Texture
 */
export function createAccretionDiskTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const center = 256;

  // Clear
  ctx.clearRect(0, 0, 512, 512);

  const grad = ctx.createRadialGradient(center, center, 40, center, center, 250);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(0.18, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(0.24, 'rgba(255, 255, 255, 1)'); // Blazing photon sphere
  grad.addColorStop(0.32, 'rgba(0, 240, 255, 0.95)'); // Cyan relativistic edge
  grad.addColorStop(0.48, 'rgba(168, 85, 247, 0.85)'); // Hot purple
  grad.addColorStop(0.7, 'rgba(239, 68, 68, 0.6)');   // Outer redshifted orange
  grad.addColorStop(0.95, 'rgba(147, 51, 234, 0.15)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Add spiral Doppler streaks
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2;
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + Math.sin(angle) * 0.08})`;
    ctx.lineWidth = 2 + (i % 3);
    ctx.beginPath();
    ctx.arc(center, center, 80 + i * 4, angle, angle + 1.2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
