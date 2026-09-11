import { useEffect } from "react";
import { X, ExternalLink, ShieldCheck, BookOpen, AlertTriangle } from "lucide-react";
import "./QuestionInfoModal.css";

function QuestionInfoModal({ question, onClose }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!question) return null;

    const pairTitle = question.pairDisplay || question.relatedDrug || "Medication Information";
    const sourceName = question.source || "FDA Name Differentiation Project & ISMP Tall Man List";
    const citation = question.sourceCitation || "ISMP List of Confused Drug Names";
    const sourceUrl = question.sourceUrl || "https://www.ismp.org/recommendations/tall-man-letters-list";
    const riskSummary = question.riskSummary || question.feedbackFact || "";

    return (
        <div className="info-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="info-modal-title">
            <div className="info-modal-card duo-card" onClick={(e) => e.stopPropagation()}>
                <header className="info-modal-header">
                    <div className="info-modal-header-icon">
                        <ShieldCheck size={20} className="info-icon-shield" />
                    </div>
                    <div className="info-modal-header-text">
                        <h2 id="info-modal-title" className="heading-md info-modal-title">
                            Source Verification
                        </h2>
                        <span className="info-modal-subtitle">Official Reference & Transparency</span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="info-modal-close-btn"
                        aria-label="Close information dialog"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="info-modal-body">
                    <div className="info-section-item">
                        <span className="info-section-label">LASA MEDICATION / PAIR</span>
                        <div className="info-section-value info-pair-badge">
                            {pairTitle}
                        </div>
                    </div>

                    <div className="info-section-item">
                        <span className="info-section-label">AUTHORITATIVE SOURCE</span>
                        <div className="info-section-value">
                            <BookOpen size={15} className="info-inline-icon" />
                            <span>{sourceName}</span>
                        </div>
                    </div>

                    <div className="info-section-item">
                        <span className="info-section-label">CITATION / REFERENCE</span>
                        <div className="info-section-value info-citation-text">
                            {citation}
                        </div>
                    </div>

                    {riskSummary && (
                        <div className="info-section-item info-risk-box">
                            <div className="info-risk-header">
                                <AlertTriangle size={15} className="info-risk-icon" />
                                <span className="info-risk-label">DOCUMENTED RISK CONTEXT</span>
                            </div>
                            <p className="info-risk-text body-text-sm">
                                {riskSummary}
                            </p>
                        </div>
                    )}
                </div>

                <footer className="info-modal-footer">
                    {sourceUrl && (
                        <a
                            href={sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="duo-button duo-button-secondary info-verify-link"
                        >
                            <span>Verify Official Source</span>
                            <ExternalLink size={15} />
                        </a>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="duo-button duo-button-primary info-done-btn"
                    >
                        GOT IT
                    </button>
                </footer>
            </div>
        </div>
    );
}

export default QuestionInfoModal;
