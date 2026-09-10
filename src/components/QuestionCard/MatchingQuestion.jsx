import { useState, useMemo } from "react";
import { Check, X, Sparkles } from "lucide-react";
import TallManText from "../TallManText/TallManText.jsx";
import "./MatchingQuestion.css";

/**
 * Modern Fisher-Yates array shuffle.
 */
function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function MatchingQuestion({
    question,
    onSelect,
    isSubmitted = false
}) {
    const rawPairs = useMemo(() => question?.pairs || [], [question]);

    // Shuffled column items derived deterministically for this question instance
    const leftItems = useMemo(() => shuffle(rawPairs.map((p) => p.left)), [rawPairs]);
    const rightItems = useMemo(() => shuffle(rawPairs.map((p) => p.right)), [rawPairs]);

    // Match and selection states
    const [selectedLeft, setSelectedLeft] = useState(null);
    const [selectedRight, setSelectedRight] = useState(null);
    const [matchedMap, setMatchedMap] = useState({});
    const [shakingLeft, setShakingLeft] = useState(null);
    const [shakingRight, setShakingRight] = useState(null);
    const [justMatchedPair, setJustMatchedPair] = useState(null);

    const isPairMatch = (left, right) => {
        return rawPairs.some(
            (p) => String(p.left).trim().toLowerCase() === String(left).trim().toLowerCase() &&
                   String(p.right).trim().toLowerCase() === String(right).trim().toLowerCase()
        );
    };

    const handleLeftClick = (leftItem) => {
        if (isSubmitted || matchedMap[leftItem]) return;

        if (selectedRight) {
            if (isPairMatch(leftItem, selectedRight)) {
                const nextMap = { ...matchedMap, [leftItem]: selectedRight };
                setMatchedMap(nextMap);
                setJustMatchedPair({ left: leftItem, right: selectedRight });
                setSelectedLeft(null);
                setSelectedRight(null);

                setTimeout(() => setJustMatchedPair(null), 500);

                if (Object.keys(nextMap).length === rawPairs.length) {
                    onSelect(JSON.stringify(nextMap));
                }
            } else {
                setShakingLeft(leftItem);
                setShakingRight(selectedRight);
                setTimeout(() => {
                    setShakingLeft(null);
                    setShakingRight(null);
                    setSelectedLeft(null);
                    setSelectedRight(null);
                }, 450);
            }
        } else {
            setSelectedLeft((prev) => (prev === leftItem ? null : leftItem));
        }
    };

    const handleRightClick = (rightItem) => {
        const isMatched = Object.values(matchedMap).includes(rightItem);
        if (isSubmitted || isMatched) return;

        if (selectedLeft) {
            if (isPairMatch(selectedLeft, rightItem)) {
                const nextMap = { ...matchedMap, [selectedLeft]: rightItem };
                setMatchedMap(nextMap);
                setJustMatchedPair({ left: selectedLeft, right: rightItem });
                setSelectedLeft(null);
                setSelectedRight(null);

                setTimeout(() => setJustMatchedPair(null), 500);

                if (Object.keys(nextMap).length === rawPairs.length) {
                    onSelect(JSON.stringify(nextMap));
                }
            } else {
                setShakingLeft(selectedLeft);
                setShakingRight(rightItem);
                setTimeout(() => {
                    setShakingLeft(null);
                    setShakingRight(null);
                    setSelectedLeft(null);
                    setSelectedRight(null);
                }, 450);
            }
        } else {
            setSelectedRight((prev) => (prev === rightItem ? null : rightItem));
        }
    };

    const matchedCount = Object.keys(matchedMap).length;
    const totalPairs = rawPairs.length;

    return (
        <div className="matching-question-root">
            <header className="matching-prompt-header">
                <h2 className="matching-prompt-title">
                    {question.prompt || "Tap the matching pairs:"}
                </h2>
                <p className="matching-prompt-hint">
                    Select a medication, then tap its look-alike / sound-alike counterpart.
                </p>
            </header>

            <div className="matching-progress-bar">
                <span>Matched Pairs</span>
                <span className="matching-progress-count">
                    {matchedCount} / {totalPairs} Complete
                </span>
            </div>

            <div className="matching-columns-grid">
                {/* Left Column */}
                <div className="matching-column" role="group" aria-label="Primary medications">
                    <span className="matching-col-header">Primary Medication</span>
                    {leftItems.map((item) => {
                        const isMatched = Boolean(matchedMap[item]);
                        const isSelected = selectedLeft === item;
                        const isShaking = shakingLeft === item;
                        const isJustMatched = justMatchedPair?.left === item;

                        let btnClass = "matching-tile-btn";
                        if (isMatched) btnClass += " matched";
                        if (isSelected) btnClass += " selected";
                        if (isShaking) btnClass += " wrong";
                        if (isJustMatched) btnClass += " just-matched";

                        return (
                            <button
                                key={item}
                                type="button"
                                className={btnClass}
                                onClick={() => handleLeftClick(item)}
                                disabled={isSubmitted || isMatched}
                                aria-pressed={isSelected || isMatched}
                            >
                                <TallManText name={item} />
                                <span className="matching-tile-icon">
                                    {isMatched && <Check size={18} className="tile-icon-matched" />}
                                    {isShaking && <X size={18} className="tile-icon-wrong" />}
                                    {!isMatched && !isShaking && isSelected && <Sparkles size={16} />}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Right Column */}
                <div className="matching-column" role="group" aria-label="Confusable counterparts">
                    <span className="matching-col-header">Confused Counterpart</span>
                    {rightItems.map((item) => {
                        const isMatched = Object.values(matchedMap).includes(item);
                        const isSelected = selectedRight === item;
                        const isShaking = shakingRight === item;
                        const isJustMatched = justMatchedPair?.right === item;

                        let btnClass = "matching-tile-btn";
                        if (isMatched) btnClass += " matched";
                        if (isSelected) btnClass += " selected";
                        if (isShaking) btnClass += " wrong";
                        if (isJustMatched) btnClass += " just-matched";

                        return (
                            <button
                                key={item}
                                type="button"
                                className={btnClass}
                                onClick={() => handleRightClick(item)}
                                disabled={isSubmitted || isMatched}
                                aria-pressed={isSelected || isMatched}
                            >
                                <TallManText name={item} />
                                <span className="matching-tile-icon">
                                    {isMatched && <Check size={18} className="tile-icon-matched" />}
                                    {isShaking && <X size={18} className="tile-icon-wrong" />}
                                    {!isMatched && !isShaking && isSelected && <Sparkles size={16} />}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default MatchingQuestion;
