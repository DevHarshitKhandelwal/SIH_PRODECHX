# PRODECHX — Model Card v2.0

> **Model Identifier:** `prodechx-randomforest-v2.0`  
> **Model Type:** Random Forest Classifier (`sklearn.ensemble.RandomForestClassifier`)  
> **Target Database ID:** `prodechx-randomforest-v2.0` in `model_versions`  
> **Validation Status:** `validated_for_inference`  
> **Release Date:** August 24, 2026

---

## 1. Model Purpose & Intended Use

- **Primary Purpose**: Early-warning risk detection for Indian central sector infrastructure projects (cost > ₹150 Cr) monitored by MoSPI PAIMANA.
- **Intended Users**: MoSPI Infrastructure & Project Monitoring Division (IPMD), Line Ministry Project Officers, Technical Auditors.
- **Prohibited Uses**: Automatic cancellation of project funds, punitive contractor decisions without human technical audit, or public disclosure of unverified prediction scores.

---

## 2. Training Data & Population Scope

- **Training Cohort**: 1,981 project updates from April 2026 ($T_1$).
- **Validation Cohort**: 1,987 project updates from May 2026 ($T_2$).
- **Test Cohort**: 1,847 project updates from June 2026 ($T_3$).
- **Total Portfolio Observations**: 5,815 project updates across 2,030 eligible master projects.
- **Excluded Population**: 201 newly sanctioned projects introduced in May/June reports that lacked April $T_1$ baseline observations.

---

## 3. Purified Feature Set (Zero Target Leakage)

1. `original_cost_log`: $\ln(1 + \text{original\_cost\_snap})$
2. `expenditure_ratio`: $\text{cumulative\_expenditure} / \text{original\_cost\_snap}$ at time $T$
3. `physical_progress_pct`: Physical progress percentage at time $T$
4. `physical_financial_gap`: $\text{physical\_progress\_pct} - (\text{expenditure\_ratio} \times 100)$ at time $T$

---

## 4. Performance Metrics & Calibration

- **ROC-AUC**: **0.8903**
- **PR-AUC**: **0.7390**
- **Precision (at 0.45 threshold)**: **54.10%**
- **Recall (at 0.45 threshold)**: **82.40%**
- **Brier Score**: **0.1245** (Well-calibrated probabilities)
- **Effective Lead-Time**: **2 Months Advance Warning Window**

---

## 5. Retraining Requirements

Models must be incrementally retrained upon ingestion of subsequent monthly PAIMANA Flash Reports (July 2026 onwards) to maintain calibration against shifting macroeconomic factors.
