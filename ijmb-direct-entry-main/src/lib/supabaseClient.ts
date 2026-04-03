import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uytvgzpxhuzhzhhvpnbm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dHZnenB4aHV6aHpoaHZwbmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NjU0MDgsImV4cCI6MjA4ODA0MTQwOH0.L6i9EmhGkAvIgBNTWcp9USLgZMynUAs6T540mNMfL3c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
