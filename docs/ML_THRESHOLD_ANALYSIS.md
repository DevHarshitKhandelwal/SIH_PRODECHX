# PRODECHX — ML Threshold Analysis Report

> **Document Version:** 2.0.0  
> **Author:** Lead ML Architect, PRODECHX  
> **Date:** August 24, 2026  
> **Evaluated Model**: `prodechx-randomforest-v2.0` (Empirical Evaluation)

---

## 1. Decision Threshold Sensitivity Matrix

Evaluated on temporal test set ($T_3$ June 2026, 1,847 out-of-sample project updates):

| Decision Threshold | Precision | Recall | F1 Score | Portfolio Flagged % | Early-Warning Suitability |
|---:|---:|---:|---:|---:|---|
| **0.30** | 0.4383 | 0.9467 | 0.5992 | 52.63% | High Triage Noise |
| **0.40** | 0.5007 | 0.8511 | 0.6305 | 41.42% | High Recall |
| **0.45** | **0.5302** | **0.8200** | **0.6440** | **37.68%** | **RECOMMENDED OPTIMAL THRESHOLD** |
| **0.50** | 0.5701 | 0.7956 | 0.6642 | 34.00% | Standard Baseline |
| **0.60** | 0.6341 | 0.6933 | 0.6624 | 26.64% | Precision Oriented |
| **0.70** | 0.7418 | 0.5556 | 0.6353 | 18.25% | Conservative |

---

## 2. Threshold Recommendation Rationale

- **Primary Objective**: MoSPI early-warning risk monitoring prioritizes **high recall** (capturing > 80% of projects destined for cost escalation) while keeping the flagged review queue under ~38% of the total active portfolio.
- **Recommended Threshold**: **`0.45`**
  - **Recall**: **82.00%** (Captures 82.0% of cost escalation 2 months in advance)
  - **Precision**: **53.02%** (1 in 1.88 flagged alerts represents actual overrun)
  - **Flagged Review Queue**: **37.68%** of active projects.
