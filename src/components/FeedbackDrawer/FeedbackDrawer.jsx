import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import TallManText from "../TallManText/TallManText.jsx";
import "./FeedbackDrawer.css";

function FeedbackDrawer({ evaluation, onContinue }) {
    if (!evaluation) return null;

    const { isCorrect, correctAnswer, explanation } = evaluation;

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
        </aside>
    );
}

export default FeedbackDrawer;
