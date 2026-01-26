-- Add lender reason fields to expert_rules table
-- These explain WHY certain lenders are friendly or should be avoided

ALTER TABLE expert_rules
ADD COLUMN IF NOT EXISTS friendly_lenders_reason TEXT,
ADD COLUMN IF NOT EXISTS avoid_lenders_reason TEXT;

-- Comments
COMMENT ON COLUMN expert_rules.friendly_lenders_reason IS 'Explanation of why these lenders are friendly to this scenario';
COMMENT ON COLUMN expert_rules.avoid_lenders_reason IS 'Explanation of why these lenders should be avoided';
