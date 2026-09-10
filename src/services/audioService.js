/**
 * Audio Feedback Service.
 * Uses Web Audio API to synthesize instant auditory feedback for learner responses:
 * - Correct: Upbeat, pleasant two-tone confirmation chime.
 * - Incorrect: Low-pitched, dissonant, descending error buzz (clearly signaling a mistake, never an achievement sound).
 */

let audioCtx = null;

function getAudioContext() {
    if (typeof window === "undefined") return null;
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
}

/**
 * Plays an affirmative, pleasant two-tone confirmation chime.
 */
export function playCorrectSound() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;

        // Note 1: C5 (523.25 Hz)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(523.25, now);

        gain1.gain.setValueAtTime(0.18, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);

        osc1.start(now);
        osc1.stop(now + 0.12);

        // Note 2: E5 (659.25 Hz) - Ascending harmony
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(659.25, now + 0.1);

        gain2.gain.setValueAtTime(0.22, now + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc2.start(now + 0.1);
        osc2.stop(now + 0.35);
    } catch {
        // Silently ignore browser audio restrictions
    }
}

/**
 * Plays a low, dissonant, descending error buzzer.
 * Strictly sounds like a mistake / error, NOT an achievement fanfare.
 */
export function playIncorrectSound() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;

        // Primary buzzer: Sawtooth wave descending from 160Hz to 110Hz
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(160, now);
        osc1.frequency.linearRampToValueAtTime(110, now + 0.28);

        gain1.gain.setValueAtTime(0.25, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);

        osc1.start(now);
        osc1.stop(now + 0.3);

        // Secondary dissonant tone: Square wave at 120Hz descending to 85Hz
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "square";
        osc2.frequency.setValueAtTime(124, now);
        osc2.frequency.linearRampToValueAtTime(88, now + 0.28);

        gain2.gain.setValueAtTime(0.18, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc2.start(now);
        osc2.stop(now + 0.28);
    } catch {
        // Silently ignore browser audio restrictions
    }
}
