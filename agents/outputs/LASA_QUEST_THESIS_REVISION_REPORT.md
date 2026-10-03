# LASA-Quest — Thesis Revision & System Alignment Report

**Document Title**: Comprehensive Paper-to-System Discrepancy & Revision Guide  
**Project Name**: LASA-Quest *(formerly demo-named Duoclongo)*  
**Target Paper**: `CNS-PROPOSAL-THESIS-DOCUMENT-1 (2).docx` (Mapúa University Makati, ITS200-1, September 2026)  
**Authors**: Convento, Ron David D.; Narvaez, Crystal Jaisey; Sable, Kyla Fhe C.  
**Thesis Adviser**: Antonette D. Gabriel  
**Report Date**: October 4, 2026  
**Audience**: Thesis Groupmates, Project Developers, and Thesis Adviser  

---

## 1. Purpose of the Report

The purpose of this report is to provide our thesis group with a clear, honest, and accessible comparison between our written thesis proposal document (`CNS-PROPOSAL-THESIS-DOCUMENT-1 (2).docx`) and the actual, working **LASA-Quest** web application codebase.

During early prototype development, the application was built under the working title **Duoclongo**. As development matured, several features evolved beyond the initial proposal (such as structured curriculum learning paths, spaced repetition, offline neural audio, and a theme customization economy). At the same time, certain early conceptual proposals in the paper (such as a 5-minigame mode selector and an interactive retry prompt upon incorrect answers) were either re-architected or found to be pedagogically suboptimal.

This report is designed for all group members to read easily without needing to dig through technical source code. It highlights:
- Exactly which sections of the thesis proposal are now **outdated or inaccurate**;
- Which modern system capabilities are **missing from the paper** and should be documented to strengthen our academic defense;
- Which proposed paper features are **absent from the system** and require a scope decision;
- Why the existing **process flow diagram (Figure 3.2)** must be replaced;
- The plan for cleanly removing **Leaderboards** and the in-app **Documentation** page from our scope;
- Specific actionable decisions requiring group and adviser approval before finalizing our thesis manuscript.

---

## 2. Executive Summary

| Topic | Status / Impact | Core Finding | Group Action Required |
| :--- | :--- | :--- | :--- |
| **Product Rebranding** | **Completed** | The entire system (UI, page titles, shop, profile, error screens, and meta tags) has been updated from *Duoclongo* to **LASA-Quest**. | Update all remaining historical mentions of *Duoclongo* in thesis drafts. |
| **System Process Flow** | **Confirmed outdated/inaccurate** | Figure 3.2 and Paragraphs [264]–[270] describe an arcade minigame selector and an interruptive retry prompt that contradict our actual Learning Path. | Remove Figure 3.2; adopt the verified Curriculum Learning Path workflow. |
| **Learning Architecture** | **Missing from paper** | The app implements a structured 6-level progression per unit (Sections $\rightarrow$ Units $\rightarrow$ Levels 1–5 $\rightarrow$ Mastery Capstone) based on cognitive retrieval practice. | Add curriculum hierarchy description to Chapter 3 (Methodology). |
| **Question Types** | **Partially implemented** | Instead of 5 separate game modes, the system embeds 4 purpose-driven activity types (Tall Man MCQ, LASA Pair MCQ, Tap-to-Match, Unassisted Constructed Response) plus Auditory Orders. | Align Chapter 1 and 3 specifications with our verified activity taxonomy. |
| **Audio Architecture** | **Missing from paper** | 100 medication audio clips were pre-rendered via Azure AI Speech Neural and are stored locally as static MP3s, requiring zero runtime cloud calls. | Document offline static speech architecture in Chapter 3. |
| **Spaced Repetition (SRS)** | **Missing from paper** | The app includes a complete Leitner 4-stage SRS engine (0h, 24h, 72h, 168h intervals) and a persistent Mistakes Queue. | Incorporate SRS into Chapter 2 (Literature) and Chapter 3 (SDLC) as a core feature. |
| **Leaderboards & Docs** | **Scope Cleanup** | Leaderboards and the in-app Documentation page are extraneous to our core medication-safety research objectives. | Approve planned removal from system UI; ensure neither is promised in the thesis. |
| **Clinical Scope Boundary** | **Decision required** | Clinical dispensing scenarios and pharmacology theory (mechanisms of action) were intentionally quarantined to focus 100% on drug name recognition. | Confirm that theoretical questions remain excluded from active undergraduate lessons. |

---

## 3. Paper Sections Requiring Review

This section details every chapter, section, and paragraph in our thesis proposal that is outdated, inconsistent, or in need of revision based on the working software.

### 3.1 Chapter 1 — Table 1.3: Gap Analysis of Existing Studies (Page 13, Paragraph [74])
- **Change Status**: **Confirmed outdated/inaccurate**
- **What it currently says**: Proposes translating error drivers into specific gameplay mechanics, explicitly naming *"Look-Alike Spotter and Sound-Alike Detector"*.
- **Why it is outdated**: The system does not feature standalone game modes called "Look-Alike Spotter" or "Sound-Alike Detector". Instead, orthographic look-alike distinction and acoustic sound-alike discrimination are integrated into every curriculum level through structured question activities (Type B Pair Recognition and Simulated Telephone/Oral Order Auditory Challenges).
- **Recommended Revision**: Reword the proposed solution column in Table 1.3 to state: *"Translates error drivers into structured pedagogical exercises, including orthographic counterpart discrimination and auditory read-back verification challenges."*

---

### 3.2 Chapter 1 — Specific Objective 2 (Page 16, Paragraph [115])
- **Change Status**: **Confirmed outdated/inaccurate**
- **What it currently says**: *"To design and implement LASA-Quest using the Iterative-Incremental Model, delivering progressive increments featuring core challenge modes (Sound-Alike Detector, Look-Alike Spotter, Tall Man Rescue, Dispensing Defense, and LASA Survival Mode) alongside gamified progression elements (XP, points, streaks, lives, and feedback loops)."*
- **Why it is outdated**:
  1. It commits our group to five specific named "challenge modes" that do not exist as separate modes in the software.
  2. "Dispensing Defense" (clinical dispensing decisions) was removed from active lessons to prevent distracting from drug name recognition.
  3. "LASA Survival Mode" was not built as an arcade survival game; rapid retrieval is handled by the Practice Hub's Quick Review.
- **Recommended Revision**: Revise Specific Objective 2 to read:
  > *"To design and implement LASA-Quest using the Iterative-Incremental Model, delivering progressive functional modules featuring core cognitive recognition exercises (Tall Man lettering identification, confusable counterpart discrimination, interactive pair matching, unassisted constructed recall, and simulated oral order acoustic challenges) alongside gamified progression elements (XP, day streaks, heart-based lives, spaced repetition, and immediate corrective feedback loops)."*

---

### 3.3 Chapter 1 — Scope and Delimitation (Page 17, Paragraph [120])
- **Change Status**: **Confirmed outdated/inaccurate**
- **What it currently says**: Encompasses five distinct challenge modes: *Sound-Alike Detector (phonetic discrimination), Look-Alike Spotter (orthographic and visual discrimination), Tall Man Rescue (application of FDA/ISMP Tall Man lettering), Dispensing Defense (simulated clinical dispensing decisions), and LASA Survival Mode (timed endurance challenges)*.
- **Why it is outdated**: This paragraph will invite heavy scrutiny during defense because the committee will look for five distinct menu buttons matching these exact names.
- **Recommended Revision**: Update the scope description to describe the **Curriculum Learning Path** (Sections, Units, Levels, and Mastery Capstones), the **Purpose-Driven Activity Taxonomy** (Types A, B, C, D, and Audio), and the **Dedicated Practice Hub** (Spaced Review, Mistakes Queue, and Quick Drill).

---

### 3.4 Chapter 3 — SDLC Increments 2 and 3 (Pages 33–34, Paragraphs [260]–[261])
- **Change Status**: **Confirmed outdated/inaccurate**
- **What it currently says**: 
  - *Increment 2*: Integrates Sound-Alike Detector and Look-Alike Spotter.
  - *Increment 3*: Expands by implementing Tall Man Rescue, Dispensing Defense, and LASA Survival Mode.
- **Why it is outdated**: The actual software was engineered through architectural phases:
  - *Phase 1*: Foundation, design tokens, UI components, and initial questions.
  - *Phase 2*: Canonical ISMP/FDA 50-pair dataset integration and 6-level curriculum architecture.
  - *Phase 3*: 100% offline neural audio synthesis pipeline via Azure AI Speech Raw Mode.
  - *Phase 4*: Supabase PostgreSQL cloud persistence (Option A Pure Login Architecture) with Row-Level Security.
  - *Phase 5*: Gamification, daily quests, Leitner SRS engine, and Item Shop theme customizations.
- **Recommended Revision**: Re-align the description of Increments 2 and 3 to reflect the real technical progression (Medication Data & Curriculum Engine, followed by Audio Pipeline, Cloud Persistence, and Spaced Learning Mechanics).

---

### 3.5 Chapter 3 — Proposed System Process Flow (Pages 34–35, Figure 3.2 & Paragraphs [264]–[270])
- **Change Status**: **Confirmed outdated/inaccurate**
- **What it currently says**: Describes a user logging in, seeing a dashboard with a challenge mode selector, playing a challenge, and—crucially—**being asked via a popup modal whether they want to retry the challenge immediately after getting an answer wrong**.
- **Why it is flawed**: See [Section 6](#6-incorrect-process-flow) for full detail. The real application has no challenge mode selector and no interruptive retry prompt.
- **Recommended Revision**: Completely replace Figure 3.2 and Paragraphs [264]–[270] with the verified Curriculum Learning Path workflow.

---

## 4. System Features Missing from the Paper

The following capabilities are fully functional in our codebase and directly support student learning, but are **completely unmentioned** in our thesis document. Adding them will significantly improve the academic rigor and technical depth of our paper:

### 4.1 Leitner 4-Stage Spaced Repetition System (SRS)
- **Change Status**: **Missing from paper**
- **Implemented Reality**: In [`src/services/userService.js`](file:///d:/3/duoclonego/src/services/userService.js#L480-L540), we have an automated Leitner memory engine. When a student practices a medication pair, the system tracks its retention stage and schedules reviews at scientifically grounded intervals:
  - Stage 1: Immediate (0 hours)
  - Stage 2: 24 hours
  - Stage 3: 72 hours (3 days)
  - Stage 4: 168 hours (1 week / Mastered)
- **Why it matters for our thesis**: Our thesis specifically aims to evaluate knowledge retention over time (1-week retention post-test). Documenting our Leitner algorithm in Chapter 2 (Literature Review) and Chapter 3 (Methodology) provides direct cognitive science backing (Ebbinghaus forgetting curve, retrieval practice).

---

### 4.2 Dedicated Practice Hub & Unified Mistakes Queue
- **Change Status**: **Missing from paper**
- **Implemented Reality**: Accessible via `/practice` ([`Practice.jsx`](file:///d:/3/duoclonego/src/pages/Practice/Practice.jsx)), students can review high-risk drugs without risking lives/hearts. It features four dedicated modes:
  1. *Daily Spaced Review*: Serves pairs due for memory reinforcement based on SRS timestamps.
  2. *Targeted Mistakes Review*: Automatically enqueues any question missed during a lesson and allows the student to redeem it.
  3. *Quick Practice*: A rapid 5-item mixed drill covering curriculum breadth.
  4. *Sound-Alike Audio Challenge*: Focused acoustic discrimination practice with spoken prescriptions.
- **Why it matters for our thesis**: This directly demonstrates how our application handles error remediation and continuous self-directed learning without learner penalty.

---

### 4.3 100% Pre-Synthesized Offline Neural Audio Subsystem
- **Change Status**: **Missing from paper**
- **Implemented Reality**: Rather than making slow, unreliable, and costly cloud API calls during student sessions, all 100 medication audio clips (2.96 MB total) were pre-synthesized using Azure AI Speech Neural (`en-US-JennyNeural`, Raw Mode) and are permanently stored in `public/audio/lasa/*.mp3`. The app maps them deterministically via [`audioMapping.json`](file:///d:/3/duoclonego/src/data/audioMapping.json).
- **Why it matters for our thesis**: This solves a major practical challenge in educational software: guaranteeing 100% offline availability, zero latency during student trials, zero API rate-limiting, and zero risk of exposed cloud API keys.

---

### 4.4 Supabase Cloud Persistence & Option A Pure Login Architecture
- **Change Status**: **Missing from paper**
- **Implemented Reality**: The app uses Supabase PostgreSQL (`public.profiles` and `public.level_attempts`) with Row-Level Security (RLS) policies. Unauthenticated users are protected by [`ProtectedRoute.jsx`](file:///d:/3/duoclonego/src/components/ProtectedRoute/ProtectedRoute.jsx) and directed to `/login`.
- **Why it matters for our thesis**: Our methodology in Chapter 3 currently describes an abstract "web application". Specifying Supabase, PostgreSQL, and RLS demonstrates modern engineering and data security standards.

---

### 4.5 Standardized 6-Level Curriculum Hierarchy & Unit Mastery Capstones
- **Change Status**: **Missing from paper**
- **Implemented Reality**: Across 4 Units (24 total levels), each unit follows an intentional, progressive cognitive sequence:
  - *Level 1*: Supported Identification (MCQ)
  - *Level 2*: Tall Man Lettering Batch A
  - *Level 3*: Tall Man Batch B & Acoustic Discrimination
  - *Level 4*: Guided Recall & Active Pairing
  - *Level 5*: Pair Consolidation & Simulated Oral Read-Back
  - *Level 6 (Mastery)*: Unassisted constructed response capstone requiring 100% accuracy.
- **Why it matters for our thesis**: Demonstrates that our application is not a random quiz game, but a pedagogically sequenced curriculum designed around Bloom's Taxonomy.

---

## 5. Paper Features Missing from the System

The following features are promised or described in our thesis proposal, but are **not present** in the working codebase:

### 5.1 Dispensing Defense Mode (Simulated Clinical Dispensing Decisions)
- **Change Status**: **Missing from system / Confirmed deferred**
- **Thesis Promise**: Ch. 1 [120], Ch. 3 [261], [267] describes a simulation mode where students make clinical dispensing decisions.
- **Codebase Reality**: All theoretical questions involving clinical indications, mechanisms of action, and pharmacology calculations were removed from active lessons and archived in [`deferredTheoreticalQuestions.json`](file:///d:/3/duoclonego/src/data/curriculum/deferredTheoreticalQuestions.json#L4).
- **Why it was deferred**: Asking clinical questions (e.g. *"What receptor does dopamine act on?"*) dilutes the app's core purpose. The app's unique strength is training visual and acoustic vigilance to prevent confusable drug mix-ups (*"Is this bupropion or buspirone?"*).
- **Group Recommendation**: **Revise the paper**. Do not attempt to code complex clinical dispensing logic before our upcoming evaluation. Formally state in Chapter 1 that clinical dispensing scenarios are reserved for future research phases.

---

### 5.2 Dedicated LASA Survival Mode (Timed Endurance Game)
- **Change Status**: **Partially implemented / Decision required**
- **Thesis Promise**: Ch. 1 [120], Ch. 3 [261], [267] describes a timed survival challenge mode.
- **Codebase Reality**: We have timed Mastery Capstones and "Quick Practice" in the Practice Hub, but we do not have an infinite arcade-style survival runner where a timer counts down continuously.
- **Group Recommendation**: Decide whether:
  - *Option A (Recommended)*: Update the paper to describe "Quick Practice" and "Unit Mastery Capstones" as our rapid-retrieval mechanisms.
  - *Option B*: Implement a simple timed widget in the Practice Hub before testing.

---

### 5.3 In-App Pre/Post Knowledge Assessment Module
- **Change Status**: **Partially implemented / Decision required**
- **Thesis Promise**: Ch. 3 [274], [282] specifies a 25-item multiple-choice test administered before app exposure, immediately after, and 1 week later.
- **Codebase Reality**: The app has an extensive 50-pair question bank, but there is no locked `/assessment` route that presents a formal 25-question test with direct database export for research evaluators.
- **Group Recommendation**: Decide whether:
  - *Option A*: Administer the 25-item test using Google Forms / printed questionnaire during the on-site Mapúa evaluation session (standard academic practice).
  - *Option B (Recommended for high marks)*: Build a simple in-app `/assessment` page that logs pre/post test scores directly into Supabase.

---

## 6. Incorrect Process Flow (Figure 3.2 Flagged)

> [!WARNING]
> **FIGURE 3.2 AND PARAGRAPHS [264]–[270] ARE UNRELIABLE**  
> Under no circumstances should Figure 3.2 be presented to our adviser or panel as the current operational flow.

```
       OUTDATED & FLAWED THESIS FLOW (FIGURE 3.2):
       ┌───────────┐     ┌──────────────┐     ┌────────────────────────────────────┐
       │ Open App  │ ──> │ Verify Login │ ──> │ Dashboard Mode Selector            │
       └───────────┘     └──────────────┘     │ (Pick 1 of 5 Minigame Modes)       │
                                              └─────────────────┬──────────────────┘
                                                                │
                                                                ▼
                                                      ┌───────────────────┐
                                                      │ Answer Question   │
                                                      └─────────┬─────────┘
                                                                │
                                     ┌──────────────────────────┴──────────────────────────┐
                                     ▼ (Correct)                                           ▼ (Incorrect)
                         ┌───────────────────────┐                             ┌───────────────────────┐
                         │ Award XP & Streak     │                             │ Deduct Heart          │
                         └───────────────────────┘                             └───────────┬───────────┘
                                                                                           │
                                                                                           ▼
                                                                               ┌───────────────────────┐
                                                                               │ Prompt: "Retry now or │
                                                                               │ return to Dashboard?" │
                                                                               └───────────────────────┘
```

### Why Figure 3.2 Must Be Excised and Replaced:
1. **False Mode Selector**: It depicts the dashboard as a launcher for 5 separate arcade modes. The real dashboard is a structured **Learning Path** where learners progress through units and levels.
2. **Harmful Retry Modal**: Paragraph [269] claims that whenever a user makes a mistake:
   > *"After this, the system will ask if the user wants to retry the challenge. If the user chooses to retry, the user will return to the selected challenge and attempt the activity again. If the user chooses not to retry, the system will return to the dashboard..."*
   
   This is completely contrary to modern educational software design. If an app interrupts a student with a popup asking if they want to retry after every single error, it destroys learning flow. In our real app, mistakes show an immediate explanatory feedback drawer, record the missed item in the student's `mistakes_queue`, and seamlessly move to the next question.
3. **Omits Practice Hub**: Figure 3.2 completely ignores our spaced repetition system, due reviews, and mistake remediation hub.

*Action*: A new, verified process flow diagram based on our actual Learning Path will be designed and presented for approval in our next task.

---

## 7. Features Planned for Removal

To keep LASA-Quest strictly focused on its core educational objectives and prepare for student evaluation, two features in the codebase are planned for removal from the user-facing application:

### 7.1 Leaderboards (`/leaderboards`)
- **Status**: **Removal Planned (Awaiting Approval)**
- **Why it is being removed**:
  - The thesis proposal **never mentioned or required a leaderboard**. A search of `CNS-PROPOSAL-THESIS-DOCUMENT-1 (2).docx` finds **0 occurrences** of the words "leaderboard" or "ranking".
  - Competitive XP leaderboards can distract pharmacy students from accuracy and encourage rapid guessing rather than thoughtful discrimination.
  - Removing it simplifies our system boundary for the Mapúa student evaluation.
- **Components to be removed**:
  - Route: `/leaderboards` in [`src/App.jsx`](file:///d:/3/duoclonego/src/App.jsx#L58)
  - Navigation item in Desktop Sidebar ([`Sidebar.jsx:124`](file:///d:/3/duoclonego/src/components/Sidebar/Sidebar.jsx#L124)) and Mobile Nav ([`MobileNav.jsx:49`](file:///d:/3/duoclonego/src/components/MobileNav/MobileNav.jsx#L49))
  - Page & styles: [`src/pages/Leaderboards/Leaderboards.jsx`](file:///d:/3/duoclonego/src/pages/Leaderboards/Leaderboards.jsx) and `Leaderboards.css`
  - Service: [`src/services/leaderboardService.js`](file:///d:/3/duoclonego/src/services/leaderboardService.js)
- **Important Preservation**: Shared learner XP (`user.xp`), level attempt logging, and achievement badges will **remain completely intact**. Only the competitive ranking page is removed.

---

### 7.2 In-App Documentation (`/documentation`)
- **Status**: **Removal Planned (Awaiting Approval)**
- **Why it is being removed**:
  - The in-app Documentation page was created as an internal developer reference and architecture guide during coding.
  - Pharmacy students taking our study should not see internal software engineering documentation, schema diagrams, and developer guides inside a gamified learning application.
  - The thesis proposal does not require an in-app documentation page for end-users.
- **Components to be removed**:
  - Route: `/documentation` in [`src/App.jsx`](file:///d:/3/duoclonego/src/App.jsx#L61)
  - Nav button in Top Navbar ([`Navbar.jsx:20`](file:///d:/3/duoclonego/src/components/Navbar/Navbar.jsx#L20)) and Sidebar ([`Sidebar.jsx:127`](file:///d:/3/duoclonego/src/components/Sidebar/Sidebar.jsx#L127))
  - Page & styles: [`src/pages/Documentation/Documentation.jsx`](file:///d:/3/duoclonego/src/pages/Documentation/Documentation.jsx) and `Documentation.css`
- **Important Preservation**: All repository developer documentation (`README.md`, `agents/docs/`, audit reports, checklists) will remain safe in the repository for our development records. Only the student-facing route is removed.

---

## 8. Decisions Required from the Group and Adviser

Please review these specific questions and confirm our preferred direction:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               DECISION SUMMARY BOX                                     │
├────┬─────────────────────────────┬──────────────────────────┬──────────────────────────┤
│ #  │ Issue                       │ Recommended Option       │ Status                   │
├────┼─────────────────────────────┼──────────────────────────┼──────────────────────────┤
│ 1  │ Process Flow Diagram        │ Replace Figure 3.2       │ Awaiting Group Sign-off  │
│ 2  │ Clinical Dispensing Scope   │ Defer to future work     │ Awaiting Adviser Confirm │
│ 3  │ Knowledge Assessment Test   │ Build in-app test route  │ Awaiting Group Decision  │
│ 4  │ Leaderboards Removal        │ Remove from UI           │ Awaiting Group Sign-off  │
│ 5  │ In-App Docs Removal         │ Remove from UI           │ Awaiting Group Sign-off  │
│ 6  │ Survival Mode vs Quick Drill│ Use Quick Practice       │ Awaiting Group Decision  │
└────┴─────────────────────────────┴──────────────────────────┴──────────────────────────┘
```

1. **Process Flow Replacement**: Do all group members agree to excise Figure 3.2 and adopt the Learning Path workflow diagram?
2. **Clinical Pharmacology Boundary**: Does our adviser agree that LASA-Quest should concentrate strictly on Look-Alike and Sound-Alike drug name recognition, leaving theoretical disease indications and dosage calculations for future work?
3. **Assessment Delivery**: Should we build a simple `/assessment` page inside LASA-Quest for our Mapúa respondents, or administer the 25-item test using Google Forms / printed paper?
4. **Leaderboards & Documentation Scope Cleanup**: Does the group approve removing the Leaderboard and in-app Documentation links before running student usability tests?

---

## 9. Recommended Revision Checklist

When we edit our thesis document, follow this step-by-step checklist:

### Chapter 1 (Introduction & Scope)
- [ ] Update title and all body references from *Duoclongo* to **LASA-Quest**.
- [ ] Revise Table 1.3 to remove mentions of "Look-Alike Spotter" and "Sound-Alike Detector" as standalone games.
- [ ] Update Specific Objective 2 to describe our 4 cognitive activity types, audio read-back, and spaced repetition.
- [ ] Clarify in Scope and Delimitation that clinical pharmacology theory and dispensing decisions are reserved for future research phases.

### Chapter 2 (Literature Review)
- [ ] Add a short subsection on **Retrieval Practice and the Leitner Spaced Repetition Method** to support our retention mechanics.
- [ ] Add a brief discussion on **Speech Synthesis in Medication Safety** (acoustic read-back protocols).

### Chapter 3 (Methodology & Architecture)
- [ ] Replace **Figure 3.2** with the new verified Learning Path and Spaced Practice process flow.
- [ ] Replace **Paragraphs [264]–[270]** to describe the Learning Path, immediate feedback drawer, and mistakes queue (removing the retry modal narrative).
- [ ] Update **SDLC Increments 1–4** to reflect our real development milestones (Core Data, Audio Pipeline, Supabase Cloud Persistence, Gamification & Themes).
- [ ] Document **Supabase PostgreSQL** and Row-Level Security under the technical architecture subsection.
- [ ] Document our **Offline Pre-Synthesized Neural Audio Subsystem** (100 static MP3s via Azure AI Speech Raw Mode).
- [ ] Confirm our plan for the **25-item Knowledge Assessment** and **PSSUQ 7-point Likert questionnaire**.

---

## 10. Verification Limitations

To ensure scientific honesty, the following limitations of this audit are noted:
1. **Evaluation Cohort Data**: The actual empirical knowledge test scores and PSSUQ survey responses cannot be recorded yet because the evaluation session with Mapúa pharmacy students has not yet been conducted.
2. **Multi-User Concurrency**: Supabase authentication and database policies were verified in local dev and single-user cloud sessions; high-concurrency load testing (e.g. 50 simultaneous classroom students) should be verified prior to on-site testing.
3. **Historical Thesis Process Flow**: The origin of the flawed Figure 3.2 in early proposal drafts could not be determined from the code alone; it appears to have been an early conceptual sketch drawn before any programming began.

---

*Report prepared and verified from active codebase assets in `d:\3\duoclonego\` and reference thesis document `agents/research/CNS-PROPOSAL-THESIS-DOCUMENT-1 (2).docx`.*
