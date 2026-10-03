# LASA-QUEST (DUOCLONGO) — APPLICATION ARCHITECTURE

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
- `lessonEngine`: Evaluates answers, samples diverse questions, shuffles options, and calculates XP rewards (`evaluateAnswer()`, `prepareSessionLesson()`, `createSession()`, `recordSessionAnswer()`).
- `audioService`: Synthesizes instant Web Audio API chimes and buzzers (`playCorrectSound()`, `playIncorrectSound()`) with zero asset lag.
- `questionGenerator`: Generates domain questions (Type A Tall Man, Type B Pair Recognition, Type C Matching, Type D Capstone) grounded in `src/data/lasaPairs.json`.

Services provide a stable interface to the rest of the application.

The implementation behind a service will evolve later:
`Static JSON` $\longrightarrow$ `API` $\longrightarrow$ `Supabase / PostgreSQL`

The UI should not need to be rewritten when the data source changes.

---

# 8.1 LASA MEDICATION AUDIO & AZURE SPEECH PIPELINE SPECIFICATION

This section defines the official architecture, security boundaries, and operational workflows for Duoclongo's medication pronunciation audio pipeline.

### Core Educational Purpose
LASA-Quest utilizes medication pronunciation audio to support **LASA medication-name recognition** and **sound-alike acoustic discrimination activities**.
This audio serves pure educational name-recognition and error-vigilance training. It is **NOT** prescribing, dispensing, or clinical administration training.

### Architecture Overview: Current vs. Target

```
CURRENT (PROTOTYPE):
Medication Name Display String ───► Browser Web Speech API (window.speechSynthesis)

TARGET (PRODUCTION SPECIFICATION):
CANONICAL LASA DATA (src/data/lasaPairs.json)
        │
        ▼
AUDIO GENERATION SCRIPT (scripts/generateLasaAudio.js)
        │  [Build-Time / Development Only]
        ▼
AZURE AI SPEECH SERVICE (REST / SDK)
        │
        ▼
GENERATED AUDIO ASSETS (public/audio/lasa/<medicationId>.mp3)
        │
        ▼
DETERMINISTIC AUDIO MAPPING (src/data/audioMapping.json)
        │
        ▼
EXISTING SPEAKER BUTTON & AUDIO SERVICE (playMedicationAudio(medicationId))
        │
        ▼
BROWSER AUDIO PLAYBACK (HTML5 Audio / Web Audio API)
```

The production React/Vite application **MUST NOT** call Azure AI Speech directly. Azure is strictly a development and build-time offline asset generator. The deployed application serves and plays pre-generated static audio files.

---

### Authoritative Canonical Data Source
The pronunciation generator must consume verified, canonical LASA records from:
- **`src/data/lasaPairs.json`**: Authoritative repository containing 50 ISMP 2023 / FDA Table 1 medication pairs, exact generic names, canonical Tall Man capitalization, and verified sound-alike designations (`verifiedSoundAlike: true | false`).

The audio pipeline must **NEVER**:
- Invent medication names or pairs.
- Invent or fabricate phonetic pronunciation rules.
- Modify canonical medication names or alter Tall Man lettering casing.
- Generate artificial audio entries for unverified or nonexistent drugs.

---

### Stable Medication-ID Audio Association
Audio assets are keyed to **stable canonical medication identifiers** rather than volatile display strings:

```
medicationId (e.g. "lasa_001_drugA" or normalized canonical slug)
        ↓
src/data/audioMapping.json
        ↓
/audio/lasa/<stable-filename>.mp3
```

- **Frontend Interface**:
  ```javascript
  // Target frontend call:
  playMedicationAudio(medicationId);
  ```
- The frontend resolves the static asset URL directly through the mapping without string parsing, guessing filenames from display text, or duplicating medication metadata.

---

### Azure Credential Security
Azure AI Speech credentials must exist **strictly in the developer's local or build environment**:
- **Environment Variables**: `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` configured in a local `.env.local` file (already excluded by `.gitignore`).
- **Strict Prohibition**:
  - Credentials must **NEVER** be committed to Git.
  - Credentials must **NEVER** appear in React components, frontend source code, or the `public/` directory.
  - Credentials must **NEVER** use `VITE_*` prefixes (which Vite injects into client bundles).
  - Credentials must **NEVER** be embedded into generated audio file metadata.
  - Actual API keys must **NEVER** be placed in `agents/` documentation or research papers.

---

### Build-Time Only Guarantee
Azure AI Speech is used exclusively to generate pronunciation audio assets ahead of time.
Because the deployed web client only interacts with static `.mp3` files in `public/audio/lasa/`:
- Production deployments operate normally even if Azure is offline, credentials expire, or subscription limits are reached.
- Deployments to static hosts (such as Vercel) have zero external API latency or runtime secrets.

---

### Preservation of Existing Speaker UI
The migration from browser speech synthesis to static audio must **preserve the existing UI**:
- The medication speaker button component (`SoundAlikeQuestion.jsx`, `LasaPairCard.jsx`, or standalone speaker triggers), button styling, 3D pushable bevels, placement, ARIA accessibility attributes, and loading states remain intact.
- Migration replaces only the audio transport:
  - *Current*: `speakDrugName(name)`
  - *Target*: `playMedicationAudio(medicationId)`

---

### Medication Pronunciation Audio vs. Game Sound Effects
LASA-Quest operates two completely isolated audio systems:
1. **Medication Pronunciation Audio**:
   - High-fidelity, speech-synthesized MP3 audio files (`public/audio/lasa/*.mp3`).
   - Used specifically for learning, pronunciation review, and sound-alike discrimination questions.
2. **Game Sound Effects**:
   - Synthesized in real-time via the browser's Web Audio API oscillators in `src/services/audioService.js` (`playCorrectSound()`, `playIncorrectSound()`).
   - Zero asset dependencies, instant millisecond response for learner feedback.
   - **Must NOT be modified or replaced by the Azure audio pipeline.**

---

### Audio Generation Script Specification
The build utility lives in `scripts/generateLasaAudio.js` and is executed via npm:
```bash
npm run generate:lasa-audio
```

**Operational Workflow**:
1. Load canonical data from `src/data/lasaPairs.json`.
2. Extract every unique canonical medication requiring pronunciation across all pairs.
3. Verify existing files in `public/audio/lasa/`.
4. Skip previously generated audio files by default.
5. Support targeted and forced regeneration flags:
   - `--force`: Overwrite and regenerate all assets.
   - `--id=<medicationId>`: Regenerate a single specific medication.
   - `--pair=<lasaId>`: Regenerate both medications in a specific pair.
6. Synthesize audio via Azure Speech SDK / REST endpoint using standard clinical pronunciation parameters.
7. Save standard web-compatible MP3 audio to `public/audio/lasa/<id>.mp3`.
8. Write/update deterministic mapping in `src/data/audioMapping.json`.
9. Print a structured terminal report:
   ```text
   === LASA-QUEST LASA AUDIO GENERATION ===
   ✓ lasa_001_drugA (buPROPion) -> /audio/lasa/lasa_001_a.mp3 [generated]
   - lasa_001_drugB (busPIRone) -> /audio/lasa/lasa_001_b.mp3 [skipped - exists]
   -------------------------------------------------
   Total: 100 | Generated: 1 | Skipped: 99 | Failed: 0
   ```

---

### Audio Validation Script Specification
A companion validation script `scripts/validateLasaAudio.js` is executed via:
```bash
npm run validate:lasa-audio
```
**Validation Checks**:
1. **Missing Audio Assets**: Every canonical medication in `lasaPairs.json` has an existing `.mp3` file on disk.
2. **Mapping Integrity**: `audioMapping.json` maps every valid medication ID to a valid relative path.
3. **Invalid References**: No mapping references a nonexistent medication ID.
4. **Orphaned Assets**: No unexpected extraneous audio files exist in `public/audio/lasa/` without a canonical pairing.

---

### Pronunciation Quality & Review Protocol
Successful generation of an audio file does not guarantee pharmacological accuracy. Pharmaceutical trade and generic names frequently contain non-standard phonetic stress patterns.

**Review Process**:
1. **Identification**: Identify questionable pronunciation during QA, clinical review, or user feedback.
2. **Analysis**: Isolate the phonetic syllable defect (e.g., incorrect stress, elided consonants).
3. **Source Verification**: Check authoritative pronunciation guidance (USAN phonetics, FDA package insert, ISMP).
4. **Correction via SSML**: Adjust pronunciation using Azure SSML (`<phoneme>` alphabet="ipa" or `<sub alias="...">`) in `generateLasaAudio.js`.
5. **Targeted Regeneration**: Run `npm run generate:lasa-audio --id=<medicationId> --force`.
6. **Escalation**: If authentic phonetics cannot be confirmed, flag the term for expert clinician verification. Never invent unverified phonetic respellings.

---

### Audio Asset Format & Specifications
- **Format**: MP3 (`audio/mpeg`).
- **Encoding Profile**: 128 kbps, 24 kHz or 44.1 kHz mono/stereo standard MP3.
- **Compatibility**: Universally supported across all target desktop and mobile browsers (Safari iOS, Chrome Android, Firefox, Edge).
- **Asset Location**: `public/audio/lasa/`.

---

### Missing Audio & Graceful Degradation
If an audio file is missing or playback fails at runtime:
- The application **must not crash** or throw uncaught exceptions.
- The UI displays an accessible fallback badge (`"Pronunciation audio unavailable"`).
- The question remains fully interactive and answerable.
- The system **does NOT silently fall back** to browser SpeechSynthesis without explicit future approval.

---

### Git and Deployment Strategy
- **Decision**: Generated audio files in `public/audio/lasa/` and the mapping file `src/data/audioMapping.json` are **committed to Git as static project assets**.
- **Rationale**:
  - Total asset size for 50 LASA pairs (100 unique medication files) at ~15–30 KB per clip is $\approx 1.5\text{–}3.0\text{ MB}$ total, well within Git and Vercel limits.
  - Guarantees deterministic, instant deployments to Vercel and zero Azure credentials needed in production CI/CD pipelines.

---

### Verification & Testing Checklist
The eventual implementation must be tested against these 11 contracts:
1. Every applicable canonical medication in `lasaPairs.json` has an entry in `audioMapping.json`.
2. Every mapped `.mp3` file exists in `public/audio/lasa/`.
3. Audio mappings point strictly to valid local static assets.
4. No mapping references an invalid or fabricated medication ID.
5. No orphaned audio files exist in `public/audio/lasa/`.
6. The existing speaker button plays the generated audio smoothly.
7. Production pronunciation does not invoke `window.speechSynthesis`.
8. Zero Azure credentials or environment secrets appear in frontend bundles or `public/`.
9. Game sound effects (chime/buzz) continue functioning without regression.
10. Existing curriculum question types, levels, and mastery nodes remain unchanged.
11. Missing audio fails gracefully with zero console crashes or blocked lessons.

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
│   ├── unit-1.json              <-- Unit 1: Core Stems & Prefixes (6 levels, 5 pairs)
│   ├── unit-2.json              <-- Unit 2: Formulations & Suffixes (6 levels, 5 pairs)
│   └── unit-3.json              <-- Unit 3: Brand & Conjugate Differentiation (6 levels, 5 pairs)
└── section-2/
    └── unit-1.json              <-- Unit 4: Critical Care & High-Alert Opioids (6 levels, 5 pairs)
```

Each unit independently defines its metadata and a standardized array of 6 `levels[]`, guaranteeing 100% coverage across all 5 assigned LASA pairs:
- `levelNumber` & `title`
- `learningObjective`
- `xpReward` & `unlocked` status
- `lessons[]` or `activities[]` (normalized by `src/data/levels/index.js` into the explicit structure `Section → Unit → Level → Lesson → Activity → Question`).

### Standardized 6-Level Unit Structure (100% LASA Coverage Guarantee)
Every Unit in the application implements a standardized 6-level pedagogical sequence:

```text
UNIT (5 Target Medication Pairs • 100% Coverage Guaranteed)
├── Level 1: Identification & Familiarization (type: "level")
│   └── Discrete choice pairing introducing all 5 target LASA pairs.
├── Level 2: Tall Man Guided Construction (type: "level")
│   └── Scaffolded affix frames with live orthographic reconstruction for all 5 pairs.
├── Level 3: Clinical Risk & Indication Distinction (type: "level")
│   └── Differentiating indication mismatches and critical safety confusions.
├── Level 4: Simulated Oral Order / Verify Read-Back (type: "level")
│   └── Sound-Alike acoustic discrimination challenge with pre-answer listening gate.
├── Level 5: Rapid Review Challenge (type: "level")
│   └── Mixed recognition speed challenge synthesizing all 5 pairs under heart constraints.
└── Level 6: Unit Mastery Capstone (type: "unit_mastery")
    └── 5 pure, unassisted Tall Man construction challenges with strict case-sensitive evaluation.
```

- **Normal Levels (`type: "level"`):** Progressive instructional steps through guided learning activities.
- **Unit Mastery Capstone (`type: "unit_mastery"`):** Culminating 6th level synthesizing all 5 pairs across the Unit with unassisted Tall Man input.
- **Progression Rule:** Level 1 unlocks if the unit is active (or previous unit's mastery is completed); Levels 2 through 5 unlock sequentially; Unit Mastery unlocks only when Level 5 is completed. Completing Level 6 unlocks the subsequent Unit.
- **Visual Distinction:** Levels 1–5 appear as circular nodes along the curriculum path; Level 6 Unit Mastery renders as a prominent, golden/amber card with a trophy badge (🏆).
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

---

# 18. AUDIO & MEDICATION PRONUNCIATION ARCHITECTURE

The application implements a strict two-tier audio architecture separating responsive gamification feedback from clinical medication pronunciation:

```
+-----------------------------------------------------------------------------------+
|                           LASA-QUEST AUDIO SUBSYSTEM                               |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [1. Gamification Sound Effects]          [2. Clinical Medication Pronunciation]  |
|  - Engine: Web Audio API (Synthesizer)    - Engine: Static HTML5 Audio Assets     |
|  - Correct: Ascending C5-E5 sine chime     - Source: Azure AI Speech (Raw Mode)    |
|  - Incorrect: Dissonant descending buzz   - Location: public/audio/lasa/*.mp3     |
|  - Runtime: Instant synthesized client-   - Runtime: Local asset playback via     |
|    side, zero asset network latency         standard HTML5 <audio>, 100% offline  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### 18.1 Build-Time Audio Generation Pipeline

Medication pronunciation audio files are generated at development/build-time and committed/archived as static assets. The runtime client never contacts Azure Cognitive Services and never receives Azure credentials:

```
Verified LASA Medication Dataset (50 Pairs / 100 Medications)
    ↓
Development CLI Pipeline: scripts/generateLasaAudio.js
    ↓
Azure AI Speech (Voice: en-US-JennyNeural, Input: Raw Clinical Generic Name)
    ↓
Pre-generated Static MP3 Assets (public/audio/lasa/lasa001_bupropion.mp3 ... lasa050_dexmedetomidine.mp3)
    ↓
Audit Manifest (src/data/audioManifest.json) & Lookup Dictionary (src/data/audioMapping.json)
    ↓
Runtime Audio Service (src/services/audioService.js -> playMedicationAudio)
    ↓
Existing UI Components (SoundAlikeQuestion, MultipleChoiceQuestion, LasaPairCard)
```

### 18.2 Azure Raw Mode Rationale
Testing proved that Azure Neural Voices (`en-US-JennyNeural`) produce natural, clinically accurate medication pronunciations when provided the clean medication/generic name (`bupropion`, `clonazepam`). Passing hyphenated phonetic respellings (`byoo-PRO-pee-on`) results in staccato pauses and unnatural pitch inflections. Therefore:
- **Audio Generation**: Uses Raw Mode generic/medication terms exclusively.
- **Phonetic Provenance**: Reference pronunciation strings and verification sources are preserved in `audioManifest.json` and UI tooltips as clinical reference data, not passed as synthesis text.

### 18.3 Zero-Runtime Azure Dependency
- All 100 medication audio files (~2.96 MB total) reside locally in `public/audio/lasa/`.
- Deployed production bundles (`dist/`) require no network connectivity to external speech services, eliminating latency, subscription risk, and API rate limits.
- The pipeline script is validated via `npm run validate:lasa-audio`.