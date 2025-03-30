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

const H3 = styled.h3`
    font-size: 20px;
    margin-bottom: 15px;
    text-align: center;
    color:rgb(203, 203, 203);
`;

const TabelaContainer = styled.div`
    width: 100%;
    max-height: 200px;
    overflow-x: auto;
    margin-bottom: 25px;
`;
const TabelaHorarios = styled.table`
    width: 100%;
    border-collapse: collapse;
    text-align: left;
`;

const Thead = styled.thead`
`;
const Th =styled.th`
    background-color: #0066cc;
    color: #fff;
    font-weight: bold;
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    text-align: center;
    
`;
const Td =styled.td`
    text-align: center;
    color: #fff;
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);


`;
const Tr =styled.tr`
&:nth-child(2n){
    background-color: rgba(255, 255, 255, 0.2);
}
&:hover{
    background-color: rgba(0, 102, 204, 0.2);
}
`;
const Tbody =styled.tbody`
    background-color: rgba(255, 255, 255, 0.3);
`;

const InputRadio = styled.input`
padding: 10px;
margin: 10px 0;
border: 1px solid #000;
border-radius: 5px;
font-size: 16px;
box-sizing: border-box;
color: ${(props) => props.$color || '#e2e2e2'};
background-color: #333;

&:hover{
    background-color: #222;
    transition: .5s;
}
&::placeholder{
    color: white;
}

`;


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

const horarios = {
    "horarios":[
        { "id": 1, "ano": 2024, "semestre": 2, "horaInicio": "18:50", "horaTermino": "19:40" },
        { "id": 2, "ano": 2024, "semestre": 2, "horaInicio": "19:40", "horaTermino": "20:30" },
        { "id": 3, "ano": 2024, "semestre": 2, "horaInicio": "20:30", "horaTermino": "21:20" },
        { "id": 5, "ano": 2025, "semestre": 1, "horaInicio": "19:40", "horaTermino": "20:30" },
        { "id": 6, "ano": 2025, "semestre": 1, "horaInicio": "20:30", "horaTermino": "21:20" },
        { "id": 7, "ano": 2025, "semestre": 1, "horaInicio": "18:50", "horaTermino": "19:40" },
        { "id": 8, "ano": 2025, "semestre": 1, "horaInicio": "19:40", "horaTermino": "20:30" },
        { "id": 9, "ano": 2025, "semestre": 1, "horaInicio": "20:30", "horaTermino": "21:20" },
        { "id": 10, "ano": 2025, "semestre": 1, "horaInicio": "21:20", "horaTermino": "22:10" },
    ] 
}

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
        setPesquisa(horarios.horarios.filter(data => (data.ano === Number(ano))&&(data.semestre === Number(semestre))));
    }, [ano, semestre, horarios.horarios])

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
                        <TabelaContainer>
                            <TabelaHorarios>
                                <thead>
                                    <Tr>
                                        <Th>ID</Th>
                                        <Th>INÍCIO</Th>
                                        <Th>TÉRMINO</Th>
                                    </Tr>
                                </thead>
                                <Tbody id="tabela-horarios">
                                    {pesquisa.map(horario => (
                                        <Tr key={horario.id}>
                                            <Td>{horario.id}</Td>
                                            <Td>{horario.horaInicio}</Td>
                                            <Td>{horario.horaTermino}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </TabelaHorarios>
                        </TabelaContainer>
                        
                        <DivSeparador></DivSeparador>
                    </GridArea>

                    <GridArea $area="operacao">
                        <Label htmlFor="operacao">Operacao:</Label>
                            <Select type="text" id="operacao" name="operacao" required onChange={(e) => setOperacao(e.target.value)}>
                            <option value="1">Adicionar Horário</option>
                            <option value="2">Alterar Horário</option>
                            <option value="3">Deletar Horário</option>
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
                        <Button $bgcolor="rgb(38, 38, 38)" type="reset">Limpar</Button>   
                    </GridArea>
                    <GridArea $area="botoes">
                        <Button type="submit">Salvar</Button>   
                    </GridArea>

                </FormGrid>
            </Box>
    )
}

export default ConfigurarHorarios;