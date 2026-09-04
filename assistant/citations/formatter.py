"""
PRODECHX — PAIMANA Grounded Citation Formatter
"""

import re


class CitationFormatter:
    @staticmethod
    def format_citation(period, page_number):
        """Formats explicit citation tag: [PAIMANA April 2026, p. 42]"""
        return f"[PAIMANA {period}, p. {page_number}]"

    @staticmethod
    def format_evidence_block(sources_list):
        """Formats structured evidence block for assistant response display."""
        formatted_sources = []
        for src in sources_list:
            period = src.get('period', 'April 2026')
            page = src.get('page_number', 1)
            pcode = src.get('project_code', 'General')
            text = src.get('chunk_text', '')[:150]
            citation_tag = CitationFormatter.format_citation(period, page)
            formatted_sources.append({
                'citation_tag': citation_tag,
                'period': period,
                'page_number': page,
                'project_code': pcode,
                'snippet': text
            })
        return formatted_sources
