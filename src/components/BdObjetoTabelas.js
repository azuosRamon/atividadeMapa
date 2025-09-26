const mapa = {
    cargos : {
        tabela: {nome: "cargos", lista:["cargo_id", "nome"], camposPesquisa:false, mostrar: true},
        operacao: 0,
        campos:{
            cargo_id: {valor: null, tipo: "number", campo:"input", texto:"Id", nome:"id", mostrar: true},
            nome: {valor: "", tipo: "text", campo:"input", texto:"", nome:"nome", mostrar: true, required: true},
            empresa_id: {valor: null, tipo: "text", campo:"select", texto:"Empresa", nome:"empresa_id",tabela:"empresas", lista:["empresa_id", "nome"]}
        },
        },
        funcoes: {
            tabela : {nome: "funcoes", lista:["funcao_id", "nome"], camposPesquisa:false, mostrar: true},
            operacao: 0,
            campos: {
                funcao_id: {valor: 0, tipo: "number", campo:"input", texto:"Id", nome:"id"},
                nome: {valor: "", tipo: "text", campo:"input", texto:"Nome:", nome:"nome"},
            }
        },
        modelos: {
            tabela : {nome: "modelos", lista:["modelo_id", "nome"], camposPesquisa:false, mostrar: true},
            operacao: 0,
            campos: {
                funcao_id: {valor: 0, tipo: "number", campo:"input", texto:"", nome:"id"},
                nome: {valor: "", tipo: "text", campo:"input", texto:"", nome:"nome"},
                imoveis: {valor: "", tipo: "text", campo:"input", texto:"", nome:"imoveis"},
                comodos: {valor: "", tipo: "text", campo:"input", texto:"", nome:"comodos"},
                categorias: {valor: "", tipo: "text", campo:"input", texto:"", nome:"categorias"},
                produtos: {valor: "", tipo: "text", campo:"input", texto:"", nome:"produtos"},

            }
        },
        empresas: {
            tabela : {nome: "empresas", lista:["empresa_id", "nome"], camposPesquisa:false, mostrar: true},
            operacao: 0,
            campos: {
                empresa_id: {valor: 0, tipo: "number", campo:"input", texto:"", nome:"id"},
                
                nome: {valor: "", tipo: "text", campo:"input", texto:"", nome:"nome"},
                
                cnpj: {valor: "", tipo: "text", campo:"input", texto:"", nome:"cnpj"},
                
                telefone: {valor: "", tipo: "text", campo:"input", texto:"", nome:"telefone"},
                
                email: {valor: "", tipo: "text", campo:"input", texto:"", nome:"email"},
                
                senha: {valor: "", tipo: "text", campo:"input", texto:"", nome:"senha"},
                
                rede_social_1: {valor: "", tipo: "text", campo:"input", texto:"Rede Social", nome:"rede_social_1"},
                
                rede_social_2: {valor: "", tipo: "text", campo:"input", texto:"Rede Social", nome:"rede_social_2"},
                
                foto: {valor: "", tipo: "file", campo:"input", texto:"", nome:"foto"},
                
                informacoes_publicas: {valor: "", tipo: "checkbox", campo:"input", texto:"Informações publicas", nome:"informacoes_publicas"},
             
                modelo_id: {valor: "", tipo: "number", campo:"select", texto:"Modelo", nome:"modelo_id",tabela:"modelos", lista:["nome"]}
                
            }
        },
        contratos_empresas: {
            tabela : {
                nome: "contratos_empresas", 
                lista:["contrato_id",["empresas", "nome"]], 
                camposPesquisa:false, 
                mostrar: true
            },
            
            operacao: 0,
            
            
            campos: {
                contrato_id: {
                    valor: 0, 
                    tipo: "number", 
                    campo:"input", 
                    texto:"", 
                    nome:"id"},
                
                inicio: {
                    valor: "", 
                    tipo: "date", 
                    campo:"input", 
                    texto:"", 
                    nome:"inicio"},
                
                renovacao: {
                    valor: "", 
                    tipo: "date", 
                    campo:"input", 
                    texto:"", 
                    nome:"renovacao"
                },
                
                tempo_contrato_meses: {
                    valor: "", 
                    tipo: "number", 
                    campo:"input", 
                    texto:"", 
                    nome:"tempo_contrato_meses"
                },
                
                valor: {
                    valor: "", 
                    tipo: "number", 
                    campo:"input",
                    texto:"", 
                    nome:"valor"
                },
                
                empresa_id: {
                    valor: "", 
                    tipo: "number", 
                    campo:"select", 
                    texto:"Empresa", 
                    nome:"empresa_id",
                    tabela:"modelos", 
                    lista:["nome"]}
                    
                },
                
                qtd_comodos: {
                    valor: "", 
                    tipo: "number", 
                    campo:"input",
                    texto:"Comodos", 
                    nome:"qtd_comodos"
                },

                qtd_produtos: {
                    valor: "", 
                    tipo: "number", 
                    campo:"input",
                    texto:"Produtos", 
                    nome:"qtd_produtos"
                },

                qtd_usuarios: {
                    valor: "", 
                    tipo: "number", 
                    campo:"input",
                    texto:"Usuarios", 
                    nome:"qtd_usuarios"
                }

            },
}

export default mapa

