import { createBrowserClient } from "@supabase/ssr"

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      `Missing Supabase environment variables. Please add the following to your .env.local file:
      
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

You can find these values in your Supabase project dashboard under Settings > API.
Visit: https://supabase.com/dashboard/project/_/settings/api`
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
