export const CLIENT_TYPES = [
  'PAYG',
  'Self-employed',
  'Contractor',
  'Company Director',
  'Retired',
] as const

export const VISA_STATUSES = [
  'Citizen',
  'PR',
  'TR 485',
  'TR 482',
  'TR 491',
  'Student',
  'Partner 820',
  '其他',
] as const

export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Casual',
  'Sole Trader',
  'Company',
  'Trust',
] as const

export const LOAN_PURPOSES = [
  '自住房 (PPOR)',
  '投资房',
  'Refinance',
  'Equity Release',
  'Construction',
] as const

export const PROPERTY_TYPES = [
  'House',
  'Apartment',
  'Townhouse',
  'Unit',
  'Land',
  'Off-the-plan',
] as const

export const RESULTS = [
  '成功',
  '失败',
  '进行中',
  '取消',
] as const

export const LENDERS = [
  'ANZ',
  'CBA',
  'Westpac',
  'NAB',
  'Macquarie',
  'ING',
  'Bankwest',
  'Pepper',
  'Liberty',
  'La Trobe',
  'Bluestone',
  'Resimac',
  '其他',
] as const

export const INITIAL_GUT_FEELS = [
  { value: 'HIGH', label: '高可行' },
  { value: 'MEDIUM', label: '中等' },
  { value: 'LOW', label: '低' },
] as const

export const CASE_VALUE_LEVELS = [
  { value: 'HIGH', label: '高价值 / 高复杂' },
  { value: 'NORMAL', label: '常规' },
  { value: 'LOW', label: '低价值 / 不值得深跟' },
] as const

export const JUDGEMENT_TIMING = [
  { value: 'FIRST_CONTACT', label: '首次接触 lead' },
  { value: 'GOT_DOCUMENTS', label: '已拿到核心资料' },
  { value: 'AFTER_LENDER_TALK', label: '与 lender 沟通后' },
  { value: 'NEAR_SUBMISSION', label: '接近提交时' },
] as const

export const PRIMARY_CONCERNS = [
  'Income',
  'Deposit',
  'Credit',
  'Timeline',
  'Structure',
] as const

export const RISK_TYPES = [
  { value: 'INCOME', label: 'Income' },
  { value: 'DEPOSIT', label: 'Deposit' },
  { value: 'CREDIT', label: 'Credit' },
  { value: 'TIMELINE', label: 'Timeline' },
  { value: 'STRUCTURE', label: 'Structure' },
] as const

export const CURRENT_ACTIONS = [
  { value: 'PROCEED', label: '继续推进' },
  { value: 'CONDITIONAL', label: '有条件推进' },
  { value: 'EDUCATE', label: '教育引导' },
  { value: 'PAUSE', label: '暂停观望' },
] as const

export const FINAL_OUTCOMES = [
  { value: 'APPROVED', label: 'Approved' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'WITHDRAWN', label: 'Withdrawn' },
  { value: 'DEFERRED', label: 'Deferred' },
] as const

export const OUTCOME_JUDGEMENTS = [
  { value: 'MATCH', label: '完全匹配' },
  { value: 'PARTIAL', label: '部分匹配' },
  { value: 'MISMATCH', label: '不匹配' },
] as const

export const DEVIATION_REASONS = [
  { value: 'RISK_UNDERESTIMATED', label: '风险被低估' },
  { value: 'RISK_OVERESTIMATED', label: '风险被高估' },
  { value: 'EXTERNAL_CHANGE', label: '外部变化' },
  { value: 'CLIENT_BEHAVIOR', label: '客户行为' },
] as const

export const EXCLUDED_PATHS = [
  { value: 'MAJOR_BANK', label: '四大银行' },
  { value: 'NON_BANK', label: '非银行机构' },
  { value: 'LOW_DOC', label: 'Low Doc' },
  { value: 'WAIT', label: '等待/观望' },
  { value: 'DECLINE', label: '直接拒绝' },
] as const

export const EXCLUSION_REASONS = [
  { value: 'SERVICEABILITY', label: 'Serviceability' },
  { value: 'POLICY_MISMATCH', label: 'Policy mismatch' },
  { value: 'TIMELINE', label: 'Timeline' },
  { value: 'CREDIT', label: 'Credit' },
  { value: 'LVR', label: 'LVR' },
  { value: 'INCOME_TYPE', label: 'Income type' },
  { value: 'VISA', label: 'Visa' },
  { value: 'OTHER', label: 'Other' },
] as const

export const RETROSPECTIVE_CHANGES = [
  { value: 'GUT_FEEL', label: '直觉判断' },
  { value: 'RISK_PRIORITY', label: '风险排序' },
  { value: 'PATH_SELECTION', label: '路径选择' },
  { value: 'COMMUNICATION', label: '沟通方式' },
] as const

export const COMMON_TAGS = [
  '低首付',
  '高LVR',
  'Self-employed',
  '收入证明',
  '信用修复',
  'Low Doc',
  'TR签证',
  'Refinance',
] as const

export const POLICY_CATEGORIES = [
  'visa',
  'income',
  'lvr',
  'credit',
  'property',
  'general',
] as const

// Expert System Constants
export const EXPERT_CATEGORIES = [
  { value: 'BORROWER_PROFILE', label: '身份与职业 (Borrower Profile)' },
  { value: 'INCOME_SERVICING', label: '收入与偿付能力 (Income & Servicing)' },
  { value: 'FUNDS_DEPOSIT', label: '资金准备 (Funds & Deposit)' },
  { value: 'CREDIT_CHARACTER', label: '信用与品格 (Credit & Character)' },
  { value: 'COLLATERAL', label: '抵押物 (Security / Collateral)' },
] as const

export const EXPERT_RISK_LEVELS = [
  { value: 'STOP', label: '🔴 Stop (Deal Killer)' },
  { value: 'HIGH', label: '🟠 High Risk' },
  { value: 'MEDIUM', label: '🟡 Medium Risk' },
  { value: 'LOW', label: '🟢 Low Risk' },
] as const

export const CONFIDENCE_LEVELS = [
  { value: 'HIGH', label: '高置信度 (基于银行书面政策)' },
  { value: 'LOW', label: '低置信度 (基于Exception经验)' },
] as const
