'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Case } from '@/types/database'
import { CLIENT_TYPES, LENDERS, RESULTS } from '@/lib/constants'

interface CaseListProps {
  cases: Case[]
  onEdit: (caseData: Case) => void
  onDelete: (caseData: Case) => void
  onSync: (caseData: Case) => void
}

export function CaseList({ cases, onEdit, onDelete, onSync }: CaseListProps) {
  const [filter, setFilter] = useState({
    client_type: '',
    lender: '',
    result: '',
  })
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCases = cases.filter((c) => {
    if (filter.client_type && c.client_type !== filter.client_type) return false
    if (filter.lender && c.lender !== filter.lender) return false
    if (filter.result && c.final_outcome !== filter.result) return false
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        c.case_id?.toLowerCase().includes(search) ||
        c.primary_concern?.toLowerCase().includes(search) ||
        c.decision_logic_summary?.toLowerCase().includes(search) ||
        c.future_instruction?.toLowerCase().includes(search)
      )
    }
    return true
  })

  const getResultVariant = (result: string | null) => {
    switch (result) {
      case '成功':
        return 'default'
      case '失败':
        return 'destructive'
      case '进行中':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {/* 搜索和筛选 */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            type="text"
            placeholder="🔍 搜索案例..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            value={filter.client_type}
            onValueChange={(value) =>
              setFilter({ ...filter, client_type: value === 'all' ? '' : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="所有客户类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有客户类型</SelectItem>
              {CLIENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filter.lender}
            onValueChange={(value) =>
              setFilter({ ...filter, lender: value === 'all' ? '' : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="所有Lender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有Lender</SelectItem>
              {LENDERS.map((lender) => (
                <SelectItem key={lender} value={lender}>
                  {lender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filter.result}
            onValueChange={(value) =>
              setFilter({ ...filter, result: value === 'all' ? '' : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="所有结果" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有结果</SelectItem>
              {RESULTS.map((result) => (
                <SelectItem key={result} value={result}>
                  {result}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* 案例列表 */}
      <div className="space-y-3">
        {filteredCases.map((c) => (
          <Card
            key={c.id}
            className="p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-blue-600">{c.case_id}</span>
                  <Badge variant={getResultVariant(c.final_outcome)}>{c.final_outcome || '待定'}</Badge>
                  {c.synced_to_dify && (
                    <Badge variant="outline" className="text-purple-600 border-purple-300">
                      已同步
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>客户:</strong> {c.client_type} | {c.visa_status} | 收入{' '}
                    {formatCurrency(c.annual_income)}
                  </p>
                  <p>
                    <strong>贷款:</strong> {c.loan_purpose} | {formatCurrency(c.loan_amount)} |
                    LVR {c.lvr}%
                  </p>
                  <p>
                    <strong>Lender:</strong> {c.lender} | {c.product_type}
                  </p>
                  <p className="text-muted-foreground truncate">
                    <strong>经验:</strong> {c.future_instruction || c.decision_one_liner}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {c.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(c)}
                  title="编辑"
                >
                  ✏️
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSync(c)}
                  title="同步到Dify"
                  disabled={c.synced_to_dify}
                >
                  🔄
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(c)}
                  title="删除"
                  className="hover:text-destructive"
                >
                  🗑️
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-4xl mb-2">📭</p>
          <p>没有找到匹配的案例</p>
        </div>
      )}
    </div>
  )
}
