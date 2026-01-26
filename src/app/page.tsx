'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { CaseForm } from '@/components/cases/case-form'
import { CaseList } from '@/components/cases/case-list'
import { GuideForm } from '@/components/guides/guide-form'
import { GuidePreview } from '@/components/guides/guide-preview'
import { UserNav } from '@/components/layout/user-nav'
import { ExpertRulesTab } from '@/components/expert-rules/expert-rules-tab'
import { Case, CaseInsert } from '@/types/database'
import {
  OperationGuide,
  GUIDE_CATEGORY_LABELS,
} from '@/types/operation-guide'
import { LENDERS } from '@/lib/constants'

export default function Home() {
  const [activeTab, setActiveTab] = useState('list')
  const [cases, setCases] = useState<Case[]>([])
  const [editingCase, setEditingCase] = useState<Case | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    synced: 0,
    pending: 0,
  })

  // 操作指南相关状态
  const [previewGuide, setPreviewGuide] = useState<OperationGuide | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // 加载案例列表
  const loadCases = useCallback(async () => {
    try {
      const response = await fetch('/api/cases')
      if (response.ok) {
        const data = await response.json()
        setCases(data)
        updateStats(data)
      }
    } catch {
      toast.error('加载案例失败')
    }
  }, [])

  const updateStats = (caseList: Case[]) => {
    setStats({
      total: caseList.length,
      synced: caseList.filter((c) => c.synced_to_dify).length,
      pending: caseList.filter((c) => !c.synced_to_dify).length,
    })
  }

  useEffect(() => {
    loadCases()
  }, [loadCases])

  // 保存案例
  const handleSave = async (data: CaseInsert) => {
    setIsLoading(true)
    try {
      if (editingCase) {
        const response = await fetch(`/api/cases/${editingCase.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (response.ok) {
          toast.success('案例更新成功')
          setEditingCase(null)
          setActiveTab('list')
          loadCases()
        } else {
          throw new Error('Update failed')
        }
      } else {
        const response = await fetch('/api/cases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (response.ok) {
          toast.success('案例创建成功')
          setActiveTab('list')
          loadCases()
        } else {
          throw new Error('Create failed')
        }
      }
    } catch {
      toast.error('保存失败')
    } finally {
      setIsLoading(false)
    }
  }

  // 编辑案例
  const handleEdit = (caseData: Case) => {
    setEditingCase(caseData)
    setActiveTab('new')
  }

  // 删除案例
  const handleDelete = async (caseData: Case) => {
    if (!confirm(`确定删除案例 ${caseData.case_id}?`)) return

    try {
      const response = await fetch(`/api/cases/${caseData.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        toast.success('案例已删除')
        loadCases()
      } else {
        throw new Error('Delete failed')
      }
    } catch {
      toast.error('删除失败')
    }
  }

  // 同步单个案例
  const handleSync = async (caseData: Case) => {
    try {
      const response = await fetch(`/api/cases/${caseData.id}/sync`, {
        method: 'POST',
      })
      if (response.ok) {
        toast.success(`${caseData.case_id} 同步成功`)
        loadCases()
      } else {
        throw new Error('Sync failed')
      }
    } catch {
      toast.error('同步失败')
    }
  }

  // 同步所有待同步案例
  const handleSyncAll = async () => {
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
      })
      if (response.ok) {
        const result = await response.json()
        toast.success(`同步完成: ${result.synced} 成功, ${result.failed} 失败`)
        loadCases()
      } else {
        throw new Error('Sync all failed')
      }
    } catch {
      toast.error('批量同步失败')
    }
  }

  // 保存操作指南
  const handleSaveGuide = async (data: OperationGuide) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/guides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        toast.success('操作指南保存成功！')
        setActiveTab('guides')
      } else {
        throw new Error('Save failed')
      }
    } catch {
      toast.error('保存失败')
    } finally {
      setIsLoading(false)
    }
  }

  // 预览操作指南
  const handlePreviewGuide = (data: OperationGuide) => {
    setPreviewGuide(data)
    setShowPreview(true)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                贷款知识库管理系统
              </h1>
              <p className="text-sm text-muted-foreground">
                Loan Case Knowledge Base
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right text-sm">
                <p className="text-muted-foreground">
                  案例总数:{' '}
                  <span className="font-bold text-blue-600">{stats.total}</span>
                </p>
                <p className="text-muted-foreground">
                  已同步:{' '}
                  <span className="font-bold text-green-600">{stats.synced}</span>
                </p>
              </div>
              <Button
                onClick={handleSyncAll}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={stats.pending === 0}
              >
                同步全部到Dify ({stats.pending})
              </Button>
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation & Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="list" onClick={() => setEditingCase(null)}>
              📋 案例列表
            </TabsTrigger>
            <TabsTrigger value="new" onClick={() => setEditingCase(null)}>
              ➕ 新增案例
            </TabsTrigger>
            <TabsTrigger value="guides">📚 操作指南</TabsTrigger>
            <TabsTrigger value="new-guide">✏️ 创建指南</TabsTrigger>
            <TabsTrigger value="policies">📜 Lender政策</TabsTrigger>
            <TabsTrigger value="sync">⚙️ 同步管理</TabsTrigger>
            <TabsTrigger value="expert-rules">🧠 专家逻辑矩阵</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <CaseList
              cases={cases}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSync={handleSync}
            />
          </TabsContent>

          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingCase
                    ? `✏️ 编辑案例: ${editingCase.case_id}`
                    : '➕ 新增案例'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CaseForm
                  initialData={editingCase}
                  onSave={handleSave}
                  onCancel={() => {
                    setEditingCase(null)
                    setActiveTab('list')
                  }}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 操作指南列表 */}
          <TabsContent value="guides">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>📚 操作指南库</span>
                  <Button onClick={() => setActiveTab('new-guide')}>
                    ✏️ 创建新指南
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(GUIDE_CATEGORY_LABELS).map(([key, label]) => (
                    <Card
                      key={key}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <CardContent className="pt-4">
                        <h3 className="font-bold text-lg mb-2">{label}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {key === 'sop' && '客户咨询、Pre-Approval、正式申请等流程'}
                          {key === 'document' && 'PAYG、Self-employed 等文件清单'}
                          {key === 'troubleshoot' && '估价不足、申请被拒等问题处理'}
                          {key === 'lender' && '各Lender系统操作、BDM联系方式'}
                          {key === 'compliance' && '合规要求、风控要点'}
                          {key === 'template' && '邮件、短信沟通模板'}
                        </p>
                        <Badge variant="outline">点击查看</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">
                    💡 如何使用操作指南生成器
                  </h4>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>点击"创建新指南"按钮</li>
                    <li>选择指南分类和子分类</li>
                    <li>填写流程步骤、检查清单、常见问题等</li>
                    <li>点击"预览Markdown"查看生成效果</li>
                    <li>保存后自动同步到Dify知识库</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 创建操作指南 */}
          <TabsContent value="new-guide">
            <Card>
              <CardHeader>
                <CardTitle>✏️ 创建操作指南</CardTitle>
              </CardHeader>
              <CardContent>
                <GuideForm
                  onSave={handleSaveGuide}
                  onPreview={handlePreviewGuide}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies">
            <Card>
              <CardHeader>
                <CardTitle>📜 Lender政策管理</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {LENDERS.filter((l) => l !== '其他').map((lender) => (
                    <Card
                      key={lender}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <CardContent className="pt-4">
                        <h3 className="font-bold text-lg">{lender}</h3>
                        <p className="text-sm text-muted-foreground">
                          5 个政策文档
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-green-600">
                            签证
                          </Badge>
                          <Badge variant="outline" className="text-blue-600">
                            LVR
                          </Badge>
                          <Badge variant="outline" className="text-yellow-600">
                            收入
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <p className="text-center text-muted-foreground mt-8">
                  Lender政策管理功能即将上线
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sync">
            <Card>
              <CardHeader>
                <CardTitle>⚙️ Dify同步管理</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 同步状态 */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-4">同步状态</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-3xl font-bold text-blue-600">
                          {stats.total}
                        </p>
                        <p className="text-sm text-muted-foreground">总案例</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-3xl font-bold text-green-600">
                          {stats.synced}
                        </p>
                        <p className="text-sm text-muted-foreground">已同步</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-3xl font-bold text-orange-600">
                          {stats.pending}
                        </p>
                        <p className="text-sm text-muted-foreground">待同步</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Dify配置 */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-4">Dify配置</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <Input type="password" placeholder="sk-..." disabled />
                      <p className="text-xs text-muted-foreground">
                        在 .env.local 文件中配置
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Dataset ID</Label>
                      <Input
                        type="text"
                        placeholder="your-dataset-id"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSyncAll}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={stats.pending === 0}
                >
                  🚀 立即同步所有待同步案例 ({stats.pending})
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 专家逻辑矩阵 */}
          <TabsContent value="expert-rules">
            <ExpertRulesTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* 预览对话框 */}
      <GuidePreview
        guide={previewGuide}
        open={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  )
}
