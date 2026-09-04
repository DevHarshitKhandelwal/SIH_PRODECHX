# PRODECHX — Data Quality & Validation Engine Specification

> **Document Version:** 2.0.0  
> **Author:** Lead Data Architect & Engineer, PRODECHX  
> **Date:** August 24, 2026

---

## 1. Overview & Validation Rules Alignment

The PRODECHX Data Quality Engine validates raw project observations against empirical PAIMANA report semantics.

---

## 2. Core Validation Rules

| Field / Feature | Target Value State | Rule / Constraint | Penalty Points | Action / Result |
|---|---|---|---|---|
| `project_code` | Source Value | Mandatory 6-digit numeric string (`\d{6}`). Cannot be NULL. | Critical (Fatal) | Reject row to Extraction Log |
| `original_cost` | Source Value | Positive float > 0.00 Rs. Crore. | Critical (Fatal) | Reject row |
| `revised_cost` | Source Value | If PAIMANA displays `-`, store `NULL`. If numeric and `revised_cost < original_cost`, preserve value. | 0 points (Valid) | Store `NULL` or preserve value. Log `INFO` warning if reduced. |
| `cumulative_expenditure` | Source Value | Float >= 0.00 Rs. Crore. | Critical (Fatal) | Reject row if negative |
| `physical_progress_pct` | Source Value | Float between 0.00 and 100.00. | Critical (Fatal) | Reject row if out of range |
| `date_of_approval` | Normalized Value | Date converted to `YYYY-MM-01`. | 10 points | Soft warning if missing |
| `revised_doc` | Source Value | If PAIMANA displays `(-)`, store `NULL`. | 0 points (Valid) | Store `NULL` |
| Progress Velocity | Derived Value | MoM progress decrease > 5% without status note. | 15 points | Flag `PROGRESS_REGRESSION` |

---

## 3. Data Quality Score Formula

$$\text{Data Quality Score} = \max\left(0, 100 - \sum \text{Penalty Points}\right)$$

- **Score 90–100**: `EXCELLENT` — Record passed all automated checks.
- **Score 70–89**: `ACCEPTABLE` — Soft warnings or missing optional dates.
- **Score < 70**: `WARNING / REVIEW REQUIRED` — High defect penalty; routed to audit queue.
