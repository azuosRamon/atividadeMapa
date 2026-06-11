const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://fyzijbdxwqoyjnyulpfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5emlqYmR4d3FveWpueXVscGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMzc2MzAsImV4cCI6MjA3MzcxMzYzMH0.qU8tFvohN3vTdRHIfC_tKLSW8CXSQp6zDqBwwtXuvWQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const tables = [
        'empresas', 'imoveis', 'blocos', 'pavimentos', 'comodos', 
        'quadro_de_funcionamento', 'usuarios', 'usuarios_empresas', 
        'tipos_areas', 'cargos', 'funcoes'
    ];
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*');
        console.log(`Table: ${table}`);
        if (error) {
            console.error(`Error fetching ${table}:`, error.message);
        } else {
            console.log(`Rows: ${data.length}`);
            if (data.length > 0) {
                console.log(`Sample Row:`, JSON.stringify(data[0]).substring(0, 300));
            }
        }
        console.log('---');
    }
}
test();

