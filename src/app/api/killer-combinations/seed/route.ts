import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Seed data for killer_combinations table
const SEED_DATA = [
  {
    name: "自雇 ABN 时长 + LVR + 公寓面积",
    name_en: "Self-Employed ABN Age + Loan to Value Ratio + Apartment Size",
    description: "自雇时间短 + 高杠杆 + 小面积公寓的风险组合",
    factors: [
      { factorId: "se_abn_age", conditionValues: ["less_than_6_months", "6_to_12_months", "12_to_18_months"] },
      { factorId: "lvr", conditionValues: ["90_to_95", "over_95"] },
      { factorId: "apartment_size", conditionValues: ["under_40", "40_to_50"] },
    ],
    expert_reasoning: "Prime Lender 对自雇客户本身就更谨慎，ABN < 24个月通常需要更多证明。再叠加高 LVR (>90%) 和小公寓（<50sqm），风险集中爆发。银行担心：1) 收入稳定性存疑 2) 高杠杆无退路 3) 小公寓流动性差估值波动大",
    solutions: "1. 降低 LVR 至 80% 以下\n2. 等 ABN 满 24 个月后再申请\n3. 换大面积物业（>50sqm）\n4. 考虑 Non-Prime Lender",
    alternative_lenders: ["Pepper Money", "Liberty", "La Trobe"],
    confidence_level: "HIGH",
    source_notes: "多家银行 BDM 确认，属于行业共识",
  },
  {
    name: "签证状态 + LVR",
    name_en: "Visa Status + Loan to Value Ratio",
    description: "临时签证 + 高杠杆贷款的风险组合",
    factors: [
      { factorId: "visa_status", conditionValues: ["tr_485", "tr_482", "tr_491", "student", "other"] },
      { factorId: "lvr", conditionValues: ["80_to_90", "90_to_95", "over_95"] },
    ],
    expert_reasoning: "临时签证持有人面临签证到期/续签不确定性，银行担心借款人可能离开澳洲。高 LVR 意味着没有足够的缓冲空间，如果借款人离境违约，银行可能无法通过出售物业收回全部贷款",
    solutions: "1. 降低 LVR 至 70% 以下（部分银行可接受）\n2. 等 PR 批准后再申请\n3. 提供额外担保或 co-borrower\n4. 选择对 TR 友好的银行",
    alternative_lenders: ["ANZ", "Westpac", "St George"],
    confidence_level: "HIGH",
    source_notes: "各银行官方政策明确规定 TR 的 LVR 上限",
  },
  {
    name: "违约记录 + LVR",
    name_en: "Defaults + Loan to Value Ratio",
    description: "有违约记录 + 高杠杆贷款的风险组合",
    factors: [
      { factorId: "defaults", conditionValues: ["telco_under_1k_unpaid", "financial_default"] },
      { factorId: "lvr", conditionValues: ["80_to_90", "90_to_95", "over_95"] },
    ],
    expert_reasoning: "违约记录直接反映借款人的还款意愿和能力。金融机构违约更严重，是 Character 维度的重大红旗。高 LVR 在有违约历史的情况下，银行完全没有安全边际",
    solutions: "1. 付清所有未结清违约\n2. 等待违约记录满 2 年后淡化\n3. 降低 LVR 至 70% 以下\n4. 转 Non-Prime Lender 并准备解释信",
    alternative_lenders: ["Pepper Money", "Liberty", "Bluestone"],
    confidence_level: "HIGH",
    source_notes: "银行政策明确规定",
  },
  {
    name: "小额高利贷 + 信用分",
    name_en: "Payday Lenders + Credit Score (Equifax)",
    description: "有小额贷款记录 + 信用分偏低的风险组合",
    factors: [
      { factorId: "payday_lenders", conditionValues: ["over_3_months_ago", "recent"] },
      { factorId: "credit_score", conditionValues: ["average", "poor"] },
    ],
    expert_reasoning: "Payday Lender (如 Cash Converters) 记录是银行最反感的因子之一，反映借款人财务管理能力差或有资金短缺历史。再加上信用分不高，基本上四大银行和大部分二线银行都会自动拒绝",
    solutions: "1. 等待 Payday Lender 记录满 6 个月以上\n2. 改善信用分至 700+\n3. 准备详细的解释信说明当时情况\n4. 只能考虑 Non-Prime Lender",
    alternative_lenders: ["Pepper Money", "Liberty", "La Trobe", "Resimac"],
    confidence_level: "HIGH",
    source_notes: "四大银行 BDM 明确表示有 Payday Lender 记录即拒",
  },
  {
    name: "真实存款 + LVR",
    name_en: "Genuine Savings + Loan to Value Ratio",
    description: "无真实存款 + 高杠杆贷款的风险组合",
    factors: [
      { factorId: "genuine_savings", conditionValues: ["no_genuine_savings"] },
      { factorId: "lvr", conditionValues: ["90_to_95", "over_95"] },
    ],
    expert_reasoning: "LVR > 90% 时，大部分银行要求 5% 的真实存款（存满 3 个月）。这是为了证明借款人有储蓄习惯和还款能力。没有真实存款说明借款人可能是\"月光族\"，一旦收入中断就会断供",
    solutions: "1. 开始存钱，累积 3 个月的真实存款记录\n2. 用 12 个月租房记录代替（部分银行接受）\n3. 降低 LVR 至 90% 以下（减少真实存款要求）\n4. 寻找不要求真实存款的 Lender",
    alternative_lenders: ["Macquarie", "ING", "Bankwest"],
    confidence_level: "HIGH",
    source_notes: "各银行官方政策",
  },
  {
    name: "ATO 欠款 + 自雇 ABN 时长",
    name_en: "ATO Debt + Self-Employed ABN Age",
    description: "税务欠款 + 自雇客户的风险组合",
    factors: [
      { factorId: "ato_debt", conditionValues: ["payment_plan", "outstanding"] },
      { factorId: "se_abn_age", conditionValues: ["less_than_6_months", "6_to_12_months", "12_to_18_months", "18_to_24_months"] },
    ],
    expert_reasoning: "自雇客户有 ATO 欠款是严重的红旗。这表明：1) 现金流管理差 2) 可能存在税务合规问题 3) 真实收入可能与报税收入不符。银行会怀疑会计师信的可信度",
    solutions: "1. 付清 ATO 欠款\n2. 如有还款计划，确保按时还款 6 个月以上\n3. 获取会计师信说明欠款原因（如 COVID 期间延迟）\n4. 考虑 Low Doc 产品",
    alternative_lenders: ["Pepper Money", "Liberty", "La Trobe"],
    confidence_level: "HIGH",
    source_notes: "银行政策及 BDM 反馈",
  },
  {
    name: "破产记录 + LVR",
    name_en: "Bankruptcy + Loan to Value Ratio",
    description: "有破产历史 + 高杠杆贷款的风险组合",
    factors: [
      { factorId: "bankruptcy", conditionValues: ["discharged_over_2_years", "discharged_under_2_years"] },
      { factorId: "lvr", conditionValues: ["80_to_90", "90_to_95", "over_95"] },
    ],
    expert_reasoning: "破产是最严重的信用事件。即使已解除，大部分 Prime Lender 要求解除后 2-5 年才能申请，且 LVR 有严格限制。破产 + 高 LVR = 完全不可能获批",
    solutions: "1. 等待破产解除满 2 年以上\n2. 将 LVR 控制在 70% 以下\n3. 提供详细的财务复苏证明\n4. 只能走 Non-Prime Lender",
    alternative_lenders: ["Pepper Money", "Liberty", "La Trobe", "Bluestone"],
    confidence_level: "HIGH",
    source_notes: "各银行官方政策明确规定",
  },
  {
    name: "PAYG 临时工 + LVR",
    name_en: "PAYG Casual + Loan to Value Ratio",
    description: "临时工短期入职 + 高杠杆贷款的风险组合",
    factors: [
      { factorId: "payg_casual", conditionValues: ["less_than_3_months", "3_to_6_months"] },
      { factorId: "lvr", conditionValues: ["90_to_95", "over_95"] },
    ],
    expert_reasoning: "临时工没有固定工时保障，收入不稳定。入职时间短更无法证明收入的可持续性。银行通常要求 Casual 入职满 6-12 个月才能全额认可收入",
    solutions: "1. 等待入职满 6 个月后再申请\n2. 降低 LVR 至 80% 以下\n3. 提供同行业长期工作经验证明\n4. 尝试获取雇主确认信说明工作稳定性",
    alternative_lenders: ["Macquarie", "ING", "Suncorp"],
    confidence_level: "HIGH",
    source_notes: "BDM 反馈及银行政策",
  },
  {
    name: "自雇收入波动 + LVR",
    name_en: "Self-Employed Income Variance + Loan to Value Ratio",
    description: "自雇收入大幅下跌 + 高杠杆贷款的风险组合",
    factors: [
      { factorId: "se_income_variance", conditionValues: ["decrease_over_20"] },
      { factorId: "lvr", conditionValues: ["80_to_90", "90_to_95", "over_95"] },
    ],
    expert_reasoning: "自雇收入下跌超过 20% 是严重警告信号，说明业务可能在萎缩。银行会担心下跌趋势会持续，导致未来无法偿还贷款。高 LVR 使情况更加恶化",
    solutions: "1. 等待下一财年收入稳定后再申请\n2. 提供会计师信解释下跌原因（如一次性费用、业务转型）\n3. 降低 LVR 以降低风险\n4. 使用最近 3 个月 BAS 证明收入已恢复",
    alternative_lenders: ["Pepper Money", "Liberty"],
    confidence_level: "HIGH",
    source_notes: "BDM 反馈",
  },
  {
    name: "首付来源 + LVR",
    name_en: "Deposit Source + Loan to Value Ratio",
    description: "海外资金来源首付 + 高杠杆贷款的风险组合",
    factors: [
      { factorId: "deposit_source", conditionValues: ["overseas", "crypto"] },
      { factorId: "lvr", conditionValues: ["80_to_90", "90_to_95", "over_95"] },
    ],
    expert_reasoning: "海外资金和加密货币来源的首付难以追溯和验证，涉及 AML (反洗钱) 合规风险。银行需要证明资金来源合法，海外转账尤其需要详细的资金链证明",
    solutions: "1. 准备完整的资金链证明（海外银行流水、兑换记录、转账记录）\n2. 资金提前 3-6 个月转入澳洲账户\n3. 降低 LVR 减少对首付来源的依赖\n4. 选择对海外资金审核相对宽松的银行",
    alternative_lenders: ["HSBC", "NAB", "Bank of China Australia"],
    confidence_level: "LOW",
    source_notes: "基于 AML 合规要求及银行实践",
  },
  {
    name: "物业类型 + 区域限制 + LVR",
    name_en: "Property Type + Location/Postcode + Loan to Value Ratio",
    description: "特殊物业类型 + 受限区域 + 高杠杆的风险组合",
    factors: [
      { factorId: "property_type", conditionValues: ["rural", "off_the_plan"] },
      { factorId: "location_postcode", conditionValues: ["watchlist", "restricted"] },
      { factorId: "lvr", conditionValues: ["80_to_90", "90_to_95"] },
    ],
    expert_reasoning: "特殊物业类型（农村/楼花）流动性差，在受限区域更是雪上加霜。高 LVR 意味着银行几乎没有安全边际，一旦市场下跌或借款人违约，银行可能无法回收贷款",
    solutions: "1. 选择主流城区的标准物业\n2. 大幅降低 LVR 至 70% 以下\n3. 等楼花交付后再按现房申请\n4. 考虑专门做 Rural 的 Lender",
    alternative_lenders: ["Suncorp", "Beyond Bank", "Teachers Mutual"],
    confidence_level: "HIGH",
    source_notes: "银行内部风险评估标准",
  },
  {
    name: "自雇 GST 注册状态 + 自雇收入波动",
    name_en: "Self-Employed GST Registration + Self-Employed Income Variance",
    description: "GST 注册异常 + 收入不稳定的风险组合",
    factors: [
      { factorId: "se_gst_status", conditionValues: ["registered_no_bas_over_12m", "not_registered_over_75k", "cancelled"] },
      { factorId: "se_income_variance", conditionValues: ["decrease_over_20"] },
    ],
    expert_reasoning: "GST 注册状态异常（如超过 12 个月没提交 BAS 或 GST 被取消）暗示业务可能已停止运营或有税务合规问题。收入下跌进一步证实业务状况不佳",
    solutions: "1. 补齐所有 BAS 申报\n2. 如 GST 被取消，重新注册并保持活跃\n3. 提供会计师信详细解释情况\n4. 等待业务稳定 6-12 个月后再申请",
    alternative_lenders: ["Pepper Money", "La Trobe"],
    confidence_level: "HIGH",
    source_notes: "ATO 合规要求及银行政策",
  },
  {
    name: "估价风险 + 物业类型",
    name_en: "Valuation Risk + Property Type",
    description: "高估价风险 + 楼花/特殊物业的组合",
    factors: [
      { factorId: "valuation_risk", conditionValues: ["slight_risk", "high_risk"] },
      { factorId: "property_type", conditionValues: ["off_the_plan", "rural"] },
    ],
    expert_reasoning: "楼花和农村物业本身估值就不稳定，市场参照物少。如果预期有估价风险，很可能导致估价不足，需要补首付或降低贷款金额",
    solutions: "1. 提前做估价评估，了解真实市场价值\n2. 准备额外资金应对可能的估价短缺\n3. 考虑挑战估价（需要 3 个同区成交案例）\n4. 选择估价相对宽松的银行",
    alternative_lenders: ["CBA", "Macquarie"],
    confidence_level: "LOW",
    source_notes: "实际案例经验",
  },
  {
    name: "赠与资金 + LVR",
    name_en: "Gifted Funds + Loan to Value Ratio",
    description: "需偿还的赠与资金 + 高杠杆贷款的风险组合",
    factors: [
      { factorId: "gifted_funds", conditionValues: ["repayable"] },
      { factorId: "lvr", conditionValues: ["80_to_90", "90_to_95", "over_95"] },
    ],
    expert_reasoning: "需偿还的\"赠与\"实际上是贷款，会增加借款人的负债。银行需要将其计入 Servicing 计算。高 LVR 本身借款人就处于高负债状态，额外的隐性负债会导致无法通过压力测试",
    solutions: "1. 将赠与改为不可退还赠与（需赠与人签署声明）\n2. 如必须偿还，在申请时披露并计入负债\n3. 降低 LVR 以改善 Servicing\n4. 等偿还完毕后再申请",
    alternative_lenders: ["ANZ", "CBA"],
    confidence_level: "HIGH",
    source_notes: "银行政策明确规定赠与必须为不可退还",
  },
  {
    name: "大额存入 + 自雇 ABN 时长",
    name_en: "Large Cash Deposits + Self-Employed ABN Age",
    description: "无法解释的大额存入 + 自雇客户的风险组合",
    factors: [
      { factorId: "large_deposits", conditionValues: ["unexplained"] },
      { factorId: "se_abn_age", conditionValues: ["less_than_6_months", "6_to_12_months", "12_to_18_months"] },
    ],
    expert_reasoning: "自雇客户有无法解释的大额现金存入会引发严重的 AML 担忧。银行会怀疑是未申报收入或其他非法来源。新 ABN 更缺乏历史记录来证明资金合法性",
    solutions: "1. 提供所有大额存入的来源证明\n2. 如是业务收入，需提供相应发票/合同\n3. 咨询会计师调整报税（如有遗漏）\n4. 避免在申请前有大额现金存入",
    alternative_lenders: ["Liberty", "La Trobe"],
    confidence_level: "HIGH",
    source_notes: "AML 合规要求",
  },
];

export async function POST() {
  try {
    const supabase = await createClient();

    // Check existing data count
    const { count: existingCount } = await supabase
      .from("killer_combinations")
      .select("*", { count: "exact", head: true });

    // Insert seed data
    const { data, error } = await supabase
      .from("killer_combinations")
      .insert(SEED_DATA)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Successfully seeded ${data.length} multi-factor combinations`,
      existingBefore: existingCount || 0,
      inserted: data.length,
      data,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to check current seed data status
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, count, error } = await supabase
      .from("killer_combinations")
      .select("id, name, name_en, created_at", { count: "exact" })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      count: count || 0,
      seedDataCount: SEED_DATA.length,
      existingRecords: data,
    });
  } catch (error) {
    console.error("Check seed status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to clear all seed data
export async function DELETE() {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("killer_combinations")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Successfully cleared all multi-factor combinations",
    });
  } catch (error) {
    console.error("Clear error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
