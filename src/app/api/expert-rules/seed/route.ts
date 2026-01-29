import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { SEED_DATA_PART2 } from "./seed-data-part2";
import { SEED_DATA_PART3 } from "./seed-data-part3";

// Create authenticated Supabase client with email/password
async function createAuthenticatedClient(email: string, password: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Authentication failed: ${error.message}`);
  }

  return supabase;
}

interface SeedRequestBody {
  email: string;
  password: string;
}

// 单因子规则种子数据 Part 1 - BORROWER_PROFILE
const SEED_DATA_PART1 = [
  // ==================== BORROWER_PROFILE ====================
  // payg_fulltime
  {
    category: "BORROWER_PROFILE",
    factor: "payg_fulltime",
    risk_level: "LOW",
    scenario: "permanent_passed",
    expert_reasoning: "永久全职且已过试用期是最理想的就业状态。收入稳定可预测，银行可以100%认可基本工资。这类客户是所有银行的首选目标客户群。",
    solutions: "标准流程处理即可。确保提供最近一期工资单和雇主信即可。可以争取最优利率。",
    friendly_lenders: ["CBA", "ANZ", "Westpac", "NAB"],
    avoid_lenders: [],
    friendly_lenders_reason: "四大银行对稳定就业的全职员工提供最优利率和最快审批",
    avoid_lenders_reason: "",
    required_documents: ["最近一期工资单", "雇主信 (Employment Letter)", "近3个月银行流水"],
    clarifying_questions: ["入职日期是什么时候?", "试用期是否已正式结束?"],
    confidence_level: "HIGH",
    source_notes: "银行标准政策",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "payg_fulltime",
    risk_level: "MEDIUM",
    scenario: "permanent_within",
    expert_reasoning: "试用期内的全职员工存在被解雇风险，银行担心收入不稳定。部分银行会拒绝，部分银行可接受但可能限制LVR或要求额外条件。",
    solutions: "1. 等试用期结束后再申请（最稳妥）\n2. 选择接受试用期内申请的银行\n3. 提供同行业工作经验证明降低风险\n4. 如有担保人可增加获批概率",
    friendly_lenders: ["Macquarie", "ING", "Bankwest"],
    avoid_lenders: ["CBA", "Westpac"],
    friendly_lenders_reason: "这些银行对试用期内员工相对宽松，只要有稳定工作历史",
    avoid_lenders_reason: "四大中CBA和Westpac对试用期内员工较严格",
    required_documents: ["雇主信（需注明试用期结束日期）", "工资单", "前雇主工作证明"],
    clarifying_questions: ["试用期还有多久结束?", "之前的工作经历是什么?", "是否同行业跳槽?"],
    confidence_level: "HIGH",
    source_notes: "各银行政策对比",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "payg_fulltime",
    risk_level: "LOW",
    scenario: "fixed_term_long",
    expert_reasoning: "固定期限合同超过12个月，银行通常视同永久员工处理。合同期限足够长说明雇主有长期雇佣意向，收入可预测性高。",
    solutions: "按标准流程处理。确保合同复印件清晰显示合同期限。如果是政府或大型企业的固定期限合同，可以争取更好条件。",
    friendly_lenders: ["CBA", "ANZ", "Westpac", "NAB", "Macquarie"],
    avoid_lenders: [],
    friendly_lenders_reason: "长期固定合同被大多数银行接受",
    avoid_lenders_reason: "",
    required_documents: ["雇佣合同复印件", "工资单", "雇主信"],
    clarifying_questions: ["合同到期后是否有续约可能?", "之前合同是否有续约历史?"],
    confidence_level: "HIGH",
    source_notes: "银行标准政策",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "payg_fulltime",
    risk_level: "MEDIUM",
    scenario: "fixed_term_short",
    expert_reasoning: "固定期限合同少于12个月，银行担心合同到期后收入中断。需要额外证明续约可能性或有其他收入来源。",
    solutions: "1. 获取雇主续约意向书\n2. 提供历史续约记录（如之前合同都有续约）\n3. 选择对短期合同友好的银行\n4. 降低LVR以降低风险",
    friendly_lenders: ["ING", "Suncorp"],
    avoid_lenders: ["CBA", "ANZ"],
    friendly_lenders_reason: "ING和Suncorp对短期合同有一定灵活度",
    avoid_lenders_reason: "四大银行对短期合同较谨慎",
    required_documents: ["雇佣合同", "续约意向书（如有）", "过往合同续约记录"],
    clarifying_questions: ["这是第几次续约?", "雇主是否有长期雇佣计划?", "行业是否稳定?"],
    confidence_level: "HIGH",
    source_notes: "银行政策及BDM反馈",
  },

  // payg_casual
  {
    category: "BORROWER_PROFILE",
    factor: "payg_casual",
    risk_level: "STOP",
    scenario: "less_than_3_months",
    expert_reasoning: "临时工入职不足3个月，银行无法评估收入稳定性。Casual没有固定工时保障，入职时间太短无法建立收入模式。这是几乎所有银行的硬性拒绝条件。",
    solutions: "1. 等待入职满6个月后再申请\n2. 如有紧急需求，考虑Private Lender但利率极高\n3. 找有稳定收入的担保人\n4. 考虑是否能转为Part-time或Full-time",
    friendly_lenders: [],
    avoid_lenders: ["CBA", "ANZ", "Westpac", "NAB", "Macquarie", "ING"],
    friendly_lenders_reason: "",
    avoid_lenders_reason: "所有主流银行都要求Casual至少6个月工作历史",
    required_documents: [],
    clarifying_questions: ["有没有可能转为永久员工?", "之前的工作经历是什么?", "是否有其他收入来源?"],
    confidence_level: "HIGH",
    source_notes: "银行硬性政策",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "payg_casual",
    risk_level: "MEDIUM",
    scenario: "3_to_6_months",
    expert_reasoning: "临时工入职3-6个月处于灰色地带。部分银行可接受但会打折认可收入（通常认可80%），且可能限制LVR。需要证明工时稳定。",
    solutions: "1. 提供完整的工资单显示稳定工时\n2. 获取雇主信确认持续雇佣意向\n3. 选择对Casual友好的银行\n4. 准备好解释为何是Casual而非永久员工",
    friendly_lenders: ["Macquarie", "Suncorp", "Bankwest"],
    avoid_lenders: ["CBA", "Westpac"],
    friendly_lenders_reason: "这些银行对3-6个月Casual有一定接受度",
    avoid_lenders_reason: "CBA和Westpac通常要求满6个月",
    required_documents: ["近3个月完整工资单", "雇主信", "银行流水显示工资入账"],
    clarifying_questions: ["每周工时是否稳定?", "雇主是否有转永久的计划?", "同一雇主工作多久了?"],
    confidence_level: "MEDIUM",
    source_notes: "BDM反馈及实际案例",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "payg_casual",
    risk_level: "LOW",
    scenario: "more_than_6_months",
    expert_reasoning: "临时工入职超过6个月，大部分银行可接受。但收入认可通常会打折（80-100%），具体取决于工时稳定性和银行政策。",
    solutions: "1. 提供完整的工作历史记录\n2. 计算平均收入时剔除异常低的周\n3. 如工时非常稳定，可争取100%收入认可",
    friendly_lenders: ["CBA", "ANZ", "Westpac", "NAB", "Macquarie"],
    avoid_lenders: [],
    friendly_lenders_reason: "大部分银行接受6个月以上的Casual",
    avoid_lenders_reason: "",
    required_documents: ["近6个月完整工资单", "雇主信", "YTD收入证明"],
    clarifying_questions: ["工时是否有季节性波动?", "平均每周工作多少小时?"],
    confidence_level: "HIGH",
    source_notes: "银行标准政策",
  },

  // payg_contractor
  {
    category: "BORROWER_PROFILE",
    factor: "payg_contractor",
    risk_level: "LOW",
    scenario: "daily_rate",
    expert_reasoning: "Daily Rate合同工是专业人士常见的工作形式，尤其在IT、工程、医疗等行业。银行通常接受，按日薪x工作天数计算年收入。",
    solutions: "1. 提供合同显示日薪率\n2. 计算方式：日薪 x 5天 x 48周（扣除假期）\n3. 提供ABN和税务记录\n4. 如有多年contractor历史更有说服力",
    friendly_lenders: ["CBA", "ANZ", "Macquarie", "ING"],
    avoid_lenders: [],
    friendly_lenders_reason: "大银行对专业领域的Daily Rate contractor接受度高",
    avoid_lenders_reason: "",
    required_documents: ["合同（显示日薪率）", "近2年税务评估", "ABN注册证明", "发票记录"],
    clarifying_questions: ["从事什么行业?", "contractor工作多久了?", "合同是否有续约历史?"],
    confidence_level: "HIGH",
    source_notes: "银行政策",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "payg_contractor",
    risk_level: "MEDIUM",
    scenario: "fixed_term",
    expert_reasoning: "固定期限合同的contractor，银行会关注合同剩余时长和续约可能性。如果合同即将到期且无续约保障，风险较高。",
    solutions: "1. 确保合同剩余至少6个月\n2. 获取续约意向书\n3. 提供历史续约记录\n4. 展示行业需求（如IT人才紧缺）",
    friendly_lenders: ["Macquarie", "ING", "Suncorp"],
    avoid_lenders: ["Westpac"],
    friendly_lenders_reason: "这些银行对固定期限contractor有较好的理解",
    avoid_lenders_reason: "Westpac对contractor政策较严",
    required_documents: ["当前合同", "续约意向书", "过往合同记录", "税务评估"],
    clarifying_questions: ["合同还剩多久?", "之前续约过几次?", "行业前景如何?"],
    confidence_level: "MEDIUM",
    source_notes: "BDM反馈",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "payg_contractor",
    risk_level: "LOW",
    scenario: "rolling_contract",
    expert_reasoning: "滚动合同（Rolling Contract）是最稳定的contractor形式，自动续约除非一方提出终止。银行视同接近永久员工处理。",
    solutions: "按标准contractor流程处理。强调滚动合同的稳定性，提供合同条款说明自动续约机制。",
    friendly_lenders: ["CBA", "ANZ", "Westpac", "NAB", "Macquarie"],
    avoid_lenders: [],
    friendly_lenders_reason: "滚动合同被广泛接受",
    avoid_lenders_reason: "",
    required_documents: ["滚动合同", "近2年税务记录", "收入证明"],
    clarifying_questions: ["滚动合同持续多久了?", "有没有被终止的风险?"],
    confidence_level: "HIGH",
    source_notes: "银行标准政策",
  },

  // se_abn_age
  {
    category: "BORROWER_PROFILE",
    factor: "se_abn_age",
    risk_level: "STOP",
    scenario: "less_than_6_months",
    expert_reasoning: "ABN注册不足6个月，没有任何银行会批准贷款。无法证明业务可持续性，没有税务记录，收入完全不可预测。这是行业硬性规定。",
    solutions: "1. 等待ABN满12个月后再申请\n2. 如急需贷款，只能找Private Lender（利率10%+）\n3. 考虑找有稳定收入的担保人\n4. 如有PAYG收入可用PAYG申请",
    friendly_lenders: [],
    avoid_lenders: ["所有银行"],
    friendly_lenders_reason: "",
    avoid_lenders_reason: "没有银行接受ABN不足6个月的自雇申请",
    required_documents: [],
    clarifying_questions: ["ABN具体注册日期?", "之前是否有相关行业经验?", "是否有其他PAYG收入?"],
    confidence_level: "HIGH",
    source_notes: "行业硬性规定",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "se_abn_age",
    risk_level: "STOP",
    scenario: "6_to_12_months",
    expert_reasoning: "ABN 6-12个月仍然是高风险区。只有极少数Non-Bank Lender可能考虑，且需要非常强的其他条件支撑（如低LVR、大量存款）。Prime银行不会考虑。",
    solutions: "1. 等ABN满12个月（推荐）\n2. 尝试Low Doc产品（利率较高）\n3. 提供强有力的其他收入证明\n4. 大幅降低LVR至60%以下",
    friendly_lenders: ["Pepper Money", "Liberty"],
    avoid_lenders: ["CBA", "ANZ", "Westpac", "NAB"],
    friendly_lenders_reason: "Non-Prime Lender可能考虑，但条件苛刻",
    avoid_lenders_reason: "Prime银行不接受ABN不足12个月",
    required_documents: ["ABN注册证明", "所有BAS记录", "银行流水", "会计师信"],
    clarifying_questions: ["业务收入是否稳定增长?", "是否有行业相关经验?", "是否有大额存款?"],
    confidence_level: "HIGH",
    source_notes: "银行政策及Non-Bank Lender反馈",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "se_abn_age",
    risk_level: "MEDIUM",
    scenario: "12_to_18_months",
    expert_reasoning: "ABN 12-18个月开始有银行接受，但选择有限。通常需要Low Doc或Alt Doc产品，利率比标准产品高0.5-1%。需要强有力的收入证明。",
    solutions: "1. 准备完整的BAS记录\n2. 获取会计师出具的收入证明信\n3. 选择接受12个月ABN的银行\n4. 准备解释业务模式和收入来源",
    friendly_lenders: ["Macquarie", "ING", "Bankwest", "Pepper Money"],
    avoid_lenders: ["CBA", "Westpac"],
    friendly_lenders_reason: "这些银行有针对新自雇的产品",
    avoid_lenders_reason: "CBA和Westpac通常要求24个月ABN",
    required_documents: ["ABN注册证明", "12个月BAS", "会计师信", "银行流水", "税务评估（如有）"],
    clarifying_questions: ["业务是什么类型?", "收入是否稳定?", "是否有行业经验?"],
    confidence_level: "HIGH",
    source_notes: "银行政策对比",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "se_abn_age",
    risk_level: "MEDIUM",
    scenario: "18_to_24_months",
    expert_reasoning: "ABN 18-24个月，更多银行开始接受。可以申请Full Doc产品但需要完整的财务记录。仍有部分银行要求满24个月。",
    solutions: "1. 准备完整的税务记录\n2. 获取详细的会计师信\n3. 展示收入增长趋势\n4. 如收入波动大，准备解释",
    friendly_lenders: ["ANZ", "NAB", "Macquarie", "ING", "Suncorp"],
    avoid_lenders: ["CBA"],
    friendly_lenders_reason: "ANZ和NAB接受18个月ABN的Full Doc申请",
    avoid_lenders_reason: "CBA严格要求24个月",
    required_documents: ["2年税务评估", "BAS记录", "会计师信", "银行流水"],
    clarifying_questions: ["收入趋势是上升还是下降?", "业务是否有季节性?"],
    confidence_level: "HIGH",
    source_notes: "银行政策",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "se_abn_age",
    risk_level: "LOW",
    scenario: "more_than_24_months",
    expert_reasoning: "ABN超过24个月是自雇申请的标准门槛，所有Prime银行都接受。可以享受标准利率和完整的产品选择。",
    solutions: "按标准自雇流程处理。确保税务记录完整，收入计算准确。可以争取与PAYG相同的利率。",
    friendly_lenders: ["CBA", "ANZ", "Westpac", "NAB", "Macquarie", "ING"],
    avoid_lenders: [],
    friendly_lenders_reason: "所有主流银行接受24个月以上ABN",
    avoid_lenders_reason: "",
    required_documents: ["2年完整税务评估", "BAS记录", "会计师信", "公司财务报表（如适用）"],
    clarifying_questions: ["收入是否稳定?", "是否有大额一次性收入需要剔除?"],
    confidence_level: "HIGH",
    source_notes: "银行标准政策",
  },

  // se_income_variance
  {
    category: "BORROWER_PROFILE",
    factor: "se_income_variance",
    risk_level: "MEDIUM",
    scenario: "increase_over_20",
    expert_reasoning: "自雇收入增长超过20%，银行会质疑增长是否可持续。可能只认可较低年份的收入，或取两年平均值。需要解释增长原因。",
    solutions: "1. 准备会计师信解释增长原因（如新客户、扩张）\n2. 提供支持增长的证据（新合同、订单）\n3. 使用最近3-6个月BAS证明增长趋势持续\n4. 接受银行可能只认可较低收入",
    friendly_lenders: ["Macquarie", "ING"],
    avoid_lenders: ["CBA", "Westpac"],
    friendly_lenders_reason: "Macquarie和ING对收入增长的自雇较灵活",
    avoid_lenders_reason: "CBA和Westpac倾向于用较低年份收入",
    required_documents: ["2年税务评估", "会计师信（解释增长原因）", "近期BAS", "新合同/订单证明"],
    clarifying_questions: ["增长的具体原因是什么?", "增长是否可持续?", "是否有新的大客户?"],
    confidence_level: "MEDIUM",
    source_notes: "BDM反馈",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "se_income_variance",
    risk_level: "LOW",
    scenario: "stable",
    expert_reasoning: "自雇收入稳定（波动在±20%以内）是银行最喜欢的情况。说明业务成熟稳定，可预测性强。可以使用两年平均值或最近一年收入。",
    solutions: "按标准自雇流程处理。强调收入稳定性是优势。可以争取最优条件。",
    friendly_lenders: ["CBA", "ANZ", "Westpac", "NAB", "Macquarie", "ING"],
    avoid_lenders: [],
    friendly_lenders_reason: "所有银行欢迎收入稳定的自雇客户",
    avoid_lenders_reason: "",
    required_documents: ["2年税务评估", "会计师信", "BAS记录"],
    clarifying_questions: ["收入是否有季节性波动?"],
    confidence_level: "HIGH",
    source_notes: "银行标准政策",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "se_income_variance",
    risk_level: "STOP",
    scenario: "decrease_over_20",
    expert_reasoning: "自雇收入下跌超过20%是严重警告信号。银行会担心业务在萎缩，下跌趋势可能持续。Prime银行通常会拒绝或要求强有力的解释。",
    solutions: "1. 提供会计师信详细解释下跌原因（如一次性费用、COVID影响）\n2. 使用最近BAS证明收入已恢复\n3. 如无法解释，考虑等待下一财年数据\n4. 转Non-Prime Lender但利率较高",
    friendly_lenders: ["Pepper Money", "Liberty"],
    avoid_lenders: ["CBA", "ANZ", "Westpac", "NAB"],
    friendly_lenders_reason: "Non-Prime Lender可能考虑，需要强解释",
    avoid_lenders_reason: "Prime银行对收入下跌非常敏感",
    required_documents: ["2年税务评估", "会计师信（详细解释下跌原因）", "近3个月BAS", "收入恢复证据"],
    clarifying_questions: ["下跌的具体原因是什么?", "是一次性因素还是持续性的?", "最近收入是否已恢复?"],
    confidence_level: "HIGH",
    source_notes: "银行政策及实际案例",
  },

  // visa_status
  {
    category: "BORROWER_PROFILE",
    factor: "visa_status",
    risk_level: "LOW",
    scenario: "citizen",
    expert_reasoning: "澳洲公民是最理想的申请人身份，无签证限制，可申请所有产品，享受最优条件。",
    solutions: "标准流程处理。无需额外文件或解释。",
    friendly_lenders: ["CBA", "ANZ", "Westpac", "NAB", "Macquarie", "ING"],
    avoid_lenders: [],
    friendly_lenders_reason: "所有银行欢迎公民申请",
    avoid_lenders_reason: "",
    required_documents: ["护照或公民证书"],
    clarifying_questions: [],
    confidence_level: "HIGH",
    source_notes: "标准政策",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "visa_status",
    risk_level: "LOW",
    scenario: "pr",
    expert_reasoning: "永久居民（PR）与公民待遇基本相同，可申请所有产品。唯一区别是部分银行可能要求PR已生效（非Bridging状态）。",
    solutions: "按标准流程处理。确保PR签证已生效，提供VEVO确认。",
    friendly_lenders: ["CBA", "ANZ", "Westpac", "NAB", "Macquarie", "ING"],
    avoid_lenders: [],
    friendly_lenders_reason: "PR与公民待遇相同",
    avoid_lenders_reason: "",
    required_documents: ["护照", "PR签证贴纸或ImmiCard", "VEVO确认"],
    clarifying_questions: ["PR什么时候批准的?", "是否还在Bridging Visa上?"],
    confidence_level: "HIGH",
    source_notes: "银行标准政策",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "visa_status",
    risk_level: "MEDIUM",
    scenario: "tr_485",
    expert_reasoning: "485毕业生签证有效期2-4年，银行担心签证到期后申请人可能离境。通常限制LVR在80%以下，部分银行要求签证剩余至少12个月。",
    solutions: "1. 选择接受485的银行\n2. 降低LVR至70-80%\n3. 提供PR申请证明（如已递交）\n4. 展示在澳长期定居意向",
    friendly_lenders: ["ANZ", "Westpac", "St George", "Macquarie"],
    avoid_lenders: ["CBA"],
    friendly_lenders_reason: "ANZ和Westpac对485相对友好，LVR上限80%",
    avoid_lenders_reason: "CBA对TR签证限制较多",
    required_documents: ["护照", "签证批准信", "VEVO确认", "PR申请确认（如有）"],
    clarifying_questions: ["签证还剩多久?", "是否已递交PR申请?", "485是2年还是4年的?"],
    confidence_level: "HIGH",
    source_notes: "各银行TR政策对比",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "visa_status",
    risk_level: "MEDIUM",
    scenario: "tr_482",
    expert_reasoning: "482雇主担保签证相对稳定，因为有雇主担保。但仍是临时签证，银行通常限制LVR在80%。签证续签依赖雇主。",
    solutions: "1. 提供雇主担保证明\n2. 确保签证剩余至少12个月\n3. 如已申请PR，提供确认信\n4. 选择对482友好的银行",
    friendly_lenders: ["ANZ", "Westpac", "NAB", "Macquarie"],
    avoid_lenders: ["CBA"],
    friendly_lenders_reason: "大部分银行接受482，因为有雇主担保",
    avoid_lenders_reason: "CBA对TR限制较严",
    required_documents: ["护照", "482签证", "雇主担保信", "PR申请确认（如有）"],
    clarifying_questions: ["雇主是否稳定?", "是否有PR pathway?", "签证剩余时间?"],
    confidence_level: "HIGH",
    source_notes: "银行政策",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "visa_status",
    risk_level: "MEDIUM",
    scenario: "tr_491",
    expert_reasoning: "491偏远地区签证有PR pathway但需要满足居住和工作要求。银行接受度中等，需要证明在偏远地区居住和工作。",
    solutions: "1. 提供偏远地区工作和居住证明\n2. 展示满足PR条件的进度\n3. 选择对491友好的银行\n4. LVR通常限制在80%",
    friendly_lenders: ["Suncorp", "Bendigo Bank", "Bank of Queensland"],
    avoid_lenders: ["CBA", "Westpac"],
    friendly_lenders_reason: "区域银行对偏远地区签证更友好",
    avoid_lenders_reason: "四大对491的接受度较低",
    required_documents: ["护照", "491签证", "偏远地区居住证明", "工作证明"],
    clarifying_questions: ["在偏远地区住了多久?", "PR申请进度如何?", "是否满足偏远地区工作要求?"],
    confidence_level: "MEDIUM",
    source_notes: "区域银行政策",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "visa_status",
    risk_level: "HIGH",
    scenario: "student",
    expert_reasoning: "学生签证是最难获批的签证类型之一。银行担心：1)签证短期 2)收入有限 3)毕业后可能离境。大部分银行不接受或要求极低LVR。",
    solutions: "1. 只有少数银行接受学生签证\n2. LVR通常限制在50-60%\n3. 需要有担保人或联名申请人\n4. 考虑等毕业后转485再申请",
    friendly_lenders: ["Bank of China Australia", "ICBC"],
    avoid_lenders: ["CBA", "ANZ", "Westpac", "NAB", "Macquarie"],
    friendly_lenders_reason: "中资银行对学生签证有特殊产品",
    avoid_lenders_reason: "主流银行基本不接受学生签证",
    required_documents: ["护照", "学生签证", "COE", "资金证明", "担保人材料"],
    clarifying_questions: ["还有多久毕业?", "毕业后计划是什么?", "是否有担保人?"],
    confidence_level: "HIGH",
    source_notes: "银行政策及中资银行产品",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "visa_status",
    risk_level: "MEDIUM",
    scenario: "partner_820",
    expert_reasoning: "Partner 820是配偶担保临时签证，通常2年后转PR。银行接受度中等，因为有明确的PR pathway。需要证明关系真实性。",
    solutions: "1. 提供PR pathway证明\n2. 选择接受820的银行\n3. LVR通常限制在80%\n4. 如配偶是PR/公民，可联名申请",
    friendly_lenders: ["ANZ", "Westpac", "NAB", "Macquarie"],
    avoid_lenders: ["CBA"],
    friendly_lenders_reason: "大部分银行接受820因为有清晰PR pathway",
    avoid_lenders_reason: "CBA对TR较谨慎",
    required_documents: ["护照", "820签证", "关系证明", "PR申请进度"],
    clarifying_questions: ["820什么时候批的?", "PR大概什么时候批?", "配偶是什么身份?"],
    confidence_level: "HIGH",
    source_notes: "银行政策",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "visa_status",
    risk_level: "HIGH",
    scenario: "other",
    expert_reasoning: "其他类型签证（如旅游签、打工度假签等）基本不被银行接受。这些签证太短期或不允许长期居住/工作。",
    solutions: "1. 了解签证具体类型和限制\n2. 大部分情况下无法获批\n3. 考虑等签证转换后再申请\n4. 可能需要海外收入证明和海外银行产品",
    friendly_lenders: [],
    avoid_lenders: ["CBA", "ANZ", "Westpac", "NAB", "Macquarie", "ING"],
    friendly_lenders_reason: "",
    avoid_lenders_reason: "主流银行不接受非工作/居住类签证",
    required_documents: ["护照", "签证详情"],
    clarifying_questions: ["具体是什么签证?", "签证允许的活动范围?", "有无转换签证的计划?"],
    confidence_level: "HIGH",
    source_notes: "银行政策",
  },
];

// Combine all seed data
const ALL_SEED_DATA = [...SEED_DATA_PART1, ...SEED_DATA_PART2, ...SEED_DATA_PART3];

export async function POST(request: Request) {
  try {
    const body: SeedRequestBody = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password", usage: "curl -X POST -H 'Content-Type: application/json' -d '{\"email\":\"your@email.com\",\"password\":\"yourpassword\"}' http://localhost:3000/api/expert-rules/seed" },
        { status: 400 }
      );
    }

    const supabase = await createAuthenticatedClient(email, password);

    // Check existing data count
    const { count: existingCount } = await supabase
      .from("expert_rules")
      .select("*", { count: "exact", head: true });

    // Insert seed data in batches to avoid timeout
    const batchSize = 30;
    let totalInserted = 0;

    for (let i = 0; i < ALL_SEED_DATA.length; i += batchSize) {
      const batch = ALL_SEED_DATA.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from("expert_rules")
        .insert(batch)
        .select();

      if (error) {
        return NextResponse.json({
          error: error.message,
          insertedSoFar: totalInserted,
          failedAt: i
        }, { status: 500 });
      }

      totalInserted += data.length;
    }

    return NextResponse.json({
      message: `Successfully seeded ${totalInserted} expert rules`,
      existingBefore: existingCount || 0,
      inserted: totalInserted,
      categories: ["BORROWER_PROFILE", "INCOME_SERVICING", "FUNDS_DEPOSIT", "CREDIT_CHARACTER", "COLLATERAL"],
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const password = searchParams.get("password");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password", usage: "curl 'http://localhost:3000/api/expert-rules/seed?email=your@email.com&password=yourpassword'" },
        { status: 400 }
      );
    }

    const supabase = await createAuthenticatedClient(email, password);

    const { count, error } = await supabase
      .from("expert_rules")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      currentCount: count || 0,
      seedDataCount: ALL_SEED_DATA.length,
      breakdown: {
        part1_borrower_profile: SEED_DATA_PART1.length,
        part2_income_funds: SEED_DATA_PART2.length,
        part3_credit_collateral: SEED_DATA_PART3.length,
      },
      categories: ["BORROWER_PROFILE", "INCOME_SERVICING", "FUNDS_DEPOSIT", "CREDIT_CHARACTER", "COLLATERAL"],
      message: "Use POST to insert seed data, DELETE to clear all data",
    });
  } catch (error) {
    console.error("Check seed status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body: SeedRequestBody = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password", usage: "curl -X DELETE -H 'Content-Type: application/json' -d '{\"email\":\"your@email.com\",\"password\":\"yourpassword\"}' http://localhost:3000/api/expert-rules/seed" },
        { status: 400 }
      );
    }

    const supabase = await createAuthenticatedClient(email, password);

    const { error } = await supabase
      .from("expert_rules")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Successfully cleared all expert rules",
    });
  } catch (error) {
    console.error("Clear error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
