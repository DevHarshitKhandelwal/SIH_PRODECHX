-- PRODECHX — Migration 003: Audit Log Structure & Automated Triggers
-- Target Database Engine: Supabase PostgreSQL 15+

-- -----------------------------------------------------------------------------
-- 1. AUDIT LOG TRIGGER FUNCTION
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.audit_log_trigger_func()
RETURNS TRIGGER AS $$
DECLARE
    current_user_id UUID;
    old_data JSONB := NULL;
    new_data JSONB := NULL;
BEGIN
    BEGIN
        current_user_id := auth.uid();
    EXCEPTION WHEN OTHERS THEN
        current_user_id := NULL;
    END;

    IF (TG_OP = 'UPDATE') THEN
        old_data := to_jsonb(OLD);
        new_data := to_jsonb(NEW);
    ELSIF (TG_OP = 'DELETE') THEN
        old_data := to_jsonb(OLD);
    ELSIF (TG_OP = 'INSERT') THEN
        new_data := to_jsonb(NEW);
    END IF;

    INSERT INTO public.audit_logs (
        user_id,
        action,
        entity_type,
        entity_id,
        previous_value,
        new_value,
        timestamp
    ) VALUES (
        current_user_id,
        TG_OP,
        TG_TABLE_NAME,
        COALESCE((new_data->>'id'), (old_data->>'id')),
        old_data,
        new_data,
        NOW()
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- 2. ATTACH AUDIT TRIGGERS TO CORE ENTITIES
-- -----------------------------------------------------------------------------

DROP TRIGGER IF EXISTS audit_projects_trigger ON projects;
CREATE TRIGGER audit_projects_trigger
AFTER INSERT OR UPDATE OR DELETE ON projects
FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger_func();

DROP TRIGGER IF EXISTS audit_project_updates_trigger ON project_updates;
CREATE TRIGGER audit_project_updates_trigger
AFTER INSERT OR UPDATE OR DELETE ON project_updates
FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger_func();

DROP TRIGGER IF EXISTS audit_documents_trigger ON documents;
CREATE TRIGGER audit_documents_trigger
AFTER INSERT OR UPDATE OR DELETE ON documents
FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger_func();

DROP TRIGGER IF EXISTS audit_alerts_trigger ON alerts;
CREATE TRIGGER audit_alerts_trigger
AFTER INSERT OR UPDATE OR DELETE ON alerts
FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger_func();

DROP TRIGGER IF EXISTS audit_alert_actions_trigger ON alert_actions;
CREATE TRIGGER audit_alert_actions_trigger
AFTER INSERT OR UPDATE OR DELETE ON alert_actions
FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger_func();

DROP TRIGGER IF EXISTS audit_data_quality_issues_trigger ON data_quality_issues;
CREATE TRIGGER audit_data_quality_issues_trigger
AFTER INSERT OR UPDATE OR DELETE ON data_quality_issues
FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger_func();
