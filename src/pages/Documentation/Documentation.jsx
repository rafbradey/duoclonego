import { useState, useMemo } from "react";
import {
    BookOpen,
    Compass,
    GraduationCap,
    Pill,
    UserCheck,
    Cpu,
    AlertTriangle,
    Search,
    CheckCircle2,
    Clock,
    Sparkles,
    ShieldAlert
} from "lucide-react";
import "./Documentation.css";

const LAST_UPDATED = "September 10, 2026";
const APP_VERSION = "v0.2.0 (Phase 2 Complete)";

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
    }

    return (
        <span className={`doc-status-badge ${badgeClass}`}>
            <span className="badge-dot" />
            {label}
        </span>
    );
}

function Documentation() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSection, setActiveSection] = useState("overview");

    const sections = [
        { id: "overview", label: "Overview", icon: BookOpen },
        { id: "getting-around", label: "Getting Around & Routes", icon: Compass },
        { id: "current-features", label: "Current Features", icon: Sparkles },
        { id: "learning-system", label: "Learning System & Pedagogy", icon: GraduationCap },
        { id: "lasa-system", label: "LASA Knowledge & Data", icon: Pill },
        { id: "user-progress", label: "User State & Persistence", icon: UserCheck },
        { id: "architecture", label: "Architecture & Data Flow", icon: Cpu },
        { id: "limitations", label: "Current Limitations", icon: AlertTriangle }
    ];

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
                        Real-time reference of implemented functionality, learning science architecture, LASA pharmacology models, and active system boundaries.
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
                    placeholder="Search documentation sections, routes, components, or services..."
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
                {/* Navigation TOC Rail */}
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
                                        <Icon size={17} className="doc-toc-icon" />
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
                    {isMatch("overview purpose goal north star medical pharmacology") && (
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
                                            <th>Layout</th>
                                            <th>Current Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><code className="doc-inline-code">/</code></td>
                                            <td>Landing Page (Home)</td>
                                            <td>Independent (Navbar)</td>
                                            <td><StatusBadge status="Implemented" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">/learn</code></td>
                                            <td>Curriculum Dashboard (Learn)</td>
                                            <td>AppLayout (Sidebar + Right Bar)</td>
                                            <td><StatusBadge status="Implemented" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">/lesson/:lessonId</code></td>
                                            <td>Interactive Lesson Runner</td>
                                            <td>Focused Session (No Sidebar)</td>
                                            <td><StatusBadge status="Implemented" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">/practice</code></td>
                                            <td>Targeted Practice Hub</td>
                                            <td>AppLayout</td>
                                            <td><StatusBadge status="Placeholder" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">/quests</code></td>
                                            <td>Daily Quests & Badges</td>
                                            <td>AppLayout</td>
                                            <td><StatusBadge status="Placeholder" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">/leaderboards</code></td>
                                            <td>Weekly League Ranks</td>
                                            <td>AppLayout</td>
                                            <td><StatusBadge status="Placeholder" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">/shop</code></td>
                                            <td>Mascot Item & Boost Shop</td>
                                            <td>AppLayout</td>
                                            <td><StatusBadge status="Placeholder" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">/profile</code></td>
                                            <td>Learner Profile & History</td>
                                            <td>AppLayout</td>
                                            <td><StatusBadge status="Partially Implemented" /></td>
                                        </tr>
                                        <tr>
                                            <td><code className="doc-inline-code">/documentation</code></td>
                                            <td>Living System Documentation</td>
                                            <td>AppLayout</td>
                                            <td><StatusBadge status="Implemented" /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="heading-sm doc-subsection-title">Layout Chrome</h3>
                            <ul className="doc-bullet-list">
                                <li><strong>Sidebar (<code className="doc-inline-code">Sidebar.jsx</code>):</strong> Sticky desktop sidebar on viewports &gt; 768px with <code className="doc-inline-code">100dvh</code> dynamic height and custom scrollbars.</li>
                                <li><strong>Mobile Navigation (<code className="doc-inline-code">MobileNav.jsx</code>):</strong> Fixed bottom navigation bar on viewports &le; 768px with 48&times;48px touch targets.</li>
                                <li><strong>Right Info Rail (<code className="doc-inline-code">RightInfoBar.jsx</code>):</strong> Desktop side rail displaying real-time day streak, remaining hearts, gem count, and profile link.</li>
                            </ul>
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
                                    Presents the value proposition with Duoclongo mascot animation, call-to-action buttons navigating into <code className="doc-inline-code">/learn</code>, and a dynamic bottom ticker displaying common LASA pairs formatted with Tall Man lettering directly loaded from <code className="doc-inline-code">drugService.getAllLasaEntries()</code>.
                                </p>
                            </div>

                            {/* Learn */}
                            <div className="doc-subfeature-block">
                                <div className="doc-subfeature-title-bar">
                                    <h3 className="heading-sm">3.2 Curriculum Tree (<code className="doc-inline-code">/learn</code>)</h3>
                                    <StatusBadge status="Implemented" />
                                </div>
                                <p className="doc-paragraph">
                                    The primary educational hub. Renders sequential Unit cards containing visual progression paths. Each level node resolves its status dynamically:
                                </p>
                                <ul className="doc-bullet-list">
                                    <li><strong>Completed:</strong> Golden accent ring, checkmark icon, and <code className="doc-inline-code">✓ DONE</code> badge. Users can freely replay completed levels for practice.</li>
                                    <li><strong>Active:</strong> Primary green background with a <code className="doc-inline-code">Star</code> icon and subtle pulse animation inviting interaction. Clicking navigates directly to <code className="doc-inline-code">/lesson/:levelId</code>.</li>
                                    <li><strong>Locked:</strong> Grayed surface with padlock icon; disabled until the preceding prerequisite level is completed.</li>
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
                                    <li><strong>Question Dispatcher:</strong> Evaluates questions through <code className="doc-inline-code">&lt;QuestionRenderer /&gt;</code> supporting multiple choice and true/false variations.</li>
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
                                    <h3 className="heading-sm">3.5 User Profile (<code className="doc-inline-code">/profile</code>)</h3>
                                    <StatusBadge status="Partially Implemented" />
                                </div>
                                <p className="doc-paragraph">
                                    Displays user avatar, display name, username handle, join date, current streak, gem balance, mastery level, and total accumulated XP. Stats synchronize in real time via <code className="doc-inline-code">duoclongo:user-updated</code> events. Currently operates on a local client user profile without multi-user authentication.
                                </p>
                            </div>

                            {/* Stubs / Placeholders */}
                            <div className="doc-subfeature-block">
                                <div className="doc-subfeature-title-bar">
                                    <h3 className="heading-sm">3.6 Gamification & Secondary Hubs</h3>
                                    <StatusBadge status="Placeholder" />
                                </div>
                                <p className="doc-paragraph">
                                    <code className="doc-inline-code">/practice</code>, <code className="doc-inline-code">/quests</code>, <code className="doc-inline-code">/leaderboards</code>, and <code className="doc-inline-code">/shop</code> are structured visual placeholders communicating their scheduled roadmap phases (Phases 3 and 5) while preventing broken navigation links.
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
                                <span className="doc-h-node">Level (1..X)</span>
                                <span className="doc-h-arrow">&rarr;</span>
                                <span className="doc-h-node">Activity</span>
                                <span className="doc-h-arrow">&rarr;</span>
                                <span className="doc-h-node">Question</span>
                            </div>

                            <h3 className="heading-sm doc-subsection-title">The Dynamic X Rule</h3>
                            <p className="doc-paragraph">
                                Unlike systems that enforce arbitrary fixed level counts (e.g. exactly 5 lessons per unit), Duoclongo strictly derives level counts from pedagogical demand:
                                <br />
                                <em>&quot;X is determined by the optimal learning progression for the material, not by an arbitrary constant.&quot;</em>
                                <br />
                                For instance, Unit 1 provides <strong>X = 3</strong> levels (Familiarization &rarr; Tall Man Discrimination &rarr; Clinical Retrieval), whereas Unit 2 currently provides <strong>X = 2</strong> levels (Form Recognition &rarr; Release Mechanism Kinetics).
                            </p>

                            <h3 className="heading-sm doc-subsection-title">Cognitive Science Principles Applied</h3>
                            <ul className="doc-bullet-list">
                                <li><strong>Retrieval Practice:</strong> Learners must actively distinguish between confusable options rather than passively reading drug monographs.</li>
                                <li><strong>Interleaving:</strong> Look-alike and sound-alike counterparts are tested in direct proximity to develop distinct mental representations.</li>
                                <li><strong>Immediate Explanatory Feedback:</strong> Errors trigger immediate explanations detailing the exact pharmacological differences rather than generic failure prompts.</li>
                                <li><strong>Qualitative Progression:</strong> Cognitive demand shifts qualitatively across levels (<code className="doc-inline-code">Familiarization &rarr; Recognition &rarr; Discrimination &rarr; Retrieval</code>).</li>
                            </ul>

                            <h3 className="heading-sm doc-subsection-title">Answer Evaluation & Scoring Engine</h3>
                            <p className="doc-paragraph">
                                Implemented in pure domain logic (<code className="doc-inline-code">src/services/lessonEngine.js</code>) decoupled from React components:
                            </p>
                            <ul className="doc-bullet-list">
                                <li><code className="doc-inline-code">evaluateAnswer(question, selectedAnswer)</code>: Normalizes and verifies user selections, returning correctness and educational context.</li>
                                <li><code className="doc-inline-code">calculateLessonXP(lesson, correctCount, totalQuestions)</code>: Awards baseline XP scaled by session accuracy, with a +5 XP bonus for 100% perfect scores. Minimum reward is 5 XP.</li>
                                <li><code className="doc-inline-code">recordSessionAnswer(session, question, answer)</code>: Immutable progression tracker advancing session state.</li>
                            </ul>
                        </section>
                    )}

                    {/* SECTION 5: LASA SYSTEM */}
                    {isMatch("lasa system tall man data ismp drugs generic brand pair") && (
                        <section id="lasa-system" className="doc-section-card duo-card">
                            <div className="doc-section-header">
                                <div className="doc-section-title-wrap">
                                    <Pill size={22} className="doc-section-icon" />
                                    <h2 className="heading-lg">5. LASA Knowledge & Data</h2>
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

                    {/* SECTION 6: USER PROGRESS & STATE */}
                    {isMatch("user progress state localstorage xp streak hearts events sync") && (
                        <section id="user-progress" className="doc-section-card duo-card">
                            <div className="doc-section-header">
                                <div className="doc-section-title-wrap">
                                    <UserCheck size={22} className="doc-section-icon" />
                                    <h2 className="heading-lg">6. User State & Persistence</h2>
                                </div>
                                <StatusBadge status="Implemented" />
                            </div>

                            <p className="doc-paragraph">
                                User progression is persisted in the client environment via <code className="doc-inline-code">localStorage</code> and synchronized across components using browser custom events.
                            </p>

                            <h3 className="heading-sm doc-subsection-title">User Service Architecture (<code className="doc-inline-code">src/services/userService.js</code>)</h3>
                            <ul className="doc-bullet-list">
                                <li><strong>Storage Key:</strong> <code className="doc-inline-code">duoclongo_user_progress</code>. Automatically restores saved XP, hearts, streak, and completed lessons on app launch, falling back to <code className="doc-inline-code">src/data/user.json</code> if clean.</li>
                                <li><strong>Reactive Synchronization:</strong> Updates trigger a <code className="doc-inline-code">duoclongo:user-updated</code> event on <code className="doc-inline-code">window</code>. Subscribed components (<code className="doc-inline-code">Learn</code>, <code className="doc-inline-code">RightInfoBar</code>, <code className="doc-inline-code">Profile</code>) update their state immediately.</li>
                                <li><strong>Level Completion Handshake:</strong> <code className="doc-inline-code">updateUserProgress({`{ xpToAdd, completedLessonId }`})</code> records completed level IDs and appends XP safely, guarded against duplicate submissions.</li>
                                <li><strong>Reset Utility:</strong> <code className="doc-inline-code">resetUserProgress()</code> clears local storage and resets state back to factory defaults for testing.</li>
                            </ul>
                        </section>
                    )}

                    {/* SECTION 7: ARCHITECTURE & DATA FLOW */}
                    {isMatch("architecture tech stack client vite react router css modular files") && (
                        <section id="architecture" className="doc-section-card duo-card">
                            <div className="doc-section-header">
                                <div className="doc-section-title-wrap">
                                    <Cpu size={22} className="doc-section-icon" />
                                    <h2 className="heading-lg">7. Architecture & Data Flow</h2>
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
                                            <td><code className="doc-inline-code">drugService</code>, <code className="doc-inline-code">lessonService</code>, <code className="doc-inline-code">userService</code></td>
                                            <td>Decoupled async service facades abstracting data access</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* SECTION 8: CURRENT LIMITATIONS */}
                    {isMatch("limitations missing incomplete mock boundaries backend auth") && (
                        <section id="limitations" className="doc-section-card duo-card">
                            <div className="doc-section-header">
                                <div className="doc-section-title-wrap">
                                    <AlertTriangle size={22} className="doc-section-icon" />
                                    <h2 className="heading-lg">8. Current Limitations & Roadmap Boundaries</h2>
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
                                            <td><strong>Practice Mode</strong></td>
                                            <td>Visual placeholder screen. Spaced repetition algorithm (SuperMemo/Leitner) and mistake review queues are not yet active.</td>
                                            <td>Phase 3</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Question Formats</strong></td>
                                            <td>Limited to <code className="doc-inline-code">multiple_choice</code> and <code className="doc-inline-code">true_false</code>. Drag-and-drop matching, syllable tapping, and free-text entry are not yet implemented.</td>
                                            <td>Phase 2+ / 3</td>
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
