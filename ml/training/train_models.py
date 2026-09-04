"""
PRODECHX — Tree-Based ML Models (Random Forest & XGBoost with Fallback)
"""

try:
    from sklearn.ensemble import RandomForestClassifier
    from xgboost import XGBClassifier
    HAS_TREES = True
except ImportError:
    HAS_TREES = False

import numpy as np


class SimpleTreeModel:
    def __init__(self, name="TreeModel"):
        self.name = name
        self.feature_importances_ = None

    def fit(self, X, y):
        X_arr = np.array(X, dtype=float)
        y_arr = np.array(y, dtype=float)
        n_features = X_arr.shape[1]
        
        # Calculate feature correlations with target
        corrs = []
        for j in range(n_features):
            col = X_arr[:, j]
            std = np.std(col)
            if std > 1e-6:
                c = np.abs(np.corrcoef(col, y_arr)[0, 1])
                corrs.append(0.0 if np.isnan(c) else c)
            else:
                corrs.append(0.0)
        
        tot = sum(corrs) + 1e-8
        self.feature_importances_ = np.array([c / tot for c in corrs])
        self.mean = np.mean(X_arr, axis=0)
        self.std = np.std(X_arr, axis=0) + 1e-8
        
        # Logistic weights weighted by correlation
        X_norm = (X_arr - self.mean) / self.std
        self.weights = self.feature_importances_ * np.dot(X_norm.T, (y_arr - np.mean(y_arr))) / len(y_arr)
        self.bias = float(np.mean(y_arr))

    def predict_proba(self, X):
        X_arr = np.array(X, dtype=float)
        X_norm = (X_arr - self.mean) / self.std
        scores = np.dot(X_norm, self.weights) + self.bias
        probs = 1.0 / (1.0 + np.exp(-np.clip(scores, -15, 15)))
        return np.column_stack([1.0 - probs, probs])


class TreeModels:
    def __init__(self):
        if HAS_TREES:
            self.rf_model = RandomForestClassifier(
                n_estimators=100, max_depth=8, class_weight='balanced', random_state=42
            )
            self.xgb_model = XGBClassifier(
                n_estimators=100, max_depth=5, learning_rate=0.05, scale_pos_weight=2.0, eval_metric='logloss', random_state=42
            )
        else:
            self.rf_model = SimpleTreeModel("RandomForest")
            self.xgb_model = SimpleTreeModel("XGBoost")

    def fit_random_forest(self, X_train, y_train):
        self.rf_model.fit(X_train, y_train)
        return self.rf_model

    def fit_xgboost(self, X_train, y_train):
        self.xgb_model.fit(X_train, y_train)
        return self.xgb_model
