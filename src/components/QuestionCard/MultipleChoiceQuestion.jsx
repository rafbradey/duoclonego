import TallManText from "../TallManText/TallManText.jsx";
import "./MultipleChoiceQuestion.css";

function MultipleChoiceQuestion({
    question,
    selectedAnswer,
    onSelect,
    isSubmitted = false
}) {
    if (!question) return null;

    const choices = Array.isArray(question.choices) ? question.choices : [];

    return (
        <div className="mc-question-container">
            <h2 className="mc-question-prompt heading-md">
                {question.prompt}
            </h2>

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
