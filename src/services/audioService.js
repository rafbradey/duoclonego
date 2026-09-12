import audioMapping from "../data/audioMapping.json" with { type: "json" };

/**
 * Audio Feedback & Medication Pronunciation Service.
 *
 * 1. Web Audio API for gamified learner response feedback:
 *    - Correct: Upbeat, pleasant two-tone confirmation chime.
 *    - Incorrect: Low-pitched, dissonant descending error buzzer.
 *
 * 2. Static Pre-generated Audio for Medication Pronunciations:
 *    - All 50 canonical LASA pairs (100 medications) pre-generated via Azure AI Speech
 *      (Raw Mode, en-US-JennyNeural) into public/audio/lasa/.
 *    - Zero runtime Azure API calls, zero credential exposure in client builds.
 *    - Uses standard HTML5 Audio with speed control and fallback to Web Speech API.
 */

let audioCtx = null;
let activeAudioInstance = null;

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

/**
 * Resolves the relative path into an absolute URL respecting Vite's BASE_URL.
 */
function resolveAssetPath(relPath) {
    if (!relPath) return null;
    const base = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) || "/";
    const cleanBase = base.endsWith("/") ? base : `${base}/`;
    const cleanRel = relPath.startsWith("/") ? relPath.slice(1) : relPath;
    return `${cleanBase}${cleanRel}`;
}

/**
 * Resolves a medication identifier (canonical ID, generic name, or Tall Man form)
 * to its pre-generated static audio URL.
 *
 * @param {string|Object} identifier - Medication key (e.g., "lasa_001_a", "bupropion", "buPROPion")
 * @returns {string|null} Resolved audio asset URL or null
 */
export function getMedicationAudioUrl(identifier) {
    if (!identifier) return null;

    let key = "";
    if (typeof identifier === "string") {
        key = identifier.trim();
    } else if (typeof identifier === "object") {
        key = identifier.id || identifier.genericName || identifier.tallManName || identifier.drugName || identifier.name || "";
        key = String(key).trim();
    }
    if (!key) return null;

    // 1. Direct key match (canonical ID or exact casing)
    if (audioMapping[key]) {
        return resolveAssetPath(audioMapping[key]);
    }

    // 2. Lowercase match
    const lowerKey = key.toLowerCase();
    if (audioMapping[lowerKey]) {
        return resolveAssetPath(audioMapping[lowerKey]);
    }

    // 3. Normalized alphanumeric match
    const normKey = lowerKey.replace(/[^a-z0-9_-]/g, "");
    if (audioMapping[normKey]) {
        return resolveAssetPath(audioMapping[normKey]);
    }

    // 4. Case-insensitive key scan
    const mappingKeys = Object.keys(audioMapping);
    const matchedKey = mappingKeys.find((k) => k.toLowerCase() === lowerKey);
    if (matchedKey && audioMapping[matchedKey]) {
        return resolveAssetPath(audioMapping[matchedKey]);
    }

    return null;
}

/**
 * Checks if a pre-generated static audio asset exists for the given medication identifier.
 * @param {string|Object} identifier
 * @returns {boolean}
 */
export function hasMedicationAudio(identifier) {
    return Boolean(getMedicationAudioUrl(identifier));
}

/**
 * Halts any active medication static audio playback.
 */
export function stopMedicationAudio() {
    if (activeAudioInstance) {
        try {
            activeAudioInstance.pause();
            activeAudioInstance.currentTime = 0;
            activeAudioInstance.src = "";
        } catch {
            // Ignore audio pause error
        }
        activeAudioInstance = null;
    }
}

/**
 * Plays the pre-generated Azure Neural static audio for a medication.
 * Falls back to Web Speech API if the static audio asset is unmapped.
 *
 * @param {string|Object} identifier - Medication identifier or name
 * @param {Object} [options]
 * @param {number} [options.rate=1.0] - Playback rate (0.7x for slow, 1.0x for normal)
 * @param {Function} [options.onStart] - Callback when playback begins
 * @param {Function} [options.onEnd] - Callback when playback ends
 * @param {Function} [options.onError] - Callback on playback failure
 * @returns {HTMLAudioElement|SpeechSynthesisUtterance|null}
 */
export function playMedicationAudio(identifier, { rate = 1.0, fallback = true, onStart, onEnd, onError } = {}) {
    if (!identifier) return null;

    // Ensure all prior audio is silenced
    stopSpeech();

    const audioUrl = getMedicationAudioUrl(identifier);
    if (!audioUrl) {
        // Fallback: Web Speech API only if fallback is enabled
        if (fallback && typeof identifier === "string" && isSpeechSupported()) {
            return speakDrugName(identifier, { rate, onStart, onEnd, onError });
        }
        const error = new Error(`No archived static audio found for medication identifier: ${typeof identifier === "object" ? JSON.stringify(identifier) : identifier}`);
        console.warn("[audioService]", error.message);
        if (typeof onError === "function") {
            onError(error);
        }
        return null;
    }

    if (typeof window === "undefined") return null;

    try {
        const audio = new Audio(audioUrl);
        audio.playbackRate = rate;
        activeAudioInstance = audio;

        audio.addEventListener("play", () => {
            if (typeof onStart === "function") onStart();
        });

        audio.addEventListener("ended", () => {
            if (activeAudioInstance === audio) {
                activeAudioInstance = null;
            }
            if (typeof onEnd === "function") onEnd();
        });

        audio.addEventListener("error", (e) => {
            if (activeAudioInstance === audio) {
                activeAudioInstance = null;
            }
            if (typeof onError === "function") onError(e);
        });

        audio.play().catch((err) => {
            if (activeAudioInstance === audio) {
                activeAudioInstance = null;
            }
            if (typeof onError === "function") onError(err);
        });

        return audio;
    } catch (err) {
        if (typeof onError === "function") onError(err);
        return null;
    }
}

/**
 * Checks whether Web Speech API (speechSynthesis) is supported in the current environment.
 * @returns {boolean}
 */
export function isSpeechSupported() {
    return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * Halts any active speech synthesis and static medication audio playback.
 */
export function stopSpeech() {
    stopMedicationAudio();
    if (isSpeechSupported()) {
        try {
            window.speechSynthesis.cancel();
        } catch {
            // Ignore speech synthesis cancellation errors
        }
    }
}

/**
 * Speaks a medication name aloud using the browser Web Speech API.
 * Retained for backward compatibility and test benchmarking.
 *
 * @param {string} text - Medication name to speak
 * @param {Object} [options]
 * @param {number} [options.rate=0.85] - Speech rate
 * @param {number} [options.pitch=1.0] - Speech pitch
 * @param {Function} [options.onStart] - Callback when speech begins
 * @param {Function} [options.onEnd] - Callback when speech completes
 * @param {Function} [options.onError] - Callback on error
 * @returns {SpeechSynthesisUtterance|null}
 */
export function speakDrugName(text, { rate = 0.85, pitch = 1.0, onStart, onEnd, onError } = {}) {
    if (!isSpeechSupported() || !text) return null;

    try {
        stopSpeech();

        const cleanText = String(text).trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.lang = "en-US";

        const voices = typeof window.speechSynthesis.getVoices === "function"
            ? window.speechSynthesis.getVoices()
            : [];

        if (voices.length > 0) {
            const englishVoice = voices.find((v) => v.lang && v.lang.startsWith("en") && !v.name.toLowerCase().includes("whisper")) ||
                                 voices.find((v) => v.lang && v.lang.startsWith("en")) ||
                                 voices[0];
            if (englishVoice) {
                utterance.voice = englishVoice;
            }
        }

        if (typeof onStart === "function") utterance.onstart = onStart;
        if (typeof onEnd === "function") utterance.onend = onEnd;
        if (typeof onError === "function") utterance.onerror = onError;

        window.speechSynthesis.speak(utterance);
        return utterance;
    } catch (err) {
        if (typeof onError === "function") onError(err);
        return null;
    }
}
