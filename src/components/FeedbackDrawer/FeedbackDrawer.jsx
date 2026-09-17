import { useState } from "react";
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck } from "lucide-react";
import TallManText from "../TallManText/TallManText.jsx";
import QuestionInfoModal from "../QuestionCard/QuestionInfoModal.jsx";
import "./FeedbackDrawer.css";

function FeedbackDrawer({ evaluation, question, onContinue }) {
    const [showInfoModal, setShowInfoModal] = useState(false);

    if (!evaluation) return null;

    const { isCorrect, correctAnswer, explanation } = evaluation;
    const hasSourceInfo = Boolean(
        question && (
            question.sourceUrl ||
            question.sourceCitation ||
            question.source ||
            question.lasaId
        )
    );

    return (
        <aside
            className={`feedback-drawer ${isCorrect ? "feedback-correct" : "feedback-incorrect"}`}
            role="status"
            aria-live="polite"
        >
            <div className="feedback-drawer-container">
                <div className="feedback-message-block">
                    <div className="feedback-icon-wrapper">
                        {isCorrect ? (
                            <CheckCircle2 size={36} className="feedback-icon-correct" />
                        ) : (
                            <XCircle size={36} className="feedback-icon-incorrect" />
                        )}
                    </div>

                    <div className="feedback-text-content">
                        <h3 className="feedback-heading heading-md">
                            {isCorrect ? "Excellent!" : "Correct Solution:"}
                        </h3>

                        {isCorrect && evaluation.tallManName && (
                            <div className="feedback-solution">
                                <TallManText name={evaluation.tallManName} />
                            </div>
                        )}

                        {!isCorrect && (
                            <div className="feedback-solution">
                                <TallManText name={correctAnswer} />
                            </div>
                        )}

                        {explanation && (
                            <p className="feedback-explanation body-text-sm">
                                {explanation}
                            </p>
                        )}

                        {evaluation.riskSummary && (
                            <div className="feedback-insight-box" role="note">
                                <span className="feedback-insight-title">
                                    <span className="feedback-insight-icon" aria-hidden="true">💡</span>
                                    <span>{isCorrect ? "Did you know?" : "Why does this matter?"}</span>
                                </span>
                                <p className="feedback-insight-text">
                                    {evaluation.riskSummary}
                                </p>
                            </div>
                        )}

                        {hasSourceInfo && (
                            <div className="feedback-citation-row">
                                <button
                                    type="button"
                                    onClick={() => setShowInfoModal(true)}
                                    className="feedback-citation-btn"
                                    aria-label="View official citation and source verification"
                                >
                                    <ShieldCheck size={15} className="feedback-citation-icon" />
                                    <span>Official Reference & Citation</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="feedback-action-block">
                    <button
                        type="button"
                        onClick={onContinue}
                        className={`duo-button ${isCorrect ? "duo-button-primary" : "feedback-continue-btn-danger"}`}
                        autoFocus
                    >
                        <span>CONTINUE</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            {showInfoModal && (
                <QuestionInfoModal
                    question={question}
                    onClose={() => setShowInfoModal(false)}
                />
            )}
        </aside>
    );
}

export default FeedbackDrawer;
