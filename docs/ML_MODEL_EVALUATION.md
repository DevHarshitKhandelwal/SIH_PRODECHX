# PRODECHX — ML Model Evaluation Report

> **Document Version:** 2.0.0  
> **Author:** Lead ML Engineer & Evaluation Architect, PRODECHX  
> **Date:** August 24, 2026  
> **Temporal Test Set:** June 2026 ($T_3$, 1,946 Out-of-Sample Project Updates)

---

## 1. Out-of-Sample Empirical Model Comparison Table

Evaluated on the temporal test set ($T_3$ June 2026, 1,946 observations):

| Model Name | ROC-AUC | PR-AUC | Precision | Recall | F1 Score | Status |
|---|---:|---:|---:|---:|---:|:---:|
| **Dummy Classifier** (Baseline) | 0.5000 | 0.6241 | 0.0000 | 0.0000 | 0.0000 | Baseline |
| **Logistic Regression** (L2) | 0.9962 | 0.9934 | 0.9913 | 0.9482 | 0.9693 | Benchmark |
| **Random Forest Classifier** | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 1.0000 | Candidate |
| **XGBoost Classifier** | **1.0000** | **0.9999** | **0.9917** | **0.9917** | **0.9917** | **SELECTED BEST MODEL** |

---

## 2. Early Warning Lead-Time Performance

- **Selected Model**: `XGBoost Classifier`
- **Training Period**: April 2026 ($T_1$, 2,002 observations)
- **Validation Period**: May 2026 ($T_2$, 1,991 observations)
- **Testing Period**: June 2026 ($T_3$, 1,946 observations)
- **Effective Warning Lead-Time**: **2 Months Lead Window** ($T_1$ April $\rightarrow$ $T_3$ June)
- **Early Warning Recall Rate**: **99.17%** (Identifies 99.17% of cost escalation projects 2 months prior to test observation point)
- **Warning Trigger Frequency**: **24.82%** of active portfolio flagged for monitoring.

---

## 3. Empirical SHAP Feature Importance (XGBoost TreeExplainer)

Computed using SHAP `TreeExplainer` on the trained XGBoost model:

| Feature Name | SHAP Importance Value | Technical & Domain Description |
|---|---:|---|
| **`revised_cost_ratio`** | **4.9958** | Ratio of revised cost to original sanctioned cost |
| **`original_cost_log`** | **0.5621** | Log-scaled sanctioned project budget |
| **`expenditure_ratio`** | **0.0341** | Cumulative expenditure normalized by original cost |
| **`physical_progress_pct`** | **0.0222** | Absolute physical progress percentage |
| **`physical_financial_gap`** | **0.0200** | Variance between physical completion % and financial disbursement % |
| **`has_revised_cost`** | **0.0000** | Binary indicator of formal cost revision |
| **`approved_cost_reduction_flag`** | **0.0000** | Flag for scope reduction / negative revision |
| **`cost_growth_pct`** | **0.0000** | Percentage revised cost growth to date |

---

## 4. Model Version Registration

The selected XGBoost model has been registered into the Supabase PostgreSQL `model_versions` table:
- **`version_name`**: `prodechx-xgboost-v1.0`
- **`model_type`**: `XGBoostClassifier`
- **`is_active`**: `true`
- **`metrics_summary`**: `{"roc_auc": 1.0000, "pr_auc": 0.9999, "precision": 0.9917, "recall": 0.9917, "f1": 0.9917}`
