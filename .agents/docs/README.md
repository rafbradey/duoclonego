# DUOCLONGO — AI AGENT GUIDE

Duoclongo is a Duolingo-inspired learning web application focused on teaching and practicing LASA (Look-Alike, Sound-Alike) drug identification.

This repository is actively under development.

AI agents working on this project must treat the existing codebase as the source of truth.

---

## BEFORE WORKING

Before modifying code:

1. Read this file.
2. Read `.agents/PROJECT.md`.
3. Read `.agents/ARCHITECTURE.md`.
4. Read `.agents/DEVELOPMENT.md`.
5. Inspect the relevant source files.
6. Understand the existing implementation before changing it.
7. Make the smallest reasonable change.
8. Test the change.
9. Report what was changed and what was tested.

Do not assume a feature exists because a route, component, service, or UI element exists.

---

## DOCUMENTATION

### PROJECT.md

Contains:

- Product vision
- Product goals
- LASA domain
- Learning experience
- Feature priorities
- Long-term product direction

### ARCHITECTURE.md

Contains:

- Technology stack
- Project structure
- Application architecture
- Data architecture
- Routing
- State management
- Target architecture

### DEVELOPMENT.md

Contains:

- Coding rules
- AI agent rules
- Testing expectations
- UI/mobile rules
- Git practices
- Security and quality rules

---

## CORE PRINCIPLE

Duoclongo is a learning platform first and a game second.

The primary goal is effective LASA drug learning.

Core functionality takes priority over:

- Gamification
- Cosmetics
- Animations
- Visual polish
- Secondary pages

---

## DEVELOPMENT PRIORITY

When deciding what to build first:

1. Correctness
2. Educational usefulness
3. User experience
4. Accessibility
5. Maintainability
6. Performance
7. Visual polish

Core learning functionality must take priority over secondary features.

---

## AGENT WORKFLOW

Use:

READ
↓
INSPECT
↓
UNDERSTAND
↓
PLAN
↓
IMPLEMENT
↓
TEST
↓
REVIEW
↓
REPORT

Never jump directly from a feature request to large-scale code changes.

---

## IMPORTANT

Do not rewrite the application unnecessarily.

Do not introduce libraries without a clear reason.

Do not create duplicate components, services, or data structures.

Do not modify unrelated parts of the application unless required.

Do not claim a feature works without testing it.

When requirements are unclear, inspect the existing project first and make reasonable assumptions rather than redesigning the entire system.