# Duoclongo — UI/UX Implementation Checklist

> **Persistent Source of Truth** for the UI/UX Design Review & Improvement Audit implementation.
> Status legend: `[ ]` Not started | `[~]` In progress | `[x]` Completed | `[!]` Blocked / Requires review

---

## Overview of Tasks

| Task # | Task Name | Priority | Status |
| :--- | :--- | :--- | :--- |
| **Task 1** | Fix QuestionInfoModal Pre-Submission Answer Leak | Critical | `[x]` |
| **Task 2** | Integrate Shop into Mobile Navigation & Header Stats | Critical | `[x]` |
| **Task 3** | Level Completion Screen: Responsive 2-Column Desktop Overhaul | High | `[x]` |
| **Task 4** | Streamline Tall Man Question UI & Reduce Redundant Text | High | `[x]` |
| **Task 5** | Matching Question Mobile Typography & Tap State Refinements | High | `[x]` |
| **Task 6** | Sound-Alike & Listening Question Polish (Clutter Removal) | Medium | `[x]` |
| **Task 7** | Design Token Unification (Primary Green & Component Consistency) | Medium | `[x]` |
| **Task 8** | Right Rail Desktop Affordance & MC Scenario Context Integration | Low | `[x]` |
| **Task 9** | In-Session Retry Loop & Functional Hearts Mechanics | Critical | `[x]` |
| **Task 10** | Simplify Level Completion Screen (Compact Accordion & Spacious Layout) | High | `[x]` |

---

## Detailed Task Breakdown

### Task 1: Fix QuestionInfoModal Pre-Submission Answer Leak
- **Priority**: Critical
- **Objective**: Prevent the question card from disclosing the target drug, confusable counterpart, and risk explanation before the learner submits their answer. Move the Source Verification trigger into `FeedbackDrawer.jsx` (post-submission), maintaining pedagogical transparency without compromising question integrity.
- **Relevant Files**:
  - `src/components/QuestionCard/QuestionRenderer.jsx`
  - `src/components/QuestionCard/QuestionRenderer.css`
  - `src/pages/Lesson/LessonSession.jsx`
  - `src/components/FeedbackDrawer/FeedbackDrawer.jsx`
  - `src/components/FeedbackDrawer/FeedbackDrawer.css`
  - `src/components/QuestionCard/QuestionInfoModal.jsx`
- **Status**: `[x]`
- **Implementation Notes**:
  - Removed pre-submission `Information` trigger button, modal state, and unused imports from `QuestionRenderer.jsx` and `QuestionRenderer.css`.
  - Passed `question={currentQuestion}` from `LessonSession.jsx` into `FeedbackDrawer.jsx`.
  - Integrated `ShieldCheck` trigger button `"Official Reference & Citation"` into `FeedbackDrawer.jsx`, displaying `QuestionInfoModal` post-submission only when authoritative source/citation data is present.
  - Added cohesive themed styling for `.feedback-citation-row` and `.feedback-citation-btn` across correct (green) and incorrect (amber/red) states in `FeedbackDrawer.css`.
- **Validation & Results**:
  - `npm run lint`: Clean pass (0 errors, 0 warnings).
  - `npm run build`: Vite build successful (all 1964 modules transformed, bundle emitted cleanly).
  - Pre-submission answer leak is completely eliminated; transparency/citation remains accessible upon answering.

---

### Task 2: Integrate Shop into Mobile Navigation & Header Stats
- **Priority**: Critical
- **Objective**: Ensure mobile phone learners can navigate to `/shop` to purchase Heart Refills and Streak Freezes. Rebalance `MobileNav.jsx` to feature the Shop prominently. Display remaining hearts inside the Shop header alongside Gems balance so learners know their exact heart status before purchasing.
- **Relevant Files**:
  - `src/components/MobileNav/MobileNav.jsx`
  - `src/components/MobileNav/MobileNav.css`
  - `src/components/Layout/AppLayout.jsx`
  - `src/components/Sidebar/Sidebar.jsx`
  - `src/pages/Shop/Shop.jsx`
  - `src/pages/Shop/Shop.css`
- **Status**: `[x]`
- **Implementation Notes**:
  - Rebalanced `MobileNav.jsx` to feature 6 core tabs: Learn, Practice, Quests, Ranks (Leaderboards), Shop, and Profile.
  - Optimized `MobileNav.css` for 6 items with 44px min touch targets, responsive flex distribution, and primary green active highlight.
  - Turned mobile header hearts display in `AppLayout.jsx` into a direct `<Link to="/shop">` shortcut.
  - Enabled full navigation links in `Sidebar.jsx` for the mobile drawer (and hid redundant duplicate brand header), providing mobile access to Docs and Shop.
  - Added real-time user hearts counter badge (`{user?.hearts ?? 5} / 5`) alongside the gems badge in `Shop.jsx` and styled `.shop-balances-group` / `.shop-hearts-badge` in `Shop.css`.
- **Validation & Results**:
  - `npm run lint`: Clean pass (0 errors, 0 warnings).
  - `npm run build`: Vite build successful in 629ms.
  - Verified `/shop` is reachable and prominent via mobile bottom nav, mobile top header hearts stat, and mobile hamburger drawer.

---

### Task 3: Level Completion Screen: Responsive 2-Column Desktop Overhaul
- **Priority**: High
- **Objective**: Eliminate below-the-fold CTA scrolling on desktop/laptop viewports (`>= 900px`). Implement an adaptive 2-column composition:
  - **Left Column**: Animated Mascot, celebration heading, XP/Gems/Accuracy summary cards, and primary action buttons (`CONTINUE TO NEXT LEVEL` / `CONTINUE TO DASHBOARD`).
  - **Right Column**: Scrollable Session Breakdown list with detailed question reviews.
  - **Mobile (`< 900px`)**: Preserve the existing proven single-column vertical stack.
- **Relevant Files**:
  - `src/components/LessonCompletion/LessonCompletion.jsx`
  - `src/components/LessonCompletion/LessonCompletion.css`
- **Status**: `[x]`
- **Implementation Notes**:
  - Restructured `LessonCompletion.jsx` into `.completion-primary-pane` (Left: Mascot, Title, Stats, Unlocked Badges, Progression Actions) and `.completion-review-pane` (Right: Session Breakdown with header, correct count, and question review cards).
  - Placed progression action buttons directly under the stats cards in the primary pane so learners on both desktop and mobile can continue immediately without scrolling through long answer lists.
  - Implemented responsive 2-column desktop composition in `LessonCompletion.css` for viewports `>= 900px` (400px sticky primary left column + flexible scrollable question review right column).
  - Preserved mobile (< 900px) single-column stack with refined touch scrolling (`-webkit-overflow-scrolling: touch;`, `max-height: 360px`).
- **Validation & Results**:
  - `npm run lint`: Clean pass (0 errors, 0 warnings).
  - `npm run build`: Vite build successful in 678ms.
  - Verified level completion layout eliminates below-the-fold scrolling on desktop while keeping mobile clean and intuitive.

---

### Task 4: Streamline Tall Man Question UI & Reduce Redundant Text
- **Priority**: High
- **Objective**: Reduce cognitive load in `TallManQuestion.jsx` (especially in Unit Mastery mode) by removing stacked redundant instructions ("Demonstrate complete unassisted mastery... exact capitalization required... no hints provided"). Unify Target Medication card with audio button, use a single clear directive, and ensure mobile virtual keyboard does not obscure the input.
- **Relevant Files**:
  - `src/components/QuestionCard/TallManQuestion.jsx`
  - `src/components/QuestionCard/TallManQuestion.css`
- **Status**: `[x]`
- **Implementation Notes**:
  - Streamlined `TallManQuestion.jsx` directives to a single clear prompt: `"Type the exact Tall Man capitalization:"` in Mastery mode and `"Type the distinguishing Tall Man letters:"` in Guided mode.
  - Consolidated Target Medication card into a single row featuring the drug name and audio pronunciation button, eliminating redundant nested headers and labels.
  - Removed repetitive instructional paragraphs (`"Tall Man Representation"` label, `"No hints are provided"`, etc.) and tightened spacing in `TallManQuestion.css` so mobile keyboards don't push inputs off-screen.
- **Validation & Results**:
  - `npm run lint`: Clean pass (0 errors, 0 warnings).
  - `npm run build`: Vite build successful in 711ms.
  - Cognitive load significantly reduced; input and check button remain comfortably in view on mobile screens.

---

### Task 5: Matching Question Mobile Typography & Tap State Refinements
- **Priority**: High
- **Objective**: Ensure matching tiles remain accessible on small mobile screens without awkward multi-line text wrapping or truncation of long medication names. Enforce minimum touch target heights (48px), fluid typography (`clamp`), and clean visual distinction between selected, matched, and error states.
- **Relevant Files**:
  - `src/components/QuestionCard/MatchingQuestion.jsx`
  - `src/components/QuestionCard/MatchingQuestion.css`
- **Status**: `[x]`
- **Implementation Notes**:
  - Added `.matching-tile-text` flex container around `<TallManText>` with `word-break: break-word; overflow-wrap: break-word; hyphens: auto;` to eliminate awkward clipping on long drug names (e.g., `chlordiazepoxide`).
  - Implemented responsive fluid typography on `.matching-tile-btn`: `font-size: clamp(0.85rem, 2.3vw, 1rem)` scaling down to `clamp(0.8rem, 2.5vw, 0.92rem)` on `<= 600px` and `0.76rem` on `<= 380px`.
  - Enforced minimum accessible touch target heights (54px desktop, 50px mobile, 46px micro-mobile) with consistent 3D button press tactile states.
  - Added descriptive `aria-label` with live match/selection state on each button, wrapped decorative status icons with `aria-hidden="true"`, and added `aria-live="polite"` to the progress indicator.
- **Validation & Results**:
  - `npm run lint`: Clean pass (0 errors, 0 warnings).
  - `npm run build`: Built cleanly in 677ms.
  - Two-column grid wraps cleanly on mobile screens without spilling outside bounds or obscuring status icons.

---

### Task 6: Sound-Alike & Listening Question Polish (Clutter Removal)
- **Priority**: Medium
- **Objective**: Remove boilerplate static subtitle ("Listen closely to vowel and consonant inflections...") from the audio player deck in `SoundAlikeQuestion.jsx`. Optimize audio deck spacing, ensure prominent waveform feedback during speech playback, and keep choices cleanly presented.
- **Relevant Files**:
  - `src/components/QuestionCard/SoundAlikeQuestion.jsx`
  - `src/components/QuestionCard/SoundAlikeQuestion.css`
- **Status**: `[x]`
- **Implementation Notes**:
  - Removed the repetitive instructional boilerplate text ("Listen closely to vowel and consonant inflections...") which previously cluttered every sound-alike card. Retained helpful fallback warning banner only when audio playback is genuinely unavailable.
  - Upgraded the interactive audio play button with 5-bar responsive animated sound wave indicator during active speech playback, with stable 56px minimum height preventing layout shift.
  - Tightened vertical margins and audio deck padding (`1.1rem 1.35rem`) with clean 3D Duoclongo card borders.
  - Imported `MultipleChoiceQuestion.css` in `SoundAlikeQuestion.jsx` to guarantee radio choice button styles are fully encapsulated regardless of render order.
- **Validation & Results**:
  - `npm run lint`: Clean pass (0 errors, 0 warnings).
  - `npm run build`: Built cleanly in 796ms.
  - Screen space on mobile and desktop is noticeably cleaner and focused on the auditory discrimination task.

---

### Task 7: Design Token Unification (Primary Green & Component Consistency)
- **Priority**: Medium
- **Objective**: Standardize `--color-primary` across all page stylesheets (`#58cc02` vs `#2dab69`) so Duoclongo's brand identity is unified across buttons, badges, progress tracks, and headers. Ensure subpages adhere to global card border, radius, and shadow tokens.
- **Relevant Files**:
  - `src/index.css`
  - `src/pages/Shop/Shop.css`
  - `src/pages/Leaderboards/Leaderboards.css`
  - `src/pages/Quests/Quests.css`
  - `src/pages/Learn/Learn.css`
  - `src/pages/Practice/Practice.css`
  - `src/pages/Profile/Profile.css`
  - `src/components/QuestionCard/TallManQuestion.css`
- **Status**: `[x]`
- **Implementation Notes**:
  - Standardized `:root` in `src/index.css` with Duoclongo's signature brand lime-green: `--color-primary: #58cc02`, `--color-primary-hover: #61e002`, `--color-primary-shadow: #46a302`, and `--color-primary-dark: #46a302`.
  - Added semantic theme aliases in `:root`: `--color-surface`, `--color-surface-hover`, `--color-border`, `--color-text-primary`, and `--color-text-secondary`.
  - Established global design token scales for spacing (`--space-1` through `--space-12`), typography (`--font-size-xs` through `--font-size-2xl`), border radius (`--radius-xs` through `--radius-full`), and elevation shadows (`--shadow-sm` through `--shadow-lg`), resolving missing token fallbacks in `Leaderboards.css` and `Quests.css`.
  - Replaced rogue hardcoded `#2dab69` and `#58cc02` color declarations across `Quests.css`, `Shop.css`, `Learn.css`, `Practice.css`, `Profile.css`, and `TallManQuestion.css` with `var(--color-primary)` and `var(--color-border)`.
- **Validation & Results**:
  - `npm run lint`: Clean pass (0 errors, 0 warnings).
  - `npm run build`: Production bundle built in 620ms.
  - Consistent visual identity: buttons, badges, progress tracks, and card borders now reflect cohesive Duoclongo design tokens across all views.

---

### Task 8: Right Rail Desktop Affordance & MC Scenario Context Integration
- **Priority**: Low
- **Objective**: 
  1. Add desktop Shop affordances to `RightInfoBar.jsx` for Hearts and Gems/Diamonds, maintaining parity with mobile header behavior.
  2. Enable situational clinical vignette rendering in `MultipleChoiceQuestion.jsx` with `.mc-scenario-card` when `question.scenario` is present.
  3. Ensure accessible touch/click states across all interactive stats.
- **Relevant Files**:
  - `src/components/RightInfoBar/RightInfoBar.jsx`
  - `src/components/RightInfoBar/RightInfoBar.css`
  - `src/components/QuestionCard/MultipleChoiceQuestion.jsx`
  - `src/components/QuestionCard/MultipleChoiceQuestion.css`
- **Status**: `[x]`
- **Implementation Notes**:
  - Converted the desktop `RightInfoBar.jsx` Hearts and Diamonds stats counters into `<Link to="/shop">` elements with `.user-stat-link`, establishing feature parity with mobile top bar shop access.
  - Added subtle hover lift (`translateY(-1px)`) and tactile active depression (`translateY(1px)`) to interactive stat links in `RightInfoBar.css`.
  - Added conditional scenario vignette rendering in `MultipleChoiceQuestion.jsx` wrapping `question.scenario` in `.mc-scenario-card` with an accessible `role="region" aria-label="Clinical Scenario"` and Duoclongo styled badge.
- **Validation & Results**:
  - `npm run lint`: Clean pass (0 errors, 0 warnings).
  - `npm run build`: Production bundle built cleanly in 675ms.
  - Desktop users can now directly jump to the Shop to refill hearts or view cosmetics by clicking their heart or gem count in the right sidebar.

---

### Task 9: In-Session Retry Loop & Functional Hearts Mechanics
- **Priority**: Critical
- **Objective**:
  1. Deplete 1 heart on incorrect answers during curriculum lessons and Unit Mastery challenges.
  2. Maintain 100% heart protection in Practice Hub (zero hearts lost).
  3. Implement Duolingo-style in-session retry loop: mistakenly answered questions are appended to the queue with `isRetry: true`.
  4. Display a `"PREVIOUS MISTAKE • REVIEW"` badge on retried questions.
  5. Calculate progress based on distinct mastered items (`masteredCount / initialCount`).
  6. Present `OutOfHeartsModal` when hearts hit 0, offering Practice Hub, Shop refill, or return to Learning Path.
  7. Regenerate +1 heart (up to 5) upon completing a practice session in Practice Hub with celebration banner.
- **Relevant Files**:
  - `src/services/userService.js`
  - `src/services/lessonEngine.js`
  - `src/components/OutOfHeartsModal/OutOfHeartsModal.jsx`
  - `src/components/OutOfHeartsModal/OutOfHeartsModal.css`
  - `src/components/QuestionCard/QuestionRenderer.jsx`
  - `src/components/QuestionCard/QuestionRenderer.css`
  - `src/pages/Lesson/LessonSession.jsx`
  - `src/pages/Lesson/LessonSession.css`
  - `src/components/LessonCompletion/LessonCompletion.jsx`
  - `src/components/LessonCompletion/LessonCompletion.css`
- **Status**: `[x]`
- **Implementation Notes**:
  - Added `deductHeart()` (clamps at 0) and `restoreHeart(amount)` (clamps at 5) in `userService.js` wired to in-memory state, event dispatch (`duoclongo:user-updated`), and Supabase/cloud sync.
  - Updated `lessonEngine.js` with `initialQuestionCount` and `masteredQuestionIds: []`, dynamically supporting `nextTotalQuestions` when items are re-queued.
  - Implemented `OutOfHeartsModal.jsx` with empty heart icon, warning pill, and routing to `/practice` (free recovery), `/shop` (350-gem refill), or `/learn`.
  - Integrated in-session retry queueing and heart deduction in `LessonSession.jsx` across standard answers and developer testing controls.
  - Delayed `OutOfHeartsModal` trigger until after feedback review (`pendingOutOfHearts`) so pedagogical explanations are never cut short.
  - Styled and rendered `.question-retry-badge` with `RotateCcw` icon in `QuestionRenderer.jsx`.
  - Added practice completion heart restoration and celebration banner (`.completion-heart-reward-banner`) in `LessonCompletion.jsx`.
- **Validation & Results**:
  - Automated unit test suite `scratch/test_hearts_and_retry.mjs`: All tests passed (100% assertions satisfied for heart depletion, boundary clamping, practice restoration, retry queue extension, and mastery tracking).
  - `npm run lint`: Clean pass (0 errors, 0 warnings).
  - `npm run build`: Production build cleanly completed in 655ms.

---

### Task 10: Simplify Level Completion Screen (Compact Accordion & Spacious Layout)
- **Priority**: High
- **Objective**:
  1. Simplify the completion screen to communicate core hierarchy: (1) Completed the level, (2) Main rewards/results (XP, Gems, Accuracy, Badges), (3) Progression actions (Continue to Next Level / Dashboard).
  2. Transform the Session Breakdown into a compact, expandable accordion list (collapsed by default).
  3. Hide details (Your answer, Correct answer, Explanation, Pair citations) until individual items are expanded via chevron triggers.
  4. Streamline header to show title and a clean `{correctCount} / {totalQuestions} Correct` badge, eliminating the redundant second stat box card.
  5. Provide a balanced, spacious horizontal composition on desktop (`>= 900px`) and comfortable vertical flow on mobile (`< 900px`).
- **Relevant Files**:
  - `src/components/LessonCompletion/LessonCompletion.jsx`
  - `src/components/LessonCompletion/LessonCompletion.css`
- **Status**: `[x]`
- **Implementation Notes**:
  - Integrated `expandedItems` state and `toggleItem(idx)` handler in `LessonCompletion.jsx` with animated `ChevronRight` icon indicators.
  - Replaced the large, permanently expanded cards with `.breakdown-accordion-item` rows showing `▸ Medication Name [Category Badge] [CORRECT / INCORRECT Pill]`.
  - Expanding an item reveals `.breakdown-answers-grid` with "Your answer", "Correct answer", and "Clinical takeaway" explanation.
  - Styled compact accordion in `LessonCompletion.css` with clean borders, responsive padding, 48px touch triggers (44px on small mobile), and smooth fade-in animations.
  - Removed artificial tall viewport heights (`min-height: 400px;`) and redundant stat box cards to give desktop and mobile layouts natural breathing room.
- **Validation & Results**:
  - `npm run lint`: Clean pass (0 errors, 0 warnings).
  - `npm run build`: Production build succeeded in 686ms.
  - Automated tests `scratch/test_hearts_and_retry.mjs`: All passing.

---

### Task 11: Level Completion Visual Overhaul Lab, Option D Mobile Polish & Option A+ Concept
- **Priority**: High
- **Objective**:
  1. Build an isolated development/test route (`/completion-preview`) to visually compare completion screen concepts before touching production logic.
  2. Provide realistic scenario switchers (Standard 1 Mistake, 100% Perfect, Unit Mastery, and Practice Session with Heart Restored).
  3. Provide viewport simulation frames (Desktop, Tablet 768px, Mobile 390px).
  4. Fix the mobile view of Option D to eliminate cramping.
  5. Add a new hybrid concept: Option A+ (Minimalist + Option D Hybrid).
- **Relevant Files**:
  - `src/pages/CompletionPreview/CompletionPreview.jsx`
  - `src/pages/CompletionPreview/CompletionPreview.css`
  - `src/App.jsx`
- **Status**: `[x]`
- **Implementation Notes**:
  - Created standalone `/completion-preview` route with interactive state and interactive breakdown accordions.
  - **Option D Mobile Fix**:
    - Reduced card padding to `1.25rem 0.95rem` (down from 80px horizontal loss).
    - Changed rewards bar from stacked vertical cards (`1fr`) into a clean, compact 3-column horizontal grid (`repeat(3, 1fr)`).
    - Added separate `.device-mobile` and `@media (max-width: 680px)` rules ensuring both real mobile devices and simulated viewport preview frames render cleanly.
  - **New Option A+ (Minimalist + Option D Hybrid)**:
    - Combines Option A's centered, spacious architecture and unified stat ribbon (with vertical hairline dividers) with Option D's ambient radial glow mascot hero, rich reward bubbles (Award, Gems, Target), 3D Duolingo CTA + clean text link, and 1-tap "Toggle Details" button.
- **Validation & Results**:
  - `npm run lint`: 0 errors, 0 warnings.
  - `npm run build`: Built cleanly in 726ms.
  - Available at `http://localhost:5173/completion-preview`.


