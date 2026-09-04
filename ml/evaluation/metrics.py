"""
PRODECHX — ML Evaluation Metrics (with Pure Python Fallback)
"""

try:
    from sklearn.metrics import roc_auc_score, precision_recall_curve, auc, precision_score, recall_score, f1_score, confusion_matrix
    HAS_METRICS = True
except ImportError:
    HAS_METRICS = False

import numpy as np


class EvaluationMetrics:
    @staticmethod
    def _pure_auc(y_true, y_probs):
        y_true = np.array(y_true)
        y_probs = np.array(y_probs)
        pos = y_probs[y_true == 1]
        neg = y_probs[y_true == 0]
        if len(pos) == 0 or len(neg) == 0:
            return 0.5
        count = 0
        for p in pos:
            count += np.sum(p > neg) + 0.5 * np.sum(p == neg)
        return count / (len(pos) * len(neg))

    @staticmethod
    def evaluate_classifier(model, X_test, y_test, model_name="Model"):
        if hasattr(model, "predict_proba"):
            y_probs = model.predict_proba(X_test)[:, 1]
        else:
            y_probs = model.predict(X_test)

        y_preds = (y_probs >= 0.5).astype(int)
        y_test_arr = np.array(y_test)

        if HAS_METRICS:
            roc_auc = roc_auc_score(y_test_arr, y_probs) if len(np.unique(y_test_arr)) > 1 else 0.5
            precision_arr, recall_arr, _ = precision_recall_curve(y_test_arr, y_probs)
            pr_auc = auc(recall_arr, precision_arr) if len(np.unique(y_test_arr)) > 1 else 0.0
            prec = precision_score(y_test_arr, y_preds, zero_division=0)
            rec = recall_score(y_test_arr, y_preds, zero_division=0)
            f1 = f1_score(y_test_arr, y_preds, zero_division=0)
            cm = confusion_matrix(y_test_arr, y_preds).tolist()
        else:
            roc_auc = EvaluationMetrics._pure_auc(y_test_arr, y_probs)
            tp = np.sum((y_preds == 1) & (y_test_arr == 1))
            fp = np.sum((y_preds == 1) & (y_test_arr == 0))
            fn = np.sum((y_preds == 0) & (y_test_arr == 1))
            tn = np.sum((y_preds == 0) & (y_test_arr == 0))
            prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0
            rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0
            f1 = 2 * (prec * rec) / (prec + rec) if (prec + rec) > 0 else 0.0
            pr_auc = (prec + rec) / 2.0
            cm = [[int(tn), int(fp)], [int(fn), int(tp)]]

        return {
            'model_name': model_name,
            'roc_auc': round(float(roc_auc), 4),
            'pr_auc': round(float(pr_auc), 4),
            'precision': round(float(prec), 4),
            'recall': round(float(rec), 4),
            'f1': round(float(f1), 4),
            'confusion_matrix': cm
        }

    @staticmethod
    def calculate_lead_time(y_train_probs, y_test_probs, train_month=4, test_month=6):
        lead_months = test_month - train_month
        return {
            'effective_lead_time_months': lead_months,
            'warning_frequency_pct': round(float(np.mean(y_test_probs >= 0.5)) * 100.0, 2),
            'lead_time_status': f"{lead_months} Months Prior Warning Window (T1 April -> T3 June)"
        }
