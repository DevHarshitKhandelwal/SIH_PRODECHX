# PRODECHX — ML Target & Feature Leakage Audit Report

> **Document Version:** 1.0.0  
> **Author:** Lead Data Architect & Machine Learning Quality Auditor, PRODECHX  
> **Date:** August 24, 2026

---

## 1. Executive Leakage Finding & Root Cause Analysis

> [!CAUTION]
> **CRITICAL LEAKAGE DETECTED IN INITIAL PROTOTYPE**  
> In the preliminary prototype model, `revised_cost_ratio` achieved a SHAP importance value of **4.9958** and near-perfect out-of-sample metrics (ROC-AUC 1.0000).  
> **Root Cause**: `revised_cost_ratio` ($\text{revised\_cost} / \text{original\_cost\_snap}$) was included as an input feature $X(T)$ while `target_cost_overrun_binary` was defined as $\text{revised\_cost} > \text{original\_cost\_snap}$.  
> Because `revised_cost` directly defines the target numerator, including any derivative of `revised_cost` in the input feature matrix at prediction time $T$ allowed the model to observe the target outcome directly.

---

## 2. Comprehensive Feature Leakage Classification

Every candidate feature was audited for timestamp availability and target proxy risk:

| Feature Name | Source Column | Feature Availability | Target Proxy Risk | Audit Classification | Action Taken |
|---|---|---|---|:---:|---|
| **`revised_cost`** | `project_updates.revised_cost` | At Revision ($T$) | Direct Target Definition | **LEAKAGE** | **PURGED FROM FEATURE SET** |
| **`revised_cost_ratio`** | Derived ($\text{revised\_cost}/\text{original}$) | At Revision ($T$) | Direct Target Proxy | **LEAKAGE** | **PURGED FROM FEATURE SET** |
| **`cost_growth_pct`** | Derived ($\Delta \text{cost} / \text{original}$) | At Revision ($T$) | Direct Target Proxy | **LEAKAGE** | **PURGED FROM FEATURE SET** |
| **`has_revised_cost`** | Derived (`revised_cost` NOT NULL) | At Revision ($T$) | Target Escalation Proxy | **LEAKAGE** | **PURGED FROM FEATURE SET** |
| **`approved_cost_reduction_flag`** | Derived ($\text{revised} < \text{original}$) | At Revision ($T$) | Negative Overrun Proxy | **LEAKAGE** | **PURGED FROM FEATURE SET** |
| **`original_cost_log`** | `projects.original_cost` | At Sanction ($T_0$) | None | **SAFE** | **RETAINED** |
| **`expenditure_ratio`** | `project_updates.cumulative_expenditure` | At Month $T$ | None | **SAFE** | **RETAINED** |
| **`physical_progress_pct`** | `project_updates.physical_progress_pct` | At Month $T$ | None | **SAFE** | **RETAINED** |
| **`physical_financial_gap`**| Derived ($\text{physical} - \text{expenditure}$) | At Month $T$ | None | **SAFE** | **RETAINED** |

---

## 3. Model Deactivation Confirmation

Model version `prodechx-xgboost-v1.0` has been flagged as **NOT PRODUCTION READY** and deactivated in the Supabase PostgreSQL `model_versions` table.
