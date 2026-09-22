import { useState } from "react";
import { useSearchParams } from "react-router";
import {

    Palette,
    Monitor,
    Tablet,
    Smartphone,
    Layout,
    MapPin,
    HelpCircle,
    ShoppingBag,
    Award,
    Sparkles,
    Check,
    Lock,
    Heart,
    Flame,
    ArrowRight,
    Trophy,
    Shield,
    BookOpen,
    Eye,
    CheckCircle2
} from "lucide-react";
import Mascot from "../../components/Mascot/Mascot.jsx";
import { THEMES_CATALOG, THEME_RARITIES } from "../../data/themes.js";
import diamondIcon from "../../assets/items/diamond.png";
import heartIcon from "../../assets/items/heart.png";
import streakIcon from "../../assets/items/fire_streak.png";
import "./ThemePreview.css";

export default function ThemePreview() {
    const [searchParams] = useSearchParams();
    const queryTheme = searchParams.get("theme");
    const [selectedThemeId, setSelectedThemeId] = useState(queryTheme || "forest_explorer");

    const [selectedRarityFilter, setSelectedRarityFilter] = useState("all");
    const [activeTab, setActiveTab] = useState("shell"); // shell, path, question, shop, rewards
    const [deviceWidth, setDeviceWidth] = useState("desktop"); // desktop, tablet, mobile

    // Mock interactive states
    const [selectedAnswer, setSelectedAnswer] = useState("buPROPion");
    const [isQuestionChecked, setIsQuestionChecked] = useState(true);
    const [previewEquippedTheme, setPreviewEquippedTheme] = useState("forest_explorer");
    const [mockOwnedThemes, setMockOwnedThemes] = useState(["forest_explorer", "cloud_nine"]);

    const activeTheme = THEMES_CATALOG.find((t) => t.id === selectedThemeId) || THEMES_CATALOG[0];

    const filteredThemes = selectedRarityFilter === "all"
        ? THEMES_CATALOG
        : THEMES_CATALOG.filter((t) => t.rarity.id === selectedRarityFilter);

    return (
        <div className="theme-lab-root">
            {/* Top Toolbar */}
            <header className="theme-lab-toolbar">
                <div className="theme-lab-toolbar-inner">
                    <div className="theme-lab-brand-row">
                        <div className="theme-lab-brand-badge">
                            <Palette size={16} />
                            <span>THEME TEST LAB</span>
                        </div>
                        <h1 className="theme-lab-title">Item Shop Themes & Customization System</h1>
                        <span className="theme-lab-subtitle">Isolated preview environment for all 15 initial site themes</span>
                    </div>

                    {/* Viewport and Preview Surface Switchers */}
                    <div className="theme-lab-controls-row">
                        {/* Surface Navigation Tabs */}
                        <div className="theme-tab-group" role="tablist" aria-label="Preview Surface">
                            <span className="theme-control-label">Surface:</span>
                            <button
                                type="button"
                                className={`theme-tab-btn ${activeTab === "shell" ? "active" : ""}`}
                                onClick={() => setActiveTab("shell")}
                            >
                                <Layout size={14} />
                                <span>App Shell</span>
                            </button>
                            <button
                                type="button"
                                className={`theme-tab-btn ${activeTab === "path" ? "active" : ""}`}
                                onClick={() => setActiveTab("path")}
                            >
                                <MapPin size={14} />
                                <span>Learning Path</span>
                            </button>
                            <button
                                type="button"
                                className={`theme-tab-btn ${activeTab === "question" ? "active" : ""}`}
                                onClick={() => setActiveTab("question")}
                            >
                                <HelpCircle size={14} />
                                <span>Question UI</span>
                            </button>
                            <button
                                type="button"
                                className={`theme-tab-btn ${activeTab === "shop" ? "active" : ""}`}
                                onClick={() => setActiveTab("shop")}
                            >
                                <ShoppingBag size={14} />
                                <span>Item Shop</span>
                            </button>
                            <button
                                type="button"
                                className={`theme-tab-btn ${activeTab === "rewards" ? "active" : ""}`}
                                onClick={() => setActiveTab("rewards")}
                            >
                                <Award size={14} />
                                <span>Badges & Level End</span>
                            </button>
                        </div>

                        {/* Viewport Width Frame Switcher */}
                        <div className="theme-tab-group" role="group" aria-label="Device Viewport">
                            <span className="theme-control-label">Viewport:</span>
                            <button
                                type="button"
                                className={`theme-tab-btn ${deviceWidth === "desktop" ? "active" : ""}`}
                                onClick={() => setDeviceWidth("desktop")}
                                title="Desktop (Full Width)"
                            >
                                <Monitor size={14} />
                                <span>Desktop</span>
                            </button>
                            <button
                                type="button"
                                className={`theme-tab-btn ${deviceWidth === "tablet" ? "active" : ""}`}
                                onClick={() => setDeviceWidth("tablet")}
                                title="Tablet (768px)"
                            >
                                <Tablet size={14} />
                                <span>Tablet</span>
                            </button>
                            <button
                                type="button"
                                className={`theme-tab-btn ${deviceWidth === "mobile" ? "active" : ""}`}
                                onClick={() => setDeviceWidth("mobile")}
                                title="Mobile (390px)"
                            >
                                <Smartphone size={14} />
                                <span>Mobile</span>
                            </button>
                        </div>
                    </div>

                    {/* Rarity Filter & Theme Selection Carousel / Grid */}
                    <div className="theme-picker-container">
                        <div className="theme-rarity-filter-row">
                            <span className="theme-control-label">Rarity Tier:</span>
                            <button
                                type="button"
                                className={`rarity-filter-btn ${selectedRarityFilter === "all" ? "active" : ""}`}
                                onClick={() => setSelectedRarityFilter("all")}
                            >
                                All (15)
                            </button>
                            {Object.values(THEME_RARITIES).map((rarity) => (
                                <button
                                    key={rarity.id}
                                    type="button"
                                    className={`rarity-filter-btn ${selectedRarityFilter === rarity.id ? "active" : ""}`}
                                    onClick={() => setSelectedRarityFilter(rarity.id)}
                                >
                                    <span className="rarity-dot" style={{ backgroundColor: rarity.color }} />
                                    <span>{rarity.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Horizontal Theme Scroll Chips */}
                        <div className="theme-chips-scroller" role="group" aria-label="Select Theme">
                            {filteredThemes.map((theme) => {
                                const isSelected = selectedThemeId === theme.id;
                                return (
                                    <button
                                        key={theme.id}
                                        type="button"
                                        className={`theme-chip ${isSelected ? "selected" : ""}`}
                                        onClick={() => setSelectedThemeId(theme.id)}
                                    >
                                        <div className="theme-chip-swatches">
                                            <span style={{ backgroundColor: theme.previewColors.bgPage }} />
                                            <span style={{ backgroundColor: theme.previewColors.bgSurface }} />
                                            <span style={{ backgroundColor: theme.previewColors.primary }} />
                                        </div>
                                        <div className="theme-chip-meta">
                                            <span className="theme-chip-name">{theme.name}</span>
                                            <span className="theme-chip-cost">
                                                <img src={diamondIcon} alt="" className="diamond-icon-tiny" />
                                                {theme.cost}
                                            </span>
                                        </div>
                                        {isSelected && <Check size={14} className="theme-chip-check" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </header>

            {/* Active Theme Meta Banner */}
            <section className="theme-meta-bar">
                <div className="theme-meta-inner">
                    <div className="theme-meta-left">
                        <div className="theme-title-group">
                            <h2 className="theme-active-title">{activeTheme.name}</h2>
                            <span className={`theme-rarity-pill ${activeTheme.rarity.badgeClass}`}>
                                {activeTheme.rarity.label.toUpperCase()}
                            </span>
                            <span className="theme-price-tag">
                                <img src={diamondIcon} alt="Diamonds" className="diamond-icon-small" />
                                <strong>{activeTheme.cost}</strong> Diamonds
                            </span>
                        </div>
                        <p className="theme-active-desc">{activeTheme.description}</p>
                    </div>

                    {/* Palette Swatch Bar */}
                    <div className="theme-palette-swatch-box">
                        <span className="palette-label">Palette Tokens:</span>
                        <div className="swatches-row">
                            <div className="swatch-item" title={`Page BG: ${activeTheme.previewColors.bgPage}`}>
                                <span className="swatch-circle" style={{ backgroundColor: activeTheme.previewColors.bgPage }} />
                                <span className="swatch-name">Page</span>
                            </div>
                            <div className="swatch-item" title={`Surface: ${activeTheme.previewColors.bgSurface}`}>
                                <span className="swatch-circle" style={{ backgroundColor: activeTheme.previewColors.bgSurface }} />
                                <span className="swatch-name">Surface</span>
                            </div>
                            <div className="swatch-item" title={`Primary: ${activeTheme.previewColors.primary}`}>
                                <span className="swatch-circle" style={{ backgroundColor: activeTheme.previewColors.primary }} />
                                <span className="swatch-name">Primary</span>
                            </div>
                            <div className="swatch-item" title={`Secondary: ${activeTheme.previewColors.secondary}`}>
                                <span className="swatch-circle" style={{ backgroundColor: activeTheme.previewColors.secondary }} />
                                <span className="swatch-name">Secondary</span>
                            </div>
                            <div className="swatch-item" title={`Text: ${activeTheme.previewColors.text}`}>
                                <span className="swatch-circle" style={{ backgroundColor: activeTheme.previewColors.text }} />
                                <span className="swatch-name">Text</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Interactive Preview Canvas */}
            <main className="theme-canvas-area">
                <div
                    className={`theme-stage-frame device-${deviceWidth}`}
                    data-theme={activeTheme.id}
                >
                    <div className="theme-atmosphere-layer" />

                    {/* Surface 1: App Shell & Sidebar */}
                    {activeTab === "shell" && (
                        <PreviewAppShell
                            theme={activeTheme}
                            isMobile={deviceWidth === "mobile"}
                        />
                    )}

                    {/* Surface 2: Learning Path */}
                    {activeTab === "path" && (
                        <PreviewLearningPath
                            theme={activeTheme}
                            isMobile={deviceWidth === "mobile"}
                        />
                    )}

                    {/* Surface 3: Question & Tall Man UI */}
                    {activeTab === "question" && (
                        <PreviewQuestionUI
                            theme={activeTheme}
                            selectedAnswer={selectedAnswer}
                            onSelectAnswer={setSelectedAnswer}
                            isQuestionChecked={isQuestionChecked}
                            onToggleChecked={() => setIsQuestionChecked((prev) => !prev)}
                        />
                    )}

                    {/* Surface 4: Item Shop with Theme Customization Shelf */}
                    {activeTab === "shop" && (
                        <PreviewItemShop
                            activeTheme={activeTheme}
                            onSelectTheme={setSelectedThemeId}
                            previewEquippedTheme={previewEquippedTheme}
                            onEquipTheme={setPreviewEquippedTheme}
                            ownedThemes={mockOwnedThemes}
                            onBuyTheme={(themeId) => setMockOwnedThemes((prev) => [...prev, themeId])}
                        />
                    )}

                    {/* Surface 5: Badges & Rewards */}
                    {activeTab === "rewards" && (
                        <PreviewBadgesAndRewards
                            theme={activeTheme}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

// =============================================================================
// SUB-SURFACE 1: APP SHELL & SIDEBAR PREVIEW
// =============================================================================
function PreviewAppShell({ theme, isMobile }) {
    return (
        <div className="preview-shell-container">
            {/* Mock Sidebar (Desktop) */}
            {!isMobile && (
                <aside className="preview-mock-sidebar">
                    <div className="mock-sidebar-brand">
                        <Mascot mascotType="shadow" size={32} />
                        <span className="mock-brand-text">duoclongo</span>
                    </div>

                    <nav className="mock-sidebar-nav">
                        <div className="mock-nav-item active">
                            <BookOpen size={18} />
                            <span>LEARN</span>
                        </div>
                        <div className="mock-nav-item">
                            <MapPin size={18} />
                            <span>PRACTICE</span>
                        </div>
                        <div className="mock-nav-item">
                            <Trophy size={18} />
                            <span>LEADERBOARDS</span>
                        </div>
                        <div className="mock-nav-item">
                            <Award size={18} />
                            <span>QUESTS</span>
                        </div>
                        <div className="mock-nav-item">
                            <ShoppingBag size={18} />
                            <span>SHOP</span>
                        </div>
                    </nav>

                    <div className="mock-sidebar-footer">
                        <div className="mock-theme-indicator">
                            <Palette size={14} />
                            <span>{theme.name}</span>
                        </div>
                    </div>
                </aside>
            )}

            {/* Main Content Area */}
            <div className="preview-shell-main">
                {/* Header Stats Bar */}
                <header className="preview-mock-header">
                    <div className="mock-header-user">
                        <span className="mock-user-title">Curriculum Unit 1</span>
                    </div>
                    <div className="mock-stats-group">
                        <div className="mock-stat-pill streak">
                            <Flame size={16} className="flame-icon" />
                            <span>7</span>
                        </div>
                        <div className="mock-stat-pill gems">
                            <img src={diamondIcon} alt="" className="diamond-icon-tiny" />
                            <span>1,450</span>
                        </div>
                        <div className="mock-stat-pill hearts">
                            <Heart size={16} className="heart-icon" />
                            <span>5 / 5</span>
                        </div>
                    </div>
                </header>

                {/* Hero Card */}
                <div className="preview-mock-body">
                    <div className="preview-welcome-card duo-card">
                        <div className="welcome-card-content">
                            <div className="welcome-badge">
                                <Sparkles size={14} />
                                <span>{theme.name.toUpperCase()} THEME ACTIVE</span>
                            </div>
                            <h2 className="welcome-title">Ready for your retrieval practice?</h2>
                            <p className="welcome-sub">
                                Differentiating look-alike, sound-alike (LASA) medications with verified FDA Tall Man capitalization.
                            </p>
                            <div className="welcome-actions">
                                <button type="button" className="duo-button duo-button-primary">
                                    <span>CONTINUE LEARNING</span>
                                    <ArrowRight size={16} />
                                </button>
                                <button type="button" className="duo-button duo-button-outline">
                                    <span>PRACTICE HUB</span>
                                </button>
                            </div>
                        </div>
                        <div className="welcome-mascot-box">
                            <Mascot mascotType="default" size={120} animationType="bounce" />
                        </div>
                    </div>

                    {/* Stats Trio Cards */}
                    <div className="preview-stats-trio">
                        <div className="preview-stat-card duo-card">
                            <span className="stat-card-label">Weekly XP</span>
                            <span className="stat-card-value">1,280</span>
                            <span className="stat-card-trend">+14% vs last week</span>
                        </div>
                        <div className="preview-stat-card duo-card">
                            <span className="stat-card-label">Pairs Mastered</span>
                            <span className="stat-card-value">42 / 50</span>
                            <span className="stat-card-trend">84% Retention</span>
                        </div>
                        <div className="preview-stat-card duo-card">
                            <span className="stat-card-label">Accuracy Rate</span>
                            <span className="stat-card-value">96%</span>
                            <span className="stat-card-trend">Flawless streak</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// SUB-SURFACE 2: LEARNING PATH PREVIEW
// =============================================================================
function PreviewLearningPath() {
    return (
        <div className="preview-path-container">
            {/* Unit Header Banner */}
            <div className="preview-unit-header duo-card">
                <div className="unit-header-meta">
                    <span className="unit-number-tag">SECTION 1 • UNIT 1</span>
                    <h2 className="unit-heading">Cardiovascular & Endocrine Look-Alikes</h2>
                    <p className="unit-desc">
                        Prevent sentinel mix-ups between hydrALAZINE vs hydrOXYzine and metFORMIN vs metroNIDAZOLE.
                    </p>
                </div>
                <div className="unit-guidebook-btn-box">
                    <button type="button" className="duo-button duo-button-outline">
                        <BookOpen size={16} />
                        <span>GUIDEBOOK</span>
                    </button>
                </div>
            </div>

            {/* Stepper Level Nodes */}
            <div className="preview-nodes-stepper">
                {/* Node 1: Completed */}
                <div className="mock-path-node-wrap">
                    <button type="button" className="mock-node-circle node-completed" title="Level 1: Completed">
                        <Check size={26} strokeWidth={3.5} />
                    </button>
                    <span className="mock-node-label">Level 1: Basics</span>
                </div>

                <div className="mock-node-connector completed" />

                {/* Node 2: Active / Current */}
                <div className="mock-path-node-wrap node-current-wrap">
                    <button type="button" className="mock-node-circle node-current" title="Level 2: Start Now">
                        <Sparkles size={28} />
                    </button>
                    <div className="node-current-speech-bubble">
                        <span>START HERE!</span>
                    </div>
                    <span className="mock-node-label font-bold">Level 2: Opioids</span>
                </div>

                <div className="mock-node-connector" />

                {/* Node 3: Locked */}
                <div className="mock-path-node-wrap">
                    <button type="button" className="mock-node-circle node-locked" title="Level 3: Locked">
                        <Lock size={22} />
                    </button>
                    <span className="mock-node-label text-muted">Level 3: Chemotherapy</span>
                </div>

                <div className="mock-node-connector" />

                {/* Node 4: Unit Mastery Trophy */}
                <div className="mock-path-node-wrap">
                    <button type="button" className="mock-node-circle node-mastery" title="Unit Mastery Challenge">
                        <Trophy size={26} />
                    </button>
                    <span className="mock-node-label text-gold">Unit 1 Capstone</span>
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// SUB-SURFACE 3: QUESTION & TALL MAN UI PREVIEW
// =============================================================================
function PreviewQuestionUI({
    selectedAnswer,
    onSelectAnswer,
    isQuestionChecked,
    onToggleChecked
}) {
    const options = [
        { id: "buPROPion", text: "buPROPion", label: "Antidepressant (Wellbutrin) — 450 mg/day max" },
        { id: "busPIRone", text: "busPIRone", label: "Anxiolytic (BuSpar) — 60 mg/day max" },
        { id: "bupropion", text: "bupropion (No Tall Man)", label: "Unstandardized lowercase lettering" }
    ];

    return (
        <div className="preview-question-container">
            <div className="preview-question-card duo-card">
                {/* Progress Header */}
                <div className="question-mock-progress-bar">
                    <div className="progress-fill" style={{ width: "65%" }} />
                </div>

                {/* Question Prompt */}
                <div className="question-prompt-block">
                    <span className="question-category-pill">FDA TALL MAN LETTERING</span>
                    <h2 className="question-title">
                        Which lettering format distinguishes this antidepressant from its anxiolytic counterpart?
                    </h2>
                    <p className="question-sub">
                        Target medication: <strong>Wellbutrin (Major Depressive Disorder)</strong>
                    </p>
                </div>

                {/* Interactive Radio Options */}
                <div className="question-choices-list">
                    {options.map((opt) => {
                        const isSelected = selectedAnswer === opt.id;
                        const isCorrect = opt.id === "buPROPion";

                        let optionClass = "question-choice-btn";
                        if (isSelected) optionClass += " selected";
                        if (isQuestionChecked && isSelected) {
                            optionClass += isCorrect ? " verified-correct" : " verified-incorrect";
                        }

                        return (
                            <button
                                key={opt.id}
                                type="button"
                                className={optionClass}
                                onClick={() => onSelectAnswer(opt.id)}
                            >
                                <div className="choice-indicator-circle">
                                    {isSelected && <span className="choice-dot-inner" />}
                                </div>
                                <div className="choice-text-col">
                                    <span className="choice-drug-name">{opt.text}</span>
                                    <span className="choice-drug-meta">{opt.label}</span>
                                </div>
                                {isQuestionChecked && isSelected && isCorrect && (
                                    <CheckCircle2 size={20} className="choice-feedback-icon correct" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Bottom Evaluation Drawer */}
                {isQuestionChecked && (
                    <div className="question-feedback-drawer drawer-correct">
                        <div className="feedback-drawer-inner">
                            <div className="feedback-icon-title">
                                <CheckCircle2 size={24} className="feedback-check-icon" />
                                <div className="feedback-text-block">
                                    <span className="feedback-heading">Excellent Clinical Precision!</span>
                                    <p className="feedback-body">
                                        FDA designates <strong>buPROPion</strong> (Wellbutrin) with capital <strong>PROP</strong> to avoid disastrous confusion with <strong>busPIRone</strong> (BuSpar).
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="duo-button duo-button-primary feedback-continue-btn"
                                onClick={onToggleChecked}
                            >
                                <span>CONTINUE</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Primary Action Button (when not checked) */}
                {!isQuestionChecked && (
                    <div className="question-bottom-actions">
                        <button
                            type="button"
                            className="duo-button duo-button-primary check-answer-btn"
                            onClick={onToggleChecked}
                        >
                            <span>CHECK ANSWER</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// =============================================================================
// SUB-SURFACE 4: ITEM SHOP & THEME CARDS PREVIEW
// =============================================================================
function PreviewItemShop({
    activeTheme,
    onSelectTheme,
    previewEquippedTheme,
    onEquipTheme,
    ownedThemes,
    onBuyTheme
}) {
    return (
        <div className="preview-shop-container">
            {/* Shop Header */}
            <div className="shop-preview-header">
                <div>
                    <h2 className="shop-preview-title">Item Shop</h2>
                    <p className="shop-preview-sub">Spend earned gems on powerful boosts and collectible site themes.</p>
                </div>
                <div className="shop-preview-gem-balance">
                    <img src={diamondIcon} alt="Gems" className="diamond-icon-med" />
                    <div className="gem-balance-meta">
                        <span className="gem-num">1,450</span>
                        <span className="gem-label">Diamonds Available</span>
                    </div>
                </div>
            </div>

            {/* Shelf 1: Customizations -> Site Themes */}
            <div className="shop-shelf-section">
                <div className="shelf-header">
                    <div className="shelf-title-box">
                        <Palette size={20} className="shelf-icon" />
                        <h3 className="shelf-heading">Customizations → Site Themes</h3>
                    </div>
                    <span className="shelf-count-tag">15 Collectible Themes</span>
                </div>

                <div className="shop-theme-cards-grid">
                    {THEMES_CATALOG.slice(0, 6).map((theme) => {
                        const isEquipped = previewEquippedTheme === theme.id;
                        const isOwned = ownedThemes.includes(theme.id);
                        const isCurrentPreview = activeTheme.id === theme.id;

                        return (
                            <div
                                key={theme.id}
                                className={`shop-theme-card duo-card ${isCurrentPreview ? "active-preview" : ""}`}
                            >
                                {/* Palette Swatch Stripe */}
                                <div className="theme-card-banner" style={{ background: theme.atmosphere }}>
                                    <div className="theme-card-swatches">
                                        <span style={{ backgroundColor: theme.previewColors.bgPage }} />
                                        <span style={{ backgroundColor: theme.previewColors.bgSurface }} />
                                        <span style={{ backgroundColor: theme.previewColors.primary }} />
                                        <span style={{ backgroundColor: theme.previewColors.secondary }} />
                                    </div>
                                    <span className={`theme-rarity-badge ${theme.rarity.badgeClass}`}>
                                        {theme.rarity.label}
                                    </span>
                                </div>

                                <div className="theme-card-body">
                                    <div className="theme-card-title-row">
                                        <h4 className="theme-card-title">{theme.name}</h4>
                                        <span className="theme-card-price">
                                            <img src={diamondIcon} alt="" className="diamond-icon-tiny" />
                                            {theme.cost}
                                        </span>
                                    </div>

                                    <p className="theme-card-tagline">{theme.tagline}</p>

                                    {/* Action Buttons: Preview + Buy/Equip */}
                                    <div className="theme-card-actions">
                                        <button
                                            type="button"
                                            className={`duo-button duo-button-outline theme-preview-btn ${isCurrentPreview ? "previewing" : ""}`}
                                            onClick={() => onSelectTheme(theme.id)}
                                            title="Preview this theme in the lab"
                                        >
                                            <Eye size={14} />
                                            <span>{isCurrentPreview ? "PREVIEWING" : "PREVIEW"}</span>
                                        </button>

                                        {isEquipped ? (
                                            <button type="button" className="duo-button duo-button-secondary theme-equip-btn" disabled>
                                                <Check size={14} />
                                                <span>EQUIPPED</span>
                                            </button>
                                        ) : isOwned ? (
                                            <button
                                                type="button"
                                                className="duo-button duo-button-primary theme-equip-btn"
                                                onClick={() => onEquipTheme(theme.id)}
                                            >
                                                <span>EQUIP</span>
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="duo-button duo-button-primary theme-buy-btn"
                                                onClick={() => onBuyTheme(theme.id)}
                                            >
                                                <span>BUY</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Shelf 2: Power-Ups & Boosts (Existing Shop Items) */}
            <div className="shop-shelf-section">
                <div className="shelf-header">
                    <div className="shelf-title-box">
                        <ShoppingBag size={20} className="shelf-icon" />
                        <h3 className="shelf-heading">Power-Ups & Boosts</h3>
                    </div>
                </div>

                <div className="shop-powerups-list">
                    <div className="shop-powerup-card duo-card">
                        <div className="powerup-left">
                            <img src={heartIcon} alt="Heart Refill" className="powerup-icon" />
                            <div className="powerup-info">
                                <h4 className="powerup-title">Heart Refill</h4>
                                <p className="powerup-desc">Instantly restore all 5 hearts to continue learning without waiting.</p>
                            </div>
                        </div>
                        <button type="button" className="duo-button duo-button-primary powerup-buy-btn">
                            <span>BUY</span>
                            <span className="powerup-cost">
                                <img src={diamondIcon} alt="" className="diamond-icon-tiny" />
                                350
                            </span>
                        </button>
                    </div>

                    <div className="shop-powerup-card duo-card">
                        <div className="powerup-left">
                            <img src={streakIcon} alt="Streak Freeze" className="powerup-icon" />
                            <div className="powerup-info">
                                <h4 className="powerup-title">Streak Freeze</h4>
                                <p className="powerup-desc">Protects your active study streak if you miss a full calendar day.</p>
                            </div>
                        </div>
                        <button type="button" className="duo-button duo-button-primary powerup-buy-btn">
                            <span>BUY</span>
                            <span className="powerup-cost">
                                <img src={diamondIcon} alt="" className="diamond-icon-tiny" />
                                400
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// SUB-SURFACE 5: BADGES & REWARDS PREVIEW
// =============================================================================
function PreviewBadgesAndRewards() {
    return (
        <div className="preview-rewards-container">
            {/* Level Completion Preview Banner */}
            <div className="rewards-completion-card duo-card">
                <div className="rewards-mascot-glow">
                    <Mascot mascotType="maracas" size={120} animationType="dance" />
                </div>
                <div className="rewards-completion-text">
                    <div className="rewards-badge-tag">
                        <Sparkles size={14} />
                        <span>LEVEL COMPLETED • PERFECT RECALL</span>
                    </div>
                    <h2 className="rewards-title">Flawless 100% Accuracy!</h2>
                    <p className="rewards-sub">You verified all high-alert LASA pairs in Unit 1.</p>
                </div>

                {/* Stats Ribbon */}
                <div className="rewards-stats-ribbon">
                    <div className="rewards-stat-item xp">
                        <div className="rewards-icon-bubble">
                            <Award size={18} />
                        </div>
                        <div className="rewards-meta">
                            <span className="rewards-val">+50 XP</span>
                            <span className="rewards-lbl">Total Earned</span>
                        </div>
                    </div>
                    <div className="rewards-stat-divider" />
                    <div className="rewards-stat-item gems">
                        <div className="rewards-icon-bubble">
                            <img src={diamondIcon} alt="" className="diamond-icon-tiny" />
                        </div>
                        <div className="rewards-meta">
                            <span className="rewards-val">+20</span>
                            <span className="rewards-lbl">Diamonds</span>
                        </div>
                    </div>
                    <div className="rewards-stat-divider" />
                    <div className="rewards-stat-item acc">
                        <div className="rewards-icon-bubble">
                            <Shield size={18} />
                        </div>
                        <div className="rewards-meta">
                            <span className="rewards-val">100%</span>
                            <span className="rewards-lbl">Accuracy</span>
                        </div>
                    </div>
                </div>

                <div className="rewards-actions">
                    <button type="button" className="duo-button duo-button-primary completion-btn-wide">
                        <span>CONTINUE TO NEXT LEVEL</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Achievement Badges Showcase */}
            <div className="rewards-badges-shelf duo-card">
                <div className="badges-shelf-header">
                    <Trophy size={20} className="trophy-gold" />
                    <h3 className="badges-shelf-title">Unlocked Achievement Badges</h3>
                </div>

                <div className="badges-grid">
                    <div className="badge-showcase-item">
                        <div className="badge-emblem-circle gold">
                            <Trophy size={22} />
                        </div>
                        <div className="badge-showcase-text">
                            <span className="badge-name">Unit 1 Master Champion</span>
                            <span className="badge-desc">Conquered unassisted retrieval across all Unit 1 pairs.</span>
                        </div>
                    </div>

                    <div className="badge-showcase-item">
                        <div className="badge-emblem-circle green">
                            <Sparkles size={22} />
                        </div>
                        <div className="badge-showcase-text">
                            <span className="badge-name">Sentinel Defender</span>
                            <span className="badge-desc">Identified 20 high-potency opioid mix-ups flawlessly.</span>
                        </div>
                    </div>

                    <div className="badge-showcase-item">
                        <div className="badge-emblem-circle blue">
                            <Shield size={22} />
                        </div>
                        <div className="badge-showcase-text">
                            <span className="badge-name">7-Day Study Streak</span>
                            <span className="badge-desc">Practiced LASA distinctions 7 consecutive calendar days.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
