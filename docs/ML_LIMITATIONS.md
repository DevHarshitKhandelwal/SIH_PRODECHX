# PRODECHX — ML Model Limitations & Non-Causal Attribution Disclaimer

> **Document Version:** 1.0.0  
> **Author:** Lead ML Architect & Ethics Officer, PRODECHX  
> **Date:** August 24, 2026

---

## 1. Temporal Horizon & Data Scope Constraints

1. **3-Month Flash Report Window**:
   - The current dataset is constructed from three consecutive monthly reports (April 2026 $T_1$, May 2026 $T_2$, June 2026 $T_3$).
   - Multi-year seasonal effects (e.g. monsoon construction slowdowns between July and September) cannot be fully captured until additional monthly reports are ingested.

2. **Lead-Time Window Bound**:
   - The verified early-warning lead time is bounded to a **2-month advance notification window** ($T_1$ April to $T_3$ June).
   - Long-range 12–24 month predictive trajectories require multi-year historical panel data.

---

## 2. SHAP Explainability vs. Causal Inference Disclaimer

> [!CAUTION]
> **SHAP Values Are Statistical Attributions, NOT Causal Proof**  
> SHAP (SHapley Additive exPlanations) values describe how individual feature values move the model's output probability relative to the baseline prediction.  
> **SHAP values MUST NOT be interpreted as causal proof of project mismanagement, contractor default, or administrative failure.**  
> For instance, a high `expenditure_ratio` SHAP score indicates statistical correlation with historical cost overruns, not proof of financial misallocation.

---

## 3. Data Quality & Source Value Conditions

1. **Unrevised Project Costs**:
   - For unrevised projects displaying `-` in PAIMANA, `revised_cost` is stored as `NULL` and `original_cost_snap` is used as the baseline.
2. **Approved Scope Reductions**:
   - Projects with `revised_cost < original_cost_snap` (e.g. S.No 48 KOTRE BASANTPUR PACHMO OCP) represent legitimate approved scope reductions, not negative overrun anomalies. They are preserved in source records and logged in `data_quality_issues`.

---

## 4. Operational Recommendations

1. **Human-in-the-Loop Decision Support**:
   - ML risk scores and early warning alerts are designed to assist Line Ministry Project Officers and MoSPI auditors, not replace human project evaluation.
2. **Continuous Retraining**:
   - Models should be incrementally retrained upon ingestion of subsequent monthly PAIMANA reports to adapt to evolving macroeconomic factors.
