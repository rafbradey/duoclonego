# DUOCLONGO — APPLICATION ARCHITECTURE

## 1. CURRENT TECHNOLOGY

The repository should be treated as the source of truth.

The currently known stack is:

- React
- Vite
- React Router
- JavaScript / JSX
- npm
- CSS
- Lucide React
- ESLint

Current architecture is primarily client-side.

The project currently uses static JSON and mock service functions.

There is currently no fully implemented:

- backend
- database
- authentication
- global state management
- automated test framework

Agents must verify the repository before assuming any of these remain unchanged.

---

# 2. CURRENT ARCHITECTURE

The current application is approximately:

React
↓
Pages
↓
Components
↓
Mock Services
↓
Static JSON

React state is currently used for local state.

The application should not pretend that mock services are a real backend.

---

# 3. TARGET ARCHITECTURE

The long-term architecture should separate responsibilities:

UI
↓
Pages
↓
Feature Components
↓
Application / Domain Logic
↓
Services
↓
Data Layer
↓
Backend / Database

Each layer should have a clear responsibility.

---

# 4. UI LAYER

Responsible for:

- rendering
- interaction
- visual states
- accessibility
- responsive behavior

UI components should not directly contain database queries.

UI components should not contain large amounts of business logic.

---

# 5. PAGE LAYER

Pages coordinate larger user experiences.

Examples:

- Learn
- Lesson
- Practice
- Quests
- Leaderboards
- Shop
- Profile

Pages may coordinate components and application logic.

Avoid putting every piece of functionality directly inside a page component.

---

# 6. COMPONENT LAYER

Components should represent reusable UI or feature pieces.

Examples:

- Navbar
- Sidebar
- LessonCard
- QuestionCard
- AnswerButton
- ProgressBar
- FeedbackPanel
- Mascot
- XPDisplay
- HeartsDisplay

Before creating a new component, check whether an existing component can be reused or extended.

Avoid duplicate components that solve the same problem.

---

# 7. DOMAIN / APPLICATION LOGIC

Learning logic should eventually be separated from presentation.

Examples:

- answer evaluation
- XP calculation
- lesson progression
- question selection
- lesson completion
- unlocking
- mastery calculations

The same learning logic should be usable regardless of whether the UI is desktop or mobile.

---

# 8. SERVICES

Services should isolate data access.

Core service layer implementations:
- `userService`: Provides `getCurrentUser()`, `getUserById(id)`, and `updateUserProgress()`. Decouples UI from underlying user arrays or databases.
- `drugService`: Queries verified LASA data (`getAllLasaEntries()`, `getLasaById()`, `getLevels()`, `getLevelById()`, `searchLasaEntries()`, `getSourceMetadata()`).
- `unitService`: Loads units and curriculum metadata (`getUnits()`, `getUnitById()`).
- `lessonService`: Fetches lessons and question structures across sections (`getLessons()`, `getLessonById()`, `getLessonsByUnit()`).
- `lessonEngine`: Evaluates answers and calculates XP rewards without React dependencies (`evaluateAnswer()`, `calculateLessonXP()`, `createSession()`, `recordSessionAnswer()`).

Services provide a stable interface to the rest of the application.

The implementation behind a service will evolve later:
`Static JSON` $\longrightarrow$ `API` $\longrightarrow$ `Supabase / PostgreSQL`

The UI should not need to be rewritten when the data source changes.

---

# 9. DATA ARCHITECTURE

The long-term data model should conceptually contain:

User
Progress
Unit
Lesson
Activity
Question
Answer

And the LASA domain:

Drug
LASA Pair
LASA Group
Drug Information
Learning Content

Conceptually:

User
↓
Progress
↓
Section
↓
Unit
↓
Level (1..X, where X is pedagogical and dynamic)
↓
Lesson
↓
Activity
↓
Question / Task

And:

Drug
↓
LASA Group
↓
Learning Content
↓
Question

### Level & Unit Data Organization

Curriculum levels and units are organized hierarchically:

```text
src/data/levels/
├── index.js                     <-- Aggregates sections, units, levels, lessons, activities, and questions
├── section-1/
│   ├── unit-1.json              <-- Unit 1: Introductory LASA Pairs (X = 3 levels)
│   ├── unit-2.json              <-- Unit 2: Formulations & Suffixes (X = 3 levels)
│   └── unit-3.json              <-- Unit 3: Brand & Suffix Differentiation (X = 3 levels)
└── section-2/
    └── unit-1.json              <-- Unit 4: High-Alert Opioids & Potency Differentiation (X = 1 level)
```

Each unit independently defines its metadata and a configurable array of `levels[]` ($X \ge 1$), where each level defines:
- `levelNumber` & `title`
- `learningObjective`
- `xpReward` & `unlocked` status
- `lessons[]` or `activities[]` (normalized by `src/data/levels/index.js` into the explicit structure `Section → Unit → Level → Lesson → Activity → Question`).

### Standardized 4-Level Unit Structure
Every Unit in the application implements a dedicated 4th level:

```text
UNIT
├── Level 1: Identification & Familiarization (type: "level")
├── Level 2: Tall Man Discrimination (type: "level")
├── Level 3: Situational Recognition & Verification (type: "level")
└── Unit Mastery: Unit-Wide Review & Unassisted Tall Man Capstone (type: "unit_mastery")
```

- **Normal Levels (`type: "level"`):** Progressive instructional steps through guided learning activities.
- **Unit Mastery (`type: "unit_mastery"`):** Synthesizes cumulative pair distinctions across the entire Unit, concluding with the unassisted, no-hint Tall Man Lettering task.
- **Progression Rule:** Level 1 unlocks if the unit is active (or previous unit's mastery is completed); Levels 2 & 3 unlock sequentially; Unit Mastery unlocks only when Level 3 is completed. Completing Unit Mastery unlocks the subsequent Unit.
- **Visual Distinction:** Normal levels appear as circular nodes along the curriculum path; Unit Mastery renders as a prominent, golden/amber card with a trophy badge (🏆).
- **Direct Routing:** Directly navigable via `/unit/:unitId/mastery`.

---

# 10. STATE MANAGEMENT

Use the simplest state-management solution that solves the current problem.

Current approach:

- React state
- props
- mock services

Do not introduce Redux, Zustand, Context, or another state-management system without a demonstrated need.

Potential future state domains:

- User
- Lesson Session
- Progress
- Gamification
- UI

State should be separated by responsibility.

---

# 11. LESSON & ACTIVITY ARCHITECTURE

The learning engine follows a purpose-driven progression grounded in cognitive science:

```text
LASA Relationship (Authoritative Pharmacological Fact)
        ↓
Learning Objective (Educational Competency Target)
        ↓
Activity Type (Pedagogical Container)
        ↓
Question / Task Interaction (Concrete Interaction Mechanism)
        ↓
User Response (Constructed Input, Tap, or Selection)
        ↓
Evaluation Engine (Domain Evaluation Logic & Normalization)
        ↓
Feedback Drawer (Corrective Solution & Pharmacological Explanation)
        ↓
Session Progress & XP / Mastery Recording
```

### Purpose-Driven Activity Taxonomy
Activities represent *what the learner is actually practicing*, distinct from the mechanical question UI:
- `construction`: Active production and reconstruction of critical letters (e.g., Tall Man lettering) without multiple-choice guessing cues.
- `identification`: Identifying documented LASA counterparts from verified ISMP pairs.
- `distinction`: Differentiating subtle phonemic, orthographic, or Tall Man distinctions between look-alike/sound-alike pairs.
- `situational`: Realistic dispensing/prescription verification contexts testing name distinction (strictly without clinical decision-making or pharmacology theory).
- `retrieval`: Memory retrieval of previously learned pairs (e.g. `/practice` hub and Mistakes Queue).
- `unit_mastery`: Concluding unassisted no-hint Tall Man retrieval milestone for each unit.
- `simulation`: Future applied dispensing scenarios enforcing multi-checkpoint clinical verification (reserved for future thesis phases).

### Scope Boundary Delineation
- **Active Current Scope:** Core learning objectives, Tall Man construction (guided and unassisted), LASA identification, LASA distinction, and situational LASA recognition.
- **Deferred Future Scope:** Questions regarding ISMP regulatory theory, drug indications, mechanisms of action, dosage calculations, and clinical reasoning are **intentionally excluded from active learning content** and safely preserved in `src/data/curriculum/deferredTheoreticalQuestions.json`.

The lesson engine (`src/services/lessonEngine.js`) evaluates answers independently of React components, allowing automated unit testing and headless validation.

---

# 12. QUESTION ARCHITECTURE

Questions represent the concrete interaction mechanism dispatched by `activityType` and `question.type`:

- `tall_man`: Constructed-response fill-in-the-blank. Operates in two distinct pedagogical modes:
  1. *Guided Practice Mode* (`scaffold: true`): User enters the capitalized segment within prefix/suffix frames with live dynamic name reconstruction (<TallManText />) and tolerant casing normalization.
  2. *Unit Mastery Mode* (`activityRole: "unit_mastery"`, `isFinalTask: true`, `scaffold: false`): Unassisted independent retrieval requiring the learner to type the complete drug name with strict case-sensitive validation (e.g. `predniSONE`) without affix frames or live previews.
- `multiple_choice`: Multi-option choice grid for identification and distinction. When `question.scenario` is provided, renders a contextual "DISPENSING SCENARIO" card above the prompt.
- `matching`: Interactive tile selection requiring learners to link left and right counterpart pairs.
- `true_false`: Binary choice evaluation for distinction challenges.

Question definition objects provide the data required for rendering and evaluation:
- `QuestionRenderer.jsx` acts as a strategy dispatcher mapping `question.type` to `<TallManQuestion />`, `<MatchingQuestion />`, or `<MultipleChoiceQuestion />`.
- `LessonSession.jsx` remains decoupled from concrete question card implementations and passes `onSelect` and `onSubmit` callbacks.

Developer answer overrides (`[ ANSWER CORRECTLY ]` / `[ ANSWER INCORRECTLY ]`) intercept at the session layer without modifying question data schemas.

---

# 13. ROUTING

Current routes must be verified from the repository.

The intended application structure is approximately:

/
├── /learn
├── /lesson/:lessonId
├── /unit/:unitId/mastery
├── /practice
├── /quests
├── /leaderboards
├── /shop
├── /profile
├── /documentation
└── /settings

Routes should use shared layouts where appropriate.

Do not duplicate Navbar or Sidebar implementation across every page.

Invalid routes should eventually have a fallback page.

---

# 14. RESPONSIVE ARCHITECTURE

Responsive behavior must be considered whenever UI is created or modified.

Supported targets:

- desktop
- tablet
- mobile

Do not create a desktop-only component and rely on a future rewrite for mobile.

Components should adapt through:

- responsive CSS
- flexible layouts
- appropriate breakpoints
- touch-friendly controls
- responsive typography
- responsive spacing

---

# 15. BACKEND DIRECTION

The current application does not have a complete backend.

A future backend/database may handle:

- authentication
- users
- progress
- lessons
- questions
- LASA data
- XP
- streaks
- achievements
- leaderboards

The exact backend technology should be decided when the project reaches the backend phase.

Do not add backend infrastructure prematurely.

---

# 16. TARGET DATA FLOW

For a lesson:

User
↓
Lesson Page
↓
Lesson Service
↓
Lesson Data
↓
Lesson Session
↓
Question
↓
User Answer
↓
Learning Logic
↓
Evaluation
↓
Feedback
↓
Progress Update

The UI should display the result of this process rather than implement the entire process itself.

---

# 17. ARCHITECTURAL RULE

Prefer:

Simple
↓
Clear
↓
Reusable
↓
Testable

over:

Complex
↓
Over-engineered
↓
Highly abstract

The architecture should grow with the application's actual needs.