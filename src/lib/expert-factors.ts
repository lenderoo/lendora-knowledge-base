// 专家系统预定义因子和条件选项
// 基于澳洲贷款 4C Framework: Character, Capacity, Capital, Collateral

export interface ConditionOption {
  value: string;
  label: string;
  riskLevel: 'STOP' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface FactorDefinition {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  // 如果有预定义选项则为 'select'，否则为 'text'
  inputType: 'select' | 'text';
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

export const EXPERT_SYSTEM_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'BORROWER_PROFILE',
    name: '身份与职业',
    nameEn: 'Borrower Profile & Employment',
    description: 'Deal Killer 最集中的地方，Junior 最容易忽略',
    factors: [
      {
        id: 'payg_probation',
        name: 'PAYG 试用期',
        nameEn: 'PAYG Probation',
        description: '新工作是否在试用期内',
        inputType: 'select',
        conditions: [
          { value: 'within_probation', label: '试用期内 (Within Probation)', riskLevel: 'MEDIUM' },
          { value: 'passed_probation', label: '已过试用期', riskLevel: 'LOW' },
        ],
      },
      {
        id: 'payg_casual',
        name: 'PAYG 临时工',
        nameEn: 'PAYG Casual',
        description: '临时工入职时长',
        inputType: 'select',
        conditions: [
          { value: 'less_than_3_months', label: '入职 < 3个月', riskLevel: 'STOP' },
          { value: '3_to_6_months', label: '入职 3-6个月', riskLevel: 'MEDIUM' },
          { value: 'more_than_6_months', label: '入职 > 6个月', riskLevel: 'LOW' },
        ],
      },
      {
        id: 'payg_contractor',
        name: 'PAYG 合同工',
        nameEn: 'PAYG Contractor',
        description: '合同工薪资结构',
        inputType: 'select',
        conditions: [
          { value: 'daily_rate', label: '每日/时薪制 (Daily Rate)', riskLevel: 'LOW' },
          { value: 'fixed_term', label: '固定期限合同', riskLevel: 'MEDIUM' },
          { value: 'rolling_contract', label: '滚动合同', riskLevel: 'LOW' },
        ],
      },
      {
        id: 'se_abn_age',
        name: '自雇 ABN 时长',
        nameEn: 'Self-Employed ABN Age',
        description: 'ABN 注册时长',
        inputType: 'select',
        conditions: [
          { value: 'less_than_6_months', label: '< 6个月', riskLevel: 'STOP' },
          { value: '6_to_12_months', label: '6-12个月', riskLevel: 'STOP' },
          { value: '12_to_18_months', label: '12-18个月', riskLevel: 'MEDIUM' },
          { value: '18_to_24_months', label: '18-24个月', riskLevel: 'MEDIUM' },
          { value: 'more_than_24_months', label: '> 24个月', riskLevel: 'LOW' },
        ],
      },
      {
        id: 'se_income_variance',
        name: '自雇收入波动',
        nameEn: 'Self-Employed Income Variance',
        description: '最近一年与上一年收入对比',
        inputType: 'select',
        conditions: [
          { value: 'increase_over_20', label: '增长 > 20%', riskLevel: 'MEDIUM' },
          { value: 'stable', label: '稳定 (±20%以内)', riskLevel: 'LOW' },
          { value: 'decrease_over_20', label: '下跌 > 20%', riskLevel: 'STOP' },
        ],
      },
      {
        id: 'se_gst_status',
        name: '自雇 GST 注册状态',
        nameEn: 'Self-Employed GST Registration',
        description: 'GST 注册情况及 BAS 提交记录',
        inputType: 'select',
        conditions: [
          { value: 'registered_active', label: 'GST 已注册且活跃 (有 BAS 记录)', riskLevel: 'LOW' },
          { value: 'registered_no_bas_under_12m', label: 'GST 已注册但无 BAS < 12个月', riskLevel: 'MEDIUM' },
          { value: 'registered_no_bas_over_12m', label: 'GST 已注册但超过12个月无 BAS', riskLevel: 'HIGH' },
          { value: 'not_registered_under_75k', label: '未注册 GST (营业额 < $75k)', riskLevel: 'MEDIUM' },
          { value: 'not_registered_over_75k', label: '未注册 GST (营业额 > $75k)', riskLevel: 'STOP' },
          { value: 'cancelled', label: 'GST 注册已取消', riskLevel: 'STOP' },
        ],
      },
      {
        id: 'visa_status',
        name: '签证状态',
        nameEn: 'Visa Status',
        description: '申请人签证类型',
        inputType: 'select',
        conditions: [
          { value: 'citizen', label: '公民 (Citizen)', riskLevel: 'LOW' },
          { value: 'pr', label: '永久居民 (PR)', riskLevel: 'LOW' },
          { value: 'tr_485', label: 'TR 485 (毕业生签证)', riskLevel: 'MEDIUM' },
          { value: 'tr_482', label: 'TR 482 (雇主担保)', riskLevel: 'MEDIUM' },
          { value: 'tr_491', label: 'TR 491 (偏远地区)', riskLevel: 'MEDIUM' },
          { value: 'student', label: '学生签证', riskLevel: 'HIGH' },
          { value: 'partner_820', label: 'Partner 820', riskLevel: 'MEDIUM' },
          { value: 'other', label: '其他签证', riskLevel: 'HIGH' },
        ],
      },
    ],
  },
  {
    id: 'INCOME_SERVICING',
    name: '收入与偿付能力',
    nameEn: 'Income & Servicing',
    description: '决定贷多少钱 (Capacity) 的核心',
    factors: [
      {
        id: 'overtime_bonus',
        name: '加班费/奖金',
        nameEn: 'Overtime/Bonus',
        description: '加班费或奖金的稳定性',
        inputType: 'select',
        conditions: [
          { value: 'regular', label: '经常性 (Regular)', riskLevel: 'LOW' },
          { value: 'occasional', label: '偶尔性', riskLevel: 'MEDIUM' },
          { value: 'one_off', label: '一次性', riskLevel: 'HIGH' },
        ],
      },
      {
        id: 'rental_income',
        name: '租金收入',
        nameEn: 'Rental Income',
        description: '租金收入类型',
        inputType: 'select',
        conditions: [
          { value: 'existing_tenant', label: '现有租约', riskLevel: 'LOW' },
          { value: 'proposed_rental', label: '拟租金 (Proposed)', riskLevel: 'MEDIUM' },
          { value: 'rooming_house', label: '分租房 (Rooming House)', riskLevel: 'MEDIUM' },
          { value: 'airbnb', label: 'Airbnb/短租', riskLevel: 'HIGH' },
        ],
      },
      {
        id: 'hecs_help',
        name: 'HECS/HELP 助学贷款',
        nameEn: 'HECS/HELP Debt',
        description: '助学贷款余额情况',
        inputType: 'select',
        conditions: [
          { value: 'none', label: '无余额', riskLevel: 'LOW' },
          { value: 'under_10k', label: '< $10,000', riskLevel: 'MEDIUM' },
          { value: '10k_to_30k', label: '$10,000 - $30,000', riskLevel: 'MEDIUM' },
          { value: 'over_30k', label: '> $30,000', riskLevel: 'HIGH' },
        ],
      },
      {
        id: 'living_expenses',
        name: '生活费申报',
        nameEn: 'Living Expenses',
        description: '申报的生活费相对于 HEM 基准',
        inputType: 'select',
        conditions: [
          { value: 'above_hem', label: '高于 HEM', riskLevel: 'LOW' },
          { value: 'at_hem', label: '接近 HEM', riskLevel: 'LOW' },
          { value: 'below_hem', label: '低于 HEM', riskLevel: 'MEDIUM' },
        ],
      },
      {
        id: 'child_maintenance',
        name: '子女抚养费',
        nameEn: 'Child Maintenance',
        description: '是否有支付抚养费义务',
        inputType: 'select',
        conditions: [
          { value: 'none', label: '无', riskLevel: 'LOW' },
          { value: 'paying', label: '需支付', riskLevel: 'STOP' },
          { value: 'receiving', label: '收取中', riskLevel: 'LOW' },
        ],
      },
      {
        id: 'other_income',
        name: '其他收入',
        nameEn: 'Other Income',
        description: '其他收入来源描述',
        inputType: 'text',
        placeholder: '描述其他收入来源及金额...',
      },
    ],
  },
  {
    id: 'FUNDS_DEPOSIT',
    name: '资金准备',
    nameEn: 'Funds to Complete & Deposit',
    description: '首付来源合规性检查',
    factors: [
      {
        id: 'genuine_savings',
        name: '真实存款',
        nameEn: 'Genuine Savings',
        description: 'LVR > 90% 时的真实存款情况',
        inputType: 'select',
        conditions: [
          { value: 'has_5_percent_3_months', label: '有 5% 存满 3 个月', riskLevel: 'LOW' },
          { value: 'rent_as_savings', label: '租房记录代替 (12个月)', riskLevel: 'MEDIUM' },
          { value: 'no_genuine_savings', label: '无真实存款', riskLevel: 'STOP' },
        ],
      },
      {
        id: 'gifted_funds',
        name: '赠与资金',
        nameEn: 'Gifted Funds',
        description: '赠与资金情况',
        inputType: 'select',
        conditions: [
          { value: 'none', label: '无赠与', riskLevel: 'LOW' },
          { value: 'non_refundable', label: '不可退还赠与 (Non-refundable)', riskLevel: 'LOW' },
          { value: 'repayable', label: '需偿还赠与 (Repayable)', riskLevel: 'HIGH' },
        ],
      },
      {
        id: 'deposit_source',
        name: '首付来源',
        nameEn: 'Deposit Source',
        description: '首付资金来源',
        inputType: 'select',
        conditions: [
          { value: 'savings', label: '个人储蓄', riskLevel: 'LOW' },
          { value: 'equity', label: '房产增值 (Equity)', riskLevel: 'LOW' },
          { value: 'gift', label: '亲友赠与', riskLevel: 'MEDIUM' },
          { value: 'crypto', label: '加密货币收益', riskLevel: 'HIGH' },
          { value: 'overseas', label: '海外资金', riskLevel: 'HIGH' },
          { value: 'unexplained_cash', label: '无法解释的现金', riskLevel: 'STOP' },
        ],
      },
      {
        id: 'large_deposits',
        name: '大额存入',
        nameEn: 'Large Cash Deposits',
        description: '近期大额现金存入情况',
        inputType: 'select',
        conditions: [
          { value: 'none', label: '无大额存入', riskLevel: 'LOW' },
          { value: 'explained', label: '有大额存入但可解释', riskLevel: 'MEDIUM' },
          { value: 'unexplained', label: '无法解释来源', riskLevel: 'STOP' },
        ],
      },
    ],
  },
  {
    id: 'CREDIT_CHARACTER',
    name: '信用与品格',
    nameEn: 'Credit & Character',
    description: '银行批不批的底线',
    factors: [
      {
        id: 'credit_score',
        name: '信用分',
        nameEn: 'Credit Score (Equifax)',
        description: 'Equifax 信用分数',
        inputType: 'select',
        conditions: [
          { value: 'excellent', label: '> 800 (优秀)', riskLevel: 'LOW' },
          { value: 'good', label: '700-800 (良好)', riskLevel: 'LOW' },
          { value: 'average', label: '500-700 (一般)', riskLevel: 'MEDIUM' },
          { value: 'poor', label: '< 500 (较差)', riskLevel: 'STOP' },
        ],
      },
      {
        id: 'credit_enquiries',
        name: '信用查询记录',
        nameEn: 'Credit Enquiries',
        description: '过去30天内的信用查询次数',
        inputType: 'select',
        conditions: [
          { value: 'none', label: '无查询', riskLevel: 'LOW' },
          { value: '1_to_2', label: '1-2 次', riskLevel: 'LOW' },
          { value: '3_plus', label: '> 3 次', riskLevel: 'MEDIUM' },
        ],
      },
      {
        id: 'defaults',
        name: '违约记录',
        nameEn: 'Defaults',
        description: '违约记录情况',
        inputType: 'select',
        conditions: [
          { value: 'none', label: '无违约', riskLevel: 'LOW' },
          { value: 'telco_under_1k_paid', label: '电信/水电 < $1000 (已付清)', riskLevel: 'MEDIUM' },
          { value: 'telco_under_1k_unpaid', label: '电信/水电 < $1000 (未付清)', riskLevel: 'HIGH' },
          { value: 'financial_default', label: '金融机构违约', riskLevel: 'STOP' },
        ],
      },
      {
        id: 'payday_lenders',
        name: '小额高利贷',
        nameEn: 'Payday Lenders',
        description: '是否有小额贷款记录 (如 Cash Converters)',
        inputType: 'select',
        conditions: [
          { value: 'none', label: '无记录', riskLevel: 'LOW' },
          { value: 'over_3_months_ago', label: '3个月前有记录', riskLevel: 'HIGH' },
          { value: 'recent', label: '近期有记录', riskLevel: 'STOP' },
        ],
      },
      {
        id: 'ato_debt',
        name: 'ATO 欠款',
        nameEn: 'ATO Debt',
        description: '税务局欠款情况',
        inputType: 'select',
        conditions: [
          { value: 'none', label: '无欠款', riskLevel: 'LOW' },
          { value: 'payment_plan', label: '有欠款但在还款计划中', riskLevel: 'HIGH' },
          { value: 'outstanding', label: '有未结清欠款', riskLevel: 'STOP' },
        ],
      },
      {
        id: 'bankruptcy',
        name: '破产记录',
        nameEn: 'Bankruptcy',
        description: '破产或债务协议历史',
        inputType: 'select',
        conditions: [
          { value: 'none', label: '无记录', riskLevel: 'LOW' },
          { value: 'discharged_over_2_years', label: '解除超过2年', riskLevel: 'HIGH' },
          { value: 'discharged_under_2_years', label: '解除不足2年', riskLevel: 'STOP' },
          { value: 'current', label: '当前破产中', riskLevel: 'STOP' },
        ],
      },
    ],
  },
  {
    id: 'COLLATERAL',
    name: '抵押物',
    nameEn: 'Security / Collateral',
    description: '房子本身能不能抵押',
    factors: [
      {
        id: 'apartment_size',
        name: '公寓面积',
        nameEn: 'Apartment Size',
        description: '公寓内部面积 (sqm)',
        inputType: 'select',
        conditions: [
          { value: 'over_50', label: '> 50 sqm', riskLevel: 'LOW' },
          { value: '40_to_50', label: '40-50 sqm', riskLevel: 'MEDIUM' },
          { value: 'under_40', label: '< 40 sqm', riskLevel: 'STOP' },
          { value: 'not_apartment', label: '非公寓 (N/A)', riskLevel: 'LOW' },
        ],
      },
      {
        id: 'location_postcode',
        name: '区域限制',
        nameEn: 'Location/Postcode',
        description: '物业所在区域是否在银行黑名单',
        inputType: 'select',
        conditions: [
          { value: 'no_restriction', label: '无限制', riskLevel: 'LOW' },
          { value: 'watchlist', label: '在观察名单 (Watchlist)', riskLevel: 'MEDIUM' },
          { value: 'restricted', label: '受限区域', riskLevel: 'HIGH' },
        ],
      },
      {
        id: 'property_type',
        name: '物业类型',
        nameEn: 'Property Type',
        description: '物业类型',
        inputType: 'select',
        conditions: [
          { value: 'house', label: 'House', riskLevel: 'LOW' },
          { value: 'townhouse', label: 'Townhouse', riskLevel: 'LOW' },
          { value: 'apartment', label: 'Apartment', riskLevel: 'LOW' },
          { value: 'unit', label: 'Unit', riskLevel: 'LOW' },
          { value: 'land', label: 'Land Only', riskLevel: 'MEDIUM' },
          { value: 'off_the_plan', label: 'Off-the-plan (楼花)', riskLevel: 'MEDIUM' },
          { value: 'rural', label: 'Rural/农村', riskLevel: 'HIGH' },
          { value: 'commercial', label: 'Commercial', riskLevel: 'HIGH' },
        ],
      },
      {
        id: 'property_condition',
        name: '房况',
        nameEn: 'Property Condition',
        description: '物业状况',
        inputType: 'select',
        conditions: [
          { value: 'good', label: '良好/可居住', riskLevel: 'LOW' },
          { value: 'needs_renovation', label: '需装修', riskLevel: 'MEDIUM' },
          { value: 'derelict', label: '无法居住 (Derelict)', riskLevel: 'STOP' },
        ],
      },
      {
        id: 'lvr',
        name: 'LVR',
        nameEn: 'Loan to Value Ratio',
        description: '贷款价值比',
        inputType: 'select',
        conditions: [
          { value: 'under_60', label: '< 60%', riskLevel: 'LOW' },
          { value: '60_to_80', label: '60-80%', riskLevel: 'LOW' },
          { value: '80_to_90', label: '80-90%', riskLevel: 'MEDIUM' },
          { value: '90_to_95', label: '90-95%', riskLevel: 'HIGH' },
          { value: 'over_95', label: '> 95%', riskLevel: 'STOP' },
        ],
      },
      {
        id: 'valuation_risk',
        name: '估价风险',
        nameEn: 'Valuation Risk',
        description: '估价相对于合同价的风险',
        inputType: 'select',
        conditions: [
          { value: 'at_contract', label: '预计等于合同价', riskLevel: 'LOW' },
          { value: 'slight_risk', label: '轻微短估风险', riskLevel: 'MEDIUM' },
          { value: 'high_risk', label: '高短估风险', riskLevel: 'HIGH' },
        ],
      },
    ],
  },
];

// 辅助函数：根据 category ID 获取 category
export function getCategoryById(categoryId: string): CategoryDefinition | undefined {
  return EXPERT_SYSTEM_CATEGORIES.find(c => c.id === categoryId);
}

// 辅助函数：根据 factor ID 获取 factor（需要遍历所有 categories）
export function getFactorById(factorId: string): { category: CategoryDefinition; factor: FactorDefinition } | undefined {
  for (const category of EXPERT_SYSTEM_CATEGORIES) {
    const factor = category.factors.find(f => f.id === factorId);
    if (factor) {
      return { category, factor };
    }
  }
  return undefined;
}

// 辅助函数：获取条件的风险等级
export function getConditionRiskLevel(factorId: string, conditionValue: string): string | undefined {
  const result = getFactorById(factorId);
  if (!result || result.factor.inputType !== 'select') return undefined;
  const condition = result.factor.conditions?.find(c => c.value === conditionValue);
  return condition?.riskLevel;
}
