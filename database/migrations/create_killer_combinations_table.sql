-- Create killer_combinations table for storing "必死组合" expert logic
-- These represent multi-factor combinations that are automatic deal killers

CREATE TABLE IF NOT EXISTS killer_combinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Basic info
    name VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,

    -- Factor combinations (stored as JSONB array)
    -- Each element: { factorId: string, conditionValues: string[] }
    factors JSONB NOT NULL,

    -- Assessment
    expert_reasoning TEXT NOT NULL,
    solutions TEXT NOT NULL,

    -- Lender preferences for this combination
    alternative_lenders TEXT[], -- Non-prime lenders that might work

    -- Metadata
    confidence_level VARCHAR(20) NOT NULL DEFAULT 'HIGH',
    source_notes TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster querying
CREATE INDEX IF NOT EXISTS idx_killer_combinations_factors ON killer_combinations USING GIN (factors);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_killer_combinations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_killer_combinations_updated_at
    BEFORE UPDATE ON killer_combinations
    FOR EACH ROW
    EXECUTE FUNCTION update_killer_combinations_updated_at();

-- Comments
COMMENT ON TABLE killer_combinations IS '必死组合 - 多因子联动导致的 Deal Killer 情况';
COMMENT ON COLUMN killer_combinations.factors IS 'JSONB array of {factorId, conditionValues[]}';
COMMENT ON COLUMN killer_combinations.alternative_lenders IS 'Non-prime lenders that might still consider this case';
