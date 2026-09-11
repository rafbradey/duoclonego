import { useState } from "react";
import { Info, Compass } from "lucide-react";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion.jsx";
import MatchingQuestion from "./MatchingQuestion.jsx";
import TallManQuestion from "./TallManQuestion.jsx";
import QuestionInfoModal from "./QuestionInfoModal.jsx";
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
 *
 * Provides a question-level "ⓘ Information" button for transparent source verification,
 * and an Origin Banner identifying Section, Unit, and Level in review modes.
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
    const [showInfoModal, setShowInfoModal] = useState(false);

    if (!question) return null;

    const isReviewQuestion = isPracticeMode || Boolean(question.isPractice);
    const questionOrigin = isReviewQuestion ? getQuestionOrigin(question) : null;
    const originText = questionOrigin ? formatQuestionOrigin(questionOrigin) : "";

    let content;

    switch (question.type) {
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

    const hasSourceInfo = Boolean(
        question.sourceUrl ||
        question.sourceCitation ||
        question.source ||
        question.lasaId
    );

    return (
        <div className="question-renderer-container">
            {originText && (
                <div className="question-origin-row">
                    <div className="question-origin-badge" aria-label={`Question origin: ${originText}`}>
                        <Compass size={13} className="question-origin-icon" />
                        <span className="question-origin-text">{originText}</span>
                    </div>
                </div>
            )}

            {content}

            {hasSourceInfo && (
                <div className="question-info-trigger-row">
                    <button
                        type="button"
                        className="question-info-btn"
                        onClick={() => setShowInfoModal(true)}
                        aria-label="View source verification information"
                    >
                        <Info size={15} className="question-info-btn-icon" />
                        <span>Information</span>
                    </button>
                </div>
            )}

            {showInfoModal && (
                <QuestionInfoModal
                    question={question}
                    onClose={() => setShowInfoModal(false)}
                />
            )}
        </div>
    );
}

export default QuestionRenderer;
