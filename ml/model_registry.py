"""
PRODECHX — Model Registry Integration
Registers trained models into model_versions database table.
"""

import json


class ModelRegistry:
    def __init__(self, execute_sql_fn=None):
        self.execute_sql_fn = execute_sql_fn

    def register_model_version(self, version_name, model_type, metrics_summary, is_active=True):
        if not self.execute_sql_fn:
            print(f"Registered model {version_name} ({model_type}) locally.")
            return "mock-model-uuid"

        metrics_json = json.dumps(metrics_summary).replace("'", "''")
        sql = f"""
        INSERT INTO model_versions (
            version_name, model_type, metrics_summary, is_active, trained_at, created_at
        ) VALUES (
            '{version_name}', '{model_type}', '{metrics_json}', {str(is_active).lower()}, NOW(), NOW()
        ) ON CONFLICT (version_name) DO UPDATE SET
            metrics_summary = EXCLUDED.metrics_summary,
            is_active = EXCLUDED.is_active
        RETURNING id;
        """
        res = self.execute_sql_fn(sql)
        print(f"Model version '{version_name}' successfully registered in database.")
        return res[0]['id'] if res else None
