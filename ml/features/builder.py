"""
PRODECHX — Purified ML Feature Engineering Pipeline (Zero Target Leakage)
Purges revised_cost, revised_cost_ratio, cost_growth_pct, and has_revised_cost from input features.
"""

import pandas as pd
import numpy as np


class FeatureBuilder:
    def __init__(self):
        # STRICT LEAKAGE-FREE FEATURE SET
        self.feature_names = [
            'original_cost_log',
            'expenditure_ratio',
            'physical_progress_pct',
            'physical_financial_gap'
        ]

    def transform(self, df):
        df = df.copy()

        # Handle missing inputs safely
        for col in ['original_cost_snap', 'cumulative_expenditure', 'physical_progress_pct']:
            if col not in df.columns:
                df[col] = 0.0
            else:
                df[col] = df[col].fillna(0.0)

        # 1. Log Original Cost (Known at sanction T0)
        df['original_cost_log'] = np.log1p(np.maximum(0, df['original_cost_snap']))

        # 2. Expenditure Ratio (Disbursement at time T)
        df['expenditure_ratio'] = np.where(
            df['original_cost_snap'] > 0,
            df['cumulative_expenditure'] / df['original_cost_snap'],
            0.0
        )

        # 3. Physical Progress Pct (Physical progress at time T)
        df['physical_progress_pct'] = np.clip(df['physical_progress_pct'], 0.0, 100.0)

        # 4. Physical Financial Gap (Physical % - Financial %)
        df['physical_financial_gap'] = df['physical_progress_pct'] - (df['expenditure_ratio'] * 100.0)

        # TARGET DEFINITION: Computed ONLY if revised_cost is present in DataFrame (e.g. during training)
        if 'revised_cost' in df.columns:
            df['target_cost_overrun_binary'] = np.where(
                df['revised_cost'].notna() & (df['revised_cost'] > df['original_cost_snap']),
                1, 0
            )

        return df, self.feature_names
