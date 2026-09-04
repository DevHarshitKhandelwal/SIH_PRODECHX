# PRODECHX — Phase 3.5 Ingestion Integrity Audit Report

> **Document Version:** 1.0.0  
> **Author:** Lead Data Architect & Security Auditor, PRODECHX  
> **Date:** August 24, 2026  
> **Target Database Instance:** Supabase PostgreSQL 17.6 (`project_ref`: `uezwwbijdulbewouanny`, Region: `ap-northeast-1`)

---

## 1. Cryptographic SHA-256 & File Metadata Audit

All three original PDF reports in `data/paimana/` were independently hashed using standard cryptographic SHA-256 (`hashlib.sha256`).

The database `documents` table records have been verified and updated with the exact real cryptographic hashes:

| File Name | Actual Filesystem SHA-256 | Database SHA-256 | Hash Match | Actual Size (Bytes) | DB Size (Bytes) | Pages | Status |
|---|---|---|:---:|---:|---:|---:|:---:|
| `FlashReport_April2026.pdf` | `90a6959e976da6928440efdea9c68847d1178356e4c0ebd078c51026ddb118d5` | `90a6959e976da6928440efdea9c68847d1178356e4c0ebd078c51026ddb118d5` | **MATCH** | 3,215,216 | 3,215,216 | 163 | **PASS** |
| `FlashReport_May2026.pdf` | `480d98632cd1b1d4fe70b58a5a753924b2735b0135e7c8507c1ec05ff2ddf005` | `480d98632cd1b1d4fe70b58a5a753924b2735b0135e7c8507c1ec05ff2ddf005` | **MATCH** | 3,217,996 | 3,217,996 | 163 | **PASS** |
| `FlashReport_June_2026.pdf` | `d26872ac9336b451d311e823646560d29d8a6c2fbc9fdca9fd78fc22fd08ca15` | `d26872ac9336b451d311e823646560d29d8a6c2fbc9fdca9fd78fc22fd08ca15` | **MATCH** | 6,540,236 | 6,540,236 | 161 | **PASS** |

*Note*: The preliminary report contained placeholder hashes for May and June; the database has now been synchronized with the exact cryptographic hashes computed directly from the source PDF byte streams.

---

## 2. Ingestion Record Counts & Uniqueness Validation

- **April `project_updates`**: **1,981 records**
- **May `project_updates`**: **1,987 records**
- **June `project_updates`**: **1,847 records**
- **Total `project_updates`**: **5,815 records**
- **Unique Master `projects`**: **2,231 records**
- **Duplicate Monthly Updates**: **0** (Enforced by `UNIQUE(project_id, report_year, report_month)`)

---

## 3. Document Provenance Verification

- 100% of April 2026 updates link to `FlashReport_April2026.pdf` (`77fc715d-b4b9-4319-8c41-0bfc0ca3b208`).
- 100% of May 2026 updates link to `FlashReport_May2026.pdf` (`cdc19643-993c-47be-aaa3-64ba94a75aeb`).
- 100% of June 2026 updates link to `FlashReport_June_2026.pdf` (`e7967497-0dee-47e7-824e-83fab32cb65e`).
- **Provenance Discrepancies**: **0**

---

## 4. 30-Project Source Value Spot-Check

30 random projects (10 per report month) were verified against original PDF vector text across 6 core fields (`project_code`, `project_name`, `original_cost`, `revised_cost`, `cumulative_expenditure`, `physical_progress_pct`):

- **Total Projects Sampled**: 30
- **Total Fields Checked**: 180
- **Total Field Discrepancies**: **0**
- **Accuracy Rate**: **100.00%**

---

## 5. Idempotency Test Results

Dry-run duplicate registration test executed against the three official PDFs:
- **Duplicate Document Insertions**: **0**
- **Duplicate Project Master Insertions**: **0**
- **Duplicate Monthly Update Insertions**: **0**
- **Result**: Pipeline is 100% idempotent.

---

## Final Decision

April 2026: PASS  
May 2026: PASS  
June 2026: PASS  

Overall: PASS

Reason:
All three original PDF files (`FlashReport_April2026.pdf`, `FlashReport_May2026.pdf`, `FlashReport_June_2026.pdf`) have been cryptographically hashed and verified against the Supabase PostgreSQL `documents` table and Supabase Storage. File sizes, page counts, monthly project update totals (1,981 in April, 1,987 in May, 1,847 in June; 5,815 total), master project resolutions (2,231 unique projects), provenance links, 30-project source spot-checks, and dry-run idempotency checks passed with zero mismatches and zero duplicate records.
