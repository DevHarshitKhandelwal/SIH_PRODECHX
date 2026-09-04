"""
PRODECHX — Production PAIMANA PDF Ingestion Processor
Target Engine: Python 3.11+ / PyMuPDF / Supabase PostgreSQL
"""

import hashlib
import os
import re
import time
import json
import fitz  # PyMuPDF


class PaimanaPdfProcessor:
    def __init__(self, execute_sql_fn=None, storage_upload_fn=None):
        self.execute_sql_fn = execute_sql_fn
        self.storage_upload_fn = storage_upload_fn

    @staticmethod
    def calculate_checksum(file_path):
        sha256 = hashlib.sha256()
        with open(file_path, "rb") as f:
            while chunk := f.read(8192):
                sha256.update(chunk)
        return sha256.hexdigest()

    def process_pdf(self, pdf_path, report_month, report_year, expected_count):
        start_time = time.time()
        file_name = os.path.basename(pdf_path)
        file_size = os.path.getsize(pdf_path)
        checksum = self.calculate_checksum(pdf_path)

        doc = fitz.open(pdf_path)
        page_count = len(doc)
        storage_path = f"paimana-documents/{report_year}/{report_month:02d}/{file_name}"

        print(f"\n==================================================")
        print(f"PROCESSING DOCUMENT: {file_name}")
        print(f"Checksum: {checksum}")
        print(f"Pages: {page_count} | Size: {file_size} bytes | Expected: {expected_count}")
        print(f"==================================================")

        # Step 1: Duplicate Check & Registration
        doc_id = self._register_document(
            file_name, storage_path, checksum, report_month, report_year, file_size, page_count
        )
        if not doc_id:
            print(f"Skipping duplicate document registration for {file_name}")
            return None

        # Step 2: Storage Upload Simulation / API Call
        if self.storage_upload_fn:
            self.storage_upload_fn(pdf_path, storage_path)
        self._log_stage(doc_id, "PDF_UPLOADED", "COMPLETED", f"Uploaded to {storage_path}")

        # Step 3: Page Text Extraction & Provenance
        page_id_map = self._extract_and_store_pages(doc_id, doc)
        self._log_stage(doc_id, "TEXT_EXTRACTED", "COMPLETED", f"Extracted {page_count} pages")

        # Step 4: Table 6 Extraction & Validation
        extracted_rows = self._extract_table6_rows(doc, doc_id, expected_count)
        actual_count = len(extracted_rows)

        if actual_count != expected_count:
            self._update_document_status(doc_id, "REVIEW_REQUIRED", f"Extracted count {actual_count} != expected {expected_count}")
            self._log_stage(doc_id, "VALIDATED", "FAILED", f"Count mismatch: Extracted {actual_count}, Expected {expected_count}")
            print(f"CRITICAL: Count mismatch for {file_name}. Extracted {actual_count}, Expected {expected_count}")
            return doc_id

        self._log_stage(doc_id, "VALIDATED", "COMPLETED", f"Validated count {actual_count}")

        # Step 5: Database Ingestion (Projects & Monthly Updates)
        created_projects, matched_projects, updates_created = self._ingest_projects_and_updates(
            extracted_rows, doc_id, report_month, report_year
        )

        # Step 6: Document Chunks Creation for Future RAG
        chunk_count = self._create_document_chunks(doc_id, doc, page_id_map)
        self._log_stage(doc_id, "CHUNKS_CREATED", "COMPLETED", f"Created {chunk_count} chunks")

        # Step 7: Complete Document Registration
        exec_ms = int((time.time() - start_time) * 1000)
        self._update_document_status(doc_id, "COMPLETED", None, projects_detected=actual_count)
        self._log_stage(doc_id, "COMPLETED", "COMPLETED", f"Ingested {actual_count} updates in {exec_ms} ms", rows=actual_count, exec_time_ms=exec_ms)

        print(f"DOCUMENT {file_name} INGESTION COMPLETE:")
        print(f"  Created Projects: {created_projects} | Matched Projects: {matched_projects}")
        print(f"  Monthly Updates Created: {updates_created} | Execution Time: {exec_ms} ms")

        return {
            'doc_id': doc_id,
            'expected_count': expected_count,
            'extracted_count': actual_count,
            'created_projects': created_projects,
            'matched_projects': matched_projects,
            'updates_created': updates_created,
            'chunk_count': chunk_count,
            'execution_time_ms': exec_ms
        }

    def _register_document(self, file_name, storage_path, checksum, month, year, file_size, page_count):
        if not self.execute_sql_fn:
            return "mock-doc-uuid"

        # Check existing checksum
        check_sql = f"SELECT id FROM documents WHERE checksum_sha256 = '{checksum}';"
        res = self.execute_sql_fn(check_sql)
        if res and len(res) > 0:
            existing_id = res[0]['id']
            print(f"Document already registered with ID {existing_id}. Duplicate detected.")
            return None

        # Insert new document
        insert_sql = f"""
        INSERT INTO documents (
            file_name, storage_path, checksum_sha256, report_month, report_year,
            total_pages, processing_status, uploaded_at
        ) VALUES (
            '{file_name}', '{storage_path}', '{checksum}', {month}, {year},
            {page_count}, 'PROCESSING', NOW()
        ) RETURNING id;
        """
        res = self.execute_sql_fn(insert_sql)
        return res[0]['id'] if res else None

    def _update_document_status(self, doc_id, status, error_log=None, projects_detected=0):
        if not self.execute_sql_fn:
            return
        err_val = f"'{error_log}'" if error_log else "NULL"
        sql = f"""
        UPDATE documents SET 
            processing_status = '{status}',
            error_log = {err_val},
            projects_detected = {projects_detected},
            processed_at = NOW()
        WHERE id = '{doc_id}';
        """
        self.execute_sql_fn(sql)

    def _log_stage(self, doc_id, stage, status, message=None, rows=0, exec_time_ms=0):
        if not self.execute_sql_fn:
            return
        msg_val = f"'{message}'" if message else "NULL"
        sql = f"""
        INSERT INTO extraction_logs (
            document_id, stage, status, rows_extracted, message, execution_time_ms, timestamp
        ) VALUES (
            '{doc_id}', '{stage}', '{status}', {rows}, {msg_val}, {exec_time_ms}, NOW()
        );
        """
        self.execute_sql_fn(sql)

    def _extract_and_store_pages(self, doc_id, doc):
        page_map = {}
        for p_idx in range(len(doc)):
            page = doc[p_idx]
            text = page.get_text() or ""
            printed_page_match = re.search(r'Page\s+(\d+)', text)
            printed_page = printed_page_match.group(1) if printed_page_match else f"Printed-{p_idx+1}"
            
            if self.execute_sql_fn:
                escaped_text = text.replace("'", "''")
                sql = f"""
                INSERT INTO document_pages (
                    document_id, physical_page_number, printed_page_number, page_text
                ) VALUES (
                    '{doc_id}', {p_idx+1}, '{printed_page}', '{escaped_text}'
                ) ON CONFLICT (document_id, physical_page_number) DO UPDATE SET page_text = EXCLUDED.page_text
                RETURNING id;
                """
                res = self.execute_sql_fn(sql)
                if res:
                    page_map[p_idx+1] = res[0]['id']
        return page_map

    def _extract_table6_rows(self, doc, doc_id, expected_count):
        extracted_rows = []
        current_ministry = "Unknown"
        current_sector = "Unknown"

        for p_idx in range(len(doc)):
            page = doc[p_idx]
            text = page.get_text() or ""

            if p_idx > 50 and ("Sl.No" in text or "Original Cost" in text or "Table 6" in text):
                printed_page_match = re.search(r'Page\s+(\d+)', text)
                printed_page = printed_page_match.group(1) if printed_page_match else f"P-{p_idx+1}"

                tabs = page.find_tables()
                for tab in tabs:
                    table_grid = tab.extract()
                    for row in table_grid:
                        if not row or len(row) < 8:
                            continue

                        sl_no_raw = (row[0] or "").strip()
                        col1_raw = (row[1] or "").strip()

                        if sl_no_raw.startswith("Total") or col1_raw.startswith("Total"):
                            continue

                        if col1_raw.startswith("Ministry of ") or col1_raw.startswith("Department of "):
                            current_ministry = col1_raw
                            continue
                        elif col1_raw and sl_no_raw == "" and not re.search(r'\(\d{6}\)', col1_raw):
                            current_sector = col1_raw
                            continue

                        if sl_no_raw == 'Sl.No' or 'Project Name' in col1_raw:
                            continue

                        if re.match(r'^\d+$', sl_no_raw):
                            sn = int(sl_no_raw)

                            pcode_match = re.search(r'\((\d{6})\)', col1_raw)
                            pcode = pcode_match.group(1) if pcode_match else None

                            legacy_match = re.search(r'\(([A-Z0-9]{8,12})\)', col1_raw)
                            legacy_code = legacy_match.group(1) if legacy_match else None

                            pmgid_match = re.search(r'\)\s*\(([\d]{3,6})\)', col1_raw)
                            pmgid = pmgid_match.group(1) if pmgid_match else None

                            col1_lines = [l.strip() for l in col1_raw.split('\n') if l.strip()]
                            pname = col1_lines[0] if col1_lines else "Unknown Project"

                            agency = None
                            for l in col1_lines[1:]:
                                if l.startswith("(") and not re.match(r'\(\d{6}\)', l) and not re.match(r'\([A-Z0-9]{8,12}\)', l) and not re.match(r'\(\d{3,6}\)', l):
                                    agency = l.strip("()")
                                    break

                            state = (row[2] or "").strip() or "PAN India"
                            approval_start = (row[3] or "").strip()
                            doc_dates = (row[4] or "").strip()
                            costs_raw = (row[5] or "").strip()
                            exp_raw = (row[6] or "").strip()
                            prog_raw = (row[7] or "").strip()

                            date_lines = [l.strip() for l in approval_start.split('\n') if l.strip()]
                            date_of_approval = date_lines[0] if len(date_lines) >= 1 else None
                            start_date = date_lines[1].strip("()") if len(date_lines) >= 2 else None

                            doc_lines = [l.strip() for l in doc_dates.split('\n') if l.strip()]
                            original_doc = doc_lines[0] if len(doc_lines) >= 1 else None
                            revised_doc = doc_lines[1].strip("()") if len(doc_lines) >= 2 else None
                            if revised_doc == '-':
                                revised_doc = None

                            cost_lines = [l.strip() for l in costs_raw.split('\n') if l.strip()]
                            orig_cost = None
                            rev_cost = None
                            rev_cost_is_dash = False

                            if len(cost_lines) >= 1:
                                try:
                                    orig_cost = float(cost_lines[0].replace(',', ''))
                                except ValueError:
                                    orig_cost = 1.0

                            if len(cost_lines) >= 2:
                                r_str = re.sub(r'[\(\)]', '', cost_lines[1]).strip()
                                if r_str == '-' or r_str == '':
                                    rev_cost = None
                                    rev_cost_is_dash = True
                                else:
                                    try:
                                        rev_cost = float(r_str.replace(',', ''))
                                    except ValueError:
                                        rev_cost = None

                            cum_exp = 0.00
                            try:
                                cum_exp = float(exp_raw.replace(',', ''))
                            except ValueError:
                                cum_exp = 0.00

                            prog_pct = 0.00
                            try:
                                prog_pct = float(prog_raw.replace('%', '').replace(',', '').strip())
                            except ValueError:
                                prog_pct = 0.00

                            extracted_rows.append({
                                'sn': sn,
                                'project_code': pcode,
                                'legacy_ocms_code': legacy_code,
                                'pmgid': pmgid,
                                'project_name': pname,
                                'agency_name': agency,
                                'ministry_name': current_ministry,
                                'sector_name': current_sector,
                                'state_name': state,
                                'date_of_approval': date_of_approval,
                                'start_date': start_date,
                                'original_doc': original_doc,
                                'revised_doc': revised_doc,
                                'original_cost': orig_cost,
                                'revised_cost': rev_cost,
                                'rev_cost_is_dash': rev_cost_is_dash,
                                'cumulative_expenditure': cum_exp,
                                'physical_progress_pct': prog_pct,
                                'physical_page': p_idx + 1,
                                'printed_page': printed_page
                            })

        return extracted_rows

    def _ingest_projects_and_updates(self, extracted_rows, doc_id, report_month, report_year):
        if not self.execute_sql_fn:
            return len(extracted_rows), 0, len(extracted_rows)

        created_projects = 0
        matched_projects = 0
        updates_created = 0
        report_date = f"{report_year}-{report_month:02d}-01"

        for row in extracted_rows:
            pcode = row['project_code']
            if not pcode:
                # Log Data Quality Issue for Missing Project Code
                sql_issue = f"""
                INSERT INTO data_quality_issues (
                    issue_type, severity, status, source_document_id, source_page, field_name, source_value, description
                ) VALUES (
                    'MISSING_PROJECT_CODE', 'CRITICAL', 'OPEN', '{doc_id}', {row['physical_page']}, 'project_code', '{row['project_name'][:100]}', 'Project Code could not be parsed'
                );
                """
                self.execute_sql_fn(sql_issue)
                continue

            # 1. Resolve Ministry ID
            min_sql = f"INSERT INTO ministries (name) VALUES ('{row['ministry_name'].replace("'", "''")}') ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id;"
            min_res = self.execute_sql_fn(min_sql)
            ministry_id = min_res[0]['id'] if min_res else None

            # 2. Resolve Sector ID
            sec_sql = f"INSERT INTO sectors (name) VALUES ('{row['sector_name'].replace("'", "''")}') ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id;"
            sec_res = self.execute_sql_fn(sec_sql)
            sector_id = sec_res[0]['id'] if sec_res else None

            # 3. Resolve Agency ID
            agency_id = None
            if row['agency_name']:
                ag_sql = f"INSERT INTO agencies (name, ministry_id) VALUES ('{row['agency_name'].replace("'", "''")}', '{ministry_id}') ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id;"
                ag_res = self.execute_sql_fn(ag_sql)
                agency_id = ag_res[0]['id'] if ag_res else None

            # 4. Resolve State ID
            state_sql = f"SELECT id FROM states WHERE name = '{row['state_name'].replace("'", "''")}';"
            state_res = self.execute_sql_fn(state_sql)
            state_id = state_res[0]['id'] if state_res else None

            # 5. Check if project exists
            proj_check = f"SELECT id FROM projects WHERE project_code = '{pcode}';"
            proj_res = self.execute_sql_fn(proj_check)

            orig_cost_val = row['original_cost'] if row['original_cost'] is not None else 1.0

            if proj_res and len(proj_res) > 0:
                project_id = proj_res[0]['id']
                matched_projects += 1
            else:
                pname_esc = row['project_name'].replace("'", "''")
                legacy_val = f"'{row['legacy_ocms_code']}'" if row['legacy_ocms_code'] else "NULL"
                pmgid_val = f"'{row['pmgid']}'" if row['pmgid'] else "NULL"
                agency_val = f"'{agency_id}'" if agency_id else "NULL"
                state_val = f"'{state_id}'" if state_id else "NULL"
                state_name_val = f"'{row['state_name'].replace("'", "''")}'"

                insert_proj = f"""
                INSERT INTO projects (
                    project_code, legacy_ocms_code, pmgid, project_name,
                    ministry_id, sector_id, agency_id, state_id, state_name,
                    original_cost, is_active
                ) VALUES (
                    '{pcode}', {legacy_val}, {pmgid_val}, '{pname_esc}',
                    '{ministry_id}', '{sector_id}', {agency_val}, {state_val}, {state_name_val},
                    {orig_cost_val}, true
                ) RETURNING id;
                """
                new_p = self.execute_sql_fn(insert_proj)
                project_id = new_p[0]['id']
                created_projects += 1

            # 6. Insert Monthly Update Snapshot
            rev_cost_val = f"{row['revised_cost']}" if row['revised_cost'] is not None else "NULL"
            rev_doc_val = f"'{row['revised_doc']}'" if row['revised_doc'] else "NULL"

            insert_upd = f"""
            INSERT INTO project_updates (
                project_id, document_id, serial_number, source_physical_page, source_printed_page,
                report_month, report_year, report_date, revised_cost, cumulative_expenditure,
                physical_progress_pct, revised_doc, original_cost_snap
            ) VALUES (
                '{project_id}', '{doc_id}', {row['sn']}, {row['physical_page']}, '{row['printed_page']}',
                {report_month}, {report_year}, '{report_date}', {rev_cost_val}, {row['cumulative_expenditure']},
                {row['physical_progress_pct']}, {rev_doc_val}, {orig_cost_val}
            ) ON CONFLICT (project_id, report_year, report_month) DO UPDATE SET
                cumulative_expenditure = EXCLUDED.cumulative_expenditure,
                physical_progress_pct = EXCLUDED.physical_progress_pct
            RETURNING id;
            """
            upd_res = self.execute_sql_fn(insert_upd)
            if upd_res:
                updates_created += 1
                update_id = upd_res[0]['id']

                # 7. Check Data Quality Warning: revised_cost < original_cost
                if row['revised_cost'] is not None and row['revised_cost'] < orig_cost_val:
                    sql_dq = f"""
                    INSERT INTO data_quality_issues (
                        issue_type, severity, status, project_id, project_update_id, source_document_id,
                        source_page, field_name, source_value, normalized_value, description
                    ) VALUES (
                        'APPROVED_COST_REDUCTION', 'WARNING', 'OPEN', '{project_id}', '{update_id}', '{doc_id}',
                        {row['physical_page']}, 'revised_cost', '{row['revised_cost']}', '{row['revised_cost']}',
                        'Approved Revised Cost ({row['revised_cost']} Cr) is less than Original Sanctioned Cost ({orig_cost_val} Cr)'
                    );
                    """
                    self.execute_sql_fn(sql_dq)

        return created_projects, matched_projects, updates_created

    def _create_document_chunks(self, doc_id, doc, page_id_map):
        chunk_count = 0
        for p_idx in range(len(doc)):
            page_num = p_idx + 1
            page_id = page_id_map.get(page_num)
            text = doc[p_idx].get_text() or ""
            if not text.strip():
                continue

            # Basic sliding window chunking (500 chars)
            chunks = [text[i:i+500] for i in range(0, len(text), 450)]
            for idx, c in enumerate(chunks):
                if self.execute_sql_fn:
                    c_esc = c.replace("'", "''")
                    page_id_val = f"'{page_id}'" if page_id else "NULL"
                    sql = f"""
                    INSERT INTO document_chunks (
                        document_id, page_id, page_number, chunk_index, chunk_text
                    ) VALUES (
                        '{doc_id}', {page_id_val}, {page_num}, {idx}, '{c_esc}'
                    );
                    """
                    self.execute_sql_fn(sql)
                    chunk_count += 1

        return chunk_count
