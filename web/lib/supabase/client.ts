/**
 * PRODECHX — Supabase PostgreSQL Safe Client Integration
 * Host: db.uezwwbijdulbewouanny.supabase.co
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uezwwbijdulbewouanny.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlend3YmlqZHVsYmV3b3Vhbm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNjg5MzksImV4cCI6MjA1NTc0NDkzOX0.p4R";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface ProjectRecord {
  id: string;
  project_code: string;
  project_name: string;
  ministry_name: string;
  sector_name: string;
  state_name: string;
  agency_name: string;
  original_cost: number;
  revised_cost?: number;
  cumulative_expenditure: number;
  physical_progress_pct: number;
  report_month: number;
  report_year: number;
  approval_date?: string;
  start_date?: string;
  original_doc?: string;
  revised_doc?: string;
}
