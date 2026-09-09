# DUOCLONGO — MASTER PROJECT ROADMAP

> A Duolingo-inspired learning platform for LASA (Look-Alike, Sound-Alike) drug education and practice.

---

# 1. ROADMAP PURPOSE

This document defines the long-term development roadmap for Duoclongo.

The roadmap is intentionally divided into phases.

AI coding agents must NOT attempt to implement the entire roadmap from a single request.

Each phase should be completed, tested, reviewed, and stabilized before moving to the next major phase.

The roadmap describes:

* What should be built
* Why it should be built
* What depends on it
* What should not be built yet
* What "done" means for each phase

The `.agents/` documentation defines how agents should work.

This document defines what the project should become.

---

# 2. CURRENT PROJECT BASELINE

The current application is an early prototype / visual shell.

The current implementation contains the beginnings of:

* React application structure
* Vite build system
* React Router
* Navbar
* Sidebar
* Learn page
* Lesson cards
* Mascot
* Static user data
* Static unit data
* Mock services
* Basic Duolingo-inspired visual design

The current application does NOT yet contain the complete core learning system.

Major missing systems include:

* LASA drug data model
* LASA drug database
* Lesson engine
* Question engine
* Answer evaluation
* Lesson sessions
* Lesson completion
* XP calculation
* Persistent progress
* Authentication
* Backend
* Database
* Complete practice system
* Functional quests
* Functional leaderboards
* Functional shop
* Functional profile
* Complete mobile experience
* Automated testing

Therefore:

> The first objective is not to add more pages. The first objective is to turn the visual prototype into a functioning learning application.

---

# 3. PRODUCT NORTH STAR

The core Duoclongo experience should eventually be:

```text
Discover LASA concept
        ↓
Learn drug information
        ↓
Study LASA relationship
        ↓
Start lesson
        ↓
Answer questions
        ↓
Receive feedback
        ↓
Continue lesson
        ↓
Complete lesson
        ↓
Earn XP
        ↓
Update progress
        ↓
Unlock additional learning
        ↓
Review weak areas
```

Everything else should support this loop.

---

# 4. DEVELOPMENT PRINCIPLES

## 4.1 Learning First

The learning engine has higher priority than gamification.

Build:

```text
LASA Data
    ↓
Learning Content
    ↓
Question Engine
    ↓
Lesson Engine
    ↓
Progress
```

before building:

```text
Shop
Quests
Leaderboards
Cosmetics
Advanced rewards
```

---

## 4.2 Build Incrementally

Each phase should produce a working application.

Avoid creating a massive branch where nothing works until the end.

Prefer:

```text
Small feature
↓
Test
↓
Integrate
↓
Verify
↓
Continue
```

---

## 4.3 Mobile Is Not a Final Patch

Responsive behavior must be considered throughout development.

Do not intentionally build desktop-only components and postpone all mobile work until the final phase.

A final mobile phase is still included for dedicated mobile UX refinement, but mobile compatibility begins in Phase 0.

---

# 5. PHASE OVERVIEW

```text
PHASE 0
Foundation & Stabilization
        ↓
PHASE 1
LASA Data & Educational Content
        ↓
PHASE 2
Core Learning / Lesson Engine
        ↓
PHASE 3
Progression & Practice
        ↓
PHASE 4
Backend, Database & Authentication
        ↓
PHASE 5
Gamification
        ↓
PHASE 6
Mobile & UX Refinement
        ↓
PHASE 7
Testing, Performance & Production
        ↓
PHASE 8
Advanced Learning Features
```

---

# PHASE 0 — FOUNDATION & STABILIZATION

## Objective

Turn the existing visual prototype into a clean, maintainable foundation.

Do NOT build the complete learning engine yet.

---

## 0.1 Repository Cleanup

Review:

* unused dependencies
* unused files
* empty files
* dead components
* dead routes
* duplicate CSS
* unused assets
* incorrect imports
* console errors

Remove or fix only what is confirmed unnecessary.

Do not perform a large rewrite.

---

## 0.2 Fix Existing Bugs

Address known issues such as:

* incorrect Profile route
* ESLint failure
* incorrect React key placement
* dead `/others` navigation
* broken or empty pages
* invalid font import
* other confirmed runtime problems

Every fix must be tested.

---

## 0.3 Establish Application Layout

Create a consistent application shell.

Conceptually:

```text
App
└── AppLayout
    ├── Navbar
    ├── Sidebar / Mobile Navigation
    └── Main Content
```

Pages should not independently recreate shared application navigation.

---

## 0.4 Routing Cleanup

Establish clean routing for:

```text
/
 /learn
 /lesson/:lessonId
 /practice
 /quests
 /leaderboards
 /shop
 /profile
 /settings
```

Only implement routes that currently have a purpose.

Placeholder pages may remain placeholders.

---

## 0.5 Responsive Foundation

Fix obvious mobile problems.

Prioritize:

* Navbar
* Sidebar
* page width
* overflow
* cards
* buttons
* typography
* spacing

The application should remain usable on small screens.

---

## 0.6 Design System Foundation

Document and standardize:

* typography
* spacing
* border radius
* buttons
* cards
* icons
* common states
* page containers

Avoid introducing a UI library unless there is a demonstrated need.

---

## 0.7 Phase 0 Completion Criteria

Phase 0 is complete when:

* application builds successfully
* lint passes
* major existing bugs are fixed
* routing is coherent
* shared layout exists
* no obvious dead navigation remains
* desktop UI is stable
* mobile does not catastrophically break
* project structure is clean enough for feature development

---

# PHASE 1 — LASA DATA & EDUCATIONAL CONTENT

## Objective

Create the actual knowledge foundation of Duoclongo.

This phase establishes the data that the learning engine will consume.

---

# 1.1 Drug Data Model

Create a structured representation for a drug.

Potential fields:

```text
id
genericName
brandNames
drugClass
indications
dosageForms
strengths
pronunciation
tallManName
description
```

Only include fields supported by the project's actual educational requirements.

Do not unnecessarily create dozens of fields.

---

# 1.2 LASA Relationship Model

Create a structured representation for LASA relationships.

Potential structure:

```text
LASA Relationship
├── id
├── drugs
├── confusionType
├── reason
├── distinguishingFeatures
└── educationalNotes
```

Possible confusion types:

```text
LOOK_ALIKE
SOUND_ALIKE
LOOK_AND_SOUND_ALIKE
OTHER
```

Exact classifications must be supported by research.

---

# 1.3 LASA Groups

Support groups containing multiple related medications where appropriate.

Example conceptual structure:

```text
LASA Group
├── id
├── name
├── description
├── drugs[]
└── relationships[]
```

---

# 1.4 Tall Man Lettering

Support verified Tall Man lettering.

Example concept:

```text
standardName
tallManName
```

Do not manually invent capitalization.

Tall Man data must come from an appropriate verified source.

---

# 1.5 Source Tracking

Educational content should eventually record where information came from.

Potential metadata:

```text
source
sourceType
sourceUrl
verifiedDate
```

This improves traceability and future content review.

---

# 1.6 Initial LASA Dataset

Create a small verified dataset first.

Do NOT attempt to populate hundreds or thousands of drugs immediately.

Start with a manageable dataset that can support the first complete learning journey.

The initial dataset should be sufficient to test:

* lessons
* comparisons
* questions
* feedback
* review

---

# 1.7 Drug Information UI

Create a reusable way to display drug information.

Potential components:

```text
DrugCard
DrugComparison
DrugInfo
LASAComparison
TallManName
```

These should be reusable by:

* lessons
* practice
* review
* future guidebook

---

# 1.8 Guidebook

Eventually create a functional Guidebook / reference section.

Users should be able to review previously learned information.

The Guidebook should not replace active learning.

It should complement it.

---

## 1.9 Phase 1 Completion Criteria

Phase 1 is complete when:

* structured drug data exists
* LASA relationships are represented
* Tall Man lettering can be represented
* educational sources can be tracked
* initial verified LASA content exists
* UI can display drug information
* static content is separated from UI
* the application no longer relies on generic placeholder lesson data

---

### Data Architecture Cleanup — Level / Unit / Lesson Structure

Before continuing with later learning-engine phases, refactor the legacy
lesson data into an editable Section → Unit → Lesson structure.

**Status: COMPLETED (Prerequisite for Phase 2)**

Goals:
- Separate level/unit organization from question data
- Make Section and Unit data independently editable (`src/data/levels/section-{N}/unit-{M}.json`)
- Prevent one large `lessons.json` from becoming a bottleneck
- Keep LASA relationships (`src/data/lasaData.json`) separate from generated questions (reference `lasaId`)
- Prepare the data structure for multiple activities and question types
- Keep the structure compatible with future backend migration

---

# PHASE 2 — CORE LEARNING / LESSON ENGINE

## Objective

This is the most important development phase.

Turn Duoclongo from a visual application into an actual learning application.

---

# 2.1 Lesson Model

Create a lesson structure.

Conceptually:

```text
Lesson
├── id
├── title
├── description
├── objectives[]
├── activities[]
└── metadata
```

---

# 2.2 Lesson Activity

A lesson should contain activities.

Conceptually:

```text
Lesson
↓
Activity
↓
Question
```

Activities may eventually include:

* teaching
* recognition
* comparison
* practice
* review

---

# 2.3 Lesson Session

A lesson session represents a user's active attempt.

Track things such as:

```text
lessonId
currentQuestion
answers
correctAnswers
incorrectAnswers
startedAt
completedAt
score
xp
```

Exact structure can evolve during implementation.

---

# 2.4 Question Model

Create a reusable question model.

Potential fields:

```text
id
type
prompt
choices
correctAnswer
explanation
relatedDrugs
metadata
```

Do not tightly couple questions to React components.

---

# 2.5 Question Types

Implement question types incrementally.

### First

Multiple choice.

### Then

True / false.

### Then

Drug identification.

### Then

LASA pair identification.

### Later

Matching.

### Later

Scenario-based questions.

Do not implement every question type in one task.

---

# 2.6 Answer Evaluation

Create reusable evaluation logic.

Example:

```text
User Answer
↓
evaluateAnswer()
↓
Correct / Incorrect
↓
Feedback
```

Evaluation logic should be independent from the visual component.

---

# 2.7 Question Progression

Implement:

```text
Question 1
↓
Question 2
↓
Question 3
↓
...
↓
Final Question
↓
Lesson Complete
```

Handle:

* next question
* previous question if supported
* unanswered state
* completed state
* invalid state

---

# 2.8 Feedback

Correct answers should provide confirmation.

Incorrect answers should provide useful educational feedback.

Feedback can explain:

* correct answer
* relevant distinction
* LASA relationship
* Tall Man lettering
* important distinguishing information

Avoid feedback that only says:

"Wrong."

---

# 2.9 Lesson Progress UI

Display:

* current question
* total questions
* progress bar
* question state
* answer state

The interface should work on desktop and mobile.

---

# 2.10 Lesson Completion

At completion:

Display:

* result
* correct answers
* incorrect answers
* XP earned
* lesson summary
* option to continue
* option to review

---

# 2.11 First Complete Learning Journey

Before adding advanced question types, create ONE complete working lesson.

Example conceptual journey:

```text
Learn Dopamine
↓
Learn Dobutamine
↓
Compare them
↓
Question
↓
Answer
↓
Feedback
↓
Question
↓
Answer
↓
Review
↓
Lesson Complete
```

The exact drugs and content must come from verified educational data.

---

# 2.12 Phase 2 Completion Criteria

Phase 2 is complete when a user can:

1. Open a lesson.
2. Start a lesson session.
3. See educational content.
4. Answer questions.
5. Receive correct/incorrect feedback.
6. Continue through the lesson.
7. Finish the lesson.
8. See a result.
9. Receive calculated XP.
10. Return to the Learn screen.

At this point Duoclongo becomes a functional learning application.

---

# PHASE 3 — PROGRESSION & PRACTICE

## Objective

Connect individual lessons into a meaningful learning journey.

---

# 3.1 Units

Expand the existing unit structure.

Conceptually:

```text
Course
├── Unit 1
│   ├── Lesson 1
│   ├── Lesson 2
│   └── Lesson 3
│
├── Unit 2
│   ├── Lesson 1
│   └── Lesson 2
```

---

# 3.2 Unlocking

Implement lesson progression.

Example:

```text
Lesson 1
↓
Complete
↓
Lesson 2 unlocked
```

Avoid unnecessarily complicated progression initially.

---

# 3.3 XP

Create a consistent XP system.

Potential factors:

* lesson completion
* correct answers
* bonus conditions
* review

Do not allow UI components to independently calculate XP.

Use centralized learning/gamification logic.

---

# 3.4 Hearts

If hearts are retained as a Duolingo-inspired mechanic:

* define when hearts are lost
* define what happens at zero hearts
* define recovery
* make the system understandable

Do not make hearts unnecessarily punitive for an educational application.

---

# 3.5 Progress Tracking

Track:

* completed lessons
* current unit
* XP
* questions answered
* accuracy
* weak LASA areas
* review opportunities

---

# 3.6 Practice

Build a functional Practice area.

Potential modes:

```text
Practice
├── Review mistakes
├── Review previous lessons
├── Practice LASA pairs
└── Random practice
```

Start with one simple practice mode.

---

# 3.7 Mastery

Eventually track mastery at different levels:

```text
Course
Unit
Lesson
Drug
LASA Pair
```

Do not create an overly complex mastery algorithm initially.

Start with simple measurable indicators.

---

# 3.8 Phase 3 Completion Criteria

Phase 3 is complete when:

* lessons form a progression
* completion unlocks content
* XP is tracked
* progress is tracked
* practice is functional
* users can review previously learned content
* learning data survives the relevant session/storage mechanism

---

# PHASE 4 — BACKEND, DATABASE & AUTHENTICATION

## Objective

Move from local prototype data toward persistent user accounts and application data.

---

# 4.1 Backend Technology Decision

Evaluate the project's needs before selecting the backend.

The existing repository contains an empty Supabase-related file, but this does NOT mean Supabase must automatically be used.

Evaluate:

* authentication
* database
* security
* scalability
* developer experience
* cost
* deployment
* project complexity

Choose intentionally.

---

# 4.2 Database

Potential entities:

```text
users
drugs
lasa_groups
lasa_relationships
units
lessons
activities
questions
user_progress
lesson_attempts
question_attempts
achievements
quests
```

The exact schema must be designed based on actual application requirements.

---

# 4.3 Authentication

Implement:

* sign up
* sign in
* sign out
* session handling
* protected routes
* account recovery if required

Do not build a complex authentication experience unnecessarily.

---

# 4.4 User Profile

Users should eventually have:

* username
* display name
* avatar
* XP
* level
* streak
* progress
* achievements

---

# 4.5 Persistent Progress

Move from local/mock progress to persistent storage.

Persist:

* lesson completion
* XP
* hearts where appropriate
* streak
* question history
* achievements
* practice history

---

# 4.6 Content Management Considerations

The project should eventually distinguish:

```text
Educational Content
vs.
User Data
```

Educational content should not be treated like arbitrary user-generated data.

---

# 4.7 Security

Implement:

* database access rules
* authorization
* secure environment variables
* server-side validation where appropriate
* protection against unauthorized progress manipulation

Never trust the client for sensitive game/progress calculations when server validation is required.

---

# 4.8 Phase 4 Completion Criteria

Phase 4 is complete when:

* users can authenticate
* users have persistent accounts
* learning progress persists
* educational data is stored appropriately
* protected routes work
* security rules are implemented
* local prototype data is no longer the primary user-data mechanism

---

# PHASE 5 — GAMIFICATION

## Objective

Add the systems that make Duoclongo engaging after the core learning system is stable.

---

# 5.1 Streak

Implement:

* daily activity
* streak count
* streak continuation
* streak reset rules
* streak UI

Avoid manipulative behavior.

---

# 5.2 Daily Goal

Allow users to have a daily learning target.

Potential measurement:

* XP
* completed lessons
* completed activities

Choose one primary metric initially.

---

# 5.3 Quests

Create quests around learning activity.

Examples:

* Complete 2 lessons.
* Earn 50 XP.
* Review 5 questions.
* Practice 3 LASA pairs.

Quests should encourage actual learning.

---

# 5.4 Achievements

Potential achievement categories:

* lessons completed
* LASA pairs mastered
* streak milestones
* practice milestones
* accuracy milestones

---

# 5.5 Leaderboards

Create leaderboard logic only after persistent user data exists.

Potential rankings:

* weekly XP
* monthly XP
* learning activity

Do not encourage unsafe competition around medical knowledge.

---

# 5.6 Diamonds / Rewards

Implement the project's reward currency if retained.

Define:

* earning
* spending
* balance
* transaction history if required

---

# 5.7 Shop

The Shop should eventually allow users to spend earned currency on appropriate digital rewards.

Potential rewards:

* avatars
* cosmetics
* themes
* lesson boosts
* profile decorations

The Shop should not interfere with core learning.

---

# 5.8 Profile

Build the Profile page around actual user data.

Include:

* progress
* level
* XP
* streak
* achievements
* statistics
* customization

---

# 5.9 Phase 5 Completion Criteria

Phase 5 is complete when:

* gamification systems are connected to real learning activity
* XP has a single consistent source of truth
* streaks function correctly
* quests function
* achievements function
* profile displays real data
* reward currency is persistent
* shop purchases work if implemented
* leaderboard data is accurate

---

# PHASE 6 — MOBILE & UX REFINEMENT

## Objective

Make Duoclongo feel like a polished mobile-first learning application while maintaining a strong desktop experience.

---

# 6.1 Mobile Navigation

Evaluate:

* bottom navigation
* collapsible sidebar
* mobile menu
* navigation hierarchy

Use the solution that best fits the application.

---

# 6.2 Mobile Lesson Experience

Optimize:

* question cards
* answer buttons
* feedback
* progress
* navigation
* typography
* touch targets

The lesson experience should feel natural on a phone.

---

# 6.3 Responsive Learn Page

Redesign the Learn page where necessary.

Avoid rigid desktop layouts.

Content should adapt naturally to:

* phone
* tablet
* desktop

---

# 6.4 Touch Interaction

Ensure interactive controls are comfortable to tap.

Avoid:

* tiny buttons
* tightly packed controls
* accidental overlapping elements
* hover-only interactions

---

# 6.5 Accessibility

Improve:

* keyboard navigation
* screen-reader semantics
* focus states
* contrast
* text sizing
* reduced-motion support

---

# 6.6 Animation

Introduce animation where it improves feedback.

Potential areas:

* correct answer
* incorrect answer
* progress
* lesson completion
* XP reward
* unlocking

Do not animate everything.

Animation should communicate state.

---

# 6.7 Phase 6 Completion Criteria

Phase 6 is complete when:

* core flows work comfortably on mobile
* navigation is mobile-friendly
* lesson interactions are touch-friendly
* no important UI overlaps
* responsive layouts work across common screen sizes
* accessibility issues have been addressed
* animations support usability rather than distract from learning

---

# PHASE 7 — TESTING, PERFORMANCE & PRODUCTION

## Objective

Prepare Duoclongo for reliable public use.

---

# 7.1 Automated Testing

Introduce appropriate testing tools.

Test:

### Unit

* answer evaluation
* XP calculation
* unlocking
* mastery
* streak calculation

### Components

* question rendering
* answer selection
* feedback
* lesson completion

### Integration

* lesson flow
* progress saving
* unlocking

### End-to-End

Critical user journeys.

---

# 7.2 Build Validation

Production builds must be reliable.

Check:

* build
* lint
* tests
* environment configuration
* routing
* API connections

---

# 7.3 Performance

Review:

* bundle size
* image sizes
* lazy loading
* unnecessary requests
* rendering performance
* database queries
* mobile performance

Optimize actual bottlenecks.

---

# 7.4 Asset Optimization

Review oversized assets.

Convert or optimize images where appropriate.

Avoid shipping unnecessarily large assets to mobile users.

---

# 7.5 Error Handling

Implement robust handling for:

* API failures
* database failures
* authentication failures
* missing content
* invalid routes
* network issues

Provide useful user-facing messages.

---

# 7.6 Loading States

Every major asynchronous experience should have an appropriate loading state.

Examples:

* Learn page
* lesson loading
* user profile
* progress
* leaderboard
* shop

---

# 7.7 Production Deployment

Establish:

* production environment
* environment variables
* CI/CD
* preview deployments
* production deployment
* rollback strategy

---

# 7.8 Monitoring

Consider:

* error monitoring
* performance monitoring
* uptime monitoring
* analytics

Do not collect unnecessary user information.

---

# 7.9 Phase 7 Completion Criteria

Phase 7 is complete when:

* critical flows have automated coverage
* production build is stable
* performance issues have been addressed
* errors are handled
* deployment is repeatable
* environment variables are secure
* production monitoring exists where appropriate

---

# PHASE 8 — ADVANCED LEARNING FEATURES

## Objective

Improve the educational effectiveness of Duoclongo after the core platform is stable.

This phase should only begin after the fundamental application works reliably.

---

# 8.1 Spaced Repetition

Research and implement an appropriate spaced-repetition strategy.

Possible inputs:

* correctness
* confidence
* time since review
* previous attempts
* difficulty

Do not implement a complicated algorithm without understanding its educational purpose.

---

# 8.2 Adaptive Learning

Adjust practice based on performance.

Potential behavior:

```text
Strong performance
↓
Increase difficulty

Weak performance
↓
Provide additional review
```

---

# 8.3 Weak-Area Detection

Identify frequently missed:

* drugs
* LASA pairs
* question types
* concepts

Use this to generate targeted practice.

---

# 8.4 Personalized Review

Create a review queue.

Potential priorities:

1. Frequently missed questions
2. Recently incorrect questions
3. Due-for-review content
4. Previously mastered content
5. Random reinforcement

---

# 8.5 Advanced Question Types

Potential future types:

* image-based recognition
* audio pronunciation
* matching
* drag and drop
* scenario questions
* timed recognition
* mixed review

Only implement question types that provide educational value.

---

# 8.6 Learning Analytics

Potential metrics:

* accuracy
* completion
* retention
* difficult LASA pairs
* review frequency
* question performance

Analytics should support learning improvements rather than simply generate statistics.

---

# 8.7 Phase 8 Completion Criteria

Phase 8 is complete when Duoclongo provides meaningful personalized learning rather than only a fixed sequence of lessons.

---

# 6. FEATURE PRIORITY MATRIX

## Must Have

These define the core application:

* LASA data
* Drug model
* LASA relationships
* Lessons
* Questions
* Answer evaluation
* Feedback
* Lesson completion
* Progress
* XP
* Practice
* Persistent user data

---

## Should Have

These improve the learning experience:

* Tall Man lettering
* Guidebook
* Review system
* Streak
* Daily goal
* Achievements
* Quests
* Profile
* Mobile optimization

---

## Could Have

These can come later:

* Leaderboards
* Shop
* Cosmetics
* Advanced animations
* Advanced question types
* Personalized learning
* Spaced repetition
* Advanced analytics

---

## Avoid Until Needed

Do not prematurely build:

* complex microservices
* unnecessary state-management infrastructure
* complicated backend abstractions
* excessive animation systems
* large-scale content management systems
* unnecessary third-party dependencies

---

# 7. CORE MILESTONES

The project should have clear milestones.

---

## MILESTONE 1 — FUNCTIONAL PROTOTYPE

The user can:

* open Learn
* select a lesson
* start a lesson
* answer questions
* receive feedback
* finish a lesson
* earn XP

---

## MILESTONE 2 — LEARNING MVP

The user can:

* progress through multiple lessons
* unlock content
* review content
* practice previous material
* track progress

---

## MILESTONE 3 — PERSISTENT MVP

The user can:

* create an account
* log in
* retain progress
* access learning history
* continue learning across devices

---

## MILESTONE 4 — GAMIFIED MVP

The user can:

* maintain a streak
* complete daily goals
* complete quests
* earn achievements
* use rewards
* view profile progress

---

## MILESTONE 5 — POLISHED PRODUCT

The application:

* works well on mobile
* works well on desktop
* has strong accessibility
* has automated tests
* handles errors
* performs well
* has reliable deployment

---

## MILESTONE 6 — ADAPTIVE LEARNING

The system:

* identifies weak areas
* recommends review
* uses spaced repetition
* adapts question difficulty
* provides personalized learning

---

# 8. DEVELOPMENT ORDER

The preferred implementation order is:

```text
1. Clean foundation
        ↓
2. LASA data
        ↓
3. Drug information UI
        ↓
4. Lesson model
        ↓
5. Question model
        ↓
6. Answer evaluation
        ↓
7. Lesson session
        ↓
8. Feedback
        ↓
9. Lesson completion
        ↓
10. XP
        ↓
11. Progress
        ↓
12. Practice
        ↓
13. Backend
        ↓
14. Authentication
        ↓
15. Persistent progress
        ↓
16. Streaks / goals
        ↓
17. Quests / achievements
        ↓
18. Profile
        ↓
19. Leaderboards / rewards
        ↓
20. Mobile refinement
        ↓
21. Testing
        ↓
22. Production
        ↓
23. Adaptive learning
```

---

# 9. WHAT NOT TO DO

Do not attempt to build all of Duoclongo simultaneously.

Avoid:

```text
"Build everything."
```

Instead use:

```text
Phase
↓
Feature
↓
Small implementation
↓
Test
↓
Review
↓
Next feature
```

Do not let the existence of a UI page imply that its backend or functionality should immediately be implemented.

---

# 10. DEFINITION OF DONE

A feature is considered complete only when:

* implementation exists
* relevant UI exists
* relevant logic works
* data flow works
* loading states exist where necessary
* error states exist where necessary
* mobile behavior has been considered
* lint passes
* build passes
* relevant tests/manual testing pass
* no unrelated functionality was broken

---

# 11. ROADMAP MAINTENANCE

This roadmap is a living document.

Update it when:

* architecture changes
* requirements change
* a phase is completed
* a feature is removed
* a feature is reprioritized
* research changes the educational approach

Do not silently change major product priorities.

When the roadmap changes substantially, document why.

---

# 12. FINAL PRODUCT VISION

The ultimate goal is not to create a clone of another application.

The goal is to create:

> A polished, accessible, engaging learning platform that uses game-like progression and interaction to help users learn and practice LASA medication identification.

The application should make learning feel approachable without sacrificing educational quality.

The long-term experience should combine:

```text
Verified LASA Knowledge
        +
Effective Learning Science
        +
Interactive Lessons
        +
Clear Feedback
        +
Progressive Difficulty
        +
Persistent Progress
        +
Thoughtful Gamification
        +
Responsive UX
        +
Reliable Engineering
```

That combination defines the long-term direction of Duoclongo.
