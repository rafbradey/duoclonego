import MultipleChoiceQuestion from "./MultipleChoiceQuestion.jsx";
import MatchingQuestion from "./MatchingQuestion.jsx";
import TallManQuestion from "./TallManQuestion.jsx";

/**
 * QuestionRenderer acts as a strategy dispatcher for rendering questions
 * based on question.type.
 *
 * Supported types:
 * - "tall_man": Constructed-response Tall Man lettering capitalization
 * - "multiple_choice": Standard multi-option choice grid
 * - "true_false": Binary choice evaluation (uses choice grid)
 * - "matching": Interactive tap-to-match pair tiles
 *
 * @param {Object} props
 * @param {Object} props.question - Question definition object
 * @param {string} props.selectedAnswer - Currently selected answer value
 * @param {Function} props.onSelect - Callback invoked when an answer is chosen
 * @param {Function} [props.onSubmit] - Callback to submit when Enter is pressed
 * @param {boolean} props.isSubmitted - Whether the current answer has been submitted
 */
function QuestionRenderer({
    question,
    selectedAnswer,
    onSelect,
    onSubmit,
    isSubmitted = false
}) {
    if (!question) return null;

    switch (question.type) {
        case "tall_man":
            return (
                <TallManQuestion
                    key={question.id}
                    question={question}
                    selectedAnswer={selectedAnswer}
                    onSelect={onSelect}
                    onSubmit={onSubmit}
                    isSubmitted={isSubmitted}
                />
            );

        case "matching":
            return (
                <MatchingQuestion
                    key={question.id}
                    question={question}
                    onSelect={onSelect}
                    isSubmitted={isSubmitted}
                />
            );

        case "multiple_choice":
        case "true_false":
            return (
                <MultipleChoiceQuestion
                    question={question}
                    selectedAnswer={selectedAnswer}
                    onSelect={onSelect}
                    isSubmitted={isSubmitted}
                />
            );

        default:
            // Fallback: If choices exist, default to choice rendering; otherwise show notice
            if (Array.isArray(question.choices) && question.choices.length > 0) {
                return (
                    <MultipleChoiceQuestion
                        question={question}
                        selectedAnswer={selectedAnswer}
                        onSelect={onSelect}
                        isSubmitted={isSubmitted}
                    />
                );
            }

            return (
                <div className="question-unsupported duo-card" style={{ textAlign: "center", padding: "2rem" }}>
                    <h2 className="heading-md">{question.prompt || "Question"}</h2>
                    <p className="body-text-muted" style={{ marginTop: "1rem" }}>
                        Question type &quot;{question.type}&quot; is not yet supported in this version.
                    </p>
                </div>
            );
    }
}

export default QuestionRenderer;
