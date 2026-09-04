-- PRODECHX — Migration 005: Sample Infrastructure Projects & Updates Seed Data
-- Target Database Engine: Supabase PostgreSQL 15+

-- 1. SECTORS
INSERT INTO sectors (id, name, hml_category) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Railways', 'HIGH'),
    ('22222222-2222-2222-2222-222222222222', 'Road Transport & Highways', 'HIGH'),
    ('33333333-3333-3333-3333-333333333333', 'Power', 'HIGH'),
    ('44444444-4444-4444-4444-444444444444', 'Urban Development', 'MEDIUM'),
    ('55555555-5555-5555-5555-555555555555', 'Ports & Shipping', 'MEDIUM'),
    ('66666666-6666-6666-6666-666666666666', 'Civil Aviation', 'MEDIUM')
ON CONFLICT (name) DO NOTHING;

-- 2. MINISTRIES
INSERT INTO ministries (id, name, code) VALUES
    ('a1111111-1111-1111-1111-111111111111', 'Ministry of Railways', 'MoR'),
    ('a2222222-2222-2222-2222-222222222222', 'Ministry of Road Transport and Highways', 'MoRTH'),
    ('a3333333-3333-3333-3333-333333333333', 'Ministry of Power', 'MoP'),
    ('a4444444-4444-4444-4444-444444444444', 'Ministry of Housing and Urban Affairs', 'MoHUA'),
    ('a5555555-5555-5555-5555-555555555555', 'Ministry of Ports, Shipping and Waterways', 'MoPSW'),
    ('a6666666-6666-6666-6666-666666666666', 'Ministry of Civil Aviation', 'MoCA')
ON CONFLICT (name) DO NOTHING;

-- 3. AGENCIES
INSERT INTO agencies (id, name, abbreviation, ministry_id) VALUES
    ('b1111111-1111-1111-1111-111111111111', 'Northern Railway', 'NR', 'a1111111-1111-1111-1111-111111111111'),
    ('b2222222-2222-2222-2222-222222222222', 'National Highways Authority of India', 'NHAI', 'a2222222-2222-2222-2222-222222222222'),
    ('b3333333-3333-3333-3333-333333333333', 'NTPC Limited', 'NTPC', 'a3333333-3333-3333-3333-333333333333'),
    ('b4444444-4444-4444-4444-444444444444', 'Kochi Metro Rail Limited', 'KMRL', 'a4444444-4444-4444-4444-444444444444')
ON CONFLICT (name) DO NOTHING;

-- 4. PROJECTS
INSERT INTO projects (id, project_code, name, ministry_id, sector_id, agency_id, original_cost, revised_cost, approval_date) VALUES
    ('c1111111-1111-1111-1111-111111111111', '612786', 'Udhampur Srinagar Baramulla Rail Link (USBRL)', 'a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 2500.00, 37012.00, '1995-03-01'),
    ('c2222222-2222-2222-2222-222222222222', '701107', 'Mumbai Trans Harbour Link (MTHL)', 'a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 17843.00, 21200.00, '2016-02-15'),
    ('c3333333-3333-3333-3333-333333333333', '749021', 'Navi Mumbai International Airport Phase 1', 'a6666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'b4444444-4444-4444-4444-444444444444', 16000.00, 19600.00, '2018-01-10'),
    ('c4444444-4444-4444-4444-444444444444', '812304', 'Eastern Dedicated Freight Corridor (EDFC)', 'a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 30358.00, 38100.00, '2006-10-01'),
    ('c5555555-5555-5555-5555-555555555555', '410293', 'NTPC Patratu Super Thermal Power Expansion', 'a3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', 18138.00, 21400.00, '2018-05-20')
ON CONFLICT (project_code) DO NOTHING;

-- 5. PROJECT UPDATES (PAIMANA MONTHLY SNAPSHOTS)
INSERT INTO project_updates (project_id, report_year, report_month, original_cost_snap, cumulative_expenditure, physical_progress_pct) VALUES
    ('c1111111-1111-1111-1111-111111111111', 2026, 4, 2500.00, 30350.00, 92.5),
    ('c1111111-1111-1111-1111-111111111111', 2026, 5, 2500.00, 31100.00, 93.8),
    ('c1111111-1111-1111-1111-111111111111', 2026, 6, 2500.00, 32000.00, 94.2),
    ('c2222222-2222-2222-2222-222222222222', 2026, 6, 17843.00, 19800.00, 98.0),
    ('c3333333-3333-3333-3333-333333333333', 2026, 6, 16000.00, 14200.00, 78.5),
    ('c4444444-4444-4444-4444-444444444444', 2026, 6, 30358.00, 34500.00, 89.0),
    ('c5555555-5555-5555-5555-555555555555', 2026, 6, 18138.00, 15900.00, 72.0)
ON CONFLICT DO NOTHING;

-- 6. RISK PREDICTIONS
INSERT INTO risk_predictions (project_id, cost_overrun_probability, risk_score, risk_level, prediction_horizon, feature_provenance) VALUES
    ('c1111111-1111-1111-1111-111111111111', 0.784, 78, 'HIGH', 'T+2 (2 months advance)', '{"physical_financial_gap": 18.4, "expenditure_rate_lag": 14.2}'),
    ('c2222222-2222-2222-2222-222222222222', 0.120, 12, 'LOW', 'T+2 (2 months advance)', '{"physical_financial_gap": 2.1}'),
    ('c3333333-3333-3333-3333-333333333333', 0.650, 65, 'HIGH', 'T+2 (2 months advance)', '{"physical_financial_gap": 12.8}'),
    ('c4444444-4444-4444-4444-444444444444', 0.280, 28, 'LOW', 'T+2 (2 months advance)', '{"physical_financial_gap": 4.5}'),
    ('c5555555-5555-5555-5555-555555555555', 0.710, 71, 'HIGH', 'T+2 (2 months advance)', '{"physical_financial_gap": 15.1}')
ON CONFLICT DO NOTHING;
