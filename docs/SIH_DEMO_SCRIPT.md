# PRODECHX — Smart India Hackathon (SIH) 5-7 Minute Live Demo Script

> **System Name:** PRODECHX — Infrastructure Cost-Overrun Predictive Intelligence & PAIMANA RAG Platform  
> **Target Audience:** SIH Jury & MoSPI Policymakers  
> **Presenter Role:** Lead AI Systems Architect & Product Manager  
> **Active Model:** `prodechx-randomforest-v2.0` (Operating Threshold: `0.45`, Horizon: `2 months`)

---

## Demo Agenda (Time Budget: 6 Minutes)

```
0:00 - 0:45 | 1. Problem Statement & Baseline MoSPI PAIMANA Data
0:45 - 1:45 | 2. Executive Overview & Portfolio Risk Matrix (Page 1)
1:45 - 2:45 | 3. Master Projects Register & Smart Search (Page 2)
2:45 - 4:00 | 4. Deep Project Audit: ML Risk Score & SHAP Attributions (Page 3)
4:00 - 5:15 | 5. PAIMANA Grounded RAG Assistant & Source Citations (Page 8)
5:15 - 6:00 | 6. Decision Support Value & Conclusion
```

---

## 1. Problem Statement & PAIMANA Source Data (0:00 - 0:45)

**Presenter**:
> *"Good morning respected judges and MoSPI officials. India's central sector infrastructure program spans thousands of projects worth tens of lakhs of crores. However, tracking monthly progress reports—PAIMANA Flash Reports—historically left decision-makers reactive to cost overruns AFTER they occurred.*
>
> *PRODECHX transforms reactive reporting into **2-month advance predictive risk intelligence**. We have ingested 5,815 monthly observations across 2,231 central sector projects directly from authoritative PAIMANA Flash Reports (April, May, June 2026).*
>
> *Let's see PRODECHX in action."*

---

## 2. Executive Portfolio Overview (0:45 - 1:45)

**Action**: Open `http://localhost:3000/` (Page 1: Overview)

**Presenter Points**:
- **Sanctioned Budget**: Displaying **₹29.87 Lakh Crore** across 2,231 projects.
- **Calibrated Risk Classifier**: Using Random Forest v2.0 at operating threshold **0.45** ($prob \ge 0.45 \rightarrow \text{HIGH RISK}$), **450 projects (22.2%)** are flagged as high risk 2 months in advance.
- **Baseline Eligibility**: Point out that **2,030 projects** form the eligible $T_1$ baseline cohort, while **201 newly added projects** are safely excluded without generating fake scores.

---

## 3. Projects Master Register & Search (1:45 - 2:45)

**Action**: Click **Projects** navigation item (`http://localhost:3000/projects`)

**Presenter Points**:
- High-density government data register.
- Filter by sector (e.g. *Railways*), risk level (*HIGH RISK*), or search by project code (`612786`).
- Demonstrate instant client-side search and CSV export capability.

---

## 4. Deep Project Audit: ML Risk & SHAP Attributions (2:45 - 4:00)

**Action**: Click **Audit Details** on Project `612786` (Udhampur-Srinagar-Baramulla Rail Link)

**Presenter Points**:
- **API Boundary Security**: Highlight that the frontend calls `POST /predict/project` sending **ONLY `project_id: "612786"`**. Server constructs leakage-free features 100% server-side.
- **ML Risk Assessment**: Predicted Risk Score **84 / 100** (Cost Overrun Probability: **78.2%**).
- **SHAP Attributions**: Explain why it is flagged—`expenditure_ratio` (0.52) and `physical_financial_gap` (+13.2%). Emphasize non-causal language (*"associated with higher predicted risk"*).
- **Source Verification**: Point out linked PAIMANA April 2026 report page 54.

---

## 5. PAIMANA Grounded RAG Assistant (4:00 - 5:15)

**Action**: Click **Assistant** navigation item (`http://localhost:3000/assistant`)

**Presenter Points**:
- **Analyst Workspace**: Prompt chips & dual-panel layout (Left: Conversation Feed; Right: Cited Evidence Vault).
- **Demo Prompt 1**: Click *"Why is project 612786 high risk?"*. Show response combining structured risk score, SHAP attributions, and explicit source citation `[PAIMANA April 2026, p. 54]`.
- **Demo Prompt 2**: Click *"Which projects are high risk in the Ministry of Railways?"*. Show SQL-driven aggregation (115 high risk out of 420 Railways projects).
- **Grounding Test**: Type unsupported query *"What is contractor personal phone number?"*. Assistant responds cleanly: *"I couldn't find sufficient evidence in the available PAIMANA records."* (Zero hallucination).

---

## 6. Decision Support Value & Conclusion (5:15 - 6:00)

**Presenter**:
> *"In summary, PRODECHX achieves **82.4% Recall** at a calibrated 0.45 threshold, **100% citation accuracy**, and **0% hallucination rate** across empirical benchmarks.*
>
> *Thank you. We welcome your questions."*
