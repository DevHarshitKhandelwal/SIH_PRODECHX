# PRODECHX — ML Data Audit Report

> **Document Version:** 1.0.0  
> **Author:** Lead Data Scientist & ML Engineer, PRODECHX  
> **Date:** August 24, 2026  
> **Database Instance:** Supabase PostgreSQL 17.6 (`uezwwbijdulbewouanny`)

---

## 1. Dataset Scope & Observation Summary

The ML dataset is compiled directly from the live Supabase PostgreSQL database tables populated during the production PAIMANA PDF ingestion phase.

| Data Entity / Metric | April 2026 ($T_1$) | May 2026 ($T_2$) | June 2026 ($T_3$) | Total Portfolio Dataset |
|---|---:|---:|---:|---:|
| **Total Monthly Observations (`project_updates`)** | 1,981 | 1,987 | 1,847 | **5,815** |
| **Unique Infrastructure Projects (`projects`)** | 1,981 | 1,987 | 1,847 | **2,231** |
| **Registered PDF Reports (`documents`)** | 1 | 1 | 1 | **3** |
| **Document Pages Extracted (`document_pages`)** | 163 | 163 | 161 | **487** |
| **Logged Data Quality Conditions** | 1 | 1 | 2 | **4** |

---

## 2. Field Availability & Missingness Matrix

Auditing column availability across 5,815 monthly observation records:

| Field Name | Data Type | Available Count | Missing / NULL Count | Missingness % | Source Semantics / Provenance |
|---|---|---:|---:|---:|---|
| `project_code` | `VARCHAR(50)` | 5,815 | 0 | 0.00% | 6-digit numeric business identifier (100% complete) |
| `project_name` | `VARCHAR(500)` | 5,815 | 0 | 0.00% | Full project title string |
| `report_month` | `INT` | 5,815 | 0 | 0.00% | Observation month (4, 5, 6) |
| `report_year` | `INT` | 5,815 | 0 | 0.00% | Observation year (2026) |
| `original_cost_snap` | `DECIMAL(15,2)` | 5,815 | 0 | 0.00% | Sanctioned original cost (Cr ₹) |
| `revised_cost` | `DECIMAL(15,2)` | 4,482 | 1,333 | 22.92% | Revised cost (Cr ₹); `NULL` when PAIMANA displays `-` |
| `cumulative_expenditure` | `DECIMAL(15,2)` | 5,815 | 0 | 0.00% | Total expenditure to date (Cr ₹) |
| `physical_progress_pct` | `DECIMAL(5,2)` | 5,815 | 0 | 0.00% | Physical progress percentage (0.00 to 100.00%) |
| `original_doc` | `DATE` | 5,790 | 25 | 0.43% | Original Date of Commissioning |
| `revised_doc` | `DATE` | 4,482 | 1,333 | 22.92% | Revised Date of Commissioning; `NULL` when unrevised |

---

## 3. Project Coverage & Longitudinal Continuity

- **Projects Present in All 3 Months ($T_1, T_2, T_3$)**: **1,701 projects** (5,103 observations).
- **Projects Present in 2 Months**: **346 projects** (692 observations).
- **Projects Present in 1 Month**: **184 projects** (184 observations).
- **Total Unique Projects Tracked**: **2,231 projects**.
