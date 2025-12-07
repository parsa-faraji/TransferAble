import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wgvvcsguyhwjjmlmxkyd.supabase.co'
const supabaseAccessToken = process.env.SUPABASE_ACCESS_TOKEN || ''

if (!supabaseAccessToken) {
  throw new Error('Missing Supabase access token. Please set SUPABASE_ACCESS_TOKEN in your .env file')
}

export const supabase = createClient(supabaseUrl, supabaseAccessToken, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

