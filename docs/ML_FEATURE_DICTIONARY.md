# PRODECHX — ML Feature Dictionary

> **Document Version:** 1.0.0  
> **Author:** Lead Feature Engineer, PRODECHX  
> **Date:** August 24, 2026

---

## Derived Feature Specifications

Every feature is computed strictly at prediction timestamp $T$:

| Feature Name | Data Type | Formula / Definition | Source Fields | Leakage Risk | Availability Timestamp |
|---|---|---|---|:---:|---|
| **`original_cost_log`** | `float` | $\ln(1 + \text{original\_cost\_snap})$ | `original_cost_snap` | None | At Sanction ($T_0$) |
| **`expenditure_ratio`** | `float` | $\frac{\text{cumulative\_expenditure}}{\text{original\_cost\_snap}}$ | `cumulative_expenditure`, `original_cost_snap` | None | At Month $T$ |
| **`physical_progress_pct`**| `float` | Raw physical progress percentage (0.00 to 100.00%) | `physical_progress_pct` | None | At Month $T$ |
| **`physical_financial_gap`**| `float` | $\text{physical\_progress\_pct} - (\text{expenditure\_ratio} \times 100)$ | `physical_progress_pct`, `expenditure_ratio` | None | At Month $T$ |
| **`has_revised_cost`** | `binary` | `1` if `revised_cost` is non-null, else `0` | `revised_cost` | None | At Month $T$ |
| **`revised_cost_ratio`** | `float` | $\frac{\text{revised\_cost}}{\text{original\_cost\_snap}}$ if present else `1.0` | `revised_cost`, `original_cost_snap` | None | At Month $T$ |
| **`approved_cost_reduction_flag`** | `binary` | `1` if `revised_cost < original_cost_snap`, else `0` | `revised_cost`, `original_cost_snap` | None | At Month $T$ |
| **`cost_growth_pct`** | `float` | $\frac{\text{revised\_cost} - \text{original\_cost\_snap}}{\text{original\_cost\_snap}} \times 100$ | `revised_cost`, `original_cost_snap` | None | At Month $T$ |

---

## Feature Safety Guarantee

Features dependent on future physical progress, future cumulative expenditure, or future project completion dates are **strictly excluded** from feature vectors.
