import fs from 'fs';

let f = fs.readFileSync('src/components/menus/MenuQuadroAulas.jsx', 'utf8');

// 1. Fix Imports
f = f.replace(/import GridArea from "\.\.\/SubGridArea";\r?\nimport DivSeparador from "\.\.\/SubDivSeparador";\r?\nimport GridArea from "\.\.\/SubGridArea";\r?\nimport DivSeparador from "\.\.\/SubDivSeparador";/,
    'import GridArea from "../SubGridArea";\nimport DivSeparador from "../SubDivSeparador";');
    
f = f.replace(/import InputAutocomplete from "\.\.\/SubInputAutocomplete";/,
    'import InputAutocomplete from "../SubInputAutocomplete";\nimport SubSelectAutocomplete from "../SubSelectAutocomplete";');

// 2. Fix Usuario Label
f = f.replace(/<Label>Funcionário:<\/Label>/, '<Label>Funcionários Livres: {quantidadeProfessoresDisponiveis}</Label>');

// 3. Fix Usuario Select
f = f.replace(/<Select onChange={\(e\)=>alterarObjeto\(e, 'usuario_id'\)}>[\s\S]*?<\/Select>/, `<SubSelectAutocomplete
    dados={professores}
    itemValue="usuario_id"
    campoDesejado={["nome"]}
    listaColunas={["usuario_id"]}
    value={objeto.usuario_id}
    onChange={alterarObjeto}
    getTexto={(item) => \`\${item.usuarios.nome} | \${item.usuarios.conflito}\`}
    getBackgroundColor={(item) => {
        const status = item.usuarios.status;
        return status === "disponivel" ? cores.corDisponivel : status === "parcial" ? cores.corParcial : cores.corIndisponivel;
    }}
    getDisabled={(item) => !item.usuarios.status || item.usuarios.status === "indisponivel"}
/>`);

// 4. Fix Comodos Label
f = f.replace(/<Label>Comodos:<\/Label>/, '<Label>Comodos Livres: {qtdComodosDisponivel}</Label>');

// 5. Fix Comodos Select
f = f.replace(/<Select onChange={\(e\)=>alterarObjeto\(e, 'comodo_id'\)}>[\s\S]*?<\/Select>/, `<SubSelectAutocomplete
    dados={comodos}
    itemValue="comodo_id"
    campoDesejado={["conflito", "nome", "numero", "lotacao"]}
    listaColunas={["comodo_id"]}
    value={objeto.comodo_id}
    onChange={alterarObjeto}
    getTexto={(item) => \`\${item.conflito} | \${item.tipos_areas.nome} | Nº \${item.numero} | Lotação \${item.lotacao}\`}
    getBackgroundColor={(item) => {
        const status = item.status;
        return status === "disponivel" ? cores.corDisponivel : status === "parcial" ? cores.corParcial : cores.corIndisponivel;
    }}
    getDisabled={(item) => !item.status || item.status === "indisponivel"}
/>`);

fs.writeFileSync('src/components/menus/MenuQuadroAulas.jsx', f);
console.log("Done");
