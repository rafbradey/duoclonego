import { useState } from "react";
import { Link } from "react-router";
import {
    Award,
    Target,
    Sparkles,
    BookOpen,
    Trophy,
    ArrowRight,
    Check,
    X,
    ChevronRight,
    Smartphone,
    Tablet,
    Monitor,
    Layers,
    CheckCircle2
} from "lucide-react";
import Mascot from "../../components/Mascot/Mascot.jsx";
import diamondIcon from "../../assets/items/diamond.png";
import heartIcon from "../../assets/items/heart.png";
import "./CompletionPreview.css";

// Realistic completion scenarios
const SCENARIOS = {
    standard: {
        id: "standard",
        name: "Standard Lesson (1 Mistake)",
        type: "lesson",
        title: "Section 1 • Unit 1 • Level 2",
        subtitle: "Hydromorphone vs Morphine, buPROPion vs busPIRone",
        isPractice: false,
        isMastery: false,
        xpEarned: 45,
        gemsEarned: 15,
        heartRestored: false,
        answers: [
            {
                subject: "morphine",
                category: "LASA Pair",
                qType: "multiple_choice",
                isCorrect: true,
                selectedAnswer: "hydromorphone",
                correctAnswer: "hydromorphone",
                explanation: "Morphine and hydromorphone have an 8-fold potency difference; confusing them is a high-risk sentinel error."
            },
            {
                subject: "buPROPion",
                category: "Tall Man Lettering",
                qType: "tall_man",
                isCorrect: true,
                selectedAnswer: "buPROPion",
                correctAnswer: "buPROPion",
                explanation: "buPROPion (Wellbutrin - antidepressant) vs busPIRone (BuSpar - anxiolytic)."
            },
            {
                subject: "HYDROcodone",
                category: "LASA Pair",
                qType: "multiple_choice",
                isCorrect: true,
                selectedAnswer: "oxyCODONE",
                correctAnswer: "oxyCODONE",
                explanation: "Opioid analgesics frequently confused on order entry screens."
            },
            {
                subject: "predniSONE",
                category: "Tall Man Fill-in",
                qType: "tall_man",
                isCorrect: false,
                selectedAnswer: "prednisone",
                correctAnswer: "predniSONE",
                explanation: "FDA Tall Man lettering capitalizes SONE to distinguish from prednisoLONE."
            },
            {
                subject: "vinBLAStine",
                category: "LASA Pair",
                qType: "multiple_choice",
                isCorrect: true,
                selectedAnswer: "vinCRIStine",
                correctAnswer: "vinCRIStine",
                explanation: "Vinca alkaloids with dramatically different maximum single dosage limits."
            },
            {
                subject: "metFORMIN",
                category: "Tap-to-Match",
                qType: "matching",
                isCorrect: true,
                selectedAnswer: "All pairs matched correctly",
                correctAnswer: "metFORMIN ↔ metroNIDAZOLE",
                explanation: "Antidiabetic biguanide vs synthetic nitroimidazole antimicrobial."
            }
        ]
    },
    perfect: {
        id: "perfect",
        name: "Perfect Score (100% Accuracy)",
        type: "lesson",
        title: "Section 1 • Unit 1 • Level 3",
        subtitle: "High-Alert Chemotherapy & Opioids",
        isPractice: false,
        isMastery: false,
        xpEarned: 50,
        gemsEarned: 20,
        heartRestored: false,
        answers: [
            {
                subject: "morphine",
                category: "LASA Pair",
                qType: "multiple_choice",
                isCorrect: true,
                selectedAnswer: "hydromorphone",
                correctAnswer: "hydromorphone",
                explanation: "8-fold potency difference between morphine and hydromorphone."
            },
            {
                subject: "buPROPion",
                category: "Tall Man Lettering",
                qType: "tall_man",
                isCorrect: true,
                selectedAnswer: "buPROPion",
                correctAnswer: "buPROPion",
                explanation: "Antidepressant vs anxiolytic."
            },
            {
                subject: "HYDROcodone",
                category: "LASA Pair",
                qType: "multiple_choice",
                isCorrect: true,
                selectedAnswer: "oxyCODONE",
                correctAnswer: "oxyCODONE",
                explanation: "Frequent oral opioid mix-up."
            },
            {
                subject: "predniSONE",
                category: "Tall Man Fill-in",
                qType: "tall_man",
                isCorrect: true,
                selectedAnswer: "predniSONE",
                correctAnswer: "predniSONE",
                explanation: "Exact Tall Man match verified."
            },
            {
                subject: "vinBLAStine",
                category: "LASA Pair",
                qType: "multiple_choice",
                isCorrect: true,
                selectedAnswer: "vinCRIStine",
                correctAnswer: "vinCRIStine",
                explanation: "Dosage limits prevent fatal neurotoxicity."
            },
            {
                subject: "metFORMIN",
                category: "Tap-to-Match",
                qType: "matching",
                isCorrect: true,
                selectedAnswer: "All pairs matched correctly",
                correctAnswer: "metFORMIN ↔ metroNIDAZOLE",
                explanation: "Antidiabetic vs antibiotic."
            }
        ]
    },
    mastery: {
        id: "mastery",
        name: "Unit Mastery Capstone",
        type: "unit_mastery",
        title: "Unit 1 Capstone Challenge",
        subtitle: "Comprehensive unassisted Tall Man verification",
        isPractice: false,
        isMastery: true,
        xpEarned: 75,
        gemsEarned: 25,
        heartRestored: false,
        unlockedBadge: {
            id: "unit_1_master",
            title: "Unit 1 Master Champion",
            description: "Conquered unassisted orthographic retrieval across all Unit 1 pairs."
        },
        answers: [
            {
                subject: "vinBLAStine",
                category: "Tall Man Mastery",
                qType: "tall_man",
                isCorrect: true,
                selectedAnswer: "vinBLAStine",
                correctAnswer: "vinBLAStine",
                explanation: "Fatal vincristine administration error averted."
            },
            {
                subject: "HYDROxyzine",
                category: "Tall Man Mastery",
                qType: "tall_man",
                isCorrect: true,
                selectedAnswer: "HYDROxyzine",
                correctAnswer: "HYDROxyzine",
                explanation: "Antihistamine vs diuretic."
            },
            {
                subject: "predniSONE",
                category: "Tall Man Mastery",
                qType: "tall_man",
                isCorrect: true,
                selectedAnswer: "predniSONE",
                correctAnswer: "predniSONE",
                explanation: "Systemic corticosteroid retrieved without hint."
            },
            {
                subject: "CISplatin",
                category: "Tall Man Mastery",
                qType: "tall_man",
                isCorrect: true,
                selectedAnswer: "CISplatin",
                correctAnswer: "CISplatin",
                explanation: "Heavy metal platinum compound differentiated from CARBOplatin."
            }
        ]
    },
    practice: {
        id: "practice",
        name: "Practice Session (+1 Heart Restored)",
        type: "practice",
        title: "Practice Hub • Spaced Retrieval",
        subtitle: "Reviewing previously missed LASA pairs",
        isPractice: true,
        isMastery: false,
        xpEarned: 25,
        gemsEarned: 5,
        heartRestored: true,
        answers: [
            {
                subject: "buPROPion",
                category: "SRS Flashcard",
                qType: "multiple_choice",
                isCorrect: true,
                selectedAnswer: "busPIRone",
                correctAnswer: "busPIRone",
                explanation: "Critical look-alike counterpart identification."
            },
            {
                subject: "clonazePAM",
                category: "Tall Man",
                qType: "tall_man",
                isCorrect: true,
                selectedAnswer: "clonazePAM",
                correctAnswer: "clonazePAM",
                explanation: "Benzodiazepine vs antihypertensive clonidine."
            },
            {
                subject: "morphine",
                category: "LASA Pair",
                qType: "multiple_choice",
                isCorrect: true,
                selectedAnswer: "hydromorphone",
                correctAnswer: "hydromorphone",
                explanation: "High potency alert recalled successfully."
            }
        ]
    }
};

export default function CompletionPreview() {
    const [selectedOption, setSelectedOption] = useState("A_PLUS");
    const [selectedScenarioKey, setSelectedScenarioKey] = useState("standard");
    const [deviceWidth, setDeviceWidth] = useState("desktop"); // desktop, tablet, mobile
    const [expandedAccordionItems, setExpandedAccordionItems] = useState({});

    const scenario = SCENARIOS[selectedScenarioKey];
    const totalQuestions = scenario.answers.length;
    const correctCount = scenario.answers.filter((a) => a.isCorrect).length;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    const toggleAccordion = (index) => {
        setExpandedAccordionItems((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const toggleAllAccordion = () => {
        const allOpen = scenario.answers.every((_, i) => expandedAccordionItems[i]);
        if (allOpen) {
            setExpandedAccordionItems({});
        } else {
            const nextState = {};
            scenario.answers.forEach((_, i) => {
                nextState[i] = true;
            });
            setExpandedAccordionItems(nextState);
        }
    };

    const mascotType = accuracy >= 80 ? "maracas" : "default";
    const mascotAnimation = accuracy >= 80 ? "dance" : "bounce";

    return (
        <div className="preview-lab-root">
            {/* Top Concept Switcher Toolbar */}
            <header className="preview-lab-toolbar">
                <div className="preview-lab-toolbar-inner">
                    <div className="preview-brand-block">
                        <span className="preview-badge-pill">UI TEST ENVIRONMENT</span>
                        <h1 className="preview-toolbar-title">Level Completion Overhaul Concepts</h1>
                    </div>

                    <div className="preview-controls-row">
                        {/* Concept Selector */}
                        <div className="preview-button-group" role="group" aria-label="Select Concept">
                            <span className="preview-group-label">Layout:</span>
                            <button
                                type="button"
                                className={`preview-chip-btn ${selectedOption === "A_PLUS" ? "active" : ""} preview-chip-recommended`}
                                onClick={() => setSelectedOption("A_PLUS")}
                            >
                                Option A+ (Minimalist + Option D)
                            </button>
                            <button
                                type="button"
                                className={`preview-chip-btn ${selectedOption === "A" ? "active" : ""}`}
                                onClick={() => setSelectedOption("A")}
                            >
                                Option A: Clean Centered
                            </button>
                            <button
                                type="button"
                                className={`preview-chip-btn ${selectedOption === "B" ? "active" : ""}`}
                                onClick={() => setSelectedOption("B")}
                            >
                                Option B: Spacious Split
                            </button>
                            <button
                                type="button"
                                className={`preview-chip-btn ${selectedOption === "C" ? "active" : ""}`}
                                onClick={() => setSelectedOption("C")}
                            >
                                Option C: Minimal Results
                            </button>
                            <button
                                type="button"
                                className={`preview-chip-btn ${selectedOption === "D" ? "active" : ""}`}
                                onClick={() => setSelectedOption("D")}
                            >
                                Option D: Modern Hero
                            </button>
                        </div>

                        {/* Scenario Selector */}
                        <div className="preview-button-group" role="group" aria-label="Select Scenario">
                            <span className="preview-group-label">Scenario:</span>
                            {Object.values(SCENARIOS).map((s) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    className={`preview-chip-btn ${selectedScenarioKey === s.id ? "active" : ""}`}
                                    onClick={() => setSelectedScenarioKey(s.id)}
                                >
                                    {s.name}
                                </button>
                            ))}
                        </div>

                        {/* Responsive Device Frame Switcher */}
                        <div className="preview-button-group" role="group" aria-label="Device Width">
                            <span className="preview-group-label">Viewport:</span>
                            <button
                                type="button"
                                className={`preview-chip-btn preview-icon-btn ${deviceWidth === "desktop" ? "active" : ""}`}
                                onClick={() => setDeviceWidth("desktop")}
                                title="Desktop (Full Width)"
                            >
                                <Monitor size={15} />
                                <span>Desktop</span>
                            </button>
                            <button
                                type="button"
                                className={`preview-chip-btn preview-icon-btn ${deviceWidth === "tablet" ? "active" : ""}`}
                                onClick={() => setDeviceWidth("tablet")}
                                title="Tablet (768px)"
                            >
                                <Tablet size={15} />
                                <span>Tablet</span>
                            </button>
                            <button
                                type="button"
                                className={`preview-chip-btn preview-icon-btn ${deviceWidth === "mobile" ? "active" : ""}`}
                                onClick={() => setDeviceWidth("mobile")}
                                title="Mobile (390px)"
                            >
                                <Smartphone size={15} />
                                <span>Mobile</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Preview Canvas */}
            <main className="preview-canvas-area">
                <div className={`preview-stage-container device-${deviceWidth}`}>
                    {selectedOption === "A_PLUS" && (
                        <ConceptOptionAPlus
                            scenario={scenario}
                            mascotType={mascotType}
                            mascotAnimation={mascotAnimation}
                            accuracy={accuracy}
                            correctCount={correctCount}
                            totalQuestions={totalQuestions}
                            expandedItems={expandedAccordionItems}
                            toggleItem={toggleAccordion}
                            toggleAll={toggleAllAccordion}
                        />
                    )}

                    {selectedOption === "A" && (
                        <ConceptOptionA
                            scenario={scenario}
                            mascotType={mascotType}
                            mascotAnimation={mascotAnimation}
                            accuracy={accuracy}
                            correctCount={correctCount}
                            totalQuestions={totalQuestions}
                            expandedItems={expandedAccordionItems}
                            toggleItem={toggleAccordion}
                        />
                    )}

                    {selectedOption === "B" && (
                        <ConceptOptionB
                            scenario={scenario}
                            mascotType={mascotType}
                            mascotAnimation={mascotAnimation}
                            accuracy={accuracy}
                            correctCount={correctCount}
                            totalQuestions={totalQuestions}
                            expandedItems={expandedAccordionItems}
                            toggleItem={toggleAccordion}
                        />
                    )}

                    {selectedOption === "C" && (
                        <ConceptOptionC
                            scenario={scenario}
                            mascotType={mascotType}
                            mascotAnimation={mascotAnimation}
                            accuracy={accuracy}
                            correctCount={correctCount}
                            totalQuestions={totalQuestions}
                            expandedItems={expandedAccordionItems}
                            toggleItem={toggleAccordion}
                        />
                    )}

                    {selectedOption === "D" && (
                        <ConceptOptionD
                            scenario={scenario}
                            mascotType={mascotType}
                            mascotAnimation={mascotAnimation}
                            accuracy={accuracy}
                            correctCount={correctCount}
                            totalQuestions={totalQuestions}
                            expandedItems={expandedAccordionItems}
                            toggleItem={toggleAccordion}
                            toggleAll={toggleAllAccordion}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

// -----------------------------------------------------------------------------
// OPTION A+ (Minimalist + Option D Hybrid)
// Blends Option A's clean, airy, centered minimalism with Option D's vibrant
// celebratory feedback, rich reward iconography, and interactive controls.
// -----------------------------------------------------------------------------
function ConceptOptionAPlus({
    scenario,
    mascotType,
    mascotAnimation,
    accuracy,
    correctCount,
    totalQuestions,
    expandedItems,
    toggleItem,
    toggleAll
}) {
    return (
        <div className="concept-wrapper concept-aplus-root">
            <div className="concept-card duo-card concept-aplus-card">
                {/* 1. Ambient Celebratory Mascot Hero (Spacious, No Claustrophobic Box) */}
                <div className="concept-aplus-hero">
                    <div className="concept-aplus-mascot-glow">
                        <Mascot mascotType={mascotType} size={135} animationType={mascotAnimation} />
                    </div>

                    <div className="concept-aplus-header">
                        <div className="concept-badge-tag">
                            <Sparkles size={14} />
                            <span>
                                {scenario.isPractice
                                    ? "PRACTICE COMPLETED"
                                    : scenario.isMastery
                                    ? "🏆 UNIT MASTERED"
                                    : "LEVEL COMPLETED"}
                            </span>
                        </div>
                        <h2 className="concept-aplus-title">
                            {scenario.isMastery
                                ? (accuracy === 100 ? "Mastery Challenge Conquered!" : "Unit Mastered!")
                                : (accuracy === 100 ? "100% Perfect Retention!" : "Great Session!")}
                        </h2>
                        <p className="concept-aplus-subtitle">
                            You completed retrieval training for <strong>{scenario.title}</strong>
                        </p>
                    </div>
                </div>

                {/* 2. Unified Rich Stat Ribbon (Option A's seamless bar + Option D's reward styling) */}
                <div className="concept-aplus-stats-ribbon">
                    <div className="aplus-stat-item xp-accent">
                        <div className="aplus-stat-bubble">
                            <Award size={18} />
                        </div>
                        <div className="aplus-stat-meta">
                            <span className="aplus-stat-val">+{scenario.xpEarned} XP</span>
                            <span className="aplus-stat-lbl">Earned</span>
                        </div>
                    </div>

                    <div className="aplus-stat-divider" />

                    <div className="aplus-stat-item gem-accent">
                        <div className="aplus-stat-bubble">
                            <img src={diamondIcon} alt="Gems" className="stat-gem-img-tiny" />
                        </div>
                        <div className="aplus-stat-meta">
                            <span className="aplus-stat-val">+{scenario.gemsEarned}</span>
                            <span className="aplus-stat-lbl">Gems</span>
                        </div>
                    </div>

                    <div className="aplus-stat-divider" />

                    <div className="aplus-stat-item target-accent">
                        <div className="aplus-stat-bubble">
                            <Target size={18} />
                        </div>
                        <div className="aplus-stat-meta">
                            <span className="aplus-stat-val">{accuracy}%</span>
                            <span className="aplus-stat-lbl">Accuracy</span>
                        </div>
                    </div>
                </div>

                {/* Heart restored notice if practice */}
                {scenario.heartRestored && (
                    <div className="concept-heart-restore-pill">
                        <img src={heartIcon} alt="Heart" className="restore-heart-icon" />
                        <span>+1 Heart Restored via Practice!</span>
                    </div>
                )}

                {/* Unlocked Badge if mastery */}
                {scenario.unlockedBadge && (
                    <div className="concept-unlocked-banner">
                        <Trophy size={20} className="trophy-gold" />
                        <div className="unlocked-text">
                            <strong>{scenario.unlockedBadge.title}</strong>
                            <span>{scenario.unlockedBadge.description}</span>
                        </div>
                    </div>
                )}

                {/* 3. Primary & Secondary Actions (Duolingo 3D Button + Minimal Text Link) */}
                <div className="concept-aplus-actions">
                    <Link to="/learn" className="duo-button duo-button-primary concept-btn-large">
                        <span>CONTINUE TO NEXT LEVEL</span>
                        <ArrowRight size={18} />
                    </Link>
                    <Link to="/learn" className="concept-text-link">
                        Return to Dashboard
                    </Link>
                </div>

                {/* 4. Interactive Review Drawer with Option D's Toggle Details Button */}
                <div className="concept-aplus-review-pane">
                    <div className="review-section-header">
                        <div className="review-header-title-block">
                            <span className="review-title">Session Breakdown</span>
                            <span className="review-count-tag">{correctCount} / {totalQuestions} Correct</span>
                        </div>
                        <button
                            type="button"
                            className="review-expand-all-btn"
                            onClick={toggleAll}
                            title="Toggle all question details"
                        >
                            <Layers size={13} />
                            <span>Toggle Details</span>
                        </button>
                    </div>

                    <div className="review-accordion-list">
                        {scenario.answers.map((ans, idx) => (
                            <AccordionRow
                                key={idx}
                                item={ans}
                                isExpanded={Boolean(expandedItems[idx])}
                                onToggle={() => toggleItem(idx)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// -----------------------------------------------------------------------------
// OPTION A: Clean Centered Celebration
// Authentic Duolingo celebration; centered hero mascot, clear headline, uncluttered
// horizontal stats bar without bulky boxes, prominent primary button, and compact review.
// -----------------------------------------------------------------------------
function ConceptOptionA({
    scenario,
    mascotType,
    mascotAnimation,
    accuracy,
    correctCount,
    totalQuestions,
    expandedItems,
    toggleItem
}) {
    return (
        <div className="concept-wrapper concept-a-root">
            <div className="concept-card duo-card concept-a-card">
                {/* 1. Mascot Celebration */}
                <div className="concept-a-mascot">
                    <Mascot mascotType={mascotType} size={130} animationType={mascotAnimation} />
                </div>

                {/* 2. Completion Status & Heading */}
                <div className="concept-a-header">
                    <div className="concept-badge-tag">
                        <Sparkles size={14} />
                        <span>{scenario.isPractice ? "PRACTICE COMPLETE" : scenario.isMastery ? "🏆 UNIT MASTERED" : "LESSON COMPLETE"}</span>
                    </div>
                    <h2 className="concept-a-title">
                        {scenario.isMastery
                            ? (accuracy === 100 ? "Unit Mastered!" : "Mastery Complete!")
                            : (accuracy === 100 ? "Perfect Recall!" : "Great Practice!")}
                    </h2>
                    <p className="concept-a-subtitle">{scenario.subtitle}</p>
                </div>

                {/* 3. Horizontal Stats Ribbon (No bulky nested boxes) */}
                <div className="concept-a-stats-ribbon">
                    <div className="stat-pill-item">
                        <div className="stat-pill-icon xp-color">
                            <Award size={20} />
                        </div>
                        <div className="stat-pill-content">
                            <span className="stat-pill-val">+{scenario.xpEarned} XP</span>
                            <span className="stat-pill-lbl">Earned</span>
                        </div>
                    </div>

                    <div className="stat-pill-divider" />

                    <div className="stat-pill-item">
                        <div className="stat-pill-icon gem-color">
                            <img src={diamondIcon} alt="Gems" className="stat-gem-img" />
                        </div>
                        <div className="stat-pill-content">
                            <span className="stat-pill-val">+{scenario.gemsEarned}</span>
                            <span className="stat-pill-lbl">Gems</span>
                        </div>
                    </div>

                    <div className="stat-pill-divider" />

                    <div className="stat-pill-item">
                        <div className="stat-pill-icon target-color">
                            <Target size={20} />
                        </div>
                        <div className="stat-pill-content">
                            <span className="stat-pill-val">{accuracy}%</span>
                            <span className="stat-pill-lbl">Accuracy</span>
                        </div>
                    </div>
                </div>

                {/* Heart restored notice if practice */}
                {scenario.heartRestored && (
                    <div className="concept-heart-restore-pill">
                        <img src={heartIcon} alt="Heart" className="restore-heart-icon" />
                        <span>+1 Heart Restored via Practice!</span>
                    </div>
                )}

                {/* Unlocked Badge if mastery */}
                {scenario.unlockedBadge && (
                    <div className="concept-unlocked-banner">
                        <Trophy size={18} className="trophy-gold" />
                        <div className="unlocked-text">
                            <strong>{scenario.unlockedBadge.title}</strong>
                            <span>{scenario.unlockedBadge.description}</span>
                        </div>
                    </div>
                )}

                {/* 4. Primary & Secondary Actions */}
                <div className="concept-a-actions">
                    <Link to="/learn" className="duo-button duo-button-primary concept-btn-large">
                        <span>CONTINUE TO NEXT LEVEL</span>
                        <ArrowRight size={18} />
                    </Link>
                    <Link to="/learn" className="concept-text-link">
                        Return to Dashboard
                    </Link>
                </div>

                {/* 5. Compact Expandable Review Drawer */}
                <div className="concept-a-review-section">
                    <div className="review-section-header">
                        <span className="review-title">Session Review</span>
                        <span className="review-count-tag">{correctCount} / {totalQuestions} Correct</span>
                    </div>

                    <div className="review-accordion-list">
                        {scenario.answers.map((ans, idx) => (
                            <AccordionRow
                                key={idx}
                                item={ans}
                                isExpanded={Boolean(expandedItems[idx])}
                                onToggle={() => toggleItem(idx)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// -----------------------------------------------------------------------------
// OPTION B: Spacious Desktop Split Layout
// Generous 2-column layout designed specifically for desktop viewports.
// Left: Hero celebration & rewards. Right: Elegant session breakdown.
// -----------------------------------------------------------------------------
function ConceptOptionB({
    scenario,
    mascotType,
    mascotAnimation,
    accuracy,
    correctCount,
    totalQuestions,
    expandedItems,
    toggleItem
}) {
    return (
        <div className="concept-wrapper concept-b-root">
            <div className="concept-card duo-card concept-b-card">
                {/* Left Column: Celebration & Progression */}
                <div className="concept-b-left-pane">
                    <div className="concept-b-mascot">
                        <Mascot mascotType={mascotType} size={140} animationType={mascotAnimation} />
                    </div>

                    <div className="concept-badge-tag">
                        <Sparkles size={14} />
                        <span>{scenario.isPractice ? "PRACTICE COMPLETE" : scenario.isMastery ? "🏆 UNIT MASTERED" : "LESSON COMPLETE"}</span>
                    </div>

                    <h2 className="concept-b-title">
                        {scenario.isMastery
                            ? "Unit Mastered!"
                            : (accuracy === 100 ? "Perfect Recall!" : "Great Practice!")}
                    </h2>
                    <p className="concept-b-subtitle">{scenario.subtitle}</p>

                    {/* Stats Trio */}
                    <div className="concept-b-stats-grid">
                        <div className="stat-box">
                            <span className="stat-box-val">+{scenario.xpEarned}</span>
                            <span className="stat-box-lbl">XP</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-box-val">+{scenario.gemsEarned}</span>
                            <span className="stat-box-lbl">Gems</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-box-val">{accuracy}%</span>
                            <span className="stat-box-lbl">Accuracy</span>
                        </div>
                    </div>

                    {scenario.heartRestored && (
                        <div className="concept-heart-restore-pill">
                            <img src={heartIcon} alt="Heart" className="restore-heart-icon" />
                            <span>+1 Heart Restored</span>
                        </div>
                    )}

                    <div className="concept-b-actions">
                        <Link to="/learn" className="duo-button duo-button-primary concept-btn-large">
                            <span>CONTINUE TO NEXT LEVEL</span>
                            <ArrowRight size={18} />
                        </Link>
                        <Link to="/learn" className="duo-button duo-button-outline concept-btn-subtle">
                            <BookOpen size={16} />
                            <span>Dashboard</span>
                        </Link>
                    </div>
                </div>

                {/* Right Column: Spacious Session Breakdown */}
                <div className="concept-b-right-pane">
                    <div className="review-section-header">
                        <div>
                            <h3 className="review-title-heading">Session Breakdown</h3>
                            <p className="review-title-sub">Expand questions for dosage and clinical rationale</p>
                        </div>
                        <span className="review-count-tag">{correctCount} / {totalQuestions} Correct</span>
                    </div>

                    <div className="review-accordion-list">
                        {scenario.answers.map((ans, idx) => (
                            <AccordionRow
                                key={idx}
                                item={ans}
                                isExpanded={Boolean(expandedItems[idx])}
                                onToggle={() => toggleItem(idx)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// -----------------------------------------------------------------------------
// OPTION C: Minimal Results + Floating Action
// Ultra-clean, distraction-free. Big celebratory mascot + accuracy ring,
// minimal stat pills, sticky bottom progression bar, expandable drawer for review.
// -----------------------------------------------------------------------------
function ConceptOptionC({
    scenario,
    mascotType,
    mascotAnimation,
    accuracy,
    correctCount,
    totalQuestions,
    expandedItems,
    toggleItem
}) {
    const [reviewOpen, setReviewOpen] = useState(false);

    return (
        <div className="concept-wrapper concept-c-root">
            <div className="concept-card duo-card concept-c-card">
                <div className="concept-c-hero">
                    <Mascot mascotType={mascotType} size={140} animationType={mascotAnimation} />
                </div>

                <div className="concept-c-body">
                    <h2 className="concept-c-title">
                        {accuracy === 100 ? "Flawless Performance!" : "Level Finished!"}
                    </h2>
                    <p className="concept-c-subtitle">You practiced critical LASA pairs in {scenario.title}</p>

                    {/* Clean Chips Row */}
                    <div className="concept-c-chips-row">
                        <span className="concept-c-chip xp-chip">
                            <Award size={15} /> +{scenario.xpEarned} XP
                        </span>
                        <span className="concept-c-chip gem-chip">
                            <img src={diamondIcon} alt="Gems" className="stat-gem-img-tiny" /> +{scenario.gemsEarned}
                        </span>
                        <span className="concept-c-chip acc-chip">
                            <CheckCircle2 size={15} /> {accuracy}% Accuracy
                        </span>
                    </div>

                    {scenario.heartRestored && (
                        <div className="concept-heart-restore-pill">
                            <img src={heartIcon} alt="Heart" className="restore-heart-icon" />
                            <span>+1 Heart Restored via Practice!</span>
                        </div>
                    )}

                    {/* Expandable Review Toggle */}
                    <div className="concept-c-review-toggle-wrap">
                        <button
                            type="button"
                            className="concept-c-toggle-btn"
                            onClick={() => setReviewOpen((prev) => !prev)}
                        >
                            <ChevronRight size={16} className={`toggle-arrow ${reviewOpen ? "open" : ""}`} />
                            <span>Review Session ({correctCount}/{totalQuestions} Correct)</span>
                        </button>

                        {reviewOpen && (
                            <div className="concept-c-review-drawer">
                                <div className="review-accordion-list">
                                    {scenario.answers.map((ans, idx) => (
                                        <AccordionRow
                                            key={idx}
                                            item={ans}
                                            isExpanded={Boolean(expandedItems[idx])}
                                            onToggle={() => toggleItem(idx)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Primary Button */}
                    <div className="concept-c-actions">
                        <Link to="/learn" className="duo-button duo-button-primary concept-btn-large">
                            <span>CONTINUE</span>
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// -----------------------------------------------------------------------------
// OPTION D: Modern Hero Ribbon (Antigravity Recommended)
// Combines the best of Duolingo's celebratory feedback with clinical clarity.
// Horizontal hero banner, sparkling rewards pill group, prominent single CTA,
// and accessible accordion review with an "Expand All" toggle.
// -----------------------------------------------------------------------------
function ConceptOptionD({
    scenario,
    mascotType,
    mascotAnimation,
    accuracy,
    correctCount,
    totalQuestions,
    expandedItems,
    toggleItem,
    toggleAll
}) {
    return (
        <div className="concept-wrapper concept-d-root">
            <div className="concept-card duo-card concept-d-card">
                {/* 1. Top Hero Ribbon */}
                <div className="concept-d-hero-banner">
                    <div className="concept-d-mascot-col">
                        <Mascot mascotType={mascotType} size={120} animationType={mascotAnimation} />
                    </div>
                    <div className="concept-d-hero-text">
                        <div className="concept-badge-tag">
                            <Sparkles size={14} />
                            <span>{scenario.isPractice ? "PRACTICE COMPLETED" : scenario.isMastery ? "🏆 UNIT MASTERED" : "LEVEL COMPLETED"}</span>
                        </div>
                        <h2 className="concept-d-title">
                            {scenario.isMastery
                                ? "Mastery Challenge Conquered!"
                                : (accuracy === 100 ? "100% Perfect Retention!" : "Great Session!")}
                        </h2>
                        <p className="concept-d-subtitle">
                            You successfully completed retrieval training for <strong>{scenario.title}</strong>.
                        </p>
                    </div>
                </div>

                {/* 2. Rewards Ribbon */}
                <div className="concept-d-rewards-bar">
                    <div className="reward-chip xp-accent">
                        <div className="reward-icon-bubble">
                            <Award size={20} />
                        </div>
                        <div className="reward-meta">
                            <span className="reward-val">+{scenario.xpEarned} XP</span>
                            <span className="reward-lbl">Total Experience</span>
                        </div>
                    </div>

                    <div className="reward-chip gem-accent">
                        <div className="reward-icon-bubble">
                            <img src={diamondIcon} alt="Gems" className="stat-gem-img" />
                        </div>
                        <div className="reward-meta">
                            <span className="reward-val">+{scenario.gemsEarned} Gems</span>
                            <span className="reward-lbl">Added to Balance</span>
                        </div>
                    </div>

                    <div className="reward-chip target-accent">
                        <div className="reward-icon-bubble">
                            <Target size={20} />
                        </div>
                        <div className="reward-meta">
                            <span className="reward-val">{accuracy}%</span>
                            <span className="reward-lbl">Accuracy</span>
                        </div>
                    </div>
                </div>

                {/* Heart restored badge if applicable */}
                {scenario.heartRestored && (
                    <div className="concept-heart-restore-pill">
                        <img src={heartIcon} alt="Heart" className="restore-heart-icon" />
                        <span>+1 Heart Restored via Practice Hub!</span>
                    </div>
                )}

                {/* Unlocked Badge */}
                {scenario.unlockedBadge && (
                    <div className="concept-unlocked-banner">
                        <Trophy size={20} className="trophy-gold" />
                        <div className="unlocked-text">
                            <strong>{scenario.unlockedBadge.title}</strong>
                            <span>{scenario.unlockedBadge.description}</span>
                        </div>
                    </div>
                )}

                {/* 3. Primary Action Buttons */}
                <div className="concept-d-cta-row">
                    <Link to="/learn" className="duo-button duo-button-primary concept-btn-large">
                        <span>CONTINUE TO NEXT LEVEL</span>
                        <ArrowRight size={18} />
                    </Link>
                    <Link to="/learn" className="duo-button duo-button-outline concept-btn-secondary">
                        <BookOpen size={16} />
                        <span>DASHBOARD</span>
                    </Link>
                </div>

                {/* 4. Secondary Session Breakdown Drawer */}
                <div className="concept-d-review-pane">
                    <div className="review-section-header">
                        <div className="review-header-title-block">
                            <span className="review-title">Session Breakdown</span>
                            <span className="review-count-tag">{correctCount} / {totalQuestions} Correct</span>
                        </div>
                        <button
                            type="button"
                            className="review-expand-all-btn"
                            onClick={toggleAll}
                        >
                            <Layers size={13} />
                            <span>Toggle Details</span>
                        </button>
                    </div>

                    <div className="review-accordion-list">
                        {scenario.answers.map((ans, idx) => (
                            <AccordionRow
                                key={idx}
                                item={ans}
                                isExpanded={Boolean(expandedItems[idx])}
                                onToggle={() => toggleItem(idx)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// -----------------------------------------------------------------------------
// Shared Accessible Accordion Row Component
// -----------------------------------------------------------------------------
function AccordionRow({ item, isExpanded, onToggle }) {
    const isCorrect = item.isCorrect;

    return (
        <div className={`accordion-item-wrap ${isCorrect ? "item-correct" : "item-incorrect"}`}>
            <button
                type="button"
                className="accordion-trigger-row"
                onClick={onToggle}
                aria-expanded={isExpanded}
            >
                <div className="accordion-left-meta">
                    <ChevronRight
                        size={16}
                        className={`accordion-chevron-icon ${isExpanded ? "open" : ""}`}
                    />
                    <span className="accordion-subject-text">{item.subject}</span>
                    <span className="accordion-category-badge">{item.category}</span>
                </div>
                <div className="accordion-right-meta">
                    <span className={`status-pill ${isCorrect ? "status-correct" : "status-incorrect"}`}>
                        {isCorrect ? (
                            <>
                                <Check size={12} strokeWidth={3} />
                                <span>CORRECT</span>
                            </>
                        ) : (
                            <>
                                <X size={12} strokeWidth={3} />
                                <span>INCORRECT</span>
                            </>
                        )}
                    </span>
                </div>
            </button>

            {isExpanded && (
                <div className="accordion-detail-drawer">
                    <div className="detail-answer-box">
                        <div className={`detail-line ${isCorrect ? "line-correct" : "line-incorrect"}`}>
                            <span className="detail-lbl">Your answer:</span>
                            <div className="detail-val-group">
                                <span className={`detail-val ${!isCorrect ? "val-struck" : ""}`}>{item.selectedAnswer}</span>
                                {isCorrect ? (
                                    <Check size={14} className="icon-check-green" />
                                ) : (
                                    <X size={14} className="icon-cross-red" />
                                )}
                            </div>
                        </div>

                        {!isCorrect && (
                            <div className="detail-line line-solution">
                                <span className="detail-lbl">Correct answer:</span>
                                <div className="detail-val-group">
                                    <span className="detail-val val-highlight">{item.correctAnswer}</span>
                                    <Check size={14} className="icon-check-green" />
                                </div>
                            </div>
                        )}

                        {item.explanation && (
                            <div className="detail-explanation-card">
                                <span className="explanation-badge">Clinical Rationale:</span>
                                <p className="explanation-body">{item.explanation}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
