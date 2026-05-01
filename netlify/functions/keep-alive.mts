import { createClient } from '@supabase/supabase-js'

// In-source config: Netlify reads this to schedule the function
export const config = {
  schedule: '0 */6 * * *', // Every 6 hours
}

export default async function handler() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const timestamp = new Date().toISOString()

  const { error, count } = await supabase
    .from('customer')
    .select('id', { count: 'exact', head: true })
    .limit(1)

  if (error) {
    console.error('❌ Keep-alive check failed:', { error, timestamp })
    return
  }

  console.log('✅ Database keep-alive check successful', { timestamp, recordCount: count })
}
