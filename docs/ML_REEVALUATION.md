# PRODECHX — ML Re-Evaluation Report (Purified Leakage-Free Pipeline)

> **Document Version:** 3.0.0  
> **Author:** Lead ML Engineer & Evaluation Architect, PRODECHX  
> **Date:** August 24, 2026  
> **Temporal Walk-Forward Setup:** Features at $T_1$ (April 2026, 1,981 updates) predicting Future Cost Overrun Outcome $Y(T_3)$ (June 2026, 1,847 updates)  
> **Reconciled Observations:** 5,815 observations across 2,030 unique projects (0 discrepancy)

---

## 1. Executive Summary & Purified Feature Pipeline

Target-proxy features (`revised_cost`, `revised_cost_ratio`, `cost_growth_pct`, `has_revised_cost`) were **permanently purged** from the input feature set.

The pipeline predicts future cost escalation strictly from baseline information known at prediction timestamp $T_1$ (April 2026): `original_cost_log`, `expenditure_ratio`, `physical_progress_pct`, `physical_financial_gap`.

---

## 2. Empirical Out-of-Sample Model Comparison Table

Evaluated on the temporal test set ($T_3$ June 2026, 1,847 out-of-sample project updates):

| Model Name | ROC-AUC | PR-AUC | Precision | Recall | F1 Score | Status |
|---|---:|---:|---:|---:|---:|:---:|
| **Dummy Classifier** (Baseline) | 0.5000 | 0.6218 | 0.0000 | 0.0000 | 0.0000 | Baseline |
| **Logistic Regression** (L2) | 0.8018 | 0.6053 | 0.4286 | 0.7533 | 0.5463 | Benchmark |
| **Random Forest Classifier** | **0.8903** | **0.7390** | **0.5701** | **0.7956** | **0.6642** | **SELECTED BEST MODEL** |
| **XGBoost Classifier** | 0.8756 | 0.7048 | 0.5829 | 0.7267 | 0.6469 | Candidate |

*Data Science Result*: Purging target proxies reduced artificial 1.0000 metrics to an **honest, realistic out-of-sample ROC-AUC of 0.8903** and **PR-AUC of 0.7390** for Random Forest (and 0.8756 ROC-AUC for XGBoost).

---

## 3. Early Warning Lead-Time Performance

- **Prediction Point $T_1$**: April 2026 (1,981 observations)
- **Target Outcome Point $T_3$**: June 2026 (1,847 observations)
- **Effective Warning Lead-Time**: **2 Months Advance Warning Window**
- **Early Warning Recall Rate**: **79.56%** (Detects 79.56% of future cost overruns 2 months in advance)
- **Precision Rate**: **57.01%**
- **Warning Trigger Frequency**: **30.37%** of active portfolio flagged for monitoring.

---

## 4. Empirical SHAP Feature Importance (TreeExplainer)

Computed on the purified leakage-free feature set using SHAP `TreeExplainer`:

| Feature Name | SHAP Importance Value | Technical & Domain Interpretation |
|---|---:|---|
| **`expenditure_ratio`** | **0.5790** | Financial disbursement rate relative to original sanctioned budget |
| **`original_cost_log`** | **0.5470** | Log-scaled sanctioned project budget scale |
| **`physical_progress_pct`** | **0.5332** | Absolute physical completion percentage at time $T$ |
| **`physical_financial_gap`** | **0.1351** | Progress gap between physical completion % and financial disbursement % |

---

## 5. Model Version Registration

The selected Random Forest model has been registered into the Supabase PostgreSQL `model_versions` table:
- **`version_name`**: `prodechx-randomforest-v2.0`
- **`model_type`**: `RandomForestClassifier`
- **`is_active`**: `true`
- **`metrics_summary`**: `{"roc_auc": 0.8903, "pr_auc": 0.7390, "precision": 0.5701, "recall": 0.7956, "f1": 0.6642}`
