const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://fyzijbdxwqoyjnyulpfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5emlqYmR4d3FveWpueXVscGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMzc2MzAsImV4cCI6MjA3MzcxMzYzMH0.qU8tFvohN3vTdRHIfC_tKLSW8CXSQp6zDqBwwtXuvWQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectViews() {
    // Query list of views using RPC or catalog tables if possible.
    // Since we only have the anon key, we might not have select permissions on pg_catalog tables, but let's try.
    const { data, error } = await supabase.from('usuarios_empresas').select('*').limit(1);
    console.log('Error querying usuarios_empresas directly:', error);
    
    // We can also try querying view_pesquisa_aulas or any other table names.
    // Let's try querying standard views.
    const { data: viewData, error: viewError } = await supabase.rpc('get_views');
    console.log('get_views RPC:', viewData, viewError);
}
inspectViews();
