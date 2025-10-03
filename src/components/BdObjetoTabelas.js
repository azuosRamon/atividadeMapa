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
                funcao_id: {valor: null, tipo: "number", campo:"input", texto:"Id", nome:"id", mostrar: true},
                nome: {valor: "", tipo: "text", campo:"input", texto:"Nome:", nome:"nome", mostrar: true, required: true},
            }
        },
        modelos: {
            tabela : {nome: "modelos", lista:["modelo_id", "nome"], camposPesquisa:false, mostrar: true},
            operacao: 0,
            campos: {
                modelo_id: {valor: null, tipo: "number", campo:"input", texto:"", nome:"id"},
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
                empresa_id: {valor: null, tipo: "number", campo:"input", texto:"", nome:"id"},
                
                nome: {valor: "", tipo: "text", campo:"input", texto:"", nome:"nome"},
                
                cnpj: {valor: "", tipo: "text", campo:"input", texto:"", nome:"cnpj"},
                
                telefone: {valor: "", tipo: "text", campo:"input", texto:"", nome:"telefone"},
                
                email: {valor: "", tipo: "text", campo:"input", texto:"", nome:"email"},
                
                senha: {valor: "", tipo: "text", campo:"input", texto:"", nome:"senha", mostrar: false},
                
                rede_social_1: {valor: "", tipo: "text", campo:"input", texto:"Rede Social", nome:"rede_social_1"},
                
                rede_social_2: {valor: "", tipo: "text", campo:"input", texto:"Rede Social", nome:"rede_social_2"},
                
                imagem: {valor: "", tipo: "file", campo:"input", texto:"", nome:"imagem"},
                
                visibilidade: {valor: "", tipo: "checkbox", campo:"input", texto:"visibilidade externa", nome:"visibilidade"},
             
                modelo_id: {valor: "", tipo: "number", campo:"select", texto:"Modelo", nome:"modelo_id",tabela:"modelos", lista:["modelo_id", "nome"]}
                
            }
        },
        usuarios: {
            tabela : {nome: "usuarios", lista:["usuario_id", "nome"], camposPesquisa:false, mostrar: true},
            operacao: 0,
            campos: {
                usuario_id: {valor: null, tipo: "number", campo:"input", texto:"", nome:"id"},
                
                nome: {valor: "", tipo: "text", campo:"input", texto:"", nome:"nome"},
                
                nascimento: {valor: "", tipo: "date", campo:"input", texto:"", nome:"nascimento"},

                cpf: {valor: "", tipo: "text", campo:"input", texto:"", nome:"cpf"},
                
                telefone: {valor: "", tipo: "text", campo:"input", texto:"", nome:"telefone"},
                
                email: {valor: "", tipo: "text", campo:"input", texto:"", nome:"email"},
                
                senha: {valor: "", tipo: "text", campo:"input", texto:"", nome:"senha", mostrar: false},
                
                pin: {valor: "", tipo: "text", campo:"input", texto:"", nome:"pin", mostrar: false},
                
                rede_social: {valor: "", tipo: "url", campo:"input", texto:"Rede Social", nome:"rede_social"},
                
                imagem: {valor: "", tipo: "file", campo:"input", texto:"", nome:"imagem"},
                
                visibilidade: {valor: "", tipo: "checkbox", campo:"input", texto:"visibilidade externa", nome:"visibilidade"}              
            }
        },

        usuarios_empresas: {
            tabela : {
                nome: "usuarios_empresas", 
                lista:["id", "matricula"], 
                camposPesquisa:false, 
                mostrar: true
            },
            view : {
                nome: "usuarios_empresas_view",
                lista:["contrato_id", "empresa", "inicio", "termino"], 
                camposPesquisa:false, 
                mostrar: true
            },
            
            operacao: 0,
            
            
            campos: {
                id: {
                    valor: null, 
                    tipo: "number", 
                    campo:"input", 
                    texto:"", 
                    nome:"id"},
                
                matricula: {
                    valor: null, 
                    tipo: "text", 
                    campo:"input", 
                    texto:"", 
                    nome:"id"},
                
                usuario_id: {
                    valor: null, 
                    tipo: "number", 
                    campo:"select", 
                    texto:"Usuario", 
                    nome:"usuario_id",
                    tabela:"usuarios", 
                    lista:["usuario_id","nome"]
                },
                empresa_id: {
                    valor: null, 
                    tipo: "number", 
                    campo:"select", 
                    texto:"Empresa", 
                    nome:"empresa_id",
                    tabela:"empresas", 
                    lista:["empresa_id","nome"]
                },
                funcao_id: {
                    valor: null, 
                    tipo: "number", 
                    campo:"select", 
                    texto:"Funcao", 
                    nome:"funcao_id",
                    tabela:"funcoes", 
                    lista:["funcao_id","nome"]
                },
                cargo_id: {
                    valor: null, 
                    tipo: "number", 
                    campo:"select", 
                    texto:"Cargo", 
                    nome:"cargo_id",
                    tabela:"cargos", 
                    lista:["cargo_id","nome"]
                },

                },
                

            },
        contratos_empresas: {
            tabela : {
                nome: "contratos_empresas", 
                lista:["contrato_id", "empresa"], 
                camposPesquisa:false, 
                mostrar: true
            },
            view : {
                nome: "contratos_empresas_view",
                lista:["contrato_id", "empresa", "inicio", "termino"], 
                camposPesquisa:false, 
                mostrar: true
            },
            
            operacao: 0,
            
            
            campos: {
                contrato_id: {
                    valor: null, 
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
                    valor: null, 
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
                    valor: null, 
                    tipo: "number", 
                    campo:"input",
                    texto:"", 
                    nome:"valor"
                },
                
                empresa_id: {
                    valor: null, 
                    tipo: "number", 
                    campo:"select", 
                    texto:"Empresa", 
                    nome:"empresa_id",
                    tabela:"empresas", 
                    lista:["empresa_id","nome"]
                },

                qtd_comodos: {
                    valor: null, 
                    tipo: "number", 
                    campo:"input",
                    texto:"Comodos", 
                    nome:"qtd_comodos"
                },

                qtd_produtos: {
                    valor: null, 
                    tipo: "number", 
                    campo:"input",
                    texto:"Produtos", 
                    nome:"qtd_produtos"
                },

                qtd_usuarios: {
                    valor: null, 
                    tipo: "number", 
                    campo:"input",
                    texto:"Usuarios", 
                    nome:"qtd_usuarios"
                }
            },
                

            },
}

export default mapa

