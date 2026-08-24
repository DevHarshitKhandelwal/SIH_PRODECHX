# PRODECHX — Technical Implementation Plan

> **Document Version:** 1.0.0  
> **Author:** Lead Architect, PRODECHX  
> **Target Timeline:** Phase 1 Complete — Ready for Phase 2 Implementation  
> **Primary Reference:** `PRODECHX_PRD.md` (Phases 1 through 9)

---

## Executive Summary & Plan Goal

PRODECHX is an explainable, predictive infrastructure project intelligence platform designed for the Ministry of Statistics and Programme Implementation (MoSPI). 

This Implementation Plan outlines the precise sequence of engineering deliverables required to move from **Phase 1 (Data Understanding & Architecture Analysis)** into complete system construction.

---

## Project Roadmap & Phase Dependencies

```text
[Phase 1: Data Discovery] (COMPLETED)
           │
           v
[Phase 2: Supabase Database Setup & Seeds]
           │
           v
[Phase 3: Automated PDF Ingestion Pipeline]
           │
           v
[Phase 4: Historical Dataset & Python ML Engine]
           │
           v
[Phase 5: Early Warning & Risk Engine]
           │
           v
[Phase 6: Next.js National Dashboard & UI/UX]
           │
           v
[Phase 7: RAG & AI Intelligence Assistant]
           │
           v
[Phase 8: End-to-End QA & System Testing]
           │
           v
[Phase 9: Docker Containerization & Deployment]
```

---

## Detailed Phase Breakdown

### Phase 1 — Data Understanding & Architecture Analysis (COMPLETED)
- [x] Read `PRODECHX_PRD.md` completely.
- [x] Inspect all PAIMANA Flash Report PDFs (`April2026.pdf`, `May2026.pdf`, `June2026.pdf`).
- [x] Determine page counts, text extractability, table structures, and field formats.
- [x] Develop project matching & deduplication strategy.
- [x] Produce architecture & data documentation:
  - `docs/PAIMANA_DATA_DICTIONARY.md`
  - `docs/PDF_ANALYSIS.md`
  - `docs/DATABASE_SCHEMA_PROPOSAL.md`
  - `docs/PDF_INGESTION_ARCHITECTURE.md`
  - `docs/ML_DATASET_PROPOSAL.md`
  - `docs/RAG_ARCHITECTURE.md`
  - `docs/IMPLEMENTATION_PLAN.md`

---

### Phase 2 — Supabase PostgreSQL Database Setup
- [ ] Initialize Supabase PostgreSQL project / local PostgreSQL database.
- [ ] Enable `uuid-ossp`, `vector`, and `pg_trgm` extensions.
- [ ] Execute database migrations based on `DATABASE_SCHEMA_PROPOSAL.md`.
- [ ] Implement Row-Level Security (RLS) policies and RBAC roles (`SUPER_ADMIN`, `MINISTRY_ADMIN`, `PROJECT_OFFICER`, `ANALYST`, `VIEWER`).
- [ ] Seed base lookup tables (`ministries`, `sectors`, `agencies`).
- [ ] Seed initial database with parsed PAIMANA project records from April, May, and June 2026.

---

### Phase 3 — Automated PDF Ingestion Pipeline
- [ ] Build Python `services/ingestion` worker module.
- [ ] Implement SHA-256 duplicate PDF detector and Supabase Storage bucket uploader.
- [ ] Implement multi-line block parsing algorithm using `pymupdf` / `pdfplumber`.
- [ ] Implement data quality validation score engine.
- [ ] Implement multi-stage project matching & deduplication engine (Exact Code -> Legacy Code -> Fuzzy Jaro-Winkler -> Manual Review Queue).
- [ ] Implement text chunking (500 tokens) and embedding generation (`text-embedding-3-small` / `pgvector`).

---

### Phase 4 — Python Machine Learning Engine
- [ ] Construct longitudinal feature store dataset from `projects` and `project_updates`.
- [ ] Train & evaluate Cost Overrun Classification models (Logistic Regression, Random Forest, XGBoost).
- [ ] Train & evaluate Schedule Delay Regression models (Linear Regression, Random Forest, LightGBM).
- [ ] Implement SHAP explainability module to compute feature contribution scores per project.
- [ ] Build FastAPI prediction service (`services/ml`) serving `/predict`, `/explain`, and `/evaluate` endpoints.
- [ ] Create Model Performance monitoring dashboard schema.

---

### Phase 5 — Early Warning & Risk Engine
- [ ] Build automated early-warning rule trigger engine (Cost escalation, Schedule delay, Progress stagnation, Financial-Physical gap anomaly).
- [ ] Implement alert lifecycle state machine (`DETECTED` -> `ASSIGNED` -> `ACKNOWLEDGED` -> `ACTION_INITIATED` -> `RESOLVED`).
- [ ] Build alert assignment and intervention logging module in backend API.

---

### Phase 6 — PRODECHX Next.js Enterprise Dashboard
- [ ] Initialize Next.js 14+ app (`apps/web`) with Tailwind CSS, IBM Plex Sans font, and Lucide icons.
- [ ] Build `/dashboard` (National Overview with KPIs, Risk Distribution, High-Risk Project Table).
- [ ] Build `/projects/[id]` (Detailed Project View with Overview, Financials, Timeline, Risk Panel, SHAP Drivers, Source Evidence).
- [ ] Build `/admin/documents` (PDF Upload, Processing Status, Extraction Summary, Manual Review Queue).
- [ ] Build `/ministry-analytics` and `/sector-analytics` views.

---

### Phase 7 — RAG & PRODECHX AI Intelligence Assistant
- [ ] Build `/intelligence` chat interface.
- [ ] Implement Query Router (Intent Classification: Structured Query vs Document RAG vs Hybrid ML).
- [ ] Implement Supabase `pgvector` Hybrid Search retriever (BM25 + Cosine Vector similarity).
- [ ] Implement LLM synthesis pipeline with mandatory page citation generator (`[Source: <File>, Page <N>]`).
- [ ] Enforce server-side RBAC scoping on retrieval.

---

### Phase 8 — End-to-End QA & Verification
- [ ] Run full ingestion pipeline test on all 3 PAIMANA PDFs.
- [ ] Verify zero regression on database state and complete data lineage provenance.
- [ ] Test browser UI across 1366px and 1440px enterprise desktop resolutions.
- [ ] Validate model performance metrics against baselines.

---

### Phase 9 — Docker Containerization & Deployment Documentation
- [ ] Create `docker-compose.yml` orchestrating `apps/web`, `apps/api`, `services/ml`, and `services/ingestion`.
- [ ] Produce `README.md` and deployment guide.
