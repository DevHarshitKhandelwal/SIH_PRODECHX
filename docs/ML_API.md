# PRODECHX — Production ML Inference API Specification (Hardened)

> **API Version:** 2.0.0 (Hardened Production Boundary)  
> **Model Version:** `prodechx-randomforest-v2.0`  
> **Target Database Instance:** Supabase PostgreSQL 17.6 (`uezwwbijdulbewouanny`)  
> **Framework:** FastAPI / Uvicorn  
> **Date:** August 24, 2026

---

## 1. Security & Environment Configuration (`ml/.env`)

Configure the server-side environment variables in `ml/.env` (see template at `ml/.env.example`):

```bash
SUPABASE_URL=https://uezwwbijdulbewouanny.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_server_side_service_role_key_here
PORT=8000
HOST=0.0.0.0
```

> [!CAUTION]
> **Client Payload Validation & Zero Trust**: Public production endpoints accept ONLY `project_id` (or `project_code`). Clients MUST NEVER supply raw feature vectors (`original_cost_snap`, `cumulative_expenditure`, `physical_progress_pct`). Any client attempting to pass features to public endpoints will be rejected with `HTTP 422 Unprocessable Entity` or `HTTP 400 Bad Request`.

---

## 2. Public Production API Endpoints Reference

### 2.1 GET `/health`
Returns server health status, loaded model version, and database connectivity state.

**Response `200 OK`**:
```json
{
  "status": "healthy",
  "model_version": "prodechx-randomforest-v2.0",
  "supabase_connection": "available"
}
```

---

### 2.2 GET `/model/info`
Returns validated model metadata, algorithm specifications, operating threshold (`0.45`), data freshness periods, and metrics.

**Response `200 OK`**:
```json
{
  "model_version": "prodechx-randomforest-v2.0",
  "model_type": "RandomForestClassifier",
  "feature_version": "v2.0_leakage_free",
  "target_definition": "Future Cost Escalation (revised_cost > original_cost_snap)",
  "operating_threshold": 0.45,
  "validation_status": "validated_for_inference",
  "training_period": "April 2026 (1,981 observations)",
  "validation_period": "May 2026 (1,987 observations)",
  "test_period": "June 2026 (1,847 out-of-sample observations)",
  "validation_metrics": {
    "roc_auc": 0.8903,
    "pr_auc": 0.7390,
    "precision_at_threshold": 0.5410,
    "recall_at_threshold": 0.8240,
    "brier_score": 0.1245
  },
  "prediction_horizon": "2 months",
  "eligible_cohort_count": 2030
}
```

---

### 2.3 POST `/predict/project` (Public Production Endpoint)
Generates 2-month out-of-sample risk prediction by fetching baseline features **100% server-side**.

**Request Body (Client passes ONLY project_id)**:
```json
{
  "project_id": "612786"
}
```

**Response `200 OK` (Eligible Project)**:
```json
{
  "status": "eligible",
  "project_id": "proj-uuid-612786",
  "project_code": "612786",
  "model_version": "prodechx-randomforest-v2.0",
  "feature_version": "v2.0_leakage_free",
  "prediction_based_on": "April 2026",
  "prediction_horizon": "2 months",
  "cost_overrun_probability": 0.7820,
  "risk_score": 78,
  "risk_level": "HIGH",
  "operating_threshold": 0.45
}
```

**Response `200 OK` (Ineligible Project - Excluded Cohort)**:
```json
{
  "status": "not_eligible",
  "reason": "Insufficient historical baseline (Missing April baseline observation)",
  "project_identifier": "999999_excluded"
}
```

---

### 2.4 POST `/predict/batch` (Public Production Endpoint)
Generates paginated batch predictions using server-side features.

**Request Body**:
```json
{
  "project_ids": ["612786", "701107"],
  "page": 1,
  "page_size": 50
}
```

---

### 2.5 POST `/explain/project` (Public Production Endpoint)
Returns SHAP feature contribution breakdown using server-side features.

**Request Body**:
```json
{
  "project_id": "612786"
}
```

**Response `200 OK`**:
```json
{
  "project_id": "proj-uuid-612786",
  "project_code": "612786",
  "model_version": "prodechx-randomforest-v2.0",
  "prediction_based_on": "April 2026",
  "risk_score": 78,
  "risk_level": "HIGH",
  "explanations": [
    {
      "feature": "expenditure_ratio",
      "value": 0.5226,
      "shap_value": 0.3521,
      "direction": "associated_with_higher_predicted_risk"
    },
    {
      "feature": "physical_financial_gap",
      "value": 13.24,
      "shap_value": 0.2845,
      "direction": "associated_with_higher_predicted_risk"
    }
  ],
  "disclaimer": "SHAP feature contributions represent model statistical attributions and MUST NOT be interpreted as causal evidence."
}
```

---

## 3. Internal Dev/Test Endpoint (Isolated Testing Route)

### 3.1 POST `/internal/predict/features`
For developer pipeline testing only. Evaluates raw feature vectors. **MUST NOT be exposed to production frontend clients.**

**Request Body**:
```json
{
  "project_code": "test_code",
  "original_cost_snap": 861.06,
  "cumulative_expenditure": 450.00,
  "physical_progress_pct": 65.5
}
```

*Leakage Rejection Rule*: If `revised_cost_ratio`, `revised_cost`, or any target proxy is included, returns `HTTP 400 Bad Request`.

---

## 4. Local Execution Command

```bash
uvicorn ml.api.main:app --reload --host 0.0.0.0 --port 8000
```
