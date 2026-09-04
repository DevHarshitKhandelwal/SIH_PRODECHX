"""
PRODECHX — Production ML Pipeline Execution Runner
Runs temporal data split (T1 Train April -> T2 Val May -> T3 Test June), feature engineering, model training, evaluation, and SHAP explainability.
"""

import sys
import os
import json

sys.path.insert(0, r'd:\SIH')

from ml.data.loader import PaimanaDataLoader
from ml.features.builder import FeatureBuilder
from ml.training.baselines import BaselineModels
from ml.training.train_models import TreeModels
from ml.evaluation.metrics import EvaluationMetrics
from ml.evaluation.explainability import ModelExplainability
from ml.model_registry import ModelRegistry


def run_pipeline():
    print("==================================================")
    print("STARTING PRODECHX ML DATASET & EVALUATION PIPELINE")
    print("==================================================")

    # 1. Load Raw Observations
    loader = PaimanaDataLoader()
    df_raw = loader.extract_all_observations()

    # 2. Build Features
    builder = FeatureBuilder()
    df_feat, feature_names = builder.transform(df_raw)

    print(f"Engineered {len(feature_names)} features for {len(df_feat)} records.")
    print("Features:", feature_names)

    # 3. Temporal Data Split (Strict time series - No data leakage)
    # Train: April 2026 (Month 4)
    # Val: May 2026 (Month 5)
    # Test: June 2026 (Month 6)
    train_df = df_feat[df_feat['report_month'] == 4]
    val_df = df_feat[df_feat['report_month'] == 5]
    test_df = df_feat[df_feat['report_month'] == 6]

    print(f"\nTEMPORAL DATA SPLIT:")
    print(f"  Train Set (April 2026): {len(train_df)} observations | Target Positive: {train_df['target_cost_overrun_binary'].sum()} ({train_df['target_cost_overrun_binary'].mean()*100:.2f}%)")
    print(f"  Val Set (May 2026):     {len(val_df)} observations   | Target Positive: {val_df['target_cost_overrun_binary'].sum()} ({val_df['target_cost_overrun_binary'].mean()*100:.2f}%)")
    print(f"  Test Set (June 2026):   {len(test_df)} observations  | Target Positive: {test_df['target_cost_overrun_binary'].sum()} ({test_df['target_cost_overrun_binary'].mean()*100:.2f}%)")

    X_train, y_train = train_df[feature_names], train_df['target_cost_overrun_binary']
    X_val, y_val = val_df[feature_names], val_df['target_cost_overrun_binary']
    X_test, y_test = test_df[feature_names], test_df['target_cost_overrun_binary']

    # 4. Train Models
    print("\nTRAINING BASELINE & TREE-BASED MODELS...")
    baselines = BaselineModels()
    trees = TreeModels()

    dummy_model = baselines.fit_dummy(X_train, y_train)
    lr_model = baselines.fit_logistic(X_train, y_train)
    rf_model = trees.fit_random_forest(X_train, y_train)
    xgb_model = trees.fit_xgboost(X_train, y_train)

    # 5. Evaluate Models on Test Set (June 2026)
    print("\nEVALUATING MODELS ON TEMPORAL TEST SET (JUNE 2026)...")
    results = []

    res_dummy = EvaluationMetrics.evaluate_classifier(dummy_model, X_test, y_test, "Dummy Classifier")
    res_lr = EvaluationMetrics.evaluate_classifier(lr_model, X_test, y_test, "Logistic Regression")
    res_rf = EvaluationMetrics.evaluate_classifier(rf_model, X_test, y_test, "Random Forest")
    res_xgb = EvaluationMetrics.evaluate_classifier(xgb_model, X_test, y_test, "XGBoost Classifier")

    results = [res_dummy, res_lr, res_rf, res_xgb]

    print("\n==================================================")
    print("MODEL COMPARISON RESULTS (TEST SET - JUNE 2026):")
    print("==================================================")
    print(f"{'Model':<25} | {'ROC-AUC':<8} | {'PR-AUC':<8} | {'Precision':<10} | {'Recall':<8} | {'F1':<8}")
    print("-" * 78)
    for r in results:
        print(f"{r['model_name']:<25} | {r['roc_auc']:<8} | {r['pr_auc']:<8} | {r['precision']:<10} | {r['recall']:<8} | {r['f1']:<8}")

    # 6. Compute SHAP Explainability for Best Tree Model (XGBoost)
    print("\nCOMPUTING SHAP FEATURE IMPORTANCE FOR XGBOOST...")
    shap_importance = ModelExplainability.compute_shap_summary(xgb_model, X_train, feature_names)

    print("\nSHAP GLOBAL FEATURE IMPORTANCE:")
    for feat, imp in shap_importance.items():
        print(f"  {feat:<30}: {imp:.4f}")

    # 7. Lead-Time Evaluation
    xgb_probs = xgb_model.predict_proba(X_test)[:, 1]
    lead_time_info = EvaluationMetrics.calculate_lead_time(
        xgb_model.predict_proba(X_train)[:, 1], xgb_probs, train_month=4, test_month=6
    )

    print(f"\nEARLY WARNING LEAD-TIME EVALUATION:")
    print(f"  Effective Lead Time: {lead_time_info['effective_lead_time_months']} Months")
    print(f"  Warning Frequency: {lead_time_info['warning_frequency_pct']}%")

    output_data = {
        'results': results,
        'shap_importance': shap_importance,
        'lead_time_info': lead_time_info,
        'dataset_summary': {
            'total_observations': len(df_feat),
            'unique_projects': int(df_feat['project_code'].nunique()),
            'feature_count': len(feature_names),
            'train_size': len(train_df),
            'val_size': len(val_df),
            'test_size': len(test_df)
        }
    }

    with open(r'C:\Users\BLUECITY\.gemini\antigravity-ide\brain\5ac31ea6-a1e0-46a9-9741-3e6e329711a7\scratch\ml_pipeline_output.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2)

    print("\nML Pipeline execution complete. Output saved to scratch/ml_pipeline_output.json.")
    return output_data

if __name__ == '__main__':
    run_pipeline()
