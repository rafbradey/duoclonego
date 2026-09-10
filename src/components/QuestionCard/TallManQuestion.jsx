import { useEffect, useRef } from "react";
import { Sparkles, Edit3 } from "lucide-react";
import TallManText from "../TallManText/TallManText.jsx";
import "./TallManQuestion.css";

/**
 * TallManQuestion presents a constructed-response / fill-in-the-blank task
 * where the learner produces the required Tall Man capitalization rather than
 * guessing among multiple choice options.
 *
 * @param {Object} props
 * @param {Object} props.question - Question object with standardName, prefix, suffix, expectedSegment, etc.
 * @param {string} props.selectedAnswer - Currently entered value
 * @param {Function} props.onSelect - Callback invoked when the user updates the input
 * @param {Function} [props.onSubmit] - Callback to submit when Enter is pressed
 * @param {boolean} props.isSubmitted - Whether the question is in submitted/review state
 */
function TallManQuestion({
    question,
    selectedAnswer = "",
    onSelect,
    onSubmit,
    isSubmitted = false
}) {
    const inputRef = useRef(null);

    const standardName = question.standardName || (question.relatedDrug ? question.relatedDrug.toLowerCase() : "");
    const prefix = question.prefix || "";
    const suffix = question.suffix || "";
    const expectedSegment = question.expectedSegment || "";
    const currentValue = selectedAnswer || "";

    // Auto-focus input on question load
    useEffect(() => {
        if (!isSubmitted && inputRef.current) {
            inputRef.current.focus();
        }
    }, [question.id, isSubmitted]);

    const handleInputChange = (e) => {
        if (isSubmitted) return;
        onSelect(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !isSubmitted && currentValue.trim() && onSubmit) {
            e.preventDefault();
            onSubmit();
        }
    };

    // Calculate live reconstructed name
    const liveSegment = currentValue.trim().toUpperCase();
    const liveReconstructed = liveSegment
        ? `${prefix}${liveSegment}${suffix}`
        : `${prefix}${expectedSegment ? "____" : ""}${suffix}`;

    return (
        <div className="tm-question-container">
            {/* Pedagogical Activity Context Header */}
            <div className="tm-activity-header">
                <span className="tm-activity-badge">
                    <Sparkles size={14} className="tm-badge-icon" />
                    CONSTRUCTION · TALL MAN LETTERING
                </span>
                {question.activityObjective && (
                    <span className="tm-activity-objective">
                        {question.activityObjective}
                    </span>
                )}
            </div>

            {/* Question Prompt */}
            <h2 className="tm-question-prompt heading-md">
                {question.prompt || "Convert this drug name to Tall Man lettering by entering the letters that should be capitalized:"}
            </h2>

            {/* Standard Drug Name Reference Card */}
            <div className="tm-reference-card">
                <span className="tm-reference-label">Standard Drug Name</span>
                <span className="tm-reference-name">{standardName}</span>
            </div>

            {/* Constructed Response Frame */}
            <div className="tm-construction-frame">
                <div className="tm-input-group">
                    {prefix && <span className="tm-affix tm-prefix">{prefix}</span>}
                    <div className="tm-input-wrapper">
                        <input
                            ref={inputRef}
                            type="text"
                            value={currentValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            disabled={isSubmitted}
                            placeholder={expectedSegment ? expectedSegment.toUpperCase() : "CAPITALS"}
                            aria-label="Tall Man capitalized letters"
                            className="tm-segment-input"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                        />
                        <Edit3 size={16} className="tm-input-icon" />
                    </div>
                    {suffix && <span className="tm-affix tm-suffix">{suffix}</span>}
                </div>
                <p className="tm-input-hint">
                    Type the segment of letters that should be capitalized in Tall Man notation.
                </p>
            </div>

            {/* Real-Time Live Reconstructed Name Preview */}
            <div className="tm-preview-card">
                <span className="tm-preview-label">Live Reconstructed Name</span>
                <div className="tm-preview-value">
                    {liveSegment ? (
                        <TallManText name={liveReconstructed} />
                    ) : (
                        <span className="tm-preview-placeholder">{liveReconstructed}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TallManQuestion;
