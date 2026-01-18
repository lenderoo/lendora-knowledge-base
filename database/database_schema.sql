-- =============================================
-- 贷款知识库管理系统 - 数据库结构 (v2.0)
-- 适用于 Supabase (PostgreSQL)
-- 更新: 2024 - 添加决策训练字段
-- =============================================

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. 案例表 (cases)
-- =============================================
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id VARCHAR(50) UNIQUE NOT NULL,  -- LC-2024-0001

    -- ========== 决策入口 (Module A) ==========
    initial_gut_feel TEXT,                -- 初始直觉判断: CAN_DO/CANNOT_DO/NEED_INFO/CONDITIONAL
    judgement_timing TEXT,                -- 判断发生时间点: FIRST_CONTACT/GOT_DOCUMENTS/AFTER_LENDER_TALK/NEAR_SUBMISSION
    is_key_decision_sample BOOLEAN DEFAULT FALSE,  -- 是否关键决策样本
    case_value_level TEXT,                -- 案例价值: HIGH/NORMAL/LOW

    -- ========== 客户信息 (Module B) ==========
    client_type VARCHAR(50),              -- PAYG/Self-employed/Contractor
    visa_status VARCHAR(50),              -- Citizen/PR/TR
    employment_type VARCHAR(50),          -- Full-time/Part-time/Casual
    abn_length VARCHAR(50),               -- ABN时长
    annual_income DECIMAL(12,2),          -- 年收入
    taxable_income DECIMAL(12,2),         -- 报税收入
    credit_score INTEGER,                 -- 信用评分
    credit_issues TEXT,                   -- 信用问题
    existing_debts TEXT,                  -- 现有负债
    primary_concern TEXT,                 -- 最不放心的点（直觉）: Income/Deposit/Credit/Timeline/Structure

    -- ========== 贷款信息 (Module C) ==========
    loan_purpose VARCHAR(50),             -- 自住/投资/Refinance
    property_type VARCHAR(50),            -- House/Apartment
    property_location VARCHAR(100),       -- 位置
    loan_amount DECIMAL(12,2),            -- 贷款金额
    lvr DECIMAL(5,2),                     -- LVR
    deposit_source VARCHAR(100),          -- 首付来源
    excluded_paths TEXT[],                -- 排除的路径: MAJOR_BANK/NON_BANK/LOW_DOC/WAIT/DECLINE
    excluded_reasons JSONB,               -- 排除原因: { "MAJOR_BANK": { "tags": ["SERVICEABILITY"], "note": "..." } }

    -- ========== 决策拆解 (Module D) ==========
    core_risk_priority TEXT,              -- 最终决定中的核心风险: INCOME/DEPOSIT/CREDIT/TIMELINE/STRUCTURE
    secondary_risks TEXT[],               -- 次级风险（最多2个）

    -- ========== 决策表达 (Module E) ==========
    decision_one_liner TEXT,              -- 一句话判断结论（≤120字符）
    decision_logic_summary TEXT,          -- 决策逻辑摘要
    current_action TEXT,                  -- 当前动作: SUBMIT/WAIT/PREPARE/DECLINE/REFER

    -- ========== 结果模块 (Module F) ==========
    lender VARCHAR(100),                  -- Lender
    product_type VARCHAR(100),            -- 产品类型
    approved_amount DECIMAL(12,2),        -- 批准金额
    interest_rate DECIMAL(5,2),           -- 利率
    approval_time VARCHAR(50),            -- 审批时间
    final_outcome TEXT,                   -- 最终结果: APPROVED/DECLINED/WITHDRAWN/IN_PROGRESS
    outcome_vs_initial_judgement TEXT,    -- 结果与初判对比: MATCH/PARTIAL/MISMATCH
    deviation_reasons TEXT[],             -- 偏差原因: INFO_INCOMPLETE/POLICY_CHANGE/MISJUDGEMENT/CLIENT_CHANGE/LENDER_EXCEPTION
    retrospective_change TEXT,            -- 回溯改进: GUT_FEEL/RISK_PRIORITY/PATH_SELECTION/COMMUNICATION

    -- ========== 可学习总结 (Module G) ==========
    future_instruction TEXT,              -- 未来指导

    -- ========== 元数据 ==========
    tags TEXT[],                          -- 标签数组
    broker_name VARCHAR(100),             -- 经办人
    notes TEXT,                           -- 备注

    -- ========== 系统字段 ==========
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_to_dify BOOLEAN DEFAULT FALSE,
    dify_document_id VARCHAR(100)
);

-- 案例表索引
CREATE INDEX idx_cases_client_type ON cases(client_type);
CREATE INDEX idx_cases_visa_status ON cases(visa_status);
CREATE INDEX idx_cases_lender ON cases(lender);
CREATE INDEX idx_cases_final_outcome ON cases(final_outcome);
CREATE INDEX idx_cases_initial_gut_feel ON cases(initial_gut_feel);
CREATE INDEX idx_cases_is_key_decision_sample ON cases(is_key_decision_sample);
CREATE INDEX idx_cases_tags ON cases USING GIN(tags);
CREATE INDEX idx_cases_created_at ON cases(created_at DESC);

-- 案例表更新触发器
CREATE OR REPLACE FUNCTION update_cases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.synced_to_dify = FALSE;  -- 修改后标记为未同步
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cases_updated_at_trigger
    BEFORE UPDATE ON cases
    FOR EACH ROW
    EXECUTE FUNCTION update_cases_updated_at();

-- =============================================
-- 2. Lender政策表 (lender_policies)
-- =============================================
CREATE TABLE lender_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    lender_name VARCHAR(100) NOT NULL,    -- ANZ/CBA/Westpac
    category VARCHAR(100) NOT NULL,        -- visa/income/lvr/credit

    -- 政策内容
    title VARCHAR(200) NOT NULL,           -- 政策标题
    content TEXT,                          -- 政策内容(Markdown)

    -- 结构化数据 (JSON)
    policy_data JSONB,                     -- 存储表格等结构化数据

    -- 元数据
    effective_date DATE,                   -- 生效日期
    source VARCHAR(200),                   -- 来源文档
    version VARCHAR(50),                   -- 版本

    -- 系统字段
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_to_dify BOOLEAN DEFAULT FALSE,
    dify_document_id VARCHAR(100),

    UNIQUE(lender_name, category, title)
);

-- 政策表索引
CREATE INDEX idx_policies_lender ON lender_policies(lender_name);
CREATE INDEX idx_policies_category ON lender_policies(category);

-- 政策表更新触发器
CREATE OR REPLACE FUNCTION update_policies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.synced_to_dify = FALSE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER policies_updated_at_trigger
    BEFORE UPDATE ON lender_policies
    FOR EACH ROW
    EXECUTE FUNCTION update_policies_updated_at();

-- =============================================
-- 3. 同步日志表 (sync_logs)
-- =============================================
CREATE TABLE sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sync_type VARCHAR(50) NOT NULL,        -- cases/policies
    record_id UUID,                         -- 关联的记录ID
    record_identifier VARCHAR(100),         -- case_id 或 policy title
    action VARCHAR(20) NOT NULL,            -- create/update/delete
    status VARCHAR(20) NOT NULL,            -- success/failed/pending
    error_message TEXT,
    dify_document_id VARCHAR(100),
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 同步日志索引
CREATE INDEX idx_sync_logs_type ON sync_logs(sync_type);
CREATE INDEX idx_sync_logs_status ON sync_logs(status);
CREATE INDEX idx_sync_logs_synced_at ON sync_logs(synced_at DESC);

-- =============================================
-- 4. 用户表 (可选，用于多用户管理)
-- =============================================
CREATE TABLE brokers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'broker',     -- admin/broker
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- 5. 视图：未同步的记录
-- =============================================
CREATE VIEW pending_sync_cases AS
SELECT * FROM cases WHERE synced_to_dify = FALSE;

CREATE VIEW pending_sync_policies AS
SELECT * FROM lender_policies WHERE synced_to_dify = FALSE;

-- =============================================
-- 6. 统计函数
-- =============================================
CREATE OR REPLACE FUNCTION get_case_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total', COUNT(*),
        'synced', COUNT(*) FILTER (WHERE synced_to_dify = TRUE),
        'pending', COUNT(*) FILTER (WHERE synced_to_dify = FALSE),
        'approved', COUNT(*) FILTER (WHERE final_outcome = 'APPROVED'),
        'declined', COUNT(*) FILTER (WHERE final_outcome = 'DECLINED'),
        'in_progress', COUNT(*) FILTER (WHERE final_outcome = 'IN_PROGRESS'),
        'key_samples', COUNT(*) FILTER (WHERE is_key_decision_sample = TRUE),
        'by_client_type', (
            SELECT json_object_agg(client_type, cnt)
            FROM (SELECT client_type, COUNT(*) as cnt FROM cases WHERE client_type IS NOT NULL GROUP BY client_type) sub
        ),
        'by_lender', (
            SELECT json_object_agg(lender, cnt)
            FROM (SELECT lender, COUNT(*) as cnt FROM cases WHERE lender IS NOT NULL GROUP BY lender ORDER BY cnt DESC LIMIT 10) sub
        ),
        'by_gut_feel', (
            SELECT json_object_agg(initial_gut_feel, cnt)
            FROM (SELECT initial_gut_feel, COUNT(*) as cnt FROM cases WHERE initial_gut_feel IS NOT NULL GROUP BY initial_gut_feel) sub
        )
    ) INTO result
    FROM cases;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 7. 迁移脚本 (从旧版本升级)
-- =============================================
-- 如果是从旧版本升级，运行以下语句添加新字段：

-- ALTER TABLE cases ADD COLUMN IF NOT EXISTS initial_gut_feel TEXT;
-- ALTER TABLE cases ADD COLUMN IF NOT EXISTS judgement_timing TEXT;
-- ALTER TABLE cases ADD COLUMN IF NOT EXISTS is_key_decision_sample BOOLEAN DEFAULT FALSE;
-- ALTER TABLE cases ADD COLUMN IF NOT EXISTS case_value_level TEXT;
-- ALTER TABLE cases ADD COLUMN IF NOT EXISTS primary_concern TEXT;
-- ALTER TABLE cases ADD COLUMN IF NOT EXISTS excluded_paths TEXT[];
-- ALTER TABLE cases ADD COLUMN IF NOT EXISTS excluded_reasons JSONB;
-- ALTER TABLE cases ADD COLUMN IF NOT EXISTS core_risk_priority TEXT;
-- ALTER TABLE cases ADD COLUMN IF NOT EXISTS secondary_risks TEXT[];
-- ALTER TABLE cases ADD COLUMN IF NOT EXISTS decision_one_liner TEXT;
-- ALTER TABLE cases ADD COLUMN IF NOT EXISTS decision_logic_summary TEXT;
-- ALTER TABLE cases ADD COLUMN IF NOT EXISTS current_action TEXT;
-- ALTER TABLE cases ADD COLUMN IF NOT EXISTS final_outcome TEXT;
-- ALTER TABLE cases ADD COLUMN IF NOT EXISTS outcome_vs_initial_judgement TEXT;
-- ALTER TABLE cases ADD COLUMN IF NOT EXISTS deviation_reasons TEXT[];
-- ALTER TABLE cases ADD COLUMN IF NOT EXISTS retrospective_change TEXT;
-- ALTER TABLE cases ADD COLUMN IF NOT EXISTS future_instruction TEXT;

-- 移除旧字段（可选）：
-- ALTER TABLE cases DROP COLUMN IF EXISTS challenges;
-- ALTER TABLE cases DROP COLUMN IF EXISTS solution;
-- ALTER TABLE cases DROP COLUMN IF EXISTS result;
-- ALTER TABLE cases DROP COLUMN IF EXISTS key_takeaway;

-- =============================================
-- 8. Row Level Security (RLS) - 可选
-- =============================================
-- 如果需要多用户权限控制，启用以下内容

-- ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE lender_policies ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "允许已认证用户读取案例" ON cases
--     FOR SELECT USING (auth.role() = 'authenticated');

-- CREATE POLICY "允许已认证用户创建案例" ON cases
--     FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- 完成
-- =============================================
