# PRODECHX — PAIMANA RAG Architecture & Vector Indexing Specification

> **Document Version:** 1.0.0  
> **Author:** Lead AI Systems & RAG Architect, PRODECHX  
> **Date:** August 24, 2026

---

## 1. Vector Space & Embedding Model Specification

- **Embedding Model**: `sentence-transformers/all-MiniLM-L6-v2`
- **Embedding Dimension**: **384 dimensions**
- **License**: Apache 2.0
- **Compute Requirements**: ~120 MB RAM, lightweight CPU inference (~15 ms / chunk)
- **Database Column**: `document_chunks.embedding` (`vector(384)` in Supabase PostgreSQL 17.6)
- **Vector Index**: HNSW Cosine Similarity Index (`idx_document_chunks_embedding`)

---

## 2. Chunking & Metadata Enrichment

- **Source Ingestion**: PyMuPDF page-aware chunking over `FlashReport_April2026.pdf`, `FlashReport_May2026.pdf`, `FlashReport_June_2026.pdf`.
- **Chunk Count**: **487 embedded 384-dim chunks**.
- **Metadata Attributes**: `document_id`, `page_id`, `report_year`, `report_month`, `period`, `page_number`, `project_code`, `source_filename`.

---

## 3. Hybrid Retrieval & Multi-Tool Routing

```
User Query
   │
   ▼
Query Classification & Intent Router
   ├── Structured SQL Aggregations (Counts, Sector Totals) ──► Supabase PostgreSQL
   ├── Risk & SHAP Attributions (Model Predictions) ──────────► RandomForest v2.0
   └── Contextual Report Text ─────────────────────────────────► Hybrid RAG Search (Vector(384) + BM25 + Code Filter)
   │
   ▼
Grounded Provider & Synthesizer Engine
   │
   ▼
Output + Factual Response + [PAIMANA Report, p. XX] Citations
```
