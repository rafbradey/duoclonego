# Reference Audit and Citation Cascading Report: LASA-Quest Thesis Revisions

**Document Evaluated:** `LASA_QUEST_PROPOSED_THESIS_REVISIONS.docx`  
**Audited Output Deliverable:** `LASA_QUEST_PROPOSED_THESIS_REVISIONS_REFERENCES_AUDITED.docx`  
**Target Manuscript:** `CNS-PROPOSAL-THESIS-DOCUMENT-1.docx` (Baseline Proposal)  
**Audit Standard:** Strict Publication Date $\ge 2020$, IEEE Numbered Citation by First Appearance, Empirical Claim-Source Alignment, Zero Hallucination Policy  
**Date of Audit:** October 4, 2026  

---

## Executive Summary

An exhaustive academic reference audit was conducted on the proposed revisions for the undergraduate pharmacy thesis **"LASA-Quest: A Gamified Learning Web Application for Look-Alike, Sound-Alike Medication Safety"**. 

The audit identified critical bibliographic issues in the unverified draft of the revisions document:
1. **Duplicate and Corrupted Citation ([38]):** M. Shortt et al. (2023) was already included in the baseline thesis as Reference `[13]`. The entry introduced at `[38]` corrupted the author list and title, creating a redundant entry.
2. **Fabricated Source Records ([40], [46], [51]):** 
   - Entry `[40]` attributed a non-existent systematic review in *Computers & Education* with fake DOI `10.1016/j.compedu.2021.104231` to Dehghanzadeh et al.
   - Entry `[46]` attributed an altered title to Van Roy & Zaman with a DOI (`10.1016/j.compedu.2019.103693`) that actually belongs to an unrelated paper on MOOCs by S. R. Lambert.
   - Entry `[51]` fabricated a non-existent publication by N. Zagalo in *Journal of Healthcare Informatics*.
3. **Outdated Pre-2020 Publications ([42], [43], [47], [50]):**
   - Entry `[42]` (M. Kapur, 2016) was published prior to 2020.
   - Entry `[43]` (R. S. J. d. Baker et al., 2006) was published prior to 2020.
   - Entry `[47]` (R. N. Landers et al., 2018) was published in 2018; its year had been artificially altered to 2021.
   - Entry `[50]` (J. E. Driskell et al., 2018) was published prior to 2020 and was completely uncited in the body text.
4. **Distorted Bibliographic Metadata ([39]):** Entry `[39]` (S. Bai et al., 2020) listed incorrect co-authors ("C. Shen, and J. Guan" instead of K. F. Hew and B. Huang) and an incorrect DOI (`10.1016/j.edurev.2020.100346` instead of `10.1016/j.edurev.2020.100322`).
5. **IEEE Citation Ordering Violations:** In-text citations appeared out of sequential order (e.g., `[43]` before `[42]`, `[49]` before `[44]`), violating IEEE standards.

All issues have been resolved. Pre-2020 and fabricated references were replaced with verified peer-reviewed publications ($\ge 2020$), Shortt et al. was consolidated into baseline citation `[13]`, all citations were reordered sequentially from `[38]` to `[46]`, and quantitative findings were aligned strictly with primary empirical sources.

---

## A. Complete Reference Audit Table

| Original Ref. | Original Source Listed | Verification Status | Verified Year | Issue Identified | Action Taken | Primary Evidence URL / DOI |
| :---: | :--- | :---: | :---: | :--- | :--- | :--- |
| **[38]** | M. Shortt, S. Tilak, G. Czarnota, and M. Glassman (2023) | **Duplicate / Corrupted** | 2023 | Redundant with existing baseline Reference `[13]`; hallucinated co-authors and altered title. | Removed duplicate entry; mapped in-text mentions directly to baseline `[13]`. | [DOI: 10.1080/09588221.2021.1933540](https://doi.org/10.1080/09588221.2021.1933540) |
| **[39]** | S. Bai, C. Shen, and J. Guan (2020) | **Corrupted Record** | 2020 | Corrupted co-authors ("Shen, Guan"), distorted title, and incorrect DOI (`100346`). | Corrected to genuine record: S. T. Bai, K. F. Hew, and B. Huang. Renumbered to **[38]**. | [DOI: 10.1016/j.edurev.2020.100322](https://doi.org/10.1016/j.edurev.2020.100322) |
| **[40]** | H. Dehghanzadeh et al., *Computers & Education* (2021) | **Fabricated Record** | N/A | Title, journal, and DOI (`10.1016/j.compedu.2021.104231`) are fabricated. | Removed fabricated entry; claim supported by verified Sailer & Homner (2020) meta-analysis. | N/A (Fabricated DOI string) |
| **[41]** | M. Sailer and L. Homner, *Educational Psychology Review* (2020) | **Verified** | 2020 | Genuine meta-analysis on 14 gamification elements across cognitive, motivational, and behavioral outcomes. | Retained; renumbered to **[39]** following first appearance. | [DOI: 10.1007/s10648-019-09498-w](https://doi.org/10.1007/s10648-019-09498-w) |
| **[42]** | M. Kapur, *Educational Psychologist* (2016) | **Outdated (< 2020)** | 2016 | Fails $\ge 2020$ date requirement. | Replaced with Sinha & Kapur (2021) meta-analysis in *Review of Educational Research*. Renumbered to **[41]**. | [DOI: 10.3102/00346543211019105](https://doi.org/10.3102/00346543211019105) |
| **[43]** | R. S. J. d. Baker et al., *ITS Conference* (2006) | **Outdated (< 2020)** | 2006 | Fails $\ge 2020$ date requirement. | Replaced with S. L. Wise (2020) on rapid guessing and test disengagement. Renumbered to **[40]**. | [DOI: 10.1080/13803611.2021.1963942](https://doi.org/10.1080/13803611.2021.1963942) |
| **[44]** | Z. Zainuddin, S. K. W. Chu, M. Shujahat, and C. J. Perera (2020) | **Verified** | 2020 | Genuine systematic review of empirical evidence in *Educational Research Review*. | Retained; renumbered to **[44]** by order of first appearance. | [DOI: 10.1016/j.edurev.2020.100326](https://doi.org/10.1016/j.edurev.2020.100326) |
| **[45]** | A. Latimier, H. Peyre, and F. Ramus (2021) | **Verified** | 2021 | Genuine meta-analysis on spaced retrieval practice episodes in *Educational Psychology Review*. | Retained; renumbered to **[45]** by order of first appearance. | [DOI: 10.1007/s10648-020-09572-8](https://doi.org/10.1007/s10648-020-09572-8) |
| **[46]** | R. Van Roy and B. Zaman, *Computers & Education* (2020) | **Fabricated Record** | N/A | Title altered; DOI (`10.1016/j.compedu.2019.103693`) belongs to S. R. Lambert on MOOCs. | Replaced with R. M. Ryan & E. L. Deci (2020) in *Contemporary Educational Psychology*. Renumbered to **[46]**. | [DOI: 10.1016/j.cedpsych.2020.101860](https://doi.org/10.1016/j.cedpsych.2020.101860) |
| **[47]** | R. N. Landers, E. M. Auer, A. B. Collmus, and M. B. Armstrong (2021) | **Outdated (< 2020)** | 2018 | Originally published in 2018 (Vol. 49, No. 4); year was artificially changed to 2021. | Removed. Claim reframed as researchers' deliberate goal-setting design choice; supported by Bai et al. and Sailer & Homner. | [DOI: 10.1177/1046878118774385](https://doi.org/10.1177/1046878118774385) |
| **[48]** | Institute for Safe Medication Practices (ISMP) (2023) | **Verified** | 2023 | Verified against primary PDF in repository (`agents/research/sources/ISMP_ConfusedDrugNames_2023.pdf`). | Retained; standardized official publication title. Renumbered to **[43]**. | [ISMP List Resource](https://www.ismp.org/resources/special-edition-ismp-list-confused-drug-names) |
| **[49]** | T. R. Guskey, *Get Set, GO! Creating Successful Grading Systems* (2020) | **Verified** | 2020 | Genuine book on criterion-referenced assessment and grading reform by Solution Tree Press. | Retained; renumbered to **[42]** by order of first appearance. | [ISBN: 978-1-949539-45-5](https://www.solutiontree.com/get-set-go.html) |
| **[50]** | J. E. Driskell, R. P. Willis, and C. Copper (2018) | **Outdated (< 2020) & Uncited** | 2018 | Published in 2018; completely uncited in the body of the revisions document. | Removed. Spaced retrieval and retention claims are fully supported by Latimier et al. (2021). | [DOI: 10.3389/fpsyg.2018.01935](https://doi.org/10.3389/fpsyg.2018.01935) |
| **[51]** | N. Zagalo, A. Veloso, and L. Costa, *J. Healthcare Informatics* (2021) | **Fabricated & Uncited** | N/A | Article and journal volume details do not exist; completely uncited in body text. | Removed. | N/A (Fabricated Record) |

---

## B. Replacement Source Records

The following verified publications replace outdated or fabricated entries:

### 1. Replacement for [43] (Baker et al., 2006): S. L. Wise (2020)
* **Full Citation:** S. L. Wise, "Six insights regarding test-taking disengagement," *Educational Research and Evaluation*, vol. 26, no. 5–6, pp. 328–338, 2020.
* **DOI:** [10.1080/13803611.2021.1963942](https://doi.org/10.1080/13803611.2021.1963942)
* **Publication Year:** 2020 (Verified)
* **Audited Citation Number:** `[40]`
* **Thesis Claim Supported:** Demonstrates that in digital multiple-choice testing/learning environments where items lack consequences, accountability, or stakes, learners frequently engage in "rapid guessing"—rapidly clicking through options without cognitive processing. This supports LASA-Quest's justification for maintaining meaningful stakes (heart deduction) while avoiding destructive session aborts.

### 2. Replacement for [42] (M. Kapur, 2016): T. Sinha & M. Kapur (2021)
* **Full Citation:** T. Sinha and M. Kapur, "When problem solving followed by instruction works: Evidence for productive failure," *Review of Educational Research*, vol. 91, no. 5, pp. 761–798, Oct. 2021.
* **DOI:** [10.3102/00346543211019105](https://doi.org/10.3102/00346543211019105)
* **Publication Year:** 2021 (Verified)
* **Audited Citation Number:** `[41]`
* **Thesis Claim Supported:** Comprehensive meta-analysis of 53 empirical research studies (166 comparisons, $N > 12,000$), demonstrating that problem-solving designs that allow initial struggle and failure prior to formal instruction significantly enhance conceptual understanding and transfer (Hedges' $g = 0.36$ to $0.58$). This directly supports LASA-Quest's non-punitive Explanatory Feedback Drawer deployed immediately upon an error.

### 3. Replacement for [46] (Van Roy & Zaman, Fabricated Record): R. M. Ryan & E. L. Deci (2020)
* **Full Citation:** R. M. Ryan and E. L. Deci, "Intrinsic and extrinsic motivation from a self-determination theory perspective: Definitions, theory, practices, and future directions," *Contemporary Educational Psychology*, vol. 61, p. 101860, Apr. 2020.
* **DOI:** [10.1016/j.cedpsych.2020.101860](https://doi.org/10.1016/j.cedpsych.2020.101860)
* **Publication Year:** 2020 (Verified)
* **Audited Citation Number:** `[46]`
* **Thesis Claim Supported:** Authoritative theoretical synthesis of Self-Determination Theory (SDT) in educational contexts, proving that extrinsic incentives (such as virtual diamonds and cosmetic shop themes) support intrinsic motivation when structured informationally to reinforce competence, rather than controlling access to the learning activity itself.

---

## C. Cascading Citation Mapping (Old to New)

The table below provides the full mapping of reference numbering from the unverified draft to the audited thesis manuscript:

| Old Revision Ref. | Author(s) & Year | New Audited Ref. | Final Verified Source | Action / Reason for Cascading Change |
| :---: | :--- | :---: | :--- | :--- |
| **[38]** | Shortt et al. (2023) | **[13]** | M. Shortt, S. Tilak, I. Kuznetcova, B. Martens, and B. Akinkuolie (2023) | **Consolidated to Baseline Ref.** Already present as `[13]` in baseline thesis. Removed duplicate. |
| **[39]** | Bai, Shen, & Guan (2020) | **[38]** | S. T. Bai, K. F. Hew, and B. Huang (2020) | **Cascaded to [38].** Corrected author names, article title, and DOI. |
| **[40]** | Dehghanzadeh et al. (2021) | — | *Removed* | **Eliminated.** Fabricated publication and DOI. |
| **[41]** | Sailer & Homner (2020) | **[39]** | M. Sailer and L. Homner (2020) | **Cascaded to [39].** Verified meta-analysis. |
| **[42]** | Kapur (2016) | **[41]** | T. Sinha and M. Kapur (2021) | **Replaced.** Outdated 2016 source replaced with verified 2021 meta-analysis. |
| **[43]** | Baker et al. (2006) | **[40]** | S. L. Wise (2020) | **Replaced.** Outdated 2006 source replaced with verified 2020 study on rapid guessing. |
| **[44]** | Zainuddin et al. (2020) | **[44]** | Z. Zainuddin, S. K. W. Chu, M. Shujahat, and C. J. Perera (2020) | **Retained as [44].** Verified systematic review. |
| **[45]** | Latimier et al. (2021) | **[45]** | A. Latimier, H. Peyre, and F. Ramus (2021) | **Retained as [45].** Verified meta-analysis. |
| **[46]** | Van Roy & Zaman (2020) | **[46]** | R. M. Ryan and E. L. Deci (2020) | **Replaced.** Corrupted entry replaced with foundational 2020 SDT review. |
| **[47]** | Landers et al. (2021) | — | *Removed* | **Eliminated.** Outdated 2018 paper misdated as 2021. Recontextualized as design choice. |
| **[48]** | ISMP (2023) | **[43]** | Institute for Safe Medication Practices (ISMP) (2023) | **Cascaded to [43].** Verified official List of Confused Drug Names (Feb. 2023). |
| **[49]** | Guskey (2020) | **[42]** | T. R. Guskey (2020) | **Cascaded to [42].** Verified grading book; moved ahead of ISMP due to earlier text citation. |
| **[50]** | Driskell et al. (2018) | — | *Removed* | **Eliminated.** Outdated 2018 paper; completely uncited in text body. |
| **[51]** | Zagalo et al. (2021) | — | *Removed* | **Eliminated.** Fabricated source; completely uncited in text body. |

---

## D. Citation Consistency and Text-Verification Audit

### 1. Order-of-Appearance Verification
A programmatic scan of `LASA_QUEST_PROPOSED_THESIS_REVISIONS_REFERENCES_AUDITED.docx` confirmed the strict sequential appearance of in-text citations:
* **Paragraph 11:** Citations to Shortt et al. cite existing baseline reference `[13]`.
* **Paragraph 12:** First appearance of newly added references begins with Bai, Hew, and Huang `[38]`, followed by Sailer and Homner `[39]`.
* **Paragraph 13:** First appearance of Wise on rapid guessing `[40]`, followed by Sinha and Kapur on productive failure `[41]`.
* **Paragraph 15:** First appearance of Guskey on mastery grading `[42]`.
* **Paragraph 16:** Reference to commercial heart gating cites baseline reference `[13]`.
* **Paragraph 18:** First appearance of ISMP clinical standard `[43]`.
* **Paragraph 21:** Second appearance of Guskey `[42]`.
* **Paragraph 22:** First appearance of Zainuddin et al. `[44]`, Latimier et al. `[45]`, and Ryan and Deci `[46]`.
* **Table 3.1:** References ISMP `[43]` (Row 1) and Guskey `[42]` (Row 2).

**Sequential First Appearance Sequence:** `[13, 38, 39, 40, 41, 42, 43, 44, 45, 46]`  
**Result:** **100% Sequential IEEE Compliance.** Zero out-of-order occurrences.

### 2. Resolution of Uncited Entries and Mismatches
* All uncited entries (`[50]` and `[51]` from the draft) have been permanently removed.
* Every entry in the audited reference list (`[38]` through `[46]`) corresponds to at least one active in-text citation in Chapter 2, Chapter 3, or Table 3.1.
* Zero citation gaps exist: the list contains exactly 9 new references, numbered sequentially 38, 39, 40, 41, 42, 43, 44, 45, 46.

### 3. Empirical Claim Discipline & Project Scope Alignment
* **Removal of Fabricated Effect Sizes:** The unverified draft claimed that Bai et al. reported penalty elements having effect sizes of "$g = -0.08$ to $0.12$" and visual indicators having "$g = 0.61$". In the audited text, these unverified numbers have been removed. The text accurately reports Bai et al.'s verified overall effect size of $g = 0.504$ and their qualitative findings regarding student frustration with rigid penalty mechanics.
* **Separation of Evidence from Design Decisions:** The 4-tier Error-Count system and the Platinum tier are explicitly described as **researcher design choices** for LASA-Quest, motivated by the ISMP zero-error clinical safety target, rather than misrepresenting them as universal empirical standards.
* **Preservation of Thesis Classifications:** LASA-Quest is strictly defined as a supplementary, gamified micro-learning practice tool for undergraduate pharmacy students learning LASA drug pairs. All references to comprehensive courseware, LMS systems, leaderboards, and clinical prescription writing are excluded.

---

## E. Final Audited Reference List (IEEE Format)

The following entries are appended to the References section of the thesis manuscript following baseline entry `[37]`:

```text
[38] S. T. Bai, K. F. Hew, and B. Huang, "Does gamification improve student learning outcome? Evidence from a meta-analysis and synthesis of qualitative data in educational contexts," Educational Research Review, vol. 30, p. 100322, Jun. 2020. DOI: 10.1016/j.edurev.2020.100322.

[39] M. Sailer and L. Homner, "The gamification of learning: a meta-analysis," Educational Psychology Review, vol. 32, no. 1, pp. 77–112, Mar. 2020. DOI: 10.1007/s10648-019-09498-w.

[40] S. L. Wise, "Six insights regarding test-taking disengagement," Educational Research and Evaluation, vol. 26, no. 5–6, pp. 328–338, 2020. DOI: 10.1080/13803611.2021.1963942.

[41] T. Sinha and M. Kapur, "When problem solving followed by instruction works: Evidence for productive failure," Review of Educational Research, vol. 91, no. 5, pp. 761–798, Oct. 2021. DOI: 10.3102/00346543211019105.

[42] T. R. Guskey, Get Set, GO! Creating Successful Grading and Reporting Systems, Bloomington, IN: Solution Tree Press, 2020. ISBN: 978-1-949539-45-5.

[43] Institute for Safe Medication Practices (ISMP), "ISMP List of Confused Drug Names," Horsham, PA: ISMP, Feb. 2023. [Online]. Available: https://www.ismp.org/resources/special-edition-ismp-list-confused-drug-names.

[44] Z. Zainuddin, S. K. W. Chu, M. Shujahat, and C. J. Perera, "The impact of gamification on learning and instruction: A systematic review of empirical evidence," Educational Research Review, vol. 30, p. 100326, Jun. 2020. DOI: 10.1016/j.edurev.2020.100326.

[45] A. Latimier, H. Peyre, and F. Ramus, "A meta-analytic review of the benefit of spacing out retrieval practice episodes on retention," Educational Psychology Review, vol. 33, no. 3, pp. 959–987, Sep. 2021. DOI: 10.1007/s10648-020-09572-8.

[46] R. M. Ryan and E. L. Deci, "Intrinsic and extrinsic motivation from a self-determination theory perspective: Definitions, theory, practices, and future directions," Contemporary Educational Psychology, vol. 61, p. 101860, Apr. 2020. DOI: 10.1016/j.cedpsych.2020.101860.
```

---

## F. Final Validation Checklist

- [x] **Strict Date Requirement ($\ge 2020$):** All 9 retained/replacement references possess verified publication dates between 2020 and 2023. Pre-2020 publications have been fully purged.
- [x] **Bibliographic Integrity:** Every author list, article title, journal/publisher, volume, issue, page/article number, and DOI has been cross-checked against primary records (Crossref, publisher portals, and official PDFs).
- [x] **Claim Verification:** Every cited paper directly supports the specific conceptual claim attributed to it in the text.
- [x] **No Fabricated Statistics:** Unverified numerical ranges or effect sizes have been removed; only genuine empirical statistics are cited.
- [x] **IEEE Sequential Numbering:** Numbering strictly reflects the order of first appearance in the manuscript body, from `[38]` to `[46]`.
- [x] **No Uncited Entries / Gaps:** 100% of references in the list are cited in text; 100% of in-text citations resolve to valid entries.
- [x] **Baseline Preservation:** Existing baseline citations (`[1]`–`[37]`) are preserved; Shortt et al. correctly resolves to existing baseline reference `[13]`.
- [x] **Deliverables Saved:** Clean Word revision document generated and saved separately without overwriting original drafts.
