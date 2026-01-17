import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { guideToMarkdown } from '@/lib/guide-generator'

// GET /api/guides - 获取操作指南列表
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams

    let query = supabase
      .from('operation_guides')
      .select('*')
      .order('created_at', { ascending: false })

    // 应用筛选
    const category = searchParams.get('category')
    if (category) {
      query = query.eq('category', category)
    }

    const subCategory = searchParams.get('sub_category')
    if (subCategory) {
      query = query.eq('sub_category', subCategory)
    }

    const { data, error } = await query

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

// POST /api/guides - 创建新操作指南
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // 生成 Markdown
    const markdownContent = guideToMarkdown(body)

    const { data, error } = await supabase
      .from('operation_guides')
      .insert({
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
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
