'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Separator } from '@/components/ui/separator'
import {
  OperationGuide,
  ProcessStep,
  FAQItem,
  CautionItem,
  GuideCategory,
  GuideSubCategory,
  GUIDE_CATEGORY_LABELS,
  GUIDE_SUBCATEGORY_LABELS,
  CATEGORY_SUBCATEGORIES,
} from '@/types/operation-guide'

interface GuideFormProps {
  initialData?: OperationGuide | null
  onSave: (data: OperationGuide) => Promise<void>
  onPreview: (data: OperationGuide) => void
  isLoading?: boolean
}

const EMPTY_STEP: ProcessStep = {
  order: 1,
  title: '',
  description: '',
  checklist: [''],
  tips: '',
  duration: '',
}

const EMPTY_FAQ: FAQItem = {
  question: '',
  answer: '',
}

const EMPTY_CAUTION: CautionItem = {
  type: 'warning',
  content: '',
}

export function GuideForm({ initialData, onSave, onPreview, isLoading }: GuideFormProps) {
  const [formData, setFormData] = useState<OperationGuide>(
    initialData || {
      title: '',
      category: 'sop',
      subCategory: 'initial_consultation',
      applicableScenario: '',
      prerequisites: [''],
      steps: [{ ...EMPTY_STEP }],
      faqs: [{ ...EMPTY_FAQ }],
      cautions: [{ ...EMPTY_CAUTION }],
      relatedLinks: [],
      scripts: [''],
      author: '',
      version: '1.0',
      tags: [],
    }
  )

  const [newTag, setNewTag] = useState('')

  // 获取当前分类的子分类选项
  const availableSubCategories = CATEGORY_SUBCATEGORIES[formData.category] || []

  // 通用字段更新
  const handleChange = (field: keyof OperationGuide, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // 分类变更时重置子分类
  const handleCategoryChange = (category: GuideCategory) => {
    const subCategories = CATEGORY_SUBCATEGORIES[category]
    setFormData((prev) => ({
      ...prev,
      category,
      subCategory: subCategories[0],
    }))
  }

  // 前置条件管理
  const addPrerequisite = () => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: [...prev.prerequisites, ''],
    }))
  }

  const updatePrerequisite = (index: number, value: string) => {
    const newPrereqs = [...formData.prerequisites]
    newPrereqs[index] = value
    setFormData((prev) => ({ ...prev, prerequisites: newPrereqs }))
  }

  const removePrerequisite = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index),
    }))
  }

  // 步骤管理
  const addStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        { ...EMPTY_STEP, order: prev.steps.length + 1 },
      ],
    }))
  }

  const updateStep = (index: number, field: keyof ProcessStep, value: unknown) => {
    const newSteps = [...formData.steps]
    newSteps[index] = { ...newSteps[index], [field]: value }
    setFormData((prev) => ({ ...prev, steps: newSteps }))
  }

  const updateStepChecklist = (stepIndex: number, checkIndex: number, value: string) => {
    const newSteps = [...formData.steps]
    const newChecklist = [...newSteps[stepIndex].checklist]
    newChecklist[checkIndex] = value
    newSteps[stepIndex] = { ...newSteps[stepIndex], checklist: newChecklist }
    setFormData((prev) => ({ ...prev, steps: newSteps }))
  }

  const addStepChecklistItem = (stepIndex: number) => {
    const newSteps = [...formData.steps]
    newSteps[stepIndex] = {
      ...newSteps[stepIndex],
      checklist: [...newSteps[stepIndex].checklist, ''],
    }
    setFormData((prev) => ({ ...prev, steps: newSteps }))
  }

  const removeStepChecklistItem = (stepIndex: number, checkIndex: number) => {
    const newSteps = [...formData.steps]
    newSteps[stepIndex] = {
      ...newSteps[stepIndex],
      checklist: newSteps[stepIndex].checklist.filter((_, i) => i !== checkIndex),
    }
    setFormData((prev) => ({ ...prev, steps: newSteps }))
  }

  const removeStep = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, order: i + 1 })),
    }))
  }

  // FAQ管理
  const addFAQ = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { ...EMPTY_FAQ }],
    }))
  }

  const updateFAQ = (index: number, field: keyof FAQItem, value: string) => {
    const newFAQs = [...formData.faqs]
    newFAQs[index] = { ...newFAQs[index], [field]: value }
    setFormData((prev) => ({ ...prev, faqs: newFAQs }))
  }

  const removeFAQ = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }))
  }

  // 注意事项管理
  const addCaution = () => {
    setFormData((prev) => ({
      ...prev,
      cautions: [...prev.cautions, { ...EMPTY_CAUTION }],
    }))
  }

  const updateCaution = (index: number, field: keyof CautionItem, value: string) => {
    const newCautions = [...formData.cautions]
    newCautions[index] = { ...newCautions[index], [field]: value }
    setFormData((prev) => ({ ...prev, cautions: newCautions }))
  }

  const removeCaution = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      cautions: prev.cautions.filter((_, i) => i !== index),
    }))
  }

  // 话术管理
  const addScript = () => {
    setFormData((prev) => ({
      ...prev,
      scripts: [...(prev.scripts || []), ''],
    }))
  }

  const updateScript = (index: number, value: string) => {
    const newScripts = [...(formData.scripts || [])]
    newScripts[index] = value
    setFormData((prev) => ({ ...prev, scripts: newScripts }))
  }

  const removeScript = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      scripts: (prev.scripts || []).filter((_, i) => i !== index),
    }))
  }

  // 标签管理
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📋</span> 基本信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>指南标题 *</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="如: Pre-Approval申请流程"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>作者 *</Label>
              <Input
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                placeholder="输入作者姓名"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>分类 *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => handleCategoryChange(v as GuideCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(GUIDE_CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>子分类 *</Label>
              <Select
                value={formData.subCategory}
                onValueChange={(v) => handleChange('subCategory', v as GuideSubCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableSubCategories.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {GUIDE_SUBCATEGORY_LABELS[sub]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>适用场景 *</Label>
            <Textarea
              value={formData.applicableScenario}
              onChange={(e) => handleChange('applicableScenario', e.target.value)}
              placeholder="描述这个指南适用于什么情况..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label>版本</Label>
            <Input
              value={formData.version}
              onChange={(e) => handleChange('version', e.target.value)}
              placeholder="1.0"
            />
          </div>
        </CardContent>
      </Card>

      {/* 前置条件 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span>✅</span> 前置条件
            </span>
            <Button type="button" variant="outline" size="sm" onClick={addPrerequisite}>
              + 添加
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {formData.prerequisites.map((prereq, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={prereq}
                onChange={(e) => updatePrerequisite(index, e.target.value)}
                placeholder={`前置条件 ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removePrerequisite(index)}
                disabled={formData.prerequisites.length === 1}
              >
                ×
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 流程步骤 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span>📝</span> 流程步骤
            </span>
            <Button type="button" variant="outline" size="sm" onClick={addStep}>
              + 添加步骤
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.steps.map((step, stepIndex) => (
            <div key={stepIndex} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Step {step.order}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStep(stepIndex)}
                  disabled={formData.steps.length === 1}
                  className="text-red-500"
                >
                  删除步骤
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>步骤标题 *</Label>
                  <Input
                    value={step.title}
                    onChange={(e) => updateStep(stepIndex, 'title', e.target.value)}
                    placeholder="如: 基本信息收集"
                  />
                </div>
                <div className="space-y-2">
                  <Label>预估时间</Label>
                  <Input
                    value={step.duration || ''}
                    onChange={(e) => updateStep(stepIndex, 'duration', e.target.value)}
                    placeholder="如: 5-10分钟"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>步骤描述</Label>
                <Textarea
                  value={step.description}
                  onChange={(e) => updateStep(stepIndex, 'description', e.target.value)}
                  placeholder="详细描述这个步骤要做什么..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>检查清单</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addStepChecklistItem(stepIndex)}
                  >
                    + 添加项
                  </Button>
                </div>
                {step.checklist.map((item, checkIndex) => (
                  <div key={checkIndex} className="flex gap-2">
                    <span className="mt-2 text-muted-foreground">☐</span>
                    <Input
                      value={item}
                      onChange={(e) =>
                        updateStepChecklist(stepIndex, checkIndex, e.target.value)
                      }
                      placeholder={`检查项 ${checkIndex + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStepChecklistItem(stepIndex, checkIndex)}
                      disabled={step.checklist.length === 1}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>小贴士</Label>
                <Input
                  value={step.tips || ''}
                  onChange={(e) => updateStep(stepIndex, 'tips', e.target.value)}
                  placeholder="这个步骤的小技巧或注意点"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 常见问题 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span>❓</span> 常见问题FAQ
            </span>
            <Button type="button" variant="outline" size="sm" onClick={addFAQ}>
              + 添加问题
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <Label>问题 Q:</Label>
                    <Input
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      placeholder="常见问题..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>答案 A:</Label>
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      placeholder="问题的解答..."
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFAQ(index)}
                  disabled={formData.faqs.length === 1}
                  className="ml-2"
                >
                  ×
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 注意事项 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span>⚠️</span> 注意事项
            </span>
            <Button type="button" variant="outline" size="sm" onClick={addCaution}>
              + 添加
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.cautions.map((caution, index) => (
            <div key={index} className="flex gap-2">
              <Select
                value={caution.type}
                onValueChange={(v) => updateCaution(index, 'type', v)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warning">警告</SelectItem>
                  <SelectItem value="info">提示</SelectItem>
                  <SelectItem value="success">成功</SelectItem>
                  <SelectItem value="error">禁止</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={caution.content}
                onChange={(e) => updateCaution(index, 'content', e.target.value)}
                placeholder="注意事项内容..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeCaution(index)}
                disabled={formData.cautions.length === 1}
              >
                ×
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 常用话术 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span>💬</span> 常用话术
            </span>
            <Button type="button" variant="outline" size="sm" onClick={addScript}>
              + 添加话术
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(formData.scripts || []).map((script, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={script}
                onChange={(e) => updateScript(index, e.target.value)}
                placeholder={`话术模板 ${index + 1}，如: "根据您的情况，初步来看可以借到$XXX左右..."`}
                className="min-h-[60px]"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeScript(index)}
              >
                ×
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 标签 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🏷️</span> 标签
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
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
          <div className="flex flex-wrap gap-1">
            {['新人必读', 'Pre-Approval', 'Settlement', '文件清单', '问题处理', '合规'].map(
              (tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => {
                    if (!formData.tags.includes(tag)) {
                      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
                    }
                  }}
                  disabled={formData.tags.includes(tag)}
                >
                  + {tag}
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* 提交按钮 */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => onPreview(formData)}
        >
          👁️ 预览Markdown
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '保存中...' : '💾 保存指南'}
        </Button>
        <Button
          type="button"
          className="bg-green-600 hover:bg-green-700"
          disabled={isLoading}
        >
          🔄 保存并同步到Dify
        </Button>
      </div>
    </form>
  )
}
