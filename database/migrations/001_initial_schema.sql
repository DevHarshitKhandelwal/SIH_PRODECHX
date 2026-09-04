-- PRODECHX — Migration 001: Normalized 21-Table Initial Schema
-- Target Database Engine: Supabase PostgreSQL 15+

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- -----------------------------------------------------------------------------
-- 1. ENUM TYPES
-- -----------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE document_status AS ENUM (
        'UPLOADED',
        'PROCESSING',
        'EXTRACTING',
        'VALIDATING',
        'COMPLETED',
        'FAILED',
        'REVIEW_REQUIRED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE alert_severity AS ENUM (
        'INFO',
        'WATCH',
        'WARNING',
        'CRITICAL'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE alert_status AS ENUM (
        'DETECTED',
        'ASSIGNED',
        'ACKNOWLEDGED',
        'ACTION_INITIATED',
        'RESOLVED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE quality_issue_severity AS ENUM (
        'INFO',
        'WARNING',
        'CRITICAL'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE quality_issue_status AS ENUM (
        'OPEN',
        'INVESTIGATING',
        'RESOLVED',
        'IGNORED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- -----------------------------------------------------------------------------
-- 2. LOOKUP TABLES (MINISTRIES, SECTORS, AGENCIES, STATES)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ministries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    code VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    hml_category VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    abbreviation VARCHAR(50),
    ministry_id UUID REFERENCES ministries(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(10) UNIQUE,
    type VARCHAR(30) DEFAULT 'STATE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. USER MANAGEMENT & RBAC TABLES
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    ministry_id UUID REFERENCES ministries(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- -----------------------------------------------------------------------------
-- 4. DOCUMENT MANAGEMENT & RAG STORAGE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS documents (
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

CREATE TABLE IF NOT EXISTS document_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    physical_page_number INT NOT NULL,
    printed_page_number VARCHAR(20),
    page_text TEXT,
    extraction_status VARCHAR(50) DEFAULT 'COMPLETED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_document_pages_physical UNIQUE(document_id, physical_page_number)
);

CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    page_id UUID REFERENCES document_pages(id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. CORE PROJECTS & MONTHLY TIMELINE UPDATES
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_code VARCHAR(50) UNIQUE NOT NULL,
    legacy_ocms_code VARCHAR(50),
    pmgid VARCHAR(50),
    project_name VARCHAR(500) NOT NULL,
    ministry_id UUID NOT NULL REFERENCES ministries(id),
    sector_id UUID NOT NULL REFERENCES sectors(id),
    agency_id UUID REFERENCES agencies(id) ON DELETE SET NULL,
    state_id UUID REFERENCES states(id) ON DELETE SET NULL,
    state_name VARCHAR(100),
    date_of_approval DATE,
    original_start_date DATE,
    original_doc DATE,
    original_cost DECIMAL(15,2) NOT NULL CHECK (original_cost > 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    serial_number INT NOT NULL,
    source_physical_page INT,
    source_printed_page VARCHAR(20),
    report_month INT NOT NULL CHECK (report_month BETWEEN 1 AND 12),
    report_year INT NOT NULL CHECK (report_year BETWEEN 2000 AND 2100),
    report_date DATE NOT NULL,
    revised_cost DECIMAL(15,2),
    cumulative_expenditure DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    physical_progress_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (physical_progress_pct BETWEEN 0.00 AND 100.00),
    revised_doc DATE,
    project_status_text VARCHAR(100) DEFAULT 'Ongoing',
    original_cost_snap DECIMAL(15,2) NOT NULL CHECK (original_cost_snap > 0),
    cost_overrun_amount DECIMAL(15,2) GENERATED ALWAYS AS (GREATEST(0, COALESCE(revised_cost, original_cost_snap) - original_cost_snap)) STORED,
    data_quality_score INT DEFAULT 100 CHECK (data_quality_score BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_project_updates_timeline UNIQUE(project_id, report_year, report_month)
);

CREATE TABLE IF NOT EXISTS project_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_name VARCHAR(255) NOT NULL,
    target_date DATE,
    actual_date DATE,
    status VARCHAR(50) DEFAULT 'PLANNED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. EXTRACTION LOGS & DATA QUALITY ISSUES
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS extraction_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    stage VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    rows_extracted INT DEFAULT 0,
    message TEXT,
    execution_time_ms INT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_quality_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_type VARCHAR(100) NOT NULL,
    severity quality_issue_severity NOT NULL DEFAULT 'WARNING',
    status quality_issue_status NOT NULL DEFAULT 'OPEN',
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    project_update_id UUID REFERENCES project_updates(id) ON DELETE CASCADE,
    source_document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    source_page INT,
    field_name VARCHAR(100),
    source_value TEXT,
    normalized_value TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. MODEL VERSIONS, RISK PREDICTIONS & EXPLAINABILITY
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS model_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version_name VARCHAR(100) UNIQUE NOT NULL,
    model_type VARCHAR(100) NOT NULL,
    metrics_summary JSONB,
    trained_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS risk_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    project_update_id UUID REFERENCES project_updates(id) ON DELETE CASCADE,
    model_version_id UUID REFERENCES model_versions(id) ON DELETE SET NULL,
    prediction_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cost_overrun_probability DECIMAL(5,4) CHECK (cost_overrun_probability BETWEEN 0.0000 AND 1.0000),
    predicted_cost_overrun_pct DECIMAL(5,2),
    predicted_final_cost DECIMAL(15,2),
    schedule_delay_probability DECIMAL(5,4) CHECK (schedule_delay_probability BETWEEN 0.0000 AND 1.0000),
    predicted_delay_months DECIMAL(5,2),
    predicted_completion_date DATE,
    composite_risk_score INT CHECK (composite_risk_score BETWEEN 0 AND 100),
    risk_level VARCHAR(20) CHECK (risk_level IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')),
    shap_summary JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. ALERTS & ACTION TRACKING
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS alerts (
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

CREATE TABLE IF NOT EXISTS alert_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    performed_by UUID NOT NULL REFERENCES users(id),
    previous_status alert_status,
    new_status alert_status NOT NULL,
    action_notes TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 9. AUDIT LOGGING
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    previous_value JSONB,
    new_value JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 10. INDEXES FOR PERFORMANCE
-- -----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_projects_code ON projects(project_code);
CREATE INDEX IF NOT EXISTS idx_projects_ministry ON projects(ministry_id);
CREATE INDEX IF NOT EXISTS idx_projects_sector ON projects(sector_id);
CREATE INDEX IF NOT EXISTS idx_projects_agency ON projects(agency_id);
CREATE INDEX IF NOT EXISTS idx_projects_state ON projects(state_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_timeline ON project_updates(project_id, report_year, report_month);
CREATE INDEX IF NOT EXISTS idx_risk_predictions_latest ON risk_predictions(project_id, prediction_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_status_severity ON alerts(status, severity);
CREATE INDEX IF NOT EXISTS idx_quality_issues_status ON data_quality_issues(status, severity);
