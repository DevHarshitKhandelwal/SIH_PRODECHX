# PRODECHX — PAIMANA Data Extraction Mapping Matrix

> **Document Version:** 2.0.0  
> **Author:** Lead Data Architect & Engineer, PRODECHX  
> **Date:** August 24, 2026

---

## 1. Overview & Transformation Pipeline

This document defines the exact field-level mapping from raw PAIMANA PDF locations to normalized PostgreSQL database fields and target tables in the PRODECHX platform.

```text
+-----------------------+     +------------------------+     +-------------------------+
|  PAIMANA PDF Location | --> | Extraction & Parsing   | --> | Destination DB Field &  |
|  (Page & Table Grid)  |     | Transformation Rule    |     | Target Table            |
+-----------------------+     +------------------------+     +-------------------------+
```

---

## 2. Table 6 Full Register Mapping Matrix

| Source PDF Location | Source PAIMANA Label | Normalized Database Field | Data Type | Transformation & Extraction Rule | Validation & Constraints | Destination Table |
|---|---|---|---|---|---|---|
| Col 0 | `Sl.No` | `serial_number` | INT | Parse integer. Mandatory. | Sequential `1` to `1981` (April). | `project_updates` |
| Col 1, Line 1 | `Project Name` | `project_name` | VARCHAR(500) | Trim whitespace. | Length 3–500 chars. | `projects` |
| Col 1, Line 2 | `(Agency)` | `agency_name` | VARCHAR(255) | Extract string from parens below project name. | Max 255 chars. Lookup `agencies`. | `projects`, `agencies` |
| Col 1, Line 3 | `(Project Code)` | `project_code` | VARCHAR(50) | Extract 6-digit numeric string inside parens. | Mandatory 6-digit ID (`\d{6}`). | `projects` |
| Col 1, Line 4 | `(Legacy OCMS Code)` | `legacy_ocms_code` | VARCHAR(50) | Extract text inside parens. **NULL if `-` or omitted**. | Alphanumeric max 20 chars. | `projects` |
| Col 1, Line 5 | `(PMGID)` | `pmgid` | VARCHAR(50) | Extract integer code. **NULL if `-` or omitted**. | Numeric string. | `projects` |
| Section Banner | `Ministry` | `ministry_id` | UUID | Extract from bold section banner above table block. | Mandatory FK to `ministries.id`. | `projects`, `ministries` |
| Sector Header | `Sector` | `sector_id` | UUID | Extract from HML sector header block. | Mandatory FK to `sectors.id`. | `projects`, `sectors` |
| Col 2 | `State` | `state_name` | VARCHAR(100) | Standardize State/UT string or `Multi-State`. | Max 100 chars. | `projects` |
| Col 3, Line 1 | `Date of Approval` | `date_of_approval` | DATE | Parse `MM/YYYY` -> `YYYY-MM-01`. | Valid date format. | `projects` |
| Col 3, Line 2 | `(Start Date)` | `original_start_date` | DATE | Parse `(MM/YYYY)` -> `YYYY-MM-01`. | Valid date format. | `projects` |
| Col 4, Line 1 | `Original DoC` | `original_doc` | DATE | Parse `MM/YYYY` -> `YYYY-MM-01`. Target DoC. | Valid date format. | `projects` |
| Col 4, Line 2 | `(Revised DoC)` | `revised_doc` | DATE | Parse `(MM/YYYY)` -> `YYYY-MM-01`. **NULL if `(-)`**. | Valid date format. | `project_updates` |
| Col 5, Line 1 | `Original Cost` | `original_cost` | DECIMAL(15,2) | Convert numeric string in Rs. Crore. | Positive float > 0.00. | `projects` |
| Col 5, Line 2 | `(Revised Cost)` | `revised_cost` | DECIMAL(15,2) | Convert numeric string. **NULL if `(-)`**. May be `< original_cost`. | Float or NULL. | `project_updates` |
| Col 6 | `Cumulative Exp.` | `cumulative_expenditure` | DECIMAL(15,2) | Convert numeric string in Rs. Crore. | Float >= 0.00. | `project_updates` |
| Col 7 | `Physical Progress (%)` | `physical_progress_pct` | DECIMAL(5,2) | Strip `%` symbol, convert to float. | Float between 0.00 and 100.00. | `project_updates` |
| PDF Header | Report Month/Year | `report_month`, `report_year` | INT, INT | Extract from PDF metadata & cover page. | Month 1–12, Year 2000–2100. | `project_updates`, `documents` |
