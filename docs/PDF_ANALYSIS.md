# PRODECHX — PAIMANA PDF Analysis & Discovery Report

> **Document Version:** 2.0.0  
> **Author:** Lead Data Architect & Engineer, PRODECHX  
> **Date:** August 24, 2026  
> **Authoritative Source Documents Analyzed:**  
> - `d:/SIH/data/FlashReport_April2026.pdf` (3,215,216 bytes, 163 physical pages)  
> - `d:/SIH/data/FlashReport_May2026.pdf` (3,217,996 bytes, 163 physical pages)  
> - `d:/SIH/data/FlashReport_June_2026.pdf` (6,540,236 bytes, 161 physical pages)

---

## 1. Corrected Executive Summary & Portfolio Totals

Re-analysis of the three official MoSPI PAIMANA Flash Reports confirms the complete national infrastructure monitoring portfolio totals:

- **April 2026**: **1,981 ongoing projects** (Stated on Page 4 National Overview; Table 6 spans **S.No 1 to S.No 1,981** across physical pages 54 to 163).
- **May 2026**: **1,987 ongoing projects** (Stated on Page 4 National Overview; Table 6 spans **S.No 1 to S.No 1,987** across physical pages 53 to 163).
- **June 2026**: **1,847 ongoing projects** (Stated on Page 4 National Overview; Table 6 spans **S.No 1 to S.No 1,847** across physical pages 58 to 160).

---

## 2. Page & Section Structure of PAIMANA Reports

Each monthly PAIMANA Flash Report PDF follows a strict 5-part hierarchical organization:

### Part I: Cover & Table of Contents (Pages 1–2)
- **Page 1 (Physical P.1)**: Executive title banner, PAIMANA portal QR code/URL (`https://paimana-proj.mospi.gov.in`), reporting month/year.
- **Page 2 (Physical P.2)**: Table of Contents listing Table 1 through Table 6 page references.

### Part II: Executive Overview & Visual Aggregates (Pages 3–5)
- **Page 3 (Physical P.3)**: Executive Summary KPI Cards (Total Ongoing Projects, Sanctioned Cost, Revised Cost, Cumulative Expenditure).
- **Page 4 (Physical P.4)**: National Sectoral & Ministry Distribution charts. Stated total portfolio numbers:
  - April 2026: **1,981 Projects**
  - May 2026: **1,987 Projects**
  - June 2026: **1,847 Projects**
- **Page 5 (Physical P.5)**: Mega Projects (> Rs. 1000 Cr) vs Major Projects (Rs. 150 Cr - Rs. 1000 Cr) comparison.

### Part III: Regional Focus & HML Sectors (Pages 6–14)
- **Pages 6–7**: Special Focus on North Eastern Region (NER) project progress.
- **Pages 8–14**: Harmonized Master List (HML) 2022 sector classification briefs (Transport & Logistics, Energy, Water & Sanitation, Communication, Social & Commercial).

### Part IV: Major Infrastructure Line Ministries (Pages 15–21)
- Dedicated single-page briefs with Top 5 Monitored Projects for key infrastructure line ministries (Coal, Railways, Road Transport & Highways, Petroleum & Natural Gas, Power).

### Part V: Appendix — List of Tables (Pages 22 to Tail)
- **Table 1: Ministry-wise Ongoing Projects** (`April: Pages 23–24`) — 7 columns.
- **Table 2: State-wise Ongoing Projects** (`April: Pages 25–33`) — 8 columns.
- **Table 3: Completed Projects During Month** (`April: Pages 34–35`) — 10 columns.
- **Table 4: Newly Added Projects** (`April: Pages 36–39`) — 8 columns.
- **Table 5: Ongoing Projects of North Eastern Region** (`April: Pages 40–53`) — 12 columns.
- **Table 6: All Ongoing Projects** (Master Register):
  - **April 2026**: Physical P.54 to P.163 (Printed P.53 to P.162) — **S.No 1 to 1,981**
  - **May 2026**: Physical P.53 to P.163 (Printed P.52 to P.162) — **S.No 1 to 1,987**
  - **June 2026**: Physical P.58 to P.160 (Printed P.57 to P.159) — **S.No 1 to 1,847**

---

## 3. Physical Page vs Printed Page Mapping Reference

| Report Month | Total Physical PDF Pages | Table 6 Title Page | Table 6 First Serial No Page | Table 6 Last Serial No Page | Printed Footer Page Range |
|---|---:|---|---|---|---|
| **April 2026** | 163 | Physical P.54 | Physical P.55 (S.No 1) | Physical P.163 (S.No 1981) | Printed P.53 to P.162 |
| **May 2026** | 163 | Physical P.53 | Physical P.54 (S.No 1) | Physical P.163 (S.No 1987) | Printed P.52 to P.162 |
| **June 2026** | 161 | Physical P.58 | Physical P.59 (S.No 1) | Physical P.160 (S.No 1847) | Printed P.57 to P.159 |

---

## 4. Table Parsing & Extraction Strategy

- **100% Extractable Digital Vector Text**: Table 1 through Table 6 are rendered as vector text tables with explicit gridlines. `pdfplumber` or `pymupdf` `find_tables()` cleanly extracts all 8 columns per row without requiring OCR.
- **Multi-Line Wrapping Handling**:
  - `Sl.No` is printed in Column 0 as a clean integer (`1`, `2`, ..., `1981`).
  - Column 1 wraps `Project Name`, `(Agency)`, `(Project Code)`, `(Legacy OCMS Code)`, `(PMGID)` over 3–5 lines.
  - Section headers (`Ministry of ...`, `Coal`, `Railways`) span across Table 6 rows without a serial number in Column 0, enabling clean section boundary detection.
