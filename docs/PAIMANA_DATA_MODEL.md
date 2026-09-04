# PRODECHX — Normalized PAIMANA Data Model Specification

> **Document Version:** 2.0.0  
> **Author:** Lead Database Architect, PRODECHX  
> **Date:** August 24, 2026

---

## 1. Entity-Relationship Schema & Architecture

The PRODECHX database model is structured in **Third Normal Form (3NF)** for operational data integrity and data lineage.

```text
               +-------------------+
               |     documents     |
               +---------+---------+
                         |
                         +-----------------------+
                         |                       |
                         v                       v
               +------------------+    +------------------+
               |  document_pages  |    |  document_chunks | (deferred embedding)
               +---------+--------+    +------------------+
                         |
                         v
               +------------------+
               |     projects     | <----+
               +---------+--------+      |
                         |               |
         +---------------+---------------+----------------+
         |                |               |                |
         v                v               v                v
+---------------+ +--------------+ +-----------+ +-------------------+
|project_updates| |data_quality_ | |extraction_| |    audit_logs     |
+---------------+ |   issues     | |   logs    | +-------------------+
                  +--------------+ +-----------+
```

---

## 2. Lookup Tables (Ministries, Sectors, Agencies)

### 1. `ministries` (Parent Line Ministries)
- `id` UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- `name` VARCHAR(255) **UNIQUE** NOT NULL (e.g. `Ministry of Coal`, `Ministry of Railways`)
- `code` VARCHAR(50) (e.g. `MOC`, `MOR`, `MORTH`)
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 2. `sectors` (Harmonized Master List Sectors)
- `id` UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- `name` VARCHAR(255) **UNIQUE** NOT NULL (e.g. `Transport & Logistics`, `Energy`, `Coal`, `Railways`)
- `hml_category` VARCHAR(100)
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 3. `agencies` (Implementing PSUs / Departments)
- `id` UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- `name` VARCHAR(255) **UNIQUE** NOT NULL (e.g. `South Eastern Coalfields Limited [SECL]`, `Airport Authority of India [AAI]`)
- `abbreviation` VARCHAR(50) (e.g. `SECL`, `AAI`, `NLCIL`, `POWERGRID`)
- `ministry_id` UUID REFERENCES ministries(id) ON DELETE SET NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

---

## 3. Core Relational & Document Tables

### 4. `documents` (PDF Document Lineage & Uniqueness)
- `id` UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- `file_name` VARCHAR(255) NOT NULL
- `storage_path` VARCHAR(512) **UNIQUE** NOT NULL
- `checksum_sha256` VARCHAR(64) **UNIQUE** NOT NULL
- `document_type` VARCHAR(50) DEFAULT 'PAIMANA_FLASH_REPORT'
- `report_month` INT NOT NULL CHECK (report_month BETWEEN 1 AND 12)
- `report_year` INT NOT NULL CHECK (report_year BETWEEN 2000 AND 2100)
- `total_pages` INT NOT NULL DEFAULT 0
- `projects_detected` INT DEFAULT 0
- `processing_status` document_status NOT NULL DEFAULT 'UPLOADED'
- `uploaded_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 5. `document_pages` (Page-Level Text & Mapping)
- `id` UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- `document_id` UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE
- `physical_page_number` INT NOT NULL
- `printed_page_number` VARCHAR(20)
- `raw_text` TEXT
- `has_tables` BOOLEAN DEFAULT TRUE
- **CONSTRAINT**: `uq_document_pages_physical` **UNIQUE(document_id, physical_page_number)**

### 6. `document_chunks` (RAG Text Chunks)
- `id` UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- `document_id` UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE
- `page_number` INT NOT NULL
- `chunk_index` INT NOT NULL
- `chunk_text` TEXT NOT NULL
- `metadata` JSONB
- *Embedding Note*: `embedding` vector column definition is **deferred** from base migrations until exact model (e.g. 1536-dim vs 768-dim) is finalized.

### 7. `projects` (Master Project Identity Register)
- `id` UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- `project_code` VARCHAR(50) **UNIQUE** NOT NULL -- 6-digit PAIMANA Code (Primary match anchor)
- `legacy_ocms_code` VARCHAR(50)
- `pmgid` VARCHAR(50)
- `project_name` VARCHAR(500) NOT NULL
- `ministry_id` UUID NOT NULL REFERENCES ministries(id)
- `sector_id` UUID NOT NULL REFERENCES sectors(id)
- `agency_id` UUID REFERENCES agencies(id) ON DELETE SET NULL
- `state_name` VARCHAR(100)
- `date_of_approval` DATE
- `original_start_date` DATE
- `original_doc` DATE
- `original_cost` DECIMAL(15,2) NOT NULL CHECK (original_cost > 0)
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()
- `updated_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 8. `project_updates` (Monthly Observation Snapshots)
- `id` UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- `project_id` UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE
- `document_id` UUID REFERENCES documents(id) ON DELETE SET NULL
- `serial_number` INT NOT NULL -- PAIMANA Sl.No in Table 6
- `source_physical_page` INT
- `source_printed_page` VARCHAR(20)
- `report_month` INT NOT NULL CHECK (report_month BETWEEN 1 AND 12)
- `report_year` INT NOT NULL CHECK (report_year BETWEEN 2000 AND 2100)
- `report_date` DATE NOT NULL
- `revised_cost` DECIMAL(15,2) -- NULL if '-' in source PDF; may be < original_cost
- `cumulative_expenditure` DECIMAL(15,2) NOT NULL DEFAULT 0.00
- `physical_progress_pct` DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (physical_progress_pct BETWEEN 0.00 AND 100.00)
- `revised_doc` DATE -- NULL if '(-)' in source PDF
- `cost_overrun_amount` DECIMAL(15,2) GENERATED ALWAYS AS (GREATEST(0, COALESCE(revised_cost, original_cost_snap) - original_cost_snap)) STORED
- `original_cost_snap` DECIMAL(15,2) NOT NULL CHECK (original_cost_snap > 0)
- `data_quality_score` INT DEFAULT 100 CHECK (data_quality_score BETWEEN 0 AND 100)
- **CONSTRAINT**: `uq_project_updates_timeline` **UNIQUE(project_id, report_year, report_month)**

### 9. `data_quality_issues` (Data Validation Defect Log)
- `id` UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- `document_id` UUID REFERENCES documents(id) ON DELETE CASCADE
- `project_code` VARCHAR(50)
- `serial_number` INT
- `field_name` VARCHAR(100) NOT NULL
- `issue_category` VARCHAR(100) NOT NULL (e.g. `COST_REDUCTION_OBSERVED`, `MISSING_DATE`)
- `severity` VARCHAR(20) NOT NULL ('INFO', 'WARNING', 'CRITICAL')
- `description` TEXT NOT NULL
- `created_at` TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 10. `extraction_logs` (Ingestion Lineage & Performance)
- `id` UUID PRIMARY KEY DEFAULT uuid_generate_v4()
- `document_id` UUID REFERENCES documents(id) ON DELETE CASCADE
- `stage` VARCHAR(100) NOT NULL
- `status` VARCHAR(50) NOT NULL
- `rows_extracted` INT
- `message` TEXT
- `execution_time_ms` INT
- `timestamp` TIMESTAMPTZ NOT NULL DEFAULT NOW()
