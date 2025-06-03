import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'ENTERURL'
const supabaseKey = 'ENTERYOURSUPABASEKEY'

export const supabase = createClient(supabaseUrl, supabaseKey)
