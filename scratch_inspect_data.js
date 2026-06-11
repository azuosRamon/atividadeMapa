const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://fyzijbdxwqoyjnyulpfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5emlqYmR4d3FveWpueXVscGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMzc2MzAsImV4cCI6MjA3MzcxMzYzMH0.qU8tFvohN3vTdRHIfC_tKLSW8CXSQp6zDqBwwtXuvWQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    const { data: companies, error: errComp } = await supabase.from('empresas').select('empresa_id, nome, user_id');
    console.log('Companies:', companies, 'Error:', errComp);

    const { data: contracts, error: errCont } = await supabase.from('contratos_empresas').select('*');
    console.log('Contracts:', contracts, 'Error:', errCont);

    const { data: users, error: errUsers } = await supabase.from('usuarios').select('*');
    console.log('Users count:', users?.length, 'Error:', errUsers);
}
inspect();
