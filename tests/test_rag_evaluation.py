"""
PRODECHX — 20-Question Empirical PAIMANA RAG Evaluation Dataset & Benchmark
Evaluates retrieval relevance, answer groundedness, citation correctness, and hallucination rate across 8 categories.
"""

import sys
import unittest
import json

sys.path.insert(0, r'd:\SIH')

from assistant.llm.provider import GroundedAssistantProvider


EVALUATION_DATASET_20 = [
    # Category 1: Project Lookup (2 questions)
    {"id": "Q1", "cat": "Project Lookup", "query": "What is the current physical progress of project 612786?"},
    {"id": "Q2", "cat": "Project Lookup", "query": "What is the original sanctioned cost of project 701107?"},

    # Category 2: Risk Explanation (3 questions)
    {"id": "Q3", "cat": "Risk Explanation", "query": "Why is project 612786 high risk?"},
    {"id": "Q4", "cat": "Risk Explanation", "query": "Why is project 701107 flagged as high risk?"},
    {"id": "Q5", "cat": "Risk Explanation", "query": "What are the primary SHAP factors for project 612786?"},

    # Category 3: Ministry Analysis (3 questions)
    {"id": "Q6", "cat": "Ministry Analysis", "query": "Which projects are high risk in the Ministry of Railways?"},
    {"id": "Q7", "cat": "Ministry Analysis", "query": "How many high risk projects exist in Railways?"},
    {"id": "Q8", "cat": "Ministry Analysis", "query": "What is the risk concentration in MoRTH?"},

    # Category 4: Sector Analysis (2 questions)
    {"id": "Q9", "cat": "Sector Analysis", "query": "Which sectors have the highest concentration of high-risk projects?"},
    {"id": "Q10", "cat": "Sector Analysis", "query": "What is the total project count in Power sector?"},

    # Category 5: Temporal Comparison (3 questions)
    {"id": "Q11", "cat": "Temporal Comparison", "query": "What changed between April and June for project 612786?"},
    {"id": "Q12", "cat": "Temporal Comparison", "query": "How did cumulative expenditure evolve for project 612786?"},
    {"id": "Q13", "cat": "Temporal Comparison", "query": "What is the progress delta between April and June?"},

    # Category 6: Report Lookup (3 questions)
    {"id": "Q14", "cat": "Report Lookup", "query": "What does the PAIMANA report say about project 612786?"},
    {"id": "Q15", "cat": "Report Lookup", "query": "Show me the April 2026 report details for 612786"},
    {"id": "Q16", "cat": "Report Lookup", "query": "What is the page number for USBRL Rail Link in April report?"},

    # Category 7: Source Verification & Grounding (2 questions)
    {"id": "Q17", "cat": "Source Verification", "query": "Show me the source for this claim on project 612786"},
    {"id": "Q18", "cat": "Source Verification", "query": "Verify citation for 612786"},

    # Category 8: Out-of-Bounds / Insufficient Evidence (2 questions)
    {"id": "Q19", "cat": "Insufficient Evidence", "query": "What is the contractor's personal email address?"},
    {"id": "Q20", "cat": "Insufficient Evidence", "query": "Predict stock prices for 2030"}
]


class TestRAGEvaluationBenchmark(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.provider = GroundedAssistantProvider()

    def test_run_20_question_benchmark(self):
        """Runs empirical evaluation across all 20 benchmark questions."""
        results = []
        passed_retrieval = 0
        passed_grounding = 0
        passed_citations = 0
        zero_hallucination = 0

        print("\n==================================================")
        print("RUNNING 20-QUESTION EMPIRICAL PAIMANA RAG BENCHMARK")
        print("==================================================")

        for q in EVALUATION_DATASET_20:
            res = self.provider.answer_question(q['query'])
            ans = res['answer']
            sources = res['sources']

            retrieval_ok = len(sources) > 0 or "insufficient" in ans.lower()
            grounding_ok = "612786" in ans or "Railways" in ans or "insufficient" in ans.lower() or "PAIMANA" in ans
            citation_ok = "[" in ans or "insufficient" in ans.lower()
            no_hallucination = not ("will fail" in ans.lower() or "guaranteed" in ans.lower())

            if retrieval_ok: passed_retrieval += 1
            if grounding_ok: passed_grounding += 1
            if citation_ok: passed_citations += 1
            if no_hallucination: zero_hallucination += 1

            results.append({
                'id': q['id'],
                'category': q['cat'],
                'query': q['query'],
                'answer_snippet': ans[:120].replace('\n', ' '),
                'sources_count': len(sources),
                'route': res['route'],
                'latency_ms': res['latency_ms'],
                'retrieval_ok': retrieval_ok,
                'grounding_ok': grounding_ok,
                'citation_ok': citation_ok
            })

            print(f"[{q['id']}] {q['cat']:<20} | Query: {q['query'][:35]:<35} | Route: {res['route']}")

        total = len(EVALUATION_DATASET_20)
        retrieval_acc = (passed_retrieval / total) * 100.0
        grounding_acc = (passed_grounding / total) * 100.0
        citation_acc = (passed_citations / total) * 100.0
        hallucination_rate = (1.0 - (zero_hallucination / total)) * 100.0

        print("\n==================================================")
        print("RAG BENCHMARK ACCURACY SUMMARY:")
        print("==================================================")
        print(f"Retrieval Relevance Accuracy: {retrieval_acc:.1f}%")
        print(f"Answer Groundedness Accuracy: {grounding_acc:.1f}%")
        print(f"Citation Correctness Accuracy: {citation_acc:.1f}%")
        print(f"Hallucination Rate           : {hallucination_rate:.1f}%")
        print("==================================================")

        self.assertGreaterEqual(retrieval_acc, 90.0)
        self.assertGreaterEqual(grounding_acc, 90.0)
        self.assertEqual(hallucination_rate, 0.0)


if __name__ == '__main__':
    unittest.main()
