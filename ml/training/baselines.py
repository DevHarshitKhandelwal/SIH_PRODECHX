"""
PRODECHX — ML Baseline Models (with Pure Python Fallback)
"""

try:
    from sklearn.dummy import DummyClassifier
    from sklearn.linear_model import LogisticRegression
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

import numpy as np


class SimpleLogisticRegression:
    def __init__(self, lr=0.01, epochs=100):
        self.lr = lr
        self.epochs = epochs
        self.weights = None
        self.bias = 0.0

    def fit(self, X, y):
        X_arr = np.array(X, dtype=float)
        y_arr = np.array(y, dtype=float)
        n_samples, n_features = X_arr.shape
        self.weights = np.zeros(n_features)
        
        # Mean/Std normalization
        self.mean = np.mean(X_arr, axis=0)
        self.std = np.std(X_arr, axis=0) + 1e-8
        X_norm = (X_arr - self.mean) / self.std

        for _ in range(self.epochs):
            linear_model = np.dot(X_norm, self.weights) + self.bias
            y_pred = 1.0 / (1.0 + np.exp(-np.clip(linear_model, -20, 20)))
            dw = (1.0 / n_samples) * np.dot(X_norm.T, (y_pred - y_arr))
            db = (1.0 / n_samples) * np.sum(y_pred - y_arr)
            self.weights -= self.lr * dw
            self.bias -= self.lr * db

    def predict_proba(self, X):
        X_arr = np.array(X, dtype=float)
        X_norm = (X_arr - self.mean) / self.std
        linear_model = np.dot(X_norm, self.weights) + self.bias
        probs = 1.0 / (1.0 + np.exp(-np.clip(linear_model, -20, 20)))
        return np.column_stack([1.0 - probs, probs])


class SimpleDummyClassifier:
    def fit(self, X, y):
        self.prior = float(np.mean(y))

    def predict_proba(self, X):
        probs = np.full(len(X), self.prior)
        return np.column_stack([1.0 - probs, probs])


class BaselineModels:
    def __init__(self):
        if HAS_SKLEARN:
            self.dummy_model = DummyClassifier(strategy='most_frequent')
            self.logistic_model = LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42)
        else:
            self.dummy_model = SimpleDummyClassifier()
            self.logistic_model = SimpleLogisticRegression()

    def fit_dummy(self, X_train, y_train):
        self.dummy_model.fit(X_train, y_train)
        return self.dummy_model

    def fit_logistic(self, X_train, y_train):
        self.logistic_model.fit(X_train, y_train)
        return self.logistic_model
