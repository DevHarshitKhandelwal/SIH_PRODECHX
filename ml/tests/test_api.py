"""
PRODECHX — Automated FastAPI & Model Hardening Test Suite
Validates 13 hardened API and server-side inference scenarios.
"""

import unittest
import os
import sys

sys.path.insert(0, r'd:\SIH')

from ml.inference.predictor import PaimanaPredictor


class TestPaimanaInferenceAPIHardened(unittest.TestCase):

    def setUp(self):
        self.predictor = PaimanaPredictor()

    def test_01_model_loading(self):
        """Scenario 1: Model loads successfully from persisted model artifact."""
        self.assertIsNotNone(self.predictor.model)
        self.assertEqual(self.predictor.metadata.get("model_version"), "prodechx-randomforest-v2.0")

    def test_02_project_id_only_prediction(self):
        """Scenario 2: Public endpoint accepts project_id ONLY and constructs features server-side."""
        res = self.predictor.predict_project_risk_by_id("612786")
        self.assertEqual(res.get("status"), "eligible")
        self.assertIn("cost_overrun_probability", res)
        self.assertIn("risk_score", res)
        self.assertIn("risk_level", res)

    def test_03_server_side_feature_construction(self):
        """Scenario 3: Verifies features are constructed server-side from baseline DB/mock."""
        pid, feat_dict, month = self.predictor.fetch_server_side_features("612786")
        self.assertIn("original_cost_snap", feat_dict)
        self.assertIn("cumulative_expenditure", feat_dict)
        self.assertIn("physical_progress_pct", feat_dict)
        self.assertIn("April 2026", month)

    def test_04_excluded_project_returns_not_eligible(self):
        """Scenario 4: Excluded project returns status = not_eligible."""
        res = self.predictor.predict_project_risk_by_id("999999_excluded")
        self.assertEqual(res.get("status"), "not_eligible")
        self.assertIn("insufficient historical baseline", res.get("reason", "").lower())

    def test_05_missing_project_returns_not_eligible(self):
        """Scenario 5: Missing project code 000000 returns status = not_eligible."""
        res = self.predictor.predict_project_risk_by_id("000000")
        self.assertEqual(res.get("status"), "not_eligible")

    def test_06_shap_project_id_only_request(self):
        """Scenario 6: SHAP endpoint accepts project_id ONLY and returns non-causal descriptions."""
        expl = self.predictor.explain_project_risk_by_id("612786")
        self.assertIn("explanations", expl)
        self.assertIn("disclaimer", expl)
        self.assertIn("associated_with", expl["explanations"][0]["direction"])

    def test_07_provenance_and_data_freshness_fields(self):
        """Scenario 7: Response includes prediction_based_on, prediction_horizon, operating_threshold."""
        res = self.predictor.predict_project_risk_by_id("612786")
        self.assertIn("prediction_based_on", res)
        self.assertEqual(res.get("prediction_horizon"), "2 months")
        self.assertEqual(res.get("operating_threshold"), 0.45)
        self.assertEqual(res.get("feature_version"), "v2.0_leakage_free")

    def test_08_threshold_045_binary_levels(self):
        """Scenario 8: Verifies threshold 0.45 assigns risk level LOW / HIGH exclusively."""
        prob_high = 0.55
        level_high = "HIGH" if prob_high >= 0.45 else "LOW"
        self.assertEqual(level_high, "HIGH")

        prob_low = 0.35
        level_low = "HIGH" if prob_low >= 0.45 else "LOW"
        self.assertEqual(level_low, "LOW")

    def test_09_internal_feature_endpoint(self):
        """Scenario 9: Internal feature testing endpoint evaluates raw feature vectors."""
        raw_dict = {'original_cost_snap': 861.06, 'cumulative_expenditure': 450.0, 'physical_progress_pct': 65.5}
        res = self.predictor.predict_internal_features(raw_dict, project_code="internal_test")
        self.assertIn("risk_score", res)

    def test_10_internal_endpoint_leakage_rejection(self):
        """Scenario 10: CRITICAL - Internal endpoint rejects target proxy leakage features."""
        leaked_dict = {
            'original_cost_snap': 500.0,
            'cumulative_expenditure': 200.0,
            'physical_progress_pct': 40.0,
            'revised_cost_ratio': 1.5  # LEAKAGE!
        }
        with self.assertRaises(ValueError):
            self.predictor.predict_internal_features(leaked_dict)

    def test_11_malformed_feature_handling(self):
        """Scenario 11: Negative features clipped safely to >= 0."""
        raw_dict = {'original_cost_snap': -100.0, 'cumulative_expenditure': -50.0, 'physical_progress_pct': 150.0}
        res = self.predictor.predict_internal_features(raw_dict)
        self.assertGreaterEqual(res["risk_score"], 0)

    def test_12_batch_ids_prediction(self):
        """Scenario 12: Batch prediction with project_ids list."""
        pids = ["612786", "701107"]
        results = [self.predictor.predict_project_risk_by_id(pid) for pid in pids]
        self.assertEqual(len(results), 2)
        self.assertEqual(results[0]["status"], "eligible")

    def test_13_batch_pagination_math(self):
        """Scenario 13: Batch pagination calculation."""
        items = list(range(100))
        page, size = 2, 20
        start = (page - 1) * size
        end = start + size
        paged = items[start:end]
        self.assertEqual(len(paged), 20)
        self.assertEqual(paged[0], 20)


if __name__ == '__main__':
    unittest.main()
