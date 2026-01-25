-- Expert Rules Table for Australian Mortgage Broker Expert System
-- Stores logic blocks for the 4C framework: Character, Capacity, Capital, Collateral

CREATE TABLE IF NOT EXISTS expert_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Metadata
    category VARCHAR(50) NOT NULL,      -- BORROWER_PROFILE, INCOME_SERVICING, FUNDS_DEPOSIT, CREDIT_CHARACTER, COLLATERAL
    factor VARCHAR(100) NOT NULL,       -- e.g., "ABN 注册时长", "Overtime/Bonus", "Credit Score"
    risk_level VARCHAR(20) NOT NULL,    -- STOP, HIGH, MEDIUM, LOW

    -- Scenario & Assessment
    scenario TEXT NOT NULL,             -- Specific condition description
    expert_reasoning TEXT NOT NULL,     -- Why this is a concern (Expert logic)
    solutions TEXT NOT NULL,            -- Actionable advice for Junior brokers

    -- Lender Preferences
    friendly_lenders TEXT[],            -- Array of lender names that are friendly to this scenario
    avoid_lenders TEXT[],               -- Array of lenders to avoid

    -- Supporting Info
    required_documents TEXT[],          -- Checklist of documents needed
    clarifying_questions TEXT[],        -- Questions to ask the client

    -- Confidence & Source
    confidence_level VARCHAR(20) NOT NULL, -- HIGH (policy-based), LOW (exception-based)
    source_notes TEXT,                     -- Where this knowledge came from

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_expert_rules_category ON expert_rules(category);
CREATE INDEX IF NOT EXISTS idx_expert_rules_risk_level ON expert_rules(risk_level);
CREATE INDEX IF NOT EXISTS idx_expert_rules_factor ON expert_rules(factor);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_expert_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_expert_rules_updated_at ON expert_rules;
CREATE TRIGGER trigger_expert_rules_updated_at
    BEFORE UPDATE ON expert_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_expert_rules_updated_at();
