let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.3): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gainNode.gain.setValueAtTime(gain, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // ignore audio errors
  }
}

export function playRollSound(): void {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      playTone(200 + Math.random() * 300, 0.05, 'sawtooth', 0.15);
    }, i * 40);
  }
}

export function playHoldSound(): void {
  playTone(600, 0.1, 'sine', 0.2);
}

export function playScoreSound(): void {
  [261, 329, 392, 523].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, 'sine', 0.25), i * 80);
  });
}

export function playYahtzeeSound(): void {
  [523, 659, 784, 1047].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, 'sine', 0.4), i * 150);
  });
}

export function playWinSound(): void {
  [261, 330, 392, 523, 659, 784].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.4, 'sine', 0.35), i * 120);
  });
}

export function playLoseSound(): void {
  [400, 350, 300, 250].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.4, 'sawtooth', 0.2), i * 150);
  });
}

export function playClickSound(): void {
  playTone(800, 0.05, 'sine', 0.1);
}
