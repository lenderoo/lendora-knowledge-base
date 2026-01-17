import {
  OperationGuide,
  GUIDE_CATEGORY_LABELS,
  GUIDE_SUBCATEGORY_LABELS,
} from '@/types/operation-guide'

/**
 * 将操作指南转换为Markdown格式
 */
export function guideToMarkdown(guide: OperationGuide): string {
  const lines: string[] = []

  // 标题
  lines.push(`# ${guide.title}`)
  lines.push('')

  // 元信息
  lines.push(`> **分类**: ${GUIDE_CATEGORY_LABELS[guide.category]} > ${GUIDE_SUBCATEGORY_LABELS[guide.subCategory]}`)
  lines.push(`> **作者**: ${guide.author} | **版本**: ${guide.version}`)
  if (guide.lastUpdated) {
    lines.push(`> **最后更新**: ${guide.lastUpdated}`)
  }
  lines.push('')

  // 适用场景
  lines.push('## 适用场景')
  lines.push(guide.applicableScenario)
  lines.push('')

  // 前置条件
  if (guide.prerequisites.length > 0 && guide.prerequisites.some(p => p.trim())) {
    lines.push('## 前置条件')
    guide.prerequisites.forEach((prereq) => {
      if (prereq.trim()) {
        lines.push(`- [ ] ${prereq}`)
      }
    })
    lines.push('')
  }

  // 流程步骤
  if (guide.steps.length > 0) {
    lines.push('## 流程步骤')
    lines.push('')

    guide.steps.forEach((step) => {
      const durationText = step.duration ? ` (${step.duration})` : ''
      lines.push(`### Step ${step.order}: ${step.title}${durationText}`)

      if (step.description) {
        lines.push(step.description)
        lines.push('')
      }

      // 检查清单
      if (step.checklist.length > 0 && step.checklist.some(c => c.trim())) {
        step.checklist.forEach((item) => {
          if (item.trim()) {
            lines.push(`- [ ] ${item}`)
          }
        })
        lines.push('')
      }

      // 小贴士
      if (step.tips) {
        lines.push(`> 💡 **提示**: ${step.tips}`)
        lines.push('')
      }
    })
  }

  // 常见问题
  if (guide.faqs.length > 0 && guide.faqs.some(f => f.question.trim())) {
    lines.push('## 常见问题')
    lines.push('')

    guide.faqs.forEach((faq) => {
      if (faq.question.trim()) {
        lines.push(`**Q: ${faq.question}**`)
        lines.push('')
        lines.push(`A: ${faq.answer}`)
        lines.push('')
      }
    })
  }

  // 注意事项
  if (guide.cautions.length > 0 && guide.cautions.some(c => c.content.trim())) {
    lines.push('## 注意事项')
    lines.push('')

    guide.cautions.forEach((caution) => {
      if (caution.content.trim()) {
        const icon = getCautionIcon(caution.type)
        lines.push(`${icon} ${caution.content}`)
        lines.push('')
      }
    })
  }

  // 常用话术
  if (guide.scripts && guide.scripts.length > 0 && guide.scripts.some(s => s.trim())) {
    lines.push('## 常用话术')
    lines.push('')

    guide.scripts.forEach((script, index) => {
      if (script.trim()) {
        lines.push(`**话术${index + 1}:**`)
        lines.push(`> "${script}"`)
        lines.push('')
      }
    })
  }

  // 相关链接
  if (guide.relatedLinks && guide.relatedLinks.length > 0) {
    lines.push('## 相关链接')
    guide.relatedLinks.forEach((link) => {
      lines.push(`- [${link.title}](${link.url})`)
    })
    lines.push('')
  }

  // 标签
  if (guide.tags.length > 0) {
    lines.push('---')
    lines.push(`**标签**: ${guide.tags.join(', ')}`)
    lines.push('')
  }

  return lines.join('\n')
}

function getCautionIcon(type: string): string {
  switch (type) {
    case 'warning':
      return '⚠️'
    case 'info':
      return 'ℹ️'
    case 'success':
      return '✅'
    case 'error':
      return '❌'
    default:
      return '•'
  }
}

/**
 * 生成指南的文件名
 */
export function generateGuideFilename(guide: OperationGuide): string {
  const sanitizedTitle = guide.title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 50)

  return `${guide.category}_${guide.subCategory}_${sanitizedTitle}.md`
}

/**
 * 生成指南的Dify标题
 */
export function generateGuideTitle(guide: OperationGuide): string {
  return `[${GUIDE_CATEGORY_LABELS[guide.category]}] ${guide.title}`
}
