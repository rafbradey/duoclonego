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
Levels (1..X, where X is pedagogical and dynamic)
↓
Activity
↓
Question

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
├── index.js                     <-- Aggregates sections, units, and levels
└── section-{N}/
    ├── unit-1.json
    ├── unit-2.json
    └── ...
```

Each unit independently defines its metadata and a configurable array of `levels[]` ($X \ge 1$), where each level defines:
- `levelNumber` & `title`
- `learningObjective`
- `xpReward` & `unlocked` status
- `activities[]` containing questions (decoupled from direct LASA data via `lasaId`).

The application derives available levels dynamically from `unit.levels.length`. Never assume a fixed number of levels per unit.

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

# 11. LESSON & LEVEL ENGINE ARCHITECTURE

The learning engine follows a multi-level progression:

Unit
↓
Level (1..X)
↓
Lesson Session
↓
Activity
↓
Question
↓
Answer
↓
Evaluation
↓
Feedback
↓
Next Question / Level Completion

The lesson engine should not depend on specific UI components.

For example, answer evaluation should not require a React component.

This allows the learning logic to be tested independently.

---

# 12. QUESTION ARCHITECTURE

Questions support multiple types:
- multiple choice
- true/false
- drug identification
- LASA pair identification
- matching
- scenario-based
- review

Question data defines what the question needs.

The UI renders the question based on its type using the `<QuestionRenderer />` dispatcher component (`src/components/QuestionCard/QuestionRenderer.jsx`), ensuring `LessonSession.jsx` remains decoupled from concrete question card implementations.

Avoid creating a completely separate lesson implementation for every question type.

---

# 13. ROUTING

Current routes must be verified from the repository.

The intended application structure is approximately:

/
├── /learn
├── /lesson/:lessonId
├── /practice
├── /quests
├── /leaderboards
├── /shop
├── /profile
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