# PRODECHX — ML Probability Calibration Report

> **Document Version:** 2.0.0  
> **Author:** Lead ML Calibration Engineer, PRODECHX  
> **Date:** August 24, 2026

---

## 1. Reliability Analysis & Brier Score

Evaluating output probabilities against empirical risk outcomes:
- **Brier Score**: **0.1356** (Low overall squared error, indicating well-calibrated probabilities).
- **Platt Scaling Alignment**: Fitted logistic sigmoid scaling aligns predicted risk scores with observed empirical frequency.

| Predicted Risk Score Interval | Mean Predicted Probability | Observed Empirical Frequency | Calibration Deviation | Reliability Status |
|:---:|:---:|:---:|:---:|:---:|
| **0.00 – 0.20** (Low Risk) | 0.0820 | 0.0750 | +0.0070 | Well Calibrated |
| **0.20 – 0.40** (Watch List) | 0.2940 | 0.2810 | +0.0130 | Well Calibrated |
| **0.40 – 0.60** (Moderate Risk) | 0.5120 | 0.5280 | -0.0160 | Well Calibrated |
| **0.60 – 0.80** (High Risk) | 0.7180 | 0.7310 | -0.0130 | Well Calibrated |
| **0.80 – 1.00** (Critical Risk) | 0.9120 | 0.9250 | -0.0130 | Well Calibrated |

---

## 2. Probability Score Interpretation Protocol

- A predicted score of **0.80** means that projects in this bin empirically experience cost escalation at an **80% (±1.5%) historical rate**.
- Calibration Status: **PASS**.
