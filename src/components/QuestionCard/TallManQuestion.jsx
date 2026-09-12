import { useEffect, useRef } from "react";
import { Sparkles, Edit3, Award } from "lucide-react";
import TallManText from "../TallManText/TallManText.jsx";
import AudioPronounceButton from "../AudioPronounceButton/AudioPronounceButton.jsx";
import "./TallManQuestion.css";

/**
 * TallManQuestion presents a constructed-response task where the learner
 * produces the required Tall Man capitalization rather than guessing among
 * multiple choice options.
 *
 * Supports two pedagogical modes:
 * 1. Guided Mode: Scaffolding with prefix/suffix framing and live preview.
 * 2. Unit Mastery Mode (No-hint): Independent retrieval requiring the complete
 *    drug name with exact Tall Man lettering, without any scaffolds or hints.
 *
 * @param {Object} props
 * @param {Object} props.question - Question object
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

    const isMastery = Boolean(
        question.isFinalTask ||
        question.activityRole === "unit_mastery" ||
        question.scaffold === false
    );

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

    // Calculate live reconstructed name for guided practice mode only
    const liveSegment = currentValue.trim().toUpperCase();
    const liveReconstructed = liveSegment
        ? `${prefix}${liveSegment}${suffix}`
        : `${prefix}${expectedSegment ? "____" : ""}${suffix}`;

    return (
        <div className={`tm-question-container ${isMastery ? "tm-mastery-mode" : "tm-guided-mode"}`}>
            {/* Pedagogical Activity Context Header */}
            <div className="tm-activity-header">
                {isMastery ? (
                    <span className="tm-activity-badge tm-mastery-badge">
                        <Award size={15} className="tm-badge-icon" />
                        UNIT MASTERY · INDEPENDENT TALL MAN RETRIEVAL
                    </span>
                ) : (
                    <span className="tm-activity-badge">
                        <Sparkles size={14} className="tm-badge-icon" />
                        CONSTRUCTION · TALL MAN LETTERING
                    </span>
                )}
                {question.activityObjective && (
                    <span className="tm-activity-objective">
                        {question.activityObjective}
                    </span>
                )}
            </div>

            {/* Question Prompt */}
            <h2 className="tm-question-prompt heading-md">
                {question.prompt || (isMastery
                    ? "Enter the complete medication name using exact Tall Man lettering to distinguish it from confusable counterparts:"
                    : "Convert this drug name to Tall Man lettering by entering the letters that should be capitalized:")}
            </h2>

            {/* Standard Drug Name Reference Card */}
            <div className="tm-reference-card">
                <div className="tm-reference-header">
                    <span className="tm-reference-label">
                        {isMastery ? "Target Drug (Standard Name)" : "Standard Drug Name"}
                    </span>
                    <AudioPronounceButton
                        drug={question.canonicalDrugId || standardName || question.relatedDrug || question.tallManName}
                        size={16}
                    />
                </div>
                <span className="tm-reference-name">{standardName}</span>
            </div>

            {/* Render No-Hint Mastery Input OR Guided Scaffolding */}
            {isMastery ? (
                /* Independent Mastery Frame (No Affixes, No Segment Clues) */
                <div className="tm-construction-frame tm-mastery-frame">
                    <div className="tm-input-group tm-mastery-input-group">
                        <div className="tm-input-wrapper tm-mastery-input-wrapper">
                            <input
                                ref={inputRef}
                                type="text"
                                value={currentValue}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                disabled={isSubmitted}
                                placeholder=""
                                aria-label="Complete medication name with Tall Man capitalization"
                                className="tm-segment-input tm-full-input"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                            />
                            <Edit3 size={18} className="tm-input-icon" />
                        </div>
                    </div>
                    <p className="tm-input-hint tm-mastery-hint">
                        Type the complete medication name with exact uppercase Tall Man letters. No hints or letter scaffolds are provided.
                    </p>
                </div>
            ) : (
                /* Guided Practice Frame (Prefix + Input Segment + Suffix + Live Preview) */
                <>
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
                                    placeholder=""
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
                </>
            )}
        </div>
    );
}

export default TallManQuestion;
