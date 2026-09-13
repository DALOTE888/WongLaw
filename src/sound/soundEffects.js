// Web Audio API Synthesizer for 100% offline, zero-asset party sound effects

let audioCtx = null;
let isSoundMuted = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundMuted(muted) {
  isSoundMuted = muted;
}

export function getSoundMuted() {
  return isSoundMuted;
}

// 1. Glass Clinking Sound (ชนแก้ว)
export function playClink() {
  if (isSoundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Dual high frequency bell-like resonance
  [2600, 3920, 5200].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq + (i * 20), now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 0.8);

    gain.gain.setValueAtTime(0.3 / (i + 1), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.04);
    osc.stop(now + 0.85);
  });
}

// 2. Party Siren / วงเหล้า Alert Sound
export function playSiren() {
  if (isSoundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  // Modulate frequency up and down like party siren
  osc.frequency.setValueAtTime(450, now);
  osc.frequency.linearRampToValueAtTime(900, now + 0.35);
  osc.frequency.linearRampToValueAtTime(450, now + 0.7);
  osc.frequency.linearRampToValueAtTime(900, now + 1.05);
  osc.frequency.linearRampToValueAtTime(450, now + 1.4);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 1.5);
}

// 3. Countdown Tick (Metronome)
export function playTick(isUrgent = false) {
  if (isSoundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = isUrgent ? 'sawtooth' : 'triangle';
  osc.frequency.setValueAtTime(isUrgent ? 880 : 440, now);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.09);
}

// 4. Buzzer / Fail Sound (หมดเวลา / โดนทำโทษ)
export function playBuzzer() {
  if (isSoundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.linearRampToValueAtTime(90, now + 0.5);

  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.6);
}

// 5. Card Flip / Click Sound
export function playCardFlip() {
  if (isSoundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.11);
}

// 6. Win / Fanfare Sound
export function playFanfare() {
  if (isSoundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const now = ctx.currentTime + (idx * 0.1);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  });
}
