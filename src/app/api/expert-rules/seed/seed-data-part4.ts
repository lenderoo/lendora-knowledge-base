// 单因子规则种子数据 Part 4 - 补充缺失的因子
// 包含: se_gst_status, location_postcode, property_condition, valuation_risk

export const SEED_DATA_PART4 = [
  // ==================== BORROWER_PROFILE ====================
  // se_gst_status (自雇GST注册状态)
  {
    category: "BORROWER_PROFILE",
    factor: "se_gst_status",
    risk_level: "LOW",
    scenario: "registered_active",
    expert_reasoning:
      "GST已注册且活跃（有定期BAS记录）是最理想的自雇状态。说明业务运营规范，收入可通过BAS交叉验证。银行可以根据BAS计算GST Turnover作为收入参考。",
    solutions:
      "标准自雇流程处理。提供近4个季度的BAS记录。BAS上的GST Turnover可帮助验证会计师信中的收入声明。",
    friendly_lenders: ["CBA", "ANZ", "Westpac", "NAB", "Macquarie", "ING"],
    avoid_lenders: [],
    friendly_lenders_reason: "活跃GST注册是自雇申请的标准要求",
    avoid_lenders_reason: "",
    required_documents: [
      "ABN注册证明",
      "近4个季度BAS",
      "会计师信",
      "2年税务评估",
    ],
    clarifying_questions: ["BAS是季度还是月度提交?", "GST Turnover与税务收入是否一致?"],
    confidence_level: "HIGH",
    source_notes: "银行标准政策",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "se_gst_status",
    risk_level: "MEDIUM",
    scenario: "registered_no_bas_under_12m",
    expert_reasoning:
      "GST已注册但无BAS记录不足12个月，可能是新注册或刚达到GST门槛。银行无法通过BAS验证收入，需要其他证据支持。",
    solutions:
      "1. 提供银行流水证明业务收入\n2. 获取会计师信详细说明情况\n3. 如业务刚达到$75k门槛，解释之前无需注册的原因\n4. 准备发票和合同证明收入",
    friendly_lenders: ["Macquarie", "ING"],
    avoid_lenders: ["CBA", "Westpac"],
    friendly_lenders_reason: "Macquarie和ING对新GST注册有一定接受度",
    avoid_lenders_reason: "CBA和Westpac通常要求有完整BAS记录",
    required_documents: [
      "ABN注册证明",
      "GST注册证明",
      "银行流水",
      "会计师信",
      "发票记录",
    ],
    clarifying_questions: [
      "GST是什么时候注册的?",
      "之前为什么没有BAS?",
      "有没有其他收入证明方式?",
    ],
    confidence_level: "MEDIUM",
    source_notes: "BDM反馈",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "se_gst_status",
    risk_level: "HIGH",
    scenario: "registered_no_bas_over_12m",
    expert_reasoning:
      "GST已注册但超过12个月无BAS记录是严重警告。可能暗示业务不活跃、逃税或ATO合规问题。银行会非常谨慎。",
    solutions:
      "1. 立即与会计师核实BAS提交状态\n2. 如有遗漏BAS需要补交\n3. 获取ATO账户确认函\n4. 准备详细解释信说明情况\n5. 可能需要考虑Non-Prime Lender",
    friendly_lenders: ["Pepper Money", "Liberty"],
    avoid_lenders: ["CBA", "ANZ", "Westpac", "NAB"],
    friendly_lenders_reason: "Non-Prime Lender可能考虑，需要强解释",
    avoid_lenders_reason: "Prime银行对BAS合规问题非常敏感",
    required_documents: [
      "ABN/GST注册证明",
      "ATO账户状态",
      "解释信",
      "补交的BAS（如有）",
    ],
    clarifying_questions: [
      "为什么超过12个月没有BAS?",
      "是否有ATO欠款或罚款?",
      "会计师是否知道这个情况?",
    ],
    confidence_level: "HIGH",
    source_notes: "银行政策",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "se_gst_status",
    risk_level: "MEDIUM",
    scenario: "not_registered_under_75k",
    expert_reasoning:
      "营业额低于$75,000无需注册GST是合法的。但银行无法通过BAS验证收入，需要其他方式证明。低营业额也可能影响Servicing。",
    solutions:
      "1. 提供完整税务评估证明收入\n2. 银行流水证明业务收入\n3. 会计师信确认无需注册GST\n4. 确保收入足够Servicing",
    friendly_lenders: ["Macquarie", "ING", "Suncorp"],
    avoid_lenders: ["Westpac"],
    friendly_lenders_reason: "这些银行接受无GST的低营业额自雇",
    avoid_lenders_reason: "Westpac通常偏好有GST的自雇客户",
    required_documents: [
      "ABN注册证明",
      "2年税务评估",
      "会计师信（确认营业额<$75k）",
      "银行流水",
    ],
    clarifying_questions: [
      "营业额是否在增长?",
      "是否计划注册GST?",
      "有无其他收入来源?",
    ],
    confidence_level: "HIGH",
    source_notes: "银行政策",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "se_gst_status",
    risk_level: "STOP",
    scenario: "not_registered_over_75k",
    expert_reasoning:
      "营业额超过$75,000但未注册GST是违反税法的。这是ATO合规问题，银行不会接受。需要立即解决GST注册问题。",
    solutions:
      "1. 立即注册GST（这是法律要求）\n2. 与会计师讨论补缴GST事宜\n3. 处理好合规问题后再申请贷款\n4. 可能有ATO罚款需要处理",
    friendly_lenders: [],
    avoid_lenders: ["所有银行"],
    friendly_lenders_reason: "",
    avoid_lenders_reason: "违反税法的客户没有银行会接受",
    required_documents: [],
    clarifying_questions: [
      "为什么没有注册GST?",
      "会计师知道这个情况吗?",
      "是否在处理合规问题?",
    ],
    confidence_level: "HIGH",
    source_notes: "法律规定",
  },
  {
    category: "BORROWER_PROFILE",
    factor: "se_gst_status",
    risk_level: "STOP",
    scenario: "cancelled",
    expert_reasoning:
      "GST注册被取消是严重问题，可能是因为业务停止、ATO处罚或合规问题。银行会认为业务不再活跃或有问题。",
    solutions:
      "1. 确认取消原因\n2. 如业务仍在运营，需要重新注册GST\n3. 如有ATO问题需要先解决\n4. 等GST恢复正常后再申请贷款",
    friendly_lenders: [],
    avoid_lenders: ["所有银行"],
    friendly_lenders_reason: "",
    avoid_lenders_reason: "GST被取消意味着业务或合规有严重问题",
    required_documents: ["GST取消原因说明", "ATO账户状态"],
    clarifying_questions: [
      "GST为什么被取消?",
      "业务是否仍在运营?",
      "是否计划重新注册?",
    ],
    confidence_level: "HIGH",
    source_notes: "银行政策",
  },

  // ==================== COLLATERAL ====================
  // location_postcode (区域限制)
  {
    category: "COLLATERAL",
    factor: "location_postcode",
    risk_level: "LOW",
    scenario: "no_restriction",
    expert_reasoning:
      "物业位于无限制区域，银行可以按标准政策处理。大部分城区和成熟郊区都属于此类。",
    solutions: "标准流程处理。无需额外关注区域问题。",
    friendly_lenders: ["CBA", "ANZ", "Westpac", "NAB", "Macquarie", "ING"],
    avoid_lenders: [],
    friendly_lenders_reason: "无限制区域所有银行都接受",
    avoid_lenders_reason: "",
    required_documents: ["物业地址"],
    clarifying_questions: [],
    confidence_level: "HIGH",
    source_notes: "标准政策",
  },
  {
    category: "COLLATERAL",
    factor: "location_postcode",
    risk_level: "MEDIUM",
    scenario: "watchlist",
    expert_reasoning:
      "物业位于银行观察名单区域。这些区域通常是高密度开发区（如Zetland, Docklands）、矿业服务城市（如Mackay, Gladstone）或快速变化的市场。银行可能限制LVR或需要额外审批。",
    solutions:
      "1. 确认具体银行的限制条件\n2. 可能需要降低LVR至80-85%\n3. 准备区域市场分析\n4. 选择对该区域无限制的银行\n5. 如是公寓，检查楼盘是否有额外限制",
    friendly_lenders: ["根据具体区域而定"],
    avoid_lenders: ["Westpac通常对观察名单区域最严格"],
    friendly_lenders_reason: "不同银行对不同区域有不同政策",
    avoid_lenders_reason: "Westpac的Postcode限制名单最长",
    required_documents: ["物业合同", "估价报告", "区域市场报告（如需要）"],
    clarifying_questions: [
      "具体是哪个suburb/postcode?",
      "是公寓还是House?",
      "该区域最近有什么变化?",
    ],
    confidence_level: "HIGH",
    source_notes: "银行Postcode限制政策",
  },
  {
    category: "COLLATERAL",
    factor: "location_postcode",
    risk_level: "HIGH",
    scenario: "restricted",
    expert_reasoning:
      "物业位于受限区域。典型例子包括：矿业小镇（Port Hedland, Moranbah）、高密度问题区域（Melbourne CBD, Docklands, Surfers Paradise）。银行可能大幅限制LVR（通常50-70%）或完全不接受。",
    solutions:
      "1. 确认哪些银行可以接受该区域\n2. 准备大幅降低LVR\n3. 可能需要更大首付\n4. 考虑区域性银行或Non-Prime Lender\n5. 了解限制原因（矿业波动/高密度/建筑问题）\n6. 评估是否值得在该区域购买",
    friendly_lenders: ["Pepper Money", "Liberty", "区域银行（如Suncorp）"],
    avoid_lenders: ["CBA", "Westpac", "ANZ", "NAB"],
    friendly_lenders_reason: "Non-Prime Lender可能考虑，但条件苛刻",
    avoid_lenders_reason: "Prime银行对受限区域可能完全不接受",
    required_documents: ["物业合同", "估价报告", "区域经济分析"],
    clarifying_questions: [
      "为什么选择这个区域?",
      "是自住还是投资?",
      "能接受更高利率吗?",
      "有充足首付吗?",
    ],
    confidence_level: "HIGH",
    source_notes: "银行Postcode限制政策",
  },

  // property_condition (房况)
  {
    category: "COLLATERAL",
    factor: "property_condition",
    risk_level: "LOW",
    scenario: "good",
    expert_reasoning:
      "物业状况良好，可立即居住。这是银行最喜欢的抵押物状态，估价最稳定，转售最容易。",
    solutions: "标准流程处理。",
    friendly_lenders: ["CBA", "ANZ", "Westpac", "NAB", "Macquarie", "ING"],
    avoid_lenders: [],
    friendly_lenders_reason: "良好状况物业所有银行都接受",
    avoid_lenders_reason: "",
    required_documents: ["物业合同", "估价报告"],
    clarifying_questions: [],
    confidence_level: "HIGH",
    source_notes: "标准政策",
  },
  {
    category: "COLLATERAL",
    factor: "property_condition",
    risk_level: "MEDIUM",
    scenario: "needs_renovation",
    expert_reasoning:
      "物业需要装修但仍可居住。估价可能反映当前状况而非装修后价值。银行可能基于现状估价，影响LVR计算。部分银行有装修贷款产品。",
    solutions:
      "1. 获取「As Is」和「完工后」两种估价\n2. 考虑Construction Loan产品\n3. 准备装修计划和预算\n4. 确保有足够资金完成装修\n5. 选择有装修贷款产品的银行",
    friendly_lenders: ["CBA", "NAB", "Macquarie"],
    avoid_lenders: [],
    friendly_lenders_reason: "CBA和NAB有较好的装修贷款产品",
    avoid_lenders_reason: "",
    required_documents: ["物业合同", "估价报告", "装修计划", "装修报价"],
    clarifying_questions: [
      "装修范围多大?",
      "预算是多少?",
      "谁来做装修（DIY还是请builder）?",
      "装修后打算自住还是出租?",
    ],
    confidence_level: "HIGH",
    source_notes: "银行装修贷款政策",
  },
  {
    category: "COLLATERAL",
    factor: "property_condition",
    risk_level: "STOP",
    scenario: "derelict",
    expert_reasoning:
      "物业无法居住（Derelict/Uninhabitable）。这类物业银行通常不接受作为抵押物，因为：1)无法准确估价 2)无法出租产生收入 3)存在安全隐患 4)转售困难。",
    solutions:
      "1. 需要Construction Loan而非标准房贷\n2. 需要完整的建筑计划和DA批准\n3. 需要有资质的Builder\n4. 资金分阶段释放\n5. 考虑专门的Renovation Lender",
    friendly_lenders: [],
    avoid_lenders: ["所有标准房贷产品"],
    friendly_lenders_reason: "",
    avoid_lenders_reason: "标准房贷不接受无法居住的物业",
    required_documents: ["物业详情", "建筑计划", "DA批准", "Builder报价"],
    clarifying_questions: [
      "有没有DA批准?",
      "有没有选定Builder?",
      "总预算是多少?",
      "资金来源是什么?",
    ],
    confidence_level: "HIGH",
    source_notes: "银行政策",
  },

  // valuation_risk (估价风险)
  {
    category: "COLLATERAL",
    factor: "valuation_risk",
    risk_level: "LOW",
    scenario: "at_contract",
    expert_reasoning:
      "预计估价等于或高于合同价。这是最理想的情况，说明购买价格合理，贷款可以按计划进行。",
    solutions: "标准流程处理。",
    friendly_lenders: ["CBA", "ANZ", "Westpac", "NAB", "Macquarie", "ING"],
    avoid_lenders: [],
    friendly_lenders_reason: "合理估价所有银行都接受",
    avoid_lenders_reason: "",
    required_documents: ["物业合同"],
    clarifying_questions: [],
    confidence_level: "HIGH",
    source_notes: "标准政策",
  },
  {
    category: "COLLATERAL",
    factor: "valuation_risk",
    risk_level: "MEDIUM",
    scenario: "slight_risk",
    expert_reasoning:
      "有轻微短估风险（估价可能低于合同价5-10%）。常见于：1)热门市场竞价购买 2)楼花交付时市场下跌 3)独特物业缺少可比销售。需要准备应对方案。",
    solutions:
      "1. 准备额外5-10%资金以防短估\n2. 收集同区域近期成交案例支持价格\n3. 如发生短估，可以挑战估价\n4. 考虑换银行获取更高估价\n5. 与卖家协商价格（如可能）",
    friendly_lenders: ["根据具体物业类型而定"],
    avoid_lenders: [],
    friendly_lenders_reason: "不同银行使用不同估价师，结果可能不同",
    avoid_lenders_reason: "",
    required_documents: ["物业合同", "同区域销售案例", "物业独特性说明"],
    clarifying_questions: [
      "为什么可能短估?",
      "有没有准备额外资金?",
      "购买价格是如何确定的?",
    ],
    confidence_level: "MEDIUM",
    source_notes: "实际经验",
  },
  {
    category: "COLLATERAL",
    factor: "valuation_risk",
    risk_level: "HIGH",
    scenario: "high_risk",
    expert_reasoning:
      "高短估风险（估价可能低于合同价10%以上）。常见于：1)楼花市场明显下跌 2)过度竞价购买 3)卖家市场虚高价格 4)独特物业无可比性。需要认真评估交易可行性。",
    solutions:
      "1. 准备大量额外资金（10-20%）\n2. 重新评估交易是否值得\n3. 与卖家重新议价\n4. 考虑放弃交易（如有冷静期）\n5. 如是楼花，检查合同是否有sunset clause\n6. 多家银行估价，选择最高的",
    friendly_lenders: [],
    avoid_lenders: [],
    friendly_lenders_reason: "所有银行都基于估价而非合同价放款",
    avoid_lenders_reason: "",
    required_documents: ["物业合同", "市场分析", "资金证明"],
    clarifying_questions: [
      "有多少额外资金?",
      "合同是否可以撤销?",
      "能否与卖家重新议价?",
      "为什么愿意付这个价格?",
    ],
    confidence_level: "HIGH",
    source_notes: "实际经验及BDM反馈",
  },

  // ==================== property_type (物业类型) ====================
  {
    category: "COLLATERAL",
    factor: "property_type",
    risk_level: "LOW",
    scenario: "unit",
    expert_reasoning:
      "Unit通常指较老式的低层公寓或联排式物业，与现代高层Apartment不同。银行对Unit的接受度通常较好，因为：1)建筑密度较低 2)通常有独立产权 3)维护费用较低 4)市场流动性好。但需注意区分Unit和Apartment，部分银行对面积要求同样适用于Unit。",
    solutions:
      "1. 确认内部面积是否满足银行最低要求（通常40-50sqm）\n2. 检查是否有Strata Title\n3. 确认Body Corporate费用合理\n4. 标准流程处理",
    friendly_lenders: ["CBA", "ANZ", "Westpac", "NAB", "Macquarie", "ING"],
    avoid_lenders: [],
    friendly_lenders_reason: "所有主流银行都接受符合面积要求的Unit",
    avoid_lenders_reason: "",
    required_documents: [
      "物业合同",
      "Strata Report（如适用）",
      "物业面积证明",
    ],
    clarifying_questions: [
      "Unit的内部面积是多少?",
      "是几层楼的建筑?",
      "Body Corporate费用是多少?",
    ],
    confidence_level: "HIGH",
    source_notes: "银行标准政策",
  },
  {
    category: "COLLATERAL",
    factor: "property_type",
    risk_level: "MEDIUM",
    scenario: "land",
    expert_reasoning:
      "纯土地（Vacant Land）贷款与建好的物业贷款有本质区别：1)没有房屋作为抵押物，风险较高 2)LVR通常限制在80%以下 3)需要更高首付 4)银行会关注土地用途和建房计划 5)部分银行要求在一定期限内开始建设。",
    solutions:
      "1. 准备至少20%首付（部分银行要求更多）\n2. 准备建房计划说明购买目的\n3. 确认土地Zoning允许住宅建设\n4. 检查土地是否有特殊限制（如heritage overlay）\n5. 考虑Land & Construction Loan打包产品\n6. 选择对土地贷款友好的银行",
    friendly_lenders: ["CBA", "NAB", "Macquarie", "Suncorp"],
    avoid_lenders: ["部分银行对纯土地有更严格限制"],
    friendly_lenders_reason: "CBA和NAB有较好的土地贷款产品，Macquarie对投资者友好",
    avoid_lenders_reason: "部分银行对土地贷款LVR限制更严（如最高70%）",
    required_documents: [
      "土地合同",
      "Council Zoning证明",
      "土地测量图",
      "建房计划或意向说明",
      "资金证明（首付）",
    ],
    clarifying_questions: [
      "土地面积多大?",
      "计划什么时候建房?",
      "有没有选定Builder?",
      "土地的Zoning是什么?",
      "是否有任何限制（如bushfire zone, heritage）?",
    ],
    confidence_level: "HIGH",
    source_notes: "银行土地贷款政策",
  },
  {
    category: "COLLATERAL",
    factor: "property_type",
    risk_level: "HIGH",
    scenario: "rural",
    expert_reasoning:
      "农村/偏远地区物业面临多重风险：1)市场流动性差，转售困难 2)估价缺乏可比案例 3)收入来源可能不稳定（如依赖农业） 4)部分银行对特定区域有postcode限制 5)土地面积过大（>2公顷）可能被视为lifestyle property而非标准住宅",
    solutions:
      "1. 确认土地面积是否在银行接受范围内（通常<2公顷/5英亩）\n2. 检查物业是否有标准住宅（不是棚屋或移动房屋）\n3. 选择对农村物业友好的银行（Suncorp, AMP, 区域银行）\n4. 准备降低LVR至70-80%\n5. 提供当地房产销售证据支持估价\n6. 确认收入来源稳定",
    friendly_lenders: ["Suncorp", "AMP", "Bendigo Bank", "Bank of Queensland"],
    avoid_lenders: ["Westpac", "CBA（对偏远区域限制）"],
    friendly_lenders_reason: "区域银行对农村物业接受度较高，有专门的农村贷款产品",
    avoid_lenders_reason: "大银行对偏远区域和大面积土地有严格限制",
    required_documents: [
      "物业合同",
      "土地证明（面积、用途分区）",
      "物业照片（住宅部分）",
      "当地销售数据",
      "收入证明（如从事农业）",
    ],
    clarifying_questions: [
      "土地面积多大?",
      "物业的主要用途是什么（自住还是农业生产）?",
      "最近的城镇有多远?",
      "物业上有什么建筑?",
      "是否有稳定的非农收入?",
    ],
    confidence_level: "HIGH",
    source_notes: "银行农村物业政策及BDM反馈",
  },
  {
    category: "COLLATERAL",
    factor: "property_type",
    risk_level: "HIGH",
    scenario: "commercial",
    expert_reasoning:
      "商业物业不适用标准住宅贷款，需要专门的商业贷款产品。常见误区：1)楼下商铺楼上住宅的混合用途物业 2)带商业租约的物业 3)Zoning为商业但用作住宅。这些都会导致标准房贷被拒。",
    solutions:
      "1. 确认物业Zoning（分区用途）\n2. 如是混合用途，确认住宅面积占比（通常需>50%才能做住宅贷款）\n3. 纯商业物业需要申请Commercial Loan\n4. 商业贷款通常LVR更低（60-70%）、利率更高\n5. 需要租约或商业计划证明还款能力",
    friendly_lenders: ["NAB（商业贷款）", "CBA Commercial", "Westpac Business"],
    avoid_lenders: ["所有银行的标准住宅贷款产品"],
    friendly_lenders_reason: "NAB商业贷款部门对混合用途物业有一定经验",
    avoid_lenders_reason: "标准住宅贷款不接受商业物业",
    required_documents: [
      "物业合同",
      "Council Zoning证明",
      "租约（如有）",
      "商业计划（如自用）",
      "物业面积分配图（如混合用途）",
    ],
    clarifying_questions: [
      "物业的Council Zoning是什么?",
      "是纯商业还是混合用途?",
      "如是混合用途，住宅面积占多少?",
      "有没有现有租约?",
      "购买目的是自用还是投资?",
    ],
    confidence_level: "HIGH",
    source_notes: "银行商业贷款政策",
  },

  // ==================== EXIT_STRATEGY (退出机制) ====================
  // valuation_shortfall (估价不足对策)
  {
    category: "EXIT_STRATEGY",
    factor: "valuation_shortfall",
    risk_level: "MEDIUM",
    scenario: "challenge_val",
    expert_reasoning:
      "挑战估价是常用策略，但成功率取决于：1)是否有强有力的可比销售证据 2)估价师是否犯了明显错误 3)银行对挑战的接受度。通常需要提供同区域、相似物业、3个月内的3个成交案例。银行会重新审核，但不一定采纳。",
    solutions:
      "1. 收集同区域3个月内的3个可比成交案例\n2. 案例需与目标物业相似（面积、房型、状况）\n3. 准备书面挑战信说明估价师的错误或遗漏\n4. 通过BDM提交而非直接联系估价公司\n5. 同时准备Plan B（换银行或补首付）\n6. 挑战通常需3-5个工作日",
    friendly_lenders: ["Macquarie", "NAB"],
    avoid_lenders: ["Westpac（对挑战较严格）"],
    friendly_lenders_reason: "Macquarie和NAB对估价挑战的处理相对灵活",
    avoid_lenders_reason: "Westpac对估价挑战审核较严格",
    required_documents: [
      "3个可比销售证据（RP Data/CoreLogic报告）",
      "估价挑战信",
      "物业特点说明",
    ],
    clarifying_questions: [
      "估价比合同价低多少?",
      "有没有同区域近期成交的案例?",
      "物业有什么独特卖点被估价师忽略了?",
    ],
    confidence_level: "MEDIUM",
    source_notes: "BDM反馈及实际操作经验",
  },
  {
    category: "EXIT_STRATEGY",
    factor: "valuation_shortfall",
    risk_level: "MEDIUM",
    scenario: "switch_lender",
    expert_reasoning:
      "不同银行使用不同估价公司，估价结果可能差异显著（5-10%常见）。换银行重新估价是有效策略，但需要：1)时间充足（重新申请需2-3周） 2)信用查询不会太多 3)settlement日期允许。部分银行有内部估价师，可能更快。",
    solutions:
      "1. 选择使用不同估价公司的银行\n2. 了解新银行的估价师倾向（可咨询BDM）\n3. 确认时间是否足够完成新申请\n4. 如有多次信用查询，需向新银行解释\n5. 考虑使用Broker Panel中估价较高的银行\n6. Desktop Valuation可能更快但限制更多",
    friendly_lenders: ["根据具体物业类型选择"],
    avoid_lenders: [],
    friendly_lenders_reason: "不同物业类型适合不同银行的估价体系",
    avoid_lenders_reason: "",
    required_documents: [
      "原估价报告（了解问题所在）",
      "完整贷款申请材料",
      "时间线规划",
    ],
    clarifying_questions: [
      "还有多少时间到Settlement?",
      "之前申请了几家银行?",
      "原估价低的原因是什么?",
    ],
    confidence_level: "MEDIUM",
    source_notes: "实际操作经验",
  },
  {
    category: "EXIT_STRATEGY",
    factor: "valuation_shortfall",
    risk_level: "HIGH",
    scenario: "increase_deposit",
    expert_reasoning:
      "补足首付是最直接但代价最高的方案。需要额外资金来弥补估价差额。如果客户有资金但之前没打算用，这是可行选项。需要证明额外资金来源合规（避免突然出现大额存款引发审查）。",
    solutions:
      "1. 计算需要补足的金额\n2. 确认资金来源（储蓄、股票、礼金等）\n3. 如是礼金需要Gift Letter\n4. 大额资金转入需提前安排（避免settlement前突然出现）\n5. 更新贷款申请的资金证明\n6. 如资金不足，考虑其他选项",
    friendly_lenders: ["所有银行都接受补首付"],
    avoid_lenders: [],
    friendly_lenders_reason: "补首付降低LVR，银行风险降低",
    avoid_lenders_reason: "",
    required_documents: [
      "更新的资金证明",
      "Gift Letter（如适用）",
      "资金来源说明",
    ],
    clarifying_questions: [
      "有多少额外资金可用?",
      "资金来源是什么?",
      "资金转入需要多长时间?",
    ],
    confidence_level: "HIGH",
    source_notes: "标准操作流程",
  },
  {
    category: "EXIT_STRATEGY",
    factor: "valuation_shortfall",
    risk_level: "HIGH",
    scenario: "renegotiate_price",
    expert_reasoning:
      "与卖家重新议价在买方市场可能成功，但在热门市场难度大。成功率取决于：1)市场状况 2)卖家的出售压力 3)物业在市场上的时间 4)合同条款。这个选项通常作为最后手段，且需要专业房产律师介入。",
    solutions:
      "1. 通过买家中介或律师联系卖家\n2. 准备估价报告作为议价依据\n3. 提出合理的价格调整（通常不超过估价差额）\n4. 强调交易仍能完成的诚意\n5. 可能需要延长Settlement日期\n6. 如卖家拒绝，需准备其他Plan B",
    friendly_lenders: [],
    avoid_lenders: [],
    friendly_lenders_reason: "议价成功后银行重新按新价格评估",
    avoid_lenders_reason: "",
    required_documents: [
      "估价报告",
      "律师函/议价书",
      "修改后的合同（如成功）",
    ],
    clarifying_questions: [
      "卖家有出售压力吗?",
      "物业在市场多久了?",
      "合同有没有Subject to Finance条款?",
      "买家中介关系如何?",
    ],
    confidence_level: "LOW",
    source_notes: "市场经验，成功率因情况而异",
  },
  {
    category: "EXIT_STRATEGY",
    factor: "valuation_shortfall",
    risk_level: "STOP",
    scenario: "walk_away",
    expert_reasoning:
      "放弃交易是最后选项，可能导致：1)丧失订金（通常10%） 2)被卖家起诉要求赔偿差价 3)影响未来信用。只有在合同有Subject to Finance条款且在有效期内，或损失的订金小于继续交易的损失时才考虑。需要律师专业意见。",
    solutions:
      "1. 立即咨询房产律师评估合同条款\n2. 检查Subject to Finance条款是否仍有效\n3. 计算放弃vs继续的成本对比\n4. 如必须放弃，按合同规定正式通知\n5. 保留所有沟通记录\n6. 准备应对卖家可能的法律行动",
    friendly_lenders: [],
    avoid_lenders: [],
    friendly_lenders_reason: "",
    avoid_lenders_reason: "",
    required_documents: [
      "购房合同",
      "律师意见书",
      "所有沟通记录",
      "贷款拒绝信（如适用）",
    ],
    clarifying_questions: [
      "合同有Subject to Finance条款吗?",
      "订金是多少?",
      "是否在冷静期内?",
      "律师怎么说?",
    ],
    confidence_level: "HIGH",
    source_notes: "法律要求及标准流程",
  },

  // application_declined (申请被拒对策)
  {
    category: "EXIT_STRATEGY",
    factor: "application_declined",
    risk_level: "MEDIUM",
    scenario: "appeal",
    expert_reasoning:
      "申诉成功率取决于拒绝原因。如果是材料不足或误解，补充材料后有机会翻盘。如果是政策性问题（如LVR、签证类型），申诉基本无效。BDM关系在申诉过程中非常关键。",
    solutions:
      "1. 首先明确拒绝的具体原因（向BDM索要详细反馈）\n2. 评估是否有补充材料可以解决问题\n3. 准备强有力的申诉信\n4. 通过BDM而非信贷官提交申诉\n5. 设定合理预期（申诉成功率约20-30%）\n6. 同时启动Plan B",
    friendly_lenders: ["NAB", "ANZ"],
    avoid_lenders: ["Westpac（申诉流程较僵化）"],
    friendly_lenders_reason: "NAB和ANZ的BDM在申诉过程中更有主动性",
    avoid_lenders_reason: "Westpac的信贷决策较难翻转",
    required_documents: [
      "拒绝原因确认",
      "补充材料",
      "申诉信",
      "BDM支持信（如有）",
    ],
    clarifying_questions: [
      "拒绝的具体原因是什么?",
      "有什么新材料可以补充?",
      "BDM对申诉的看法?",
    ],
    confidence_level: "MEDIUM",
    source_notes: "BDM反馈及实际案例",
  },
  {
    category: "EXIT_STRATEGY",
    factor: "application_declined",
    risk_level: "MEDIUM",
    scenario: "second_tier",
    expert_reasoning:
      "二线银行（如Suncorp, Bankwest, AMP, ING）通常有更灵活的政策。虽然利率可能略高，但审批标准可能更宽松。适合被四大拒绝但情况不太严重的客户。二线银行在某些领域有专长。",
    solutions:
      "1. 分析被拒原因，选择在该领域有优势的二线银行\n2. Suncorp - 自雇客户友好\n3. Bankwest - 高LVR、首次买家\n4. ING - 网上申请快速\n5. AMP - 农村物业\n6. 重新包装申请，解决之前的问题点",
    friendly_lenders: ["Suncorp", "Bankwest", "ING", "AMP", "Bank of Queensland"],
    avoid_lenders: [],
    friendly_lenders_reason: "二线银行各有专长领域",
    avoid_lenders_reason: "",
    required_documents: [
      "原申请材料",
      "被拒原因说明（用于新包装）",
      "解决方案说明",
    ],
    clarifying_questions: [
      "被拒的核心原因是什么?",
      "能接受略高的利率吗?",
      "Settlement时间还有多久?",
    ],
    confidence_level: "HIGH",
    source_notes: "银行政策及BDM反馈",
  },
  {
    category: "EXIT_STRATEGY",
    factor: "application_declined",
    risk_level: "HIGH",
    scenario: "non_bank",
    expert_reasoning:
      "Non-bank Lender（如Pepper Money, Liberty, La Trobe）专门服务被银行拒绝的客户。利率明显更高（通常+1-2%），但审批更灵活。适合：信用问题、复杂收入、短ABN等。通常作为过渡方案，1-2年后转回银行。",
    solutions:
      "1. 接受更高利率的现实（通常比银行高1-2%）\n2. Pepper Money - 信用问题专家\n3. Liberty - 自雇和复杂收入\n4. La Trobe - 高净值但复杂情况\n5. 签约时确认没有提前还款罚金或很低\n6. 制定12-24个月后Refinance回银行的计划",
    friendly_lenders: ["Pepper Money", "Liberty", "La Trobe", "Bluestone"],
    avoid_lenders: [],
    friendly_lenders_reason: "专门服务复杂情况客户",
    avoid_lenders_reason: "",
    required_documents: [
      "完整申请材料",
      "被银行拒绝的记录",
      "问题解释信",
    ],
    clarifying_questions: [
      "能接受多高的利率?",
      "计划多久后Refinance?",
      "有没有提前还款的计划?",
    ],
    confidence_level: "HIGH",
    source_notes: "Non-bank Lender政策",
  },
  {
    category: "EXIT_STRATEGY",
    factor: "application_declined",
    risk_level: "HIGH",
    scenario: "private_lender",
    expert_reasoning:
      "Private Lender是最后手段，利率极高（通常8-15%），费用高，条款苛刻。只适合短期过桥或紧急情况。风险包括：高利率侵蚀资产、复利累积、强制出售风险。必须有明确退出计划。",
    solutions:
      "1. 只作为最后手段使用\n2. 确保有明确的退出计划（卖房、Refinance等）\n3. 计算总成本确保可承受\n4. 尽量选择持牌的Private Lender\n5. 仔细阅读所有条款，特别是违约条款\n6. 设定最短贷款期限（通常6-12个月）",
    friendly_lenders: [],
    avoid_lenders: ["未持牌的Private Lender"],
    friendly_lenders_reason: "",
    avoid_lenders_reason: "未持牌机构风险高，条款可能不合规",
    required_documents: [
      "物业证明",
      "资产清单",
      "退出计划说明",
    ],
    clarifying_questions: [
      "为什么需要Private Lender?",
      "退出计划是什么?",
      "能承受多高的利率?",
      "贷款期限多长?",
    ],
    confidence_level: "HIGH",
    source_notes: "市场实践",
  },
  {
    category: "EXIT_STRATEGY",
    factor: "application_declined",
    risk_level: "MEDIUM",
    scenario: "wait_and_reapply",
    expert_reasoning:
      "等待条件改善后重申是稳健策略，适合：1)信用分需要恢复 2)需要积累更多存款 3)工作试用期即将结束 4)ABN时间即将满足要求。需要有耐心和明确时间表。",
    solutions:
      "1. 明确需要等待多长时间\n2. 制定改善计划（还清债务、积累存款等）\n3. 暂时放弃当前交易（如必要）\n4. 持续监控信用报告\n5. 与Broker保持联系\n6. 设定重申时间点和目标银行",
    friendly_lenders: ["等条件改善后可申请更多银行"],
    avoid_lenders: [],
    friendly_lenders_reason: "条件改善后选择面更广",
    avoid_lenders_reason: "",
    required_documents: [
      "改善计划",
      "时间表",
      "阶段性目标",
    ],
    clarifying_questions: [
      "需要改善什么条件?",
      "需要等多久?",
      "现有交易能不能等?",
      "有没有其他购房机会?",
    ],
    confidence_level: "HIGH",
    source_notes: "标准策略",
  },

  // settlement_delay (交割延期风险)
  {
    category: "EXIT_STRATEGY",
    factor: "settlement_delay",
    risk_level: "MEDIUM",
    scenario: "extension_likely",
    expert_reasoning:
      "延期申请获批可能性取决于：1)卖家的情况（是否急售） 2)市场状况 3)延期原因的合理性 4)之前是否已延期过。通常14天延期较容易获批，超过会困难。律师和房产中介在谈判中很重要。",
    solutions:
      "1. 尽早通知卖家（一知道可能延期就通知）\n2. 通过律师正式提出延期申请\n3. 说明延期原因和预计新Settlement日期\n4. 可能需要支付延期利息/补偿\n5. 获取书面延期确认\n6. 加速贷款审批流程",
    friendly_lenders: [],
    avoid_lenders: [],
    friendly_lenders_reason: "",
    avoid_lenders_reason: "",
    required_documents: [
      "延期申请函",
      "预计新Settlement日期",
      "贷款进度证明",
    ],
    clarifying_questions: [
      "需要延期多久?",
      "卖家的态度如何?",
      "之前有没有延期过?",
      "贷款在什么阶段?",
    ],
    confidence_level: "MEDIUM",
    source_notes: "实际谈判经验",
  },
  {
    category: "EXIT_STRATEGY",
    factor: "settlement_delay",
    risk_level: "HIGH",
    scenario: "penalty_risk",
    expert_reasoning:
      "违约金风险包括：1)延期利息（通常按合同价每日计算） 2)卖家的额外持有成本 3)合同约定的违约金。NSW标准合同通常是每日利息，VIC可能有固定违约金条款。严重情况下卖家可解约。",
    solutions:
      "1. 立即计算每日延期成本\n2. 与律师确认合同违约条款\n3. 与卖家协商违约金上限\n4. 加速贷款或寻找替代方案\n5. 准备足够资金支付违约金\n6. 考虑是否值得继续交易",
    friendly_lenders: [],
    avoid_lenders: [],
    friendly_lenders_reason: "",
    avoid_lenders_reason: "",
    required_documents: [
      "购房合同（违约条款）",
      "违约金计算",
      "律师意见",
    ],
    clarifying_questions: [
      "合同的违约条款是什么?",
      "每天的延期成本是多少?",
      "有能力支付违约金吗?",
      "贷款什么时候能批?",
    ],
    confidence_level: "HIGH",
    source_notes: "合同法及实际案例",
  },
  {
    category: "EXIT_STRATEGY",
    factor: "settlement_delay",
    risk_level: "HIGH",
    scenario: "bridge_finance",
    expert_reasoning:
      "过桥贷款（Bridging Finance）用于短期资金缺口，通常在卖房和买房不同步时使用。利率高（8-12%），期限短（6-12个月）。风险在于如果原房卖不出，过桥贷款会持续累积利息。",
    solutions:
      "1. 确认过桥贷款是否是唯一选项\n2. 计算总成本（利息+费用）\n3. 确保有明确退出计划（通常是卖房）\n4. 选择有经验的过桥贷款提供商\n5. 确认原房估价和预期售价\n6. 设定卖房底价和时间表",
    friendly_lenders: ["La Trobe", "Firstmac", "部分银行有Bridging产品"],
    avoid_lenders: [],
    friendly_lenders_reason: "La Trobe在过桥贷款方面有丰富经验",
    avoid_lenders_reason: "",
    required_documents: [
      "两套物业的估价",
      "卖房计划",
      "现金流预测",
      "退出策略说明",
    ],
    clarifying_questions: [
      "原房预计能卖多少?",
      "预计多久能卖出?",
      "如果卖不出怎么办?",
      "能承受多长时间的过桥成本?",
    ],
    confidence_level: "HIGH",
    source_notes: "过桥贷款产品及市场实践",
  },
  {
    category: "EXIT_STRATEGY",
    factor: "settlement_delay",
    risk_level: "STOP",
    scenario: "contract_termination",
    expert_reasoning:
      "合同终止风险意味着交易可能无法完成，后果严重：1)丧失订金 2)卖家可追讨差价 3)法律诉讼风险 4)信用记录影响。必须立即寻求法律帮助，尽一切可能避免这种情况。",
    solutions:
      "1. 立即咨询房产律师\n2. 评估所有可能的挽救方案\n3. 与卖家律师紧急沟通\n4. 考虑Private Lender或家人借款紧急注资\n5. 计算放弃vs继续的成本\n6. 如无法避免，按合同规定处理后续",
    friendly_lenders: [],
    avoid_lenders: [],
    friendly_lenders_reason: "",
    avoid_lenders_reason: "",
    required_documents: [
      "购房合同",
      "所有沟通记录",
      "律师意见",
      "财务状况说明",
    ],
    clarifying_questions: [
      "还有多少时间?",
      "所有融资选项都试过了吗?",
      "订金是多少?",
      "律师的建议是什么?",
    ],
    confidence_level: "HIGH",
    source_notes: "法律要求及风险评估",
  },

  // rate_lock_expiry (利率锁定到期)
  {
    category: "EXIT_STRATEGY",
    factor: "rate_lock_expiry",
    risk_level: "LOW",
    scenario: "within_lock",
    expert_reasoning:
      "利率锁定期内是最理想状态。锁定的利率会在Settlement时生效，不受市场波动影响。但需注意锁定通常有条件（如90天内Settlement），超过可能失效。",
    solutions:
      "1. 确认锁定到期日\n2. 确保Settlement在锁定期内\n3. 跟踪贷款进度确保按时批准\n4. 保留锁定确认文件\n5. 如有延期风险，提前与银行沟通",
    friendly_lenders: ["CBA", "NAB", "Westpac", "ANZ"],
    avoid_lenders: [],
    friendly_lenders_reason: "四大银行都有利率锁定产品",
    avoid_lenders_reason: "",
    required_documents: [
      "利率锁定确认",
      "Settlement时间表",
    ],
    clarifying_questions: [
      "锁定什么时候到期?",
      "Settlement预计什么时候?",
    ],
    confidence_level: "HIGH",
    source_notes: "银行利率锁定政策",
  },
  {
    category: "EXIT_STRATEGY",
    factor: "rate_lock_expiry",
    risk_level: "MEDIUM",
    scenario: "expiring_soon",
    expert_reasoning:
      "利率锁定即将到期（<2周）需要高度关注。如果Settlement延期导致锁定失效，可能面临更高利率。需要评估：1)能否按时Settlement 2)当前市场利率趋势 3)是否可以延长锁定。",
    solutions:
      "1. 与银行确认是否可以延长锁定\n2. 了解延长锁定的费用\n3. 评估当前市场利率（如果失效会涨多少）\n4. 加速Settlement流程\n5. 与所有方面沟通确保按时\n6. 准备接受新利率的可能性",
    friendly_lenders: ["根据具体情况"],
    avoid_lenders: [],
    friendly_lenders_reason: "部分银行可以有条件延长锁定",
    avoid_lenders_reason: "",
    required_documents: [
      "锁定到期日确认",
      "Settlement进度",
      "延长锁定申请（如需要）",
    ],
    clarifying_questions: [
      "锁定确切到期日?",
      "Settlement可能延期吗?",
      "当前市场利率是多少?",
    ],
    confidence_level: "HIGH",
    source_notes: "银行政策及市场实践",
  },
  {
    category: "EXIT_STRATEGY",
    factor: "rate_lock_expiry",
    risk_level: "HIGH",
    scenario: "expired",
    expert_reasoning:
      "利率锁定已到期意味着将适用Settlement当日的市场利率。如果利率上升，月供会增加，可能影响Servicing。需要重新评估贷款能力和接受新利率。",
    solutions:
      "1. 获取当前市场利率报价\n2. 重新计算月供和Servicing\n3. 确认仍能通过Servicing测试\n4. 如利率大幅上升，考虑是否继续\n5. 与银行确认新利率条款\n6. 更新预算规划",
    friendly_lenders: [],
    avoid_lenders: [],
    friendly_lenders_reason: "需要接受市场利率",
    avoid_lenders_reason: "",
    required_documents: [
      "新利率确认",
      "更新的Servicing计算",
      "月供对比",
    ],
    clarifying_questions: [
      "新利率比锁定利率高多少?",
      "新月供能承受吗?",
      "Servicing还能通过吗?",
    ],
    confidence_level: "HIGH",
    source_notes: "银行政策",
  },
  {
    category: "EXIT_STRATEGY",
    factor: "rate_lock_expiry",
    risk_level: "MEDIUM",
    scenario: "no_lock",
    expert_reasoning:
      "没有利率锁定意味着最终利率取决于Settlement当日的市场利率。在利率上升周期风险较大，在利率下降周期可能反而有利。需要评估市场趋势和个人风险承受能力。",
    solutions:
      "1. 评估是否需要申请利率锁定（通常有费用）\n2. 了解银行的利率锁定产品\n3. 关注RBA利率决策日期\n4. 在Servicing计算中留足利率上升空间\n5. 如利率趋势向上，考虑尽快Settlement\n6. 保持对市场利率的关注",
    friendly_lenders: ["CBA", "NAB", "ANZ", "Westpac"],
    avoid_lenders: [],
    friendly_lenders_reason: "四大银行都提供利率锁定选项",
    avoid_lenders_reason: "",
    required_documents: [
      "利率锁定产品说明",
      "当前利率对比",
    ],
    clarifying_questions: [
      "为什么没有锁定利率?",
      "对利率变动的承受能力如何?",
      "Settlement预计什么时候?",
    ],
    confidence_level: "HIGH",
    source_notes: "市场实践",
  },
];
