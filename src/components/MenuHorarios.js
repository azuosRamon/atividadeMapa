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
import cores from "./Cores"

const FormGrid = styled.form`
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "ano . semestre"
    "tabela tabela tabela"
    "operacao operacao idHorario"
    "inicio duracao termino"
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


function adicionarTempo(horario, horas = 0, minutos = 0, segundos = 0) {
    const [h, m, s = 0] = horario.split(":").map(Number);
    
    let data = new Date();
    data.setHours(h + horas, m + minutos, s + segundos);

    return data.toTimeString().slice(0, 8); // Retorna HH:MM:SS
}

function ConfigurarHorarios({ tableHorarios }) {
    const data = tableHorarios || {};
    const [pesquisa, setPesquisa] = useState([]);
    const [operacao, setOperacao] = useState();
    const [idHorario, setId] = useState("");
    const [ano, setAno] = useState(data.ano || 2025);
    const [semestre, setSemestre] = useState(data.semestre || 1);
    const [inicio, setInicio] = useState("00:00");
    const [duracao, setDuracao] = useState(50);
    const [termino, setTermino] = useState(adicionarTempo(inicio, 0,duracao,0));

    useEffect(() => {
        setPesquisa(data.filter(data => (data.ano === Number(ano))&&(data.semestre === Number(semestre))));
    }, [ano, semestre])

    useEffect(() => {
        setTermino(adicionarTempo(inicio,0,duracao,0));
    }, [inicio, duracao]);

    const fazerEnvio = (event) =>{
        event.preventDefault();
        console.log({ 
            ano, semestre, inicio, termino, duracao
          });
    }
    
    return(
            <Box>
                <Title>Horários</Title>
                <DivSeparador></DivSeparador>
                <FormGrid onSubmit={fazerEnvio}>
                    <GridArea $area="ano">
                        <Label htmlFor="ano">Ano:</Label>
                        <Input type="number" id="ano" name="ano" value={ano} required onChange={(e) => setAno(Number(e.target.value))}/>
                    </GridArea>
                    <GridArea $area="semestre">
                        <Label htmlFor="semestre">Semestre:</Label>
                        <Select type="number" id="semestre" name="semestre" required onChange={(e) => setSemestre(Number(e.target.value))}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        </Select>
                    </GridArea>
                    <GridArea $area="tabela">
                        <DivSeparador></DivSeparador>
                            <Colapse marginBottom={'0px'} nome = "Consultar dados" estadoInicial={true}>
                                <TabelaCompleta dados={pesquisa} lista={['id', 'inicio', 'termino']} camposPesquisa={false}></TabelaCompleta>
                            </Colapse>
                        
                        <DivSeparador></DivSeparador>
                    </GridArea>

                    <GridArea $area="operacao">
                        <Label htmlFor="operacao">Operacao:</Label>
                            <Select type="text" id="operacao" name="operacao" required onChange={(e) => setOperacao(e.target.value)}>
                            <option value="0">Selecione a operação desejada</option>
                            <option value="1">Adicionar</option>
                            <option value="2">Alterar</option>
                            <option value="3">Deletar</option>
                            </Select>
                    </GridArea>
                    <GridArea $area="idHorario">
                        <Label htmlFor="idHorario">ID:</Label>
                        <Input type="number" id="idHorario" name="idHorario" disabled={!operacao || Number(operacao)<=1} onChange={(e) => setId(Number(e.target.value))}/>
                    </GridArea>
                    <GridArea $area="inicio">
                        <Label htmlFor="horaInicio">Inicio:</Label>
                        <Input type="time" id="horaInicio" value={inicio} name="horaInicio" onChange={(e) => setInicio(e.target.value)} required/>
                    </GridArea>
                    <GridArea $area="duracao">
                        <Label htmlFor="duracao">Duração:</Label>
                        <Input type="number" id="duracao" name="duracao" value={duracao} onChange={(e) =>setDuracao(Number(e.target.value))}/>
                    </GridArea>
                    <GridArea $area="termino">
                        <Label htmlFor="termino">Termino:</Label>
                        <Input type="time" id="termino" name="termino" value={termino} readOnly/>
                    </GridArea>
                    <GridArea $area="reset">
                        <Button $bgcolor={cores.backgroundBotaoSemFoco} type="reset">Limpar</Button>   
                    </GridArea>
                    <GridArea $area="botoes">
                        <Button type="submit">Salvar</Button>   
                    </GridArea>

                </FormGrid>
            </Box>
    )
}

export default ConfigurarHorarios;