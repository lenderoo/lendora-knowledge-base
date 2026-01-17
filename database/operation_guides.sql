-- =============================================
-- 操作指南表 (operation_guides)
-- 适用于 Supabase (PostgreSQL)
-- =============================================

CREATE TABLE operation_guides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- 基本信息
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,           -- sop/document/troubleshoot/lender/compliance/template
    sub_category VARCHAR(50) NOT NULL,       -- 子分类

    -- 内容
    applicable_scenario TEXT,                -- 适用场景
    prerequisites JSONB DEFAULT '[]',        -- 前置条件 (string array)
    steps JSONB DEFAULT '[]',                -- 流程步骤 (ProcessStep array)
    faqs JSONB DEFAULT '[]',                 -- 常见问题 (FAQItem array)
    cautions JSONB DEFAULT '[]',             -- 注意事项 (CautionItem array)
    related_links JSONB DEFAULT '[]',        -- 相关链接
    scripts JSONB DEFAULT '[]',              -- 常用话术 (string array)

    -- 元数据
    author VARCHAR(100),
    version VARCHAR(50) DEFAULT '1.0',
    tags TEXT[] DEFAULT '{}',

    -- 生成的Markdown
    markdown_content TEXT,

    -- 系统字段
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_to_dify BOOLEAN DEFAULT FALSE,
    dify_document_id VARCHAR(100)
);

-- 索引
CREATE INDEX idx_guides_category ON operation_guides(category);
CREATE INDEX idx_guides_sub_category ON operation_guides(sub_category);
CREATE INDEX idx_guides_tags ON operation_guides USING GIN(tags);
CREATE INDEX idx_guides_created_at ON operation_guides(created_at DESC);

-- 更新触发器
CREATE OR REPLACE FUNCTION update_guides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.synced_to_dify = FALSE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER guides_updated_at_trigger
    BEFORE UPDATE ON operation_guides
    FOR EACH ROW
    EXECUTE FUNCTION update_guides_updated_at();

-- 示例数据
INSERT INTO operation_guides (
    title, category, sub_category, applicable_scenario,
    prerequisites, steps, faqs, cautions, scripts,
    author, version, tags
) VALUES (
    'Pre-Approval申请流程',
    'sop',
    'pre_approval',
    '客户准备好文件，要申请预批',
    '["收入证明文件齐全", "身份证明文件齐全", "客户签署授权书", "已做初步Serviceability测算"]',
    '[
        {
            "order": 1,
            "title": "文件核查",
            "description": "核对所有文件是否齐全",
            "checklist": ["核对所有文件是否齐全", "检查文件是否在有效期内", "确认收入计算是否正确", "检查信用报告"],
            "tips": "工资单要显示YTD收入，日期要在30天内",
            "duration": "15-20分钟"
        },
        {
            "order": 2,
            "title": "选择Lender",
            "description": "根据客户情况匹配合适的Lender",
            "checklist": ["根据客户情况匹配合适的Lender", "比较利率和产品特点", "确认客户符合该Lender政策", "与客户确认Lender选择"],
            "tips": "",
            "duration": "10-15分钟"
        },
        {
            "order": 3,
            "title": "系统录入",
            "description": "在系统中录入申请信息",
            "checklist": ["登录ApplyOnline / Lender官网", "录入客户信息", "上传所有文件", "检查申请信息无误"],
            "tips": "上传文件单个不超过10MB，使用PDF格式",
            "duration": "20-30分钟"
        },
        {
            "order": 4,
            "title": "提交申请",
            "description": "最终检查并提交",
            "checklist": ["最终检查所有信息", "提交申请", "记录Application Reference Number", "通知客户已提交"],
            "tips": "保存提交确认页截图",
            "duration": "5分钟"
        }
    ]',
    '[
        {"question": "提交后多久能知道结果？", "answer": "通常2-5个工作日，旺季可能更长"},
        {"question": "Pre-approval有效期多久？", "answer": "通常90天，部分Lender是60天"}
    ]',
    '[
        {"type": "warning", "content": "Pre-approval不是正式批准，不要让客户误解"},
        {"type": "info", "content": "提交前务必再次确认收入计算"},
        {"type": "success", "content": "保存提交确认页截图"}
    ]',
    '["您的Pre-approval申请已提交，预计2-5个工作日出结果...", "Pre-approval有效期为90天，请在此期间找到心仪的房子..."]',
    'Johnny',
    '1.0',
    ARRAY['新人必读', 'Pre-Approval', '流程SOP']
);
