import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cpxrfdctmbxpmlnnmapg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNweHJmZGN0bWJ4cG1sbm5tYXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MzE4OTMsImV4cCI6MjA2MzIwNzg5M30.e8wRs5KITlJGCEfEyNKHyA_eaPWbw4GePL2p9RbPM3I'

export const supabase = createClient(supabaseUrl, supabaseKey)