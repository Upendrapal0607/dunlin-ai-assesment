// lib/supabaseClient.ts

import { createBrowserClient } from "@supabase/ssr";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "supabaseurl";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "supabasekey";
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
