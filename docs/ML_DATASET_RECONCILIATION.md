# PRODECHX — ML Dataset Reconciliation Report

> **Document Version:** 1.0.0  
> **Author:** Lead Data Architect, PRODECHX  
> **Date:** August 24, 2026

---

## 1. Dataset Reconciliation Table

Reconciling original PDF extraction counts, verified database `project_updates` records, and ML observation counts:

| Report Month | PDF Table 6 Extracted Rows | Verified Database `project_updates` | Initial Scratch ML Observations | Reconciled ML Observations | Discrepancy / Explanation |
|---|---:|---:|---:|---:|---|
| **April 2026** | 1,981 | 1,981 | 2,002 | **1,981** | +21 rows in initial scratch parser caused by multi-page table header string matches. Reconciled to exact 1,981 database records. |
| **May 2026** | 1,987 | 1,987 | 1,991 | **1,987** | +4 rows in initial scratch parser caused by sector subtotal rows. Reconciled to exact 1,987 database records. |
| **June 2026** | 1,847 | 1,847 | 1,946 | **1,847** | +99 rows in initial scratch parser caused by Ministry section breaks. Reconciled to exact 1,847 database records. |
| **TOTALS** | **5,815** | **5,815** | **5,939** | **5,815** | **100% RECONCILED MATCH (0 DISCREPANCY)** |

---

## 2. Project Master Resolution

- **Total Monthly Observations**: **5,815 records**
- **Unique Project Codes**: **2,231 unique infrastructure projects**
- **Idempotency & Uniqueness**: `UNIQUE(project_id, report_year, report_month)` verified with 0 duplicate rows across all 3 months.
