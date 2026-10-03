# LASA-Quest — Thesis & System Decision Register

**Document Version**: 1.0  
**Date**: October 4, 2026  
**Project**: LASA-Quest *(formerly Duoclongo)*  
**Target Paper**: `CNS-PROPOSAL-THESIS-DOCUMENT-1 (2).docx`  
**Purpose**: Official decision-tracking register for unresolved research scope, thesis revisions, and software architecture questions requiring sign-off from the thesis group and thesis adviser.

---

## Decision Status Legend
- `[PROPOSED]`: Documented recommendation awaiting group/adviser confirmation.
- `[CONFIRMED]`: Approved by stakeholders; ready for implementation.
- `[DEFERRED]`: Action postponed to a future research phase.
- `[REJECTED]`: Option considered and explicitly discarded.

---

## Register of Unresolved Decisions

### Decision DR-01: Replacement of Flawed System Process Flow (Figure 3.2)
- **Status**: `[PROPOSED]` *(Awaiting Group & Adviser Sign-off)*
- **Decision Needed**: Approve formally excising Figure 3.2 and Paragraphs [264]–[270] from the thesis proposal and adopting the **Curriculum Learning Path & Continuous Spaced Practice Workflow**.
- **Current Thesis Description**:
  - *Thesis Ch. 3, [264]–[270], Figure 3.2*: User logs in, dashboard prompts selection of 1 of 5 minigames (Sound-Alike Detector, Look-Alike Spotter, Tall Man Rescue, Dispensing Defense, Survival Mode). Upon incorrect answer, an interactive modal pops up asking: *"Do you want to retry the challenge now or return to dashboard?"*
- **Verified System Behavior**:
  - [`Learn.jsx`](file:///d:/3/duoclonego/src/pages/Learn/Learn.jsx), [`LessonSession.jsx`](file:///d:/3/duoclonego/src/pages/Lesson/LessonSession.jsx), [`FeedbackDrawer.jsx`](file:///d:/3/duoclonego/src/components/FeedbackDrawer/FeedbackDrawer.jsx): The dashboard renders a structured Learning Path (4 Units, 24 Levels, 6 Levels/Unit). During a level session, questions advance sequentially. If an answer is incorrect, the bottom drawer displays an immediate orthographic explanation, deducts a heart, logs the failed pair into `user.mistakes_queue`, and seamlessly advances to the next question. There is **no popup modal** asking to retry or abandon.
- **Available Options & Consequences**:
  - **Option A (Recommended)**: Adopt the actual Curriculum Learning Path flow in the thesis.  
    *Consequences*: Aligns paper with modern learning science and actual software; eliminates indefensible panel questions about the nonexistent retry modal.
  - **Option B**: Rewrite the software to match Figure 3.2 (re-introduce the retry popup and minigame selector).  
    *Consequences*: Degrades UX, destroys pedagogical flow, and throws away months of curriculum architecture work.
- **Recommendation**: **Adopt Option A**. Excising Figure 3.2 and writing an accurate, modern workflow description will impress the panel with our software maturity.

---

### Decision DR-02: Core LASA Learning Scope vs. Theoretical Pharmacology Questions
- **Status**: `[PROPOSED]` *(Awaiting Adviser Confirmation)*
- **Decision Needed**: Confirm whether theoretical pharmacology questions (drug indications, mechanisms of action, receptor pharmacology, dosage calculations) should remain excluded from active learner sessions, or if clinical dispensing simulations must be implemented.
- **Current Thesis Description**:
  - *Thesis Ch. 1, [120] & Ch. 3, [261]*: Mentions "Dispensing Defense (simulated clinical dispensing decisions)" as a core challenge mode.
- **Verified System Behavior**:
  - [`deferredTheoreticalQuestions.json`](file:///d:/3/duoclonego/src/data/curriculum/deferredTheoreticalQuestions.json#L4): Theoretical questions were intentionally quarantined. Active curriculum strictly tests medication name recognition, orthographic discrimination, and Tall Man capitalization (ISMP/FDA Table 1).
- **Available Options & Consequences**:
  - **Option A (Recommended)**: Formally declare in the thesis that clinical dispensing and theoretical pharmacology are out of scope for this study and reserved for future research. Focus the evaluation 100% on LASA medication name recognition and Tall Man accuracy.  
    *Consequences*: Keeps our evaluation focused, achievable, and clinically safe. Prevents medical students or pharmacists from nitpicking clinical simulation fidelity.
  - **Option B**: Build a clinical dispensing simulation engine before testing.  
    *Consequences*: High development burden, risks project delay, requires clinical review of complex prescription scenarios, and dilutes the core focus on perceptual name recognition.
- **Recommendation**: **Adopt Option A**. In our thesis, explicitly state under Scope and Delimitation (Paragraph [122]) that the application evaluates perceptual orthographic/acoustic recognition of confusing names, not clinical decision-making.

---

### Decision DR-03: Delivery Method for 25-Item Knowledge Assessment & PSSUQ
- **Status**: `[PROPOSED]` *(Awaiting Group Decision)*
- **Decision Needed**: Decide whether the 25-item Knowledge Assessment and the 16-item PSSUQ usability instrument should be delivered through an in-app evaluation module or administered externally via printed questionnaires / Google Forms during the Mapúa trial.
- **Current Thesis Description**:
  - *Thesis Ch. 3, [274], [281]–[284]*: Describes a two-part research instrument (25-item Knowledge Assessment administered pre-test, immediate post-test, 1-week retention post-test; and 7-point Likert scale PSSUQ) to be completed by undergraduate pharmacy students at Mapúa University Makati.
- **Verified System Behavior**:
  - The application currently has an extensive 50-pair question engine, but no dedicated, locked `/assessment` route that conducts pre/post testing with direct export into research tables.
- **Available Options & Consequences**:
  - **Option A**: Administer tests externally using Google Forms or printed paper test sheets during on-site classroom sessions.  
    *Consequences*: Zero coding required; standard academic methodology; easy to manage if testing takes place in a physical computer lab.
  - **Option B (Recommended)**: Build a dedicated in-app Evaluation Module (`/assessment/pre`, `/assessment/post`, `/assessment/pssuq`) that logs respondent answers directly into a Supabase table (`public.evaluation_responses`).  
    *Consequences*: Highly impressive for thesis defense; guarantees accurate automated score calculation and export; prevents paper-handling errors.
- **Recommendation**: **Adopt Option B** if development time permits (estimated ~1 day of frontend work), or **Option A** as a safe fallback.

---

### Decision DR-04: Timed Endurance Requirements (LASA Survival Mode vs. Quick Practice)
- **Status**: `[PROPOSED]` *(Awaiting Group Decision)*
- **Decision Needed**: Determine whether the existing "Quick Practice" (5-item rapid mixed drill) and timed "Unit Mastery Capstones" satisfy the thesis intention for rapid retrieval practice, or if a dedicated timed survival arcade mode must be coded.
- **Current Thesis Description**:
  - *Thesis Ch. 1, [120] & Ch. 3, [261]*: Mentions "LASA Survival Mode (timed endurance challenges)" as Increment 3.
- **Verified System Behavior**:
  - [`Practice.jsx`](file:///d:/3/duoclonego/src/pages/Practice/Practice.jsx): Features "Quick Practice" for rapid retrieval without heart loss. Mastery Capstones require high accuracy under pressure.
- **Available Options & Consequences**:
  - **Option A (Recommended)**: Re-frame the thesis to describe "Quick Practice" and "Unit Mastery Capstones" as our rapid-retrieval mechanisms.  
    *Consequences*: Aligns paper with reality; avoids adding unnecessary game bloat to a serious educational tool.
  - **Option B**: Code a dedicated "Survival Mode" page where a 60-second timer ticks down and users answer as many questions as possible until time expires.  
    *Consequences*: Adds another interface; may encourage rushed guessing rather than careful orthographic inspection.
- **Recommendation**: **Adopt Option A**.

---

### Decision DR-05: Leaderboards Scope Removal
- **Status**: `[APPROVED & EXECUTED]` *(Option A Implemented: UI, Route, and Service removed; underlying XP & Badge systems preserved)*
- **Decision Needed**: Approve the formal removal of the Leaderboards interface from the user-facing navigation and routes.
- **Current Thesis Description**:
  - The thesis proposal **never mentioned leaderboards**. Search of `CNS-PROPOSAL-THESIS-DOCUMENT-1 (2).docx` finds **0 occurrences**.
- **Verified System Behavior**:
  - [`Leaderboards.jsx`](file:///d:/3/duoclonego/src/pages/Leaderboards/Leaderboards.jsx), [`leaderboardService.js`](file:///d:/3/duoclonego/src/services/leaderboardService.js), route `/leaderboards`, links in sidebar and mobile nav.
- **Available Options & Consequences**:
  - **Option A (Recommended)**: Remove Leaderboards route and navigation buttons from the application.  
    *Consequences*: Keeps system clean and strictly aligned with the approved thesis proposal; eliminates potential source of social comparison anxiety for students during usability trials.
  - **Option B**: Retain Leaderboards in the app.  
    *Consequences*: Forces us to add a whole new section to Chapter 3 of the thesis explaining competitive ranking, and opens us to panel questions on how leaderboards affect pharmacology learning anxiety.
- **Recommendation**: **Adopt Option A**. Remove Leaderboard UI cleanly while preserving underlying XP and achievement systems.

---

### Decision DR-06: In-App Documentation Scope Removal
- **Status**: `[APPROVED & EXECUTED]` *(Option A Implemented: UI, Route, and CTA buttons removed; repository developer docs preserved in `agents/docs/`)*
- **Decision Needed**: Approve the formal removal of the in-app Documentation page (`/documentation`) from student-facing navigation.
- **Current Thesis Description**:
  - The thesis proposal does not propose or mention an in-app documentation page for end-users.
- **Verified System Behavior**:
  - [`Documentation.jsx`](file:///d:/3/duoclonego/src/pages/Documentation/Documentation.jsx), route `/documentation`, CTA links in Navbar and Sidebar.
- **Available Options & Consequences**:
  - **Option A (Recommended)**: Remove the `/documentation` route and its nav links from the app. Keep repository-level markdown docs (`README.md`, `agents/docs/`).  
    *Consequences*: Prevents pharmacy students from seeing developer internals, database schemas, and technical implementation guides during usability evaluation.
  - **Option B**: Retain the in-app documentation page in the app.  
    *Consequences*: Evaluators and students may confuse developer documentation with student study materials, hurting PSSUQ interface simplicity ratings.
- **Recommendation**: **Adopt Option A**.

---

## Action Plan Following Approval
Once these decisions are confirmed by our thesis group and adviser:
1. **System Removals**: Execute clean removal of Leaderboards and in-app Documentation routes and navigation links.
2. **Replacement Process Flow**: Render the new verified process flow diagram in Mermaid/SVG.
3. **Thesis Manuscript Updates**: Draft updated text for Chapters 1, 2, and 3 reflecting approved decisions.
