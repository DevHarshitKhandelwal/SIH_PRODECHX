# PRODECHX — Database Schema Proposal

> **Document Version:** 1.0.0  
> **Author:** Lead Database Architect, PRODECHX  
> **Target Database Engine:** Supabase PostgreSQL 15+ with `pgvector` extension  
> **Design Pattern:** Third Normal Form (3NF) for Core Relational Entities + Vector Extensions for RAG

---

## 1. Entity-Relationship Overview

```text
               +-------------------+
               |     documents     |
               +---------+---------+
                         |
                         +-----------------------+
                         |                       |
                         v                       v
               +------------------+    +------------------+
               |  document_pages  |    |  document_chunks | (pgvector)
               +---------+--------+    +------------------+
                         |
                         v
               +------------------+
               |     projects     | <----+
               +---------+--------+      |
                         |               |
        +----------------+---------------+----------------+
        |                |               |                |
        v                v               v                v
+---------------+ +--------------+ +-----------+ +------------------+
|project_updates| |project_fin.  | |risk_pred. | |     alerts       |
+---------------+ +--------------+ +-----+-----+ +--------+---------|
                                         |                |
                                         v                v
                                  +--------------+ +------------------+
                                  | risk_factors | |  alert_actions   |
                                  +--------------+ +------------------+
```

---

## 2. PostgreSQL DDL Schema Script

```sql
-- Enable necessary PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- -----------------------------------------------------------------------------
-- 1. USER MANAGEMENT & RBAC
-- -----------------------------------------------------------------------------

CREATE TYPE user_role AS ENUM (
    'SUPER_ADMIN',
    'MINISTRY_ADMIN',
    'PROJECT_OFFICER',
    'ANALYST',
    'VIEWER'
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'VIEWER',
    ministry_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. ORGANIZATIONAL LOOKUPS (Ministries, Sectors, Agencies)
-- -----------------------------------------------------------------------------

CREATE TABLE ministries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    code VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    hml_category VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    abbreviation VARCHAR(50),
    ministry_id UUID REFERENCES ministries(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. DOCUMENT MANAGEMENT & INGESTION LINEAGE
-- -----------------------------------------------------------------------------

CREATE TYPE document_status AS ENUM (
    'UPLOADED',
    'PROCESSING',
    'EXTRACTING',
    'VALIDATING',
    'COMPLETED',
    'FAILED',
    'REVIEW_REQUIRED'
);

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(255) NOT NULL,
    storage_path VARCHAR(512) UNIQUE NOT NULL,
    checksum_sha256 VARCHAR(64) UNIQUE NOT NULL,
    document_type VARCHAR(50) DEFAULT 'PAIMANA_FLASH_REPORT',
    report_month INT NOT NULL CHECK (report_month BETWEEN 1 AND 12),
    report_year INT NOT NULL CHECK (report_year BETWEEN 2000 AND 2100),
    total_pages INT NOT NULL DEFAULT 0,
    projects_detected INT DEFAULT 0,
    processing_status document_status NOT NULL DEFAULT 'UPLOADED',
    error_log TEXT,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE TABLE document_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    raw_text TEXT,
    has_images BOOLEAN DEFAULT FALSE,
    has_tables BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(document_id, page_number)
);

CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding VECTOR(1536), -- Standard OpenAI / Supabase pgvector dimension
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. CORE PROJECT ENTITIES & MONTHLY TIMELINES
-- -----------------------------------------------------------------------------

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_code VARCHAR(50) UNIQUE NOT NULL, -- 6-digit PAIMANA Code (Primary)
    legacy_ocms_code VARCHAR(50),
    pmgid VARCHAR(50),
    project_name VARCHAR(500) NOT NULL,
    ministry_id UUID NOT NULL REFERENCES ministries(id),
    sector_id UUID NOT NULL REFERENCES sectors(id),
    agency_id UUID REFERENCES agencies(id),
    state_name VARCHAR(100),
    date_of_approval DATE,
    original_start_date DATE,
    original_doc DATE,
    original_cost DECIMAL(15,2) NOT NULL CHECK (original_cost > 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE project_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    source_page_number INT,
    report_month INT NOT NULL,
    report_year INT NOT NULL,
    report_date DATE NOT NULL,
    
    -- Source Values from PDF
    revised_cost DECIMAL(15,2),
    cumulative_expenditure DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    physical_progress_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    revised_doc DATE,
    project_status_text VARCHAR(100) DEFAULT 'Ongoing',
    
    -- Derived Metrics
    cost_overrun_amount DECIMAL(15,2) GENERATED ALWAYS AS (GREATEST(0, revised_cost - original_cost_snap)) STORED,
    cost_overrun_pct DECIMAL(5,2),
    financial_progress_pct DECIMAL(5,2),
    schedule_delay_months INT,
    physical_financial_gap DECIMAL(5,2),
    monthly_progress_velocity DECIMAL(5,2),
    data_quality_score INT DEFAULT 100,
    
    -- Snapshot values
    original_cost_snap DECIMAL(15,2) NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, report_year, report_month)
);

-- -----------------------------------------------------------------------------
-- 5. ML PREDICTIONS & EXPLAINABILITY
-- -----------------------------------------------------------------------------

CREATE TABLE risk_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    project_update_id UUID REFERENCES project_updates(id) ON DELETE CASCADE,
    prediction_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    model_version VARCHAR(50) NOT NULL,
    
    cost_overrun_probability DECIMAL(5,4),
    predicted_cost_overrun_pct DECIMAL(5,2),
    predicted_final_cost DECIMAL(15,2),
    
    schedule_delay_probability DECIMAL(5,4),
    predicted_delay_months DECIMAL(5,2),
    predicted_completion_date DATE,
    
    composite_risk_score INT CHECK (composite_risk_score BETWEEN 0 AND 100),
    risk_level VARCHAR(20) CHECK (risk_level IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')),
    
    shap_summary JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE risk_factors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prediction_id UUID NOT NULL REFERENCES risk_predictions(id) ON DELETE CASCADE,
    factor_name VARCHAR(255) NOT NULL,
    factor_category VARCHAR(100),
    importance_score DECIMAL(7,4) NOT NULL,
    impact_direction VARCHAR(20) CHECK (impact_direction IN ('INCREASES_RISK', 'DECREASES_RISK')),
    description TEXT
);

-- -----------------------------------------------------------------------------
-- 6. EARLY WARNING ENGINE & ALERTS
-- -----------------------------------------------------------------------------

CREATE TYPE alert_severity AS ENUM ('INFO', 'WATCH', 'WARNING', 'CRITICAL');
CREATE TYPE alert_status AS ENUM ('DETECTED', 'ASSIGNED', 'ACKNOWLEDGED', 'ACTION_INITIATED', 'RESOLVED');

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    prediction_id UUID REFERENCES risk_predictions(id) ON DELETE SET NULL,
    alert_type VARCHAR(100) NOT NULL,
    severity alert_severity NOT NULL DEFAULT 'WARNING',
    status alert_status NOT NULL DEFAULT 'DETECTED',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    assigned_officer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE alert_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    performed_by UUID NOT NULL REFERENCES users(id),
    previous_status alert_status,
    new_status alert_status NOT NULL,
    action_notes TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. AUDIT LOGGING & SECURITY
-- -----------------------------------------------------------------------------

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    previous_state JSONB,
    new_state JSONB,
    ip_address VARCHAR(45),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. INDEXES FOR HIGH-PERFORMANCE QUERYING & VECTOR SEARCH
-- -----------------------------------------------------------------------------

CREATE INDEX idx_projects_code ON projects(project_code);
CREATE INDEX idx_projects_ministry ON projects(ministry_id);
CREATE INDEX idx_projects_sector ON projects(sector_id);
CREATE INDEX idx_project_updates_timeline ON project_updates(project_id, report_year, report_month);
CREATE INDEX idx_risk_predictions_latest ON risk_predictions(project_id, prediction_timestamp DESC);
CREATE INDEX idx_alerts_status_severity ON alerts(status, severity);

-- HNSW Vector Index for Fast RAG Cosine Similarity Retrieval
CREATE INDEX idx_document_chunks_embedding ON document_chunks 
USING hnsw (embedding vector_cosine_ops);
```
