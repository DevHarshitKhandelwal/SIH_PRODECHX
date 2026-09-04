# PRODECHX — ML Temporal Validation Strategy

> **Document Version:** 1.0.0  
> **Author:** Lead ML Architect, PRODECHX  
> **Date:** August 24, 2026

---

## 1. Zero Future-Data Leakage Mandate

In time-series infrastructure monitoring, standard K-Fold cross-validation or random train/test shuffling causes severe **future-data leakage**.

To guarantee robust early warning performance:
- Features computed for a project at observation month $T$ rely **exclusively** on information available at or prior to month $T$.
- Future physical progress, future expenditure, future revised cost, or future completion status are **never** accessible to the model at prediction time $T$.

---

## 2. Temporal Data Split Architecture

The portfolio dataset (5,815 observations across 2,231 projects) is partitioned chronologically by reporting month:

```
[April 2026 (T1)] --------> [May 2026 (T2)] --------> [June 2026 (T3)]
  Training Set                Validation Set              Test Set
(1,981 observations)        (1,987 observations)        (1,847 observations)
```

| Split Partition | Observation Month | Observation Date | Sample Count | Primary Function |
|---|---|---|---:|---|
| **Training Set** | April 2026 ($T_1$) | 2026-04-01 | 1,981 | Model parameter estimation & baseline fitting |
| **Validation Set** | May 2026 ($T_2$) | 2026-05-01 | 1,987 | Hyperparameter tuning & threshold selection |
| **Test Set** | June 2026 ($T_3$) | 2026-06-01 | 1,847 | Out-of-sample temporal generalization evaluation |

---

## 3. Evaluation Protocol

All models (Dummy Classifier, Logistic Regression, Random Forest, XGBoost) are trained on $T_1$ (April), tuned on $T_2$ (May), and evaluated out-of-sample on $T_3$ (June).
