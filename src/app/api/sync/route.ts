import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncCaseToDify } from '@/lib/dify'
import { Case } from '@/types/database'

// POST /api/sync - 同步所有未同步的案例到 Dify
export async function POST(request: NextRequest) {
  void request // unused but required by Next.js
  try {
    const supabase = await createClient()

    // 获取所有未同步的案例
    const { data: cases, error: fetchError } = await supabase
      .from('cases')
      .select('*')
      .eq('synced_to_dify', false)

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!cases || cases.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No cases to sync',
        synced: 0,
        failed: 0,
      })
    }

    const results = {
      synced: 0,
      failed: 0,
      errors: [] as string[],
    }

    // 逐个同步案例
    for (const caseData of cases as Case[]) {
      try {
        const difyDocumentId = await syncCaseToDify(caseData)

        // 更新同步状态
        await supabase
          .from('cases')
          .update({
            synced_to_dify: true,
            dify_document_id: difyDocumentId,
          })
          .eq('id', caseData.id)

        // 记录成功日志
        await supabase.from('sync_logs').insert({
          sync_type: 'cases',
          record_id: caseData.id,
          record_identifier: caseData.case_id,
          action: 'create',
          status: 'success',
          dify_document_id: difyDocumentId,
        })

        results.synced++
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        results.failed++
        results.errors.push(`${caseData.case_id}: ${errorMessage}`)

        // 记录失败日志
        await supabase.from('sync_logs').insert({
          sync_type: 'cases',
          record_id: caseData.id,
          record_identifier: caseData.case_id,
          action: 'create',
          status: 'failed',
          error_message: errorMessage,
        })
      }
    }

    return NextResponse.json({
      success: true,
      synced: results.synced,
      failed: results.failed,
      errors: results.errors,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/sync - 获取同步状态
export async function GET() {
  try {
    const supabase = await createClient()

    // 获取案例统计
    const { count: totalCases } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })

    const { count: syncedCases } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
      .eq('synced_to_dify', true)

    const { count: pendingCases } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
      .eq('synced_to_dify', false)

    // 获取最近的同步日志
    const { data: recentLogs } = await supabase
      .from('sync_logs')
      .select('*')
      .order('synced_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      cases: {
        total: totalCases || 0,
        synced: syncedCases || 0,
        pending: pendingCases || 0,
      },
      recentLogs: recentLogs || [],
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
