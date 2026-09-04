/**
 * PRODECHX — Typed FastAPI Machine Learning Inference Client
 * Target Inference Server: http://localhost:8000 (prodechx-randomforest-v2.0)
 * STRICT RULE: Passes ONLY project_id (or project_code). Never sends raw feature vectors!
 */

export interface ModelInfo {
  model_version: string;
  model_type: string;
  feature_version: string;
  target_definition: string;
  operating_threshold: number;
  validation_status: string;
  training_period: string;
  validation_period: string;
  test_period: string;
  validation_metrics: {
    roc_auc: number;
    pr_auc: number;
    precision_at_threshold: number;
    recall_at_threshold: number;
    brier_score: number;
  };
  prediction_horizon: string;
  eligible_cohort_count: number;
}

export interface ProjectRiskPrediction {
  status: "eligible" | "not_eligible";
  reason?: string;
  project_id?: string;
  project_code?: string;
  model_version?: string;
  feature_version?: string;
  prediction_based_on?: string;
  prediction_horizon?: string;
  cost_overrun_probability?: number;
  risk_score?: number;
  risk_level?: "LOW" | "HIGH";
  operating_threshold?: number;
}

export interface ShapExplanationFactor {
  feature: string;
  value: number;
  shap_value: number;
  direction: "associated_with_higher_predicted_risk" | "associated_with_lower_predicted_risk";
}

export interface ProjectRiskExplanation {
  status?: "eligible" | "not_eligible";
  reason?: string;
  project_id?: string;
  project_code?: string;
  model_version?: string;
  prediction_based_on?: string;
  risk_score?: number;
  risk_level?: "LOW" | "HIGH";
  explanations?: ShapExplanationFactor[];
  disclaimer?: string;
}

const ML_API_BASE_URL = process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:8000";

export async function fetchModelInfo(): Promise<ModelInfo | null> {
  try {
    const res = await fetch(`${ML_API_BASE_URL}/model/info`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch ML model info:", err);
    return null;
  }
}

export async function fetchProjectRisk(projectId: string): Promise<ProjectRiskPrediction> {
  try {
    const res = await fetch(`${ML_API_BASE_URL}/predict/project`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: projectId }),
      cache: "no-store",
    });

    if (!res.ok) {
      return { status: "not_eligible", reason: `API error (HTTP ${res.status})` };
    }
    return await res.json();
  } catch (err) {
    console.error(`Failed to predict risk for project ${projectId}:`, err);
    return { status: "not_eligible", reason: "ML Inference API unreachable" };
  }
}

export async function fetchProjectExplanation(projectId: string): Promise<ProjectRiskExplanation> {
  try {
    const res = await fetch(`${ML_API_BASE_URL}/explain/project`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: projectId }),
      cache: "no-store",
    });

    if (!res.ok) {
      return { status: "not_eligible", reason: `API error (HTTP ${res.status})` };
    }
    return await res.json();
  } catch (err) {
    console.error(`Failed to explain risk for project ${projectId}:`, err);
    return { status: "not_eligible", reason: "ML Explanation API unreachable" };
  }
}
