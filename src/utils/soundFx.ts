// Web Audio API Sound Effects Engine for MonsoonPulse
// Synthesizes high-fidelity meteorological, UI, and advisory audio cues with zero external asset dependencies

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private activeListeners: Set<(isPlaying: boolean, soundType?: string) => void> = new Set();
  private notifyTimeout: NodeJS.Timeout | null = null;

  constructor() {
    try {
      const savedMute = localStorage.getItem('monsoonpulse_sound_muted');
      this.muted = savedMute === 'true';
    } catch {
      this.muted = false;
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    try {
      localStorage.setItem('monsoonpulse_sound_muted', this.muted ? 'true' : 'false');
    } catch {}
    if (!this.muted) {
      this.playChime();
    }
    return this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    try {
      localStorage.setItem('monsoonpulse_sound_muted', muted ? 'true' : 'false');
    } catch {}
  }

  public subscribe(callback: (isPlaying: boolean, soundType?: string) => void): () => void {
    this.activeListeners.add(callback);
    return () => this.activeListeners.delete(callback);
  }

  private notifyPlaying(soundType: string, durationMs: number = 400) {
    this.activeListeners.forEach(cb => cb(true, soundType));
    if (this.notifyTimeout) clearTimeout(this.notifyTimeout);
    this.notifyTimeout = setTimeout(() => {
      this.activeListeners.forEach(cb => cb(false));
    }, durationMs);
  }

  /**
   * Welcome Chime: Elegant ascending harmonic arpeggio (C5 - E5 - G5 - C6)
   */
  public playWelcome() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.notifyPlaying('welcome', 1200);
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const startTime = ctx.currentTime + 0.05;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.12);

      gain.gain.setValueAtTime(0, startTime + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, startTime + idx * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.12 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + idx * 0.12);
      osc.stop(startTime + idx * 0.12 + 0.65);
    });
  }

  /**
   * Radar Sonar Ping: Meteorological Doppler pulse with frequency sweep & bandpass resonance
   */
  public playRadarPing() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.notifyPlaying('radar', 600);
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1150, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.35);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, now);
    filter.Q.setValueAtTime(4, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  /**
   * Warning Alert: Pulsing double-tone hazard beep (False Onset Alarm / Severe Break)
   */
  public playWarningAlarm() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.notifyPlaying('alarm', 700);
    const now = ctx.currentTime;

    [0, 0.22].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(880, now + offset);
      osc.frequency.linearRampToValueAtTime(660, now + offset + 0.14);

      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.20, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.18);
    });
  }

  /**
   * Tactile Click: Subtle 12ms mechanical tap for UI buttons & filters
   */
  public playClick() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.025);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  /**
   * Tab Navigation Whoosh / Bubble Pop
   */
  public playTabSwitch() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.notifyPlaying('tab', 200);
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.08);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  /**
   * Success Chime: Favorable Sowing / Confirmed Prediction (F4, A4, C5, F5)
   */
  public playSuccess() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.notifyPlaying('success', 600);
    const now = ctx.currentTime;
    const freqs = [349.23, 440.00, 523.25, 698.46];

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.5);
    });
  }

  /**
   * Rain / Moisture Drops effect: Soft high-pitched droplets
   */
  public playRainDrops() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.notifyPlaying('rain', 500);
    const now = ctx.currentTime;
    const drops = [1200, 1500, 1100, 1750];

    drops.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const dropTime = now + idx * 0.07 + Math.random() * 0.02;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, dropTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, dropTime + 0.035);

      gain.gain.setValueAtTime(0, dropTime);
      gain.gain.linearRampToValueAtTime(0.10, dropTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, dropTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(dropTime);
      osc.stop(dropTime + 0.06);
    });
  }

  /**
   * General soft chime for generic triggers
   */
  public playChime() {
    this.playWelcome();
  }
}

export const soundFx = new SoundEffectsEngine();
