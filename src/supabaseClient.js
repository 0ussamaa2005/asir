// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Replace these strings with your actual Project URL and Anon Key 
// found in Project Settings > API in your Supabase dashboard.
const supabaseUrl = 'https://ghwmgsizvxvdkdiopqyy.supabase.co'
const supabaseAnonKey = 'sb_publishable_TwqqcsyyMFAF_jS4XPsnkg_BIW9YXH0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)