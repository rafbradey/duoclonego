# Duoclongo 🦉💊

**Duoclongo** is a Duolingo-inspired web application designed to train healthcare professionals, pharmacy students, and clinicians in rapid, reliable identification of **Look-Alike, Sound-Alike (LASA)** medications. 

By combining clinical pharmacology data with gamified cognitive reinforcement—including spaced repetition (SRS), Tall Man lettering, and error remediation—Duoclongo helps prevent medication errors before they happen.

---

## 🌟 Key Features

- **Structured Learning Path (6-Level Architecture)**:
  - Standardized 6-level pedagogical progression across 4 units (24 total curriculum levels) with 100% coverage guarantees across all 5 assigned LASA pairs per unit.
  - Qualitative cognitive progression: Introduction $\rightarrow$ Tall Man Guided Construction $\rightarrow$ Clinical Risk & Indication Distinction $\rightarrow$ Simulated Oral Order (Sound-Alike Audio) $\rightarrow$ Rapid Review $\rightarrow$ Pure Unassisted Unit Mastery Capstone.
  - Direct Level Completion navigation (`[ Continue to Next Level ]`) with automatic unlock progression.
- **Interactive Clinical Question Types**:
  - **Look-Alike & Sound-Alike Identification**: Multiple-choice discrimination between confusing pairs.
  - **Sound-Alike Acoustic Discrimination & Simulated Oral Orders**: Realistic telephone/verbal prescription verification using pre-rendered Azure AI Speech Neural static audio assets, enforcing Joint Commission read-back safety protocols with a pre-answer auditory gate.
  - **Universal Clinical Medication Pronunciation**: On-demand static audio playback via `<AudioPronounceButton />` seamlessly integrated across Multiple Choice, Tall Man Construction, Sound-Alike, and Guidebook cards.
  - **Tap-to-Match Pairing**: Active recall pairing of medication counterparts under time and heart constraints.
  - **Tall Man Lettering Fill-in-the-Blank**: Case-sensitive mastery challenges emphasizing FDA/ISMP capitalization rules (e.g., `buPROPion` vs `busPIRone`).
- **Spaced Repetition System (SRS)**:
  - 4-stage Leitner-style memory decay engine (0h, 24h, 72h, 168h intervals) for long-term retention.
  - Targeted retention tracking with visual mastery stages.
- **Practice Hub & Targeted Remediation**:
  - **Daily Spaced Review (`mode=due`)**: Automatically serves questions due for memory reinforcement.
  - **Targeted Mistakes Review (`mode=mistakes`)**: Prioritizes and tracks recently missed medications.
  - **Quick Practice (`mode=quick`)**: Rapid 5-item session covering full curriculum breadth.
  - **Sound-Alike Audio Challenge (`mode=audio`)**: Dedicated auditory discrimination drill practicing spoken order recognition and read-back verification.
  - **Origin Identification**: Every review question displays its exact Learning Path source (e.g., `Level 1 • Unit 2`).
- **Gamification & Feedback**:
  - Hearts system, XP multipliers, day streaks, and celebration animations with the interactive Duo mascot.
  - Tiered Achievement Badges (Bronze, Silver, Gold) across progress, streaks, mastery, and SRS retention.
- **Mobile-First & Responsive UX**:
  - Fully responsive design engineered for viewports from 320px ultra-narrow mobile to widescreen desktop.
  - Dedicated mobile slide-out drawer providing full Learning Path navigation from the hamburger menu.

---

## 📦 Required Packages & Tech Stack

### Core Technologies
- **Runtime**: [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- **Framework**: [React 19](https://react.dev/) (`react`, `react-dom`)
- **Bundler & Dev Server**: [Vite](https://vite.dev/) (`vite`, `@vitejs/plugin-react`)
- **Routing**: [React Router v8](https://reactrouter.com/) (`react-router`)
- **Iconography**: [Lucide React](https://lucide.dev/) (`lucide-react`)
- **Linting & Code Quality**: [ESLint](https://eslint.org/) (`eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`)

---

### Package Installation Guide

#### 1. Standard Installation (Recommended)
To install all required packages configured in `package.json`:
```bash
npm install
```

#### 2. Manual Package Installation Breakdown
If installing required dependencies individually:

```bash
# Core Application & Routing
npm install react@^19.2.6 react-dom@^19.2.6 react-router@^8.0.1

# Iconography
npm install lucide-react@^1.21.0

# Development Dependencies (Bundling & Tooling)
npm install -D vite@^8.0.12 @vitejs/plugin-react@^6.0.1 eslint@^10.3.0 @eslint/js@^10.0.1 eslint-plugin-react-hooks@^7.1.1 eslint-plugin-react-refresh@^0.5.2 globals@^17.6.0 @types/react@^19.2.14 @types/react-dom@^19.2.3
```

#### 3. Cloud Backend Integration (Optional / Future Sync)
Duoclongo stores learner state in local storage by default. For cloud synchronization and user profiles:
```bash
# Supabase Client (Authentication & Cloud Database Sync)
npm install @supabase/supabase-js
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/rafbradey/duoclonego.git
cd duoclonego
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173/`.

### 4. Build for Production
```bash
npm run build
```
Generates an optimized, minified production build in the `dist/` directory.

### 5. Code Quality & Linting
```bash
npm run lint
```
Runs ESLint across all source modules.

### 6. Medication Pronunciation Audio Validation
```bash
npm run validate:lasa-audio
```
Audits all 100 pre-generated medication pronunciation audio assets in `public/audio/lasa/` to ensure 100% presence, non-zero file sizes, and integrity against canonical LASA pair records.

### 7. (Optional Dev) Audio Asset Re-generation
```bash
npm run generate:lasa-audio
```
Re-indexes or regenerates static audio assets via Azure AI Speech Raw Mode (requires `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` in `.env.local`). Only needed if adding new medication pairs.

---

## 📂 Project Architecture

```text
duoclonego/
├── public/                 # Static assets, icons, avatars, and audio
│   └── audio/lasa/         # 100 pre-generated clinical medication pronunciation MP3s (2.96 MB)
├── scripts/                # Development & build-time CLI scripts
│   ├── generateLasaAudio.js # Azure AI Speech batch audio generator (Raw Mode)
│   └── validateLasaAudio.js # Automated asset integrity & manifest validator
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AudioPronounceButton/ # Universal static audio player button
│   │   ├── AuthModal/      # Cloud login, sign-up, and guest-sync modal
│   │   ├── FeedbackDrawer/ # Real-time answer result drawer
│   │   ├── GuidebookModal/ # Unit LASA clinical summary modal
│   │   ├── Layout/         # AppLayout shell, navigation, mobile drawer
│   │   ├── LessonCompletion/ # Level complete screen & unified session breakdown
│   │   ├── Mascot/         # Interactive animated Duoclongo owl
│   │   ├── QuestionCard/   # MCQ, Tall Man, Matching, and Sound-Alike question renderers
│   │   ├── Sidebar/        # Desktop sidebar & mobile Learning Path drawer
│   │   └── UnitDescriptionModal/ # Unit preview and clinical objectives modal
│   ├── data/               # Clinical datasets and curriculum
│   │   ├── audioManifest.json # Full provenance & verification audit manifest
│   │   ├── audioMapping.json # Deterministic medication ID to audio file mapping
│   │   ├── lasaData.json   # Canonical medication details & confusion reasons
│   │   ├── lasaPairs.json  # Documented ISMP look-alike/sound-alike pairs
│   │   ├── levels/         # Unit and level curriculum JSON definitions (6-level architecture)
│   │   └── supabase_schema.sql # Canonical Phase 4 Supabase PostgreSQL RLS schema
│   ├── pages/              # Application views
│   │   ├── Learn/          # Main curriculum path and level nodes
│   │   ├── Lesson/         # Active interactive lesson session
│   │   ├── Practice/       # Spaced repetition hub, daily review, mistakes queue, audio drill
│   │   ├── Profile/        # Retention analytics, streak stats, badge showcase
│   │   ├── Quests/         # Daily quests and achievement tracker
│   │   ├── Documentation/  # Living clinical documentation and architecture guide
│   │   └── TtsTestPage/    # Developer Azure AI Speech test & diagnostic suite
│   ├── services/           # Pure domain logic and storage engines
│   │   ├── audioService.js      # Web Audio feedback chimes & static pronunciation playback
│   │   ├── authService.js       # Supabase Auth operations, sessions, and state listeners
│   │   ├── badgeService.js      # Achievement calculations and badge unlocked checks
│   │   ├── drugService.js       # Medication search, details, and metadata indexing
│   │   ├── lessonEngine.js      # Answer validation, scoring, and session tracking
│   │   ├── lessonService.js     # Progression unlock rules and next level discovery
│   │   ├── practiceService.js   # 4-stage Leitner SRS engine and review queues
│   │   ├── supabaseClient.js    # Initialized Supabase client instance
│   │   └── userService.js       # Dual-mode persistence (Supabase Cloud + Local Cache)
│   ├── App.jsx             # Top-level application routing
│   ├── main.jsx            # React root mount point
│   └── index.css           # Global design system tokens and responsive styles
├── package.json            # Project manifest, scripts, and dependencies
├── vite.config.js          # Vite build configuration
└── README.md               # Project documentation
```

---

## ⚕️ Clinical Data & Regulatory Compliance

- **ISMP Compliance**: Medication pairs and Tall Man lettering conventions conform to the [Institute for Safe Medication Practices (ISMP)](https://www.ismp.org/) List of Error-Prone Look-Alike and Sound-Alike Drug Names.
- **FDA Guidelines**: Tall Man lettering specifically applies FDA-designated uppercase patterns to distinguish confusable segments of drug names (e.g., `vinBLAStine` vs `vinCRIStine`).
- **Educational Scope**: Intended for educational, training, and cognitive-retrieval purposes to increase safety vigilance in clinical environments.

---

## 📄 License

This project is licensed under the MIT License - see the repository for details.