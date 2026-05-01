import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createCronClient } from '@/utils/supabase/cron-client'

/**
 * Cron job to keep Supabase database active and prevent pause on free plan.
 * 
 * This endpoint can be called by:
 * - Vercel Cron (built-in): https://vercel.com/docs/cron-jobs
 * - External services: EasyCron, UptimeRobot, etc.
 * - Manually for testing
 * 
 * Recommended frequency: Every 6 hours to keep database active
 */
export async function GET(request: NextRequest) {
  try {
    // Optional: Verify cron secret if environment variable is set
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret) {
      const authHeader = request.headers.get('authorization')
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const supabase = createCronClient()
    const timestamp = new Date().toISOString()

    // Make a simple query to keep database active
    const { data, error, count } = await supabase
      .from('customer')
      .select('id', { count: 'exact', head: true })
      .limit(1)

    if (error) {
      console.error('❌ Keep-alive check failed:', error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          timestamp,
        },
        { status: 500 }
      )
    }

    console.log('✅ Database keep-alive check successful', {
      timestamp,
      recordCount: count,
      endpoint: '/api/cron/keep-alive',
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Database keep-alive check completed',
        timestamp,
        recordCount: count,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Cron job error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// Also handle POST for compatibility with various cron services
export const POST = GET
