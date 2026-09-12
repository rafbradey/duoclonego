import { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX, PhoneCall, Radio, RotateCcw, Sparkles } from "lucide-react";
import TallManText from "../TallManText/TallManText.jsx";
import { speakDrugName, stopSpeech, isSpeechSupported } from "../../services/audioService.js";
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
    const [playbackSpeed, setPlaybackSpeed] = useState(0.85);
    const [hasSpeechSupport] = useState(() => isSpeechSupported());
    const hasAutoPlayedRef = useRef(false);

    const isReadBack = question?.subtype === "read_back";
    const spokenText = question?.spokenText || question?.drugToPronounce || question?.correctAnswer || "";
    const choices = Array.isArray(question?.choices) ? question.choices : [];

    const handlePlayAudio = useCallback((customRate) => {
        if (!spokenText) return;
        setIsPlaying(true);

        const rate = customRate || playbackSpeed;
        speakDrugName(spokenText, {
            rate,
            onStart: () => setIsPlaying(true),
            onEnd: () => setIsPlaying(false),
            onError: () => setIsPlaying(false)
        });
    }, [spokenText, playbackSpeed]);

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
        const nextSpeed = playbackSpeed === 0.85 ? 0.70 : 0.85;
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
                        className={`sound-speed-btn ${playbackSpeed < 0.85 ? "speed-slow" : ""}`}
                        title="Toggle pronunciation playback speed"
                        disabled={isSubmitted}
                    >
                        <RotateCcw size={13} />
                        <span>{playbackSpeed < 0.85 ? "0.7x Slow" : "1.0x Normal"}</span>
                    </button>
                </div>

                <div className="sound-play-row">
                    <button
                        type="button"
                        onClick={() => handlePlayAudio()}
                        className={`sound-play-button ${isPlaying ? "playing" : ""}`}
                        aria-label={isPlaying ? "Playing audio" : "Play medication pronunciation"}
                    >
                        {isPlaying ? (
                            <div className="sound-wave-bars">
                                <span className="wave-bar bar-1"></span>
                                <span className="wave-bar bar-2"></span>
                                <span className="wave-bar bar-3"></span>
                                <span className="wave-bar bar-4"></span>
                            </div>
                        ) : hasSpeechSupport ? (
                            <Volume2 size={32} />
                        ) : (
                            <VolumeX size={32} />
                        )}
                        <span className="sound-play-text">
                            {isPlaying ? "PLAYING SPOKEN ORDER..." : "TAP TO HEAR SPOKEN DRUG"}
                        </span>
                    </button>
                </div>

                <p className="sound-hint-text body-text-muted">
                    {hasSpeechSupport
                        ? "Listen closely to vowel and consonant inflections to avoid confusing sound-alike counterparts."
                        : "Browser speech synthesis unavailable; please read phonetic choices carefully."}
                </p>
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
