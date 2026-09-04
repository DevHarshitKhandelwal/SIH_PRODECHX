# PRODECHX — ML Target Definitions

> **Document Version:** 1.0.0  
> **Author:** Lead ML Architect, PRODECHX  
> **Date:** August 24, 2026

---

## 1. Primary Target Definition: Binary Cost Overrun

- **Target Key**: `target_cost_overrun_binary`
- **Type**: Binary Classification (`0` or `1`)
- **Source Fields**: `project_updates.revised_cost`, `project_updates.original_cost_snap`
- **Calculation Formula**:
  $$\text{target\_cost\_overrun\_binary} = \begin{cases} 1 & \text{if } \text{revised\_cost} > \text{original\_cost\_snap} \\ 0 & \text{otherwise} \end{cases}$$
- **Prediction Horizon**: Monthly observation timestamp $T$ predicting final cost escalation state.
- **Label Distribution**:
  - Positive Class (`1`, Cost Overrun): **1,509 projects (76.17%)**
  - Negative Class (`0`, On-Budget / Unrevised): **472 projects (23.83%)**

---

## 2. Secondary Target Definition: High Cost Overrun (>= 20% Cost Escalation)

- **Target Key**: `target_high_cost_overrun`
- **Type**: Binary Classification (`0` or `1`)
- **Source Fields**: `project_updates.revised_cost`, `project_updates.original_cost_snap`
- **Calculation Formula**:
  $$\text{cost\_growth\_pct} = \frac{\text{revised\_cost} - \text{original\_cost\_snap}}{\text{original\_cost\_snap}} \times 100$$
  $$\text{target\_high\_cost\_overrun} = \begin{cases} 1 & \text{if } \text{cost\_growth\_pct} \ge 20.0\% \\ 0 & \text{otherwise} \end{cases}$$
- **Label Distribution**:
  - Positive Class (`1`, $\ge 20\%$ Cost Growth): **892 projects (45.03%)**
  - Negative Class (`0`, $< 20\%$ Cost Growth): **1,089 projects (54.97%)**

---

## 3. Label Integrity & No Fabrication Rules

- **No Synthetic Labeling**: Labels are computed strictly from raw numeric source columns extracted from PAIMANA PDFs.
- **Unrevised Handling**: If `revised_cost` is `NULL` (displayed as `-` in PAIMANA), `target_cost_overrun_binary` is evaluated as `0` (Unrevised / On-Budget).
- **Approved Cost Reduction**: Projects with `revised_cost < original_cost_snap` are evaluated as `0` for cost overrun and logged in `data_quality_issues`.
