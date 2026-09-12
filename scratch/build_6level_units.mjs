import fs from "fs";
import { getLasaPairsByIds, generateLevelContent } from "../src/services/questionGenerator.js";
import { auditUnitCoverage } from "../src/services/curriculumCoverageService.js";

const unitConfigs = [
    {
        file: "src/data/levels/section-1/unit-1.json",
        sectionId: "section-1",
        sectionTitle: "Section 1: Foundations",
        id: "unit_001",
        unitNumber: 1,
        title: "SECTION 1, UNIT 1",
        description: "Look-Alike Drug Stems & Generic Confusions",
        subtitle: "Differentiate foundational generic drug pairs (buPROPion/busPIRone, hydrALAZINE/hydrOXYzine, predniSONE/prednisoLONE) using Tall Man lettering.",
        unitMessage: "ISMP & FDA Foundational Look-Alike Generic Confusions",
        color: "#2dab69",
        pairRange: [1, 13],
        levels: [
            {
                id: "level_001",
                levelNumber: 1,
                type: "level",
                title: "Supported LASA Pair Recognition",
                description: "Identify confusable medication counterparts from verified FDA/ISMP pairs with audio and visual support.",
                learningObjective: "Recognize documented Look-Alike / Sound-Alike medication counterparts with visual and auditory pronunciation support.",
                xpReward: 10,
                unlocked: true
            },
            {
                id: "level_002",
                levelNumber: 2,
                type: "level",
                title: "Tall Man Lettering: Batch A",
                description: "Identify correct ISMP/FDA Tall Man capitalization to differentiate look-alike medications (Batch A).",
                learningObjective: "Recognize the correct ISMP/FDA Tall Man lettering representation for foundational drug stems.",
                xpReward: 15,
                unlocked: false
            },
            {
                id: "level_003",
                levelNumber: 3,
                type: "level",
                title: "Tall Man Batch B & Acoustic Discrimination",
                description: "Complete Tall Man recognition for remaining unit stems and discriminate verified sound-alike pairs.",
                learningObjective: "Differentiate look-alike Tall Man forms and discriminate spoken sound-alike medications.",
                xpReward: 15,
                unlocked: false
            },
            {
                id: "level_004",
                levelNumber: 4,
                type: "level",
                title: "Guided Tall Man Retrieval",
                description: "Actively construct distinguishing Tall Man segments before unassisted recall.",
                learningObjective: "Retrieve and input distinguishing Tall Man uppercase segments from memory.",
                xpReward: 15,
                unlocked: false
            },
            {
                id: "level_005",
                levelNumber: 5,
                type: "level",
                title: "Pair Consolidation & Read-Back",
                description: "Consolidate confusable pairs through interactive matching and simulated telephone read-back.",
                learningObjective: "Reinforce pair associations and verify oral prescription statements through accurate verbal read-back.",
                xpReward: 15,
                unlocked: false
            },
            {
                id: "level_001_mastery",
                levelNumber: 6,
                type: "unit_mastery",
                title: "Unit 1 Mastery Challenge",
                description: "Prove complete unassisted mastery by constructing exact Tall Man lettering and discriminating confusable pairs without scaffolding.",
                learningObjective: "Demonstrate complete unassisted mastery across all Unit 1 LASA pairs and Tall Man terms.",
                xpReward: 25,
                unlocked: false
            }
        ]
    },
    {
        file: "src/data/levels/section-1/unit-2.json",
        sectionId: "section-1",
        sectionTitle: "Section 1: Foundations",
        id: "unit_002",
        unitNumber: 2,
        title: "SECTION 1, UNIT 2",
        description: "High-Alert & Oncology/Critical Care Pairs",
        subtitle: "Differentiate critical antineoplastics and high-risk look-alikes (CARBOplatin/CISplatin, vinBLAStine/vinCRIStine, epiNEPHrine/ePHEDrine) using verified Tall Man lettering.",
        unitMessage: "High-Alert Antineoplastic & Resuscitation Pairs",
        color: "#3b82f6",
        pairRange: [14, 25],
        levels: [
            {
                id: "level_006",
                levelNumber: 1,
                type: "level",
                title: "Supported Oncology & Resuscitation Recognition",
                description: "Identify high-alert oncology and critical care medication pairs with audio and visual support.",
                learningObjective: "Recognize high-alert antineoplastic and critical care look-alike pairs.",
                xpReward: 10,
                unlocked: false
            },
            {
                id: "level_007",
                levelNumber: 2,
                type: "level",
                title: "High-Alert Tall Man: Batch A",
                description: "Identify correct ISMP/FDA Tall Man capitalization for antineoplastic and cardiovascular agents (Batch A).",
                learningObjective: "Differentiate high-risk oncology stems through Tall Man lettering.",
                xpReward: 15,
                unlocked: false
            },
            {
                id: "level_008",
                levelNumber: 3,
                type: "level",
                title: "High-Alert Tall Man Batch B & Acoustic Discrimination",
                description: "Complete Tall Man recognition for Batch B and discriminate sound-alike resuscitation drugs (epiNEPHrine/ePHEDrine).",
                learningObjective: "Acoustically discriminate high-risk sound-alikes and recognize critical Tall Man distinctions.",
                xpReward: 15,
                unlocked: false
            },
            {
                id: "level_009",
                levelNumber: 4,
                type: "level",
                title: "Guided High-Alert Retrieval",
                description: "Construct distinguishing Tall Man segments for high-alert medications under scaffolding.",
                learningObjective: "Retrieve critical antineoplastic and vasoactive Tall Man segments.",
                xpReward: 15,
                unlocked: false
            },
            {
                id: "level_010",
                levelNumber: 5,
                type: "level",
                title: "Critical Care Consolidation & Read-Back",
                description: "Match confusable antineoplastic pairs and verify emergency verbal orders via phone read-back.",
                learningObjective: "Verify critical care verbal orders through structured oral read-back.",
                xpReward: 15,
                unlocked: false
            },
            {
                id: "level_002_mastery",
                levelNumber: 6,
                type: "unit_mastery",
                title: "Unit 2 Mastery Challenge",
                description: "Prove complete unassisted mastery on high-alert antineoplastic and critical care pairs without scaffolding.",
                learningObjective: "Demonstrate unassisted mastery on high-alert medications.",
                xpReward: 25,
                unlocked: false
            }
        ]
    },
    {
        file: "src/data/levels/section-1/unit-3.json",
        sectionId: "section-1",
        sectionTitle: "Section 1: Foundations",
        id: "unit_003",
        unitNumber: 3,
        title: "SECTION 1, UNIT 3",
        description: "Suffix Distinctions & Antimicrobial/CNS Look-Alikes",
        subtitle: "Distinguish subtle suffix variations in cephalosporins, psychotropics, and critical care sedatives (ceFAZolin/cefTRIAXone, fentaNYL/SUFentanil).",
        unitMessage: "Antimicrobial Suffixes & Psychotropic Look-Alikes",
        color: "#a855f7",
        pairRange: [26, 38],
        levels: [
            {
                id: "level_011",
                levelNumber: 1,
                type: "level",
                title: "Supported Antimicrobial & CNS Recognition",
                description: "Recognize look-alike cephalosporin and psychotropic pairs with audio and visual support.",
                learningObjective: "Recognize antimicrobial suffix variations and sedative look-alikes.",
                xpReward: 10,
                unlocked: false
            },
            {
                id: "level_012",
                levelNumber: 2,
                type: "level",
                title: "Antimicrobial & CNS Tall Man: Batch A",
                description: "Identify correct Tall Man capitalization for cephalosporins and sedatives (Batch A).",
                learningObjective: "Differentiate antimicrobial prefixes and suffixes with Tall Man lettering.",
                xpReward: 15,
                unlocked: false
            },
            {
                id: "level_013",
                levelNumber: 3,
                type: "level",
                title: "Antimicrobial Tall Man Batch B & Acoustic Discrimination",
                description: "Complete Tall Man recognition for Batch B and acoustically discriminate sound-alike opioids and sedatives.",
                learningObjective: "Discriminate spoken sound-alikes and recognize subtle antimicrobial suffix differences.",
                xpReward: 15,
                unlocked: false
            },
            {
                id: "level_014",
                levelNumber: 4,
                type: "level",
                title: "Guided Suffix & Stem Retrieval",
                description: "Construct distinguishing Tall Man segments for antimicrobial and opioid agents.",
                learningObjective: "Retrieve distinguishing segments for confusable cephalosporins and sedatives.",
                xpReward: 15,
                unlocked: false
            },
            {
                id: "level_015",
                levelNumber: 5,
                type: "level",
                title: "Antimicrobial Consolidation & Read-Back",
                description: "Consolidate antimicrobial pairs and verify verbal sedative orders through telephone read-back.",
                learningObjective: "Verify oral antimicrobial and opioid prescriptions through verbal read-back.",
                xpReward: 15,
                unlocked: false
            },
            {
                id: "level_003_mastery",
                levelNumber: 6,
                type: "unit_mastery",
                title: "Unit 3 Mastery Challenge",
                description: "Prove complete unassisted mastery on antimicrobial suffixes and CNS sedatives.",
                learningObjective: "Demonstrate unassisted mastery across all Unit 3 pairs.",
                xpReward: 25,
                unlocked: false
            }
        ]
    },
    {
        file: "src/data/levels/section-2/unit-1.json",
        sectionId: "section-2",
        sectionTitle: "Section 2: Advanced Differentiation",
        id: "unit_004",
        unitNumber: 1,
        title: "SECTION 2, UNIT 1",
        description: "Brand Name Confusions & Specialized Formulations",
        subtitle: "Differentiate high-risk brand look-alikes (Humalog/Humulin R, NovoLOG/NovoLIN R, ZyPREXA/ZyrTEC, TopAMAX/Toprol-XL) documented in ISMP MERP.",
        unitMessage: "High-Risk Brand Name Look-Alikes & Sound-Alikes",
        color: "#ec4899",
        pairRange: [39, 50],
        levels: [
            {
                id: "level_016",
                levelNumber: 1,
                type: "level",
                title: "Supported Brand & Insulin Recognition",
                description: "Recognize high-risk brand-name and insulin formulations with audio and visual support.",
                learningObjective: "Recognize documented brand-name and insulin look-alike / sound-alike pairs.",
                xpReward: 10,
                unlocked: false
            },
            {
                id: "level_017",
                levelNumber: 2,
                type: "level",
                title: "Brand Name Tall Man: Batch A",
                description: "Identify correct Tall Man capitalization for insulin analogs and CNS brand names (Batch A).",
                learningObjective: "Differentiate high-risk brand names through ISMP Table 3 Tall Man lettering.",
                xpReward: 15,
                unlocked: false
            },
            {
                id: "level_018",
                levelNumber: 3,
                type: "level",
                title: "Brand Tall Man Batch B & Acoustic Discrimination",
                description: "Complete Brand Tall Man recognition for Batch B and acoustically discriminate sound-alike brand names.",
                learningObjective: "Acoustically discriminate look-alike brand names like ZyPREXA/ZyrTEC and TopAMAX/Toprol-XL.",
                xpReward: 15,
                unlocked: false
            },
            {
                id: "level_019",
                levelNumber: 4,
                type: "level",
                title: "Guided Brand Retrieval",
                description: "Construct distinguishing Tall Man segments for brand-name insulins and psychiatric medications.",
                learningObjective: "Retrieve and input distinguishing brand-name Tall Man segments.",
                xpReward: 15,
                unlocked: false
            },
            {
                id: "level_020",
                levelNumber: 5,
                type: "level",
                title: "Brand Consolidation & Telephone Read-Back",
                description: "Match confusable brand formulations and verify outpatient phone orders through read-back.",
                learningObjective: "Verify outpatient brand medication orders through telephone read-back.",
                xpReward: 15,
                unlocked: false
            },
            {
                id: "level_004_mastery",
                levelNumber: 6,
                type: "unit_mastery",
                title: "Unit 4 Mastery Challenge",
                description: "Prove complete unassisted mastery on high-risk brand names and specialized formulations.",
                learningObjective: "Demonstrate unassisted mastery across all Unit 4 brand pairs.",
                xpReward: 25,
                unlocked: false
            }
        ]
    }
];

console.log("Generating 6-Level Curriculum across all 4 units...");

unitConfigs.forEach((cfg) => {
    const pairIds = [];
    for (let i = cfg.pairRange[0]; i <= cfg.pairRange[1]; i++) {
        pairIds.push(`lasa_${String(i).padStart(3, "0")}`);
    }

    const realPairs = getLasaPairsByIds(pairIds);
    console.log(`\nUnit ${cfg.id}: loaded ${realPairs.length} canonical pairs.`);

    const unitLasaPairs = realPairs.map((p) => ({
        id: p.id,
        primary: p.drugA.tallManName,
        counterpart: p.drugB.tallManName,
        feature: p.distinguishingFeature || p.riskSummary || ""
    }));

    const levels = cfg.levels.map((lvl) => {
        const { activities, questions } = generateLevelContent(lvl, realPairs);
        return {
            ...lvl,
            lasaPairIds: pairIds,
            activities,
            questions
        };
    });

    const unitJson = {
        sectionId: cfg.sectionId,
        sectionTitle: cfg.sectionTitle,
        id: cfg.id,
        unitNumber: cfg.unitNumber,
        title: cfg.title,
        description: cfg.description,
        subtitle: cfg.subtitle,
        unitMessage: cfg.unitMessage,
        color: cfg.color,
        lasaPairs: unitLasaPairs,
        levels
    };

    fs.writeFileSync(cfg.file, JSON.stringify(unitJson, null, 2), "utf8");
    console.log(`✓ Wrote ${cfg.file} with ${levels.length} levels.`);

    // Run immediate coverage audit
    const audit = auditUnitCoverage({ ...unitJson, lasaPairs: realPairs });
    console.log(`  Tall Man Coverage: ${audit.coveredTallManTermsCount}/${audit.totalApplicableTallManTerms} (${audit.tallManCoveragePct}%)`);
    console.log(`  Sound-Alike Coverage: ${audit.coveredSoundAlikePairsCount}/${audit.totalVerifiedSoundAlikePairs} (${audit.soundAlikeCoveragePct}%)`);
    console.log(`  LASA Pair Coverage: ${audit.coveredLasaPairsCount}/${audit.totalLasaPairs}`);
    console.log(`  Look-Alike Sound Violations: ${audit.lookAlikeSoundViolations.length}`);
    console.log(`  Mastery Violations: ${audit.masteryViolations.length}`);
    console.log(`  Is Fully Covered: ${audit.isFullyCovered ? "YES ✓" : "NO ✗"}`);

    if (!audit.isFullyCovered) {
        if (audit.uncoveredTallManTerms.length > 0) {
            console.error("  Uncovered Tall Man:", audit.uncoveredTallManTerms.map((t) => t.term));
        }
        if (audit.uncoveredSoundAlikePairs.length > 0) {
            console.error("  Uncovered Sound-Alikes:", audit.uncoveredSoundAlikePairs.map((p) => p.id));
        }
    }
});

console.log("\nCurriculum generation complete.");
