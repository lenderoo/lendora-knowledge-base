import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/cases - 获取案例列表
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams

    let query = supabase.from('cases').select('*').order('created_at', { ascending: false })

    // 应用筛选
    const clientType = searchParams.get('client_type')
    if (clientType) {
      query = query.eq('client_type', clientType)
    }

    const lender = searchParams.get('lender')
    if (lender) {
      query = query.eq('lender', lender)
    }

    const result = searchParams.get('result')
    if (result) {
      query = query.eq('result', result)
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

// POST /api/cases - 创建新案例
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // 生成案例编号
    const { count } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })

    const year = new Date().getFullYear()
    const caseId = `LC-${year}-${String((count || 0) + 1).padStart(4, '0')}`

    const { data, error } = await supabase
      .from('cases')
      .insert({
        ...body,
        case_id: caseId,
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
