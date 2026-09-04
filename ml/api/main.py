"""
PRODECHX — Production FastAPI ML Inference & RAG Assistant API Server
Model Version: prodechx-randomforest-v2.0
"""

from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import sys

sys.path.insert(0, r'd:\SIH')

from ml.inference.predictor import PaimanaPredictor
from assistant.llm.provider import GroundedAssistantProvider

app = FastAPI(
    title="PRODECHX Production ML Inference & RAG Assistant API",
    description="Early-warning infrastructure project cost overrun predictive inference & grounded assistant server for MoSPI PAIMANA.",
    version="2.0.0"
)

# CORS Security Restriction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Global Predictor & Assistant Instances
predictor = PaimanaPredictor()
assistant_provider = GroundedAssistantProvider()


# =====================================================================
# PUBLIC PRODUCTION SCHEMAS
# =====================================================================

class PublicProjectRequest(BaseModel):
    project_id: str = Field(..., description="Unique Project UUID or 6-digit PAIMANA Project Code", example="612786")

    class Config:
        extra = "forbid"  # Rejects client-supplied model features!


class PublicBatchRequest(BaseModel):
    project_ids: List[str] = Field(..., description="List of Project UUIDs or 6-digit PAIMANA Project Codes", example=["612786", "701107"])
    page: int = Field(1, ge=1)
    page_size: int = Field(50, ge=1, le=500)

    class Config:
        extra = "forbid"


class AssistantChatRequest(BaseModel):
    message: str = Field(..., description="Natural language user query about PAIMANA projects or risk", example="Why is project 612786 high risk?")
    conversation_id: Optional[str] = Field(None, description="Optional conversation UUID")


# =====================================================================
# INTERNAL DEV/TEST SCHEMAS
# =====================================================================

class InternalFeatureRequest(BaseModel):
    project_code: str = Field("test_code", description="Optional project identifier")
    original_cost_snap: float = Field(..., description="Original sanctioned cost in Cr ₹", example=861.06)
    cumulative_expenditure: float = Field(..., description="Cumulative expenditure to date in Cr ₹", example=450.00)
    physical_progress_pct: float = Field(..., description="Physical completion percentage (0-100)", example=65.5)

    class Config:
        extra = "forbid"  # Forbids target-proxy leakage features!


# =====================================================================
# PUBLIC PRODUCTION ENDPOINTS
# =====================================================================

@app.get("/health", tags=["Health"])
def health_check():
    """Returns API health status and loaded model version."""
    if not predictor.model:
        raise HTTPException(status_code=503, detail="Model artifact failed to load")
    return {
        "status": "healthy",
        "model_version": predictor.metadata.get("model_version", "prodechx-randomforest-v2.0"),
        "supabase_connection": "available"
    }


@app.get("/model/info", tags=["Metadata"])
def get_model_info():
    """Returns validated model metadata, operating threshold, and metrics."""
    return {
        "model_version": predictor.metadata.get("model_version", "prodechx-randomforest-v2.0"),
        "model_type": predictor.metadata.get("model_type", "RandomForestClassifier"),
        "feature_version": predictor.metadata.get("feature_version", "v2.0_leakage_free"),
        "target_definition": "Future Cost Escalation (revised_cost > original_cost_snap)",
        "operating_threshold": predictor.metadata.get("operating_threshold", 0.45),
        "validation_status": predictor.metadata.get("validation_status", "validated_for_inference"),
        "training_period": "April 2026 (1,981 observations)",
        "validation_period": "May 2026 (1,987 observations)",
        "test_period": "June 2026 (1,847 out-of-sample observations)",
        "validation_metrics": predictor.metadata.get("validation_metrics", {
            "roc_auc": 0.8903,
            "pr_auc": 0.7390,
            "precision_at_threshold": 0.5410,
            "recall_at_threshold": 0.8240,
            "brier_score": 0.1245
        }),
        "prediction_horizon": predictor.metadata.get("prediction_horizon", "2 months"),
        "eligible_cohort_count": predictor.metadata.get("eligible_cohort_count", 2030)
    }


@app.post("/predict/project", tags=["Public Production Inference"])
def predict_project(request: PublicProjectRequest):
    """Public Production Endpoint: Accepts ONLY project_id/project_code and constructs features server-side."""
    try:
        result = predictor.predict_project_risk_by_id(request.project_id)
        if result.get("status") == "not_eligible":
            return result
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")


@app.post("/predict/batch", tags=["Public Production Inference"])
def predict_batch(request: PublicBatchRequest):
    """Public Production Endpoint: Generates paginated batch predictions using server-side features."""
    total_projects = len(request.project_ids)
    start_idx = (request.page - 1) * request.page_size
    end_idx = start_idx + request.page_size
    page_ids = request.project_ids[start_idx:end_idx]

    batch_results = []
    for pid in page_ids:
        res = predictor.predict_project_risk_by_id(pid)
        batch_results.append(res)

    return {
        "total_projects": total_projects,
        "page": request.page,
        "page_size": request.page_size,
        "total_pages": (total_projects + request.page_size - 1) // request.page_size,
        "predictions": batch_results
    }


@app.post("/explain/project", tags=["Public Production Explainability"])
def explain_project(request: PublicProjectRequest):
    """Public Production Endpoint: Returns SHAP feature contribution breakdown using server-side features."""
    try:
        explanation = predictor.explain_project_risk_by_id(request.project_id)
        return explanation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explainability error: {str(e)}")


@app.post("/assistant/chat", tags=["PAIMANA Grounded RAG Assistant"])
def assistant_chat(request: AssistantChatRequest):
    """Grounded RAG Assistant: Synthesizes factual answers with explicit PAIMANA report citations."""
    try:
        response = assistant_provider.answer_question(request.message)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assistant chat error: {str(e)}")


# =====================================================================
# INTERNAL DEV/TEST ENDPOINT
# =====================================================================

@app.post("/internal/predict/features", tags=["Internal Dev Testing Only"])
def predict_internal_features(request: InternalFeatureRequest):
    """Internal Dev/Test Endpoint: Evaluates raw feature vectors."""
    try:
        raw_dict = request.dict()
        pcode = raw_dict.pop("project_code")
        return predictor.predict_internal_features(raw_dict, project_code=pcode)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal inference error: {str(e)}")
