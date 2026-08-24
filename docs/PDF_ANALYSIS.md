# PRODECHX — PAIMANA PDF Analysis & Discovery Report

> **Document Version:** 1.0.0  
> **Author:** Lead Data Architect & Engineer, PRODECHX  
> **Date:** August 24, 2026  
> **Files Inspected:**  
> - `d:/SIH/data/paimana-pdfs/FlashReport_April2026.pdf` (3,215,216 bytes, 164 pages)  
> - `d:/SIH/data/paimana-pdfs/FlashReport_May2026.pdf` (3,217,996 bytes, 164 pages)  
> - `d:/SIH/data/paimana-pdfs/FlashReport_June_2026.pdf` (6,540,236 bytes, 162 pages)

---

## Executive Technical Summary

An exhaustive automated and structural analysis was performed across all three monthly PAIMANA Flash Report PDFs supplied by MoSPI. 

Key empirical findings:
1. **100% Extractable Digital Vector Text**: All body text, tabular structures, headers, project codes, costs, and progress metrics are digital vector text. Zero body pages are pure scanned raster images.
2. **Project Portfolio Size**:
   - **April 2026**: 812 unique project records extracted from Table 6.
   - **May 2026**: 808 unique project records extracted from Table 6.
   - **June 2026**: 772 unique project records extracted from Table 6.
3. **Cross-Month Continuity & Identity**:
   - **631 projects** appear continuously in all three monthly reports.
   - **May 2026** recorded 134 newly added projects and 138 dropped/completed projects relative to April.
   - **June 2026** recorded 110 newly added projects and 146 dropped/completed projects relative to May.
4. **Identifier Formatting Anomaly**:
   - `Project Code` (6-digit numeric ID) is present for 100% of projects across all months.
   - `Legacy OCMS Code` and `PMGID` are present in April (509 legacy codes, 517 PMGIDs) and May (478 legacy codes, 497 PMGIDs), but were **omitted or defaulted to `-`** in June 2026.

---

## Detailed Analysis of the 24 Discovery Requirements

### 1. PDF Structure
The PAIMANA Flash Reports are web-generated monthly intelligence documents published by MoSPI based on project updates entered by Line Ministries into the India Investment Grid / IPM portal (`indiainvestmentgrid.gov.in`). 

Each document follows a strict 5-part hierarchical organization:
- **Part I: Cover & Contents** (Pages 1–2): Executive title, PAIMANA portal QR code/URL (`https://paimana-proj.mospi.gov.in`), and Table of Contents with page references.
- **Part II: Executive Overview & Visual Aggregates** (Pages 3–5): National high-level KPIs, doughnut charts (Sectoral & Ministry comparisons), and mega/major project breakdowns.
- **Part III: Regional Focus & HML Sectors** (Pages 6–14): Special Focus on North Eastern Region (Pages 6–7) followed by Harmonized Master List (HML) 2022 categories (Transport & Logistics, Energy, Water & Sanitation, Communication, Social & Commercial, Other Sectors).
- **Part IV: Major Infrastructure Central Ministries** (Pages 15–21): Dedicated single-page briefs for top line ministries (Road Transport & Highways, Railways, Coal, Petroleum & Natural Gas, Power) with top 5 monitored ongoing projects tables.
- **Part V: Appendix — List of Tables** (Pages 22–164):
  - **Table 1**: Ministry-wise Ongoing Projects (Pages 23–24)
  - **Table 2**: State-wise Ongoing Projects (Pages 25–33)
  - **Table 3**: Completed Projects During Month (Pages 34–35)
  - **Table 4**: Newly Added Projects (Pages 36–39)
  - **Table 5**: Ongoing Projects of North Eastern Region (Pages 40–53)
  - **Table 6**: All Ongoing Projects (Pages 54–163 in April/May; Pages 68–160 in June)

---

### 2. Number of Pages
- `FlashReport_April2026.pdf`: **164 total pages** (Pages 1–163 contain active text/tables; Page 164 is an empty tail page).
- `FlashReport_May2026.pdf`: **164 total pages** (Pages 1–163 contain active text/tables; Page 164 is an empty tail page).
- `FlashReport_June_2026.pdf`: **162 total pages** (Pages 1–161 contain active text/tables; Page 162 is an empty tail page).

---

### 3. Text-Based vs Scanned / Image Pages
- **Body Pages (Tables 1 to 6, Section IV)**: **100% Digital Vector Text**. All text characters, numbers, and dates are embedded using standard PDF fonts (`Helvetica`, `Arial`, `Times-Roman`). No OCR is needed for tabular data extraction.
- **Executive Overview Pages (Pages 3–7, 16–21)**: Feature graphical charts (doughnut/pie charts, bubble plots, ring charts) rendered as composite vector/bitmap objects. Text legends and outer labels remain extractable text, but pixel-rendered chart segments cannot be parsed via plain text extraction.

---

### 4. Tables Present in the PDFs
The PDFs contain 8 distinct table formats:
1. **Executive Summary KPI Cards** (`April2026.pdf:Page 4`): Overall portfolio count, Original Cost, Revised Cost, Expenditure.
2. **Section IV Top 5 Major Projects Table** (`April2026.pdf:Page 17, 19, 20, 21`): 7 columns (`S.NO.`, `PROJECT ID`, `PROJECT NAME`, `ORIGINAL COST`, `REVISED COST`, `EXPENDITURE`, `PHYSICAL PROGRESS (%)`).
3. **Table 1: Ministry-wise Ongoing Projects** (`April2026.pdf:Page 23-24`): 7 columns (`Sl.No`, `Allocated To`, `Sector`, `Project Count`, `Original Cost`, `Latest Revised Cost`, `Cumulative Expenditure`).
4. **Table 2: State-wise Ongoing Projects** (`April2026.pdf:Page 25-33`): 8 columns (`Sl.No`, `STATE NAME`, `Allocated To`, `Sector`, `Project Count`, `Original Cost`, `Latest Revised Cost`, `Cumulative Expenditure`).
5. **Table 3: Completed Projects During Month** (`April2026.pdf:Page 35`): 10 columns (`Sl.No`, `Project Name`, `Agency`, `Project Code`, `State`, `Date of Approval`, `Start Date`, `Actual Completion Date`, `Original Cost`, `Revised Cost`, `Expenditure`).
6. **Table 4: Newly Added Projects** (`April2026.pdf:Page 37-39`): 8 columns (`Sl.No`, `Project Name`, `Agency`, `Project Code`, `State`, `Date of Approval`, `Target DoC`, `Original Cost`, `Revised Cost`).
7. **Table 5: Ongoing Projects of North Eastern Region** (`April2026.pdf:Page 41-53`): 12 columns (`Sl.No`, `Project Name`, `Agency`, `Project Code`, `State`, `Date of Approval`, `Start Date`, `Original DoC`, `Revised DoC`, `Original Cost`, `Revised Cost`, `Expenditure`, `Physical Progress %`).
8. **Table 6: All Ongoing Projects** (`April2026.pdf:Page 55-163`): Comprehensive 12-column multi-line master project register.

---

### 5. Project Identifiers
Three distinct project codes exist in the PAIMANA schema:
1. **`Project Code` (Primary)**: 6-digit numeric integer (e.g. `615820`, `400144`, `701122`, `611495`). Present in **100% of project entries** across all three months.
2. **`Legacy OCMS Code` (Secondary 1)**: Alphanumeric code (e.g. `N06000290`, `060100093`). Found in 509 projects in April and 478 projects in May. Omitted in June 2026.
3. **`PMGID` (Secondary 2)**: Project Monitoring Group numeric ID (e.g. `9932`, `3122`, `9611`). Found in 517 projects in April and 497 in May. Omitted in June 2026.

---

### 6. Project Name Fields
- Printed as free text on the main project line (`April2026.pdf:Page 55`).
- Examples: `TIKAK EXTENSION OCP`, `BAROUD OC EXPANSION [3.0-10.0M]`, `Development of New Integrated Civil Enclave at Agra Airport`.
- Contains project titles, capacities (`[40 MTY]`, `[1200 MW]`), and phase descriptors.

---

### 7. Ministry Fields
- Printed as bold section banners above project groupings (e.g. `Ministry of Coal`, `Ministry of Railways`, `Ministry of Road Transport & Highways`, `Ministry of Power`).
- Captures the parent Line Ministry responsible for cabinet reporting.

---

### 8. Department / Agency Fields
- Printed in parentheses directly under the Project Name on line 2 (`April2026.pdf:Page 55`).
- Examples: `Airport Authority of India [AAI]`, `South Eastern Coalfields Limited [SECL]`, `NLC India Limited [NLCIL]`, `Power Grid Corporation of India Limited [POWERGRID]`.

---

### 9. Sector Fields
- Derived from HML category headers or Table 1/2 breakdowns.
- Key sectors: `Transport & Logistics`, `Energy`, `Water & Sanitation`, `Communication`, `Social & Commercial`, `Coal`, `Steel`, `Petroleum & Natural Gas`, `Power`, `Railways`, `Roads & Highways`.

---

### 10. Original / Approved Cost Fields
- Printed in column 6 of Table 6 on line 1 (`April2026.pdf:Page 55`).
- Currency unit: **Rs. Crore**.
- Examples: `159.77`, `2310.12`, `1725.04`, `11816.40`.

---

### 11. Revised / Current Cost Fields
- Printed in column 6 of Table 6 on line 2 inside parentheses (`April2026.pdf:Page 55`).
- Currency unit: **Rs. Crore**.
- Examples: `(159.77)`, `(2310.12)`, `(1725.04)`. If unrevised, matches Original Cost.

---

### 12. Expenditure Fields
- `Cumulative Expenditure`: Printed in column 7 of Table 6 (`April2026.pdf:Page 55`).
- Currency unit: **Rs. Crore**. Represents total actual cash outlay to date.
- Examples: `111.47`, `113.83`, `16.71`, `993.79`.

---

### 13. Physical Progress Fields
- `Physical Progress (%)`: Printed in column 8 of Table 6 (`April2026.pdf:Page 55`).
- Unit: Percentage (`0.00%` to `100.00%`).
- Examples: `88.18%`, `11.81%`, `40.34%`, `0.01%`.

---

### 14. Financial Progress Fields
- **NOT directly printed as a column** in the PAIMANA PDFs.
- **DERIVED FIELD**: Calculated by PRODECHX ingestion pipeline as:  
  $$\text{Financial Progress (\%)} = \left(\frac{\text{Cumulative Expenditure}}{\text{Revised Cost}}\right) \times 100$$

---

### 15. Start / Completion Date Fields
- `Date of Approval`: `MM/YYYY` (Line 1 of Date column, e.g. `07/2022`, `11/2022`).
- `Start Date`: `(MM/YYYY)` (Line 2 of Date column in parens, e.g. `(07/2022)`).
- `Original / Target DoC`: `MM/YYYY` (Line 1 of DoC column, e.g. `07/2031`, `03/2029`).
- `Revised DoC`: `(MM/YYYY)` or `(-)` (Line 2 of DoC column in parens, e.g. `(03/2027)` or `(-)`).

---

### 16. Milestone Information
- **CRITICAL DATA GAP**: Individual itemized project milestones (e.g. "Land Acquisition", "Tender Award", "Foundation Work", "Equipment Erection") are **NOT present** in the monthly PAIMANA Flash Report PDFs.
- The PDFs provide only project-level target DoC, revised DoC, and overall physical progress %.

---

### 17. Project Status Fields
- Status is implicitly derived from table placement:
  - Table 6: `Ongoing`
  - Table 3: `Completed`
  - Table 4: `Newly Added`
  - Table 5: `Ongoing (North Eastern Region)`

---

### 18. Monthly Reporting Structure
- Standardized monthly reporting cadence:
  - `April 2026` (Cutoff May 19, 2026)
  - `May 2026` (Cutoff June 19, 2026)
  - `June 2026` (Cutoff July 19, 2026)
- Enables longitudinal tracking across sequential monthly snapshots.

---

### 19. Historical Information Available
- 3 monthly time-series snapshots available in the dataset.
- Enables trajectory tracking for:
  - Physical progress velocity (`% per month`)
  - Expenditure burn rate (`Rs. Crore per month`)
  - Revised DoC schedule slippage (`months pushed per month`)
  - Cost escalation revisions (`Rs. Crore added per month`)

---

### 20. Fields Suitable for Machine Learning
- **ML Features**: `original_cost`, `revised_cost`, `cost_escalation_ratio`, `approved_duration_months`, `time_elapsed_months`, `time_elapsed_pct`, `physical_progress_pct`, `financial_progress_pct`, `physical_financial_gap`, `progress_velocity_3m`, `expenditure_burn_rate`, `sector_code`, `ministry_code`, `agency_code`, `state_code`.
- **ML Targets**: `cost_overrun_flag`, `cost_overrun_pct`, `schedule_delay_flag`, `schedule_delay_months`, `composite_risk_score`.

---

### 21. Fields Suitable for RAG / Document Search
- Raw PDF page text, document title, report month/year, page number, project name, agency name, ministry name, sector, project code, overview text notes, sector comparison text, and executive footnotes.

---

### 22. Fields Requiring OCR
- **0 body pages require OCR for table extraction**.
- OCR is only recommended for:
  - Visual doughnut chart inner text and bubble chart callouts on Overview Pages 3–7.
  - Future scanned document attachments uploaded by project officers.

---

### 23. Fields That Cannot Be Reliably Extracted
1. **Itemized Milestone Schedules**: Not included in PAIMANA Flash Report tables.
2. **Contractor / Vendor Names**: Omitted from PDF tables.
3. **Textual Root Causes for Delays**: Omitted from Table 6 project rows.
4. **June 2026 Legacy Codes & PMGIDs**: Omitted/blanked out (`-`) in the source June PDF.

---

### 24. Duplicate Project Identification Strategy
To handle project continuity across monthly PDFs where Legacy Codes or PMGIDs may be missing (e.g., June 2026), PRODECHX uses a multi-tier matching cascade:

```text
Step 1: Exact Match on `project_code` (Numeric 6-digit ID)
   ↓ (If matched -> Link to existing project_id)
Step 2: Match on `legacy_ocms_code` OR `pmgid`
   ↓ (If matched -> Link to existing project_id)
Step 3: Fuzzy Match on Normalized (`project_name` + `agency_name` + `ministry_name` + `state_name`)
   ↓ (Using Levenshtein distance & Jaro-Winkler similarity >= 0.88)
Step 4: If Similarity between 0.70 and 0.87 or conflicting IDs -> Flag as "REVIEW REQUIRED"
   ↓ (Sends record to Manual Verification Queue in Admin Dashboard)
```
