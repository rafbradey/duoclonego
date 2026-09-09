# LASA JSON Structure Guidelines

## Purpose

The current LASA JSON dataset is **prototype/sample data**. Its structure is not considered final.

The AI agent may modify, restructure, rename, or improve the JSON schema later when implementing the actual lesson, activity, and question engine.

The goal is to create a data structure that properly represents how Duoclongo teaches LASA concepts rather than forcing the learning system to follow the current prototype structure.

---

## Core Data Principle

A LASA relationship is **not the same thing as a question**.

A single LASA relationship may be used to create multiple questions and learning activities.

For example, one LASA relationship could eventually support:

* Identify the correct drug
* Compare two drug names
* Identify the source of confusion
* Recognize Tall Man lettering
* Match a drug with its confused drug
* Recall a previously learned relationship
* Review an incorrectly answered question

Therefore:

**LASA relationship → Multiple learning activities/questions**

and not:

**LASA relationship → One question**

---

## Levels

A level may contain multiple LASA relationships.

Levels are **learning-progress containers**, not medical classifications.

The current level system must not be interpreted as:

* Drug prevalence
* Real-world commonness
* Clinical importance
* Severity
* Safety risk
* Frequency of medication errors
* Evidence-based difficulty

The current levels exist primarily to test and develop:

* Lesson progression
* Level unlocking
* Question generation
* Learning activities
* XP
* Lesson completion
* Progress tracking
* Review
* UI/UX

The level structure should remain easy to reorganize.

A LASA relationship may be moved from one level to another without requiring changes to the underlying learning engine.

---

## Prototype JSON

The current JSON may use a structure similar to:

```json
{
  "levels": [
    {
      "id": 1,
      "name": "Level 1",
      "entries": [
        {
          "id": "lasa-001",
          "drugName": "Abelcet",
          "confusedDrugName": "amphotericin B"
        }
      ]
    }
  ]
}
```

This structure is **not final**.

It is only intended to provide enough structure for the current prototype.

---

## Future Restructuring

When implementing the actual lesson and question engine, inspect the existing LASA JSON structure and determine whether it is still appropriate.

The AI agent is allowed to:

* Rename fields
* Rename IDs
* Move fields
* Split data into multiple files
* Combine related data
* Introduce appropriate relationships
* Create a better schema
* Separate source data from learning configuration
* Separate LASA relationships from generated questions
* Reorganize levels

Do not preserve the prototype schema solely for compatibility if doing so creates unnecessary complexity.

However, restructuring should remain **simple, understandable, and maintainable**.

Do not introduce unnecessary abstractions or a complicated data model before the application actually requires one.

---

## IDs

Prototype IDs such as:

```text
lasa-001
lasa-002
lasa-003
```

are temporary identifiers.

The AI agent may change the ID format if another format is clearer or better suited to the eventual data model.

Potential formats include:

```text
lasa-001
lasa_001
lasa-pair-001
```

or another appropriate format.

### ID Requirements

IDs should ideally be:

1. Easy to understand
2. Consistent
3. Stable
4. Easy to reference
5. Independent of level placement

Avoid IDs that contain a level number.

For example, avoid:

```text
level-1-lasa-001
```

because the LASA relationship may later move to another level.

A stable identifier should remain the same even when the relationship is reorganized.

---

## Questions and Activities

Do not store every generated question directly inside the LASA relationship unless there is a clear architectural reason to do so.

The learning engine should be able to use LASA data to produce different activities.

For example:

```text
LASA Relationship
       ↓
Question / Activity Generator
       ↓
 ┌───────────────┬────────────────┬────────────────┐
 ↓               ↓                ↓                ↓
Identification   Matching        Comparison       Review
```

The exact implementation should be determined when the learning engine is developed.

Do not prematurely design a complex question schema before the requirements for the question engine are known.

---

## Source Data vs Learning Structure

Keep the distinction between:

### LASA Data

Information about the actual LASA relationship.

Examples:

* Drug name
* Confused drug name
* Verified Tall Man lettering
* Source information
* Other verified educational information

### Learning Structure

Information about how Duoclongo teaches that data.

Examples:

* Level
* Lesson
* Activity
* Question type
* Progress
* Review status

The learning structure may change without changing the underlying LASA relationship.

---

## Research Integrity

Restructuring the JSON does **not** authorize the AI agent to modify the underlying medical information.

The AI agent must not:

* Invent LASA relationships
* Guess whether two drugs are LASA
* Invent Tall Man lettering
* Invent medical classifications
* Invent indications
* Invent dosage information
* Invent safety recommendations
* Assign unsupported clinical importance
* Treat name similarity alone as proof of a LASA relationship

If the structure changes, the underlying researched information must remain faithful to its verified source.

---

## Prototype Data

The current LASA dataset is development/prototype data.

It should not be presented to learners as a scientifically ranked list unless the ranking has been supported by appropriate research.

The AI agent should clearly distinguish between:

**Prototype organization**

and

**Research-backed classification or prioritization.**

---

## Future Data Flow

The intended long-term direction is:

```text
Authoritative Research
        ↓
Verified LASA Relationships
        ↓
Normalized LASA Data
        ↓
Educational Selection
        ↓
Learning Structure
        ↓
Lessons
        ↓
Multiple Activities / Questions
        ↓
Progress and Review
```

Research determines which LASA relationships are supported.

Educational goals determine which verified relationships should be taught first.

The application structure should support both without tightly coupling the two.

---

## Agent Decision Rule

When the actual learning engine is implemented:

> **Do not force the learning engine to fit the prototype JSON.**

Instead:

1. Inspect the current LASA data.
2. Understand the lesson and question requirements.
3. Determine the simplest appropriate data structure.
4. Restructure the JSON if necessary.
5. Preserve verified LASA information.
6. Keep IDs stable where practical.
7. Keep level assignments easy to change.
8. Avoid unnecessary duplication.
9. Avoid overengineering.
10. Document significant schema changes.

The best schema is the one that makes the learning system **clear, maintainable, flexible, and easy to evolve**.

---

## Core Principle

**LASA data describes the relationship.**

**Levels organize the learning progression.**

**Lessons organize the learning experience.**

**Activities and questions use the LASA data to teach and assess the learner.**

The data model should support this separation as Duoclongo evolves.
