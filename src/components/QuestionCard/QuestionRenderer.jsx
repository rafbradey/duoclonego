import { Compass, RotateCcw } from "lucide-react";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion.jsx";
import MatchingQuestion from "./MatchingQuestion.jsx";
import TallManQuestion from "./TallManQuestion.jsx";
import SoundAlikeQuestion from "./SoundAlikeQuestion.jsx";
import { getQuestionOrigin, formatQuestionOrigin } from "../../data/levels/index.js";
import "./QuestionRenderer.css";

/**
 * QuestionRenderer acts as a strategy dispatcher for rendering questions
 * based on question.type.
 *
 * Supported types:
 * - "tall_man": Constructed-response Tall Man lettering capitalization
 * - "multiple_choice": Standard multi-option choice grid
 * - "true_false": Binary choice evaluation (uses choice grid)
 * - "matching": Interactive tap-to-match pair tiles
 * - "sound_alike": Acoustic discrimination and oral read-back practice
 *
 * Origin Banner identifies Section, Unit, and Level in review modes.
 * Official citations are displayed post-submission in the Feedback Drawer.
 *
 * @param {Object} props
 * @param {Object} props.question - Question definition object
 * @param {string} props.selectedAnswer - Currently selected answer value
 * @param {Function} props.onSelect - Callback invoked when an answer is chosen
 * @param {Function} [props.onSubmit] - Callback to submit when Enter is pressed
 * @param {boolean} [props.isSubmitted=false] - Whether the current answer has been submitted
 * @param {boolean} [props.isPracticeMode=false] - Whether the question is shown in review/practice modes
 */
function QuestionRenderer({
    question,
    selectedAnswer,
    onSelect,
    onSubmit,
    isSubmitted = false,
    isPracticeMode = false
}) {
    if (!question) return null;

    const isReviewQuestion = isPracticeMode || Boolean(question.isPractice);
    const questionOrigin = isReviewQuestion ? getQuestionOrigin(question) : null;
    const originText = questionOrigin ? formatQuestionOrigin(questionOrigin) : "";

    let content;

    switch (question.type) {
        case "sound_alike":
            content = (
                <SoundAlikeQuestion
                    key={question.id}
                    question={question}
                    selectedAnswer={selectedAnswer}
                    onSelect={onSelect}
                    isSubmitted={isSubmitted}
                />
            );
            break;

        case "tall_man":
            content = (
                <TallManQuestion
                    key={question.id}
                    question={question}
                    selectedAnswer={selectedAnswer}
                    onSelect={onSelect}
                    onSubmit={onSubmit}
                    isSubmitted={isSubmitted}
                />
            );
            break;

        case "matching":
            content = (
                <MatchingQuestion
                    key={question.id}
                    question={question}
                    onSelect={onSelect}
                    isSubmitted={isSubmitted}
                />
            );
            break;

        case "multiple_choice":
        case "true_false":
            content = (
                <MultipleChoiceQuestion
                    question={question}
                    selectedAnswer={selectedAnswer}
                    onSelect={onSelect}
                    isSubmitted={isSubmitted}
                />
            );
            break;

        default:
            if (Array.isArray(question.choices) && question.choices.length > 0) {
                content = (
                    <MultipleChoiceQuestion
                        question={question}
                        selectedAnswer={selectedAnswer}
                        onSelect={onSelect}
                        isSubmitted={isSubmitted}
                    />
                );
            } else {
                content = (
                    <div className="question-unsupported duo-card" style={{ textAlign: "center", padding: "2rem" }}>
                        <h2 className="heading-md">{question.prompt || "Question"}</h2>
                        <p className="body-text-muted" style={{ marginTop: "1rem" }}>
                            Question type &quot;{question.type}&quot; is not yet supported in this version.
                        </p>
                    </div>
                );
            }
    }

    const showHeaderRow = Boolean(originText || question.isRetry);

    return (
        <div className="question-renderer-container">
            {showHeaderRow && (
                <div className="question-badge-row">
                    {question.isRetry && (
                        <div className="question-retry-badge" aria-label="Reviewing previous mistake">
                            <RotateCcw size={13} className="question-retry-icon" />
                            <span>PREVIOUS MISTAKE • REVIEW</span>
                        </div>
                    )}
                    {originText && (
                        <div className="question-origin-badge" aria-label={`Question origin: ${originText}`}>
                            <Compass size={13} className="question-origin-icon" />
                            <span className="question-origin-text">{originText}</span>
                        </div>
                    )}
                </div>
            )}

            {content}
        </div>
    );
}

export default QuestionRenderer;
