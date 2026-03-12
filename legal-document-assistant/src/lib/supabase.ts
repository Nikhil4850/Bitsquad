import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wsljtenmounwsjzduxxf.supabase.co';
const supabaseAnonKey = 'sb_publishable_1QwcCrAHeHnF57GIkofj_g_0ILmNwNe';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
