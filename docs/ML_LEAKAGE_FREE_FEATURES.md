# PRODECHX — Purified Leakage-Free Feature Dictionary

> **Document Version:** 2.0.0  
> **Author:** Lead Feature Engineer, PRODECHX  
> **Date:** August 24, 2026

---

## 1. Purified Leakage-Free Feature Specifications

Features in this purified dictionary are computed **strictly at prediction timestamp $T$** using baseline project attributes:

| Feature Name | Data Type | Mathematical Formula / Transformation | Source Column | Availability Timestamp | Safety Proof |
|---|---|---|---|---|---|
| **`original_cost_log`** | `float` | $\ln(1 + \text{original\_cost\_snap})$ | `projects.original_cost` | At Sanction ($T_0$) | Static baseline budget |
| **`expenditure_ratio`** | `float` | $\frac{\text{cumulative\_expenditure}}{\text{original\_cost\_snap}}$ | `project_updates.cumulative_expenditure` | Month $T$ | Current disbursement to date |
| **`physical_progress_pct`**| `float` | $\text{physical\_progress\_pct}$ | `project_updates.physical_progress_pct` | Month $T$ | Current physical progress % |
| **`physical_financial_gap`**| `float` | $\text{physical\_progress\_pct} - (\text{expenditure\_ratio} \times 100)$ | Derived at Month $T$ | Month $T$ | Progress variance at time $T$ |

---

## 2. Explicitly Excluded Features

The following 5 target-proxy features have been **permanently purged**:
1. `revised_cost`
2. `revised_cost_ratio`
3. `cost_growth_pct`
4. `has_revised_cost`
5. `approved_cost_reduction_flag`
