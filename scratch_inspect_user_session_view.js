const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://fyzijbdxwqoyjnyulpfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5emlqYmR4d3FveWpueXVscGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMzc2MzAsImV4cCI6MjA3MzcxMzYzMH0.qU8tFvohN3vTdRHIfC_tKLSW8CXSQp6zDqBwwtXuvWQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    const { data, error } = await supabase.from('sessao_usuario_view').select('*').limit(1);
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Sample Row:', data);
    }
}
inspect();
