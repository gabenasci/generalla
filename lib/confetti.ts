import confetti from 'canvas-confetti';

// Valhalla-themed colors: gold, orange, crimson, amber
const VICTORY_COLORS = ['#FFD700', '#FFA500', '#FF4500', '#DC143C', '#B8860B'];

let intervalId: ReturnType<typeof setInterval> | null = null;
let burstIndex = 0;

// Burst positions: center, left, right - cycles through
const BURST_CONFIGS = [
  { origin: { x: 0.5, y: 0.35 }, angle: 90, spread: 70 },
  { origin: { x: 0.1, y: 0.6 }, angle: 60, spread: 55 },
  { origin: { x: 0.9, y: 0.6 }, angle: 120, spread: 55 },
];

/**
 * Fires a single confetti burst from one position
 */
function fireSingleBurst(isTie: boolean) {
  const config = BURST_CONFIGS[burstIndex % BURST_CONFIGS.length];
  burstIndex++;

  confetti({
    particleCount: isTie ? 45 : 30,
    spread: config.spread,
    angle: config.angle,
    origin: config.origin,
    colors: VICTORY_COLORS,
    startVelocity: 40,
    gravity: 1.8,
    scalar: 1,
    ticks: 70,
    decay: 0.9,
  });
}

/**
 * Starts repeating confetti bursts - one at a time, cycling positions
 */
export function startVictoryConfetti(isTie: boolean = false) {
  stopVictoryConfetti();
  burstIndex = 0;

  // Fire immediately
  fireSingleBurst(isTie);

  // Repeat every 1.5 seconds - one burst at a time
  intervalId = setInterval(() => {
    fireSingleBurst(isTie);
  }, 1500);
}

/**
 * Stops the confetti and clears particles
 */
export function stopVictoryConfetti() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  confetti.reset();
}
