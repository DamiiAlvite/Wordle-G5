import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://gvwfwuoqdwubrriqsexp.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2d2Z3dW9xZHd1YnJyaXFzZXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzExNjQsImV4cCI6MjA2NDgwNzE2NH0.3HTbKjsaQyWFBU9dzgHK7GxUIJse6UQm0wHMfZCHD0Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});