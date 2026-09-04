"""
PRODECHX — ML Quality Gate Evaluator & Threshold Tuner
"""

import sys
import os
import json
import numpy as np

sys.path.insert(0, r'd:\SIH')

from ml.data.loader import PaimanaDataLoader
from ml.features.builder import FeatureBuilder
from ml.training.train_models import TreeModels
from ml.evaluation.metrics import EvaluationMetrics


def run_quality_gate():
    print("==================================================")
    print("STARTING PRODECHX FINAL ML QUALITY GATE EVALUATION")
    print("==================================================")

    loader = PaimanaDataLoader()
    df_raw = loader.extract_all_observations()
    builder = FeatureBuilder()
    df_feat, feature_names = builder.transform(df_raw)

    train_df = df_feat[df_feat['report_month'] == 4]
    test_df = df_feat[df_feat['report_month'] == 6]

    X_train, y_train = train_df[feature_names], train_df['target_cost_overrun_binary']
    X_test, y_test = test_df[feature_names], test_df['target_cost_overrun_binary']

    trees = TreeModels()
    rf_model = trees.fit_random_forest(X_train, y_train)

    if hasattr(rf_model, "predict_proba"):
        probs = rf_model.predict_proba(X_test)[:, 1]
    else:
        probs = rf_model.predict(X_test)

    y_test_arr = np.array(y_test)

    # Threshold Analysis Matrix
    thresholds = [0.30, 0.40, 0.45, 0.50, 0.60, 0.70]
    threshold_results = []

    for t in thresholds:
        preds = (probs >= t).astype(int)
        tp = np.sum((preds == 1) & (y_test_arr == 1))
        fp = np.sum((preds == 1) & (y_test_arr == 0))
        fn = np.sum((preds == 0) & (y_test_arr == 1))
        tn = np.sum((preds == 0) & (y_test_arr == 0))

        prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = 2 * (prec * rec) / (prec + rec) if (prec + rec) > 0 else 0.0
        flagged_pct = np.mean(preds == 1) * 100.0

        threshold_results.append({
            'threshold': t,
            'precision': round(float(prec), 4),
            'recall': round(float(rec), 4),
            'f1': round(float(f1), 4),
            'flagged_pct': round(float(flagged_pct), 2)
        })

    # Brier Score Calibration
    brier_score = float(np.mean((probs - y_test_arr) ** 2))

    print("\nTHRESHOLD ANALYSIS MATRIX:")
    print(f"{'Threshold':<10} | {'Precision':<10} | {'Recall':<10} | {'F1 Score':<10} | {'Flagged %':<10}")
    print("-" * 55)
    for r in threshold_results:
        print(f"{r['threshold']:<10.2f} | {r['precision']:<10.4f} | {r['recall']:<10.4f} | {r['f1']:<10.4f} | {r['flagged_pct']:<10.2f}%")

    print(f"\nBrier Score Calibration: {brier_score:.4f}")

    return {
        'threshold_results': threshold_results,
        'brier_score': round(brier_score, 4),
        'recommended_threshold': 0.45
    }

if __name__ == '__main__':
    run_quality_gate()
