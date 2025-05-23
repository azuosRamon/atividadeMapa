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
import cores from "./Cores"

const FormGrid = styled.form`
gap: 10px;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
"operacao id ."
"tabela tabela tabela"
"ano semestre dia"
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
    "dia"
    "tabela"
    "operacao"
    "id"
    "inicio"
    "termino"
    "campus"
    "blocos"
    "pavimentos"
    "salas"
    "separar"
    "cursos"
    "professores"
    "disciplinas"
    "reset"
    "botoes";
}
`;


function ConfigurarQuadroAulas({ table, imagens }) {
    const data = table || {};
    const [pesquisa, setPesquisa] = useState([]);
    const [operacao, setOperacao] = useState(1);
    const [id, setId] = useState("");
    const [idInicio, setIdIncio] = useState(1);
    const [idtermino, setIdtermino] = useState(1);
    const [idCampus, setIdCampus] = useState(1);
    const [idBloco, setIdBloco] = useState(1);
    const [idPavimento, setIdPavimento] = useState(0);
    const [idSala, setIdSala] = useState();
    const [idDisciplina, setIdDisciplina] = useState("");
    const [idProfessor, setIdProfessor] = useState("");
    const [idCurso, setIdCurso] = useState("");
    const [dia, setDia] = useState(2);
    const [ano, setAno] = useState(data.ano || 2025);
    const [semestre, setSemestre] = useState(data.semestre || 1);
    const [inicio, setInicio] = useState();
    const [termino, setTermino] = useState();
    const [blocos, setBlocos] = useState([])
    const [pavimentos, setPavimentos] = useState([])
    const [salas, setSalas] = useState([])
    const listaSalas = ["001","002"]
    const [salasAtivas, setSalasAtivas] = useState([]);
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

      useEffect(() => {
  if (!id || !operacao || Number(operacao) <= 1) return;

  const aulaSelecionada = data.quadroDeAulas.find(item => item.id === Number(id));

  if (aulaSelecionada) {
    // Dia, início e término direto
    setDia(aulaSelecionada.diaSemana);
    setIdIncio(aulaSelecionada.inicioId);
    setIdtermino(aulaSelecionada.terminoId);
    setIdCurso(aulaSelecionada.cursoId);
    setIdProfessor(aulaSelecionada.pessoasId);
    setIdDisciplina(aulaSelecionada.disciplinaId);

    // Buscar a sala
    const salaSelecionada = data.salas.find(s => s.id === aulaSelecionada.salaId);
    if (salaSelecionada) {
      const pavimentoSelecionado = data.pavimentos.find(p => p.id === salaSelecionada.pavimentoId);
      if (pavimentoSelecionado) {
        const blocoSelecionado = data.blocos.find(b => b.id === pavimentoSelecionado.blocoId);
        if (blocoSelecionado) {
          const campusSelecionado = data.campus.find(c => c.id === blocoSelecionado.campusId);
          if (campusSelecionado) {
            // Set em cadeia para atualizar tudo certo
            setIdCampus(campusSelecionado.id);
            setIdBloco(blocoSelecionado.id);
            setIdPavimento(pavimentoSelecionado.id);
            setIdSala(salaSelecionada.id);
          }
        }
      }
    }

    // Ano, semestre
    if (aulaSelecionada.ano) setAno(aulaSelecionada.ano);
    if (aulaSelecionada.semestre) setSemestre(aulaSelecionada.semestre);

    // Horário de início e término
    const horarioInicio = data.horarios.find(h => h.id === aulaSelecionada.inicioId);
    setInicio(horarioInicio ? horarioInicio.inicio : "");

    const horarioTermino = data.horarios.find(h => h.id === aulaSelecionada.terminoId);
    setTermino(horarioTermino ? horarioTermino.termino : "");
  } else {
    console.warn("ID não encontrado!");
    limparFormulario();
  }
}, [id, operacao, data]);

      useEffect(() => {
        if (!idInicio || !idtermino || !dia) {
          setSalasAtivas([]);
          return;
        }
      
        const inicio = Number(idInicio);
        const termino = Number(idtermino);
      
        // Filtra as aulas no intervalo e no dia certo
        const aulasFiltradas = data.quadroDeAulas.filter(item =>
          item.inicioId >= inicio &&
          item.inicioId < termino &&
          item.diaSemana === Number(dia)
        );
      
        // Pega os salaIds dessas aulas
        const salaIdsFiltradas = aulasFiltradas.map(item => item.salaId);
      
        // Busca as imagens correspondentes dessas salas
        const imagensSalas = data.salas
          .filter(sala => salaIdsFiltradas.includes(sala.id))
          .map(sala => sala.imagem);
      
        // Remove duplicatas
        const imagensUnicas = [...new Set(imagensSalas)];
      
        // Atualiza o estado
        setSalasAtivas(imagensUnicas);
      
        console.log("Salas ativas no dia", dia, "entre horários:", imagensUnicas);
      
      }, [idInicio, idtermino, dia, data.quadroDeAulas, data.salas]);
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
                                    listaSalasAtivas={salasAtivas}                                />
                            </Colapse>
                        <DivSeparador></DivSeparador>
                    </GridArea>

                    <GridArea $area="operacao">
                        <Label htmlFor="operacao">Operacao:</Label>
                            <Select id="operacao" name="operacao" required onChange={(e) => setOperacao(e.target.value)}>
                            <option value="0">Selecione a operação desejada</option>
                            <option value="1">Adicionar</option>
                            <option value="2">Alterar</option>
                            <option value="3">Deletar</option>
                            </Select>
                    </GridArea>
                    <GridArea $area="dia">
                        <Label htmlFor="dia">Dia da Semana:</Label>
                            <Select id="dia" value={dia} name="dia" required onChange={(e) => setDia(e.target.value)}>
                            <option value="1">Domingo</option>
                            <option value="2">Segunda Feira</option>
                            <option value="3">Terça Feira</option>
                            <option value="4">Quarta Feira</option>
                            <option value="5">Quinta Feira</option>
                            <option value="6">Sexta Feira</option>
                            <option value="7">Sábado</option>
                            </Select>
                    </GridArea>
                    <GridArea $area="id">
                        <Label htmlFor="id">ID:</Label>
                        <Input 
                            type="number" 
                            id="id" 
                            name="id" 
                            disabled={Number(operacao) === 1} 
                            value={id}
                            onChange={(e) => setId(Number(e.target.value))}
                            />
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
                            <Select id="blocos" name="blocos" value={idBloco} onChange={(e) => setIdBloco(e.target.value)} required>
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
                            <Select id="pavimentos" name="pavimentos" value={idPavimento} onChange={(e) => setIdPavimento(e.target.value)} required>
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
                            <Select id="salas"  name="salas" value={idSala} onChange={(e) => setIdSala(e.target.value)} required>
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
                            <Select id="cursos" value={idCurso} name="cursos" onChange={(e) => setIdCurso(e.target.value)} required>
                                {
                                data.cursos.map(item => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))}
                                
                            </Select>
                    </GridArea>
                    <GridArea $area="professores">
                        <Label htmlFor="professores">Professor:</Label>
                            <Select id="professores" value={idProfessor} name="professores" onChange={(e) => setIdProfessor(e.target.value)} required>
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
                            <Select id="disciplinas" value={idDisciplina} name="disciplinas" onChange={(e) => setIdDisciplina(e.target.value)} required>
                                {
                                data.disciplinas.map(item => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))}
                                
                            </Select>
                    </GridArea>
                    <GridArea $area="reset">
                        <Button $bgcolor={cores.backgroundBotaoSemFoco} type="reset" onClick={limparFormulario}>Limpar</Button>   
                    </GridArea>
                    <GridArea $area="botoes">
                        <Button type="submit">Salvar</Button>   
                    </GridArea>

                </FormGrid>
            </Box>
    )
}

export default ConfigurarQuadroAulas;