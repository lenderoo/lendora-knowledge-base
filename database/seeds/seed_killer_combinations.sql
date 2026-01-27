-- Seed data for killer_combinations table
-- 基于现有因子生成的多因子风险组合测试数据

-- 清空现有数据（可选）
-- TRUNCATE TABLE killer_combinations;

-- 1. 短 ABN + 高 LVR + 小公寓
INSERT INTO killer_combinations (
  name, name_en, description, factors, expert_reasoning, solutions,
  alternative_lenders, confidence_level, source_notes
) VALUES (
  '自雇 ABN 时长 + LVR + 公寓面积',
  'Self-Employed ABN Age + Loan to Value Ratio + Apartment Size',
  '自雇时间短 + 高杠杆 + 小面积公寓的风险组合',
  '[
    {"factorId": "se_abn_age", "conditionValues": ["less_than_6_months", "6_to_12_months", "12_to_18_months"]},
    {"factorId": "lvr", "conditionValues": ["90_to_95", "over_95"]},
    {"factorId": "apartment_size", "conditionValues": ["under_40", "40_to_50"]}
  ]'::jsonb,
  'Prime Lender 对自雇客户本身就更谨慎，ABN < 24个月通常需要更多证明。再叠加高 LVR (>90%) 和小公寓（<50sqm），风险集中爆发。银行担心：1) 收入稳定性存疑 2) 高杠杆无退路 3) 小公寓流动性差估值波动大',
  '1. 降低 LVR 至 80% 以下\n2. 等 ABN 满 24 个月后再申请\n3. 换大面积物业（>50sqm）\n4. 考虑 Non-Prime Lender',
  ARRAY['Pepper Money', 'Liberty', 'La Trobe'],
  'HIGH',
  '多家银行 BDM 确认，属于行业共识'
);

-- 2. 签证状态 + 高 LVR
INSERT INTO killer_combinations (
  name, name_en, description, factors, expert_reasoning, solutions,
  alternative_lenders, confidence_level, source_notes
) VALUES (
  '签证状态 + LVR',
  'Visa Status + Loan to Value Ratio',
  '临时签证 + 高杠杆贷款的风险组合',
  '[
    {"factorId": "visa_status", "conditionValues": ["tr_485", "tr_482", "tr_491", "student", "other"]},
    {"factorId": "lvr", "conditionValues": ["80_to_90", "90_to_95", "over_95"]}
  ]'::jsonb,
  '临时签证持有人面临签证到期/续签不确定性，银行担心借款人可能离开澳洲。高 LVR 意味着没有足够的缓冲空间，如果借款人离境违约，银行可能无法通过出售物业收回全部贷款',
  '1. 降低 LVR 至 70% 以下（部分银行可接受）\n2. 等 PR 批准后再申请\n3. 提供额外担保或 co-borrower\n4. 选择对 TR 友好的银行',
  ARRAY['ANZ', 'Westpac', 'St George'],
  'HIGH',
  '各银行官方政策明确规定 TR 的 LVR 上限'
);

-- 3. 信用违约 + 高 LVR
INSERT INTO killer_combinations (
  name, name_en, description, factors, expert_reasoning, solutions,
  alternative_lenders, confidence_level, source_notes
) VALUES (
  '违约记录 + LVR',
  'Defaults + Loan to Value Ratio',
  '有违约记录 + 高杠杆贷款的风险组合',
  '[
    {"factorId": "defaults", "conditionValues": ["telco_under_1k_unpaid", "financial_default"]},
    {"factorId": "lvr", "conditionValues": ["80_to_90", "90_to_95", "over_95"]}
  ]'::jsonb,
  '违约记录直接反映借款人的还款意愿和能力。金融机构违约更严重，是 Character 维度的重大红旗。高 LVR 在有违约历史的情况下，银行完全没有安全边际',
  '1. 付清所有未结清违约\n2. 等待违约记录满 2 年后淡化\n3. 降低 LVR 至 70% 以下\n4. 转 Non-Prime Lender 并准备解释信',
  ARRAY['Pepper Money', 'Liberty', 'Bluestone'],
  'HIGH',
  '银行政策明确规定'
);

-- 4. 小额高利贷记录 + 信用分
INSERT INTO killer_combinations (
  name, name_en, description, factors, expert_reasoning, solutions,
  alternative_lenders, confidence_level, source_notes
) VALUES (
  '小额高利贷 + 信用分',
  'Payday Lenders + Credit Score (Equifax)',
  '有小额贷款记录 + 信用分偏低的风险组合',
  '[
    {"factorId": "payday_lenders", "conditionValues": ["over_3_months_ago", "recent"]},
    {"factorId": "credit_score", "conditionValues": ["average", "poor"]}
  ]'::jsonb,
  'Payday Lender (如 Cash Converters) 记录是银行最反感的因子之一，反映借款人财务管理能力差或有资金短缺历史。再加上信用分不高，基本上四大银行和大部分二线银行都会自动拒绝',
  '1. 等待 Payday Lender 记录满 6 个月以上\n2. 改善信用分至 700+\n3. 准备详细的解释信说明当时情况\n4. 只能考虑 Non-Prime Lender',
  ARRAY['Pepper Money', 'Liberty', 'La Trobe', 'Resimac'],
  'HIGH',
  '四大银行 BDM 明确表示有 Payday Lender 记录即拒'
);

-- 5. 无真实存款 + 高 LVR
INSERT INTO killer_combinations (
  name, name_en, description, factors, expert_reasoning, solutions,
  alternative_lenders, confidence_level, source_notes
) VALUES (
  '真实存款 + LVR',
  'Genuine Savings + Loan to Value Ratio',
  '无真实存款 + 高杠杆贷款的风险组合',
  '[
    {"factorId": "genuine_savings", "conditionValues": ["no_genuine_savings"]},
    {"factorId": "lvr", "conditionValues": ["90_to_95", "over_95"]}
  ]'::jsonb,
  'LVR > 90% 时，大部分银行要求 5% 的真实存款（存满 3 个月）。这是为了证明借款人有储蓄习惯和还款能力。没有真实存款说明借款人可能是"月光族"，一旦收入中断就会断供',
  '1. 开始存钱，累积 3 个月的真实存款记录\n2. 用 12 个月租房记录代替（部分银行接受）\n3. 降低 LVR 至 90% 以下（减少真实存款要求）\n4. 寻找不要求真实存款的 Lender',
  ARRAY['Macquarie', 'ING', 'Bankwest'],
  'HIGH',
  '各银行官方政策'
);

-- 6. ATO 欠款 + 自雇
INSERT INTO killer_combinations (
  name, name_en, description, factors, expert_reasoning, solutions,
  alternative_lenders, confidence_level, source_notes
) VALUES (
  'ATO 欠款 + 自雇 ABN 时长',
  'ATO Debt + Self-Employed ABN Age',
  '税务欠款 + 自雇客户的风险组合',
  '[
    {"factorId": "ato_debt", "conditionValues": ["payment_plan", "outstanding"]},
    {"factorId": "se_abn_age", "conditionValues": ["less_than_6_months", "6_to_12_months", "12_to_18_months", "18_to_24_months"]}
  ]'::jsonb,
  '自雇客户有 ATO 欠款是严重的红旗。这表明：1) 现金流管理差 2) 可能存在税务合规问题 3) 真实收入可能与报税收入不符。银行会怀疑会计师信的可信度',
  '1. 付清 ATO 欠款\n2. 如有还款计划，确保按时还款 6 个月以上\n3. 获取会计师信说明欠款原因（如 COVID 期间延迟）\n4. 考虑 Low Doc 产品',
  ARRAY['Pepper Money', 'Liberty', 'La Trobe'],
  'HIGH',
  '银行政策及 BDM 反馈'
);

-- 7. 破产记录 + 高 LVR
INSERT INTO killer_combinations (
  name, name_en, description, factors, expert_reasoning, solutions,
  alternative_lenders, confidence_level, source_notes
) VALUES (
  '破产记录 + LVR',
  'Bankruptcy + Loan to Value Ratio',
  '有破产历史 + 高杠杆贷款的风险组合',
  '[
    {"factorId": "bankruptcy", "conditionValues": ["discharged_over_2_years", "discharged_under_2_years"]},
    {"factorId": "lvr", "conditionValues": ["80_to_90", "90_to_95", "over_95"]}
  ]'::jsonb,
  '破产是最严重的信用事件。即使已解除，大部分 Prime Lender 要求解除后 2-5 年才能申请，且 LVR 有严格限制。破产 + 高 LVR = 完全不可能获批',
  '1. 等待破产解除满 2 年以上\n2. 将 LVR 控制在 70% 以下\n3. 提供详细的财务复苏证明\n4. 只能走 Non-Prime Lender',
  ARRAY['Pepper Money', 'Liberty', 'La Trobe', 'Bluestone'],
  'HIGH',
  '各银行官方政策明确规定'
);

-- 8. 临时工 + 高 LVR + 短期入职
INSERT INTO killer_combinations (
  name, name_en, description, factors, expert_reasoning, solutions,
  alternative_lenders, confidence_level, source_notes
) VALUES (
  'PAYG 临时工 + LVR',
  'PAYG Casual + Loan to Value Ratio',
  '临时工短期入职 + 高杠杆贷款的风险组合',
  '[
    {"factorId": "payg_casual", "conditionValues": ["less_than_3_months", "3_to_6_months"]},
    {"factorId": "lvr", "conditionValues": ["90_to_95", "over_95"]}
  ]'::jsonb,
  '临时工没有固定工时保障，收入不稳定。入职时间短更无法证明收入的可持续性。银行通常要求 Casual 入职满 6-12 个月才能全额认可收入',
  '1. 等待入职满 6 个月后再申请\n2. 降低 LVR 至 80% 以下\n3. 提供同行业长期工作经验证明\n4. 尝试获取雇主确认信说明工作稳定性',
  ARRAY['Macquarie', 'ING', 'Suncorp'],
  'HIGH',
  'BDM 反馈及银行政策'
);

-- 9. 收入下跌 + 高 LVR
INSERT INTO killer_combinations (
  name, name_en, description, factors, expert_reasoning, solutions,
  alternative_lenders, confidence_level, source_notes
) VALUES (
  '自雇收入波动 + LVR',
  'Self-Employed Income Variance + Loan to Value Ratio',
  '自雇收入大幅下跌 + 高杠杆贷款的风险组合',
  '[
    {"factorId": "se_income_variance", "conditionValues": ["decrease_over_20"]},
    {"factorId": "lvr", "conditionValues": ["80_to_90", "90_to_95", "over_95"]}
  ]'::jsonb,
  '自雇收入下跌超过 20% 是严重警告信号，说明业务可能在萎缩。银行会担心下跌趋势会持续，导致未来无法偿还贷款。高 LVR 使情况更加恶化',
  '1. 等待下一财年收入稳定后再申请\n2. 提供会计师信解释下跌原因（如一次性费用、业务转型）\n3. 降低 LVR 以降低风险\n4. 使用最近 3 个月 BAS 证明收入已恢复',
  ARRAY['Pepper Money', 'Liberty'],
  'HIGH',
  'BDM 反馈'
);

-- 10. 海外首付 + 高 LVR
INSERT INTO killer_combinations (
  name, name_en, description, factors, expert_reasoning, solutions,
  alternative_lenders, confidence_level, source_notes
) VALUES (
  '首付来源 + LVR',
  'Deposit Source + Loan to Value Ratio',
  '海外资金来源首付 + 高杠杆贷款的风险组合',
  '[
    {"factorId": "deposit_source", "conditionValues": ["overseas", "crypto"]},
    {"factorId": "lvr", "conditionValues": ["80_to_90", "90_to_95", "over_95"]}
  ]'::jsonb,
  '海外资金和加密货币来源的首付难以追溯和验证，涉及 AML (反洗钱) 合规风险。银行需要证明资金来源合法，海外转账尤其需要详细的资金链证明',
  '1. 准备完整的资金链证明（海外银行流水、兑换记录、转账记录）\n2. 资金提前 3-6 个月转入澳洲账户\n3. 降低 LVR 减少对首付来源的依赖\n4. 选择对海外资金审核相对宽松的银行',
  ARRAY['HSBC', 'NAB', 'Bank of China Australia'],
  'MEDIUM',
  '基于 AML 合规要求及银行实践'
);

-- 11. 物业类型 + 区域限制 + 高 LVR
INSERT INTO killer_combinations (
  name, name_en, description, factors, expert_reasoning, solutions,
  alternative_lenders, confidence_level, source_notes
) VALUES (
  '物业类型 + 区域限制 + LVR',
  'Property Type + Location/Postcode + Loan to Value Ratio',
  '特殊物业类型 + 受限区域 + 高杠杆的风险组合',
  '[
    {"factorId": "property_type", "conditionValues": ["rural", "off_the_plan"]},
    {"factorId": "location_postcode", "conditionValues": ["watchlist", "restricted"]},
    {"factorId": "lvr", "conditionValues": ["80_to_90", "90_to_95"]}
  ]'::jsonb,
  '特殊物业类型（农村/楼花）流动性差，在受限区域更是雪上加霜。高 LVR 意味着银行几乎没有安全边际，一旦市场下跌或借款人违约，银行可能无法回收贷款',
  '1. 选择主流城区的标准物业\n2. 大幅降低 LVR 至 70% 以下\n3. 等楼花交付后再按现房申请\n4. 考虑专门做 Rural 的 Lender',
  ARRAY['Suncorp', 'Beyond Bank', 'Teachers Mutual'],
  'HIGH',
  '银行内部风险评估标准'
);

-- 12. GST 问题 + 收入波动
INSERT INTO killer_combinations (
  name, name_en, description, factors, expert_reasoning, solutions,
  alternative_lenders, confidence_level, source_notes
) VALUES (
  '自雇 GST 注册状态 + 自雇收入波动',
  'Self-Employed GST Registration + Self-Employed Income Variance',
  'GST 注册异常 + 收入不稳定的风险组合',
  '[
    {"factorId": "se_gst_status", "conditionValues": ["registered_no_bas_over_12m", "not_registered_over_75k", "cancelled"]},
    {"factorId": "se_income_variance", "conditionValues": ["decrease_over_20"]}
  ]'::jsonb,
  'GST 注册状态异常（如超过 12 个月没提交 BAS 或 GST 被取消）暗示业务可能已停止运营或有税务合规问题。收入下跌进一步证实业务状况不佳',
  '1. 补齐所有 BAS 申报\n2. 如 GST 被取消，重新注册并保持活跃\n3. 提供会计师信详细解释情况\n4. 等待业务稳定 6-12 个月后再申请',
  ARRAY['Pepper Money', 'La Trobe'],
  'HIGH',
  'ATO 合规要求及银行政策'
);

-- 13. 估价风险 + 楼花
INSERT INTO killer_combinations (
  name, name_en, description, factors, expert_reasoning, solutions,
  alternative_lenders, confidence_level, source_notes
) VALUES (
  '估价风险 + 物业类型',
  'Valuation Risk + Property Type',
  '高估价风险 + 楼花/特殊物业的组合',
  '[
    {"factorId": "valuation_risk", "conditionValues": ["slight_risk", "high_risk"]},
    {"factorId": "property_type", "conditionValues": ["off_the_plan", "rural"]}
  ]'::jsonb,
  '楼花和农村物业本身估值就不稳定，市场参照物少。如果预期有估价风险，很可能导致估价不足，需要补首付或降低贷款金额',
  '1. 提前做估价评估，了解真实市场价值\n2. 准备额外资金应对可能的估价短缺\n3. 考虑挑战估价（需要 3 个同区成交案例）\n4. 选择估价相对宽松的银行',
  ARRAY['CBA', 'Macquarie'],
  'MEDIUM',
  '实际案例经验'
);

-- 14. 赠与资金需偿还 + 高 LVR
INSERT INTO killer_combinations (
  name, name_en, description, factors, expert_reasoning, solutions,
  alternative_lenders, confidence_level, source_notes
) VALUES (
  '赠与资金 + LVR',
  'Gifted Funds + Loan to Value Ratio',
  '需偿还的赠与资金 + 高杠杆贷款的风险组合',
  '[
    {"factorId": "gifted_funds", "conditionValues": ["repayable"]},
    {"factorId": "lvr", "conditionValues": ["80_to_90", "90_to_95", "over_95"]}
  ]'::jsonb,
  '需偿还的"赠与"实际上是贷款，会增加借款人的负债。银行需要将其计入 Servicing 计算。高 LVR 本身借款人就处于高负债状态，额外的隐性负债会导致无法通过压力测试',
  '1. 将赠与改为不可退还赠与（需赠与人签署声明）\n2. 如必须偿还，在申请时披露并计入负债\n3. 降低 LVR 以改善 Servicing\n4. 等偿还完毕后再申请',
  ARRAY['ANZ', 'CBA'],
  'HIGH',
  '银行政策明确规定赠与必须为不可退还'
);

-- 15. 大额现金存入 + 自雇
INSERT INTO killer_combinations (
  name, name_en, description, factors, expert_reasoning, solutions,
  alternative_lenders, confidence_level, source_notes
) VALUES (
  '大额存入 + 自雇 ABN 时长',
  'Large Cash Deposits + Self-Employed ABN Age',
  '无法解释的大额存入 + 自雇客户的风险组合',
  '[
    {"factorId": "large_deposits", "conditionValues": ["unexplained"]},
    {"factorId": "se_abn_age", "conditionValues": ["less_than_6_months", "6_to_12_months", "12_to_18_months"]}
  ]'::jsonb,
  '自雇客户有无法解释的大额现金存入会引发严重的 AML 担忧。银行会怀疑是未申报收入或其他非法来源。新 ABN 更缺乏历史记录来证明资金合法性',
  '1. 提供所有大额存入的来源证明\n2. 如是业务收入，需提供相应发票/合同\n3. 咨询会计师调整报税（如有遗漏）\n4. 避免在申请前有大额现金存入',
  ARRAY['Liberty', 'La Trobe'],
  'HIGH',
  'AML 合规要求'
);
