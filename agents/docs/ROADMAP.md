# LASA-LOCO (DUOCLONGO) — MASTER PROJECT ROADMAP

> **A Gamified Learning Application for Practicing Look-Alike and Sound-Alike (LASA) Medication Name Recognition among Pharmacy Students**

---

## 1. Core Thesis Mission & Educational Scope

LASA-Quest (formerly Duoclongo / LASA-Loco) addresses **one singular educational problem**:
> **Helping pharmacy learners rapidly recognize, distinguish, and memorize Look-Alike and Sound-Alike (LASA) medication names to prevent clinical medication errors.**

### Four Core Learning Pillars
1. **Look-Alike Visual Recognition**: Differentiating orthographically confusable drug names through active multiple-choice selection and interactive tap-to-match pairing.
2. **Tall Man Lettering Recall & Construction**: Case-sensitive mastery of FDA/ISMP-designated uppercase conventions (e.g., `buPROPion` vs `busPIRone`, `hydrALAZINE` vs `hydrOXYzine`) through constructed fill-in-the-blank and unassisted Unit Mastery Capstones.
3. **Sound-Alike Acoustic & Read-Back Practice**: Auditory recognition and verbal read-back verification of spoken drug names (e.g., distinguishing `cloNIDine` from `clonazePAM` under simulated verbal/telephone prescription conditions).
4. **Spaced Retrieval & Error Remediation**: Long-term memory consolidation using a 4-Stage Leitner Spaced Repetition System (SRS) and targeted mistake re-exposure.

### Non-Goals / Quarantined Scope (Purged from Thesis)
- ❌ **Zero Dispensing Scenarios / Hospital Workflows**: No simulated prescription carts, automated dispensing cabinet (ADC) verification, or bedside nursing narratives.
- ❌ **Zero Barcode Scanning or Clinical Decision Making**: No simulated barcode verification, renal dosing adjustments, drug-drug interactions, or contraindication evaluations.
- ❌ **Zero Brand-to-Generic Translation**: Focus is strictly on **confusable pair discrimination** (Drug A vs Drug B), not memorizing the generic chemical equivalent of a brand name.
- ❌ **Zero Fabricated Pairs or Non-Standard Casing**: Every medication pair and Tall Man convention is grounded strictly in official ISMP and FDA documentation.

---

## 2. Multi-Phase Roadmap Overview

```text
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Core Look-Alike & Tall Man Recognition MVP        [COMPLETED] │
├────────────────────────────────────────────────────────────────────────┤
│ • Canonical 50-Pair FDA/ISMP Dataset (src/data/rawLasaSource.json)     │
│ • 4 Units, 12 Progressive Levels + 4 Unit Mastery Capstones (353 Qs)  │
│ • Interactive Question Runners: MCQ, Tall Man input, Tap-to-Match      │
│ • Real-time Web Audio API Chimes (affirmative chime + error buzzer)    │
│ • Pure Domain Lesson Evaluation Engine (lessonEngine.js)               │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: Spaced Repetition (SRS) & Practice Hub             [COMPLETED] │
├────────────────────────────────────────────────────────────────────────┤
│ • 4-Stage Leitner SRS Retention Engine (0h, 24h, 72h, 168h intervals)  │
│ • Unified Mistakes Queue & Targeted Mistake Remediation                │
│ • 3 Practice Modes: Daily Spaced Review, Mistakes Review, Quick Review │
│ • Review Origin Breadcrumbs (Section • Level • Unit tracking)          │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: Mobile UX, Level Progression & Session Breakdown   [COMPLETED] │
├────────────────────────────────────────────────────────────────────────┤
│ • Mobile Header & Slide-Out Drawer dedicated to the Learning Path      │
│ • Direct Level Completion Routing ([ CONTINUE TO NEXT LEVEL → ])       │
│ • Overhauled Session Breakdown with unified X / Y CORRECT stat card    │
│ • Profile Retention Matrix Dashboard & 12-Badge Tiered Milestone System │
│ • Responsive layout protections across all viewports (320px–1200px)   │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: Sound-Alike Audio & 6-Level Architecture           [COMPLETED] │
├────────────────────────────────────────────────────────────────────────┤
│ • Pre-Generated Azure Speech LASA Audio Pipeline (100 Static Assets)   │
│ • Sound-Alike Acoustic Discrimination Question Type & Read-Back Gate   │
│ • Universal Medication Pronunciation (<AudioPronounceButton />)        │
│ • Standardized 6-Level Architecture across 4 Units (24 Levels, 100% Cov)│
│ • Practice Hub 4th Mode: Sound-Alike Audio Listening Challenge         │
│ • Developer Speech Diagnostic Environment (/test-tts)                  │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 5: In-Session Retry Loop & Functional Hearts Mechanics [ACTIVE]  │
├────────────────────────────────────────────────────────────────────────┤
│ • In-Session Retry Loop: Missed questions re-queued until mastered     │
│ • Functional Heart Depletion: 1 heart lost per mistake during lessons  │
│ • Out-of-Hearts Gating: Zero hearts prompts Practice Hub to refill     │
│ • Gem Utility: Streak freeze & heart refill in Shop                    │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 6: Cloud Persistence & User Accounts             [POST-THESIS]   │
├────────────────────────────────────────────────────────────────────────┤
│ • Supabase / PostgreSQL backend integration                            │
│ • Multi-device cloud synchronization of progress, SRS, and streaks     │
│ (Currently 100% functional via browser LocalStorage persistence)       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Phase Specifications

### Phase 1: Core Look-Alike & Tall Man Recognition (Completed ✅)
- **Dataset**: Built canonical 50-pair repository (`rawLasaSource.json`, `lasaPairs.json`, `lasaData.json`) with full FDA/ISMP proof references, indications, and confusion risks.
- **Curriculum**:
  - Section 1 (Foundations): Unit 1 (Prefixes & Core Stems), Unit 2 (High-Risk Brand Look-Alikes), Unit 3 (Suffix Variants).
  - Section 2 (High-Alert): Unit 1 (Critical Care & Opioids).
  - 16 total levels: 12 progressive curriculum levels + 4 dedicated Unit Mastery Capstone levels.
- **Question Formats**:
  - Multiple Choice discrimination.
  - Constructed Response Tall Man fill-in-the-blank.
  - Interactive tap-to-match pairs.

---

### Phase 4: Sound-Alike Audio & 6-Level Architecture Overhaul (Completed ✅)
*The Sound-Alike half of LASA-Loco has been fully integrated and deployed with zero runtime cloud overhead.*

- **Pre-Generated LASA Audio Pipeline (Azure AI Speech)**:
  - 100/100 verified medication pronunciation `.mp3` clips generated via `scripts/generateLasaAudio.js` (`npm run generate:lasa-audio`) using Azure Neural TTS (`en-US-JennyNeural`, raw mode) and permanently archived in `public/audio/lasa/`.
  - Fast, deterministic lookup via `src/data/audioMapping.json` and complete provenance audit trail via `src/data/audioManifest.json`.
  - Zero runtime Azure API calls, zero cloud latency, zero credential leakage in client bundles.
  - Automated integrity validator (`npm run validate:lasa-audio`) guarantees 100% coverage and zero broken links.
- **Universal Medication Pronunciation (`<AudioPronounceButton />`)**:
  - Reusable component seamlessly integrated across Multiple Choice, Tall Man Construction (guided & mastery), Sound-Alike questions, and Guidebook cards.
  - Accessible, blind ARIA announcements ("Listen to medication pronunciation") ensure answers and Tall Man casing are never spoiled.
- **Sound-Alike Acoustic Discrimination & Simulated Oral Orders**:
  - Level 4 in every Unit features dedicated simulated telephone/verbal prescription challenges (`type: "sound_alike"`).
  - Pre-answer gate strictly hides the written medication name until the learner listens and submits, simulating Joint Commission read-back verification. Post-submission reveals the target medication for pedagogical review.
- **Standardized 6-Level Curriculum Architecture**:
  - Overhauled curriculum structure from 4 levels to a standardized 6-level progression per Unit (24 levels total across 4 Units).
  - Level 1: Identification & Introduction (5 pairs)
  - Level 2: Tall Man Guided Construction (5 pairs)
  - Level 3: Clinical Risk & Indication Distinction (5 pairs)
  - Level 4: Simulated Oral Order / Verify Read-Back (Sound-Alike Audio) (5 pairs)
  - Level 5: Rapid Review Challenge (5 pairs)
  - Level 6: Dedicated Unit Mastery Capstone (Pure unassisted Tall Man construction for all 5 pairs)
  - 100% coverage guarantee: Every assigned LASA pair in each Unit is tested across multiple modalities.
- **Practice Hub 4th Mode: Sound-Alike Audio Challenge**:
  - Added dedicated acoustic drill (`mode=audio`) alongside Daily Spaced Review, Mistakes Review, and Quick Practice.
- **Developer Speech Diagnostic Environment (`/test-tts`)**:
  - Internal sandbox for auditioning medication pronunciations, comparing raw vs phonetic enunciation, and verifying static audio asset integrity.
  - `multiple_choice`: Orthographic counterpart discrimination.
  - `tall_man`: Fill-in-the-blank with live capitalization preview and case-sensitive evaluation.
  - `matching`: Interactive tactile counterpart matching under selection states.
  - `unit_mastery`: 5 unassisted, pure Tall Man fill-in-the-blank items required to master each unit.
- **Audio Feedback**: Synthesized browser Web Audio API sounds (ascending C5→E5 chime for correct answers, descending dissonant buzzer for mistakes).

---

### Phase 2: Spaced Repetition (SRS) & Practice Hub (Completed ✅)
- **4-Stage Leitner SRS Model**:
  - Stage 0: Due immediately (unredeemed mistakes or new pairs).
  - Stage 1: 24-hour interval.
  - Stage 2: 72-hour (3-day) interval.
  - Stage 3: 7-day interval (Mastered).
- **Practice Modes**:
  - **Daily Spaced Review (`mode=due`)**: Automatically selects pairs whose retention timers have elapsed.
  - **Targeted Mistakes Review (`mode=mistakes`)**: Focuses on the learner's active `mistakes_queue`.
  - **Quick Practice (`mode=quick`)**: Rapid session pulling from unlocked curriculum breadth without heart penalties.
- **Review Origin Context**: Integrated origin breadcrumbs on review cards (`Level 1 • Unit 2`) so learners understand the curriculum source of every review question.

---

### Phase 3: Mobile UX, Level Progression & Session Breakdown (Completed ✅)
- **Level Completion Direct Routing**:
  - Implemented `getNextLevel()` in `lessonService.js` resolving curriculum hierarchy across all 16 levels.
  - Primary `[ CONTINUE TO NEXT LEVEL → ]` button above secondary `[ CONTINUE TO DASHBOARD ]`.
  - Final level omits next button; locked levels cannot be bypassed.
- **Session Breakdown Overhaul**:
  - Replaced cluttered pill badges with a single cohesive `X / Y CORRECT` statistic card matching the `+XP` and `Accuracy` card visual language.
  - Displays medication name as primary identifier; shows user answer vs verified correct answer with strict Tall Man casing fidelity.
- **Dedicated Mobile Navigation Drawer**:
  - Hamburger menu opens a dedicated slide-out drawer containing the entire Learning Path (Units, Levels, Mastery Nodes, progress badges) with auto-scroll on click.
- **Retention Dashboard & Tiered Badges**:
  - Profile page showcases active SRS stage breakdown, due queue count, and 12 tiered badges (Bronze, Silver, Gold) across Progress, Streaks, Mastery, and Retention.



---

### Phase 5: In-Session Retry Loop & Functional Hearts Mechanics (Planned 🎯)
*Aligning the core session loop with authentic Duolingo cognitive mechanics.*

- **In-Session Missed-Question Re-Queue Loop**:
  - When an answer is evaluated as incorrect during a lesson, it is not simply skipped; it is automatically appended to the end of the active session queue.
  - The lesson does not end until the learner successfully remediates every missed question.
- **Functional Heart Depletion**:
  - Each incorrect answer during standard curriculum lessons deducts 1 heart (starts at 5).
  - When hearts reach 0, the session halts with an "Out of Hearts" modal.
  - Learner can regenerate hearts by completing a session in the Practice Hub ("Practice to Earn Hearts").
- **Gems & Shop Utility**:
  - Enable learners to spend earned gems on streak freezes or immediate heart refills in `Shop.jsx`.

---

### Phase 6: Cloud Persistence & User Accounts (Post-Thesis / Optional ☁️)
*Transitioning from single-device client-side storage to remote multi-device accounts.*

- **Supabase / PostgreSQL Integration**:
  - Authentication: Email/password and OAuth sign-in.
  - Database schema: `users`, `user_progress`, `srs_items`, `mistakes_queue`.
  - Local-first synchronization: instant offline availability with background sync to cloud database.
- *(Note: Currently 100% functional for single-learner evaluation via browser `localStorage`)*.

---

## 4. Current Architectural Directory Map

```text
duoclonego/
├── public/                 # Sound assets, mascot graphics, avatars
├── src/
│   ├── components/         # Reusable presentation components
│   │   ├── FeedbackDrawer/ # Real-time bottom evaluation drawer
│   │   ├── GuidebookModal/ # Unit LASA clinical summary modal
│   │   ├── LasaPairCard/   # Individual pair comparison card
│   │   ├── Layout/         # AppLayout shell, desktop & mobile header
│   │   ├── LessonCompletion/ # Level complete screen & unified session breakdown
│   │   ├── Mascot/         # Animated SVG Duoclongo owl
│   │   ├── QuestionCard/   # Strategy dispatcher: MCQ, Tall Man, Tap-to-Match
│   │   ├── Sidebar/        # Desktop sidebar & mobile Learning Path drawer
│   │   └── UnitDescriptionModal/ # Unit clinical preview modal
│   ├── data/               # Clinical datasets & curriculum
│   │   ├── rawLasaSource.json  # Canonical 50-pair repository with citations
│   │   ├── lasaData.json       # Normalized 50-pair dataset
│   │   ├── lasaPairs.json      # Flat 50-pair array
│   │   ├── user.json           # Prototype user seed data
│   │   └── levels/             # Section 1 & 2 JSON definitions (16 levels)
│   ├── pages/              # Application routes
│   │   ├── Learn/          # Main curriculum map with level nodes (/learn)
│   │   ├── Lesson/         # Session runner (/lesson/:lessonId and /unit/:unitId/mastery)
│   │   ├── Practice/       # Spaced repetition hub & review modes (/practice)
│   │   ├── Profile/        # Retention matrix, streak, badge showcase (/profile)
│   │   ├── Quests/         # Daily quests & achievement tracker (/quests)
│   │   ├── Leaderboards/   # Planned cohort leagues (/leaderboards)
│   │   ├── Shop/           # Planned item/gem shop (/shop)
│   │   └── Documentation/  # Living in-app documentation (/documentation)
│   ├── services/           # Pure domain logic & engines
│   │   ├── audioService.js      # Web Audio API chime and error buzz synthesis
│   │   ├── badgeService.js      # 12-badge tiered milestone evaluation
│   │   ├── drugService.js       # Pair and level data queries
│   │   ├── lessonEngine.js      # Answer evaluation, scoring, session progression
│   │   ├── lessonService.js     # Level unlock rules and getNextLevel traversal
│   │   ├── practiceService.js   # 4-stage Leitner SRS engine and review queues
│   │   └── userService.js       # LocalStorage persistence, streak, XP, and SRS state
│   ├── App.jsx             # Top-level route configuration
│   └── index.css           # Global tokens and responsive styles
└── package.json            # React 19, React Router v8, Lucide React, Vite
```
