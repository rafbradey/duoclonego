# DUOCLONGO — LASA RESEARCH & EDUCATIONAL REFERENCE

This document defines the research areas and medication-safety concepts that should guide the design of Duoclongo's LASA learning experience.

This is a research and design reference.

It is NOT a substitute for authoritative medical guidance.

AI agents must not invent medical facts, drug classifications, LASA relationships, or medication-safety recommendations.

When implementing actual educational content, use verified and authoritative sources.

---

# 1. PURPOSE

Duoclongo is designed around LASA medication education.

The application should be informed by established medication-safety practices rather than simply creating a visual imitation of a language-learning application.

Research should influence:

- Drug data structures
- LASA relationships
- Question design
- Feedback
- Learning objectives
- Visual presentation
- Error prevention
- Review mechanisms
- Tall Man lettering
- Drug-name differentiation
- Educational explanations

The goal is to make the application educationally meaningful while maintaining the approachable experience of a gamified learning platform.

---

# 2. LASA MEDICATIONS

LASA means:

Look-Alike, Sound-Alike.

LASA medications are medications that can be confused because their names, appearance, packaging, labeling, or other characteristics are similar.

LASA risks can involve:

- Similar spelling
- Similar pronunciation
- Similar written appearance
- Similar dosage forms
- Similar packaging
- Similar labeling
- Similar strengths
- Similar brand or generic names
- Other sources of medication-name confusion

The application should distinguish between different causes of confusion instead of treating every LASA relationship as identical.

---

# 3. TYPES OF LASA CONFUSION

The application should eventually be able to classify why two medications may be confused.

Potential categories include:

## Sound-Alike

Names may sound similar when spoken.

Example concept:

Drug A
vs.
Drug B

The application should not assume two drugs are sound-alike merely because their names look similar.

---

## Look-Alike

Names or medication-related visual information may appear similar.

This may include:

- spelling
- typography
- packaging
- labeling
- dosage form
- appearance

---

## Name Similarity

Two drug names may contain similar letters, syllables, prefixes, suffixes, or naming patterns.

This is especially relevant to drug-name recognition exercises.

---

## Combined Look-Alike / Sound-Alike

Some medication pairs may have both visual and phonetic similarities.

The data model should allow multiple confusion categories when appropriate.

---

# 4. TALL MAN LETTERING

Tall Man lettering is a medication-safety technique in which selected portions of drug names are written using uppercase letters to help distinguish look-alike and sound-alike medication names.

Example concept:

predniSONE
prednisoLONE

The purpose is to make important differences more visually noticeable.

Tall Man lettering should be treated as a safety-oriented visual differentiation technique, not merely as a typography feature.

---

# 5. TALL MAN LETTERING IN DUOCLONGO

Tall Man lettering should eventually be represented as structured educational data.

Do not hardcode Tall Man capitalization directly into unrelated UI components.

Conceptually:

Drug
├── standardName
├── tallManName
└── LASA relationships

The application may use Tall Man lettering in:

- drug comparison cards
- question choices
- explanations
- review screens
- educational examples
- identification exercises

The exact capitalization must come from a verified source.

AI agents must NOT invent Tall Man capitalization.

---

# 6. DRUG NAME DIFFERENTIATION

Duoclongo should teach users to actively notice differences between confusing medication names.

Potential learning techniques include:

- highlighting distinguishing letters
- Tall Man lettering
- side-by-side comparison
- pronunciation comparison
- generic vs brand name comparison
- drug-class comparison
- indication comparison
- dosage-form comparison
- memory cues
- repeated exposure
- retrieval practice

These techniques should support recognition rather than encourage memorization without context.

---

# 7. EDUCATIONAL DESIGN

The application should favor active recall over passive reading.

Instead of only displaying:

"Drug A and Drug B are LASA medications."

the application should eventually ask users to perform tasks such as:

- Which drug is being described?
- Which drug is the LASA counterpart?
- Which spelling is correct?
- Which portion of the names differs?
- Which drug belongs to the described class?
- Which name uses the correct Tall Man lettering?
- Which drug matches the indication?
- Which medication was previously confused with this one?

Questions should be designed around the actual learning objective.

---

# 8. RETRIEVAL PRACTICE

Repeated retrieval should be an important part of the learning experience.

Users should not simply reread drug information.

The system should eventually bring previously encountered LASA drugs back into practice.

Potential mechanisms:

- Review questions
- Spaced repetition
- Previously incorrect questions
- Weak-area practice
- Random review
- Mastery-based review

The exact algorithm should be designed later.

Do not implement a complex spaced-repetition algorithm without a clear requirement.

---

# 9. IMMEDIATE FEEDBACK

Correct and incorrect answers should provide useful feedback.

Feedback should ideally explain:

- Why the answer is correct
- Why the other option may be confusing
- What distinguishes the medications
- What visual or phonetic difference should be noticed
- Relevant Tall Man lettering when applicable

Avoid feedback that simply says:

"Correct!"

or:

"Wrong!"

The learning experience should teach something after an error.

---

# 10. ERROR-BASED LEARNING

Incorrect answers should become opportunities for additional learning.

The system should eventually be able to track:

- questions answered incorrectly
- frequently confused drugs
- repeated mistakes
- difficult LASA pairs
- question types that cause difficulty

This information can later support personalized review.

Do not treat every incorrect answer as a permanent weakness.

Learning data should be interpreted carefully.

---

# 11. DRUG COMPARISON

A LASA learning experience should frequently encourage comparison.

A comparison may include:

Drug A
vs.
Drug B

Possible comparison fields:

- Generic name
- Brand name
- Tall Man name
- Drug class
- Indication
- Dosage form
- Strength
- Pronunciation
- Key distinguishing feature
- Reason for LASA risk

Only include fields supported by authoritative data.

---

# 12. QUESTION DESIGN PRINCIPLES

Questions should have a clear learning objective.

Each question should ideally answer:

"What is the learner supposed to notice or remember?"

Examples:

## Recognition

Identify the correct drug name.

## Differentiation

Distinguish one LASA drug from another.

## Recall

Recall information previously taught.

## Application

Use drug information to select the appropriate answer in a scenario.

## Visual Recognition

Identify important differences in drug names.

## Review

Reinforce previously learned information.

Avoid creating questions simply to increase the number of questions.

---

# 13. QUESTION DIFFICULTY

Difficulty should increase gradually.

Potential progression:

Beginner
↓
Recognize drug names
↓
Recognize LASA pairs
↓
Identify distinguishing features
↓
Compare drug information
↓
Recall previously learned information
↓
Apply knowledge in scenarios
↓
Mixed review

Do not make early lessons unnecessarily difficult.

---

# 14. AUTHORITATIVE RESEARCH SOURCES

When building actual LASA educational content, prioritize authoritative sources.

Potential sources to investigate include:

- Institute for Safe Medication Practices (ISMP)
- U.S. Food and Drug Administration (FDA)
- World Health Organization (WHO)
- Joint Commission
- National Center for Biotechnology Information (NCBI)
- PubMed / peer-reviewed literature
- Official medication labeling
- Relevant national medication-safety organizations
- Institutional medication-safety resources

The exact sources used by the application should be documented when actual educational content is created.

---

# 15. RESEARCH REQUIREMENT

When adding new LASA drug content:

1. Identify the authoritative source.
2. Verify the drug names.
3. Verify the LASA relationship.
4. Verify the reason for similarity/confusion.
5. Verify Tall Man lettering if applicable.
6. Verify educational facts.
7. Record the source.
8. Avoid unsupported claims.

Do not generate a fictional LASA pair simply because two drug names look similar.

---

# 16. SOURCE METADATA

The eventual drug data model should have the ability to associate educational information with its source.

Conceptually:

Drug / LASA Content
├── source
├── sourceType
├── sourceUrl
├── sourceDate
└── verifiedDate

The exact implementation can be decided later.

The goal is traceability.

---

# 17. MEDICAL SAFETY

Duoclongo is an educational application.

It should not:

- provide personalized medical advice
- recommend medication changes
- recommend doses for individual patients
- diagnose medical conditions
- replace professional clinical judgment
- imply that completing a lesson qualifies someone to administer medication safely

Educational scenarios must be clearly presented as learning exercises.

---

# 18. CONTENT VERSIONING

Medication-safety information can change.

Educational content should therefore be designed so that it can eventually be:

- reviewed
- updated
- corrected
- versioned
- attributed to a source

Do not build the system around permanently hardcoded medical information.

---

# 19. RESEARCH VS APPLICATION LOGIC

Research determines:

- What information is educationally important
- Which LASA relationships are supported
- How drug names should be differentiated
- What safety techniques should be taught

Application logic determines:

- How questions are generated
- How answers are evaluated
- How progress is tracked
- How XP is awarded
- How lessons are unlocked

Do not mix research facts with application mechanics.

---

# 20. IMPORTANT RULE FOR AI AGENTS

AI-generated medical information must not automatically become application content.

Before adding drug-related educational content, verify it against an appropriate authoritative source.

If a source cannot be verified, mark the information as unverified and do not present it as authoritative educational content.

Never invent:

- LASA pairs
- Tall Man lettering
- drug classes
- indications
- dosage information
- medication safety recommendations

---

# 21. FUTURE RESEARCH AREAS

As Duoclongo develops, research may expand into:

- LASA medication identification
- Tall Man lettering
- Medication-name safety
- Human factors
- Medication error prevention
- Retrieval practice
- Spaced repetition
- Cognitive load
- Educational gamification
- Feedback design
- Error-based learning
- Mastery learning
- Accessibility in health education
- Mobile learning
- Medication safety education

Research should be used to improve the educational experience, not to unnecessarily complicate the application.

---

# 22. CORE PRINCIPLE

Duoclongo should teach learners to notice meaningful differences between medications.

The application should not simply ask:

"Do you remember this name?"

It should increasingly ask:

"Can you distinguish this medication from the one it could be confused with?"