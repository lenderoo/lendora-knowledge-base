// 操作指南类型定义

export type GuideCategory =
  | 'sop'           // 流程SOP
  | 'document'      // 文件清单
  | 'troubleshoot'  // 问题处理
  | 'lender'        // Lender指南
  | 'compliance'    // 合规清单
  | 'template'      // 沟通模板

export type GuideSubCategory =
  // SOP子类
  | 'initial_consultation'  // 初次咨询
  | 'pre_approval'          // Pre-Approval
  | 'formal_application'    // 正式申请
  | 'settlement'            // Settlement
  // 文件清单子类
  | 'payg_documents'        // PAYG文件
  | 'self_employed_docs'    // Self-employed文件
  | 'visa_documents'        // 签证相关文件
  // 问题处理子类
  | 'valuation_shortfall'   // 估价不足
  | 'application_decline'   // 申请被拒
  | 'credit_issues'         // 信用问题
  // Lender子类
  | 'system_guide'          // 系统操作
  | 'bdm_contacts'          // BDM联系
  | 'policy_summary'        // 政策摘要
  // 合规子类
  | 'compliance_checklist'  // 合规清单
  | 'risk_control'          // 风控要点
  // 模板子类
  | 'email_template'        // 邮件模板
  | 'sms_template'          // 短信模板

// 流程步骤
export interface ProcessStep {
  order: number
  title: string
  description: string
  checklist: string[]
  tips?: string
  duration?: string  // 预估时间
}

// FAQ项
export interface FAQItem {
  question: string
  answer: string
}

// 注意事项
export interface CautionItem {
  type: 'warning' | 'info' | 'success' | 'error'
  content: string
}

// 操作指南主体
export interface OperationGuide {
  id?: string

  // 基本信息
  title: string
  category: GuideCategory
  subCategory: GuideSubCategory

  // 适用场景
  applicableScenario: string

  // 前置条件
  prerequisites: string[]

  // 流程步骤
  steps: ProcessStep[]

  // 常见问题
  faqs: FAQItem[]

  // 注意事项
  cautions: CautionItem[]

  // 相关链接/资源
  relatedLinks: {
    title: string
    url: string
  }[]

  // 常用话术
  scripts?: string[]

  // 元数据
  author: string
  version: string
  lastUpdated?: string
  tags: string[]

  // 系统字段
  created_at?: string
  updated_at?: string
  synced_to_dify?: boolean
  dify_document_id?: string
}

// 分类显示名称映射
export const GUIDE_CATEGORY_LABELS: Record<GuideCategory, string> = {
  sop: '流程SOP',
  document: '文件清单',
  troubleshoot: '问题处理',
  lender: 'Lender指南',
  compliance: '合规风控',
  template: '沟通模板',
}

export const GUIDE_SUBCATEGORY_LABELS: Record<GuideSubCategory, string> = {
  // SOP
  initial_consultation: '客户初次咨询',
  pre_approval: 'Pre-Approval申请',
  formal_application: '正式申请流程',
  settlement: 'Settlement流程',
  // 文件
  payg_documents: 'PAYG员工文件',
  self_employed_docs: 'Self-employed文件',
  visa_documents: '签证相关文件',
  // 问题
  valuation_shortfall: '估价不足处理',
  application_decline: '申请被拒处理',
  credit_issues: '信用问题处理',
  // Lender
  system_guide: '系统操作指南',
  bdm_contacts: 'BDM联系方式',
  policy_summary: '政策摘要',
  // 合规
  compliance_checklist: '合规要求清单',
  risk_control: '风控要点',
  // 模板
  email_template: '邮件模板',
  sms_template: '短信模板',
}

// 分类对应的子分类
export const CATEGORY_SUBCATEGORIES: Record<GuideCategory, GuideSubCategory[]> = {
  sop: ['initial_consultation', 'pre_approval', 'formal_application', 'settlement'],
  document: ['payg_documents', 'self_employed_docs', 'visa_documents'],
  troubleshoot: ['valuation_shortfall', 'application_decline', 'credit_issues'],
  lender: ['system_guide', 'bdm_contacts', 'policy_summary'],
  compliance: ['compliance_checklist', 'risk_control'],
  template: ['email_template', 'sms_template'],
}
