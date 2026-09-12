import { useState, useEffect, useCallback } from "react";
import { Volume2 } from "lucide-react";
import {
    playMedicationAudio,
    stopSpeech,
    hasMedicationAudio
} from "../../services/audioService.js";
import "./AudioPronounceButton.css";

/**
 * Reusable Universal Medication Pronunciation Button.
 *
 * Uses ONLY the archived static Azure Raw medication pronunciation audio.
 * Never calls Azure at runtime, never falls back to browser SpeechSynthesis,
 * and never leaks Tall Man capitalization in accessibility attributes.
 *
 * If no static audio asset exists for the resolved medication, this component
 * safely renders nothing (null).
 *
 * @param {Object} props
 * @param {string|Object} props.drug - Medication identifier, name, or question object
 * @param {string} [props.canonicalId] - Explicit canonical drug ID (e.g. "lasa_001_a")
 * @param {string} [props.className=""] - Additional CSS class names
 * @param {number} [props.size=18] - Lucide icon size in pixels
 * @param {boolean} [props.disabled=false] - Whether playback interaction is disabled
 */
function AudioPronounceButton({
    drug,
    canonicalId,
    className = "",
    size = 18,
    disabled = false
}) {
    const [isPlaying, setIsPlaying] = useState(false);

    // Resolve target key: canonicalId > canonicalDrugId > string / object fields
    let targetKey = canonicalId || "";
    if (!targetKey && drug) {
        if (typeof drug === "string") {
            targetKey = drug.trim();
        } else if (typeof drug === "object") {
            targetKey =
                drug.canonicalDrugId ||
                drug.drugToPronounce ||
                drug.standardName ||
                drug.relatedDrug ||
                drug.tallManName ||
                drug.drugName ||
                drug.name ||
                "";
        }
    }

    const audioAvailable = Boolean(targetKey && hasMedicationAudio(targetKey));

    const handlePronounce = useCallback(
        (e) => {
            if (e) e.stopPropagation();
            if (disabled || isPlaying || !targetKey || !audioAvailable) return;

            setIsPlaying(true);
            playMedicationAudio(targetKey, {
                fallback: false, // Strictly require archived static audio
                onStart: () => setIsPlaying(true),
                onEnd: () => setIsPlaying(false),
                onError: (err) => {
                    setIsPlaying(false);
                    console.warn("[AudioPronounceButton] Playback failed:", err?.message || err);
                }
            });
        },
        [disabled, isPlaying, targetKey, audioAvailable]
    );

    // Clean up audio on unmount
    useEffect(() => {
        return () => {
            stopSpeech();
        };
    }, []);

    if (!audioAvailable) {
        return null;
    }

    return (
        <button
            type="button"
            onClick={handlePronounce}
            disabled={disabled}
            className={`audio-pronounce-btn ${isPlaying ? "playing" : ""} ${className}`}
            title="Listen to medication pronunciation"
            aria-label="Listen to medication pronunciation"
        >
            <Volume2 size={size} />
        </button>
    );
}

export default AudioPronounceButton;
