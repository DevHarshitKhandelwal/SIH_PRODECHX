# PRODECHX — Grounded Assistant API Specification

> **API Version:** 2.0.0  
> **Endpoint Route:** `POST /assistant/chat`  
> **Framework:** FastAPI / Uvicorn  
> **Date:** August 24, 2026

---

## 1. POST `/assistant/chat` Endpoint Specification

Synthesizes grounded answers using retrieved PAIMANA text chunks, Supabase project data, ML risk scores (`prodechx-randomforest-v2.0`), and SHAP attributions.

### Request Body Schema
```json
{
  "message": "Why is project 612786 high risk?",
  "conversation_id": "optional-session-uuid"
}
```

### Response Body Schema (`200 OK`)
```json
{
  "answer": "**Project Risk Assessment — USBRL Project (612786)**\n\n**Predicted Risk Level:** **HIGH** (84 / 100)\n- **Predicted Cost Overrun Probability:** 78.2%\n- **Prediction Horizon:** 2 months | **Operating Threshold:** 0.45\n\n**Key Model Factors (SHAP Attributions):**\n1. **`expenditure_ratio`** (0.52): Associated with higher predicted risk due to rapid disbursement.\n2. **`physical_financial_gap`** (13.24): Associated with higher predicted risk due to physical progress lagging expenditure.\n\n*Source:* [PAIMANA April 2026, p. 54]",
  "sources": [
    {
      "citation_tag": "[PAIMANA April 2026, p. 54]",
      "period": "April 2026",
      "page_number": 54,
      "project_code": "612786",
      "snippet": "Udhampur-Srinagar-Baramulla Rail Link ongoing status update..."
    }
  ],
  "latency_ms": 120,
  "route": "project_risk_explanation"
}
```
