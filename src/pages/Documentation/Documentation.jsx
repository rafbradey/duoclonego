import { useState, useMemo, useEffect } from "react";
import {
    BookOpen,
    Compass,
    GraduationCap,
    PlusCircle,
    FileJson,
    Pill,
    UserCheck,
    Cpu,
    AlertTriangle,
    Search,
    CheckCircle2,
    Clock,
    Sparkles,
    ShieldAlert,
    Copy,
    Check,
    Layers,
    ArrowRight,
    Wrench
} from "lucide-react";
import "./Documentation.css";

const LAST_UPDATED = "September 10, 2026";
const APP_VERSION = "v0.8.0 (Realigned Core LASA Recognition MVP & Web Audio Feedback)";

// Status pill component helper
function StatusBadge({ status }) {
    const normalize = status.toLowerCase();
    let badgeClass = "badge-implemented";
    let label = status;

    if (normalize.includes("partially")) {
        badgeClass = "badge-partial";
    } else if (normalize.includes("prototype") || normalize.includes("static")) {
        badgeClass = "badge-prototype";
    } else if (normalize.includes("placeholder")) {
        badgeClass = "badge-placeholder";
    } else if (normalize.includes("not implemented")) {
        badgeClass = "badge-not-implemented";
    } else if (normalize.includes("developer")) {
        badgeClass = "badge-prototype";
    }

    return (
        <span className={`doc-status-badge ${badgeClass}`}>
            <span className="badge-dot" />
            {label}
        </span>
    );
}

// Copyable JSON snippet helper
function JsonSnippet({ code, label }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="doc-json-snippet-box">
            <div className="doc-snippet-header">
                <span className="doc-snippet-label">{label}</span>
                <button
                    type="button"
                    className="doc-copy-btn"
                    onClick={handleCopy}
                    aria-label={`Copy ${label} JSON`}
                >
                    {copied ? (
                        <>
                            <Check size={14} className="copy-check-icon" />
                            <span>COPIED</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} />
                            <span>COPY JSON</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="doc-json-pre">
                <code>{code}</code>
            </pre>
        </div>
    );
}

function Documentation() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSection, setActiveSection] = useState("overview");

    const sections = [
        { id: "overview", label: "1. Overview", icon: BookOpen },
        { id: "getting-around", label: "2. Getting Around", icon: Compass },
        { id: "current-features", label: "3. Current Features", icon: Sparkles },
        { id: "learning-system", label: "4. Learning System", icon: GraduationCap },
        { id: "adding-content", label: "5. Adding Content (Dev Guide)", icon: PlusCircle },
        { id: "data-schema", label: "6. Data & JSON Schema", icon: FileJson },
        { id: "lasa-system", label: "7. LASA Knowledge & Data", icon: Pill },
        { id: "user-progress", label: "8. User State & Persistence", icon: UserCheck },
        { id: "architecture", label: "9. Architecture & Data Flow", icon: Cpu },
        { id: "limitations", label: "10. Current Limitations", icon: AlertTriangle }
    ];

    // Scroll-following Table of Contents using IntersectionObserver
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -70% 0px",
            threshold: 0
        };

        const handleIntersect = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);
        const sectionElements = document.querySelectorAll("main.doc-content-stream > section[id]");
        sectionElements.forEach((el) => observer.observe(el));

        return () => {
            sectionElements.forEach((el) => observer.unobserve(el));
            observer.disconnect();
        };
    }, [searchQuery]);

    const handleNavClick = (id) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const isMatch = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return (text) => {
            if (!query) return true;
            return text.toLowerCase().includes(query);
        };
    }, [searchQuery]);

    return (
        <div className="doc-page-root">
            {/* Header / Meta Banner */}
            <header className="doc-header duo-card">
                <div className="doc-header-main">
                    <div className="doc-header-badge">
                        <BookOpen size={16} />
                        <span>LIVING IN-APP DOCUMENTATION</span>
                    </div>
                    <h1 className="heading-xl doc-main-title">Duoclongo System Reference</h1>
                    <p className="body-text-muted doc-tagline">
                        Real-time reference of implemented functionality, learning science architecture, curriculum content guide, and active system boundaries.
                    </p>
                </div>

                <div className="doc-meta-pills">
                    <div className="doc-meta-pill">
                        <Clock size={15} />
                        <span>Last updated: <strong>{LAST_UPDATED}</strong></span>
                    </div>
                    <div className="doc-meta-pill">
                        <CheckCircle2 size={15} />
                        <span>Version: <strong>{APP_VERSION}</strong></span>
                    </div>
                </div>
            </header>

            {/* Quick Search and Filter Bar */}
            <div className="doc-search-bar duo-card">
                <Search size={18} className="doc-search-icon" />
                <input
                    type="search"
                    className="doc-search-input"
                    placeholder="Search documentation (e.g., 'adding a level', 'json schema', 'XP', 'localStorage', 'tall man')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Filter documentation"
                />
                {searchQuery && (
                    <button
                        type="button"
                        className="doc-search-clear"
                        onClick={() => setSearchQuery("")}
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Layout Body: Sticky Navigation Rail + Main Content */}
            <div className="doc-layout-grid">
                {/* Navigation TOC Rail (Follow-the-user) */}
                <aside className="doc-toc-rail" aria-label="Documentation Navigation">
                    <div className="doc-toc-card duo-card">
                        <h2 className="doc-toc-heading">Table of Contents</h2>
                        <nav className="doc-toc-nav">
                            {sections.map((sec) => {
                                const Icon = sec.icon;
                                const isActive = activeSection === sec.id;
                                return (
                                    <button
                                        key={sec.id}
                                        type="button"
                                        onClick={() => handleNavClick(sec.id)}
                                        className={`doc-toc-item ${isActive ? "active" : ""}`}
                                    >
                                        <Icon size={16} className="doc-toc-icon" />
                                        <span>{sec.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* Main Documentation Articles */}
                <main className="doc-content-stream">
                    {/* SECTION 1: OVERVIEW */}
                    {isMatch("overview purpose goal north star medical pharmacology audience") && (
                        <section id="overview" className="doc-section-card duo-card">
                            <div className="doc-section-header">
                                <div className="doc-section-title-wrap">
                                    <BookOpen size={22} className="doc-section-icon" />
                                    <h2 className="heading-lg">1. Overview</h2>
                                </div>
                                <StatusBadge status="Implemented" />
                            </div>

                            <p className="doc-paragraph">
                                <strong>Duoclongo</strong> is an interactive, gamified learning application designed to teach and reinforce recognition of <strong>Look-Alike, Sound-Alike (LASA)</strong> medications to prevent dispensing and clinical administration errors.
                            </p>

                            <div className="doc-callout info">
                                <strong>Core North Star:</strong> The platform focuses on the high-frequency cognitive confusion between look-alike/sound-alike drug names. Gamification (XP, streaks, rewards) serves as an extrinsic motivator to reinforce the primary educational loop:
                                <code className="doc-inline-code">Drug Data → Learning Progression → Question Session → Immediate Feedback → Spaced Mastery</code>.
                            </div>

                            <h3 className="heading-sm doc-subsection-title">Target Audience & Intent</h3>
                            <ul className="doc-bullet-list">
                                <li><strong>Pharmacy & Nursing Students:</strong> Early training on frequently confused medication pairs and Tall Man lettering patterns.</li>
                                <li><strong>Practicing Healthcare Professionals:</strong> Low-friction, bite-sized practice to sharpen orthographic and phonetic discrimination.</li>
                                <li><strong>Research & Education Evaluators:</strong> Empirical testbed for evaluating retrieval practice in pharmacology education.</li>
                            </ul>
                        </section>
                    )}

                    {/* SECTION 2: GETTING AROUND & ROUTES */}
                    {isMatch("getting around routes navigation layout sidebar mobilenav navbar") && (
                        <section id="getting-around" className="doc-section-card duo-card">
                            <div className="doc-section-header">
                                <div className="doc-section-title-wrap">
                                    <Compass size={22} className="doc-section-icon" />
                                    <h2 className="heading-lg">2. Getting Around & Navigation</h2>
                                </div>
                                <StatusBadge status="Implemented" />
                            </div>

                            <p className="doc-paragraph">
                                The application uses <strong>React Router</strong> for declarative client-side navigation. Layouts are partitioned between public marketing, focused fullscreen learning sessions, and persistent app shells.
                            </p>

                            <h3 className="heading-sm doc-subsection-title">Route Manifest</h3>
                            <div className="doc-table-wrapper">
                                <table className="doc-table">
                                    <thead>
                                        <tr>
                                            <th>Route Path</th>
                                            <th>Page / Component</th>
                                            <th>Layout Shell</th>
                                            <th>Current Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><code className="doc-inline-code">/</code></td>
                                            <td>Landing Page (<code className="doc-inline-code">Home.jsx</code>)</td>
                                            <td>Independent Header (<code className="doc-inline-code">Navbar.jsx</code>)</td>
                                            <td><StatusBadge status="Implemented" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">/learn</code></td>
                                            <td>Curriculum Dashboard (<code className="doc-inline-code">Learn.jsx</code>)</td>
                                            <td><code className="doc-inline-code">AppLayout</code> (Sidebar + Rail)</td>
                                            <td><StatusBadge status="Implemented" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">/lesson/:lessonId</code></td>
                                            <td>Interactive Lesson Runner (<code className="doc-inline-code">LessonSession.jsx</code>)</td>
                                            <td>Distraction-Free (No Sidebar)</td>
                                            <td><StatusBadge status="Implemented" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">/practice</code></td>
                                            <td>Targeted Practice Hub (<code className="doc-inline-code">Practice.jsx</code>)</td>
                                            <td><code className="doc-inline-code">AppLayout</code></td>
                                            <td><StatusBadge status="Implemented" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">/quests</code></td>
                                            <td>Daily Quests & Badges (<code className="doc-inline-code">Quests.jsx</code>)</td>
                                            <td><code className="doc-inline-code">AppLayout</code></td>
                                            <td><StatusBadge status="Placeholder" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">/leaderboards</code></td>
                                            <td>Weekly League Ranks (<code className="doc-inline-code">Leaderboards.jsx</code>)</td>
                                            <td><code className="doc-inline-code">AppLayout</code></td>
                                            <td><StatusBadge status="Placeholder" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">/shop</code></td>
                                            <td>Mascot Item & Boost Shop (<code className="doc-inline-code">Shop.jsx</code>)</td>
                                            <td><code className="doc-inline-code">AppLayout</code></td>
                                            <td><StatusBadge status="Placeholder" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">/profile</code></td>
                                            <td>Learner Profile & Retention Mastery (<code className="doc-inline-code">Profile.jsx</code>)</td>
                                            <td><code className="doc-inline-code">AppLayout</code></td>
                                            <td><StatusBadge status="Implemented" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">/documentation</code></td>
                                            <td>Living System Reference (<code className="doc-inline-code">Documentation.jsx</code>)</td>
                                            <td><code className="doc-inline-code">AppLayout</code></td>
                                            <td><StatusBadge status="Implemented" /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* SECTION 3: CURRENT FEATURES */}
                    {isMatch("current features learn lesson guidebook home profile practice quests leaderboards shop") && (
                        <section id="current-features" className="doc-section-card duo-card">
                            <div className="doc-section-header">
                                <div className="doc-section-title-wrap">
                                    <Sparkles size={22} className="doc-section-icon" />
                                    <h2 className="heading-lg">3. Current Feature Breakdown</h2>
                                </div>
                                <StatusBadge status="Implemented" />
                            </div>

                            {/* Home */}
                            <div className="doc-subfeature-block">
                                <div className="doc-subfeature-title-bar">
                                    <h3 className="heading-sm">3.1 Home / Landing Page (<code className="doc-inline-code">/</code>)</h3>
                                    <StatusBadge status="Implemented" />
                                </div>
                                <p className="doc-paragraph">
                                    Presents value proposition with animated mascot, quick navigation into <code className="doc-inline-code">/learn</code>, and a live ticker showcasing common LASA pairs formatted with Tall Man lettering directly loaded from <code className="doc-inline-code">drugService.getAllLasaEntries()</code>.
                                </p>
                            </div>

                            {/* Learn */}
                            <div className="doc-subfeature-block">
                                <div className="doc-subfeature-title-bar">
                                    <h3 className="heading-sm">3.2 Curriculum Tree (<code className="doc-inline-code">/learn</code>)</h3>
                                    <StatusBadge status="Implemented" />
                                </div>
                                <p className="doc-paragraph">
                                    The primary educational hub. Renders Unit cards containing visual progression paths. Each level node resolves its status dynamically:
                                </p>
                                <ul className="doc-bullet-list">
                                    <li><strong>Completed Level:</strong> Golden accent ring, checkmark icon, and <code className="doc-inline-code">✓ DONE</code> badge. Users can freely replay completed levels for practice.</li>
                                    <li><strong>Active Level:</strong> Primary green background with a <code className="doc-inline-code">Star</code> icon and subtle pulse animation inviting interaction. Clicking navigates directly to <code className="doc-inline-code">/lesson/:levelId</code>.</li>
                                    <li><strong>Locked Level:</strong> Grayed surface with padlock icon; disabled until the preceding prerequisite level is completed.</li>
                                    <li><strong>Dedicated Unit Mastery (4th Level):</strong> Distinct gold/amber capstone card positioned after Level 3 with a prominent trophy badge (🏆), dedicated route <code className="doc-inline-code">/unit/:unitId/mastery</code>, and +25 XP capstone reward. Locked until Levels 1–3 are completed; conquering Unit Mastery unlocks the subsequent Unit.</li>
                                    <li><strong>Path Connectors:</strong> Visual lines connecting nodes dynamically turn green when the preceding step is achieved.</li>
                                    <li><strong>Unit Guidebook:</strong> Each unit header provides a &quot;GUIDEBOOK&quot; button launching a modal reference of confused pairs.</li>
                                </ul>
                            </div>

                            {/* Lesson Runner */}
                            <div className="doc-subfeature-block">
                                <div className="doc-subfeature-title-bar">
                                    <h3 className="heading-sm">3.3 Lesson Session Runner (<code className="doc-inline-code">/lesson/:lessonId</code>)</h3>
                                    <StatusBadge status="Implemented" />
                                </div>
                                <p className="doc-paragraph">
                                    A distraction-free learning session interface designed for focus:
                                </p>
                                <ul className="doc-bullet-list">
                                    <li><strong>Header Controls:</strong> Exit button with discard confirmation dialog, animated progress bar tracking completion percentage, and active hearts indicator.</li>
                                    <li><strong>Dynamic Session Sampling & Option Shuffling:</strong> Powered by <code className="doc-inline-code">prepareSessionLesson()</code> to ensure high question diversity while preserving 100% accurate answer evaluation.</li>
                                    <li><strong>Instant Web Audio Feedback:</strong> Real-time synthesized audio via the browser Web Audio API (<code className="doc-inline-code">audioService.js</code>). Correct answers trigger an affirmative rising chime; mistakes trigger a distinctive descending error buzzer.</li>
                                    <li><strong>Pure Cognitive LASA Prompts:</strong> Zero narrative dispensing scenarios or treatment questions. Directly challenges learners on Tall Man capitalization and confusable counterpart recognition.</li>
                                    <li><strong>Immediate Explanatory Feedback:</strong> Bottom feedback drawer (<code className="doc-inline-code">&lt;FeedbackDrawer /&gt;</code>) triggers on answer submission, highlighting the correct distinction, clinical safety rationale, and related medication.</li>
                                    <li><strong>Completion Celebration:</strong> Upon answering all questions, renders <code className="doc-inline-code">&lt;LessonCompletion /&gt;</code> displaying accuracy percentage, mascot reaction, session question breakdown, and newly awarded XP.</li>
                                </ul>
                            </div>

                            {/* Guidebook Modal */}
                            <div className="doc-subfeature-block">
                                <div className="doc-subfeature-title-bar">
                                    <h3 className="heading-sm">3.4 Guidebook Reference Modal</h3>
                                    <StatusBadge status="Implemented" />
                                </div>
                                <p className="doc-paragraph">
                                    Accessible from any unit banner on <code className="doc-inline-code">/learn</code>. Renders verified medication pairs (<code className="doc-inline-code">&lt;LasaPairCard /&gt;</code>) belonging to that unit, supports live search filtering, and displays official ISMP 2023 citation metadata.
                                </p>
                            </div>

                            {/* Profile */}
                            <div className="doc-subfeature-block">
                                <div className="doc-subfeature-title-bar">
                                    <h3 className="heading-sm">3.5 User Profile &amp; Retention Mastery (<code className="doc-inline-code">/profile</code>)</h3>
                                    <StatusBadge status="Implemented" />
                                </div>
                                <p className="doc-paragraph">
                                    A comprehensive learner dashboard providing real-time insights into motivation, spaced retention, and curriculum mastery:
                                </p>
                                <ul className="doc-bullet-list">
                                    <li><strong>Core Motivational Metrics:</strong> Displays user avatar, display name, username handle, join date, current streak, gem balance, mastery level, and total accumulated XP.</li>
                                    <li><strong>LASA Long-Term Retention Analytics:</strong> Direct visualization of Spaced Repetition (SRS) memory strength across all 24+ verified ISMP drug pairs, tracking how many pairs have achieved Stage 3 Mastery.</li>
                                    <li><strong>Real-Time Practice Due &amp; Mistakes Alerts:</strong> Live indicators highlighting pairs whose retention timers have expired alongside unredeemed mistakes awaiting remediation.</li>
                                    <li><strong>Curriculum Completion Progress:</strong> Unit-by-unit visual progression cards displaying completed levels, unit mastery capstones, and overall curriculum completion percentages.</li>
                                </ul>
                            </div>

                            {/* Practice Hub */}
                            <div className="doc-subfeature-block">
                                <div className="doc-subfeature-title-bar">
                                    <h3 className="heading-sm">3.6 Targeted Practice Hub &amp; Spaced Repetition Engine (<code className="doc-inline-code">/practice</code>)</h3>
                                    <StatusBadge status="Implemented" />
                                </div>
                                <p className="doc-paragraph">
                                    A retrieval practice and memory consolidation center powered by a pragmatic 4-Stage Leitner Spaced Repetition System (SRS) and unified mistake tracking:
                                </p>
                                <ul className="doc-bullet-list">
                                    <li><strong>Three Specialized Practice Modes:</strong>
                                        <ul>
                                            <li><strong>Daily Spaced Review (<code className="doc-inline-code">mode=due</code>):</strong> The primary practice activity when reviews are due. Targets pairs whose interval timers have expired to prevent memory decay. If fewer than 5 items are due, backfills from newly learned pairs.</li>
                                            <li><strong>Targeted Mistakes Review (<code className="doc-inline-code">mode=mistakes</code>):</strong> Directly exercises questions previously missed in normal unit lessons or capstone mastery. Answering correctly redeems the mistake and clears it from the queue.</li>
                                            <li><strong>Quick Practice (<code className="doc-inline-code">mode=quick</code>):</strong> Rapid 5-question randomized retrieval across all unlocked curriculum levels, awarding +10 review XP.</li>
                                        </ul>
                                    </li>
                                    <li><strong>4-Stage Leitner Memory Intervals:</strong>
                                        <ul>
                                            <li><strong>Stage 0 (Learning / Flagged):</strong> Immediate review (0 hours).</li>
                                            <li><strong>Stage 1 (Initial Recall):</strong> 24 hours (1 day).</li>
                                            <li><strong>Stage 2 (Consolidation):</strong> 72 hours (3 days).</li>
                                            <li><strong>Stage 3 (Mastered):</strong> 168 hours (7 days).</li>
                                        </ul>
                                    </li>
                                    <li><strong>Unified Mistake Capture:</strong> Errors made anywhere in the application (normal lessons, unit mastery capstones, or practice) automatically demote the pair to Stage 0 and append the question to <code className="doc-inline-code">user.mistakes_queue</code>.</li>
                                    <li><strong>Live Practice Stats Bar:</strong> Displays real-time counters for Reviews Finished, Due for Review, Mistakes in Queue, and Mastered Pairs.</li>
                                    <li><strong>Confusable Pairs Reference Browser:</strong> Interactive flashcard directory of verified ISMP drug pairs with dynamic memory strength pills (<code className="doc-inline-code">Mastered</code>, <code className="doc-inline-code">Review Due</code>, <code className="doc-inline-code">Stage 1/2</code>) and <code className="doc-inline-code">TallManText</code> highlighting.</li>
                                    <li><strong>Protected Hearts (Safe Mode):</strong> Practice sessions protect the learner&apos;s hearts (zero hearts depleted on incorrect answers) to encourage low-anxiety retrieval practice.</li>
                                </ul>
                            </div>

                            {/* Secondary Gamification Hubs */}
                            <div className="doc-subfeature-block">
                                <div className="doc-subfeature-title-bar">
                                    <h3 className="heading-sm">3.7 Secondary Gamification Hubs</h3>
                                    <StatusBadge status="Placeholder" />
                                </div>
                                <p className="doc-paragraph">
                                    <code className="doc-inline-code">/quests</code>, <code className="doc-inline-code">/leaderboards</code>, and <code className="doc-inline-code">/shop</code> are structured visual placeholders communicating their scheduled roadmap phase (Phase 5) while preventing broken navigation links.
                                </p>
                            </div>
                        </section>
                    )}

                    {/* SECTION 4: LEARNING SYSTEM & PEDAGOGY */}
                    {isMatch("learning system pedagogy section unit level activity question retrieval spacing x rule") && (
                        <section id="learning-system" className="doc-section-card duo-card">
                            <div className="doc-section-header">
                                <div className="doc-section-title-wrap">
                                    <GraduationCap size={22} className="doc-section-icon" />
                                    <h2 className="heading-lg">4. Learning System & Pedagogy</h2>
                                </div>
                                <StatusBadge status="Implemented" />
                            </div>

                            <p className="doc-paragraph">
                                Duoclongo implements a formal educational hierarchy grounded in cognitive science literature (Dunlosky et al., 2013; APA <em>Powerful Teaching</em>):
                            </p>

                            <div className="doc-hierarchy-box">
                                <span className="doc-h-node">Section</span>
                                <span className="doc-h-arrow">&rarr;</span>
                                <span className="doc-h-node">Unit</span>
                                <span className="doc-h-arrow">&rarr;</span>
                                <span className="doc-h-node">Levels 1..3 + Unit Mastery</span>
                                <span className="doc-h-arrow">&rarr;</span>
                                <span className="doc-h-node">Lesson</span>
                                <span className="doc-h-arrow">&rarr;</span>
                                <span className="doc-h-node">Activity</span>
                                <span className="doc-h-arrow">&rarr;</span>
                                <span className="doc-h-node">Question / Task</span>
                            </div>

                            <h3 className="heading-sm doc-subsection-title">4.1 Core Learning Scope &amp; Boundary Delineation</h3>
                            <div className="doc-callout info">
                                <strong>Active Curriculum Focus:</strong>
                                <br />
                                The current Duoclongo implementation strictly tests the learner&apos;s ability to <strong>recognize, distinguish, and correctly construct Look-Alike / Sound-Alike medication names</strong>.
                                <br />
                                <em>&quot;Can I recognize these medication names and distinguish easily confused look-alikes?&quot;</em>
                            </div>
                            <p className="doc-paragraph">
                                <strong>Intentional Scope Correction:</strong> Theoretical and clinical questions (such as ISMP classification theory, drug indications, mechanisms of action, pharmacokinetics, dosage calculations, and clinical reasoning) are <strong>not part of active learner lessons</strong>. All previous prototype theoretical items have been migrated out of active levels into a dedicated preservation archive (<code className="doc-inline-code">src/data/curriculum/deferredTheoreticalQuestions.json</code>) and reserved for future research-backed phases.
                            </p>

                            <h3 className="heading-sm doc-subsection-title">Standardized Unit Structure: 3 Normal Levels + Unit Mastery</h3>
                            <p className="doc-paragraph">
                                Every Unit across all Sections adheres strictly to a 4-level pedagogical structure:
                            </p>
                            <div className="doc-code-preview">
                                <code>
                                    UNIT<br />
                                    ├── Level 1: Identification &amp; Familiarization (type: &quot;level&quot;)<br />
                                    ├── Level 2: Tall Man Discrimination (type: &quot;level&quot;)<br />
                                    ├── Level 3: Situational Recognition &amp; Verification (type: &quot;level&quot;)<br />
                                    └── Unit Mastery: Comprehensive Review &amp; Unassisted Tall Man Capstone (type: &quot;unit_mastery&quot;)
                                </code>
                            </div>
                            <p className="doc-paragraph">
                                Currently implemented uniformly across <strong>Unit 1</strong> (Oral Antidiabetics), <strong>Unit 2</strong> (Formulation &amp; Suffix Variants), <strong>Unit 3</strong> (Brand &amp; Conjugate Differentiation), and <strong>Unit 4</strong> (High-Alert Synthetic Opioids).
                            </p>

                            <h3 className="heading-sm doc-subsection-title">Cognitive Science Principles Applied</h3>
                            <ul className="doc-bullet-list">
                                <li><strong>Retrieval Practice:</strong> Learners must actively distinguish between confusable options rather than passively reading drug monographs.</li>
                                <li><strong>Interleaving:</strong> Look-alike and sound-alike counterparts are tested in direct proximity to develop distinct mental representations.</li>
                                <li><strong>Immediate Explanatory Feedback:</strong> Errors trigger immediate explanations detailing the exact orthographic differences rather than generic failure prompts.</li>
                                <li><strong>Qualitative Progression:</strong> Cognitive demand shifts qualitatively across levels (<code className="doc-inline-code">Identification &rarr; Guided Construction &rarr; Distinction &rarr; Situational Recognition &rarr; Independent Mastery</code>).</li>
                            </ul>

                            <h3 className="heading-sm doc-subsection-title">4.2 Purpose-Driven Activity Taxonomy</h3>
                            <p className="doc-paragraph">
                                The thesis architecture distinguishes pedagogical purpose from mechanical interaction. Instead of treating every exercise as a generic multiple-choice guessing task, Duoclongo establishes a purpose-driven taxonomy where each activity type serves a distinct learning objective:
                            </p>
                            <div className="doc-table-wrapper">
                                <table className="doc-table">
                                    <thead>
                                        <tr>
                                            <th>Activity Type</th>
                                            <th>Pedagogical Objective</th>
                                            <th>Primary Interaction</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><code className="doc-inline-code">construction</code></td>
                                            <td>Active production and spelling of critical orthographic distinctions (e.g. Tall Man capitalization) without visual guessing cues.</td>
                                            <td>Constructed Response / Fill-in-the-Blank (<code className="doc-inline-code">tall_man</code>) with live name reconstruction or unassisted mastery input</td>
                                            <td><StatusBadge status="Implemented" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">identification</code></td>
                                            <td>Identify documented LASA counterparts and familiarize learners with high-risk drug pairs.</td>
                                            <td>Discrete Choice (<code className="doc-inline-code">multiple_choice</code>)</td>
                                            <td><StatusBadge status="Implemented" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">distinction</code></td>
                                            <td>Differentiate subtle orthographic, phonetic, or Tall Man distinctions between look-alike/sound-alike pairs.</td>
                                            <td>Targeted Choice (<code className="doc-inline-code">multiple_choice</code>) / Interactive Tap-to-Match tiles (<code className="doc-inline-code">matching</code>)</td>
                                            <td><StatusBadge status="Implemented" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">situational</code></td>
                                            <td>Recognize and distinguish confusable medication names within realistic dispensary/prescription verification contexts (strictly testing name distinction, not clinical decision-making).</td>
                                            <td>Contextual Scenario Card + Choice Selection (<code className="doc-inline-code">multiple_choice</code> with <code className="doc-inline-code">scenario</code>)</td>
                                            <td><StatusBadge status="Implemented" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">retrieval</code></td>
                                            <td>Revisit previously learned medication pairs and weak areas from memory without immediate study prompts.</td>
                                            <td>Interleaved Retrieval Challenges (<code className="doc-inline-code">/practice</code> hub)</td>
                                            <td><StatusBadge status="Implemented" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">simulation</code></td>
                                            <td>Apply multi-checkpoint dispensing verification (drug name, strength, dosage form, expiration date) in full clinical scenarios.</td>
                                            <td>Simulated Prescription Dispensing Runner</td>
                                            <td><StatusBadge status="Future Thesis Roadmap" /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="heading-sm doc-subsection-title">4.3 Dedicated Unit Mastery Milestone</h3>
                            <p className="doc-paragraph">
                                Grounded in the thesis requirement for unassisted competency verification, the <strong>Unit Mastery</strong> level (<code className="doc-inline-code">type: &quot;unit_mastery&quot;</code>, <code className="doc-inline-code">isMasteryLevel: true</code>) is a dedicated fourth level associated with the entire Unit:
                            </p>
                            <ul className="doc-bullet-list">
                                <li><strong>Unit-Wide Synthesis:</strong> Reviews medication distinctions across all preceding levels in the Unit before administering the final unassisted challenge.</li>
                                <li><strong>Capstone Tall Man Task:</strong> Concludes with an independent, no-hint Tall Man Lettering challenge (<code className="doc-inline-code">activityRole: &quot;unit_mastery&quot;</code>, <code className="doc-inline-code">isFinalTask: true</code>, <code className="doc-inline-code">scaffold: false</code>). The learner must produce the entire capitalized drug name from memory without affix hints.</li>
                                <li><strong>Direct Routing:</strong> Accessible via <code className="doc-inline-code">/unit/:unitId/mastery</code> (e.g. <code className="doc-inline-code">/unit/1/mastery</code>). Refresh-safe and directly navigable.</li>
                                <li><strong>Progression Gating:</strong> Unit Mastery unlocks only after Levels 1, 2, and 3 are successfully completed. Completing Unit Mastery marks the Unit mastered and unlocks Level 1 of the subsequent Unit.</li>
                                <li><strong>Visual Treatment:</strong> Rendered on <code className="doc-inline-code">/learn</code> as a prominent gold/amber card with a trophy icon (🏆), visually separated from standard level circles.</li>
                            </ul>
                        </section>
                    )}

                    {/* SECTION 5: ADDING LEARNING CONTENT (DEVELOPER GUIDE) */}
                    {isMatch("adding learning content developer guide how to add level unit section activity question") && (
                        <section id="adding-content" className="doc-section-card duo-card">
                            <div className="doc-section-header">
                                <div className="doc-section-title-wrap">
                                    <PlusCircle size={22} className="doc-section-icon" />
                                    <h2 className="heading-lg">5. Adding Learning Content: Developer Guide</h2>
                                </div>
                                <StatusBadge status="Developer Guide" />
                            </div>

                            <p className="doc-paragraph">
                                This practical guide explains how a future developer or content author can expand the Duoclongo curriculum safely without breaking existing progress or requiring engine rewrites.
                            </p>

                            {/* Step-by-Step: Adding a New Level */}
                            <div className="doc-guide-card">
                                <h3 className="heading-sm doc-guide-title">
                                    <Layers size={18} />
                                    <span>How to Add Another Level to an Existing Unit</span>
                                </h3>
                                <p className="doc-paragraph">
                                    To expand Unit 1 from 3 levels to 4 levels:
                                </p>
                                <ol className="doc-step-list">
                                    <li>
                                        <strong>Open the Unit JSON file:</strong> Navigate to <code className="doc-inline-code">src/data/levels/section-1/unit-1.json</code>.
                                    </li>
                                    <li>
                                        <strong>Append a new level object to <code className="doc-inline-code">levels[]</code>:</strong> Ensure the <code className="doc-inline-code">id</code> is unique across the entire application (e.g. <code className="doc-inline-code">&quot;level_004&quot;</code>).
                                    </li>
                                    <li>
                                        <strong>Set required level fields:</strong> Provide <code className="doc-inline-code">levelNumber</code>, <code className="doc-inline-code">title</code>, <code className="doc-inline-code">description</code>, <code className="doc-inline-code">learningObjective</code>, and <code className="doc-inline-code">xpReward</code>.
                                    </li>
                                    <li>
                                        <strong>Set initial lock state:</strong> Set <code className="doc-inline-code">&quot;unlocked&quot;: false</code>. The application&apos;s dynamic unlocking engine will automatically unlock it as soon as the learner finishes <code className="doc-inline-code">level_003</code>!
                                    </li>
                                    <li>
                                        <strong>Add Activities & Questions:</strong> Populate <code className="doc-inline-code">activities[]</code> with at least one activity containing valid questions.
                                    </li>
                                    <li>
                                        <strong>Zero Code Changes Required:</strong> The Learn page tree, level engine, and session runner derive level counts dynamically from <code className="doc-inline-code">unit.levels.length</code>.
                                    </li>
                                </ol>
                            </div>

                            {/* Step-by-Step: Adding a New Unit */}
                            <div className="doc-guide-card">
                                <h3 className="heading-sm doc-guide-title">
                                    <PlusCircle size={18} />
                                    <span>How to Add a New Unit (e.g. Unit 3)</span>
                                </h3>
                                <p className="doc-paragraph">
                                    To introduce a brand new unit to Section 1:
                                </p>
                                <ol className="doc-step-list">
                                    <li>
                                        <strong>Create the new Unit file:</strong> Create <code className="doc-inline-code">src/data/levels/section-1/unit-3.json</code> following the standard unit schema.
                                    </li>
                                    <li>
                                        <strong>Assign Unit Metadata:</strong>
                                        <ul className="doc-bullet-list">
                                            <li><code className="doc-inline-code">&quot;id&quot;: &quot;unit_003&quot;</code></li>
                                            <li><code className="doc-inline-code">&quot;unitNumber&quot;: 3</code></li>
                                            <li><code className="doc-inline-code">&quot;title&quot;: &quot;SECTION 1, UNIT 3&quot;</code></li>
                                            <li><code className="doc-inline-code">&quot;color&quot;: &quot;#2dab69&quot;</code> (or custom hex accent)</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>Register in Aggregation Index:</strong> Open <code className="doc-inline-code">src/data/levels/index.js</code> and add two lines:
                                        <div className="doc-code-preview">
                                            <code>
                                                import unit3 from &quot;./section-1/unit-3.json&quot; with &#123; type: &quot;json&quot; &#125;;<br />
                                                export const rawUnits = [unit1, unit2, unit3];
                                            </code>
                                        </div>
                                    </li>
                                    <li>
                                        <strong>Automatic Discovery:</strong> <code className="doc-inline-code">allUnits</code> and <code className="doc-inline-code">allLevels</code> will immediately expose the new unit across <code className="doc-inline-code">/learn</code>, the Guidebook modal, and lesson sessions.
                                    </li>
                                </ol>
                            </div>

                            {/* Adding a Section */}
                            <div className="doc-guide-card">
                                <h3 className="heading-sm doc-guide-title">
                                    <Compass size={18} />
                                    <span>Adding a New Section</span>
                                </h3>
                                <p className="doc-paragraph">
                                    <strong>Current Implementation Status:</strong> Section 1 (<code className="doc-inline-code">section-1</code>) and Section 2 (<code className="doc-inline-code">section-2</code>: &quot;High-Alert Medications&quot;) are active in the curriculum. To add subsequent sections (e.g. Section 3):
                                </p>
                                <ul className="doc-bullet-list">
                                    <li>Create directory <code className="doc-inline-code">src/data/levels/section-3/</code>.</li>
                                    <li>Create <code className="doc-inline-code">unit-1.json</code> with <code className="doc-inline-code">&quot;sectionId&quot;: &quot;section-3&quot;</code>, <code className="doc-inline-code">&quot;sectionTitle&quot;: &quot;Section 3: Specialized Pharmacotherapy&quot;</code>.</li>
                                    <li>Import and register the unit in <code className="doc-inline-code">src/data/levels/index.js</code>.</li>
                                </ul>
                            </div>

                            {/* Authoring a Final Unit Mastery Task */}
                            <div className="doc-guide-card">
                                <h3 className="heading-sm doc-guide-title">
                                    <ShieldAlert size={18} />
                                    <span>5.3 Authoring an Unassisted Unit Mastery Task</span>
                                </h3>
                                <p className="doc-paragraph">
                                    Every unit must conclude with an independent Tall Man Lettering mastery task to verify unassisted retrieval:
                                </p>
                                <ol className="doc-step-list">
                                    <li><strong>Target the Final Level &amp; Question:</strong> Place the question as the last question of the final level in the unit.</li>
                                    <li><strong>Set Mastery Metadata:</strong> Set <code className="doc-inline-code">&quot;activityRole&quot;: &quot;unit_mastery&quot;</code>, <code className="doc-inline-code">&quot;isFinalTask&quot;: true</code>, and <code className="doc-inline-code">&quot;scaffold&quot;: false</code>.</li>
                                    <li><strong>Define Drug Parameters:</strong> Specify <code className="doc-inline-code">&quot;type&quot;: &quot;tall_man&quot;</code>, <code className="doc-inline-code">standardName</code>, <code className="doc-inline-code">tallManName</code>, and <code className="doc-inline-code">&quot;prefix&quot;: &quot;&quot;, &quot;suffix&quot;: &quot;&quot;</code>.</li>
                                    <li><strong>Strict Case Matching:</strong> The engine automatically switches to strict case-sensitive validation (<code className="doc-inline-code">inputTrimmed === targetTallMan</code>) without partial affix hints or live reconstruction preview.</li>
                                </ol>
                            </div>

                            {/* Temporary Developer Testing Override Tool */}
                            <div className="doc-guide-card">
                                <div className="doc-subfeature-title-bar">
                                    <h3 className="heading-sm doc-guide-title">
                                        <Wrench size={18} />
                                        <span>5.4 Temporary Developer Answer Overrides</span>
                                    </h3>
                                    <StatusBadge status="Temporary Developer Tool" />
                                </div>
                                <p className="doc-paragraph">
                                    To accelerate development testing across question formats, feedback states, and session completion without requiring manual answers every time, a temporary side control panel is provided during lesson sessions:
                                </p>
                                <ul className="doc-bullet-list">
                                    <li><strong>ANSWER CORRECTLY:</strong> Feeds into the existing lesson engine flow and forces the evaluation outcome to be correct. Triggers success feedback, XP bonus calculation, and progress advancement.</li>
                                    <li><strong>ANSWER INCORRECTLY:</strong> Feeds into the existing lesson engine flow and forces the evaluation outcome to be incorrect. Triggers clinical error explanation and mistakes queue logging.</li>
                                    <li><strong>Environment Guarded:</strong> Guarded by <code className="doc-inline-code">import.meta.env.DEV</code>. It is active solely during local development (<code className="doc-inline-code">npm run dev</code>) and automatically omitted from production builds.</li>
                                </ul>
                            </div>

                            {/* ID Conventions */}
                            <h3 className="heading-sm doc-subsection-title">Identifier Naming Conventions</h3>
                            <div className="doc-table-wrapper">
                                <table className="doc-table">
                                    <thead>
                                        <tr>
                                            <th>Entity</th>
                                            <th>ID Convention</th>
                                            <th>Example</th>
                                            <th>Uniqueness Scope</th>
                                            <th>Referenced In Progress?</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>Section</strong></td>
                                            <td><code className="doc-inline-code">section-&#123;N&#125;</code></td>
                                            <td><code className="doc-inline-code">section-1</code></td>
                                            <td>Global</td>
                                            <td>No</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Unit</strong></td>
                                            <td><code className="doc-inline-code">unit_&#123;NNN&#125;</code></td>
                                            <td><code className="doc-inline-code">unit_001</code></td>
                                            <td>Global</td>
                                            <td>No</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Level</strong></td>
                                            <td><code className="doc-inline-code">level_&#123;NNN&#125;</code></td>
                                            <td><code className="doc-inline-code">level_001</code></td>
                                            <td>Global</td>
                                            <td><strong>YES</strong> (<code className="doc-inline-code">completed_lessons</code>)</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Unit Mastery</strong></td>
                                            <td><code className="doc-inline-code">unit_&#123;NNN&#125;_mastery</code></td>
                                            <td><code className="doc-inline-code">unit_001_mastery</code></td>
                                            <td>Global</td>
                                            <td><strong>YES</strong> (<code className="doc-inline-code">completed_lessons</code>)</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Activity</strong></td>
                                            <td><code className="doc-inline-code">act_&#123;NNN&#125;</code></td>
                                            <td><code className="doc-inline-code">act_101</code></td>
                                            <td>Level-scoped</td>
                                            <td>No</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Question</strong></td>
                                            <td><code className="doc-inline-code">q&#123;NNN&#125;</code></td>
                                            <td><code className="doc-inline-code">q101</code></td>
                                            <td>Global</td>
                                            <td>Session Answer Log</td>
                                        </tr>
                                        <tr>
                                            <td><strong>LASA Pair</strong></td>
                                            <td><code className="doc-inline-code">lasa-&#123;NNN&#125;</code></td>
                                            <td><code className="doc-inline-code">lasa-001</code></td>
                                            <td>Global (<code className="doc-inline-code">lasaData.json</code>)</td>
                                            <td>Guidebook & Question Refs</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="doc-callout warning">
                                <strong>Important ID Rule:</strong> Level IDs (<code className="doc-inline-code">level_001</code>, <code className="doc-inline-code">level_002</code>) are stored directly in user progress records (<code className="doc-inline-code">user.completed_lessons</code>). Never rename an existing level ID in production, or existing learners will lose their unlocked progression for that level!
                            </div>
                        </section>
                    )}

                    {/* SECTION 6: UNDERSTANDING THE DATA & JSON SCHEMA */}
                    {isMatch("understanding data json schema unit level activity question copyable examples") && (
                        <section id="data-schema" className="doc-section-card duo-card">
                            <div className="doc-section-header">
                                <div className="doc-section-title-wrap">
                                    <FileJson size={22} className="doc-section-icon" />
                                    <h2 className="heading-lg">6. Data & JSON Schema Dissection</h2>
                                </div>
                                <StatusBadge status="Implemented Schema" />
                            </div>

                            <p className="doc-paragraph">
                                The Duoclongo data architecture deliberately isolates curriculum structure from medical relationship definitions.
                            </p>

                            <div className="doc-callout info">
                                <strong>Conceptual Distinction:</strong>
                                <br />
                                <code className="doc-inline-code">LASA Relationship &ne; Lesson &ne; Activity &ne; Question</code>
                                <br />
                                A LASA relationship (e.g. <code className="doc-inline-code">DOPamine / DOBUTamine</code>) is an authoritative pharmacological fact. A Level is a pedagogical progression stage. An Activity organizes instructional steps. A Question is an interactive evaluation challenge referencing that relationship.
                            </div>

                            <h3 className="heading-sm doc-subsection-title">Data Folder Organization</h3>
                            <pre className="doc-folder-tree">
{`src/data/
├── lasaData.json                    <- 26 verified ISMP 2023 LASA medication pairs
├── user.json                        <- Prototype user profile and baseline stats
└── levels/                          <- Modular curriculum data
    ├── index.js                     <- Central normalization & unit registry
    ├── section-1/
    │   ├── unit-1.json              <- Unit 1: Introductory LASA Pairs (X = 3 levels)
    │   ├── unit-2.json              <- Unit 2: Formulations & Suffixes (X = 3 levels)
    │   └── unit-3.json              <- Unit 3: Brand & Suffix Differentiation (X = 3 levels)
    └── section-2/
        └── unit-1.json              <- Unit 4: High-Alert Opioids & Potency (X = 1 level)`}
                            </pre>

                            {/* Unit JSON Schema & Example */}
                            <h3 className="heading-sm doc-subsection-title">6.1 Unit Schema</h3>
                            <p className="doc-paragraph">
                                Each file in <code className="doc-inline-code">src/data/levels/section-N/unit-M.json</code> defines a single Unit:
                            </p>
                            <JsonSnippet
                                label="unit-example.json"
                                code={`{
  "sectionId": "section-1",
  "sectionTitle": "Section 1: Foundations",
  "id": "unit_001",
  "unitNumber": 1,
  "title": "SECTION 1, UNIT 1",
  "description": "Introductory LASA Pairs",
  "unitMessage": "ISMP 2023 Confused Drug Names Reference",
  "color": "#2dab69",
  "levels": [ ... ]
}`}
                            />
                            <ul className="doc-field-desc-list">
                                <li><code className="doc-inline-code">sectionId</code>: Unique identifier for the parent section container.</li>
                                <li><code className="doc-inline-code">sectionTitle</code>: Human-readable section heading displayed in banners.</li>
                                <li><code className="doc-inline-code">id</code>: Unique unit identifier (e.g. <code className="doc-inline-code">unit_001</code>).</li>
                                <li><code className="doc-inline-code">unitNumber</code>: Ordinal integer for sorting and display.</li>
                                <li><code className="doc-inline-code">title</code>: Uppercase banner headline on the Learn dashboard.</li>
                                <li><code className="doc-inline-code">description</code>: Secondary subtitle explaining unit focus.</li>
                                <li><code className="doc-inline-code">unitMessage</code>: Sub-banner message displayed beside sparkles divider.</li>
                                <li><code className="doc-inline-code">color</code>: Brand theme color for the unit card.</li>
                                <li><code className="doc-inline-code">levels</code>: Array of Level objects ($1 \dots X$).</li>
                            </ul>

                            {/* Level JSON Schema & Example */}
                            <h3 className="heading-sm doc-subsection-title">6.2 Level Schema</h3>
                            <p className="doc-paragraph">
                                Each object inside <code className="doc-inline-code">unit.levels[]</code> represents a single node on the learning tree. Levels can contain a structured <code className="doc-inline-code">lessons[]</code> array (the full 6-tier hierarchy) or direct <code className="doc-inline-code">activities[]</code>:
                            </p>
                            <JsonSnippet
                                label="level-example.json"
                                code={`{
  "id": "level_001",
  "levelNumber": 1,
  "title": "LASA Pair Familiarization",
  "description": "Recognize common look-alike and sound-alike brand/generic pairs.",
  "learningObjective": "Identify documented LASA counterparts and recognize dispensing risks.",
  "xpReward": 10,
  "unlocked": true,
  "lasaRefIds": ["lasa-001", "lasa-002"],
  "lessons": [
    {
      "id": "lesson_101",
      "lessonNumber": 1,
      "title": "buPROPion vs busPIRone",
      "activities": [ ... ]
    }
  ]
}`}
                            />
                            <ul className="doc-field-desc-list">
                                <li><code className="doc-inline-code">id</code>: Unique level identifier (e.g. <code className="doc-inline-code">level_001</code>). Used in routing (<code className="doc-inline-code">/lesson/level_001</code>) and user progress storage.</li>
                                <li><code className="doc-inline-code">levelNumber</code>: Ordinal number within the unit.</li>
                                <li><code className="doc-inline-code">title</code>: Label rendered under the tree node.</li>
                                <li><code className="doc-inline-code">description</code>: Brief explanation of the level focus.</li>
                                <li><code className="doc-inline-code">learningObjective</code>: Pedagogical goal passed to accessibility labels and tooltips.</li>
                                <li><code className="doc-inline-code">xpReward</code>: Baseline experience points awarded upon completion.</li>
                                <li><code className="doc-inline-code">unlocked</code>: Default lock state for fresh accounts. Set <code className="doc-inline-code">true</code> for Level 1 of Unit 1; <code className="doc-inline-code">false</code> for subsequent levels.</li>
                                <li><code className="doc-inline-code">lasaRefIds</code>: Array of LASA ID references taught in this level.</li>
                                <li><code className="doc-inline-code">lessons</code>: Array of Lesson objects (<code className="doc-inline-code">Section &rarr; Unit &rarr; Level &rarr; Lesson &rarr; Activity &rarr; Question</code>).</li>
                            </ul>

                            {/* Activity Schema */}
                            <h3 className="heading-sm doc-subsection-title">6.3 Activity Schema</h3>
                            <p className="doc-paragraph">
                                Activities organize the instructional mode inside a lesson or level:
                            </p>
                            <JsonSnippet
                                label="activity-example.json"
                                code={`{
  "id": "act_101",
  "activityType": "recognition",
  "activityRole": "practice",
  "questions": [ ... ]
}`}
                            />
                            <ul className="doc-field-desc-list">
                                <li><code className="doc-inline-code">id</code>: Unique activity identifier (e.g. <code className="doc-inline-code">act_101</code>).</li>
                                <li><code className="doc-inline-code">activityType</code>: Pedagogical mode (<code className="doc-inline-code">recognition</code>, <code className="doc-inline-code">discrimination</code>, <code className="doc-inline-code">retrieval</code>, <code className="doc-inline-code">construction</code>).</li>
                                <li><code className="doc-inline-code">activityRole</code>: Functional role (<code className="doc-inline-code">&quot;practice&quot;</code> or <code className="doc-inline-code">&quot;unit_mastery&quot;</code>).</li>
                                <li><code className="doc-inline-code">questions</code>: Array of Question objects.</li>
                            </ul>

                            {/* Question Schema */}
                            <h3 className="heading-sm doc-subsection-title">6.4 Question Schema</h3>
                            <p className="doc-paragraph">
                                Questions are evaluated by <code className="doc-inline-code">QuestionRenderer.jsx</code> and <code className="doc-inline-code">lessonEngine.js</code>:
                            </p>
                            <JsonSnippet
                                label="question-example.json"
                                code={`{
  "id": "q101",
  "type": "multiple_choice",
  "lasaId": "lasa_001",
  "prompt": "Which medication is a documented Look-Alike / Sound-Alike counterpart to buPROPion?",
  "choices": [
    "busPIRone",
    "hydrALAZINE",
    "traMADol",
    "clonazePAM"
  ],
  "correctAnswer": "busPIRone",
  "explanation": "buPROPion and busPIRone form a documented ISMP/FDA LASA pair.",
  "relatedDrug": "buPROPion"
}`}
                            />
                            <ul className="doc-field-desc-list">
                                <li><code className="doc-inline-code">id</code>: Unique question identifier (e.g. <code className="doc-inline-code">q101</code>).</li>
                                <li><code className="doc-inline-code">type</code>: Question format. Currently supported: <code className="doc-inline-code">tall_man</code>, <code className="doc-inline-code">matching</code>, <code className="doc-inline-code">multiple_choice</code>, <code className="doc-inline-code">true_false</code>.</li>
                                <li><code className="doc-inline-code">lasaId</code>: Reference to the underlying LASA pair in <code className="doc-inline-code">lasaData.json</code>.</li>
                                <li><code className="doc-inline-code">prompt</code>: The question prompt displayed to the learner.</li>
                                <li><code className="doc-inline-code">choices</code>: Array of selectable text options (for choice questions).</li>
                                <li><code className="doc-inline-code">pairs</code>: Array of <code className="doc-inline-code">{`{ left, right }`}</code> objects (for <code className="doc-inline-code">matching</code> questions).</li>
                                <li><code className="doc-inline-code">correctAnswer</code>: Exact string match for choice questions.</li>
                                <li><code className="doc-inline-code">explanation</code>: Detailed clinical rationale displayed in the feedback drawer.</li>
                                <li><code className="doc-inline-code">relatedDrug</code>: Highlighted drug name shown in the feedback banner.</li>
                            </ul>

                            <h3 className="heading-sm doc-subsection-title">6.5 Matching Question Schema</h3>
                            <p className="doc-paragraph">
                                Tap-to-match questions challenge learners to link pairs dynamically:
                            </p>
                            <JsonSnippet
                                label="matching-question-example.json"
                                code={`{
  "id": "q403",
  "type": "matching",
  "prompt": "Match each medication with its documented confusable counterpart:",
  "pairs": [
    { "left": "Activase", "right": "TNKase" },
    { "left": "Actonel", "right": "Actos" },
    { "left": "Adacel (Tdap)", "right": "Daptacel (DTaP)" },
    { "left": "ado-trastuzumab", "right": "trastuzumab" }
  ],
  "explanation": "Activase and TNKase are both thrombolytics with distinct dosing protocols...",
  "relatedDrug": "Activase"
}`}
                            />

                            <h3 className="heading-sm doc-subsection-title">6.6 Tall Man Lettering Question Schema (<code className="doc-inline-code">tall_man</code>)</h3>
                            <p className="doc-paragraph">
                                A dedicated constructed-response activity requiring learners to actively generate the capitalized Tall Man segments for verified drug names, replacing passive multiple-choice guessing. Tall Man questions operate in two distinct pedagogical modes:
                            </p>
                            <ol className="doc-step-list">
                                <li><strong>Guided Practice Mode (<code className="doc-inline-code">scaffold: true</code>):</strong> Provides prefix/suffix frames and a live interactive reconstructed drug name preview.</li>
                                <li><strong>Unit Final Mastery Mode (<code className="doc-inline-code">scaffold: false</code>, <code className="doc-inline-code">activityRole: &quot;unit_mastery&quot;</code>):</strong> Removes all affix frames and live preview; requires unassisted input of the complete orthographic name with strict case-sensitive validation.</li>
                            </ol>
                            <JsonSnippet
                                label="tall-man-guided-example.json"
                                code={`{
  "id": "q201",
  "type": "tall_man",
  "lasaId": "lasa-004",
  "prompt": "Convert this drug name to Tall Man lettering by entering the letters that should be capitalized:",
  "standardName": "acetazolamide",
  "tallManName": "acetaZOLAMIDE",
  "prefix": "aceta",
  "expectedSegment": "ZOLAMIDE",
  "suffix": "",
  "explanation": "acetaZOLAMIDE capitalizes ZOLAMIDE to emphasize differences from acetaminophen and acetoHEXAMIDE.",
  "relatedDrug": "acetaZOLAMIDE"
}`}
                            />
                            <JsonSnippet
                                label="tall-man-mastery-example.json"
                                code={`{
  "id": "q106_mastery",
  "type": "tall_man",
  "activityRole": "unit_mastery",
  "isFinalTask": true,
  "scaffold": false,
  "lasaId": "lasa-020",
  "prompt": "FINAL UNIT MASTERY TASK: Type the complete drug name using correct Tall Man lettering (capitalizing the specific distinguishing letters):",
  "standardName": "prednisone",
  "tallManName": "predniSONE",
  "prefix": "",
  "expectedSegment": "predniSONE",
  "suffix": "",
  "explanation": "ISMP recommends predniSONE to emphasize the SONE ending, distinguishing it from prednisoLONE.",
  "relatedDrug": "predniSONE"
}`}
                            />
                            <ul className="doc-field-desc-list">
                                <li><code className="doc-inline-code">standardName</code>: Un-capitalized generic drug name displayed in the reference card.</li>
                                <li><code className="doc-inline-code">tallManName</code>: Authoritative ISMP 2023 Tall Man representation.</li>
                                <li><code className="doc-inline-code">prefix</code>: Leading uncapitalized letters displayed in guided construction frame (empty in mastery tasks).</li>
                                <li><code className="doc-inline-code">expectedSegment</code>: Uppercase segment required in guided mode, or full Tall Man name in mastery mode.</li>
                                <li><code className="doc-inline-code">suffix</code>: Trailing uncapitalized letters displayed after the input field (if applicable).</li>
                                <li><code className="doc-inline-code">scaffold</code>: Boolean flag. Set <code className="doc-inline-code">false</code> for unassisted mastery tasks; omitted or <code className="doc-inline-code">true</code> for guided practice.</li>
                                <li><code className="doc-inline-code">activityRole / isFinalTask</code>: Flags the question as the concluding unit evaluation milestone.</li>
                                <li><code className="doc-inline-code">Evaluation Logic</code>: In guided mode, input is case-insensitive for the target segment. In mastery mode, strict case-sensitive match (<code className="doc-inline-code">inputTrimmed === targetTallMan</code>) is enforced.</li>
                                <li><code className="doc-inline-code">Feedback Behavior</code>: On submission, both correct and incorrect outcomes display the verified Tall Man representation in the feedback drawer along with educational clinical rationale.</li>
                            </ul>

                            <h3 className="heading-sm doc-subsection-title">6.7 Situational LASA Question Schema</h3>
                            <p className="doc-paragraph">
                                Situational questions test the learner&apos;s ability to recognize and distinguish verified LASA medication names within realistic dispensing and prescription verification contexts, strictly without testing clinical pharmacology, dosage, or treatment decisions:
                            </p>
                            <JsonSnippet
                                label="situational-question-example.json"
                                code={`{
  "id": "q105_sit",
  "type": "multiple_choice",
  "lasaId": "lasa-002",
  "scenario": "A patient presents a written prescription order for Accupril. The dispensary shelf stores multiple medications with similar phonemic and visual names.",
  "prompt": "Which medication name matches the prescription order and avoids a look-alike mix-up with Aciphex?",
  "choices": [
    "Accupril",
    "Aciphex"
  ],
  "correctAnswer": "Accupril",
  "explanation": "Accupril must be distinguished from Aciphex to prevent dispensing confusion.",
  "relatedDrug": "Accupril"
}`}
                            />
                            <ul className="doc-field-desc-list">
                                <li><code className="doc-inline-code">scenario</code>: Concrete situational narrative providing dispensing context (rendered in a distinctive green scenario card with a &quot;DISPENSING SCENARIO&quot; badge).</li>
                                <li><code className="doc-inline-code">prompt</code>: Direct LASA recognition or distinction prompt testing medication name selection.</li>
                                <li><code className="doc-inline-code">choices</code>: Confusable LASA options derived strictly from verified ISMP pairs.</li>
                                <li><code className="doc-inline-code">correctAnswer</code>: Target medication matching the order.</li>
                            </ul>
                        </section>
                    )}

                    {/* SECTION 7: LASA SYSTEM */}
                    {isMatch("lasa system tall man data ismp drugs generic brand pair") && (
                        <section id="lasa-system" className="doc-section-card duo-card">
                            <div className="doc-section-header">
                                <div className="doc-section-title-wrap">
                                    <Pill size={22} className="doc-section-icon" />
                                    <h2 className="heading-lg">7. LASA Knowledge & Data</h2>
                                </div>
                                <StatusBadge status="Implemented" />
                            </div>

                            <p className="doc-paragraph">
                                Look-Alike, Sound-Alike medication data is managed as structured educational datasets rather than hardcoded UI strings.
                            </p>

                            <h3 className="heading-sm doc-subsection-title">Verified Source Dataset (<code className="doc-inline-code">src/data/lasaData.json</code>)</h3>
                            <ul className="doc-bullet-list">
                                <li><strong>Source:</strong> Institute for Safe Medication Practices (ISMP). <em>List of Confused Drug Names (2023)</em>.</li>
                                <li><strong>Initial Prototype Corpus:</strong> 26 verified pairs partitioned across 5 reference level groupings.</li>
                                <li><strong>Reference Schema:</strong> Each entry specifies a unique identifier (<code className="doc-inline-code">lasa-001</code>), primary drug name, confused counterpart, and target level container.</li>
                            </ul>

                            <h3 className="heading-sm doc-subsection-title">Tall Man Lettering (<code className="doc-inline-code">TallManText.jsx</code>)</h3>
                            <p className="doc-paragraph">
                                The application supports FDA/ISMP Tall Man lettering conventions (e.g., <code className="doc-inline-code">DOPamine</code> vs <code className="doc-inline-code">DOBUTamine</code>, <code className="doc-inline-code">vinBLAStine</code> vs <code className="doc-inline-code">vinCRIStine</code>).
                                The <code className="doc-inline-code">&lt;TallManText /&gt;</code> component identifies capitalized letter sequences and wraps them in specialized styling (<code className="doc-inline-code">.tall-man-upper</code>) with distinct color highlights to disrupt habitual orthographic scanning errors.
                            </p>
                        </section>
                    )}

                    {/* SECTION 8: USER PROGRESS & PERSISTENCE */}
                    {isMatch("user progress state localstorage xp streak hearts events sync temporary prototype database") && (
                        <section id="user-progress" className="doc-section-card duo-card">
                            <div className="doc-section-header">
                                <div className="doc-section-title-wrap">
                                    <UserCheck size={22} className="doc-section-icon" />
                                    <h2 className="heading-lg">8. User State & Persistence (Temporary Prototype)</h2>
                                </div>
                                <StatusBadge status="Prototype Persistence" />
                            </div>

                            <div className="doc-callout warning">
                                <ShieldAlert size={20} />
                                <div>
                                    <strong>Architectural Notice — Temporary Prototype Storage:</strong>
                                    <br />
                                    The current implementation uses browser <code className="doc-inline-code">localStorage</code> solely as <strong>temporary prototype storage</strong> so user XP, streaks, and level progression survive page reloads during early UX development.
                                    This is <strong>NOT</strong> the final persistence architecture.
                                </div>
                            </div>

                            <h3 className="heading-sm doc-subsection-title">Current vs. Future Architecture</h3>
                            <div className="doc-architecture-compare-grid">
                                <div className="doc-arch-box current">
                                    <span className="doc-arch-tag">Current Prototype (Phase 2)</span>
                                    <div className="doc-arch-flow">
                                        <span>UI Components</span>
                                        <ArrowRight size={14} />
                                        <span>Async Services (<code className="doc-inline-code">userService.js</code>)</span>
                                        <ArrowRight size={14} />
                                        <span>Browser <code className="doc-inline-code">localStorage</code></span>
                                        <ArrowRight size={14} />
                                        <span>Single-User Simulation</span>
                                    </div>
                                    <p className="doc-arch-note">
                                        Data is stored locally under key <code className="doc-inline-code">duoclongo_user_progress</code>. No network requests, authentication tokens, or cross-device sync exist yet.
                                    </p>
                                </div>

                                <div className="doc-arch-box future">
                                    <span className="doc-arch-tag future-tag">Future Production (Phase 4)</span>
                                    <div className="doc-arch-flow">
                                        <span>UI Components</span>
                                        <ArrowRight size={14} />
                                        <span>Domain Services</span>
                                        <ArrowRight size={14} />
                                        <span>Authenticated Backend</span>
                                        <ArrowRight size={14} />
                                        <span>Supabase / PostgreSQL</span>
                                    </div>
                                    <p className="doc-arch-note">
                                        Learner progress will transition to normalized relational tables (<code className="doc-inline-code">users</code>, <code className="doc-inline-code">user_progress</code>, <code className="doc-inline-code">level_attempts</code>) secured by authenticated JWT sessions.
                                    </p>
                                </div>
                            </div>

                            <h3 className="heading-sm doc-subsection-title">Why the Current Service Layer is Migration-Friendly</h3>
                            <ul className="doc-bullet-list">
                                <li><strong>Zero Direct UI Coupling:</strong> No React component directly accesses <code className="doc-inline-code">localStorage</code>. All reads and writes pass through <code className="doc-inline-code">getCurrentUser()</code>, <code className="doc-inline-code">getUserById()</code>, and <code className="doc-inline-code">updateUserProgress()</code> in <code className="doc-inline-code">src/services/userService.js</code>.</li>
                                <li><strong>Async Service Signatures:</strong> All user service methods are asynchronous and return Promises. Replacing <code className="doc-inline-code">localStorage</code> with API calls will not require changes to UI component call sites.</li>
                                <li><strong>Spaced Repetition (SRS) State Machine:</strong> Persists an <code className="doc-inline-code">srs_records</code> dictionary mapping each tested LASA pair ID to its memory retention state:
                                    <pre className="doc-code-inline-block">
{`"srs_records": {
  "lasa-001": {
    "lasaId": "lasa-001",
    "stage": 3,
    "consecutiveCorrect": 3,
    "lastReviewed": 1725960000000,
    "nextReviewDue": 1726564800000,
    "mistakeCount": 0,
    "successCount": 4
  }
}`}
                                    </pre>
                                </li>
                                <li><strong>Unified Mistake Queue:</strong> Tracks unredeemed errors across all lessons and practice modes via <code className="doc-inline-code">user.mistakes_queue</code> (array of question ID strings). Missed questions are automatically enqueued; correct answers during practice redeem and remove them.</li>
                                <li><strong>Event Synchronization:</strong> Dispatches <code className="doc-inline-code">duoclongo:user-updated</code> events on <code className="doc-inline-code">window</code>, allowing open components to update stats in real time.</li>
                            </ul>
                        </section>
                    )}

                    {/* SECTION 9: ARCHITECTURE & DATA FLOW */}
                    {isMatch("architecture tech stack client vite react router css modular files") && (
                        <section id="architecture" className="doc-section-card duo-card">
                            <div className="doc-section-header">
                                <div className="doc-section-title-wrap">
                                    <Cpu size={22} className="doc-section-icon" />
                                    <h2 className="heading-lg">9. Architecture & Data Flow</h2>
                                </div>
                                <StatusBadge status="Implemented" />
                            </div>

                            <p className="doc-paragraph">
                                Duoclongo is built as a lightweight, performant single-page application using modern web primitives:
                            </p>

                            <div className="doc-table-wrapper">
                                <table className="doc-table">
                                    <thead>
                                        <tr>
                                            <th>Layer</th>
                                            <th>Technologies & Patterns</th>
                                            <th>Responsibility</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>Framework & Bundler</strong></td>
                                            <td>React 19, Vite 8</td>
                                            <td>Component lifecycle, JSX compilation, HMR dev server</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Routing</strong></td>
                                            <td>React Router 7</td>
                                            <td>URL matching, nested layouts, parameter extraction</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Styling</strong></td>
                                            <td>Vanilla CSS + Custom Properties</td>
                                            <td>Centralized design tokens (<code className="doc-inline-code">--color-primary</code>, etc.), mobile media queries</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Iconography</strong></td>
                                            <td>Lucide React</td>
                                            <td>Vector UI icons (badges, status flags, navigation)</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Curriculum Data</strong></td>
                                            <td>Modular JSON (<code className="doc-inline-code">levels/section-N/unit-M.json</code>)</td>
                                            <td>Independent section/unit definition preventing data bottlenecks</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Domain Services</strong></td>
                                            <td><code className="doc-inline-code">drugService</code>, <code className="doc-inline-code">lessonService</code>, <code className="doc-inline-code">practiceService</code>, <code className="doc-inline-code">userService</code>, <code className="doc-inline-code">unitService</code></td>
                                            <td>Decoupled async service facades abstracting data access</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* SECTION 10: CURRENT LIMITATIONS */}
                    {isMatch("limitations missing incomplete mock boundaries backend auth") && (
                        <section id="limitations" className="doc-section-card duo-card">
                            <div className="doc-section-header">
                                <div className="doc-section-title-wrap">
                                    <AlertTriangle size={22} className="doc-section-icon" />
                                    <h2 className="heading-lg">10. Current Limitations & Roadmap Boundaries</h2>
                                </div>
                                <StatusBadge status="Prototype / Boundaries" />
                            </div>

                            <p className="doc-paragraph">
                                To assist research paper authors, developers, and reviewers, the table below explicitly delineates implemented functionality from known system limitations:
                            </p>

                            <div className="doc-table-wrapper">
                                <table className="doc-table">
                                    <thead>
                                        <tr>
                                            <th>Subsystem</th>
                                            <th>Current Reality</th>
                                            <th>Roadmap Phase</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>Backend & Database</strong></td>
                                            <td>Purely client-side. Data loaded from static JSON and saved to browser <code className="doc-inline-code">localStorage</code>. No remote server or SQL/NoSQL database exists.</td>
                                            <td>Phase 4</td>
                                        </tr>
                                        <tr>
                                            <td><strong>User Authentication</strong></td>
                                            <td>Single local profile. No user registration, password hashing, JWT sessions, or multi-account switching.</td>
                                            <td>Phase 4</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Practice Mode &amp; SRS</strong></td>
                                            <td>Implemented (Phase 3). Fully operational 4-Stage Leitner Spaced Repetition System with interval timers (0h, 24h, 72h, 168h), Unified Mistakes Queue, and 3 practice modes (Daily Spaced Review, Targeted Mistakes Review, Quick Practice). Cloud synchronization to Supabase planned for Phase 4.</td>
                                            <td>Phase 3 (Active)</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Question Formats</strong></td>
                                            <td>Supports constructed-response Tall Man lettering (<code className="doc-inline-code">tall_man</code>) in both guided scaffolding (affix frames + preview) and unassisted Unit Mastery mode (strict case-sensitive recall), situational recognition (<code className="doc-inline-code">multiple_choice</code> with dispensing <code className="doc-inline-code">scenario</code>), interactive tap-to-match pairs (<code className="doc-inline-code">matching</code>), and binary distinction choice (<code className="doc-inline-code">multiple_choice</code>). Full clinical dispensing simulation scenarios and crosswords remain future thesis phases.</td>
                                            <td>Active (Tall Man Mastery + Situational + Guided + Matching + Choice)</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Theoretical &amp; Clinical Questions</strong></td>
                                            <td>Intentionally removed from active curriculum and safely archived in <code className="doc-inline-code">src/data/curriculum/deferredTheoreticalQuestions.json</code>. The active beta strictly focuses on orthographic name recognition, distinction, and Tall Man construction. Questions on ISMP regulatory theory, drug mechanisms, disease pathology, indications, and clinical decision-making are reserved for future research phases.</td>
                                            <td>Deferred to Future Research / Clinical Phase</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Quests & Leaderboards</strong></td>
                                            <td>Static placeholders. Daily challenges, league brackets, and multiplayer cohort rankings are not yet implemented.</td>
                                            <td>Phase 5</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Sound & Pronunciation</strong></td>
                                            <td>Phonetic text comparisons are present, but native audio pronunciation synthesis or recorded voice clips are not yet integrated.</td>
                                            <td>Phase 8</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="doc-callout warning">
                                <ShieldAlert size={18} />
                                <div>
                                    <strong>Research & Medical Claims Note:</strong> Duoclongo does not currently make empirical claims regarding clinical dispensing error reduction in real hospital environments. The application is an educational prototype simulating recognition practice based on published ISMP lists.
                                </div>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Documentation;
