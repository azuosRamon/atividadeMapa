const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://fyzijbdxwqoyjnyulpfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5emlqYmR4d3FveWpueXVscGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMzc2MzAsImV4cCI6MjA3MzcxMzYzMH0.qU8tFvohN3vTdRHIfC_tKLSW8CXSQp6zDqBwwtXuvWQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  try {
    // 1. Sign up/in a test user
    const email = `test_${Date.now()}@gmail.com`;
    const password = 'Password123!';
    console.log(`Signing up user: ${email}...`);
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email,
      password
    });
    if (authErr) throw authErr;
    console.log("User signed up successfully. UID:", authData.user.id);

    // 2. Insert user profile into public.usuarios (since triggers or policies might require it)
    console.log("Inserting user profile...");
    const randSuffix = String(Math.floor(100 + Math.random() * 900)); // 3 digits
    const { data: userProfile, error: profileErr } = await supabase.from('usuarios').insert({
      user_id: authData.user.id,
      nome: 'Test',
      sobrenome: 'User',
      cpf: `123.456.789-${randSuffix.substring(1)}`, // exactly 14 chars
      email,
      rede_social: `test_${Date.now()}`
    }).select().single();
    if (profileErr) throw profileErr;
    console.log("User profile inserted. usuario_id:", userProfile.usuario_id);

    // 3. Insert a company associated with this user
    console.log("Inserting company...");
    const { data: company, error: compErr } = await supabase.from('empresas').insert({
      user_id: authData.user.id,
      nome: 'Test Company',
      cnpj: `12.345.678/0001-${randSuffix.substring(1)}`, // exactly 18 chars
      telefone: '1234567890',
      email: `company_${Date.now()}@gmail.com`,
      visibilidade: true
    }).select().single();
    if (compErr) throw compErr;
    console.log("Company inserted:", company.empresa_id);

    // 4. Create a record in usuarios_empresas linking this user to the company with a function that can edit (e.g. 6, 7, 9, 10)
    console.log("Creating user-company link with edit permission...");
    // Let's first check if function 6 exists or insert function 6
    let funcaoId = 6;
    const { data: funcCheck } = await supabase.from('funcoes').select('*').eq('funcao_id', funcaoId).maybeSingle();
    if (!funcCheck) {
      // If function 6 doesn't exist, let's find or insert a function
      const { data: allFuncs } = await supabase.from('funcoes').select('*');
      if (allFuncs && allFuncs.length > 0) {
        funcaoId = allFuncs[0].funcao_id;
        console.log(`Using existing function_id: ${funcaoId}`);
      } else {
        // We might not have permission to insert functions as admin, but let's try
        const { data: newFunc, error: newFuncErr } = await supabase.from('funcoes').insert({ funcao_id: 6, nome: 'Gerente' }).select().single();
        if (newFuncErr) {
          console.log("Could not insert function, trying to select...");
        } else {
          funcaoId = newFunc.funcao_id;
        }
      }
    }
    
    // Insert a cargo
    console.log("Inserting cargo...");
    const { data: cargo, error: cargoErr } = await supabase.from('cargos').insert({
      nome: 'Manager',
      empresa_id: company.empresa_id
    }).select().single();
    if (cargoErr) throw cargoErr;

    const { data: link, error: linkErr } = await supabase.from('usuarios_empresas').insert({
      matricula: 12345,
      usuario_id: userProfile.usuario_id,
      empresa_id: company.empresa_id,
      funcao_id: funcaoId,
      cargo_id: cargo.cargo_id
    }).select().single();
    if (linkErr) throw linkErr;
    console.log("Linked user to company.");

    // 5. Insert a test block
    console.log("Inserting block...");
    const { data: block, error: blockErr } = await supabase.from('blocos').insert({
      nome: 'Block A',
      imovel_id: null, // wait, imovel_id is required NOT NULL in public.blocos!
      // Let's first insert an imovel
      empresa_id: company.empresa_id
    });
    // Wait, let's insert imovel first
    console.log("Inserting imovel...");
    const { data: imovel, error: imovelErr } = await supabase.from('imoveis').insert({
      nome: 'Campus Main',
      logradouro: 'Rua A',
      complemento: 'Sala 1',
      cidade: 'Cidade',
      estado: 'Estado',
      empresa_id: company.empresa_id
    }).select().single();
    if (imovelErr) throw imovelErr;

    console.log("Inserting block...");
    const { data: blockObj, error: blockObjErr } = await supabase.from('blocos').insert({
      nome: 'Block A',
      imovel_id: imovel.imovel_id,
      empresa_id: company.empresa_id
    }).select().single();
    if (blockObjErr) throw blockObjErr;

    // 6. Insert a test pavement
    console.log("Inserting pavement...");
    const { data: pavement, error: pavErr } = await supabase.from('pavimentos').insert({
      numero: 1,
      bloco_id: blockObj.bloco_id,
      imagem: 'https://example.com/pavement.png',
      empresa_id: company.empresa_id
    }).select().single();
    if (pavErr) throw pavErr;

    // 7. Insert a test room type (tipo_area)
    console.log("Inserting room type...");
    const { data: roomType, error: typeErr } = await supabase.from('tipos_areas').insert({
      nome: 'Classroom'
    }).select().single();
    if (typeErr) throw typeErr;

    // 8. Insert a test room (comodo)
    console.log("Inserting room...");
    const { data: room, error: roomErr } = await supabase.from('comodos').insert({
      numero: 101,
      apelido: 'Sala 101',
      tipo_area_id: roomType.tipo_area_id,
      pavimento_id: pavement.pavimento_id,
      lotacao: 30,
      lista_coordenadas: '[]',
      empresa_id: company.empresa_id
    }).select().single();
    if (roomErr) throw roomErr;
    console.log("Room inserted:", room.comodo_id);

    // Now query the room like LerNovosDados does
    console.log("Querying room with tipos_areas(nome)...");
    const { data: rooms, error: queryErr } = await supabase
      .from('comodos')
      .select(`*, tipos_areas(nome)`)
      .eq('comodo_id', room.comodo_id);
    if (queryErr) throw queryErr;
    
    const queriedRoom = rooms[0];
    console.log("Queried room object:", queriedRoom);

    // Let's simulate the update logic in BdSupabase.jsx:
    const campoId = 'comodo_id';
    const id = queriedRoom[campoId];
    const { [campoId]: _, ...semId } = queriedRoom;
    const camposValidos = Object.fromEntries(
      Object.entries(semId).filter(([chave]) => !chave.startsWith("_"))
    );

    console.log("camposValidos to update:", camposValidos);

    console.log(`Attempting update for id ${id}...`);
    const { data: updateData, error: updateErr } = await supabase
      .from('comodos')
      .update(camposValidos)
      .eq(campoId, id);

    if (updateErr) {
      console.log("UPDATE ERROR DETECTED:", updateErr.message, updateErr.details, updateErr.code);
    } else {
      console.log("UPDATE SUCCESS! (No error returned by Supabase client)");
    }

    // Query again to check if the database was modified
    const { data: roomsAfter, error: queryAfterErr } = await supabase
      .from('comodos')
      .select('*')
      .eq('comodo_id', room.comodo_id);
    console.log("Room after update:", roomsAfter[0]);

    // Clean up
    console.log("Cleaning up test data...");
    await supabase.from('comodos').delete().eq('comodo_id', room.comodo_id);
    await supabase.from('tipos_areas').delete().eq('tipo_area_id', roomType.tipo_area_id);
    await supabase.from('pavimentos').delete().eq('pavimento_id', pavement.pavimento_id);
    await supabase.from('blocos').delete().eq('bloco_id', blockObj.bloco_id);
    await supabase.from('imoveis').delete().eq('imovel_id', imovel.imovel_id);
    await supabase.from('usuarios_empresas').delete().eq('id', link.id);
    await supabase.from('cargos').delete().eq('cargo_id', cargo.cargo_id);
    await supabase.from('empresas').delete().eq('empresa_id', company.empresa_id);
    await supabase.from('usuarios').delete().eq('usuario_id', userProfile.usuario_id);
    console.log("Done!");

  } catch (err) {
    console.error("Test failed with exception:", err);
  }
}

runTest();
