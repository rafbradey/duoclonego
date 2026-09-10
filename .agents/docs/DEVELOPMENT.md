# DUOCLONGO — DEVELOPMENT RULES

## 0. DOCUMENTATION

## Living In-App Documentation

Duoclongo has an in-app documentation page available at:

`/documentation`

This is the living reference for the **currently implemented application**.

### Documentation Rule

Whenever a development task:

* adds a new user-facing feature
* removes a feature
* changes existing feature behavior
* changes a user workflow
* adds or changes a route
* changes the learning system
* changes question types or answer behavior
* changes LASA data behavior
* changes progression behavior
* significantly changes the UI/UX

the developer/AI agent MUST check whether `/documentation` needs to be updated.

If the change affects something documented there, update the documentation as part of the same task.

### Feature Development Workflow

Use:

READ → INSPECT → PLAN → IMPLEMENT → TEST → DOCUMENT → VERIFY → COMMIT

Documentation is part of the feature's Definition of Done when the implementation changes documented behavior.

### Do Not Document Everything

Internal implementation changes that do not affect application behavior generally do not require an update.

Examples:

* internal variable renaming
* code formatting
* minor refactoring
* internal performance improvements with no behavior change
* fixing an implementation detail without changing the user-visible behavior

Use judgment.

### Accuracy Rule

The `/documentation` page must describe what **currently exists**, not what is planned.

Do NOT document:

* future roadmap features as implemented
* ideas that have not been built
* TODO items as existing functionality
* architectural intentions as current behavior
* unsupported medical claims
* unsupported research claims

When something is incomplete, clearly identify it as:

* Implemented
* Partially Implemented
* Prototype
* Static Data
* Placeholder
* Not Implemented

### Developer Documentation vs In-App Documentation

Keep these purposes separate.

`.agents/` and `docs/` are primarily for:

* development instructions
* architecture
* research guidance
* roadmap
* technical documentation
* project planning

`/documentation` is primarily for:

* current application features
* current user workflows
* current system behavior
* current learning functionality
* current limitations
* information useful to developers and research paper writers

### Documentation Consistency

Before completing a feature, ask:

> "Did this change anything that someone reading `/documentation` would need to know?"

If yes, update it before committing.

The application code remains the source of truth for what is actually implemented.

Never allow `/documentation` to describe behavior that no longer exists.


## 1. GENERAL RULE

The existing repository is the source of truth.

Never assume that the project matches a previous description.

Inspect the actual code before making significant changes.

---

# 2. BEFORE CODING

Before modifying a feature:

1. Find the relevant files.
2. Read the existing implementation.
3. Identify dependencies.
4. Identify related components.
5. Identify related services.
6. Check routing.
7. Check existing data structures.
8. Determine whether an existing solution can be reused.
9. Plan the smallest reasonable change.

Do not immediately rewrite files.

---
# Git Workflow

The AI agent is responsible for preparing and committing changes, but the user is responsible for pushing them to the remote repository.

## Allowed Git Operations

The agent may:

- inspect Git status/history
- stage changes with `git add`
- create commits with `git commit`
- create clear commit messages

The agent must NOT:

- run `git push`
- force push
- modify remote branches
- reset or discard user work without explicit permission
- use destructive Git commands such as:
  - `git reset --hard`
  - `git clean -fd`
  - `git checkout -- .`
  - equivalent destructive commands

## Commit Workflow

After completing a coherent piece of work:

1. Inspect the changes.
2. Run relevant validation.
3. Review `git diff`.
4. Stage the intended changes.
5. Create a commit.

Use clear, conventional commit messages where appropriate, for example:

```text
feat: add LASA drug data model
feat: implement lesson question engine
fix: correct profile route
refactor: create shared app layout
style: improve mobile lesson layout
chore: remove unused dependencies
docs: update development roadmap

# 3. MINIMAL CHANGES

Prefer targeted changes.

If a feature can be implemented by modifying three files, do not rewrite twenty files.

Do not refactor unrelated code while implementing a feature unless the refactor is necessary.

If a larger refactor is genuinely required, explain why before performing it.

---

# 4. DO NOT DUPLICATE

Before creating:

- component
- hook
- service
- utility
- data model
- CSS pattern

search the repository for an existing implementation.

Reuse or extend existing functionality when appropriate.

---

# 5. DO NOT OVER-ENGINEER

Do not add a dependency just because it could solve a problem.

Before adding a library, determine:

- whether the existing stack can solve the problem
- whether the dependency is actually necessary
- whether it introduces unnecessary complexity

Keep the project understandable.

---

# 6. CODE QUALITY

Prefer code that is:

- readable
- explicit
- maintainable
- consistent
- easy to debug

Avoid clever abstractions when simple code works.

Use meaningful names.

Keep components reasonably focused.

Keep business logic out of presentation when practical.

---

# 7. REACT RULES

Follow the existing React conventions in the repository.

Avoid:

- unnecessary state
- unnecessary effects
- duplicated state
- deeply nested component logic
- large monolithic components

When a component becomes difficult to understand, consider separating a meaningful piece of functionality.

Do not split components merely to create more files.

---

# 8. DATA RULES

Do not hardcode application data inside UI components when the data belongs in the data layer.

Examples:

Bad:

A React component containing a large list of LASA drugs.

Better:

Structured data accessed through the appropriate service.

Do not invent medical information.

---

# 9. LASA CONTENT RULE

LASA content is educational content.

Do not casually generate or modify drug information without considering accuracy.

When authoritative medical information is required, use an appropriate verified source.

Keep educational data separate from presentation code.

---

# 10. UI RULES

Maintain a consistent visual language.

Reuse:

- buttons
- cards
- spacing patterns
- typography
- icons
- feedback patterns

Avoid creating multiple visual implementations of the same UI concept.

UI should prioritize usability over visual imitation.

---

# 11. MOBILE RULE

Every new UI feature must consider mobile.

Check:

- screen width
- text wrapping
- button size
- touch targets
- spacing
- overflow
- fixed elements
- navigation
- modal behavior

Do not knowingly introduce desktop-only layouts.

---

# 12. ACCESSIBILITY

Interactive elements should be usable with:

- keyboard
- readable text
- sufficient contrast
- appropriate semantic elements
- meaningful labels

Do not use clickable `<div>` elements when a button or link is appropriate.

---

# 13. ERROR HANDLING

Features should account for:

- loading
- success
- empty state
- error state

Do not assume data always loads successfully.

User-facing errors should be understandable.

---

# 14. TESTING

A feature is not complete merely because the project compiles.

After implementing a feature:

1. Run lint.
2. Run the build.
3. Test the relevant user flow.
4. Check desktop behavior.
5. Check mobile behavior when UI is affected.
6. Check for console errors.

If tests are unavailable, perform reasonable manual verification.

Never claim something was tested if it was not.

---

# Data Folder and Future Supabase Migration

The existing project contains a `src/data/` directory with JSON files.

The AI agent MUST inspect the entire data directory before changing the data architecture.

Example:

```text
src/data/
├── levels/
│   ├── section-1/
│   │   ├── unit-1.json
│   │   └── unit-2.json
│   └── index.js
├── lasaData.json
├── user.json
└── ...
```

These JSON files are part of the existing Duoclongo prototype and contain verified LASA educational content, level definitions, and user state.

Do not assume they represent the final database schema.

---

## Existing JSON Data

For every JSON data source, determine:

* what it contains
* where it is used
* which components/services consume it
* whether it is actually active
* whether it should be preserved
* whether it needs restructuring
* whether it should eventually become persistent database data
* whether it is temporary/mock data

Classify existing data appropriately:

```text
KEEP
RESTRUCTURE
MIGRATE LATER
MOCK / TEMPORARY
REMOVE
```

Do not delete or overwrite existing JSON data simply because it is part of the old architecture.

Useful existing data may eventually become seed data for the production database.

---

# Future Supabase Backend

The long-term backend for Duoclongo will use **Supabase**.

The current foundation rebuild does NOT require implementing the complete Supabase backend unless explicitly instructed.

However, the application should be structured so that the eventual migration from local JSON data to Supabase does not require rewriting the UI or core learning engine.

The intended evolution is:

```text
CURRENT

React
  ↓
Services
  ↓
Local JSON Data
```

Eventually:

```text
FUTURE

React
  ↓
Services
  ↓
Supabase
  ↓
PostgreSQL
```

The data source should therefore remain replaceable.

---

# Data Access

Avoid tightly coupling UI components directly to JSON files throughout the application.

Avoid patterns such as:

```js
import lessons from "../data/lessons.json";
```

being repeated across many components.

Prefer an appropriate service/data-access layer where practical:

```text
Lesson UI
    ↓
lessonService
    ↓
Local JSON data
```

Later:

```text
Lesson UI
    ↓
lessonService
    ↓
Supabase
```

This allows the UI and learning engine to remain mostly independent of where the data is stored.

Do not create a large abstraction framework solely for this purpose.

Keep the implementation simple and understandable.

---

# Local Data During Development

Local JSON data is acceptable during the early development phases.

Use it when it makes development:

* simple
* fast
* deterministic
* easy to test
* easy to understand

Do not introduce Supabase prematurely simply because it is planned for the future.

The priority is to establish a clean application and learning architecture first.

---

# Future Supabase Entities

When designing new domain models, consider how they could eventually map to Supabase.

Potential future entities include:

```text
users
drugs
lasa_pairs
units
lessons
lesson_activities
questions
answers
user_progress
lesson_attempts
achievements
quests
streaks
```

These are conceptual future entities only.

They are NOT instructions to create all of these tables immediately.

Create database structures only when the relevant roadmap phase requires them.

---

# Data Migration Mindset

When working with existing or new data, think in this order:

```text
What data currently exists?
        ↓
What data is actually being used?
        ↓
What data is useful?
        ↓
What data needs restructuring?
        ↓
What data should eventually become persistent?
        ↓
What should eventually migrate to Supabase?
```

Preserve useful educational and application data while improving the architecture around it.

---

# LASA Data

LASA-related educational data requires additional care.

Before creating or modifying LASA data, read:

```text
.agents/LASA-RESEARCH.md
```

Do not invent:

* LASA pairs
* Tall Man lettering
* drug classifications
* medication facts
* indications
* medication safety recommendations

Verified educational content should remain distinguishable from application-generated or mock development data.

---

# Important Rule

**Supabase is the planned future backend, not the current requirement.**

Do not rebuild the entire application around Supabase during the foundation phase.

Instead, create a clean architecture that allows:

```text
JSON → Supabase
```

to happen later with minimal disruption.

The goal is:

```text
Stable UI
+
Stable Learning Engine
+
Stable Domain Models
+
Replaceable Data Source
```



# 15. GIT

Keep changes logically grouped.

Do not modify unrelated files.

Do not commit generated files unless the project requires them.

Before committing, review:

- changed files
- added files
- removed files
- unintended modifications

Commit messages should describe the actual change.

---

# 16. SECURITY

Never commit:

- passwords
- API keys
- tokens
- secrets
- private credentials

Use environment variables for secrets.

Do not expose server-only credentials in client-side code.

Validate user-provided data when necessary.

---

# 17. PERFORMANCE

Do not prematurely optimize.

However, avoid obvious problems such as:

- unnecessarily huge assets
- repeated expensive calculations
- unnecessary API requests
- unnecessary re-renders
- loading large resources when they are not needed

Measure or identify a real problem before introducing complicated optimization.

---

# 18. FEATURE IMPLEMENTATION

When asked to implement a feature:

First determine:

What already exists?
What needs to change?
What data is required?
What UI is required?
What logic is required?
What routes are affected?
What mobile behavior is required?
How will it be tested?

Then implement.

---

# 19. PHASED DEVELOPMENT

Duoclongo should be developed in phases.

The preferred high-level order is:

Foundation
↓
LASA Data
↓
Learning Engine
↓
Progression
↓
Backend / Persistence
↓
Gamification
↓
Mobile Polish
↓
Production

Do not skip directly to advanced gamification while the learning engine is incomplete unless explicitly requested.

---

# 20. AGENT REPORTING

After completing a task, report:

### Changed

What files/features were changed.

### Why

Why the changes were necessary.

### Tested

What commands and user flows were tested.

### Issues

Anything that remains broken or incomplete.

### Next

Any logical next step.

Do not claim unrelated features were completed.

---

# 21. IMPORTANT

When in doubt:

Inspect first.

Prefer the existing architecture.

Make the smallest reasonable change.

Keep the code understandable.

Protect the core learning experience.

Do not turn a small feature request into an unnecessary rewrite.

---

# 22. CREATING NEW ACTIVITIES & QUESTION TYPES (DEVELOPER PROCEDURE)

When adding a new learning activity or question interaction:

### Architectural Pipeline
```text
LASA Relationship (lasaData.json)
        ↓
Learning Objective (Pedagogical Competency)
        ↓
Activity Type (construction | matching | recognition | discrimination | retrieval | simulation)
        ↓
Question / Task Interaction (tall_man | matching | multiple_choice | true_false)
        ↓
Evaluation & Tolerance Engine (lessonEngine.js)
        ↓
Corrective Feedback Drawer (FeedbackDrawer.jsx)
```

### Procedure Checklist
1. **Activity Placement in Unit JSON:**
   - Under `levels[i].activities[]`, define the activity container with `id`, `activityType`, and `learningObjective`.
2. **Question Item Schema:**
   - Add items under `activity.questions[]`. Include `type`, `lasaId`, `prompt`, `explanation`, `relatedDrug`, and interaction-specific parameters.
   - Do NOT hardcode drug names, choices, or answers in React components. Keep data in the JSON layer.
3. **Question Card Component:**
   - Create `src/components/QuestionCard/<Name>Question.jsx` and associated CSS.
   - Component receives `(question, selectedAnswer, onSelect, onSubmit, isSubmitted)`.
   - Never use multiple-choice guessing if the objective requires construction or production.
4. **Strategy Dispatcher Registration:**
   - Add `case "<type>":` in `src/components/QuestionCard/QuestionRenderer.jsx`.
5. **Answer Evaluation in Domain Engine:**
   - Extend `evaluateAnswer(question, selectedAnswer)` in `src/services/lessonEngine.js`.
   - Apply tolerant normalization (trim whitespace, handle casing).
   - Ensure the returned object contains `isCorrect`, `selectedAnswer`, `correctAnswer`, and `explanation`.
6. **Developer Testing Override Support:**
   - In `src/pages/Lesson/LessonSession.jsx`, update `handleDeveloperOverride()` so developers can force correct/incorrect outcomes without failing data contracts.
7. **Documentation:**
   - Update in-app documentation at `src/pages/Documentation/Documentation.jsx` (Section 4 taxonomy, Section 6 JSON schema, Section 10 boundaries).

### 22.1 Dedicated Unit Mastery Levels & Capstone Tasks
Every Unit in Duoclongo implements a dedicated 4th level called **Unit Mastery**:
- **Unit Hierarchy:**
  ```text
  UNIT
  ├── Level 1 (type: "level")
  ├── Level 2 (type: "level")
  ├── Level 3 (type: "level")
  └── Unit Mastery (type: "unit_mastery")
  ```
- **Level Schema:**
  ```json
  {
    "id": "unit_001_mastery",
    "levelNumber": 4,
    "type": "unit_mastery",
    "title": "Unit 1 Mastery",
    "description": "Comprehensive review and unassisted Tall Man lettering mastery for Unit 1.",
    "learningObjective": "Demonstrate complete unit mastery of LASA distinction and unassisted Tall Man lettering without scaffolding.",
    "xpReward": 25,
    "unlocked": false,
    "activities": [...]
  }
  ```
- **Routing:**
  - Accessible directly at `/unit/:unitId/mastery` (e.g. `/unit/1/mastery`, `/unit/2/mastery`).
  - Refresh-safe and directly navigable via React Router.
- **Progression Rules:**
  - Unit Mastery unlocks only when Levels 1, 2, and 3 are completed.
  - Conquering Unit Mastery marks the unit mastered and unlocks Level 1 of the next Unit.
- **Visual Presentation:**
  - Rendered on the Learn page as a prominent golden/amber card with a trophy badge (🏆), clearly separated from the 3 normal level circles.
- **Capstone Task Metadata:**
  ```json
  {
    "id": "qXXX_mastery",
    "type": "tall_man",
    "activityRole": "unit_mastery",
    "isFinalTask": true,
    "scaffold": false,
    "standardName": "drugname",
    "tallManName": "drugNAME",
    "prefix": "",
    "expectedSegment": "drugNAME",
    "suffix": ""
  }
  ```
- **Pedagogical & Evaluation Requirements:**
  - Strip away prefix/suffix frames and live dynamic reconstruction preview.
  - Render an unassisted full-name input field (`.tm-full-input`) with an amber mastery badge.
  - Enforce strict case-sensitive match (`inputTrimmed === targetTallMan`).
  - Reject all-lowercase (`drugname`) or all-uppercase (`DRUGNAME`).
- **Developer Override:**
  - Works identically inside Unit Mastery sessions (`[ ANSWER CORRECTLY ]` / `[ ANSWER INCORRECTLY ]`). No second override system is created.

### 22.2 Situational LASA Recognition Activities
Situational activities simulate realistic medication dispensing verification without introducing premature clinical decision-making:
- **Activity & Question Schema:**
  ```json
  {
    "id": "qXXX_sit",
    "type": "multiple_choice",
    "activityType": "situational",
    "lasaId": "lasa-XXX",
    "scenario": "A patient presents a written prescription order for [DRUG A]. The dispensary shelf stores multiple medications with similar phonemic and visual names.",
    "prompt": "Which medication name matches the prescription order and avoids a look-alike mix-up with [DRUG B]?",
    "choices": ["[DRUG A]", "[DRUG B]"],
    "correctAnswer": "[DRUG A]"
  }
  ```
- **Strict Scope Boundaries:**
  - Tests **name recognition and distinction only**.
  - **DO NOT** test dosages, therapeutic calculations, administration routes, drug mechanisms, or diagnostic indications.
  - The UI automatically renders the `scenario` within a formatted `.mc-scenario-card` with a green `DISPENSING SCENARIO` badge.