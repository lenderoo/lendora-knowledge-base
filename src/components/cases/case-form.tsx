'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CurrencyInput } from '@/components/ui/currency-input'
import { DurationInput } from '@/components/ui/duration-input'
import { DebtListInput } from '@/components/ui/debt-list-input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BrokerSelect } from '@/components/cases/broker-select'
import { CaseInsert, Case } from '@/types/database'
import {
  CLIENT_TYPES,
  VISA_STATUSES,
  EMPLOYMENT_TYPES,
  LOAN_PURPOSES,
  PROPERTY_TYPES,
  LENDERS,
  COMMON_TAGS,
  PRIMARY_CONCERNS,
  EXCLUDED_PATHS,
  EXCLUSION_REASONS,
  INITIAL_GUT_FEELS,
  CASE_VALUE_LEVELS,
  JUDGEMENT_TIMING,
  RISK_TYPES,
  CURRENT_ACTIONS,
  FINAL_OUTCOMES,
  OUTCOME_JUDGEMENTS,
  DEVIATION_REASONS,
  RETROSPECTIVE_CHANGES,
} from '@/lib/constants'

interface CaseFormProps {
  initialData?: Case | null
  onSave: (data: CaseInsert) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function CaseForm({ initialData, onSave, onCancel, isLoading }: CaseFormProps) {
  const [formData, setFormData] = useState<CaseInsert>({
    case_id: '',
    initial_gut_feel: '',
    judgement_timing: '',
    is_key_decision_sample: false,
    case_value_level: '',
    client_type: '',
    visa_status: '',
    employment_type: '',
    abn_length: '',
    annual_income: null,
    taxable_income: null,
    credit_score: null,
    credit_issues: '',
    existing_debts: '',
    loan_purpose: '',
    property_type: '',
    property_location: '',
    loan_amount: null,
    lvr: null,
    deposit_source: '',
    excluded_paths: [],
    excluded_reasons: {},
    primary_concern: '',
    core_risk_priority: '',
    secondary_risks: [],
    decision_one_liner: '',
    decision_logic_summary: '',
    current_action: '',
    lender: '',
    product_type: '',
    approved_amount: null,
    interest_rate: null,
    approval_time: '',
    final_outcome: '',
    outcome_vs_initial_judgement: '',
    deviation_reasons: [],
    retrospective_change: '',
    future_instruction: '',
    tags: [],
    broker_name: '',
    notes: '',
  })

  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        tags: initialData.tags || [],
      })
    }
  }, [initialData])

  const handleChange = (name: string, value: string | number | boolean | string[] | Record<string, string> | Record<string, { tags: string[]; note: string }> | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (name: string, value: string) => {
    const numValue = value ? parseFloat(value) : null
    setFormData((prev) => ({ ...prev, [name]: numValue }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }))
  }

  const addCommonTag = (tag: string) => {
    if (!formData.tags?.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent, syncToDify = false) => {
    e.preventDefault()
    await onSave(formData)
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
      {/* 决策入口 */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🔥</span> 决策入口
            <span className="text-sm font-normal text-muted-foreground">AI 决策能力的起点</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>初始直觉判断 *</Label>
              <p className="text-xs text-muted-foreground mb-2">在未深入分析前的第一直觉</p>
              <div className="flex flex-wrap gap-2">
                {INITIAL_GUT_FEELS.map((feel) => (
                  <label
                    key={feel.value}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                      formData.initial_gut_feel === feel.value
                        ? 'border-primary bg-primary/10'
                        : 'border-input hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="initial_gut_feel"
                      value={feel.value}
                      checked={formData.initial_gut_feel === feel.value}
                      onChange={(e) => handleChange('initial_gut_feel', e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-sm">{feel.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>判断发生时间点 *</Label>
              <p className="text-xs text-muted-foreground mb-2">做出这个判断时，信息完整程度</p>
              <div className="flex flex-wrap gap-2">
                {JUDGEMENT_TIMING.map((timing) => (
                  <label
                    key={timing.value}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                      formData.judgement_timing === timing.value
                        ? 'border-primary bg-primary/10'
                        : 'border-input hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="judgement_timing"
                      value={timing.value}
                      checked={formData.judgement_timing === timing.value}
                      onChange={(e) => handleChange('judgement_timing', e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-sm">{timing.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>是否关键决策样本 *</Label>
              <p className="text-xs text-muted-foreground mb-2">标记为 Yes 后部分字段变为必填</p>
              <div className="flex gap-2">
                <label
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer transition-colors ${
                    formData.is_key_decision_sample === true
                      ? 'border-primary bg-primary/10'
                      : 'border-input hover:bg-muted'
                  }`}
                >
                  <input
                    type="radio"
                    name="is_key_decision_sample"
                    checked={formData.is_key_decision_sample === true}
                    onChange={() => handleChange('is_key_decision_sample', true)}
                    className="sr-only"
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer transition-colors ${
                    formData.is_key_decision_sample === false
                      ? 'border-primary bg-primary/10'
                      : 'border-input hover:bg-muted'
                  }`}
                >
                  <input
                    type="radio"
                    name="is_key_decision_sample"
                    checked={formData.is_key_decision_sample === false}
                    onChange={() => handleChange('is_key_decision_sample', false)}
                    className="sr-only"
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>案件价值判断</Label>
              <p className="text-xs text-muted-foreground mb-2">建议填写</p>
              <div className="flex flex-wrap gap-2">
                {CASE_VALUE_LEVELS.map((level) => (
                  <label
                    key={level.value}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                      formData.case_value_level === level.value
                        ? 'border-primary bg-primary/10'
                        : 'border-input hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="case_value_level"
                      value={level.value}
                      checked={formData.case_value_level === level.value}
                      onChange={(e) => handleChange('case_value_level', e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-sm">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 客户信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>👤</span> 客户信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_type">客户类型 *</Label>
              <Select
                value={formData.client_type || ''}
                onValueChange={(value) => handleChange('client_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {CLIENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visa_status">签证状态 *</Label>
              <Select
                value={formData.visa_status || ''}
                onValueChange={(value) => handleChange('visa_status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {VISA_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employment_type">雇佣类型</Label>
              <Select
                value={formData.employment_type || ''}
                onValueChange={(value) => handleChange('employment_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="abn_length">ABN时长</Label>
              <DurationInput
                id="abn_length"
                value={formData.abn_length}
                onChange={(value) => handleChange('abn_length', value)}
                units={['year', 'month']}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annual_income">年收入 *</Label>
              <CurrencyInput
                id="annual_income"
                value={formData.annual_income}
                onChange={(value) => handleChange('annual_income', value)}
                placeholder="120,000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxable_income">报税收入</Label>
              <CurrencyInput
                id="taxable_income"
                value={formData.taxable_income}
                onChange={(value) => handleChange('taxable_income', value)}
                placeholder="85,000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credit_score">信用评分</Label>
              <Input
                id="credit_score"
                type="number"
                value={formData.credit_score || ''}
                onChange={(e) => handleNumberChange('credit_score', e.target.value)}
                placeholder="650"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="credit_issues">信用问题</Label>
              <Input
                id="credit_issues"
                value={formData.credit_issues || ''}
                onChange={(e) => handleChange('credit_issues', e.target.value)}
                placeholder="如: 1次late payment (已解决)"
              />
            </div>

            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="existing_debts">现有负债</Label>
              <DebtListInput
                id="existing_debts"
                value={formData.existing_debts}
                onChange={(value) => handleChange('existing_debts', value)}
              />
            </div>

            <div className="space-y-2 md:col-span-3">
              <Label>最不放心的点（直觉）*</Label>
              <p className="text-xs text-muted-foreground mb-2">第一反应，这个客户最让你担心的是什么？</p>
              <div className="flex flex-wrap gap-3">
                {PRIMARY_CONCERNS.map((concern) => (
                  <label
                    key={concern}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                      formData.primary_concern === concern
                        ? 'border-primary bg-primary/10'
                        : 'border-input hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="primary_concern"
                      value={concern}
                      checked={formData.primary_concern === concern}
                      onChange={(e) => handleChange('primary_concern', e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-sm">{concern}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 贷款信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🏠</span> 贷款信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loan_purpose">贷款用途 *</Label>
              <Select
                value={formData.loan_purpose || ''}
                onValueChange={(value) => handleChange('loan_purpose', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {LOAN_PURPOSES.map((purpose) => (
                    <SelectItem key={purpose} value={purpose}>
                      {purpose}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="property_type">物业类型</Label>
              <Select
                value={formData.property_type || ''}
                onValueChange={(value) => handleChange('property_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="property_location">物业位置</Label>
              <Input
                id="property_location"
                value={formData.property_location || ''}
                onChange={(e) => handleChange('property_location', e.target.value)}
                placeholder="Sydney西区"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loan_amount">贷款金额 *</Label>
              <CurrencyInput
                id="loan_amount"
                value={formData.loan_amount}
                onChange={(value) => handleChange('loan_amount', value)}
                placeholder="650,000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lvr">LVR (%) *</Label>
              <Input
                id="lvr"
                type="number"
                step="0.01"
                value={formData.lvr || ''}
                onChange={(e) => handleNumberChange('lvr', e.target.value)}
                placeholder="80"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit_source">首付来源</Label>
              <Input
                id="deposit_source"
                value={formData.deposit_source || ''}
                onChange={(e) => handleChange('deposit_source', e.target.value)}
                placeholder="自有存款/父母赠与"
              />
            </div>

            <div className="space-y-2 md:col-span-3">
              <Label>已明确排除的路径 *</Label>
              <div className="flex flex-wrap gap-3">
                {EXCLUDED_PATHS.map((path) => {
                  const isChecked = formData.excluded_paths?.includes(path.value) || false
                  return (
                    <label
                      key={path.value}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-primary bg-primary/10'
                          : 'border-input hover:bg-muted'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const currentPaths = formData.excluded_paths || []
                          const currentReasons = (formData.excluded_reasons || {}) as Record<string, string>
                          if (e.target.checked) {
                            handleChange('excluded_paths', [...currentPaths, path.value])
                          } else {
                            handleChange('excluded_paths', currentPaths.filter((p) => p !== path.value))
                            const { [path.value]: _removed, ...restReasons } = currentReasons
                            void _removed
                            handleChange('excluded_reasons', restReasons)
                          }
                        }}
                        className="sr-only"
                      />
                      <span className="text-sm">{path.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {formData.excluded_paths && formData.excluded_paths.length > 0 && (
              <div className="space-y-4 md:col-span-3">
                {formData.excluded_paths.map((pathValue) => {
                  const path = EXCLUDED_PATHS.find((p) => p.value === pathValue)
                  if (!path) return null
                  const reasons = (formData.excluded_reasons || {}) as Record<string, { tags: string[]; note: string }>
                  const pathReason = reasons[pathValue] || { tags: [], note: '' }
                  return (
                    <div key={pathValue} className="space-y-3 p-3 border rounded-md bg-muted/30">
                      <Label>
                        为什么不走【{path.label}】路径 *
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {EXCLUSION_REASONS.map((reason) => {
                          const isSelected = pathReason.tags?.includes(reason.value) || false
                          return (
                            <label
                              key={reason.value}
                              className={`flex items-center gap-2 px-2 py-1 rounded border cursor-pointer transition-colors text-sm ${
                                isSelected
                                  ? 'border-primary bg-primary/10'
                                  : 'border-input hover:bg-muted'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  const currentReasons = (formData.excluded_reasons || {}) as Record<string, { tags: string[]; note: string }>
                                  const currentTags = pathReason.tags || []
                                  const newTags = e.target.checked
                                    ? [...currentTags, reason.value]
                                    : currentTags.filter((t) => t !== reason.value)
                                  handleChange('excluded_reasons', {
                                    ...currentReasons,
                                    [pathValue]: { ...pathReason, tags: newTags },
                                  })
                                }}
                                className="sr-only"
                              />
                              <span>{reason.label}</span>
                            </label>
                          )
                        })}
                      </div>
                      <Textarea
                        value={pathReason.note || ''}
                        onChange={(e) => {
                          const currentReasons = (formData.excluded_reasons || {}) as Record<string, { tags: string[]; note: string }>
                          handleChange('excluded_reasons', {
                            ...currentReasons,
                            [pathValue]: { ...pathReason, note: e.target.value },
                          })
                        }}
                        placeholder="补充说明（可选）"
                        className="min-h-[60px]"
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 决策拆解 */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎯</span> 决策拆解
            <span className="text-sm font-normal text-muted-foreground">判断型输入</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>最终决定中的核心风险（只能选一个）*</Label>
              <p className="text-xs text-muted-foreground mb-2">经过分析后，你认为最关键的风险点</p>
              <div className="flex flex-wrap gap-2">
                {RISK_TYPES.map((risk) => (
                  <label
                    key={risk.value}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                      formData.core_risk_priority === risk.value
                        ? 'border-primary bg-primary/10'
                        : 'border-input hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="core_risk_priority"
                      value={risk.value}
                      checked={formData.core_risk_priority === risk.value}
                      onChange={(e) => handleChange('core_risk_priority', e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-sm">{risk.label}</span>
                  </label>
                ))}
              </div>
              {formData.primary_concern && formData.core_risk_priority &&
               formData.primary_concern.toUpperCase() !== formData.core_risk_priority && (
                <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded mt-2">
                  ⚠️ 你的初始担忧是 {formData.primary_concern}，但核心风险选了 {RISK_TYPES.find(r => r.value === formData.core_risk_priority)?.label}，判断发生了变化
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>次级风险（最多2个）</Label>
              <div className="flex flex-wrap gap-2">
                {RISK_TYPES.map((risk) => {
                  const isSelected = formData.secondary_risks?.includes(risk.value) || false
                  const isDisabled = !isSelected && (formData.secondary_risks?.length || 0) >= 2
                  const isCoreRisk = formData.core_risk_priority === risk.value
                  return (
                    <label
                      key={risk.value}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                        isCoreRisk
                          ? 'border-muted bg-muted/50 text-muted-foreground cursor-not-allowed'
                          : isSelected
                          ? 'border-primary bg-primary/10'
                          : isDisabled
                          ? 'border-muted bg-muted/30 text-muted-foreground cursor-not-allowed'
                          : 'border-input hover:bg-muted'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isDisabled || isCoreRisk}
                        onChange={(e) => {
                          const current = formData.secondary_risks || []
                          if (e.target.checked) {
                            handleChange('secondary_risks', [...current, risk.value])
                          } else {
                            handleChange('secondary_risks', current.filter((r) => r !== risk.value))
                          }
                        }}
                        className="sr-only"
                      />
                      <span className="text-sm">{risk.label}</span>
                    </label>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                已选 {formData.secondary_risks?.length || 0}/2（不能与核心风险相同）
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 决策表达 */}
      <Card className="border-purple-200 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>💬</span> 决策表达
            <span className="text-sm font-normal text-muted-foreground">核心判断输出</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="decision_one_liner">一句话判断结论 *</Label>
              <p className="text-xs text-muted-foreground">如果只能用一句话告诉另一个 broker，你会怎么说？（禁止模糊词）</p>
              <Textarea
                id="decision_one_liner"
                value={formData.decision_one_liner || ''}
                onChange={(e) => handleChange('decision_one_liner', e.target.value)}
                placeholder="直接给出判断，不要用「可能」「视情况」「需要再看」等模糊词..."
                className={`min-h-[60px] ${(formData.decision_one_liner?.length || 0) > 120 ? 'border-amber-500' : ''}`}
                maxLength={120}
              />
              <div className="flex justify-between items-center">
                {formData.decision_one_liner && /可能|视情况|需要再看|也许|大概|或许/.test(formData.decision_one_liner) ? (
                  <p className="text-xs text-red-500">
                    ⚠️ 检测到模糊词，请给出明确判断
                  </p>
                ) : (
                  <span />
                )}
                <p className={`text-xs ${(formData.decision_one_liner?.length || 0) > 120 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                  {formData.decision_one_liner?.length || 0}/120
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="decision_logic_summary">决策逻辑摘要 *</Label>
              <p className="text-xs text-muted-foreground">为什么可以/不可以做？为什么不选其他路径？</p>
              <Textarea
                id="decision_logic_summary"
                value={formData.decision_logic_summary || ''}
                onChange={(e) => handleChange('decision_logic_summary', e.target.value)}
                placeholder="- 为什么可以 / 不可以做&#10;- 为什么不选其他路径"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>当前采取动作 *</Label>
              <div className="flex flex-wrap gap-2">
                {CURRENT_ACTIONS.map((action) => (
                  <label
                    key={action.value}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                      formData.current_action === action.value
                        ? 'border-primary bg-primary/10'
                        : 'border-input hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="current_action"
                      value={action.value}
                      checked={formData.current_action === action.value}
                      onChange={(e) => handleChange('current_action', e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-sm">{action.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 结果 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>✅</span> 结果
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lender">最终Lender *</Label>
              <Select
                value={formData.lender || ''}
                onValueChange={(value) => handleChange('lender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {LENDERS.map((lender) => (
                    <SelectItem key={lender} value={lender}>
                      {lender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_type">产品类型</Label>
              <Input
                id="product_type"
                value={formData.product_type || ''}
                onChange={(e) => handleChange('product_type', e.target.value)}
                placeholder="Full Doc / Low Doc"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="final_outcome">最终结果</Label>
              <Select
                value={formData.final_outcome || ''}
                onValueChange={(value) => handleChange('final_outcome', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择（初次可空）" />
                </SelectTrigger>
                <SelectContent>
                  {FINAL_OUTCOMES.map((outcome) => (
                    <SelectItem key={outcome.value} value={outcome.value}>
                      {outcome.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="approved_amount">批准金额</Label>
              <CurrencyInput
                id="approved_amount"
                value={formData.approved_amount}
                onChange={(value) => handleChange('approved_amount', value)}
                placeholder="650,000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest_rate">利率 (%)</Label>
              <Input
                id="interest_rate"
                type="number"
                step="0.01"
                value={formData.interest_rate || ''}
                onChange={(e) => handleNumberChange('interest_rate', e.target.value)}
                placeholder="6.89"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="approval_time">审批时间</Label>
              <DurationInput
                id="approval_time"
                value={formData.approval_time}
                onChange={(value) => handleChange('approval_time', value)}
                units={['week']}
              />
            </div>

            {formData.final_outcome && (
              <>
                <div className="space-y-2 md:col-span-3">
                  <Label>结果是否验证最初判断 *</Label>
                  <div className="flex flex-wrap gap-2">
                    {OUTCOME_JUDGEMENTS.map((judgement) => (
                      <label
                        key={judgement.value}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                          formData.outcome_vs_initial_judgement === judgement.value
                            ? 'border-primary bg-primary/10'
                            : 'border-input hover:bg-muted'
                        }`}
                      >
                        <input
                          type="radio"
                          name="outcome_vs_initial_judgement"
                          value={judgement.value}
                          checked={formData.outcome_vs_initial_judgement === judgement.value}
                          onChange={(e) => handleChange('outcome_vs_initial_judgement', e.target.value)}
                          className="sr-only"
                        />
                        <span className="text-sm">{judgement.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {(formData.outcome_vs_initial_judgement === 'MISMATCH' || formData.outcome_vs_initial_judgement === 'PARTIAL') && (
                  <>
                    <div className="space-y-2 md:col-span-3">
                      <Label>偏差原因 *</Label>
                      <div className="flex flex-wrap gap-2">
                        {DEVIATION_REASONS.map((reason) => {
                          const isSelected = formData.deviation_reasons?.includes(reason.value) || false
                          return (
                            <label
                              key={reason.value}
                              className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                                isSelected
                                  ? 'border-primary bg-primary/10'
                                  : 'border-input hover:bg-muted'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  const current = formData.deviation_reasons || []
                                  if (e.target.checked) {
                                    handleChange('deviation_reasons', [...current, reason.value])
                                  } else {
                                    handleChange('deviation_reasons', current.filter((r) => r !== reason.value))
                                  }
                                }}
                                className="sr-only"
                              />
                              <span className="text-sm">{reason.label}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-3">
                      <Label>如果重来，你会改哪一步？*</Label>
                      <p className="text-xs text-muted-foreground mb-2">回顾整个判断链条，最该调整的环节</p>
                      <div className="flex flex-wrap gap-2">
                        {RETROSPECTIVE_CHANGES.map((change) => (
                          <label
                            key={change.value}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                              formData.retrospective_change === change.value
                                ? 'border-primary bg-primary/10'
                                : 'border-input hover:bg-muted'
                            }`}
                          >
                            <input
                              type="radio"
                              name="retrospective_change"
                              value={change.value}
                              checked={formData.retrospective_change === change.value}
                              onChange={(e) => handleChange('retrospective_change', e.target.value)}
                              className="sr-only"
                            />
                            <span className="text-sm">{change.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 可学习总结 */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📚</span> 可学习总结
            <span className="text-sm font-normal text-muted-foreground">未来决策指导</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="future_instruction">未来指导 *</Label>
              <p className="text-xs text-muted-foreground">只写动作，不写感悟</p>
              <Textarea
                id="future_instruction"
                value={formData.future_instruction || ''}
                onChange={(e) => handleChange('future_instruction', e.target.value)}
                placeholder="下次遇到【这些条件】时，我会：&#10;✅ 直接做：...&#10;❌ 绝对不做：..."
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label>标签</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  placeholder="添加标签"
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  添加
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {COMMON_TAGS.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => addCommonTag(tag)}
                    disabled={formData.tags?.includes(tag)}
                  >
                    + {tag}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="broker_name">经办Broker</Label>
                <BrokerSelect
                  value={formData.broker_name ?? null}
                  onChange={(value) => handleChange('broker_name', value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">备注</Label>
                <Input
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 提交按钮 */}
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '保存中...' : '💾 保存案例'}
        </Button>
        <Button
          type="button"
          variant="default"
          className="bg-green-600 hover:bg-green-700"
          disabled={isLoading}
          onClick={(e) => handleSubmit(e, true)}
        >
          🔄 保存并同步到Dify
        </Button>
      </div>
    </form>
  )
}
