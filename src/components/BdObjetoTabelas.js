const capturarUsuarioLogadoLocalStorage = () => {
        let usuario = localStorage.getItem("usuario");
        if (!usuario) return null;
        try {
            let parsedUsuario = JSON.parse(usuario);
            return parsedUsuario
        } catch (error){
            console.log(error);
            return null;
        }
    }
const capturarModeloLocalStorage = () => {
        let usuario = localStorage.getItem("modelo");
        if (!usuario) return null;
        try {
            let parsedUsuario = JSON.parse(usuario);
            return parsedUsuario
        } catch (error){
            console.log(error);
            return null;
        }
    }
const usuarioLogado = capturarUsuarioLogadoLocalStorage();
const modelo = capturarModeloLocalStorage();
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
                
                rede_social_1: {valor: "", tipo: "text", campo:"input", texto:"Rede Social", nome:"rede_social_1"},
                
                rede_social_2: {valor: "", tipo: "text", campo:"input", texto:"Rede Social", nome:"rede_social_2"},
                
                imagem: {valor: "", tipo: "file", campo:"input", texto:"", nome:"imagem"},
                
                visibilidade: {valor: true, tipo: "checkbox", campo:"input", texto:"visibilidade externa", nome:"visibilidade"},
             
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
                                                
                rede_social: {valor: "", tipo: "text", campo:"input", texto:"Rede Social", nome:"rede_social"},
                
                imagem: {valor: "", tipo: "file", campo:"input", texto:"", nome:"imagem"},
                
                visibilidade: {valor: false, tipo: "checkbox", campo:"input", texto:"visibilidade externa", nome:"visibilidade"}              
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
                nome: "sessao_usuario_view",
                lista:["usuario_id","nome","empresa", "funcao"], 
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
                    nome:"matricula"},
                
                usuario_id: {
                    valor: null, 
                    tipo: "text", 
                    campo:"select", 
                    texto:"Usuario", 
                    nome:"usuario_id",
                    tabela:"usuarios", 
                    lista:["usuario_id","nome","cpf"]
                },
                empresa_id: {
                    valor: null, 
                    tipo: "text", 
                    campo:"select", 
                    texto:"Empresa", 
                    nome:"empresa_id",
                    tabela:"empresas", 
                    lista:["empresa_id","nome"],
                    mostrar: false
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
        imoveis: {
            tabela : {
                nome: "imoveis", 
                lista:["imovel_id", "nome"], 
                camposPesquisa:false, 
                mostrar: false
            },
            
            operacao: 1,
            
            
            campos: {
                imovel_id: {
                    valor: null, 
                    tipo: "number", 
                    campo:"input", 
                    texto:"", 
                    nome:"id",
                    mostrar: false
                },
                
                nome: {
                    valor: "", 
                    tipo: "text", 
                    campo:"input", 
                    texto:"", 
                    nome:"nome"},
                cep: {
                    valor: null, 
                    tipo: "text", 
                    campo:"input",
                    texto:"", 
                    nome:"cep"
                },
                cidade: {
                    valor: null, 
                    tipo: "text", 
                    campo:"input",
                    texto:"", 
                    nome:"cidade"
                },
                estado: {
                    valor: null, 
                    tipo: "text", 
                    campo:"input",
                    texto:"", 
                    nome:"estado"
                },
                
                logradouro: {
                    valor: null, 
                    tipo: "text", 
                    campo:"input", 
                    texto:"", 
                    nome:"logradouro"
                },
                
                complemento: {
                    valor: "", 
                    tipo: "text", 
                    campo:"input", 
                    texto:"", 
                    nome:"complemento"
                },
                
                latitude: {
                    valor: null, 
                    tipo: "text", 
                    campo:"input",
                    texto:"", 
                    nome:"latitude"
                },
                longitude: {
                    valor: null, 
                    tipo: "text", 
                    campo:"input",
                    texto:"", 
                    nome:"longitude"
                },
                
                empresa_id: {
                    valor: null, 
                    tipo: "text", 
                    campo:"select", 
                    texto:"Empresa", 
                    nome:"empresa_id",
                    tabela:"empresas", 
                    lista:["empresa_id","nome"],
                    mostrar: false
                }

            },
                

            },
            blocos: {
        tabela: { nome: "blocos", lista: ["bloco_id", "nome"], camposPesquisa: false, mostrar: false },
        operacao: 1,
        campos: {
            bloco_id: {  valor: null, tipo: "number", campo: "input", texto: "Id", nome: "id", mostrar: false},
            nome: { valor: "", tipo: "text", campo: "input", texto: "Nome", nome: "nome", required: true },
            imovel_id: { valor: null, tipo: "text", campo: "select", texto: "Imóvel", nome: "imovel_id", tabela: "imoveis", lista: ["imovel_id", "nome"], mostrar: false },
            empresa_id: { valor: null, tipo: "text", campo: "select", texto: "Empresa", nome: "empresa_id", tabela: "empresas", lista: ["empresa_id", "nome"], mostrar: false }
        }
    },

    // 🏷️ CATEGORIA
    categorias: {
        tabela: { nome: "categorias", lista: ["categoria_id", "nome"], camposPesquisa: false, mostrar: true },
        operacao: 0,
        campos: {
            categoria_id: { mostrar:false, valor: null, tipo: "number", campo: "input", texto: "Id", nome: "id" },
            nome: { valor: "", tipo: "text", campo: "input", texto: "Nome", nome: "nome", required: true },
            descricao: { valor: "", tipo: "text", campo: "input", texto: "Descrição", nome: "descricao" },
            empresa_id: {mostrar:false, valor: null, tipo: "text", campo: "select", texto: "Empresa", nome: "empresa_id", tabela: "empresas", lista: ["empresa_id", "nome"] }
        }
    },

    // 🏠 CÔMODO
    comodos: {
        tabela: { nome: "comodos", lista: ["comodo_id", "apelido"], camposPesquisa: false, mostrar: false},
        operacao: 1,
        campos: {
            comodo_id: { mostrar: false, valor: null, tipo: "number", campo: "input", texto: "Id", nome: "id" },
            numero: { valor: "", tipo: "number", campo: "input", texto: "Número", nome: "numero" },
            apelido: { valor: "", tipo: "text", campo: "input", texto: "Apelido", nome: "apelido" },
            tipo_area_id: { valor: null, tipo: "text", campo: "select", texto: "Tipo de Área", nome: "tipoArea", tabela: "tipos_areas", lista: ["tipo_area_id", "nome"] },
            pavimento_id: { mostrar: false, valor: null, tipo: "text", campo: "select", texto: "Pavimento", nome: "pavimento_id", tabela: "pavimentos", lista: ["pavimento_id", "numero"] },
            lotacao: { valor: "", tipo: "number", campo: "input", texto: "Lotação", nome: "lotacao" },
            lista_coordenadas: { valor: "", tipo: "text", campo: "textarea", texto: "Coordenadas", nome: "lista_coordenadas" },
            empresa_id: {mostrar: false, valor: null, tipo: "text", campo: "select", texto: "Empresa", nome: "empresa_id", tabela: "empresas", lista: ["empresa_id", "nome"] }
        }
    },

    // 📆 DISPONIBILIDADE SEMANAL
    disponibilidade_semanal: {
        tabela: { nome: "disponibilidade_semanal", lista: ["disponibilidade_id", "usuario_id"], camposPesquisa: false, mostrar: false },
        operacao: 0,
        campos: {
            disponibilidade_id: {mostrar: false, valor: null, tipo: "number", campo: "input", texto: "Id", nome: "id" },
            usuario_id: { mostrar: false, valor: null, tipo: "text", campo: "select", texto: "Usuário", nome: "usuario_id", tabela: "usuarios", lista: ["usuario_id", "nome"] },
            dia_da_semana: { valor: "", tipo: "number", campo: "input", texto: "Dia da Semana (1-7)", nome: "dia_da_semana" },
            hora_inicio: { valor: "", tipo: "time", campo: "input", texto: "Hora Início", nome: "hora_inicio" },
            hora_fim: { valor: "", tipo: "time", campo: "input", texto: "Hora Fim", nome: "hora_fim" }
        }
    },

    // ⏰ HORÁRIOS
    horarios: {
        tabela: { nome: "horarios", lista: ["horario_id", "hora_inicio"], camposPesquisa: false, mostrar: true },
        operacao: 0,
        campos: {
            horario_id: { valor: null, tipo: "number", campo: "input", texto: "Id", nome: "id" },
            hora_inicio: { valor: "", tipo: "time", campo: "input", texto: "Início", nome: "hora_inicio" },
            hora_termino: { valor: "", tipo: "time", campo: "input", texto: "Término", nome: "hora_termino" },
            ano: { valor: "", tipo: "number", campo: "input", texto: "Ano", nome: "ano" },
            semestre: { valor: "", tipo: "number", campo: "input", texto: "Semestre", nome: "semestre" },
            empresa_id: { valor: null, tipo: "text", campo: "select", texto: "Empresa", nome: "empresa_id", tabela: "empresas", lista: ["empresa_id", "nome"] }
        }
    },

    // 🧭 PAVIMENTOS
    pavimentos: {
        tabela: { nome: "pavimentos", lista: ["pavimento_id", "numero"], camposPesquisa: false, mostrar: false },
        operacao: 1,
        campos: {
            pavimento_id: { valor: null, tipo: "number", campo: "input", texto: "Id", nome: "id", mostrar:false },
            numero: { valor: "", tipo: "number", campo: "input", texto: "Número", nome: "numero" },
            bloco_id: { mostrar:false, valor: null, tipo: "text", campo: "select", texto: "Bloco", nome: "bloco_id", tabela: "blocos", lista: ["bloco_id", "nome"] },
            imagem: { valor: "", tipo: "file", campo: "input", texto: "Imagem", nome: "imagem" },
            empresa_id: { mostrar:false, valor: null, tipo: "text", campo: "select", texto: "Empresa", nome: "empresa_id", tabela: "empresas", lista: ["empresa_id", "nome"] }
        }
    },

    // 📦 PRODUTOS
    produtos: {
        tabela: { nome: "produtos", lista: ["produtos_id", "nome"], camposPesquisa: false, mostrar: true },
        operacao: 0,
        campos: {
            produtos_id: { mostrar:false, valor: null, tipo: "number", campo: "input", texto: "Id", nome: "id" },
            nome: { valor: "", tipo: "text", campo: "input", texto: "Nome", nome: "nome", required: true },
            descricao: {mostrar:false, valor: null, tipo: "text", campo: "input", texto: "Descrição", nome: "descricao" },
            valor: {mostrar:false, valor: null, tipo: "number", campo: "input", texto: "Valor", nome: "valor" },
            imagem: {mostrar:false, valor: null, tipo: "file", campo: "input", texto: "Imagem", nome: "imagem" },
            empresa_id: { mostrar:false, valor: null, tipo: "text", campo: "select", texto: "Empresa", nome: "empresa_id", tabela: "empresas", lista: ["empresa_id", "nome"] }
        }
    },

    // 🏗️ TIPOS DE ÁREAS
    tipos_areas: {
        tabela: { nome: "tipos_areas", lista: ["tipo_area_id", "nome"], camposPesquisa: false, mostrar: true },
        operacao: 0,
        campos: {
            tipo_area_id: { valor: null, tipo: "number", campo: "input", texto: "Id", nome: "id" },
            nome: { valor: "", tipo: "text", campo: "input", texto: "Nome", nome: "nome", required: true },
        }
    },
    quadro_de_funcionamento: {
        tabela: { nome: "quadro_de_funcionamento", lista: ["funcionamento_id", "turma", "produto_id"], camposPesquisa: false, mostrar: true },
        operacao: 0,
        campos: {
            empresa_id: { mostrar: false, valor: null, tipo: "text", campo: "select", texto: "Empresa", nome: "empresa_id", tabela: "empresas", lista: ["empresa_id", "nome"] },
            funcionamento_id: { mostrar: false, valor: null, tipo: "number", campo: "input", texto: "Id", nome: "id" },
            categoria_id: { valor: null, tipo: "number", campo: "select", texto: modelo?.categorias || [], nome: "categoria", tabela: "categorias", lista: ["categoria_id","nome"], visualizar:["nome"], condicao: {coluna: "empresa_id", valor: usuarioLogado?.empresa_id}},
            produto_id: { valor: null, tipo: "number", campo: "select", texto: modelo?.produtos || [], nome: "produto", tabela: "produtos", lista: ["produto_id","nome"], visualizar:["nome"], condicao: {coluna: "empresa_id", valor: usuarioLogado?.empresa_id}},
            turma: { valor: "", tipo: "text", campo: "input", texto: "turma", nome: "turma", required: true },
            ano: { valor: "", tipo: "number", campo: "input", texto: "Ano", nome: "ano" },
            semestre: { valor: "", tipo: "number", campo: "input", texto: "Semestre", nome: "semestre" },
            horario_id: { mostrar: false, valor: "", tipo: "time", campo: "select", texto: "Horario", nome: "horario", tabela:"horarios", visualizar:["hora_inicio", "hora_termino"], lista: ["horario_id", "hora_inicio", "hora_termino"] },
            dia_da_semana: { valor: "", tipo: "number", campo: "input", texto: "Dia da Semana", nome: "dia_da_semana" },
            usuario_id: {mostrar: false, valor: null, tipo: "number", campo:"select", texto:"Funcionário(a)", nome:"usuario", tabela:"usuarios", lista: ["usuario_id", "nome"], visualizar:["nome"]},
            tipo_area_id: { valor: null, tipo: "number", campo: "select", texto: "Tipo de comodo", nome: "tipo_area", tabela:"tipos_areas", visualizar: ["nome"], lista: ["tipo_area_id","nome"] },
            ocupacao: { valor: "", tipo: "number", campo: "input", texto: "Ocupação desejada", nome: "ocupacao" },
            comodo_id: {mostrar: false, valor: null, tipo: "number", campo: "select", texto: modelo?.comodos || [], nome: "comodo_id", tabela: "comodos", lista: ["comodo_id"], visualizar: ["numero", "lotacao"], condicao: {coluna: "empresa_id", valor: usuarioLogado?.empresa_id}},
            
        }
    }
};

export default mapa

