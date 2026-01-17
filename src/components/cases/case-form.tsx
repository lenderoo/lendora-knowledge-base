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
import { CaseInsert, Case } from '@/types/database'
import {
  CLIENT_TYPES,
  VISA_STATUSES,
  EMPLOYMENT_TYPES,
  LOAN_PURPOSES,
  PROPERTY_TYPES,
  RESULTS,
  LENDERS,
  COMMON_TAGS,
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
    challenges: '',
    solution: '',
    lender: '',
    product_type: '',
    approved_amount: null,
    interest_rate: null,
    approval_time: '',
    result: '',
    key_takeaway: '',
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

  const handleChange = (name: string, value: string | number | null) => {
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
          </div>
        </CardContent>
      </Card>

      {/* 处理过程 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>⚡</span> 处理过程
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="challenges">难点/挑战 *</Label>
              <Textarea
                id="challenges"
                value={formData.challenges || ''}
                onChange={(e) => handleChange('challenges', e.target.value)}
                placeholder="描述这个案例的主要难点..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solution">解决方案 *</Label>
              <Textarea
                id="solution"
                value={formData.solution || ''}
                onChange={(e) => handleChange('solution', e.target.value)}
                placeholder="详细描述解决方案和操作步骤..."
                className="min-h-[120px]"
              />
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
              <Label htmlFor="result">结果 *</Label>
              <Select
                value={formData.result || ''}
                onValueChange={(value) => handleChange('result', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {RESULTS.map((result) => (
                    <SelectItem key={result} value={result}>
                      {result}
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
          </div>
        </CardContent>
      </Card>

      {/* 经验总结 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>💡</span> 经验总结
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key_takeaway">关键经验 *</Label>
              <Textarea
                id="key_takeaway"
                value={formData.key_takeaway || ''}
                onChange={(e) => handleChange('key_takeaway', e.target.value)}
                placeholder="总结这个案例的关键经验和教训..."
                className="min-h-[100px]"
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
                <Input
                  id="broker_name"
                  value={formData.broker_name || ''}
                  onChange={(e) => handleChange('broker_name', e.target.value)}
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
