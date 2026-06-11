const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://fyzijbdxwqoyjnyulpfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5emlqYmR4d3FveWpueXVscGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMzc2MzAsImV4cCI6MjA3MzcxMzYzMH0.qU8tFvohN3vTdRHIfC_tKLSW8CXSQp6zDqBwwtXuvWQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  console.log("Testing update with non-existent column...");
  const { data, error } = await supabase
    .from('comodos')
    .update({ tipos_areas: { nome: 'Sala' } })
    .eq('comodo_id', 999999);
  
  if (error) {
    console.log("Returned Error:", error.message, "Code:", error.code);
  } else {
    console.log("Returned Success! No error.");
  }
}

runTest();
