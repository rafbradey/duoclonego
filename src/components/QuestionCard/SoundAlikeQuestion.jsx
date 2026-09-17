import { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX, PhoneCall, Radio, RotateCcw, Sparkles } from "lucide-react";
import TallManText from "../TallManText/TallManText.jsx";
import { playMedicationAudio, stopSpeech, hasMedicationAudio, isSpeechSupported } from "../../services/audioService.js";
import "./MultipleChoiceQuestion.css";
import "./SoundAlikeQuestion.css";

/**
 * SoundAlikeQuestion Component.
 * Supports:
 * - "acoustic_mcq": Learner listens to a spoken drug name and discriminates from phonetic sound-alikes.
 * - "read_back": Simulates an oral telephone prescription order; learner verifies and reads back the exact medication.
 */
function SoundAlikeQuestion({
    question,
    selectedAnswer,
    onSelect,
    isSubmitted = false
}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [hasSpeechSupport] = useState(() => isSpeechSupported());
    const hasAutoPlayedRef = useRef(false);

    const isReadBack = question?.subtype === "read_back";

    // Extract canonical medication name preserving exact Tall Man capitalization
    const medicationName =
        question?.spokenDrug ||
        question?.relatedDrug ||
        question?.correctAnswer ||
        (question?.spokenText ? question.spokenText.replace(/^Order received for:\s*/i, "").replace(/\.$/, "").trim() : "");

    // Resolve canonical audio identifier: canonicalDrugId > extracted ID from question.id > drugToPronounce > medicationName
    let canonicalDrugId = question?.canonicalDrugId || null;
    if (!canonicalDrugId && question?.id) {
        const match = question.id.match(/(lasa_\d+)_([AB])/i);
        if (match) {
            canonicalDrugId = `${match[1].toLowerCase()}_${match[2].toLowerCase()}`;
        }
    }
    const targetAudioKey = canonicalDrugId || question?.drugToPronounce || medicationName || "";

    const choices = Array.isArray(question?.choices) ? question.choices : [];
    const hasAudio = Boolean(hasMedicationAudio(targetAudioKey) || hasSpeechSupport);

    const handlePlayAudio = useCallback((customRate) => {
        if (!targetAudioKey) return;
        setIsPlaying(true);

        const rate = customRate || playbackSpeed;
        playMedicationAudio(targetAudioKey, {
            rate,
            fallback: false, // Strictly require archived static audio for medication pronunciation
            onStart: () => setIsPlaying(true),
            onEnd: () => setIsPlaying(false),
            onError: (err) => {
                setIsPlaying(false);
                console.warn("[SoundAlikeQuestion] Audio playback failed:", err?.message || err);
            }
        });
    }, [targetAudioKey, playbackSpeed]);

    useEffect(() => {
        let isCurrent = true;
        stopSpeech();
        hasAutoPlayedRef.current = false;

        // Automatically pronounce the medication name once on question display
        const timer = setTimeout(() => {
            if (isCurrent && !hasAutoPlayedRef.current) {
                hasAutoPlayedRef.current = true;
                handlePlayAudio();
            }
        }, 350);

        return () => {
            isCurrent = false;
            clearTimeout(timer);
            stopSpeech();
        };
    }, [question?.id, handlePlayAudio]);

    const toggleSpeed = () => {
        const nextSpeed = playbackSpeed < 1.0 ? 1.0 : 0.75;
        setPlaybackSpeed(nextSpeed);
        handlePlayAudio(nextSpeed);
    };

    if (!question) return null;

    return (
        <div className="sound-question-container">
            {/* Context Badge */}
            <div className={`sound-mode-badge ${isReadBack ? "badge-read-back" : "badge-acoustic"}`}>
                {isReadBack ? (
                    <>
                        <PhoneCall size={16} className="badge-icon-pulse" />
                        <span>SIMULATED ORAL ORDER • VERIFY READ-BACK</span>
                    </>
                ) : (
                    <>
                        <Radio size={16} className="badge-icon-pulse" />
                        <span>SOUND-ALIKE ACOUSTIC DISCRIMINATION</span>
                    </>
                )}
            </div>

            {/* Question Prompt */}
            <h2 className="sound-question-prompt heading-md">
                {question.prompt}
            </h2>

            {/* Interactive Audio Player Deck */}
            <div className={`sound-audio-deck duo-card ${isPlaying ? "sound-deck-playing" : ""}`}>
                <div className="sound-deck-header">
                    <span className="sound-deck-label">
                        {isReadBack ? "Incoming Verbal Prescription Order" : "Audio Pronunciation"}
                    </span>
                    <button
                        type="button"
                        onClick={toggleSpeed}
                        className={`sound-speed-btn ${playbackSpeed < 1.0 ? "speed-slow" : ""}`}
                        title="Toggle pronunciation playback speed"
                        disabled={isSubmitted}
                    >
                        <RotateCcw size={13} />
                        <span>{playbackSpeed < 1.0 ? "0.75x Slow" : "1.0x Normal"}</span>
                    </button>
                </div>

                {/* Post-submission reveal: show target medication only after answer is submitted */}
                {isReadBack && isSubmitted && medicationName && (
                    <div className="sound-oral-order-display sound-reveal-display" aria-label={`Ordered medication: ${medicationName}`}>
                        <span className="sound-medication-name">
                            <TallManText name={medicationName} />
                        </span>
                    </div>
                )}

                <div className="sound-play-row">
                    <button
                        type="button"
                        onClick={() => handlePlayAudio()}
                        className={`sound-play-button ${isPlaying ? "playing" : ""}`}
                        aria-label={isPlaying ? "Playing audio" : "Play medication pronunciation"}
                    >
                        {isPlaying ? (
                            <div className="sound-wave-bars" aria-hidden="true">
                                <span className="wave-bar bar-1"></span>
                                <span className="wave-bar bar-2"></span>
                                <span className="wave-bar bar-3"></span>
                                <span className="wave-bar bar-4"></span>
                                <span className="wave-bar bar-5"></span>
                            </div>
                        ) : hasAudio ? (
                            <Volume2 size={28} />
                        ) : (
                            <VolumeX size={28} />
                        )}
                        <span className="sound-play-text">
                            {isPlaying ? "PLAYING SPOKEN ORDER..." : "TAP TO HEAR SPOKEN DRUG"}
                        </span>
                    </button>
                </div>

                {!hasAudio && (
                    <p className="sound-hint-text body-text-muted sound-fallback-warning">
                        Audio playback unavailable; please read phonetic choices carefully.
                    </p>
                )}
            </div>

            {/* Answer Choices Grid */}
            <div className="mc-choices-grid" role="radiogroup" aria-label="Sound-Alike Choices">
                {choices.map((choice, index) => {
                    const isSelected = selectedAnswer === choice;
                    const choiceKey = `sound-choice-${index}`;

                    return (
                        <button
                            key={choiceKey}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            disabled={isSubmitted}
                            onClick={() => onSelect(choice)}
                            className={`mc-choice-btn sound-choice-btn ${isSelected ? "selected" : ""}`}
                        >
                            <span className="mc-choice-index">{index + 1}</span>
                            <span className="mc-choice-text">
                                <TallManText name={choice} />
                            </span>
                            {isSelected && (
                                <Sparkles size={16} className="sound-selected-icon" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default SoundAlikeQuestion;
