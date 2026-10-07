/**
 * Web Audio API based ambient cosmic sound engine
 * Completely procedural, requires zero external mp3 downloads.
 */

class CosmicAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.masterGain = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.filter = null;
    this.warpOsc = null;
    this.warpGain = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    this.ctx = new AudioContext();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Cosmic Sub Drone (55Hz and 110Hz deep space hum)
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(180, this.ctx.currentTime);
    this.filter.connect(this.masterGain);

    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sawtooth';
    this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A

    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'sine';
    this.droneOsc2.frequency.setValueAtTime(55.4, this.ctx.currentTime); // Slight detune for binaural beat

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    this.droneOsc1.connect(droneGain);
    this.droneOsc2.connect(droneGain);
    droneGain.connect(this.filter);

    this.droneOsc1.start();
    this.droneOsc2.start();

    // Warp speed whoosh generator
    this.warpOsc = this.ctx.createOscillator();
    this.warpOsc.type = 'sine';
    this.warpOsc.frequency.setValueAtTime(120, this.ctx.currentTime);

    this.warpGain = this.ctx.createGain();
    this.warpGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

    this.warpOsc.connect(this.warpGain);
    this.warpGain.connect(this.masterGain);
    this.warpOsc.start();
  }

  toggle() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0.00001 : 0.35;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(target, this.ctx.currentTime + 1.2);
    }
    return !this.isMuted;
  }

  setWarpSpeed(velocity) {
    if (!this.ctx || this.isMuted || !this.warpGain) return;
    const vol = Math.min(0.2, velocity * 0.08);
    const freq = 80 + velocity * 120;
    this.warpGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.2);
    this.warpOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.2);
  }

  playBeep(frequency = 880, duration = 0.08) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  }

  playClick() {
    this.playBeep(1200, 0.04);
  }

  playSuccess() {
    if (!this.ctx || this.isMuted) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C chord
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playBeep(freq, 0.25);
        }, idx * 90);
      });
    } catch {
      // Audio fallback
    }
  }

  playJump() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch {
      // Audio fallback
    }
  }

  playLand() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {
      // Audio fallback
    }
  }

  playWarning() {
    if (!this.ctx || this.isMuted) return;
    try {
      this.playBeep(440, 0.15);
      setTimeout(() => this.playBeep(330, 0.15), 180);
    } catch {
      // Audio fallback
    }
  }
}

export const soundEngine = new CosmicAudioEngine();
