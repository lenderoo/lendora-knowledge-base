import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { guideToMarkdown } from '@/lib/guide-generator'

// GET /api/guides/[id] - 获取单个操作指南
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('operation_guides')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/guides/[id] - 更新操作指南
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    // 重新生成 Markdown
    const markdownContent = guideToMarkdown(body)

    const { data, error } = await supabase
      .from('operation_guides')
      .update({
        title: body.title,
        category: body.category,
        sub_category: body.subCategory,
        applicable_scenario: body.applicableScenario,
        prerequisites: body.prerequisites,
        steps: body.steps,
        faqs: body.faqs,
        cautions: body.cautions,
        related_links: body.relatedLinks,
        scripts: body.scripts,
        author: body.author,
        version: body.version,
        tags: body.tags,
        markdown_content: markdownContent,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/guides/[id] - 删除操作指南
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from('operation_guides')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
