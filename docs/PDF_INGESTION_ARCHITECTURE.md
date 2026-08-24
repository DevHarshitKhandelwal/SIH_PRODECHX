# PRODECHX — PDF Ingestion Architecture Specification

> **Document Version:** 1.0.0  
> **Author:** Lead Data Engineer & Architect, PRODECHX  
> **Module Name:** `services/ingestion`  
> **Primary Technology Stack:** Python 3.11, PyMuPDF (`pymupdf`), `pdfplumber`, Supabase Storage, PostgreSQL 15, `pgvector`

---

## 1. High-Level Ingestion Pipeline Flow

```text
[PDF Upload] ──> [SHA-256 Checksum] ──> [Supabase Storage]
                                                │
                                                v
[Project Matching Cascade] <── [Validation] <── [Table & Line Extraction]
       │
       ├──> High-Confidence Match (>= 88%) ──> [Upsert Project & Append `project_updates`]
       │
       └──> Low-Confidence / Ambiguous ─────> [Manual Review Queue]
                                                │
                                                v
[Document Chunking (500 tokens)] ──> [Embeddings (OpenAI)] ──> [pgvector Storage]
```

---

## 2. Ingestion Stages & Step-by-Step Processing Rules

### Stage 1: Document Upload & Cryptographic Checksumming
1. **File Reception**: User uploads a PAIMANA PDF via `/admin/documents` dashboard or automated API ingestion worker.
2. **SHA-256 Checksum Calculation**: The ingestion service computes the SHA-256 hash of the incoming binary file.
3. **Duplicate Check**: Query `documents` table by `checksum_sha256`.
   - If checksum exists: Abort ingestion and return `Duplicate Document Detected` with a link to the existing document record.
   - If unique: Upload file to Supabase Storage bucket `paimana-documents/YYYY/MM/<filename>.pdf`.
4. **Database Record Creation**: Insert initial record into `documents` table with status `UPLOADED`.

---

### Stage 2: Digital Text Extraction & Structure Detection
1. **PyMuPDF Document Load**: Load document in memory via `fitz.open(stream)`.
2. **Page Text Breakdown**: Loop over all pages (`1` to `N`).
   - Extract raw text per page using `page.get_text("text")`.
   - Store page record in `document_pages` table.
3. **Table Block Grouping**: Detect Table 6 ("All Ongoing Projects"), Table 5 ("North Eastern Region"), Table 4 ("Newly Added"), and Table 3 ("Completed") headers on each page.

---

### Stage 3: Multi-Line Table Parsing Algorithm
Each project entry in Table 6 spans 2 to 4 visual text lines. The ingestion worker parses project blocks using Regex-anchored sliding window extraction:

```python
# Project Entry Anchor Regex
PROJ_ANCHOR_REGEX = re.compile(r'^\s*(\d{1,4})\s*\(([\d]{4,7})\)')
CODES_PARENS_REGEX = re.compile(r'\((N?[\d\w]{6,14}|-)\)\s*\(([\d]{2,7}|-)\)')
DATES_REGEX = re.compile(r'\b(\d{2}/\d{4}|NA)\b')
DATES_PARENS_REGEX = re.compile(r'\(([\d]{2}/[\d]{4}|-)\)')
NUMERIC_FLOATS_REGEX = re.compile(r'\b(\d+\.\d+|\d+)\b')
```

Field Extraction Rules:
- **`sl_no`**: Extracted from anchor group 1.
- **`project_code`**: Extracted from anchor group 2 (6-digit numeric string).
- **`legacy_ocms_code`**: Extracted from secondary code match group 1 (if not `-`).
- **`pmgid`**: Extracted from secondary code match group 2 (if not `-`).
- **`project_name`**: Text string adjacent to Sl.No.
- **`agency_name`**: Text string in parentheses on line 2 below project name.
- **`original_cost`**: Upper float value in Cost column.
- **`revised_cost`**: Lower float value in Cost column (enclosed in parens).
- **`cumulative_expenditure`**: Float value in Expenditure column.
- **`physical_progress_pct`**: Float value in Progress column.
- **`approval_date`**: Top date string in Date column.
- **`start_date`**: Parens date string in Date column.
- **`original_doc`**: Top date string in DoC column.
- **`revised_doc`**: Parens date string in DoC column.

---

### Stage 4: Data Validation & Data Quality Scoring
Before inserting into the database, every extracted project record passes through automated quality filters:

1. **Range & Logic Checks**:
   - `original_cost > 0.00`
   - `revised_cost >= 0.00`
   - `cumulative_expenditure >= 0.00`
   - `0.00 <= physical_progress_pct <= 100.00`
   - `approval_date <= start_date <= original_doc`
2. **Quality Penalty Calculation**:
   - Missing `start_date`: -10 points.
   - Missing `legacy_ocms_code`: -5 points.
   - `physical_financial_gap > 40.0%`: -15 points (Flagged as anomaly).
3. **Resulting Score**: `data_quality_score` (0 to 100). Records with score < 60 trigger a non-blocking ingestion warning.

---

### Stage 5: Controlled Project Matching & Deduplication Cascade
To maintain historical continuity across monthly reports without creating duplicate projects:

```python
def match_and_upsert_project(extracted_record, report_metadata):
    # Step 1: Match by Primary Project Code
    project = db.query(Project).filter_by(project_code=extracted_record.project_code).first()
    
    if not project and extracted_record.legacy_ocms_code:
        # Step 2: Match by Legacy OCMS Code
        project = db.query(Project).filter_by(legacy_ocms_code=extracted_record.legacy_ocms_code).first()
        
    if not project:
        # Step 3: Fuzzy Match on Normalized Name + Agency + Ministry
        candidates = db.query(Project).filter_by(ministry_id=extracted_record.ministry_id).all()
        for cand in candidates:
            sim = calculate_jaro_winkler_similarity(
                f"{extracted_record.project_name} {extracted_record.agency_name}",
                f"{cand.project_name} {cand.agency_name}"
            )
            if sim >= 0.88:
                project = cand
                break
            elif 0.70 <= sim < 0.88:
                # Ambiguous match -> Queue for Manual Review
                return send_to_manual_review_queue(extracted_record, cand, sim)
                
    if not project:
        # Create New Master Project
        project = create_new_project(extracted_record)
        
    # Append Monthly Update Record (Never overwrite master history)
    append_project_update(project.id, extracted_record, report_metadata)
```

---

### Stage 6: Data Lineage & Provenance Recording
Every `project_update` row stores exact provenance fields:
- `document_id`: UUID reference to source PDF in `documents` table.
- `source_page_number`: Specific page number where record appeared (e.g. `April2026.pdf:Page 55`).

---

### Stage 7: Text Chunking & Embeddings for RAG Architecture
1. **Text Chunking**: The ingestion engine splits the raw extracted text of each page into overlapping chunks:
   - Chunk Size: **500 words / tokens**
   - Chunk Overlap: **50 words / tokens**
2. **Metadata Injection**: Each chunk is prefixed with contextual metadata:  
   `[Document: FlashReport_April2026.pdf | Page: 55 | Ministry: Ministry of Coal | Section: Table 6]`
3. **Embedding Generation**: Vector embedding generated via OpenAI `text-embedding-3-small` API (1536 float dimensions).
4. **Vector Storage**: Insert chunk text, metadata JSONB, and embedding vector into `document_chunks` table in Supabase PostgreSQL.
