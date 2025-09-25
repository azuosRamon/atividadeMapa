const mapa = {
    cargos : {
        tabela: {nome: "cargos", lista:["cargo_id", "nome_cargo"], camposPesquisa:false, mostrar: true},
        operacao: 0,
        campos:{
            cargo_id: {valor: null, tipo: "number", campo:"input", nome:"id"},
            nome_cargo: {valor: "", tipo: "text", campo:"input", texto:"Nome:"},
            empresa_id: {valor: "", tipo: "text", campo:"select", texto:"Empresa"}
        }
        }
}

export default mapa
