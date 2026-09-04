# PRODECHX — PAIMANA Data Dictionary

> **Document Version:** 2.0.0  
> **Author:** Lead Data Architect & Engineer, PRODECHX  
> **Date:** August 24, 2026  
> **Source Documents Analyzed:** `FlashReport_April2026.pdf` (163 pages), `FlashReport_May2026.pdf` (163 pages), `FlashReport_June_2026.pdf` (161 pages)

---

## 1. Value Classification Framework

Every field in the PRODECHX platform is categorized into three distinct operational states:

1. **`SOURCE VALUE`**: Extracted directly from official PAIMANA PDF reports without transformation. Preserves raw representation (`NULL` if `-`, exact decimal value even if `revised_cost < original_cost`).
2. **`NORMALIZED VALUE`**: Cleaned, standardized, or type-casted value (e.g. date conversion `07/2022` -> `2022-07-01`, string trimming, uppercase normalization).
3. **`DERIVED VALUE`**: Calculated via deterministic mathematical, temporal, or logic transformations on normalized source fields.

---

## 2. Source Fields (Extracted Directly from PAIMANA PDFs)

| Field Name | Original PAIMANA Label | Data Type | Nullable | Source PDF & Page Ref | Example | Validation & Rule Alignment |
|---|---|---|---|---|---|---|
| `serial_number` | `Sl.No` | Integer | No | `April:P.55 (S.No 1)` | `1` | Sequential integer `1` to `1981` (April), `1987` (May), `1847` (June). |
| `project_code` | `(Project Code)` | String | No | `April:P.55` | `615820` | Mandatory 6-digit numeric ID. Primary project match key. |
| `legacy_ocms_code` | `(Legacy OCMS Code)` | String | Yes | `April:P.55`, `June:P.68` | `N06000290` | Alphanumeric code. Stored as `NULL` if `-` or omitted (June). |
| `pmgid` | `(PMGID)` | String | Yes | `April:P.55`, `June:P.68` | `9932` | Numeric PMGID integer. Stored as `NULL` if `-` or omitted (June). |
| `project_name` | `Project Name` | Text | No | `April:P.55` | `TIKAK EXTENSION OCP` | Mandatory string length 3–500 chars. |
| `agency_name` | `(Agency)` | String | Yes | `April:P.55` | `SECL` | Implementing PSU/Agency extracted from parens below project name. |
| `ministry_name` | `Ministry` | String | No | `April:P.16`, `P.55` | `Ministry of Coal` | Standardized Line Ministry section header string. |
| `sector_name` | `Sector` | String | No | `April:P.24`, `P.55` | `Coal` | Standardized Harmonized Master List (HML) sector string. |
| `state_name` | `State` | String | Yes | `April:P.25`, `P.55` | `Assam` | Standardized Indian State/UT name or `Multi-State`. |
| `original_cost` | `Original Cost` | Decimal(15,2) | No | `April:P.55` | `159.77` | Sanctioned cost in Rs. Crore. Positive float > 0.00. |
| `revised_cost` | `Revised Cost` | Decimal(15,2) | Yes | `April:P.55` | `2310.12` | Current cost in Rs. Crore. **Stored as `NULL` if `-`**. May be `< original_cost`. |
| `cumulative_expenditure` | `Cumulative Exp.` | Decimal(15,2) | No | `April:P.55` | `111.47` | Actual money spent in Rs. Crore. Float >= 0.00. |
| `physical_progress_pct` | `Physical Progress (%)` | Decimal(5,2) | No | `April:P.55` | `88.18` | Completion percentage. Float between `0.00` and `100.00`. |
| `date_of_approval` | `Date of Approval` | Date | Yes | `April:P.55` | `2022-07-01` | Approval date (`MM/YYYY` converted to `YYYY-MM-01`). |
| `start_date` | `(Start Date)` | Date | Yes | `April:P.55` | `2022-07-01` | Actual/scheduled start date. |
| `original_doc` | `Original DoC` | Date | Yes | `April:P.55` | `2031-07-01` | Target completion date. |
| `revised_doc` | `(Revised DoC)` | Date | Yes | `April:P.55` | `2027-03-01` | Revised completion date (`NULL` if `(-)`). |
| `report_month` | `Report Month` | Integer | No | PDF Header | `4` | Month integer `1` to `12`. |
| `report_year` | `Report Year` | Integer | No | PDF Header | `2026` | Year integer `2000` to `2100`. |

---

## 3. Derived Fields (Calculated Deterministically)

| Field Name | Data Type | Formula / Logic | Description |
|---|---|---|---|
| `cost_overrun_amount` | Decimal(15,2) | `GREATEST(0, COALESCE(revised_cost, original_cost) - original_cost)` | Absolute cost escalation in Rs. Crore over original sanction. |
| `cost_overrun_pct` | Decimal(5,2) | `((COALESCE(revised_cost, original_cost) - original_cost) / original_cost) * 100` | Percentage cost growth relative to original cost. |
| `financial_progress_pct` | Decimal(5,2) | `(cumulative_expenditure / COALESCE(revised_cost, original_cost)) * 100` | Financial progress % based on expenditure vs current cost. |
| `schedule_delay_months` | Integer | `MONTHS_BETWEEN(COALESCE(revised_doc, original_doc), original_doc)` | Schedule slippage in months beyond target DoC. |
| `physical_financial_gap` | Decimal(5,2) | `financial_progress_pct - physical_progress_pct` | Progress-expenditure decoupling metric. |
| `monthly_progress_velocity` | Decimal(5,2) | `(physical_progress_t2 - physical_progress_t1) / delta_months` | Physical progress velocity % per month across reports. |
| `data_quality_score` | Integer | `100 - (missing_penalties + logic_penalties)` | Quality score (0–100) reflecting data integrity. |

---

## 4. Operational Cost Rules & Edge Case Alignment

1. **Revised Cost Displayed as `-`**:
   - Source Rule: When PAIMANA displays `-`, `source_revised_cost` is stored as `NULL`.
   - Normalization Rule: `original_cost` is **never substituted** into `source_revised_cost`.
   - Calculation Rule: For derived metrics (`cost_overrun_amount`, `financial_progress_pct`), `COALESCE(revised_cost, original_cost)` is used in derived formulas without altering raw source data.

2. **Revised Cost Less Than Original Cost (`revised_cost < original_cost`)**:
   - Source Rule: Preserved exactly as printed in the PDF (e.g. Original `861.06` Cr, Revised `625.40` Cr).
   - Validation Rule: Generates `DATA_QUALITY_WARNING` (Category: `APPROVED_COST_REDUCTION`), but row is **valid and retained**.
