import React, { useState, useEffect} from "react";
import styled from "styled-components";
import Box from "../SubBox";
import Input from "../SubInput";
import Select from "../SubSelect";
import Label from "../SubLabel";
import Button from "../SubButton";
import Title from "../SubTitleH2";
import GridArea from "../SubGridArea";
import DivSeparador from "../SubDivSeparador";
import TabelaCompleta from "../SubTabela";
import Colapse from "../SubColapse"
import cores from "../Cores"
import useBancoDeDados from "../BdSupabase";
import LerDados from "../BdLerTabela";

const FormGrid = styled.form`
gap: 10px;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "tabela tabela tabela"
    "ano semestre semestre"
    "separador separador separador"
    "operacao operacao idHorario"
    "inicio duracao termino"
    ". reset botoes";

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

function ConfigurarHorarios() {
    const [objeto, setObjeto] = useState({
        horario_id: "0",
        hora_inicio: "00:00",
        hora_termino: "",
        ano: 2025,
        semestre: 1
        });
    const [operacao, setOperacao] = useState("1");
    const [duracao, setDuracao] = useState(50);
    const {
    data,
    pesquisa,
    loading,
    fazerEnvio,
    alterarObjeto
    } = useBancoDeDados({
    nomeTabela: "horarios",
    objeto,
    setObjeto,
    operacao,
    campoId: "horario_id",
    campoNome: "ano"
    });

    const [dadosTabela, setDadosTabela] = useState([])

    const carregarDados = async () => {
        const dados = await LerDados({tabela: "horarios", listaColunas: ["*"]});
        setDadosTabela(dados);
    }

    const atualizarDados = async (e) => {
        await fazerEnvio(e);
        await carregarDados();
    }

    useEffect(()=>{
        carregarDados
    },[])




    useEffect(() => {
        setObjeto((prev) => ({ ...prev, ['hora_termino']: adicionarTempo(objeto.hora_inicio, 0,duracao,0)}))
        console.log(objeto)

    }, [objeto.hora_inicio, duracao]);

    
    return(
            <Box>
                <Title>Cadastrar Horários</Title>
                <FormGrid onSubmit={atualizarDados}>
                    <GridArea $area="ano">
                        <Label htmlFor="ano">Ano:</Label>
                        <Input type="number" id="ano" name="ano" value={objeto.ano} required onChange={(e) => alterarObjeto(e, 'ano')}/>
                    </GridArea>
                    <GridArea $area="semestre">
                        <Label htmlFor="semestre">Semestre:</Label>
                        <Select type="number" id="semestre" value={objeto.semestre} name="semestre" required onChange={(e) => alterarObjeto(e, 'semestre')}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        </Select>
                    </GridArea>
                    <GridArea $area="separador">
                    <DivSeparador></DivSeparador>
                    </GridArea>
                    <GridArea $area="tabela">
                        <DivSeparador></DivSeparador>
                            <Colapse marginBottom={'0px'} nome = "Consultar dados" estadoInicial={false}>
                                <TabelaCompleta dados={dadosTabela} lista={['horario_id', 'ano', 'semestre','hora_inicio', 'hora_termino']} camposPesquisa={false}></TabelaCompleta>
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
                        <Input type="number" id="idHorario" name="idHorario" disabled={!operacao || Number(operacao)<=1} onChange={(e) => alterarObjeto(e, 'horario_id')}/>
                    </GridArea>
                    <GridArea $area="inicio">
                        <Label htmlFor="horaInicio">Inicio:</Label>
                        <Input type="time" id="horaInicio" value={objeto.hora_inicio} name="horaInicio" onChange={(e) => alterarObjeto(e, 'hora_inicio')} required/>
                    </GridArea>
                    <GridArea $area="duracao">
                        <Label htmlFor="duracao">Duração:</Label>
                        <Input type="number" id="duracao" name="duracao" value={duracao} onChange={(e) =>setDuracao(Number(e.target.value))}/>
                    </GridArea>
                    <GridArea $area="termino">
                        <Label htmlFor="termino">Termino:</Label>
                        <Input type="time" id="termino" name="termino" value={objeto.hora_termino} readOnly onChange={(e) => alterarObjeto(e, 'hora_termino')}/>
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