-- PRODECHX — Migration 002: Row Level Security (RLS) & Policies
-- Target Database: Supabase PostgreSQL 15+

-- -----------------------------------------------------------------------------
-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- -----------------------------------------------------------------------------

ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE extraction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_quality_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 2. SECURITY POLICIES FOR LOOKUP TABLES
-- -----------------------------------------------------------------------------

CREATE POLICY "Allow read access to lookups for authenticated users"
ON ministries FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to sectors for authenticated users"
ON sectors FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to agencies for authenticated users"
ON agencies FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to states for authenticated users"
ON states FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to roles for authenticated users"
ON roles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to permissions for authenticated users"
ON permissions FOR SELECT TO authenticated USING (true);

-- -----------------------------------------------------------------------------
-- 3. POLICIES FOR USER MANAGEMENT
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can read own profile or authenticated read"
ON users FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to user roles"
ON user_roles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to role permissions"
ON role_permissions FOR SELECT TO authenticated USING (true);

-- -----------------------------------------------------------------------------
-- 4. POLICIES FOR PROJECTS & TIMELINES
-- -----------------------------------------------------------------------------

CREATE POLICY "Allow read access to projects for authenticated users"
ON projects FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to project updates for authenticated users"
ON project_updates FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to project milestones for authenticated users"
ON project_milestones FOR SELECT TO authenticated USING (true);

-- -----------------------------------------------------------------------------
-- 5. POLICIES FOR DOCUMENTS & QUALITY ISSUES
-- -----------------------------------------------------------------------------

CREATE POLICY "Allow read access to documents for authenticated users"
ON documents FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to document pages for authenticated users"
ON document_pages FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to document chunks for authenticated users"
ON document_chunks FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to extraction logs for authenticated users"
ON extraction_logs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to data quality issues for authenticated users"
ON data_quality_issues FOR SELECT TO authenticated USING (true);

-- -----------------------------------------------------------------------------
-- 6. POLICIES FOR ML PREDICTIONS, ALERTS & AUDIT
-- -----------------------------------------------------------------------------

CREATE POLICY "Allow read access to model versions"
ON model_versions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to risk predictions"
ON risk_predictions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to alerts for authenticated users"
ON alerts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to alert actions for authenticated users"
ON alert_actions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to audit logs for authenticated users"
ON audit_logs FOR SELECT TO authenticated USING (true);
