// Web Audio API based Industrial Emergency Siren Synthesizer
class SoundAlertManager {
  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private intervalId: any = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isPlaying) {
      this.stopSiren();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Dual-tone sweeping industrial emergency evacuation siren
  public playSiren(durationSeconds: number = 8) {
    if (this.isMuted) return;

    try {
      this.initContext();
      if (!this.audioCtx) return;

      if (this.isPlaying) {
        this.stopSiren();
      }

      this.isPlaying = true;
      const ctx = this.audioCtx;

      // Master gain node
      this.gainNode = ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      this.gainNode.connect(ctx.destination);

      // Oscillator
      this.oscillator = ctx.createOscillator();
      this.oscillator.type = 'sawtooth';
      this.oscillator.frequency.setValueAtTime(650, ctx.currentTime);
      this.oscillator.connect(this.gainNode);
      this.oscillator.start();

      let rising = true;
      let currentFreq = 650;

      // Sweeping frequency modulation
      this.intervalId = setInterval(() => {
        if (!this.oscillator || !this.isPlaying) return;

        if (rising) {
          currentFreq += 45;
          if (currentFreq >= 980) rising = false;
        } else {
          currentFreq -= 45;
          if (currentFreq <= 620) rising = true;
        }

        try {
          this.oscillator.frequency.setValueAtTime(currentFreq, ctx.currentTime);
        } catch (e) {
          // ignore
        }
      }, 40);

      // Auto stop after duration
      if (durationSeconds > 0) {
        setTimeout(() => {
          this.stopSiren();
        }, durationSeconds * 1000);
      }
    } catch (err) {
      console.warn('Audio siren playback error:', err);
    }
  }

  // Short warning beep
  public playWarningBeep() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn('Warning beep error:', e);
    }
  }

  // Success tone
  public playSuccessTone() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.24); // G5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(now + 0.45);
    } catch (e) {
      console.warn('Success tone error:', e);
    }
  }

  public stopSiren() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch (e) {}
      this.oscillator = null;
    }
    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch (e) {}
      this.gainNode = null;
    }
  }
}

export const soundAlert = new SoundAlertManager();
