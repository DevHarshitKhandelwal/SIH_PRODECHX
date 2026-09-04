# PRODECHX — Monthly Project Matching Specification

> **Document Version:** 1.0.0  
> **Author:** Lead Data Architect & Engineer, PRODECHX  
> **Date:** August 24, 2026

---

## 1. Executive Problem Statement

In the MoSPI PAIMANA monthly Flash Reports:
- **April 2026**: 812 ongoing projects
- **May 2026**: 808 ongoing projects
- **June 2026**: 772 ongoing projects

A single infrastructure project spanning multiple monthly reports must remain **one unique record** in the `projects` table, with monthly observations recorded in the `project_updates` table.

---

## 2. Multi-Tier Matching Cascade Architecture

To ensure 100% accurate entity resolution across monthly PDFs (especially when secondary identifiers like Legacy OCMS codes or PMGIDs are omitted, as in June 2026), PRODECHX enforces a 4-tier matching cascade:

```text
               +----------------------------------+
               | Incoming Monthly Project Record  |
               +----------------+-----------------+
                                |
                                v
               +----------------------------------+
               | Step 1: Exact Match on           |
               |         6-Digit project_code     |
               +----------------+-----------------+
                                | (If Match Found -> Link to project_id)
                                v (If No Match)
               +----------------------------------+
               | Step 2: Match on                 |
               |         legacy_ocms_code / PMGID |
               +----------------+-----------------+
                                | (If Match Found -> Link to project_id)
                                v (If No Match)
               +----------------------------------+
               | Step 3: Fuzzy Text Match on      |
               | (Project + Agency + Ministry + State)|
               +----------------+-----------------+
                                |
                 +--------------+--------------+
                 |                             |
                 v (Similarity >= 0.88)        v (Similarity 0.70 - 0.87)
         +---------------+             +-----------------------+
         | Link Project  |             | Manual Review Queue   |
         | Automatically |             | (Review Required)     |
         +---------------+             +-----------------------+
```

---

## 3. Detailed Matching Rules

### Tier 1: Primary Match (`project_code`)
- **Logic**: Query `projects WHERE project_code = incoming_record.project_code`.
- **Confidence**: 100%. `project_code` is a 6-digit numeric identifier assigned by MoSPI and present in 100% of projects across April, May, and June.
- **Action**: Link `project_updates` row to existing `project_id`.

### Tier 2: Secondary Identifiers (`legacy_ocms_code` / `pmgid`)
- **Logic**: Query `projects WHERE legacy_ocms_code = incoming_record.legacy_ocms_code OR pmgid = incoming_record.pmgid`.
- **Confidence**: 99%. Used when `project_code` undergoes rare administrative renumbering.
- **Action**: Link `project_updates` row and update `project_code` cross-reference.

### Tier 3: Normalized Fuzzy Text Matching
- **Composite Key**: `Normalized(project_name)` + `Normalized(agency_name)` + `Normalized(ministry_name)` + `Normalized(state_name)`.
- **Normalization Rules**: Convert to uppercase, strip special characters (`[`, `]`, `(`, `)`), remove standard stopwords (`LIMITED`, `PVT`, `EXPANSION`).
- **Algorithms**: Combined Levenshtein Distance & Jaro-Winkler Similarity Metric.
- **Decision Thresholds**:
  - **Similarity Score >= 0.88**: High confidence match -> Automatically link to `projects.id`.
  - **Similarity Score 0.70 to 0.87**: Moderate confidence -> Flag as `REVIEW_REQUIRED` and route to Admin Queue.
  - **Similarity Score < 0.70**: No match -> Create new `projects` record.

### Tier 4: Manual Review Workflow (`REVIEW_REQUIRED`)
- Records flagged for manual review are held in `documents.processing_status = 'REVIEW_REQUIRED'`.
- Project Officers can inspect side-by-side diffs in the Admin Dashboard and manually confirm or split project identities.
