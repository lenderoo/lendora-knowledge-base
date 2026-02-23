-- 受限区域表
-- 用于存储银行贷款受限的区域信息

CREATE TABLE IF NOT EXISTS restricted_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- 区域信息
    suburb VARCHAR(100) NOT NULL,
    postcode VARCHAR(10) NOT NULL,
    state VARCHAR(10) NOT NULL CHECK (state IN ('NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT')),

    -- 限制级别
    restriction_level VARCHAR(20) NOT NULL CHECK (restriction_level IN ('RESTRICTED', 'WATCHLIST')),

    -- 分类
    category VARCHAR(50) NOT NULL CHECK (category IN ('HIGH_DENSITY', 'MINING_TOWN', 'REMOTE_AREA', 'BUILDING_DEFECT', 'OTHER')),

    -- 详细信息
    reason TEXT NOT NULL,
    affected_lenders TEXT[] NOT NULL DEFAULT '{}',
    max_lvr INTEGER,
    notes TEXT,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_restricted_areas_postcode ON restricted_areas(postcode);
CREATE INDEX IF NOT EXISTS idx_restricted_areas_suburb ON restricted_areas(suburb);
CREATE INDEX IF NOT EXISTS idx_restricted_areas_state ON restricted_areas(state);
CREATE INDEX IF NOT EXISTS idx_restricted_areas_category ON restricted_areas(category);
CREATE INDEX IF NOT EXISTS idx_restricted_areas_restriction_level ON restricted_areas(restriction_level);

-- 更新时间触发器
CREATE OR REPLACE FUNCTION update_restricted_areas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_restricted_areas_updated_at ON restricted_areas;
CREATE TRIGGER trigger_update_restricted_areas_updated_at
    BEFORE UPDATE ON restricted_areas
    FOR EACH ROW
    EXECUTE FUNCTION update_restricted_areas_updated_at();

-- RLS 策略
ALTER TABLE restricted_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read restricted_areas"
    ON restricted_areas FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert restricted_areas"
    ON restricted_areas FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update restricted_areas"
    ON restricted_areas FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to delete restricted_areas"
    ON restricted_areas FOR DELETE
    TO authenticated
    USING (true);
