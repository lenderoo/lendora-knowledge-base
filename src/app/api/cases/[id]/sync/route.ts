import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncCaseToDify } from '@/lib/dify'
import { Case } from '@/types/database'

// POST /api/cases/[id]/sync - 同步单个案例到 Dify
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // 获取案例数据
    const { data: caseData, error: fetchError } = await supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 })
    }

    // 同步到 Dify
    const difyDocumentId = await syncCaseToDify(caseData as Case)

    // 更新案例同步状态
    const { data, error } = await supabase
      .from('cases')
      .update({
        synced_to_dify: true,
        dify_document_id: difyDocumentId,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 记录同步日志
    await supabase.from('sync_logs').insert({
      sync_type: 'cases',
      record_id: id,
      record_identifier: caseData.case_id,
      action: caseData.dify_document_id ? 'update' : 'create',
      status: 'success',
      dify_document_id: difyDocumentId,
    })

    return NextResponse.json({
      success: true,
      dify_document_id: difyDocumentId,
      data,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // 记录错误日志
    try {
      const { id } = await params
      const supabase = await createClient()
      await supabase.from('sync_logs').insert({
        sync_type: 'cases',
        record_id: id,
        action: 'sync',
        status: 'failed',
        error_message: errorMessage,
      })
    } catch {
      // 忽略日志记录错误
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
