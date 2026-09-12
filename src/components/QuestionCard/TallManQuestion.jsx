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
 * 1. Guided Mode: Scaffolding with prefix/suffix framing and live reconstruction preview.
 * 2. Unit Mastery Mode: Independent retrieval requiring the complete drug name with
 *    exact case-sensitive Tall Man lettering, without any scaffolds or hints.
 *
 * @param {Object} props
 * @param {Object} props.question - Question object
 * @param {string} [props.selectedAnswer=""] - Currently entered value
 * @param {Function} props.onSelect - Callback invoked when the user updates the input
 * @param {Function} [props.onSubmit] - Callback to submit when Enter is pressed
 * @param {boolean} [props.isSubmitted=false] - Whether the question is in submitted/review state
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
            {/* Context Badge */}
            <div className="tm-header">
                <span className={`tm-badge ${isMastery ? "tm-badge-mastery" : "tm-badge-guided"}`}>
                    {isMastery ? (
                        <>
                            <Award size={14} className="tm-badge-icon" />
                            <span>UNIT MASTERY · TALL MAN RETRIEVAL</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={14} className="tm-badge-icon" />
                            <span>GUIDED PRACTICE · TALL MAN CONSTRUCTION</span>
                        </>
                    )}
                </span>
            </div>

            {/* Single Concise Directive */}
            <h2 className="tm-prompt">
                {isMastery
                    ? "Enter the complete medication name with exact Tall Man lettering:"
                    : "Complete the Tall Man lettering for this medication:"}
            </h2>

            {/* Target Medication Card */}
            <div className="tm-target-card duo-card">
                <div className="tm-target-header">
                    <span className="tm-target-label">Target Medication</span>
                    <AudioPronounceButton
                        drug={question.canonicalDrugId || standardName || question.relatedDrug}
                        size={17}
                    />
                </div>
                <div className="tm-target-name-row">
                    <span className="tm-target-name">{standardName}</span>
                </div>
            </div>

            {/* Input Section */}
            {isMastery ? (
                /* Unit Mastery Input: Full drug name, no hints */
                <div className="tm-input-section tm-mastery-input-section duo-card">
                    <label htmlFor="tm-mastery-input" className="tm-input-label">
                        Tall Man Representation
                    </label>
                    <div className="tm-input-wrapper">
                        <input
                            id="tm-mastery-input"
                            ref={inputRef}
                            type="text"
                            value={currentValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            disabled={isSubmitted}
                            placeholder="e.g., DOBUtamine"
                            aria-label="Complete medication name with Tall Man capitalization"
                            className="tm-full-input"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                        />
                        <Edit3 size={18} className="tm-input-icon" />
                    </div>
                    <p className="tm-hint-note">
                        Exact capitalization required. No hints are provided.
                    </p>
                </div>
            ) : (
                /* Guided Practice: Affix frames + Live preview */
                <div className="tm-input-section tm-guided-input-section duo-card">
                    <div className="tm-guided-frame">
                        {prefix && <span className="tm-affix tm-prefix">{prefix}</span>}
                        <div className="tm-guided-input-wrapper">
                            <input
                                ref={inputRef}
                                type="text"
                                value={currentValue}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                disabled={isSubmitted}
                                placeholder="____"
                                aria-label="Tall Man capitalized letters"
                                className="tm-segment-input"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                            />
                            <Edit3 size={15} className="tm-input-icon" />
                        </div>
                        {suffix && <span className="tm-affix tm-suffix">{suffix}</span>}
                    </div>

                    <div className="tm-preview-deck">
                        <span className="tm-preview-label">Live Preview</span>
                        <div className="tm-preview-value">
                            {liveSegment ? (
                                <TallManText name={liveReconstructed} />
                            ) : (
                                <span className="tm-preview-placeholder">{liveReconstructed}</span>
                            )}
                        </div>
                    </div>

                    <p className="tm-hint-note">
                        Type only the distinguishing uppercase letters.
                    </p>
                </div>
            )}
        </div>
    );
}

export default TallManQuestion;
