-- PRODECHX — Migration 004: System Configuration Seed Data & Storage Bucket
-- Target Database Engine: Supabase PostgreSQL 15+

-- -----------------------------------------------------------------------------
-- 1. SYSTEM ROLES
-- -----------------------------------------------------------------------------

INSERT INTO roles (name, description) VALUES
    ('SUPER_ADMIN', 'National Administrator with full system access'),
    ('MINISTRY_ADMIN', 'Line Ministry Administrator with ministry-scoped access'),
    ('PROJECT_OFFICER', 'Project Officer monitoring assigned infrastructure projects'),
    ('ANALYST', 'Data Analyst with access to historical analytics and model metrics'),
    ('VIEWER', 'Read-only viewer for public project dashboards')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- -----------------------------------------------------------------------------
-- 2. SYSTEM PERMISSIONS
-- -----------------------------------------------------------------------------

INSERT INTO permissions (code, description) VALUES
    ('documents:upload', 'Ability to upload PAIMANA PDF reports'),
    ('documents:process', 'Ability to trigger PDF parsing and extraction'),
    ('projects:view', 'Ability to view project details and timelines'),
    ('projects:edit', 'Ability to edit project records and milestones'),
    ('alerts:manage', 'Ability to acknowledge and assign early warning alerts'),
    ('audit:view', 'Ability to view system audit logs')
ON CONFLICT (code) DO UPDATE SET description = EXCLUDED.description;

-- -----------------------------------------------------------------------------
-- 3. ROLE-PERMISSION MAPPINGS
-- -----------------------------------------------------------------------------

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'SUPER_ADMIN'
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. STATES & UNION TERRITORIES SEED DATA (36 JURISDICTIONS)
-- -----------------------------------------------------------------------------

INSERT INTO states (name, code, type) VALUES
    ('Andhra Pradesh', 'AP', 'STATE'),
    ('Arunachal Pradesh', 'AR', 'STATE'),
    ('Assam', 'AS', 'STATE'),
    ('Bihar', 'BR', 'STATE'),
    ('Chhattisgarh', 'CG', 'STATE'),
    ('Goa', 'GA', 'STATE'),
    ('Gujarat', 'GJ', 'STATE'),
    ('Haryana', 'HR', 'STATE'),
    ('Himachal Pradesh', 'HP', 'STATE'),
    ('Jharkhand', 'JH', 'STATE'),
    ('Karnataka', 'KA', 'STATE'),
    ('Kerala', 'KL', 'STATE'),
    ('Madhya Pradesh', 'MP', 'STATE'),
    ('Maharashtra', 'MH', 'STATE'),
    ('Manipur', 'MN', 'STATE'),
    ('Meghalaya', 'ML', 'STATE'),
    ('Mizoram', 'MZ', 'STATE'),
    ('Nagaland', 'NL', 'STATE'),
    ('Odisha', 'OD', 'STATE'),
    ('Punjab', 'PB', 'STATE'),
    ('Rajasthan', 'RJ', 'STATE'),
    ('Sikkim', 'SK', 'STATE'),
    ('Tamil Nadu', 'TN', 'STATE'),
    ('Telangana', 'TS', 'STATE'),
    ('Tripura', 'TR', 'STATE'),
    ('Uttar Pradesh', 'UP', 'STATE'),
    ('Uttarakhand', 'UK', 'STATE'),
    ('West Bengal', 'WB', 'STATE'),
    ('Andaman and Nicobar Islands', 'AN', 'UT'),
    ('Chandigarh', 'CH', 'UT'),
    ('Dadra and Nagar Haveli and Daman and Diu', 'DN', 'UT'),
    ('Delhi', 'DL', 'UT'),
    ('Jammu and Kashmir', 'JK', 'UT'),
    ('Ladakh', 'LA', 'UT'),
    ('Lakshadweep', 'LD', 'UT'),
    ('Puducherry', 'PY', 'UT'),
    ('Multi-State', 'MS', 'SPECIAL'),
    ('PAN India', 'IND', 'SPECIAL')
ON CONFLICT (name) DO UPDATE SET code = EXCLUDED.code;

-- -----------------------------------------------------------------------------
-- 5. STORAGE BUCKET CONFIGURATION
-- -----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'paimana-documents',
    'paimana-documents',
    false,
    52428800, -- 50 MB limit per file
    ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;
