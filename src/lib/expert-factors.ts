// 专家系统预定义因子和条件选项
// 基于澳洲贷款 4C Framework: Character, Capacity, Capital, Collateral
// 新增: Policy Window, BDM Preferences, Killer Combinations, Exit Strategy

export interface ConditionOption {
  value: string;
  label: string;
  riskLevel: "STOP" | "HIGH" | "MEDIUM" | "LOW";
}

export interface FactorDefinition {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  // 如果有预定义选项则为 'select'，否则为 'text'
  inputType: "select" | "text";
  conditions?: ConditionOption[];
  placeholder?: string; // 用于 text 类型
}

export interface CategoryDefinition {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  factors: FactorDefinition[];
}

// Killer Combination - 多因子组合
export interface KillerCombination {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  factors: {
    factorId: string;
    conditionValues: string[]; // 触发该组合的条件值
  }[];
  defaultRiskLevel: "STOP";
}

export const EXPERT_SYSTEM_CATEGORIES: CategoryDefinition[] = [
  {
    id: "BORROWER_PROFILE",
    name: "身份与职业",
    nameEn: "Borrower Profile & Employment",
    description: "Deal Killer 最集中的地方，Junior 最容易忽略",
    factors: [
      {
        id: "payg_fulltime",
        name: "PAYG 全职",
        nameEn: "PAYG Full-time",
        description: "全职员工试用期状态",
        inputType: "select",
        conditions: [
          {
            value: "permanent_passed",
            label: "永久全职 (已过试用期)",
            riskLevel: "LOW",
          },
          {
            value: "permanent_within",
            label: "永久全职 (试用期内)",
            riskLevel: "MEDIUM",
          },
          {
            value: "fixed_term_long",
            label: "固定期限 > 12个月",
            riskLevel: "LOW",
          },
          {
            value: "fixed_term_short",
            label: "固定期限 < 12个月",
            riskLevel: "MEDIUM",
          },
        ],
      },
      {
        id: "payg_casual",
        name: "PAYG 临时工",
        nameEn: "PAYG Casual",
        description: "临时工入职时长",
        inputType: "select",
        conditions: [
          {
            value: "less_than_3_months",
            label: "入职 < 3个月",
            riskLevel: "STOP",
          },
          {
            value: "3_to_6_months",
            label: "入职 3-6个月",
            riskLevel: "MEDIUM",
          },
          {
            value: "more_than_6_months",
            label: "入职 > 6个月",
            riskLevel: "LOW",
          },
        ],
      },
      {
        id: "payg_contractor",
        name: "PAYG 合同工",
        nameEn: "PAYG Contractor",
        description: "合同工薪资结构",
        inputType: "select",
        conditions: [
          {
            value: "daily_rate",
            label: "每日/时薪制 (Daily Rate)",
            riskLevel: "LOW",
          },
          { value: "fixed_term", label: "固定期限合同", riskLevel: "MEDIUM" },
          { value: "rolling_contract", label: "滚动合同", riskLevel: "LOW" },
        ],
      },
      {
        id: "se_abn_age",
        name: "自雇 ABN 时长",
        nameEn: "Self-Employed ABN Age",
        description: "ABN 注册时长",
        inputType: "select",
        conditions: [
          { value: "less_than_6_months", label: "< 6个月", riskLevel: "STOP" },
          { value: "6_to_12_months", label: "6-12个月", riskLevel: "STOP" },
          { value: "12_to_18_months", label: "12-18个月", riskLevel: "MEDIUM" },
          { value: "18_to_24_months", label: "18-24个月", riskLevel: "MEDIUM" },
          { value: "more_than_24_months", label: "> 24个月", riskLevel: "LOW" },
        ],
      },
      {
        id: "se_income_variance",
        name: "自雇收入波动",
        nameEn: "Self-Employed Income Variance",
        description: "最近一年与上一年收入对比",
        inputType: "select",
        conditions: [
          {
            value: "increase_over_20",
            label: "增长 > 20%",
            riskLevel: "MEDIUM",
          },
          { value: "stable", label: "稳定 (±20%以内)", riskLevel: "LOW" },
          { value: "decrease_over_20", label: "下跌 > 20%", riskLevel: "STOP" },
        ],
      },
      {
        id: "se_gst_status",
        name: "自雇 GST 注册状态",
        nameEn: "Self-Employed GST Registration",
        description: "GST 注册情况及 BAS 提交记录",
        inputType: "select",
        conditions: [
          {
            value: "registered_active",
            label: "GST 已注册且活跃 (有 BAS 记录)",
            riskLevel: "LOW",
          },
          {
            value: "registered_no_bas_under_12m",
            label: "GST 已注册但无 BAS < 12个月",
            riskLevel: "MEDIUM",
          },
          {
            value: "registered_no_bas_over_12m",
            label: "GST 已注册但超过12个月无 BAS",
            riskLevel: "HIGH",
          },
          {
            value: "not_registered_under_75k",
            label: "未注册 GST (营业额 < $75k)",
            riskLevel: "MEDIUM",
          },
          {
            value: "not_registered_over_75k",
            label: "未注册 GST (营业额 > $75k)",
            riskLevel: "STOP",
          },
          { value: "cancelled", label: "GST 注册已取消", riskLevel: "STOP" },
        ],
      },
      {
        id: "visa_status",
        name: "签证状态",
        nameEn: "Visa Status",
        description: "申请人签证类型",
        inputType: "select",
        conditions: [
          { value: "citizen", label: "公民 (Citizen)", riskLevel: "LOW" },
          { value: "pr", label: "永久居民 (PR)", riskLevel: "LOW" },
          {
            value: "tr_485",
            label: "TR 485 (毕业生签证)",
            riskLevel: "MEDIUM",
          },
          { value: "tr_482", label: "TR 482 (雇主担保)", riskLevel: "MEDIUM" },
          { value: "tr_491", label: "TR 491 (偏远地区)", riskLevel: "MEDIUM" },
          { value: "student", label: "学生签证", riskLevel: "HIGH" },
          { value: "partner_820", label: "Partner 820", riskLevel: "MEDIUM" },
          { value: "other", label: "其他签证", riskLevel: "HIGH" },
        ],
      },
    ],
  },
  {
    id: "INCOME_SERVICING",
    name: "收入与偿付能力",
    nameEn: "Income & Servicing",
    description: "决定贷多少钱 (Capacity) 的核心",
    factors: [
      {
        id: "overtime_bonus",
        name: "加班费/奖金",
        nameEn: "Overtime/Bonus",
        description: "加班费或奖金的稳定性",
        inputType: "select",
        conditions: [
          { value: "regular", label: "经常性 (Regular)", riskLevel: "LOW" },
          { value: "occasional", label: "偶尔性", riskLevel: "MEDIUM" },
          { value: "one_off", label: "一次性", riskLevel: "HIGH" },
        ],
      },
      {
        id: "rental_income",
        name: "租金收入",
        nameEn: "Rental Income",
        description: "租金收入类型",
        inputType: "select",
        conditions: [
          { value: "existing_tenant", label: "现有租约", riskLevel: "LOW" },
          {
            value: "proposed_rental",
            label: "拟租金 (Proposed)",
            riskLevel: "MEDIUM",
          },
          {
            value: "rooming_house",
            label: "分租房 (Rooming House)",
            riskLevel: "MEDIUM",
          },
          { value: "airbnb", label: "Airbnb/短租", riskLevel: "HIGH" },
        ],
      },
      {
        id: "hecs_help",
        name: "HECS/HELP 助学贷款",
        nameEn: "HECS/HELP Debt",
        description: "助学贷款余额情况",
        inputType: "select",
        conditions: [
          { value: "none", label: "无余额", riskLevel: "LOW" },
          { value: "under_10k", label: "< $10,000", riskLevel: "MEDIUM" },
          {
            value: "10k_to_30k",
            label: "$10,000 - $30,000",
            riskLevel: "MEDIUM",
          },
          { value: "over_30k", label: "> $30,000", riskLevel: "HIGH" },
        ],
      },
      {
        id: "living_expenses",
        name: "生活费申报",
        nameEn: "Living Expenses",
        description: "申报的生活费相对于 HEM 基准",
        inputType: "select",
        conditions: [
          { value: "above_hem", label: "高于 HEM", riskLevel: "LOW" },
          { value: "at_hem", label: "接近 HEM", riskLevel: "LOW" },
          { value: "below_hem", label: "低于 HEM", riskLevel: "MEDIUM" },
        ],
      },
      {
        id: "child_maintenance",
        name: "子女抚养费",
        nameEn: "Child Maintenance",
        description: "是否有支付抚养费义务",
        inputType: "select",
        conditions: [
          { value: "none", label: "无", riskLevel: "LOW" },
          { value: "paying", label: "需支付", riskLevel: "STOP" },
          { value: "receiving", label: "收取中", riskLevel: "LOW" },
        ],
      },
      {
        id: "other_income",
        name: "其他收入",
        nameEn: "Other Income",
        description: "其他收入来源描述",
        inputType: "text",
        placeholder: "描述其他收入来源及金额...",
      },
    ],
  },
  {
    id: "FUNDS_DEPOSIT",
    name: "资金准备",
    nameEn: "Funds to Complete & Deposit",
    description: "首付来源合规性检查",
    factors: [
      {
        id: "genuine_savings",
        name: "真实存款",
        nameEn: "Genuine Savings",
        description: "LVR > 90% 时的真实存款情况",
        inputType: "select",
        conditions: [
          {
            value: "has_5_percent_3_months",
            label: "有 5% 存满 3 个月",
            riskLevel: "LOW",
          },
          {
            value: "rent_as_savings",
            label: "租房记录代替 (12个月)",
            riskLevel: "MEDIUM",
          },
          {
            value: "no_genuine_savings",
            label: "无真实存款",
            riskLevel: "STOP",
          },
        ],
      },
      {
        id: "gifted_funds",
        name: "赠与资金",
        nameEn: "Gifted Funds",
        description: "赠与资金情况",
        inputType: "select",
        conditions: [
          { value: "none", label: "无赠与", riskLevel: "LOW" },
          {
            value: "non_refundable",
            label: "不可退还赠与 (Non-refundable)",
            riskLevel: "LOW",
          },
          {
            value: "repayable",
            label: "需偿还赠与 (Repayable)",
            riskLevel: "HIGH",
          },
        ],
      },
      {
        id: "deposit_source",
        name: "首付来源",
        nameEn: "Deposit Source",
        description: "首付资金来源",
        inputType: "select",
        conditions: [
          { value: "savings", label: "个人储蓄", riskLevel: "LOW" },
          { value: "equity", label: "房产增值 (Equity)", riskLevel: "LOW" },
          { value: "gift", label: "亲友赠与", riskLevel: "MEDIUM" },
          { value: "crypto", label: "加密货币收益", riskLevel: "HIGH" },
          { value: "overseas", label: "海外资金", riskLevel: "HIGH" },
          {
            value: "unexplained_cash",
            label: "无法解释的现金",
            riskLevel: "STOP",
          },
        ],
      },
      {
        id: "large_deposits",
        name: "大额存入",
        nameEn: "Large Cash Deposits",
        description: "近期大额现金存入情况",
        inputType: "select",
        conditions: [
          { value: "none", label: "无大额存入", riskLevel: "LOW" },
          {
            value: "explained",
            label: "有大额存入但可解释",
            riskLevel: "MEDIUM",
          },
          { value: "unexplained", label: "无法解释来源", riskLevel: "STOP" },
        ],
      },
    ],
  },
  {
    id: "CREDIT_CHARACTER",
    name: "信用与品格",
    nameEn: "Credit & Character",
    description: "银行批不批的底线",
    factors: [
      {
        id: "credit_score",
        name: "信用分",
        nameEn: "Credit Score (Equifax)",
        description: "Equifax 信用分数",
        inputType: "select",
        conditions: [
          { value: "excellent", label: "> 800 (优秀)", riskLevel: "LOW" },
          { value: "good", label: "700-800 (良好)", riskLevel: "LOW" },
          { value: "average", label: "500-700 (一般)", riskLevel: "MEDIUM" },
          { value: "poor", label: "< 500 (较差)", riskLevel: "STOP" },
        ],
      },
      {
        id: "credit_enquiries",
        name: "信用查询记录",
        nameEn: "Credit Enquiries",
        description: "过去30天内的信用查询次数",
        inputType: "select",
        conditions: [
          { value: "none", label: "无查询", riskLevel: "LOW" },
          { value: "1_to_2", label: "1-2 次", riskLevel: "LOW" },
          { value: "3_plus", label: "> 3 次", riskLevel: "MEDIUM" },
        ],
      },
      {
        id: "defaults",
        name: "违约记录",
        nameEn: "Defaults",
        description: "违约记录情况",
        inputType: "select",
        conditions: [
          { value: "none", label: "无违约", riskLevel: "LOW" },
          {
            value: "telco_under_1k_paid",
            label: "电信/水电 < $1000 (已付清)",
            riskLevel: "MEDIUM",
          },
          {
            value: "telco_under_1k_unpaid",
            label: "电信/水电 < $1000 (未付清)",
            riskLevel: "HIGH",
          },
          {
            value: "financial_default",
            label: "金融机构违约",
            riskLevel: "STOP",
          },
        ],
      },
      {
        id: "payday_lenders",
        name: "小额高利贷",
        nameEn: "Payday Lenders",
        description: "是否有小额贷款记录 (如 Cash Converters)",
        inputType: "select",
        conditions: [
          { value: "none", label: "无记录", riskLevel: "LOW" },
          {
            value: "over_3_months_ago",
            label: "3个月前有记录",
            riskLevel: "HIGH",
          },
          { value: "recent", label: "近期有记录", riskLevel: "STOP" },
        ],
      },
      {
        id: "ato_debt",
        name: "ATO 欠款",
        nameEn: "ATO Debt",
        description: "税务局欠款情况",
        inputType: "select",
        conditions: [
          { value: "none", label: "无欠款", riskLevel: "LOW" },
          {
            value: "payment_plan",
            label: "有欠款但在还款计划中",
            riskLevel: "HIGH",
          },
          { value: "outstanding", label: "有未结清欠款", riskLevel: "STOP" },
        ],
      },
      {
        id: "bankruptcy",
        name: "破产记录",
        nameEn: "Bankruptcy",
        description: "破产或债务协议历史",
        inputType: "select",
        conditions: [
          { value: "none", label: "无记录", riskLevel: "LOW" },
          {
            value: "discharged_over_2_years",
            label: "解除超过2年",
            riskLevel: "HIGH",
          },
          {
            value: "discharged_under_2_years",
            label: "解除不足2年",
            riskLevel: "STOP",
          },
          { value: "current", label: "当前破产中", riskLevel: "STOP" },
        ],
      },
    ],
  },
  {
    id: "COLLATERAL",
    name: "抵押物",
    nameEn: "Security / Collateral",
    description: "房子本身能不能抵押",
    factors: [
      {
        id: "apartment_size",
        name: "公寓面积",
        nameEn: "Apartment Size",
        description: "公寓内部面积 (sqm)",
        inputType: "select",
        conditions: [
          { value: "over_50", label: "> 50 sqm", riskLevel: "LOW" },
          { value: "40_to_50", label: "40-50 sqm", riskLevel: "MEDIUM" },
          { value: "under_40", label: "< 40 sqm", riskLevel: "STOP" },
          { value: "not_apartment", label: "非公寓 (N/A)", riskLevel: "LOW" },
        ],
      },
      {
        id: "location_postcode",
        name: "区域限制",
        nameEn: "Location/Postcode",
        description: "物业所在区域是否在银行黑名单",
        inputType: "select",
        conditions: [
          { value: "no_restriction", label: "无限制", riskLevel: "LOW" },
          {
            value: "watchlist",
            label: "在观察名单 (Watchlist)",
            riskLevel: "MEDIUM",
          },
          { value: "restricted", label: "受限区域", riskLevel: "HIGH" },
        ],
      },
      {
        id: "property_type",
        name: "物业类型",
        nameEn: "Property Type",
        description: "物业类型",
        inputType: "select",
        conditions: [
          { value: "house", label: "House", riskLevel: "LOW" },
          { value: "townhouse", label: "Townhouse", riskLevel: "LOW" },
          { value: "apartment", label: "Apartment", riskLevel: "LOW" },
          { value: "unit", label: "Unit", riskLevel: "LOW" },
          { value: "land", label: "Land Only", riskLevel: "MEDIUM" },
          {
            value: "off_the_plan",
            label: "Off-the-plan (楼花)",
            riskLevel: "MEDIUM",
          },
          { value: "rural", label: "Rural/农村", riskLevel: "HIGH" },
          { value: "commercial", label: "Commercial", riskLevel: "HIGH" },
        ],
      },
      {
        id: "property_condition",
        name: "房况",
        nameEn: "Property Condition",
        description: "物业状况",
        inputType: "select",
        conditions: [
          { value: "good", label: "良好/可居住", riskLevel: "LOW" },
          { value: "needs_renovation", label: "需装修", riskLevel: "MEDIUM" },
          {
            value: "derelict",
            label: "无法居住 (Derelict)",
            riskLevel: "STOP",
          },
        ],
      },
      {
        id: "lvr",
        name: "LVR",
        nameEn: "Loan to Value Ratio",
        description: "贷款价值比",
        inputType: "select",
        conditions: [
          { value: "under_60", label: "< 60%", riskLevel: "LOW" },
          { value: "60_to_80", label: "60-80%", riskLevel: "LOW" },
          { value: "80_to_90", label: "80-90%", riskLevel: "MEDIUM" },
          { value: "90_to_95", label: "90-95%", riskLevel: "HIGH" },
          { value: "over_95", label: "> 95%", riskLevel: "STOP" },
        ],
      },
      {
        id: "valuation_risk",
        name: "估价风险",
        nameEn: "Valuation Risk",
        description: "估价相对于合同价的风险",
        inputType: "select",
        conditions: [
          { value: "at_contract", label: "预计等于合同价", riskLevel: "LOW" },
          { value: "slight_risk", label: "轻微短估风险", riskLevel: "MEDIUM" },
          { value: "high_risk", label: "高短估风险", riskLevel: "HIGH" },
        ],
      },
    ],
  },
  {
    id: "POLICY_WINDOW",
    name: "政策窗口",
    nameEn: "Policy Window & Campaigns",
    description: "时效性银行政策、限时优惠、Campaign 期间特殊逻辑",
    factors: [
      {
        id: "cashback_campaign",
        name: "Cashback 活动",
        nameEn: "Cashback Campaign",
        description: "银行现金返还活动状态",
        inputType: "select",
        conditions: [
          { value: "active", label: "活动进行中", riskLevel: "LOW" },
          {
            value: "ending_soon",
            label: "即将结束 (< 2周)",
            riskLevel: "MEDIUM",
          },
          { value: "ended", label: "活动已结束", riskLevel: "MEDIUM" },
        ],
      },
      {
        id: "lmi_waiver",
        name: "LMI 减免政策",
        nameEn: "LMI Waiver",
        description: "LMI 减免或折扣活动",
        inputType: "select",
        conditions: [
          {
            value: "full_waiver",
            label: "全额减免 (特定职业)",
            riskLevel: "LOW",
          },
          { value: "discount", label: "部分折扣", riskLevel: "LOW" },
          { value: "none", label: "无减免", riskLevel: "MEDIUM" },
        ],
      },
      {
        id: "rate_special",
        name: "利率特惠",
        nameEn: "Rate Special",
        description: "限时利率优惠活动",
        inputType: "select",
        conditions: [
          { value: "active", label: "特惠进行中", riskLevel: "LOW" },
          { value: "ending_7_days", label: "7天内结束", riskLevel: "MEDIUM" },
          { value: "standard", label: "标准利率", riskLevel: "LOW" },
        ],
      },
      {
        id: "policy_change_pending",
        name: "政策变更预警",
        nameEn: "Policy Change Alert",
        description: "已知即将变更的银行政策",
        inputType: "select",
        conditions: [
          { value: "tightening", label: "即将收紧", riskLevel: "HIGH" },
          { value: "loosening", label: "即将放宽", riskLevel: "LOW" },
          { value: "stable", label: "暂无变化", riskLevel: "LOW" },
        ],
      },
    ],
  },
  {
    id: "BDM_PREFERENCES",
    name: "BDM 偏好",
    nameEn: "BDM & Soft Factors",
    description: "非官方政策，资深 Broker 的核心资产 - BDM 关系与偏好",
    factors: [
      {
        id: "bdm_relationship",
        name: "BDM 关系",
        nameEn: "BDM Relationship",
        description: "与银行 BDM 的合作关系",
        inputType: "select",
        conditions: [
          {
            value: "strong",
            label: "关系良好 (可争取 Exception)",
            riskLevel: "LOW",
          },
          { value: "normal", label: "一般关系", riskLevel: "LOW" },
          { value: "new", label: "新 BDM/无关系", riskLevel: "MEDIUM" },
        ],
      },
      {
        id: "accountant_letter_quality",
        name: "会计师信措辞",
        nameEn: "Accountant Letter Quality",
        description: "Self-employed 会计师信的专业度和措辞",
        inputType: "select",
        conditions: [
          {
            value: "strong_wording",
            label: "措辞有力 (业务稳定/抗压性强)",
            riskLevel: "LOW",
          },
          { value: "standard", label: "标准措辞", riskLevel: "LOW" },
          { value: "weak", label: "措辞弱/模糊", riskLevel: "HIGH" },
          { value: "questionable", label: "可信度存疑", riskLevel: "STOP" },
        ],
      },
      {
        id: "exception_likelihood",
        name: "Exception 可能性",
        nameEn: "Exception Likelihood",
        description: "基于 BDM 反馈判断 Exception 获批概率",
        inputType: "select",
        conditions: [
          { value: "high", label: "高概率 (BDM 已口头确认)", riskLevel: "LOW" },
          { value: "medium", label: "中等概率 (有先例)", riskLevel: "MEDIUM" },
          { value: "low", label: "低概率 (罕见)", riskLevel: "HIGH" },
          { value: "unlikely", label: "基本不可能", riskLevel: "STOP" },
        ],
      },
      {
        id: "broker_track_record",
        name: "Broker 成交记录",
        nameEn: "Broker Track Record",
        description: "与该银行的历史成交量",
        inputType: "select",
        conditions: [
          {
            value: "top_performer",
            label: "高成交量 (有议价权)",
            riskLevel: "LOW",
          },
          { value: "regular", label: "普通成交量", riskLevel: "LOW" },
          {
            value: "new_relationship",
            label: "新合作/低成交量",
            riskLevel: "MEDIUM",
          },
        ],
      },
    ],
  },
  {
    id: "EXIT_STRATEGY",
    name: "退出机制",
    nameEn: "Exit Strategy & Fallback",
    description: "当主方案失败时的备选路径和退出策略",
    factors: [
      {
        id: "valuation_shortfall",
        name: "估价不足对策",
        nameEn: "Valuation Shortfall Strategy",
        description: "估价低于合同价时的应对方案",
        inputType: "select",
        conditions: [
          {
            value: "challenge_val",
            label: "挑战估价 (需同区3个成交案例)",
            riskLevel: "MEDIUM",
          },
          {
            value: "switch_lender",
            label: "换银行重新估价",
            riskLevel: "MEDIUM",
          },
          { value: "increase_deposit", label: "补足首付", riskLevel: "HIGH" },
          {
            value: "renegotiate_price",
            label: "与卖家重新议价",
            riskLevel: "HIGH",
          },
          { value: "walk_away", label: "放弃交易", riskLevel: "STOP" },
        ],
      },
      {
        id: "application_declined",
        name: "申请被拒对策",
        nameEn: "Application Declined Strategy",
        description: "正式申请被拒后的备选方案",
        inputType: "select",
        conditions: [
          { value: "appeal", label: "申诉/提供补充材料", riskLevel: "MEDIUM" },
          { value: "second_tier", label: "转二线银行", riskLevel: "MEDIUM" },
          { value: "non_bank", label: "转 Non-bank Lender", riskLevel: "HIGH" },
          {
            value: "private_lender",
            label: "转 Private Lender",
            riskLevel: "HIGH",
          },
          {
            value: "wait_and_reapply",
            label: "等待条件改善后重申",
            riskLevel: "MEDIUM",
          },
        ],
      },
      {
        id: "settlement_delay",
        name: "交割延期风险",
        nameEn: "Settlement Delay Risk",
        description: "交割可能延期时的处理方案",
        inputType: "select",
        conditions: [
          {
            value: "extension_likely",
            label: "延期申请可能获批",
            riskLevel: "MEDIUM",
          },
          { value: "penalty_risk", label: "有违约金风险", riskLevel: "HIGH" },
          { value: "bridge_finance", label: "需过桥贷款", riskLevel: "HIGH" },
          {
            value: "contract_termination",
            label: "合同终止风险",
            riskLevel: "STOP",
          },
        ],
      },
      {
        id: "rate_lock_expiry",
        name: "利率锁定到期",
        nameEn: "Rate Lock Expiry",
        description: "利率锁定期到期的影响",
        inputType: "select",
        conditions: [
          { value: "within_lock", label: "在锁定期内", riskLevel: "LOW" },
          {
            value: "expiring_soon",
            label: "即将到期 (< 2周)",
            riskLevel: "MEDIUM",
          },
          { value: "expired", label: "已到期", riskLevel: "HIGH" },
          { value: "no_lock", label: "无利率锁定", riskLevel: "MEDIUM" },
        ],
      },
    ],
  },
];

// 预定义的 Killer Combinations (多因子组合)
export const KILLER_COMBINATIONS: KillerCombination[] = [
  {
    id: "short_abn_high_lvr_apartment",
    name: "Short ABN + High LVR + 小公寓",
    nameEn: "Short ABN + High LVR + Small Apartment",
    description:
      "自雇时间短 + 高杠杆 + 小面积公寓 = 多因子组合，Prime Lender 不会做",
    factors: [
      {
        factorId: "se_abn_age",
        conditionValues: [
          "less_than_6_months",
          "6_to_12_months",
          "12_to_18_months",
        ],
      },
      { factorId: "lvr", conditionValues: ["90_to_95", "over_95"] },
      { factorId: "apartment_size", conditionValues: ["under_40", "40_to_50"] },
    ],
    defaultRiskLevel: "STOP",
  },
  {
    id: "visa_high_lvr_investment",
    name: "TR签证 + High LVR + 投资房",
    nameEn: "TR Visa + High LVR + Investment",
    description: "临时签证 + 高杠杆 + 投资房 = 几乎不可能获批",
    factors: [
      {
        factorId: "visa_status",
        conditionValues: ["tr_485", "tr_482", "tr_491", "student", "other"],
      },
      { factorId: "lvr", conditionValues: ["80_to_90", "90_to_95", "over_95"] },
    ],
    defaultRiskLevel: "STOP",
  },
  {
    id: "credit_default_high_lvr",
    name: "信用违约 + High LVR",
    nameEn: "Credit Default + High LVR",
    description: "有违约记录的情况下申请高杠杆贷款",
    factors: [
      {
        factorId: "defaults",
        conditionValues: ["telco_under_1k_unpaid", "financial_default"],
      },
      { factorId: "lvr", conditionValues: ["80_to_90", "90_to_95", "over_95"] },
    ],
    defaultRiskLevel: "STOP",
  },
  {
    id: "payday_lender_prime_bank",
    name: "小额高利贷记录 + 四大银行",
    nameEn: "Payday Lender + Big 4 Banks",
    description: "有 Payday Lender 记录后申请四大银行",
    factors: [
      {
        factorId: "payday_lenders",
        conditionValues: ["over_3_months_ago", "recent"],
      },
    ],
    defaultRiskLevel: "STOP",
  },
  {
    id: "no_genuine_savings_high_lvr",
    name: "无真实存款 + High LVR",
    nameEn: "No Genuine Savings + High LVR",
    description: "无真实存款记录申请 90%+ LVR",
    factors: [
      { factorId: "genuine_savings", conditionValues: ["no_genuine_savings"] },
      { factorId: "lvr", conditionValues: ["90_to_95", "over_95"] },
    ],
    defaultRiskLevel: "STOP",
  },
];

// 辅助函数：根据 category ID 获取 category
export function getCategoryById(
  categoryId: string,
): CategoryDefinition | undefined {
  return EXPERT_SYSTEM_CATEGORIES.find((c) => c.id === categoryId);
}

// 辅助函数：根据 factor ID 获取 factor（需要遍历所有 categories）
export function getFactorById(
  factorId: string,
): { category: CategoryDefinition; factor: FactorDefinition } | undefined {
  for (const category of EXPERT_SYSTEM_CATEGORIES) {
    const factor = category.factors.find((f) => f.id === factorId);
    if (factor) {
      return { category, factor };
    }
  }
  return undefined;
}

// 辅助函数：获取条件的风险等级
export function getConditionRiskLevel(
  factorId: string,
  conditionValue: string,
): string | undefined {
  const result = getFactorById(factorId);
  if (!result || result.factor.inputType !== "select") return undefined;
  const condition = result.factor.conditions?.find(
    (c) => c.value === conditionValue,
  );
  return condition?.riskLevel;
}
