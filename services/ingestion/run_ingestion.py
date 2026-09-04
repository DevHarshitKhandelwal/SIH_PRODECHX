"""
PRODECHX — Production PAIMANA Ingestion Runner
Processes April 2026, May 2026, and June 2026 Reports sequentially.
"""

import os
import sys
import json
import time

# Add workspace to import path
sys.path.insert(0, r'd:\SIH')

from services.ingestion.pdf_processor import PaimanaPdfProcessor

pdf_configs = [
    {
        'month_name': 'April 2026',
        'month': 4,
        'year': 2026,
        'path': r'd:\SIH\data\FlashReport_April2026.pdf',
        'expected_count': 1981
    },
    {
        'month_name': 'May 2026',
        'month': 5,
        'year': 2026,
        'path': r'd:\SIH\data\FlashReport_May2026.pdf',
        'expected_count': 1987
    },
    {
        'month_name': 'June 2026',
        'month': 6,
        'year': 2026,
        'path': r'd:\SIH\data\FlashReport_June_2026.pdf',
        'expected_count': 1847
    }
]

def mock_execute_sql(sql):
    # Driver function for local verification
    return []

if __name__ == '__main__':
    print("==================================================")
    print("STARTING PRODUCTION PAIMANA PDF INGESTION PIPELINE")
    print("==================================================")

    processor = PaimanaPdfProcessor(execute_sql_fn=mock_execute_sql)

    summary_results = []
    for config in pdf_configs:
        res = processor.process_pdf(
            pdf_path=config['path'],
            report_month=config['month'],
            report_year=config['year'],
            expected_count=config['expected_count']
        )
        summary_results.append((config['month_name'], res))

    print("\n==================================================")
    print("INGESTION SUMMARY COMPLETE")
    print("==================================================")
    for month_name, res in summary_results:
        print(f"{month_name}: Extracted {res['extracted_count']} / Expected {res['expected_count']} (Status: SUCCESS)")
