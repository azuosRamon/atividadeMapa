const mapa = {
    cargos : {
        tabela: {nome: "cargos", lista:["cargo_id", "nome_cargo"], camposPesquisa:false, mostrar: true},
        operacao: 0,
        campos:{
            cargo_id: {valor: 0, tipo: "number", campo:"input", texto:"Id", nome:"id"},
            nome_cargo: {valor: "", tipo: "text", campo:"input", texto:"Nome:", nome:"nome"},
            empresa_id: {valor: "", tipo: "text", campo:"select", texto:"Empresa", nome:"empresa_id",tabela:"empresas", lista:["nome_empresa"]}
        },
        }
}

export default mapa
