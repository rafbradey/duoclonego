# LASA-Quest — Rebranding and Thesis-to-System Audit Checklist

**Project Name**: LASA-Quest *(formerly demo-named Duoclongo)*  
**Repository**: `rafbradey/duoclonego`  
**Current Date**: 2026-10-03  
**Status Key**:
- `[ ]` Not started
- `[~]` In progress
- `[x]` Verified complete
- `[!]` Blocked or requires a decision

---

## Stage 1 — Rename Duoclongo to LASA-Quest

- [x] Application HTML title updated to `LASA-Quest` in [`index.html`](file:///d:/3/duoclonego/index.html#L7)
- [x] Desktop Sidebar logo text updated to `LASA-Quest` in [`Sidebar.jsx`](file:///d:/3/duoclonego/src/components/Sidebar/Sidebar.jsx#L113)
- [x] Global Top Navbar brand & aria-label updated to `LASA-Quest` in [`Navbar.jsx`](file:///d:/3/duoclonego/src/components/Navbar/Navbar.jsx#L9-L14)
- [x] Mobile Header brand & drawer titles updated to `LASA-Quest` in [`AppLayout.jsx`](file:///d:/3/duoclonego/src/components/Layout/AppLayout.jsx#L92-L96)
- [x] Mascot accessibility alt text updated to `LASA-Quest mascot` in [`Mascot.jsx`](file:///d:/3/duoclonego/src/components/Mascot/Mascot.jsx#L34)
- [x] Login page title, brand header, and submit heading updated to `LASA-Quest` in [`Login.jsx`](file:///d:/3/duoclonego/src/pages/Login/Login.jsx#L77-L93)
- [x] Item Shop catalog, unequip title, section descriptions, and toasts updated to `LASA-Quest` in [`Shop.jsx`](file:///d:/3/duoclonego/src/pages/Shop/Shop.jsx#L90-L97)
- [x] Theme catalog default name updated to `Classic LASA-Quest` in [`themes.js`](file:///d:/3/duoclonego/src/data/themes.js#L332-L342)
- [x] User Profile fallback theme label updated to `Classic LASA-Quest` in [`Profile.jsx`](file:///d:/3/duoclonego/src/pages/Profile/Profile.jsx#L215)
- [x] Theme Preview Lab mock brand updated to `LASA-Quest` in [`ThemePreview.jsx`](file:///d:/3/duoclonego/src/pages/ThemePreview/ThemePreview.jsx#L320)
- [x] CSS stylesheet headers updated across [`themes.css`](file:///d:/3/duoclonego/src/styles/themes.css#L2), [`Shop.css`](file:///d:/3/duoclonego/src/pages/Shop/Shop.css#L2), [`Leaderboards.css`](file:///d:/3/duoclonego/src/pages/Leaderboards/Leaderboards.css#L2), [`index.css`](file:///d:/3/duoclonego/src/index.css#L28), and [`QuestionInfoModal.css`](file:///d:/3/duoclonego/src/components/QuestionCard/QuestionInfoModal.css#L4)
- [x] Living in-app documentation updated with title `LASA-Quest System Reference` and historical demo note in [`Documentation.jsx`](file:///d:/3/duoclonego/src/pages/Documentation/Documentation.jsx#L163-L245)
- [x] Root project [`README.md`](file:///d:/3/duoclonego/README.md#L1-L5) updated to introduce `LASA-Quest (formerly Duoclongo)`
- [x] Core service header comments updated across [`badgeService.js`](file:///d:/3/duoclonego/src/services/badgeService.js), [`leaderboardService.js`](file:///d:/3/duoclonego/src/services/leaderboardService.js), [`lessonService.js`](file:///d:/3/duoclonego/src/services/lessonService.js), [`questionGenerator.js`](file:///d:/3/duoclonego/src/services/questionGenerator.js), [`shopService.js`](file:///d:/3/duoclonego/src/services/shopService.js), [`streakService.js`](file:///d:/3/duoclonego/src/services/streakService.js), and [`supabaseClient.js`](file:///d:/3/duoclonego/src/services/supabaseClient.js)
- [x] Curriculum scope archive comment updated in [`deferredTheoreticalQuestions.json`](file:///d:/3/duoclonego/src/data/curriculum/deferredTheoreticalQuestions.json#L4)
- [x] Database migration and RLS schema headers updated in [`supabase_schema.sql`](file:///d:/3/duoclonego/src/data/supabase_schema.sql#L2)
- [x] Internal CLI script banners updated in [`generateLasaAudio.js`](file:///d:/3/duoclonego/scripts/generateLasaAudio.js), [`validateLasaAudio.js`](file:///d:/3/duoclonego/scripts/validateLasaAudio.js), and [`verifyOptionA.js`](file:///d:/3/duoclonego/scripts/verifyOptionA.js)
- [x] Architecture guides updated in [`agents/docs/`](file:///d:/3/duoclonego/agents/docs/) preserving historical transition context
- [x] Post-rename codebase scan performed; remaining occurrences cataloged and justified (technical internal identifiers & historical explanations)

---

## Stage 2 — Establish the Thesis as a Comparison Source

- [x] Locate thesis document in [`./agents/research/`](file:///d:/3/duoclonego/agents/research/)
- [x] Confirm exact filename: [`CNS-PROPOSAL-THESIS-DOCUMENT-1 (2).docx`](file:///d:/3/duoclonego/agents/research/CNS-PROPOSAL-THESIS-DOCUMENT-1%20(2).docx)
- [x] Verify thesis metadata: Mapúa University Makati School of Information Technology, Course ITS200-1, Authors: Convento, Narvaez, Sable; Adviser: Antonette D. Gabriel (Sept 2026)
- [x] Explicitly note: **The existing proposed process-flow diagram (Figure 3.2, p. 264-270) is known to be incorrect**
- [x] Flag Figure 3.2 and its accompanying narrative description for subsequent correction
- [x] Enforce constraint: Do NOT copy, reproduce, or adopt Figure 3.2 as an authoritative specification
- [x] Enforce constraint: Do NOT invent a replacement process flow during this audit

---

## Stage 3 — Create Persistent Audit Files

- [x] Create `./agents/LASA_QUEST_REBRANDING_CHECKLIST.md` tracking all stages with status indicators
- [x] Create `./agents/LASA_QUEST_THESIS_SYSTEM_AUDIT.md` providing comprehensive paper-vs-system audit
- [x] Establish evidence standards: citation of thesis paragraphs, file paths, line ranges, and verified behaviors

---

## Stage 4 — Audit What the Paper Says versus What the System Does

- [x] Objectives and scope (General & specific objectives, 5 challenge modes vs real system curriculum)
- [x] Functional requirements and proposed features
- [x] Proposed system architecture (Client SPA + Supabase Cloud vs generic web description)
- [x] User roles, authentication, and session persistence (Pure Login-Required Option A with Supabase Auth & RLS)
- [x] Learning activities and question types (Type A Tall Man MCQ, Type B Pair MCQ, Type C Tap-to-Match, Type D Unassisted Constructed, Auditory Read-Back)
- [x] LASA medication data and Tall Man lettering (50 pairs in `lasaPairs.json`, ISMP 2023 / FDA Table 1 grounding, strict three-tier data separation)
- [x] Audio and pronunciation functionality (100% pre-rendered static HTML5 audio in `public/audio/lasa/*.mp3`, zero runtime Azure API calls)
- [x] Feedback, scoring, XP, hearts, streaks, diamonds, and rewards
- [x] Levels, units, mastery, and progression tracking (4 Units, 24 Levels, Leitner 4-stage SRS engine)
- [x] Profiles, achievements, and leaderboard
- [x] Item Shop, diamonds economy, and 15 customization themes across 4 rarity tiers
- [x] Evaluation and testing requirements (25-item test, PSSUQ 7-point Likert scale)
- [x] SDLC & methodology (Iterative-Incremental model, 4 planned increments)
- [x] Flagged process-flow diagram analysis (Discrepancy audit of Figure 3.2)

---

## Stage 5 — Build a Bidirectional Comparison Matrix

- [x] Compile Section A: Requirements in Thesis but Missing or Incomplete in System
- [x] Compile Section B: Implemented Features in System Missing or Unmentioned in Thesis
- [x] Structured 7-column comparative table with Classifications 1 to 6
- [x] Recommended action and rationale for every identified discrepancy
- [x] Clear demarcation of findings requiring user/stakeholder decisions

---

## Stage 6 — Verify Actual Learning Scope

- [x] Verify canonical LASA data grounding (`src/data/lasaPairs.json` derived strictly from ISMP 2023 / FDA Table 1)
- [x] Verify exact Tall Man lettering capitalization rules preserved in answers and distractors
- [x] Verify required medication pairs receive full curriculum coverage (100% coverage verified by `curriculumCoverageService.js`)
- [x] Verify sound-alike activities use verified phonetic confusion pairs
- [x] Verify audio subsystem uses offline static MP3 architecture (`public/audio/lasa/*.mp3`) with zero runtime cloud API calls
- [x] Verify question feedback and reference information are grounded in authoritative source metadata
- [x] Verify question presentation does not spoil answers prior to learner submission
- [x] Confirm theoretical/clinical pharmacology items are quarantined in `deferredTheoreticalQuestions.json` to prevent scope creep

---

## Stage 7 — Verify Application Feature Behavior

- [x] Authentication & Route Protection (`ProtectedRoute.jsx`, `/login`, Supabase Auth session)
- [x] Dashboard & Learning Path Navigation (`Learn.jsx`, `Sidebar.jsx`, `AppLayout.jsx`)
- [x] Question Generation & Runtime Validation (`questionGenerator.js`, `curriculumCoverageService.js`)
- [x] Feedback, Deductions & Heart System (`FeedbackDrawer.jsx`, `userService.js`, clamping 0–500)
- [x] Spaced Repetition Hub & Practice Modes (`Practice.jsx`, due review, mistakes queue, quick drill, audio challenge)
- [x] Quests & Gamification Rewards (`Quests.jsx`, daily quest progress and claiming)
- [x] Item Shop Purchases & Theme Customizations (`Shop.jsx`, `shopService.js`, 15 themes, atomicity)
- [x] User Profile & Achievements (`Profile.jsx`, `badgeService.js`, 12 achievements)
- [x] Static Audio Playback & Graceful Degradation (`AudioPronounceButton.jsx`, `audioPlayerService.js`)
- [x] Responsive Layouts (Mobile header, drawer, desktop sidebar, touch targets)
- [x] Database Schema & RLS Policies (`supabase_schema.sql`)

---

## Stage 8 — Correct Branding, Preserve Historical Truth, and Flag Thesis

- [x] Complete branding changes across application UI and project-owned documentation
- [x] Catalog all remaining occurrences of `duoclongo` with justification
- [x] Formally record thesis passages and diagrams requiring attention
- [x] Flag Figure 3.2 for separate post-audit redesign

---

## Stage 9 — Final Verification and Report

- [x] Codebase scan for remaining branding references
- [x] ESLint validation (`npm run lint`: 0 errors)
- [x] Production build validation (`npm run build`: Success in 1.31s)
- [x] Option A architectural check (`scripts/verifyOptionA.js` executed and analyzed)
- [x] Summarize decisions requiring approval
- [x] Present comprehensive audit findings and prioritized next steps to user

---

## Stage 10 — Scope Cleanup Planning (Leaderboards & In-App Documentation)

- [x] Inventory all Leaderboard UI entry points ([`Sidebar.jsx`](file:///d:/3/duoclonego/src/components/Sidebar/Sidebar.jsx), [`MobileNav.jsx`](file:///d:/3/duoclonego/src/components/MobileNav/MobileNav.jsx), [`ThemePreview.jsx`](file:///d:/3/duoclonego/src/pages/ThemePreview/ThemePreview.jsx))
- [x] Inventory Leaderboard pages, styles, routes, and services ([`Leaderboards.jsx`](file:///d:/3/duoclonego/src/pages/Leaderboards/Leaderboards.jsx), [`Leaderboards.css`](file:///d:/3/duoclonego/src/pages/Leaderboards/Leaderboards.css), [`leaderboardService.js`](file:///d:/3/duoclonego/src/services/leaderboardService.js))
- [x] Confirm backend impact (no custom table drops; only reads `public.profiles`)
- [x] Protect shared learner XP, level attempt logs, and achievement badges from deletion
- [x] Verify thesis mentions of leaderboards (0 occurrences found in `CNS-PROPOSAL-THESIS-DOCUMENT-1 (2).docx`)
- [x] Inventory all In-App Documentation entry points ([`Navbar.jsx`](file:///d:/3/duoclonego/src/components/Navbar/Navbar.jsx), [`Sidebar.jsx`](file:///d:/3/duoclonego/src/components/Sidebar/Sidebar.jsx), [`App.jsx`](file:///d:/3/duoclonego/src/App.jsx))
- [x] Execute clean removal of Leaderboards and In-App Documentation (Routes, UI links, pages, and services removed; XP & Badge systems preserved)

---

## Stage 11 — Deliverables for Thesis Groupmates & Decision Register

- [x] Create editable Markdown thesis revision report: [`./agents/outputs/LASA_QUEST_THESIS_REVISION_REPORT.md`](file:///d:/3/duoclonego/agents/outputs/LASA_QUEST_THESIS_REVISION_REPORT.md)
- [x] Generate formatted PDF report for groupmates: [`./agents/outputs/LASA_QUEST_THESIS_REVISION_REPORT.pdf`](file:///d:/3/duoclonego/agents/outputs/LASA_QUEST_THESIS_REVISION_REPORT.pdf) (357 KB)
- [x] Create persistent decision register: [`./agents/LASA_QUEST_DECISION_REGISTER.md`](file:///d:/3/duoclonego/agents/LASA_QUEST_DECISION_REGISTER.md)
- [!] Await decision register approval before making further code changes or rewriting thesis content
