import MultipleChoiceQuestion from "./MultipleChoiceQuestion.jsx";
import MatchingQuestion from "./MatchingQuestion.jsx";

/**
 * QuestionRenderer acts as a strategy dispatcher for rendering questions
 * based on question.type.
 *
 * Supported types:
 * - "multiple_choice": Standard multi-option choice grid
 * - "true_false": Binary choice evaluation (uses choice grid)
 * - "matching": Interactive tap-to-match pair tiles
 * - Future: "recognition", "comparison"
 *
 * @param {Object} props
 * @param {Object} props.question - Question definition object
 * @param {string} props.selectedAnswer - Currently selected answer value
 * @param {Function} props.onSelect - Callback invoked when an answer is chosen
 * @param {boolean} props.isSubmitted - Whether the current answer has been submitted
 */
function QuestionRenderer({
    question,
    selectedAnswer,
    onSelect,
    isSubmitted = false
}) {
    if (!question) return null;

    switch (question.type) {
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
