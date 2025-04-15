import React, { useState, useEffect} from "react";
import styled from "styled-components";
import Box from "./SubBox";
import Input from "./SubInput";
import Select from "./SubSelect";
import Label from "./SubLabel";
import Button from "./SubButton";
import Title from "./SubTitleH2";
import GridArea from "./SubGridArea";
import DivSeparador from "./SubDivSeparador";
import TabelaCompleta from "./SubTabela";
import Colapse from "./SubColapse"
import Slide from "./Slide"


const FormGrid = styled.form`
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "ano semestre dia"
    "tabela tabela tabela"
    "operacao operacao id"
    "inicio termino campus"
    "blocos pavimentos salas"
    "separar separar separar"
    "cursos professores professores"
    "disciplinas disciplinas disciplinas"
    "reset . botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: 
        "ano"
        "semestre"
        "tabela"
        "operacao"
        "idHorario"
        "inicio" 
        "duracao" 
        "termino"
        "reset"
        "botoes";
}
`;


function ConfigurarQuadroAulas({ table, imagens }) {
    const data = table || {};
    const [pesquisa, setPesquisa] = useState([]);
    const [operacao, setOperacao] = useState();
    const [id, setId] = useState("");
    const [idInicio, setIdIncio] = useState("");
    const [idtermino, setIdtermino] = useState("");
    const [idCampus, setIdCampus] = useState(1);
    const [idBloco, setIdBloco] = useState(1);
    const [idPavimento, setIdPavimento] = useState(0);
    const [idSala, setIdSala] = useState();
    const [idDisciplina, setIdDisciplina] = useState("");
    const [idProfessor, setIdProfessor] = useState("");
    const [idCurso, setIdCurso] = useState("");
    const [dia, setDia] = useState("");
    const [ano, setAno] = useState(data.ano || 2025);
    const [semestre, setSemestre] = useState(data.semestre || 1);
    const [inicio, setInicio] = useState();
    const [termino, setTermino] = useState();
    const [blocos, setBlocos] = useState([])
    const [pavimentos, setPavimentos] = useState([])
    const [salas, setSalas] = useState([])
    const listaSalas = ["001","002"]
    const limparFormulario = () => {
        setOperacao();
        setId("");
        setIdIncio("");
        setIdtermino("");
        setIdCampus(1);
        setIdBloco(1);
        setIdPavimento();
        setIdSala();
        setIdDisciplina("");
        setIdProfessor("");
        setIdCurso("");
        setDia("");
        setAno(data.ano || 2025);
        setSemestre(data.semestre || 1);
        setInicio("00:00");
      };

    useEffect(()=>{
        data.quadroDeAulas.filter(item => item.inicioId === idInicio)
        console.log(inicio)
        console.log(idInicio)
    },[inicio, termino])

    useEffect(() => {
        setPesquisa(data.horarios.filter(data => (data.ano === Number(ano))&&(data.semestre === Number(semestre))));
    }, [ano, semestre])

    useEffect(() => {
        setIdBloco(1);
        setIdPavimento(1);
      }, [idCampus]);

    useEffect(() => {    
        setBlocos(data.blocos.filter(item => (
            item.campusId === Number(idCampus)
            )))
    }, [idCampus])
    useEffect(() => {    
        setPavimentos(data.pavimentos.filter(item => (
            item.blocoId === Number(idBloco)
            )))
    }, [idCampus, idBloco])

    useEffect(() => {    
        setSalas(data.salas.filter(item => (
            item.pavimentoId === Number(idPavimento)
            )))
    }, [idCampus, idBloco, idPavimento, pavimentos])


    const fazerEnvio = (event) =>{
        event.preventDefault();
        console.log({ 
            ano, semestre, inicio, termino
          });
    }

    const handleInicioChange = (hora) => {
        setInicio(hora);
        const horarioSelecionado = data.horarios.find(item => item.inicio === hora);
        setIdIncio(horarioSelecionado ? horarioSelecionado.id : "");
      };
      
      const handleTerminoChange = (hora) => {
        setTermino(hora);
        const horarioSelecionado = data.horarios.find(item => item.termino === hora);
        setIdtermino(horarioSelecionado ? horarioSelecionado.id : "");
      };
    
    return(
            <Box>
                <Title>Quadro de Aulas</Title>
                <DivSeparador></DivSeparador>
                <FormGrid onSubmit={fazerEnvio}>
                    <GridArea $area="ano">
                        <Label htmlFor="ano">Ano:</Label>
                        <Input type="number" id="ano" name="ano" value={ano} required onChange={(e) => setAno(Number(e.target.value))}/>
                    </GridArea>
                    <GridArea $area="semestre">
                        <Label htmlFor="semestre">Semestre:</Label>
                        <Select value={semestre} id="semestre" name="semestre" required onChange={(e) => setSemestre(Number(e.target.value))}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        </Select>
                    </GridArea>
                    <GridArea $area="tabela">
                        <DivSeparador></DivSeparador>
                            <Colapse marginBottom={'0px'} nome = "Visualizar salas" estadoInicial={true}>
                                <Slide
                                    lista_imagens={imagens}
                                    pagina_inicio={idPavimento}
                                    listaSalasAtivas={listaSalas}                                />
                            </Colapse>
                        <DivSeparador></DivSeparador>
                    </GridArea>

                    <GridArea $area="operacao">
                        <Label htmlFor="operacao">Operacao:</Label>
                            <Select id="operacao" name="operacao" required onChange={(e) => setOperacao(e.target.value)}>
                            <option value="1">Adicionar</option>
                            <option value="2">Alterar</option>
                            <option value="3">Deletar</option>
                            </Select>
                    </GridArea>
                    <GridArea $area="id">
                        <Label htmlFor="id">ID:</Label>
                        <Input type="number" id="id" name="id" disabled={!operacao || Number(operacao)<=1} onChange={(e) => setId(Number(e.target.value))}/>
                    </GridArea>
                    <GridArea $area="inicio">
                        <Label htmlFor="horaInicio">Inicio:</Label>
                        <Select id="horaInicio" name="horaInicio" onChange={(e) => handleInicioChange(e.target.value)} required>

                            {[...new Set(data.horarios.map(item => item.inicio))].map((hora, index) => (
                                <option key={index} value={hora}>{hora}</option>
                                ))}
                                
                            </Select>
                    </GridArea>

                    <GridArea $area="termino">
                        <Label htmlFor="termino">Termino:</Label>
                        <Select id="termino" name="termino" onChange={(e) => handleTerminoChange(e.target.value)} required>
                                {[...new Set(data.horarios.map(item => item.termino))].map((hora, index) => (
                                    <option key={index} value={hora}>{hora}</option>
                                    ))}
                                
                            </Select>
                    </GridArea>
                    <GridArea $area="campus">
                        <Label htmlFor="campus">Campus:</Label>
                            <Select id="campus" name="campus" onChange={(e) => setIdCampus(e.target.value)} required>
                                {data.campus.map(item => (
                                    <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))}
                                
                            </Select>
                    </GridArea>
                    <GridArea $area="blocos">
                        <Label htmlFor="blocos">Bloco:</Label>
                            <Select id="blocos" name="blocos" onChange={(e) => setIdBloco(e.target.value)} required>
                                { 
                                blocos.length > 0 ? (
                                    blocos.map(item => (
                                            <option key={item.id} value={item.id}>{item.nome}</option>
                                        ))
                                ) : <option key="none" value={undefined}>Nenhum cadastro</option>
                                }
                                
                            </Select>
                    </GridArea>
                    <GridArea $area="pavimentos">
                        <Label htmlFor="pavimentos">Pavimento:</Label>
                            <Select id="pavimentos" name="pavimentos" onChange={(e) => setIdPavimento(e.target.value)} required>
                            { 
                                pavimentos.length > 0 ? (
                                    pavimentos.map(item => (
                                            <option key={item.id} value={item.id}>{item.numero}</option>
                                        ))
                                ) : <option key="none" value={undefined}>Nenhum cadastro</option>
                                }
                                
                            </Select>
                    </GridArea>
                    <GridArea $area="salas">
                        <Label htmlFor="salas">Sala:</Label>
                            <Select id="salas"  name="salas" onChange={(e) => setIdSala(e.target.value)} required>
                            { 
                                salas.length > 0 ? (
                                    salas.map(item => (
                                            <option key={item.id} value={item.id}>{item.apelido === "" ? (item.numero): (item.numero + ' - ' + item.apelido)}</option>
                                        ))
                                ) : <option key="none" value={undefined}>Nenhum cadastro</option>
                                }
                                
                            </Select>
                    </GridArea>
                    <GridArea $area="separar">
                        <DivSeparador></DivSeparador>
                    </GridArea>
                    <GridArea $area="cursos">
                        <Label htmlFor="cursos">Curso:</Label>
                            <Select id="cursos" name="cursos" onChange={(e) => setIdCurso(e.target.value)} required>
                                {
                                data.cursos.map(item => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))}
                                
                            </Select>
                    </GridArea>
                    <GridArea $area="professores">
                        <Label htmlFor="professores">Professor:</Label>
                            <Select id="professores" name="professores" onChange={(e) => setIdProfessor(e.target.value)} required>
                                {
                                data.pessoas.map(item => (
                                    item.funcao.toLowerCase() === 'professor' ? (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ) : null
                                    ))}
                                
                            </Select>
                    </GridArea>
                    <GridArea $area="disciplinas">
                        <Label htmlFor="disciplinas">Disciplina:</Label>
                            <Select id="disciplinas" name="disciplinas" onChange={(e) => setIdDisciplina(e.target.value)} required>
                                {
                                data.disciplinas.map(item => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))}
                                
                            </Select>
                    </GridArea>
                    <GridArea $area="reset">
                        <Button $bgcolor="rgb(38, 38, 38)" type="reset" onClick={limparFormulario}>Limpar</Button>   
                    </GridArea>
                    <GridArea $area="botoes">
                        <Button type="submit">Salvar</Button>   
                    </GridArea>

                </FormGrid>
            </Box>
    )
}

export default ConfigurarQuadroAulas;