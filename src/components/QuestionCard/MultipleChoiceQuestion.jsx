import TallManText from "../TallManText/TallManText.jsx";
import AudioPronounceButton from "../AudioPronounceButton/AudioPronounceButton.jsx";
import "./MultipleChoiceQuestion.css";

function MultipleChoiceQuestion({
    question,
    selectedAnswer,
    onSelect,
    isSubmitted = false
}) {
    if (!question) return null;

    const choices = Array.isArray(question.choices) ? question.choices : [];
    const drugToPronounce = question.canonicalDrugId || question.relatedDrug || question.spokenDrug || "";

    return (
        <div className="mc-question-container">
            {question.scenario && (
                <div className="mc-scenario-card" role="region" aria-label="Clinical Scenario">
                    <span className="mc-scenario-badge">
                        <span className="mc-scenario-dot" aria-hidden="true" />
                        Clinical Context
                    </span>
                    <p className="mc-scenario-text">{question.scenario}</p>
                </div>
            )}

            <div className="mc-prompt-row">
                <h2 className="mc-question-prompt heading-md">
                    {question.prompt}
                </h2>
                {drugToPronounce && (
                    <AudioPronounceButton
                        drug={drugToPronounce}
                        size={20}
                    />
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
