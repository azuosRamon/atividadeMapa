import React, { useState, useEffect } from "react";
import Box from "../SubBox";
import Select from "../SubSelect";
import Label from "../SubLabel";
import TabelaCompleta from "../SubTabela";
import Colapse from "../SubColapse";
import { supabase } from "/supabaseClient";

function ConfigurarEdificio({ usuarioLogado }) {
    const [operacao, setOperacao] = useState(0);
    const [tabelaDados, setTabelaDados] = useState([]);
    const [loading, setLoading] = useState(false);

    const empresaId = usuarioLogado?.empresa_id;

    const colunasTabela = [
        ["id", "nome", "cidade", "logradouro"], // 0: Campus (imoveis)
        ["id", "nome", "campusId"],             // 1: Blocos
        ["id", "numero", "blocoId"],            // 2: Pavimentos
        ["id", "nome", "sobrenome", "funcao"],   // 3: Pessoas
        ["id", "ano", "semestre", "inicio", "termino"], // 4: Horarios
        ["id", "numero", "apelido", "pavimentoId"], // 5: Salas (comodos)
        ["id", "nome"],                         // 6: Cursos (categorias)
        ["id", "disciplinaId", "cursoId", "pessoasId", "diaSemana"] // 7: Quadro de Aulas
    ];

    useEffect(() => {
        let active = true;
        async function carregarDados() {
            if (!empresaId) {
                setTabelaDados([]);
                return;
            }
            setLoading(true);
            try {
                let queryData = [];
                if (operacao === 0) {
                    // Campus (imoveis)
                    const { data, error } = await supabase
                        .from("imoveis")
                        .select("imovel_id, nome, cidade, logradouro")
                        .eq("empresa_id", empresaId)
                        .order("nome", { ascending: true });
                    if (error) throw error;
                    queryData = (data || []).map(item => ({
                        id: item.imovel_id,
                        nome: item.nome || "",
                        cidade: item.cidade || "",
                        logradouro: item.logradouro || ""
                    }));
                } else if (operacao === 1) {
                    // Blocos
                    const { data, error } = await supabase
                        .from("blocos")
                        .select("bloco_id, nome, imovel_id")
                        .eq("empresa_id", empresaId)
                        .order("nome", { ascending: true });
                    if (error) throw error;
                    queryData = (data || []).map(item => ({
                        id: item.bloco_id,
                        nome: item.nome || "",
                        campusId: item.imovel_id
                    }));
                } else if (operacao === 2) {
                    // Pavimentos
                    const { data, error } = await supabase
                        .from("pavimentos")
                        .select("pavimento_id, numero, bloco_id")
                        .eq("empresa_id", empresaId)
                        .order("numero", { ascending: true });
                    if (error) throw error;
                    queryData = (data || []).map(item => ({
                        id: item.pavimento_id,
                        numero: item.numero,
                        blocoId: item.bloco_id
                    }));
                } else if (operacao === 3) {
                    // Pessoas
                    const { data, error } = await supabase
                        .from("usuarios_empresas")
                        .select(`
                            id,
                            usuario_id,
                            usuarios!inner (
                                nome,
                                sobrenome
                            ),
                            funcoes (
                                nome
                            )
                        `)
                        .eq("empresa_id", empresaId);
                    if (error) throw error;
                    queryData = (data || []).map(item => ({
                        id: item.usuario_id,
                        nome: item.usuarios?.nome || "",
                        sobrenome: item.usuarios?.sobrenome || "",
                        funcao: item.funcoes?.nome || "Funcionário"
                    }));
                } else if (operacao === 4) {
                    // Horarios
                    const { data, error } = await supabase
                        .from("horarios")
                        .select("horario_id, ano, semestre, hora_inicio, hora_termino")
                        .eq("empresa_id", empresaId)
                        .order("hora_inicio", { ascending: true });
                    if (error) throw error;
                    queryData = (data || []).map(item => ({
                        id: item.horario_id,
                        ano: item.ano,
                        semestre: item.semestre,
                        inicio: item.hora_inicio || "",
                        termino: item.hora_termino || ""
                    }));
                } else if (operacao === 5) {
                    // Salas
                    const { data, error } = await supabase
                        .from("comodos")
                        .select("comodo_id, numero, apelido, pavimento_id")
                        .eq("empresa_id", empresaId)
                        .order("numero", { ascending: true });
                    if (error) throw error;
                    queryData = (data || []).map(item => ({
                        id: item.comodo_id,
                        numero: item.numero,
                        apelido: item.apelido || "",
                        pavimentoId: item.pavimento_id
                    }));
                } else if (operacao === 6) {
                    // Cursos
                    const { data, error } = await supabase
                        .from("categorias")
                        .select("categoria_id, nome")
                        .eq("empresa_id", empresaId)
                        .order("nome", { ascending: true });
                    if (error) throw error;
                    queryData = (data || []).map(item => ({
                        id: item.categoria_id,
                        nome: item.nome || ""
                    }));
                } else if (operacao === 7) {
                    // Quadro de Aulas
                    const { data, error } = await supabase
                        .from("quadro_de_funcionamento")
                        .select("funcionamento_id, produto_id, categoria_id, usuario_id, dia_da_semana")
                        .eq("empresa_id", empresaId);
                    if (error) throw error;
                    queryData = (data || []).map(item => ({
                        id: item.funcionamento_id,
                        disciplinaId: item.produto_id,
                        cursoId: item.categoria_id,
                        pessoasId: item.usuario_id,
                        diaSemana: item.dia_da_semana
                    }));
                }

                if (active) {
                    setTabelaDados(queryData);
                }
            } catch (err) {
                console.error("Erro ao carregar dados da tabela:", err);
            } finally {
                if (active) setLoading(false);
            }
        }

        carregarDados();
        return () => {
            active = false;
        };
    }, [operacao, empresaId]);

    return (
        <Box>
            <div>
                <Label htmlFor="operacao">Selecione a tabela a visualizar:</Label>
                <Select 
                    autoFocus 
                    id="operacao" 
                    name="operacao" 
                    required 
                    value={operacao}
                    onChange={(e) => { setOperacao(Number(e.target.value)) }}
                >
                    {["Campus", "Blocos", "Pavimentos", "Pessoas", "Horarios", "Salas", "Cursos", "Quadro de Aulas"].map((nome, idx) => (
                        <option key={idx} value={idx}>
                            {nome}
                        </option>
                    ))}
                </Select>
                {loading ? (
                    <div style={{ padding: "20px 0", color: "#fff", textAlign: "center" }}>Carregando dados...</div>
                ) : (
                    <TabelaCompleta 
                        key={operacao} 
                        dados={tabelaDados} 
                        lista={colunasTabela[operacao]} 
                        exportar={true} 
                    />
                )}
            </div>
        </Box>
    );
}

export default ConfigurarEdificio;