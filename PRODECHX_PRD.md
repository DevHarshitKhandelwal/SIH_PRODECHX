# PRODECHX — Product Requirements Document (PRD)

## Predictive Infrastructure Monitoring, Risk & Early-Warning Intelligence Platform

**SIH Problem Statement:** SIH26103  
**Organization:** Ministry of Statistics and Programme Implementation (MoSPI)  
**Department:** Data Informatics & Innovation Division (DIID)  
**Category:** Software  
**Theme:** Smart Automation

---

## 1. Product Vision

PRODECHX is an AI/ML-powered infrastructure project intelligence platform designed to transform traditional project monitoring into a predictive, explainable, and actionable decision-support system.

The system should answer:

- Which projects are likely to experience cost overruns?
- Which projects are likely to experience schedule delays?
- Why is a project at risk?
- How early can the risk be detected?
- Which projects require intervention?
- What factors are driving the risk?
- How does a project compare with similar historical projects?
- What evidence from PAIMANA reports supports the analysis?

Core flow:

**Data → Analytics → ML → Explainability → Early Warning → Action**

---

# 2. Source Data

PRODECHX will use PAIMANA/project-monitoring information as its primary source context.

The platform must support:

1. Structured project data
2. PAIMANA PDF reports
3. Historical monthly project updates
4. Future API/data integrations

PAIMANA PDF reports are a first-class input, not merely attachments.

The original PDFs must remain stored and linked to extracted information.

---

# 3. Core Product Capabilities

PRODECHX must provide:

- Project portfolio monitoring
- PAIMANA PDF upload and processing
- Structured data extraction
- Historical project timelines
- Data-quality validation
- Cost-overrun prediction
- Schedule-delay prediction
- Project risk scoring
- Explainable AI
- Early-warning alerts
- Intervention tracking
- Ministry analytics
- Sector analytics
- Benchmarking
- Cost-driver analysis
- AI-powered project intelligence
- RAG over PAIMANA documents
- Natural-language project queries
- Audit logging
- Model-performance monitoring
- Reports and exports

---

# 4. Target Users

## National Administrator

Needs national portfolio visibility, risk overview, critical alerts, ministry comparison, sector analytics, and intervention priorities.

## Ministry Officer

Needs ministry-level projects, risk analysis, delays, cost escalation, alerts, and action tracking.

## Project Officer

Needs project updates, milestones, documents, alerts, and intervention actions.

## Analyst

Needs historical data, benchmarking, model metrics, feature importance, exports, and advanced analytics.

---

# 5. High-Level Architecture

```text
                    PAIMANA PDFs
                         |
                         v
              +----------------------+
              | Document Ingestion   |
              | PDF / Table / OCR    |
              +----------+-----------+
                         |
                         v
              +----------------------+
              | Validation &         |
              | Normalization        |
              +----------+-----------+
                         |
               +---------+---------+
               |                   |
               v                   v
       Structured Data       Document Knowledge
               |                   |
               v                   v
        PostgreSQL            pgvector/RAG
               |                   |
               v                   v
       Feature Engineering    AI Assistant
               |
               v
        Python ML Engine
               |
        +------+------+------+
        |      |      |
       Cost   Delay  Risk
        |      |      |
        +------+------+------+
               |
               v
       Early Warning Engine
               |
               v
        PRODECHX Dashboard
```

---

# 6. Recommended Technology Stack

## Frontend

- Next.js
- React
- JavaScript
- Tailwind CSS
- TanStack Table
- Recharts or Apache ECharts
- Lucide Icons

## Main Backend

- Node.js
- Express.js
- REST APIs
- JWT/session authentication
- RBAC

## Database

- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- pgvector

## ML

- Python
- Pandas
- NumPy
- Scikit-learn
- XGBoost or LightGBM
- SHAP
- Statsmodels

## ML API

- FastAPI

## PDF Processing

- PyMuPDF
- pdfplumber
- table extraction library
- OCR fallback

## Deployment

- Docker
- Docker Compose
- Vercel where appropriate
- Cloud deployment for backend/ML services

---

# 7. Repository Structure

```text
prodechx/
├── PRD.md
├── README.md
├── .env.example
├── .gitignore
├── docker-compose.yml
│
├── apps/
│   ├── web/
│   └── api/
│
├── services/
│   ├── ml/
│   └── ingestion/
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── data/
│   └── paimana-pdfs/
│
├── docs/
└── tests/
```

---

# 8. PAIMANA PDF Ingestion

PDF workflow:

```text
PDF Upload
   ↓
Checksum
   ↓
Storage
   ↓
Text Extraction
   ↓
Table Detection
   ↓
OCR if required
   ↓
Structured Extraction
   ↓
Validation
   ↓
Project Matching
   ↓
Monthly Update
   ↓
Document Chunking
   ↓
Embeddings
```

The system must never silently overwrite existing project information.

Ambiguous project matches must enter a manual-review workflow.

---

# 9. Document Management

Route:

`/admin/documents`

Support:

- Drag-and-drop upload
- PDF validation
- Reporting month/year
- Document type
- Processing status
- Extraction summary
- Error reporting
- Duplicate detection
- Manual review

Statuses:

- Uploaded
- Processing
- Extracting
- Validating
- Completed
- Failed
- Review Required

---

# 10. Document Storage

Use Supabase Storage.

Example:

```text
paimana-documents/
  2026/
    04/
      april-2026-report.pdf
```

Database table:

```text
documents
```

Minimum fields:

```text
id
file_name
storage_path
document_type
report_month
report_year
checksum
processing_status
pages
projects_detected
uploaded_by
uploaded_at
processed_at
```

---

# 11. Data Lineage

Every extracted value should be traceable to its source document when possible.

Example:

```text
Project ABC
Current Cost
₹4,200 Cr

Source:
April 2026 PAIMANA Report
Page 48
```

The system must preserve provenance for document-derived information.

---

# 12. Project Identity and Monthly History

A project appearing in multiple monthly reports must remain one project.

Use:

```text
projects
   |
   +-- project_updates
          +-- April
          +-- May
          +-- June
```

Do not create separate projects for each month.

Use stable project identifiers where available.

If identifiers are unavailable or ambiguous, use controlled matching and send uncertain matches to manual review.

---

# 13. Database Entities

Minimum entities:

```text
users
roles
permissions

ministries
sectors
agencies

projects
project_updates
project_milestones
project_financials

documents
document_pages
document_chunks

risk_predictions
risk_factors
model_versions

alerts
alert_actions

notifications
audit_logs

data_imports
```

---

# 14. Project Data

Potential source fields include:

- Project ID
- Project name
- Ministry
- Sector
- Implementing agency
- Location/state
- Original/approved cost
- Revised/current cost
- Expenditure
- Approval date
- Start date
- Original completion date
- Revised completion date
- Physical progress
- Financial progress
- Milestone status
- Project status

IMPORTANT:

Only create source fields that are actually supported by the supplied PAIMANA data/PDFs.

Never invent source data.

Clearly distinguish:

- Source-derived fields
- Calculated fields
- ML features
- ML predictions

---

# 15. Data Validation

Validate:

- Missing values
- Invalid dates
- Duplicate project IDs
- Invalid cost values
- Negative expenditure
- Progress greater than 100%
- Inconsistent timelines
- Impossible values
- Stale updates

Provide a data-quality score and explain validation warnings.

---

# 16. National Dashboard

Route:

`/dashboard`

Header:

**PRODECHX**

Subtitle:

**Predictive Infrastructure Monitoring & Early Warning**

Filters:

- Reporting Period
- Ministry
- Sector
- Risk Level
- Search

Actions:

- Export
- Notifications
- User menu

---

# 17. Executive KPIs

Display source-backed metrics such as:

- Total Projects
- Original Cost
- Revised Cost
- Cumulative Expenditure
- High-Risk Projects
- Critical Projects

If a metric is unavailable, display `—`.

Never fabricate statistics.

---

# 18. Risk Overview

Show project distribution:

- Low
- Moderate
- High
- Critical

Selecting a risk level must filter the project portfolio.

---

# 19. High-Risk Project Table

Columns:

- Project
- Ministry
- Sector
- Cost Risk
- Delay Risk
- Overall Risk
- Physical Progress
- Schedule Variance
- Last Updated

Features:

- Search
- Filtering
- Sorting
- Pagination
- Export
- Column visibility

---

# 20. Project Detail

Route:

`/projects/[id]`

Tabs:

- Overview
- Financials
- Timeline
- Milestones
- Risk
- Warnings
- Documents
- History

Display:

- Project information
- Financial information
- Physical progress
- Historical monthly updates
- Risk predictions
- Risk drivers
- Source documents

---

# 21. Predictive Risk Panel

Example:

```text
OVERALL RISK
82 / 100
HIGH

Cost Overrun Probability
76%

Schedule Delay Probability
89%

Predicted Delay
8.4 months
```

Predictions must come from the ML service after implementation.

Never hardcode predictions.

Every prediction should store:

- timestamp
- model version
- input snapshot/reference
- prediction
- confidence/probability where applicable

---

# 22. Cost Overrun Prediction

Predict:

- Probability of cost overrun
- Expected overrun percentage
- Predicted final cost

Potential models:

- Logistic Regression
- Random Forest
- XGBoost
- LightGBM

Model selection must be based on measured evaluation results.

---

# 23. Schedule Delay Prediction

Predict:

- Probability of delay
- Expected delay duration
- Expected completion date

Use historical monthly project data.

Avoid future-data leakage during model training.

---

# 24. Risk Score

Create configurable risk categories:

```text
0–29     LOW
30–49    MODERATE
50–74    HIGH
75–100   CRITICAL
```

The scoring approach must be justified by model outputs, measurable signals, or documented business rules.

Do not label an arbitrary weighted formula as AI.

---

# 25. Explainable AI

Use SHAP or another appropriate explainability approach.

Display:

```text
TOP RISK DRIVERS

Milestone slippage
Low progress velocity
Cost growth
Historical delay pattern
```

The UI must distinguish model-derived explanations from manually configured rules.

---

# 26. Baseline vs ML

Evaluate conventional/statistical baselines against ML models.

Example:

| Model | Accuracy | Precision | Recall | F1 | ROC-AUC |
|---|---:|---:|---:|---:|---:|
| Logistic Regression | actual | actual | actual | actual | actual |
| Random Forest | actual | actual | actual | actual | actual |
| XGBoost | actual | actual | actual | actual | actual |

Do not fabricate metrics.

For regression tasks use suitable metrics such as:

- MAE
- RMSE
- R²

---

# 27. Early-Warning Engine

Generate warnings for:

- Cost escalation
- Schedule delay
- Milestone slippage
- Progress stagnation
- Expenditure anomaly
- Implementation risk
- Data quality issues

Severity:

- Information
- Watch
- Warning
- Critical

Example:

```text
CRITICAL EARLY WARNING

Project:
ABC Infrastructure Project

Trigger:
Schedule delay probability exceeded threshold.

Detected:
24 Aug 2026

Key drivers:
- milestone slippage
- declining progress
- expenditure deviation
```

---

# 28. Alert Lifecycle

```text
Detected
   ↓
Assigned
   ↓
Acknowledged
   ↓
Action Initiated
   ↓
Resolved
```

Store:

- assigned officer
- timestamp
- action
- notes
- resolution
- status history

---

# 29. Prescriptive Intelligence

For significant warnings, provide evidence-grounded recommendations.

Example:

```text
Recommended Review

1. Review delayed milestones.
2. Investigate expenditure deviation.
3. Validate implementation constraints.
4. Review agency-level status.
```

Clearly distinguish:

**Observed fact**

from

**ML prediction**

from

**Recommendation**.

---

# 30. Benchmarking

Compare projects with similar historical projects.

Possible comparison dimensions:

- Sector
- Ministry
- Project size
- Project age
- Geographic region
- Agency

Example:

```text
Current Project
Progress: 61%

Peer Median
Progress: 73%

Current Cost Growth
18.4%

Peer Median
7.1%
```

Do not imply statistical causation from simple peer comparisons.

---

# 31. Ministry Analytics

For each ministry show:

- Project count
- Portfolio value
- High-risk projects
- Critical projects
- Cost variance
- Schedule variance
- Alerts
- Sector distribution

---

# 32. Sector Analytics

Support source-defined sectors, including where applicable:

- Transport & Logistics
- Energy
- Water & Sanitation
- Communication
- Social Infrastructure
- Coal
- Steel
- Mining

Do not fabricate category membership.

---

# 33. Cost Driver Analysis

Analyze factors associated with cost escalation.

Possible dimensions:

- Project duration
- Milestone delays
- Expenditure patterns
- Sector
- Agency
- Project size
- Historical performance

Clearly distinguish association from causation.

---

# 34. PRODECHX Intelligence Assistant

Route:

`/intelligence`

Example questions:

- Which projects have the highest schedule risk?
- Why is Project X high risk?
- Show transport projects with more than 20% cost escalation.
- Compare energy and transport performance.
- Summarize this month's critical warnings.
- What delay reasons are mentioned in the April report?

---

# 35. RAG Architecture

```text
PAIMANA PDF
    ↓
Text Extraction
    ↓
Chunking
    ↓
Embeddings
    ↓
pgvector
    ↓
Retriever
    ↓
LLM
```

Store:

- document ID
- page number
- chunk text
- embedding
- metadata

Responses should cite relevant document/page sources where applicable.

---

# 36. Structured Queries vs RAG

Use database queries for structured questions:

> Show projects over ₹1,000 crore.

Use RAG for document questions:

> What reasons for delay were mentioned in the April report?

Use database + ML + RAG for:

> Why is Project ABC high risk?

Never allow unrestricted LLM-generated SQL to execute directly against the production database.

---

# 37. Natural-Language Analytics

User:

> Show critical transport projects with predicted delay above 12 months.

Flow:

```text
Natural Language
       ↓
Intent / Filter Parser
       ↓
Validated Query
       ↓
Database
       ↓
Results
```

Queries must respect RBAC.

---

# 38. Authentication and RBAC

Roles:

- SUPER_ADMIN
- MINISTRY_ADMIN
- PROJECT_OFFICER
- ANALYST
- VIEWER

Authorization must be enforced server-side.

---

# 39. Security

Implement:

- Secure authentication
- Password hashing
- RBAC
- Input validation
- Rate limiting
- API authorization
- Audit logging
- Secure file uploads
- Environment secrets
- SQL injection protection
- XSS protection

Never expose service-role credentials in frontend code.

---

# 40. Audit Logging

Track:

- User
- Action
- Resource
- Timestamp
- Previous value
- New value

Every important administrative/data change should be traceable.

---

# 41. Model Monitoring

Route:

`/model-performance`

Display:

- Model version
- Dataset period
- Training date
- Metrics
- Evaluation methodology
- Prediction distribution

Monitor:

- Data drift
- Feature drift
- False positives
- False negatives

---

# 42. UI/UX REQUIREMENTS

PRODECHX must look like a mature government/enterprise analytics application.

It must NOT look like a generic AI SaaS template.

## Avoid

- Purple AI gradients
- Neon colors
- Glassmorphism
- Huge rounded cards
- Giant hero sections
- Excessive animation
- Decorative AI illustrations
- Excessive shadows
- Fake statistics
- Generic AI marketing copy

## Prefer

- Neutral backgrounds
- Subtle borders
- Restrained colors
- Dense but readable layouts
- Professional typography
- Compact tables
- Clear status indicators
- Practical filters
- Predictable navigation

Primary desktop targets:

- 1366px
- 1440px

---

# 43. Typography

Use one professional sans-serif family:

- Inter
- IBM Plex Sans
- Source Sans 3

Suggested sizes:

- Page title: 24–28px
- Section: 17–20px
- Body: 14px
- Table: 13–14px
- Metadata: 12px

---

# 44. Tables

Tables are a core part of the application.

Support:

- Sticky header
- Search
- Filters
- Sorting
- Pagination
- Export
- Column visibility
- Row navigation

---

# 45. Charts

Every chart must answer a decision-making question.

Avoid charts that exist only for decoration.

Every chart should have:

- Clear title
- Context
- Units
- Tooltip
- Legend where required
- Time period
- Empty state
- Loading state

---

# 46. Accessibility

Implement:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible labels
- Adequate contrast
- Status information that is not communicated through color alone

---

# 47. Loading, Empty and Error States

Every major feature must support realistic:

- Loading state
- Empty state
- Error state
- Retry action

Never leave blank screens.

---

# 48. Synthetic Demo Data

When official structured data is unavailable, create clearly labelled synthetic data.

The interface must state:

`Demo environment — synthetic project records`

Never represent synthetic records as official MoSPI data.

---

# 49. Development Phases

## Phase 1 — Data Understanding

Read:

```text
PRD.md
data/paimana-pdfs/*
```

Produce:

```text
docs/PAIMANA_DATA_DICTIONARY.md
docs/DATABASE_SCHEMA.md
docs/PDF_INGESTION_ARCHITECTURE.md
docs/ML_DATASET_DESIGN.md
docs/RAG_ARCHITECTURE.md
docs/IMPLEMENTATION_PLAN.md
```

Do not build the frontend yet.

## Phase 2 — Database

Build:

- Supabase project
- migrations
- schema
- indexes
- RLS
- authentication
- roles
- synthetic seed data

## Phase 3 — PDF Ingestion

Build:

- PDF upload
- storage
- extraction
- table parsing
- OCR fallback
- validation
- project matching
- monthly updates
- document chunking
- embeddings

## Phase 4 — ML

Build:

- historical dataset
- feature engineering
- statistical baseline
- ML models
- evaluation
- SHAP
- prediction API
- model versioning

## Phase 5 — Dashboard

Build:

- Overview
- Projects
- Project Detail
- Analytics
- Ministry
- Sector

## Phase 6 — Early Warning

Build:

- risk engine
- alerts
- assignments
- intervention tracking
- notifications

## Phase 7 — AI Assistant

Build:

- RAG
- structured queries
- project intelligence
- source references
- permission-aware retrieval

## Phase 8 — QA

Test all workflows through browser and API.

## Phase 9 — Deployment

Containerize and document deployment.

---

# 50. Antigravity Integration

Recommended MCP connections:

1. GitHub
2. Supabase
3. Browser / Chrome DevTools
4. Optional Postman

Do not add unnecessary integrations until needed.

---

# 51. Git Workflow

Use:

```text
main

feature/database
feature/pdf-ingestion
feature/ml
feature/dashboard
feature/alerts
feature/ai-assistant
```

Commit after each working milestone.

Never let experimental agent changes directly destabilize main.

---

# 52. Engineering Rules

1. Do not generate fake functionality.
2. Do not fabricate ML metrics.
3. Do not fabricate source data.
4. Do not hardcode dashboard statistics.
5. Do not call arbitrary weighted rules AI.
6. Keep ML in a separate Python service.
7. Keep PDF ingestion separate from the frontend.
8. Keep structured data separate from document/RAG data.
9. Preserve document provenance.
10. Enforce RBAC server-side.
11. Never expose secrets in client code.
12. Do not allow unrestricted AI-generated SQL.
13. Every visible feature should actually work.
14. Prefer reliable functionality over decorative UI.
15. Build and test one phase at a time.

---

# 53. Final Demo Flow

The ideal SIH demonstration:

```text
1. Admin logs in
        ↓
2. National dashboard
        ↓
3. High-risk project identified
        ↓
4. Open project
        ↓
5. AI predicts delay/cost risk
        ↓
6. SHAP explains risk
        ↓
7. Historical project comparison
        ↓
8. Early warning generated
        ↓
9. Officer receives/assigns alert
        ↓
10. Open PAIMANA source evidence
        ↓
11. Ask PRODECHX Intelligence
        ↓
12. AI answers using database + ML + PAIMANA evidence
```

Core story:

**Data → Prediction → Explanation → Evidence → Warning → Intervention**

---

# 54. Definition of Done

PRODECHX is considered complete only when:

- PAIMANA PDFs can be uploaded.
- Original PDFs are stored safely.
- Duplicate PDFs are detected.
- PDF content can be extracted.
- Extracted records are validated.
- Projects are matched across monthly reports.
- Historical project timelines are created.
- Data can be queried from PostgreSQL.
- Cost prediction works using evaluated models.
- Delay prediction works using evaluated models.
- Risk scores are generated.
- Risk drivers are explainable.
- Early warnings are generated.
- Alerts can be assigned and resolved.
- Projects can be benchmarked.
- PAIMANA documents can be searched.
- AI assistant answers are grounded.
- Source references are shown where applicable.
- RBAC works.
- Audit logs work.
- Dashboard uses real backend data.
- No critical browser/API errors remain.
- Deployment documentation exists.

---

# 55. Product Positioning

PRODECHX should be presented as:

> **An explainable predictive intelligence layer for infrastructure project monitoring.**

Not:

> "An AI dashboard."

The core value proposition is:

> **PRODECHX converts historical and continuously updated infrastructure project data into early warnings, explainable risk predictions, evidence-backed insights, and actionable intervention intelligence.**

---

# 56. Antigravity Build Principle

DO NOT ask Antigravity to build the entire application in one prompt.

Build in this order:

```text
DATA
 ↓
DATABASE
 ↓
PDF INGESTION
 ↓
HISTORICAL DATA
 ↓
ML
 ↓
RISK ENGINE
 ↓
DASHBOARD
 ↓
ALERTS
 ↓
RAG
 ↓
AI ASSISTANT
 ↓
QA
 ↓
DEPLOYMENT
```

The first task after loading this PRD is **data understanding**, not dashboard generation.

