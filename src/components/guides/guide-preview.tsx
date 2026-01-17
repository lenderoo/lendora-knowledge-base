'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { OperationGuide } from '@/types/operation-guide'
import { guideToMarkdown } from '@/lib/guide-generator'

interface GuidePreviewProps {
  guide: OperationGuide | null
  open: boolean
  onClose: () => void
}

export function GuidePreview({ guide, open, onClose }: GuidePreviewProps) {
  if (!guide) return null

  const markdown = guideToMarkdown(guide)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown)
    alert('Markdown已复制到剪贴板！')
  }

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${guide.title.replace(/[^a-z0-9\u4e00-\u9fa5]/gi, '_')}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>预览: {guide.title}</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            📋 复制Markdown
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            💾 下载文件
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <pre className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap font-mono border">
            {markdown}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  )
}
