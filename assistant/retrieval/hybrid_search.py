"""
PRODECHX — Hybrid Vector & Keyword Retrieval Engine
Combines 384-dim Cosine Vector Similarity + Exact Keyword Match + Metadata Filtering
"""

import sys
import json
import os
import re
import numpy as np

sys.path.insert(0, r'd:\SIH')

from services.rag.ingest_chunks import SimpleVectorEmbedder


class HybridRetriever:
    def __init__(self, catalog_path=r'C:\Users\BLUECITY\.gemini\antigravity-ide\brain\5ac31ea6-a1e0-46a9-9741-3e6e329711a7\scratch\paimana_chunks_384.json'):
        self.catalog_path = catalog_path
        self.embedder = SimpleVectorEmbedder(dim=384)
        self.chunks = []
        self.load_chunks()

    def load_chunks(self):
        if os.path.exists(self.catalog_path):
            with open(self.catalog_path, 'r', encoding='utf-8') as f:
                self.chunks = json.load(f)

    def retrieve(self, query, project_code=None, top_k=3):
        """Performs hybrid vector similarity + metadata filter retrieval."""
        if not self.chunks:
            return []

        # Detect 6-digit project code if embedded in query string
        pcode_match = re.search(r'(\d{6})', query)
        target_pcode = pcode_match.group(1) if pcode_match else project_code

        query_vec = np.array(self.embedder.encode(query), dtype=np.float32)
        q_tokens = set(re.findall(r'\w+', query.lower()))

        scored_chunks = []
        for chunk in self.chunks:
            chunk_vec = np.array(chunk['embedding'], dtype=np.float32)
            # Cosine similarity
            cosine_sim = float(np.dot(query_vec, chunk_vec))

            # Metadata exact code match boost
            code_boost = 0.0
            if target_pcode and chunk.get('project_code') == target_pcode:
                code_boost = 0.50

            # Keyword match boost
            text_tokens = set(re.findall(r'\w+', chunk.get('chunk_text', '').lower()))
            overlap = len(q_tokens.intersection(text_tokens))
            kw_boost = overlap * 0.05

            final_score = cosine_sim + code_boost + kw_boost
            scored_chunks.append((final_score, chunk))

        # Sort by final hybrid score DESC
        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored_chunks[:top_k]]
