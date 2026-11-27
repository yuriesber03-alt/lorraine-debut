/* =====================================================================
   Tiny Web Audio engine. No audio files needed:
   - generated music-box lullaby (original, looping)
   - synthesized sound effects (seal crack, paper, chime, candle, blow)
   If a real song is configured it plays that instead of the lullaby.
   ===================================================================== */

export type SfxName =
  | "crack"
  | "paper"
  | "chime"
  | "candle"
  | "blow"
  | "tick"
  | "sparkle";

const BPM = 74;
const EIGHTH = 60 / BPM / 2;
const STEPS = 64; // 8 bars x 8 eighths

const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

// C  Am  F  G  C  Em  F  G
const ARP: number[][] = [
  [72, 76, 79, 84, 79, 76, 79, 76],
  [69, 72, 76, 81, 76, 72, 76, 72],
  [65, 69, 72, 77, 72, 69, 72, 69],
  [67, 71, 74, 79, 74, 71, 74, 71],
  [72, 76, 79, 84, 79, 76, 79, 76],
  [64, 67, 71, 76, 71, 67, 71, 67],
  [65, 69, 72, 77, 72, 69, 72, 69],
  [67, 71, 74, 79, 74, 71, 74, 71],
];
const BASS = [48, 45, 41, 43, 48, 40, 41, 43];
const PAD: number[][] = [
  [60, 64, 67],
  [57, 60, 64],
  [53, 57, 60],
  [55, 59, 62],
  [60, 64, 67],
  [52, 55, 59],
  [53, 57, 60],
  [55, 59, 62],
];
// [midi, eighth index inside the bar]
const MELODY: [number, number][][] = [
  [
    [84, 0],
    [79, 4],
    [81, 6],
  ],
  [
    [81, 0],
    [84, 4],
    [83, 6],
  ],
  [
    [84, 0],
    [81, 4],
    [77, 6],
  ],
  [
    [83, 0],
    [79, 4],
    [74, 6],
  ],
  [
    [84, 0],
    [88, 4],
    [86, 6],
  ],
  [
    [83, 0],
    [79, 4],
    [76, 6],
  ],
  [
    [81, 0],
    [84, 4],
    [86, 6],
  ],
  [
    [83, 0],
    [86, 4],
    [79, 6],
  ],
];

type WindowWithWebkit = Window & { webkitAudioContext?: typeof AudioContext };

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private musicBus!: GainNode;
  private sfxBus!: GainNode;
  private reverbSend!: GainNode;
  private noiseBuf!: AudioBuffer;

  private timer: number | null = null;
  private nextTime = 0;
  private step = 0;
  private running = false;
  private muted = false;

  private fileEl: HTMLAudioElement | null = null;
  private fadeTimer: number | null = null;

  /** Must be called from a user gesture the first time. */
  unlock(): boolean {
    if (typeof window === "undefined") return false;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext || (window as WindowWithWebkit).webkitAudioContext;
      if (!Ctor) return false;
      const ctx = new Ctor();
      this.ctx = ctx;

      this.master = ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.9;
      this.master.connect(ctx.destination);

      this.musicBus = ctx.createGain();
      this.musicBus.gain.value = 0;
      this.musicBus.connect(this.master);

      this.sfxBus = ctx.createGain();
      this.sfxBus.gain.value = 0.9;
      this.sfxBus.connect(this.master);

      const reverb = ctx.createConvolver();
      reverb.buffer = this.makeImpulse(ctx, 3.2, 3);
      const wet = ctx.createGain();
      wet.gain.value = 0.55;
      reverb.connect(wet);
      wet.connect(this.master);
      this.reverbSend = ctx.createGain();
      this.reverbSend.gain.value = 1;
      this.reverbSend.connect(reverb);

      const len = ctx.sampleRate;
      this.noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return true;
  }

  get isRunning() {
    return this.running;
  }

  startMusic(src?: string) {
    if (!this.ctx || this.running) return;
    this.running = true;

    if (src) {
      const el = new Audio(src);
      el.loop = true;
      el.volume = 0;
      el.muted = this.muted;
      this.fileEl = el;
      el.addEventListener("error", () =>
        console.error("[audio] failed to load", src, el.error),
      );
      void el
        .play()
        .catch((err) => console.error("[audio] play() rejected", src, err));
      this.fadeFile(0.6, 3000);
      return;
    }

    const ctx = this.ctx;
    this.musicBus.gain.cancelScheduledValues(ctx.currentTime);
    this.musicBus.gain.setValueAtTime(0, ctx.currentTime);
    this.musicBus.gain.linearRampToValueAtTime(0.75, ctx.currentTime + 3.5);
    this.nextTime = ctx.currentTime + 0.12;
    this.step = 0;
    this.pump();
    this.timer = window.setInterval(() => this.pump(), 120);
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.ctx) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setTargetAtTime(m ? 0 : 0.9, t, 0.05);
    }
    if (this.fileEl) this.fileEl.muted = m;
  }

  suspend() {
    if (this.ctx && this.ctx.state === "running") void this.ctx.suspend();
    this.fileEl?.pause();
  }

  resume() {
    if (this.ctx && this.ctx.state === "suspended") void this.ctx.resume();
    if (this.fileEl && this.running) void this.fileEl.play().catch(() => {});
  }

  /* ---------------- music scheduler ---------------- */

  private pump() {
    const ctx = this.ctx;
    if (!ctx) return;
    while (this.nextTime < ctx.currentTime + 0.5) {
      this.scheduleStep(this.step, this.nextTime);
      this.nextTime += EIGHTH;
      this.step = (this.step + 1) % STEPS;
    }
  }

  private scheduleStep(step: number, t: number) {
    const bar = Math.floor(step / 8);
    const i = step % 8;
    this.bell(mtof(ARP[bar][i]), t, 1.7, 0.1);
    for (const [m, at] of MELODY[bar])
      if (at === i) this.bell(mtof(m), t, 2.6, 0.2);
    if (i === 0 || i === 4) this.soft(mtof(BASS[bar]), t, EIGHTH * 4, 0.22);
    if (i === 0)
      for (const m of PAD[bar]) this.pad(mtof(m), t, EIGHTH * 8, 0.03);
  }

  private bell(freq: number, t: number, dur: number, vel: number) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const o1 = ctx.createOscillator();
    o1.type = "sine";
    o1.frequency.value = freq;
    const o2 = ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.value = freq * 4.01;
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.16, t);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.25);
    o1.connect(g);
    o2.connect(g2);
    g2.connect(g);
    g.connect(this.musicBus);
    g.connect(this.reverbSend);
    o1.start(t);
    o2.start(t);
    o1.stop(t + dur + 0.1);
    o2.stop(t + dur + 0.1);
  }

  private soft(freq: number, t: number, dur: number, vel: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(this.musicBus);
    o.start(t);
    o.stop(t + dur + 0.1);
  }

  private pad(freq: number, t: number, dur: number, vel: number) {
    const ctx = this.ctx!;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 850;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.9);
    g.gain.setValueAtTime(vel, t + dur - 0.2);
    g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.8);
    f.connect(g);
    g.connect(this.musicBus);
    g.connect(this.reverbSend);
    for (const detune of [-6, 6]) {
      const o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.value = freq;
      o.detune.value = detune;
      o.connect(f);
      o.start(t);
      o.stop(t + dur + 1);
    }
  }

  private fadeFile(target: number, ms: number) {
    const el = this.fileEl;
    if (!el) return;
    if (this.fadeTimer) window.clearInterval(this.fadeTimer);
    const from = el.volume;
    const t0 = performance.now();
    this.fadeTimer = window.setInterval(() => {
      const p = Math.min(1, (performance.now() - t0) / ms);
      el.volume = from + (target - from) * p;
      if (p >= 1 && this.fadeTimer) window.clearInterval(this.fadeTimer);
    }, 50);
  }

  /* ---------------- sound effects ---------------- */

  sfx(name: SfxName) {
    const ctx = this.ctx;
    if (!ctx || this.muted) return;
    const t = ctx.currentTime;
    switch (name) {
      case "crack":
        this.noise(t, 0.14, "highpass", 2400, 900, 0.5);
        this.thump(t);
        break;
      case "paper":
        this.noise(t, 0.9, "bandpass", 900, 3200, 0.22);
        break;
      case "chime":
        [84, 88, 91, 96].forEach((m, i) =>
          this.ping(mtof(m), t + i * 0.09, 1.8, 0.16),
        );
        break;
      case "sparkle": {
        const pent = [88, 91, 93, 96, 100];
        for (let i = 0; i < 5; i++)
          this.ping(
            mtof(pent[Math.floor(Math.random() * pent.length)]),
            t + i * 0.07,
            0.9,
            0.07,
          );
        break;
      }
      case "candle":
        this.noise(t, 0.09, "highpass", 3000, 6000, 0.2);
        this.ping(1500 + Math.random() * 700, t, 0.25, 0.05);
        break;
      case "blow":
        this.noise(t, 1.0, "lowpass", 900, 250, 0.5);
        break;
      case "tick":
        this.ping(2600, t, 0.06, 0.05);
        break;
    }
  }

  private noise(
    t: number,
    dur: number,
    type: BiquadFilterType,
    f0: number,
    f1: number,
    vol: number,
  ) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(f0, t);
    f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.2);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(this.sfxBus);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  private thump(t: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.18);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.6, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    o.connect(g);
    g.connect(this.sfxBus);
    o.start(t);
    o.stop(t + 0.25);
  }

  private ping(freq: number, t: number, dur: number, vol: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(this.sfxBus);
    g.connect(this.reverbSend);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private makeImpulse(ctx: AudioContext, seconds: number, decay: number) {
    const rate = ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++)
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }
}
