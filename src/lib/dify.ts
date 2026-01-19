import { Case } from '@/types/database'

const DIFY_API_KEY = process.env.DIFY_API_KEY
const DIFY_BASE_URL = process.env.DIFY_BASE_URL || 'https://api.dify.ai/v1'
const DIFY_DATASET_ID = process.env.DIFY_DATASET_ID

interface DifyResponse {
  document?: {
    id: string
    name: string
    indexing_status: string
  }
  batch?: string
}

/**
 * 将案例转换为 Markdown 格式
 */
export function caseToMarkdown(caseData: Case): string {
  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN')
  }

  return `# 案例编号: ${caseData.case_id}

## 基本信息
- **日期**: ${formatDate(caseData.created_at)}
- **经办Broker**: ${caseData.broker_name || '-'}
- **初始判断**: ${caseData.initial_gut_feel || '-'}
- **判断时机**: ${caseData.judgement_timing || '-'}

## 客户情况
- **客户类型**: ${caseData.client_type || '-'}
- **签证状态**: ${caseData.visa_status || '-'}
- **雇佣类型**: ${caseData.employment_type || '-'}
- **ABN时长**: ${caseData.abn_length || '-'}
- **年收入**: ${formatCurrency(caseData.annual_income)}
- **报税收入**: ${formatCurrency(caseData.taxable_income)}
- **信用评分**: ${caseData.credit_score || '-'}
- **信用问题**: ${caseData.credit_issues || '无'}
- **现有负债**: ${caseData.existing_debts || '无'}

## 贷款需求
- **贷款用途**: ${caseData.loan_purpose || '-'}
- **物业类型**: ${caseData.property_type || '-'}
- **物业位置**: ${caseData.property_location || '-'}
- **贷款金额**: ${formatCurrency(caseData.loan_amount)}
- **LVR**: ${caseData.lvr || '-'}%
- **首付来源**: ${caseData.deposit_source || '-'}

## 决策分析
- **核心关注点**: ${caseData.primary_concern || '无'}
- **核心风险优先级**: ${caseData.core_risk_priority || '-'}
- **次要风险**: ${caseData.secondary_risks?.join(', ') || '无'}
- **排除路径**: ${caseData.excluded_paths?.join(', ') || '无'}

## 决策表达
- **一句话决策**: ${caseData.decision_one_liner || '无'}
- **决策逻辑**: ${caseData.decision_logic_summary || '无'}
- **当前行动**: ${caseData.current_action || '无'}

## 结果
- **最终Lender**: ${caseData.lender || '-'}
- **产品类型**: ${caseData.product_type || '-'}
- **批准金额**: ${formatCurrency(caseData.approved_amount)}
- **利率**: ${caseData.interest_rate || '-'}%
- **审批时间**: ${caseData.approval_time || '-'}
- **最终结果**: ${caseData.final_outcome || '-'}
- **结果与初始判断对比**: ${caseData.outcome_vs_initial_judgement || '-'}

## 关键经验总结
- **偏差原因**: ${caseData.deviation_reasons?.join(', ') || '无'}
- **回顾性改变**: ${caseData.retrospective_change || '无'}
- **未来指导**: ${caseData.future_instruction || '无'}

## 标签
${caseData.tags?.join(', ') || '无'}

## 备注
${caseData.notes || '无'}
`
}

/**
 * 创建 Dify 文档
 */
export async function createDifyDocument(
  title: string,
  content: string
): Promise<DifyResponse> {
  if (!DIFY_API_KEY || !DIFY_DATASET_ID) {
    throw new Error('Dify API credentials not configured')
  }

  const response = await fetch(
    `${DIFY_BASE_URL}/datasets/${DIFY_DATASET_ID}/document/create_by_text`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: title,
        text: content,
        indexing_technique: 'high_quality',
        process_rule: {
          mode: 'automatic',
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Dify API error: ${error}`)
  }

  return response.json()
}

/**
 * 更新 Dify 文档
 */
export async function updateDifyDocument(
  documentId: string,
  title: string,
  content: string
): Promise<DifyResponse> {
  if (!DIFY_API_KEY || !DIFY_DATASET_ID) {
    throw new Error('Dify API credentials not configured')
  }

  const response = await fetch(
    `${DIFY_BASE_URL}/datasets/${DIFY_DATASET_ID}/documents/${documentId}/update_by_text`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: title,
        text: content,
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Dify API error: ${error}`)
  }

  return response.json()
}

/**
 * 删除 Dify 文档
 */
export async function deleteDifyDocument(documentId: string): Promise<void> {
  if (!DIFY_API_KEY || !DIFY_DATASET_ID) {
    throw new Error('Dify API credentials not configured')
  }

  const response = await fetch(
    `${DIFY_BASE_URL}/datasets/${DIFY_DATASET_ID}/documents/${documentId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${DIFY_API_KEY}`,
      },
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Dify API error: ${error}`)
  }
}

/**
 * 同步案例到 Dify
 */
export async function syncCaseToDify(caseData: Case): Promise<string> {
  const markdown = caseToMarkdown(caseData)
  const title = `案例-${caseData.case_id}`

  if (caseData.dify_document_id) {
    // 更新现有文档
    await updateDifyDocument(caseData.dify_document_id, title, markdown)
    return caseData.dify_document_id
  } else {
    // 创建新文档
    const result = await createDifyDocument(title, markdown)
    return result.document?.id || ''
  }
}
