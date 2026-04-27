const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://fyzijbdxwqoyjnyulpfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5emlqYmR4d3FveWpueXVscGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMzc2MzAsImV4cCI6MjA3MzcxMzYzMH0.qU8tFvohN3vTdRHIfC_tKLSW8CXSQp6zDqBwwtXuvWQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log("Fetching horarios...");
    const { data, error } = await supabase.from('horarios').select('*').order('horario_id', {ascending: false}).limit(5);
    console.log("Data:", data);
    console.log("Error:", error);
}
test();
