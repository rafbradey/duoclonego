import { useState } from "react";
import { Volume2 } from "lucide-react";
import { playMedicationAudio } from "../../services/audioService.js";
import TallManText from "../TallManText/TallManText.jsx";
import "./MultipleChoiceQuestion.css";

function MultipleChoiceQuestion({
    question,
    selectedAnswer,
    onSelect,
    isSubmitted = false
}) {
    const [isPlaying, setIsPlaying] = useState(false);
    if (!question) return null;

    const choices = Array.isArray(question.choices) ? question.choices : [];
    const drugToPronounce = question.relatedDrug || question.spokenDrug || "";

    const handlePronounce = () => {
        if (!drugToPronounce) return;
        setIsPlaying(true);
        playMedicationAudio(drugToPronounce, {
            onStart: () => setIsPlaying(true),
            onEnd: () => setIsPlaying(false),
            onError: () => setIsPlaying(false)
        });
    };

    return (
        <div className="mc-question-container">
            <div className="mc-prompt-row">
                <h2 className="mc-question-prompt heading-md">
                    {question.prompt}
                </h2>
                {drugToPronounce && (
                    <button
                        type="button"
                        onClick={handlePronounce}
                        className={`mc-audio-btn ${isPlaying ? "playing" : ""}`}
                        title={`Listen to pronunciation of ${drugToPronounce}`}
                        aria-label={`Pronounce ${drugToPronounce}`}
                    >
                        <Volume2 size={20} />
                    </button>
                )}
            </div>

            <div className="mc-choices-grid" role="radiogroup" aria-label="Question choices">
                {choices.map((choice, index) => {
                    const isSelected = selectedAnswer === choice;
                    const choiceKey = `choice-${index}`;

                    return (
                        <button
                            key={choiceKey}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            disabled={isSubmitted}
                            onClick={() => onSelect(choice)}
                            className={`mc-choice-btn ${isSelected ? "selected" : ""}`}
                        >
                            <span className="mc-choice-index">{index + 1}</span>
                            <span className="mc-choice-text">
                                <TallManText name={choice} />
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default MultipleChoiceQuestion;
