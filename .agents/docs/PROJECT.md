# DUOCLONGO — PROJECT & PRODUCT DEFINITION

## 1. PROJECT

Project name:

Duoclongo

Duoclongo is a Duolingo-inspired learning web application for practicing LASA (Look-Alike, Sound-Alike) drug identification.

The purpose of the application is not to reproduce Duolingo exactly.

Duolingo is the inspiration for the learning experience, progression system, and gamification.

Duoclongo's unique purpose is LASA drug education and practice.

---

# 2. PRODUCT VISION

Duoclongo should provide a short, interactive, game-like learning experience that helps users:

- recognize LASA drugs
- distinguish confusing drug names
- understand why drugs may be confused
- reinforce recognition through repetition
- practice through interactive questions
- receive immediate feedback
- track learning progress

The application should eventually provide a structured learning journey from beginner lessons to more advanced LASA practice.

---

# 3. CORE LEARNING LOOP

The most important part of Duoclongo is:

LASA Drug Knowledge
↓
Learning Content
↓
Lesson
↓
Question
↓
User Answer
↓
Answer Evaluation
↓
Feedback
↓
Next Question
↓
Lesson Completion
↓
XP / Progress / Rewards

This learning loop is more important than any individual gamification feature.

---

# 4. LASA DOMAIN

LASA means:

Look-Alike, Sound-Alike.

The application should focus on medications that may be confused because of similarities such as:

- similar spelling
- similar pronunciation
- similar appearance
- similar naming patterns
- similar packaging or labeling
- other documented sources of confusion

The system should eventually represent LASA information using structured data rather than scattered strings inside UI components.

Important concepts include:

Drug
LASA Pair
LASA Group
Drug Class
Generic Name
Brand Name
Indication
Dosage Form
Strength
Pronunciation
Confusion Reason
Learning Objective

These concepts should remain consistent throughout the application.

---

# 5. EDUCATIONAL CONTENT

Educational content should be separated from UI code.

For example:

Drug information should not be hardcoded inside a React component simply because the component displays it.

The eventual architecture should allow educational content to be changed without rewriting the UI.

Educational information should also be treated carefully.

Do not invent drug facts.

If authoritative medical content is eventually added, the project should define appropriate sources and content-review procedures.

Duoclongo is an educational application and should not present itself as a replacement for professional medical judgment.

---

# 6. LESSONS

A lesson should represent a structured learning session.

A future lesson may contain activities such as:

- introduction
- drug recognition
- LASA comparison
- multiple choice
- true/false
- identification
- matching
- scenario questions
- review questions

Lessons should be short enough to encourage repeated practice.

The lesson engine should eventually support different question types without requiring the entire system to be rewritten.

---

# 7. PROGRESSION

The learning progression should eventually follow a structure similar to:

Course
↓
Unit
↓
Lesson
↓
Activity
↓
Question

Users should gradually unlock content as they progress.

Progress should eventually include:

- completed lessons
- current lesson
- XP
- learning statistics
- mastery
- review opportunities

---

# 8. GAMIFICATION

Gamification is important, but secondary to learning.

Potential systems include:

- XP
- hearts
- streaks
- daily goals
- quests
- achievements
- leaderboards
- diamonds/rewards
- shop
- badges

These should be built around the learning engine.

Do not build gamification first while the core lesson system is incomplete.

---

# 9. PRODUCT PRIORITIES

Priority 1:

Core LASA learning experience.

Priority 2:

Lesson progression and persistent learning progress.

Priority 3:

User accounts and backend persistence.

Priority 4:

Gamification.

Priority 5:

Advanced polish and production features.

---

# 10. CURRENT PROJECT STATE

The current repository is an early prototype / visual shell.

The current application contains the beginnings of:

- React application structure
- routing
- navigation
- Learn page
- lesson cards
- user data
- unit data
- static JSON data
- mock service functions
- visual Duolingo-inspired components

However, the core learning engine is not yet implemented.

There is currently no complete:

- quiz runner
- answer evaluation system
- lesson session
- question progression
- lesson completion system
- XP calculation
- persistent user progress
- LASA data model
- LASA question system
- authentication system
- database system

Future work should build these systems deliberately.

---

# 11. PRODUCT PHILOSOPHY

Duoclongo should feel:

Friendly
Interactive
Educational
Simple
Approachable
Game-like
Responsive

But visual similarity to Duolingo should never override:

- educational clarity
- accessibility
- usability
- maintainability

---

# 12. LONG-TERM PRODUCT STRUCTURE

The intended long-term experience is approximately:

Home
↓
Learn
↓
Units
↓
Lessons
↓
Interactive Questions
↓
Feedback
↓
Lesson Completion
↓
XP / Progress
↓
More Lessons

Additional systems can later surround this experience:

Practice
Quests
Leaderboards
Shop
Profile
Achievements
Settings

These are supporting systems, not the foundation of the application.