# DUOCLONGO — REFINED PROJECT ROADMAP

> **A focused, gamified learning application centered strictly on Look-Alike / Sound-Alike (LASA) medication name recognition, Tall Man lettering, and confusable pair memorization.**

---

## 1. Core Mission & Educational Scope

Duoclongo addresses **one singular educational problem**:
> **Helping pharmacy learners recognize and distinguish Look-Alike / Sound-Alike (LASA) medication names.**

The application focuses strictly on three cognitive learning objectives:
1. **Tall Man Lettering Recognition**: Visually identifying correct capitalized letter distinctions (e.g., `acetaZOLAMIDE` vs `acetoHEXAMIDE`, `fentaNYL` vs `ALfentanil`).
2. **LASA Pair Recognition**: Identifying which medication forms a confusable counterpart with a target drug based on the Institute for Safe Medication Practices (ISMP 2023) standard.
3. **LASA Pair Memorization**: Reinforcing mental discrimination through repeated interactive retrieval, multiple-choice discrimination, and tactile counterpart matching.

### Non-Goals / Quarantined Scope
- ❌ **Zero Dispensing Scenarios / Hospital Workflows**: No simulated prescription orders, nurse bedside stories, pharmacy counter interactions, or surgical narratives.
- ❌ **Zero Dosage Calculations or Clinical Decision Making**: No renal adjustments, contraindication evaluations, or dosing regimens.
- ❌ **Zero Fabricated Pairs or Non-Standard Capitalization**: Every drug pair and Tall Man convention is grounded strictly in official ISMP 2023 documentation.

---

## 2. Three-Tier Architectural Roadmap

```text
┌─────────────────────────────────────────────────────────────┐
│ TIER 1: CORE LASA RECOGNITION MVP (Active Production Focus) │
├─────────────────────────────────────────────────────────────┤
│ • Pure ISMP 2023 Pair Database (src/data/lasaPairs.json)   │
│ • Pure Domain Question Sampling & Generation Engine         │
│ • Unassisted Tall Man Mastery Capstones                     │
│ • Interactive Counterpart Matching Practice                 │
│ • Web Audio API Affirmative & Error Sound Feedback          │
│ • Local Storage State & Progression Persistence             │
│ • Temporary Developer Testing Overrides                     │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ TIER 2: PERSISTENCE & USER ACCOUNTS (Next Target)           │
├─────────────────────────────────────────────────────────────┤
│ • Supabase Authentication (Email / Password / OAuth)        │
│ • Cloud User Progress & Streak Synchronization              │
│ • Spaced Repetition (SRS) Review Engine for Mastered Pairs   │
│ • Learner Mistake Tracking & Targeted Remediation Decks     │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ TIER 3: FUTURE THESIS RESEARCH SCOPE (Quarantined)         │
├─────────────────────────────────────────────────────────────┤
│ • Simulated Automated Dispensing Cabinet (ADC) Verification  │
│ • Real-Time Competitive LASA Pair Recognition Battler       │
│ • Barcode Scanning & Prescription Order Auditing            │
│ (Strictly quarantined from Tier 1 core recognition MVP)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Tier 1: Current MVP (Detailed Specification)

### 3.1 Content & Curriculum
- **Section 1: Foundations**
  - **Unit 1**: Look-Alike Drug Stems & Prefix Confusions (6 verified ISMP pairs)
    - `acetaZOLAMIDE` / `acetoHEXAMIDE`
    - `acetaminophen` / `acetaZOLAMIDE`
    - `Abelcet` / `amphotericin B`
    - `acetic acid for irrigation` / `glacial acetic acid`
    - `Aggrastat` / `argatroban`
    - `predniSONE` / `prednisoLONE`
  - **Unit 2**: Brand-Name Orthographic & Sound-Alikes (6 verified ISMP pairs)
    - `Accupril` / `Aciphex`
    - `Aciphex` / `Aricept`
    - `Activase` / `Cathflo Activase`
    - `Activase` / `TNKase`
    - `Adacel (Tdap)` / `Daptacel (DTaP)`
    - `Aldara` / `Alora`
  - **Unit 3**: Suffix Variants & Release Kinetics (7 verified ISMP pairs)
    - `Actonel` / `Actos`
    - `Adderall` / `Adderall XR`
    - `Adderall` / `Inderal`
    - `ado-trastuzumab emtansine` / `trastuzumab`
    - `Advair` / `Advicor`
    - `Advicor` / `Altocor`
    - `Afrin (oxymetazoline)` / `Afrin (saline)`
- **Section 2: High-Alert Medications**
  - **Unit 1**: High-Alert Synthetic Opioids (5 verified ISMP pairs)
    - `fentaNYL` / `ALfentanil`
    - `ALfentanil` / `SUFentanil`
    - `fentaNYL` / `SUFentanil`
    - `HYDROmorphone` / `morphine`
    - `HYDROmorphone` / `oxyMORphone`

### 3.2 Question & Activity Architecture
- **Type A: Tall Man Recognition & Construction** (`tall_man`): Learner enters the distinctive uppercase letters or selects the properly capitalized form.
- **Type B: Look-Alike Counterpart Recognition** (`multiple_choice`): Learner identifies the ISMP-documented confusable counterpart from distractors.
- **Type C: Interactive Pair Matching** (`matching`): Learner pairs confusable medications through active tactile association.
- **Type D: Unit Mastery Capstone** (`unit_mastery`): Final task of each unit requiring unassisted recall without scaffolding or hints.

### 3.3 Audio Feedback System
- Synthesized in real time via the browser **Web Audio API** (`audioService.js`):
  - **Correct Answer**: Affirmative two-tone sine chime (523.25 Hz C5 → 659.25 Hz E5) conveying positive accomplishment.
  - **Incorrect Answer**: Low descending buzzer (160 Hz → 110 Hz) with dissonant harmonic edge that clearly sounds like an error/mistake.

---

## 4. Tier 2: Account & Persistence

Planned milestone to introduce persistent multi-device synchronization:
- Supabase integration for authenticated user accounts.
- Cloud storage of hearts, streaks, XP, and completed level IDs.
- Local-first synchronization: immediate offline availability with background sync.
- Spaced Repetition (SuperMemo-2 / Leitner) scheduling for memorized LASA pairs.

---

## 5. Tier 3: Future Research Scope (Quarantined)

Long-term concepts documented in the thesis proposal that are **strictly isolated** from the active MVP:
- Simulated automated dispensing workflows and barcode verification stations.
- Real-time multiplayer speed-matching challenges.
- Institutional curriculum management and classroom analytics dashboard.

No Tier 3 feature may be introduced into the core lesson or question path.
