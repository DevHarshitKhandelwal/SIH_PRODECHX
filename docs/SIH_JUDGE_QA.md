# PRODECHX — SIH Technical Defense & Jury Q&A Guide

> **Document Version:** 1.0.0  
> **Author:** Lead AI Engineer & Data Scientist, PRODECHX  
> **Date:** August 24, 2026

---

### Q1: Why AI? Why not traditional statistical linear regression?
**Answer**: Traditional linear regression assumes linear relationships and independent features. Infrastructure project cost overruns involve non-linear feature interactions (e.g. expenditure acceleration combined with physical progress stagnation) and multi-collinear financial metrics. Machine learning decision trees capture non-linear thresholds (e.g. physical-financial gap > 10%) far better than linear models.

### Q2: How do you prevent target and temporal leakage?
**Answer**: During Phase 3.5 ML Leakage Audit, we purged target proxies (`revised_cost`, `revised_cost_ratio`, `cost_growth_pct`, `has_revised_cost`) from the feature space. Predictions for Month $T+2$ use ONLY feature values observable at Month $T_1$ (April 2026 baseline), ensuring zero future lookahead.

### Q3: How accurate is the model?
**Answer**: On out-of-sample June 2026 test data, `prodechx-randomforest-v2.0` achieves **ROC-AUC of 0.8903**, **PR-AUC of 0.7390**, and **82.40% Recall** at the calibrated 0.45 threshold.

### Q4: How early can the system warn policymakers?
**Answer**: Exactly **2 months advance warning**. Features constructed at April $T_1$ predict cost overrun escalation occurring in June $T_3$.

### Q5: Why Random Forest instead of XGBoost?
**Answer**: XGBoost v1.0 suffered severe target leakage (1.000 ROC-AUC due to `revised_cost_ratio`). After purging leaked features, Random Forest v2.0 provided superior probability calibration (Brier Score `0.1245` vs `0.1890`), resistance to overfitting on 2,030 projects, and stable SHAP feature attributions.

### Q6: How is the 0-100 Risk Score calculated?
**Answer**: Risk Score is the calibrated probability scaled linearly to $[0, 100]$ ($\text{Risk Score} = \text{Probability} \times 100$). Probabilities $\ge 0.45$ trigger `HIGH RISK`.

### Q7: How does RAG prevent hallucinations?
**Answer**: Through strict prompt grounding and fallback rules. If semantic search vector similarity score falls below threshold or evidence is missing, the LLM is restricted from using parametric memory and MUST return: *"I couldn't find sufficient evidence in the available PAIMANA records."*

### Q8: How are source citations generated?
**Answer**: Ingested document chunks store metadata (`period`, `page_number`, `project_code`). When chunks are retrieved, the citation formatter automatically constructs `[PAIMANA April 2026, p. XX]` linked directly to PyMuPDF extracted page numbers.

### Q9: What happens with missing data or new projects?
**Answer**: New projects introduced in May/June lacking April $T_1$ baseline observations are classified as `not_eligible` with reason `"Insufficient historical baseline"`. The system NEVER generates fake or imputed risk scores.

### Q10: Can the system scale to 10,000+ projects?
**Answer**: Yes. Supabase PostgreSQL handles millions of rows, vector search uses HNSW indexes (`vector(384)` cosine ops), and FastAPI inference executes in $<15 \text{ ms}$ per project.

### Q11: Is the source data open-source / public?
**Answer**: Yes. The dataset consists of official MoSPI PAIMANA Flash Reports published monthly under public government transparency mandates.

### Q12: Why is this system useful to MoSPI policymakers?
**Answer**: It converts 160-page static PDFs into actionable triage alerts, allowing infrastructure monitoring officers to target high-risk projects 2 months before budget escalation occurs.

### Q13: What are the current limitations of the system?
**Answer**: Current dataset spans 3 consecutive months (April–June 2026). Seasonal weather impacts (e.g. monsoon delays) cannot be multi-year seasonality modelled without multi-year longitudinal datasets.

### Q14: What would you do with 10+ years of historical PAIMANA data?
**Answer**: Train longitudinal LSTM/Transformer time-series risk forecasting models, model multi-year seasonality trends, and perform macroeconomic commodity price correlation analysis.

### Q15: Why is SHAP described using non-causal language?
**Answer**: SHAP explains model decision boundaries, not physical real-world causation. Describing a feature as "causing" failure is scientifically invalid; we strictly use *"associated with higher predicted risk"*.
