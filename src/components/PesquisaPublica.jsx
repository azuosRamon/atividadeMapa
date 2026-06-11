import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CriarCard from "./Card";
import Box from "./SubBox";
import Button from "./SubButton";
import Input from "./SubInput";
import Select from "./SubSelect";
import Container from "./SubContainer";
import logo_cliente from "./assets/Logo_antigo.png";
import { pegarNomenclatura } from "./Nomenclaturas";
import InputAutocomplete from "./SubInputAutocomplete";
import cores from "./Cores";
import { supabase } from "/supabaseClient";

const Title = styled.h2`
margin: 0 0 20px;
color: white;
`;

const Formulario = styled.form`
    gap: 0 10px;
    display: grid;
    grid-template-columns: 1fr;
    @media (min-width: 481px) and (max-width: 968px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

const Modal = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    position: fixed;
    z-index: 999;
    overflow: auto;
    background-color: #222;
    border-radius: 5px;
    padding: 40px 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.8);
    max-height: 80%;
    `;
const ContainerModal = styled.div`
    display: ${(props)=>(props.$aberto ? "flex": "none")};
    ${(props)=>(props.$aberto ? "align-content: center; justify-content: center;    align-items: center;": '')}
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 997;
    top: 0;
    left: 0;
`;
const BackgroundModal = styled.div`
    background-color: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 998;
    top: 0;
    left: 0;
`;

const CardsContainer = styled.div`
    display: grid;
    grid-template-columns: ${(props)=>((props.$quantidade > 1 ) ? "repeat(3, 1fr)" : "1fr")};
    max-width: 90%;
    gap: 10px;
    align-items: center;
    align-content: center;
    justify-content: center;
    
    @media (max-width: 960px) {
        grid-template-columns: ${(props)=>((props.$quantidade > 1 ) ? "repeat(2, 1fr)" : "1fr")};

    }
    @media (max-width: 767px) {
        grid-template-columns: ${(props)=>((props.$quantidade > 1 ) ? "repeat(1, 1fr)" : "1fr")};

    }
`;

const Img = styled.img`
height: 100px;
margin: 15px auto;
max-width: 100%;
object-fit: contain;
`;

const ButtonVoltar = styled(Button)`
height: 100%;
margin-top: 0;
`;

function PesquisaPublica({dados, empresaId, empresaImagem}){
    const data = dados || {};
    const [loading, setLoading] = useState(true);
    const [quadroAulas, setQuadroAulas] = useState([]);
    const [quadroAulasAnoAtual, setQuadroAulasAnoAtual] = useState([]);
    
    const [professoresAula, setProfessoresAula] = useState([]);
    const [salas, setSalas] = useState([]);
    const [cursosEDisciplinas, setCursosEDisciplinas] = useState([]);
    const [horariosAula, setHorariosAula] = useState([]);

    const [resultadoPesquisa, confResultadoPesquisa] = useState([]);
    const [procurarProfessor, confProcurarProfessor] = useState("");
    const [procurarSala, confProcurarSala] = useState("");
    const [procurarCurso, confProcurarCurso] = useState("");
    const [dia, confDia] = useState("0");
    const [horario, confHorario] = useState("");
    
    const [estadoModal, mudarEstadoModal] = useState(false);
    const nomes = pegarNomenclatura();

    useEffect(() => {
        let active = true;
        async function carregarDados() {
            try {
                setLoading(true);
                let query = supabase
                    .from("view_pesquisa_aulas")
                    .select("*");

                if (empresaId) {
                    query = query.eq("empresa_id", empresaId);
                }

                const { data: rawAulas, error } = await query;

                if (error) {
                    console.error("Erro ao carregar view_pesquisa_aulas:", error);
                    return;
                }
                
                if (!active) return;
                
                const diasNomes = {
                    1: "Domingo",
                    2: "Segunda Feira",
                    3: "Terça Feira",
                    4: "Quarta Feira",
                    5: "Quinta Feira",
                    6: "Sexta Feira",
                    7: "Sábado"
                };

                const dadosConvertidos = (rawAulas || []).map((row) => {
                    const funcaoNome = row.usuario_funcao || "Funcionário";
                    const nomeComp = `${funcaoNome} - ${row.usuario_nome || ""} ${row.usuario_sobrenome || ""}`;
                    const salaStr = row.sala_apelido
                        ? `${row.sala_numero} - ${row.sala_apelido}`
                        : `${row.sala_numero || ""}`;

                    return {
                        id: row.funcionamento_id,
                        disciplina: row.nome_disciplina || "",
                        curso: row.nome_curso || "",
                        usuario: nomeComp,
                        diaSemana: diasNomes[row.dia_da_semana] || "",
                        diaSemanaRaw: row.dia_da_semana,
                        inicio: row.hora_inicio || "",
                        termino: row.hora_termino || "",
                        campus: row.campus_nome || "",
                        bloco: row.bloco_nome || "",
                        pavimento: row.pavimento_numero || "",
                        sala: salaStr,
                        salaApelido: row.sala_apelido || "",
                        ano: row.funcionamento_ano || row.horario_ano,
                        foto: row.usuario_imagem || "",
                        rawItem: {
                            funcionamento_id: row.funcionamento_id,
                            comodo_id: row.comodo_id,
                            empresa_id: row.empresa_id
                        }
                    };
                });

                setQuadroAulas(dadosConvertidos);
                
                const ano_atual = new Date().getFullYear();
                const filtradoAno = dadosConvertidos.filter((item) => Number(item.ano) === ano_atual);
                const quadroAtivos = filtradoAno.length > 0 ? filtradoAno : dadosConvertidos;
                setQuadroAulasAnoAtual(quadroAtivos);
                
                const profs = Array.from(new Set(quadroAtivos.map(d => d.usuario).filter(Boolean)));
                setProfessoresAula(profs);

                const rms = Array.from(new Set(quadroAtivos.map(d => d.sala).filter(Boolean)));
                setSalas(rms);

                const crs = Array.from(new Set(quadroAtivos.map(d => d.curso).filter(Boolean)));
                const dsps = Array.from(new Set(quadroAtivos.map(d => d.disciplina).filter(Boolean)));
                setCursosEDisciplinas(Array.from(new Set([...crs, ...dsps])));

                const hrs = Array.from(new Set(quadroAtivos.map(d => d.inicio).filter(Boolean))).sort();
                setHorariosAula(hrs);

            } catch (err) {
                console.error("Erro inesperado ao carregar dados:", err);
            } finally {
                if (active) setLoading(false);
            }
        }
        carregarDados();
        return () => {
            active = false;
        };
    }, [empresaId]);

    const buscarResultados = (event) => {
        event.preventDefault();
        
        confResultadoPesquisa(quadroAulasAnoAtual.filter(d =>
            (!procurarProfessor || d.usuario.toLowerCase().includes(procurarProfessor.toLowerCase())) &&
            (!procurarSala || d.sala.toString().toLowerCase().includes(procurarSala.toLowerCase())) &&
            (!procurarCurso || d.curso.toString().toLowerCase().includes(procurarCurso.toLowerCase()) || d.disciplina.toString().toLowerCase().includes(procurarCurso.toLowerCase())) && 
            (!dia || Number(dia) === 0 ? true : d.diaSemanaRaw === Number(dia))  &&
            (!horario || d.inicio === horario)
        ));
        mudarEstadoModal(true);
    }

    const fecharModalPesquisa = () => {
        mudarEstadoModal(false);
        confProcurarProfessor("");
        confProcurarSala("");
        confProcurarCurso("");
        confDia("0");
        confHorario("");
        confResultadoPesquisa([]);
    };

    useEffect(()=>{
        const apertouTecla = (event) =>  {
            if (event.key === "Escape") fecharModalPesquisa();
        };
        
        document.addEventListener("keydown", apertouTecla);
        return () => document.removeEventListener("keydown", apertouTecla); 
    });

    return(
        <Container>
            <Box>
                <Img src={empresaImagem || logo_cliente} alt="logo_universidade"/>
                <Formulario onSubmit={buscarResultados}>
                    <InputAutocomplete
                        sugestoes={professoresAula}
                        valor={procurarProfessor}
                        onChange={(val) => confProcurarProfessor(val)}
                        onSelecionar={(val) => confProcurarProfessor(val)}
                        placeholder="Professor"
                        />
                        <InputAutocomplete
                        sugestoes={salas}
                        valor={procurarSala}
                        onChange={(val) => confProcurarSala(val)}
                        onSelecionar={(val) => confProcurarSala(val)}
                        placeholder={nomes.comodos}
                        />
                        <InputAutocomplete
                        sugestoes={cursosEDisciplinas}
                        valor={procurarCurso}
                        onChange={(val) => confProcurarCurso(val)}
                        onSelecionar={(val) => confProcurarCurso(val)}
                        placeholder={`${nomes.categorias} ou ${nomes.produtos}`}
                        />
                    
                    <Select id="dia" value={dia} name="dia" onChange={(e) => confDia(e.target.value)}>
                        <option key={0} value="0">Todos os dias</option>
                        <option key={1} value="1">Domingo</option>
                        <option key={2} value="2">Segunda Feira</option>
                        <option key={3} value="3">Terça Feira</option>
                        <option key={4} value="4">Quarta Feira</option>
                        <option key={5} value="5">Quinta Feira</option>
                        <option key={6} value="6">Sexta Feira</option>
                        <option key={7} value="7">Sábado</option>
                        </Select>
                    <Select 
                        value={horario}
                        onChange={(e) => confHorario(e.target.value)}
                    >
                        <option value={""}>Todas os horários</option>
                        {
                            horariosAula.map((item, indice)=>(
                                <option key={indice} value={item}>{item}</option>
                            ))
                        }
                    </Select>
                    <Button 
                        $hovercolor={cores.cor3} 
                        $bgcolor={cores.corWhite} 
                        $fontColor={cores.corTextoEscuro} 
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Carregando..." : "Buscar"}
                    </Button>
                </Formulario>
            </Box>
            <ContainerModal $aberto={estadoModal} >
                <BackgroundModal onClick={fecharModalPesquisa}></BackgroundModal>
                <Modal>
                    <CardsContainer
                        $quantidade = {resultadoPesquisa.length}
                        >

                    {
                        resultadoPesquisa.map((item, indice)=>(
                            <CriarCard
                            dados = {data}
                            key = {indice}
                            fotoProfessor = {item.foto}
                            nome = {item.usuario}
                            disciplina = {item.disciplina}
                            dia = {item.diaSemana}
                            horarioInicial = {item.inicio}
                            horarioFinal = {item.termino}
                            campus = {item.campus}
                            bloco = {item.bloco}
                            pavimento = {item.pavimento}
                            sala = {item.sala}
                            rawItem = {item.rawItem}
                            />
                        ))
                    }
                    <ButtonVoltar $bgcolor="rgb(38, 38, 38)" onClick={fecharModalPesquisa}>Voltar</ButtonVoltar>
                    </CardsContainer>
                </Modal>
                </ContainerModal>
        </Container>
    )
}
export default PesquisaPublica;
