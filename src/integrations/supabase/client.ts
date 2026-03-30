import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Novas credenciais do projeto bzplgyazxquyagjjdkha
const SUPABASE_URL = "https://bzplgyazxquyagjjdkha.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6cGxneWF6eHF1eWFnampka2hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjU5MjUsImV4cCI6MjA5MDQ0MTkyNX0.V-T1kLA0g8oC3Mqlt5zvvWzE20qKSITwXOijzVmIvS8";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY, 
  {
    auth: {
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
