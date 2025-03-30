import React, { useState} from "react";
import styled from "styled-components";
import Box from "./SubBox";
import Input from "./SubInput";
import Select from "./SubSelect";
import Label from "./SubLabel";
import Button from "./SubButton";
import Title from "./SubTitleH2";
import GridArea from "./SubGridArea";

const H3 = styled.h3`
    font-size: 20px;
    margin-bottom: 15px;
    text-align: center;
    color:rgb(203, 203, 203);
`;

const DivSeparador = styled.div`
    height: 1px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.2);
    margin: 30px 0;
`;
const TabelaContainer = styled.div`
    width: 100%;
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
`;
const Td =styled.td`
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;
const Tr =styled.tr`

&:hover{
    background-color: rgba(255, 255, 255, 0.1);
}
`;
const Tbody =styled.tbody`
    background-color: rgba(255, 255, 255, 0.1);
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
    "adicionar . alterar"
    "adicionar . alterar"
    "inicio duracao termino"
    "botoes botoes botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: 

        "botoes";
}
`;

const horarios = {
    "horarios":[
        { "id": 1, "ano": 2025, "semestre": 1, "horaInicio": "07:30", "horaFim": "09:00" },
        { "id": 2, "ano": 2025, "semestre": 1, "horaInicio": "09:15", "horaFim": "10:45" },
        { "id": 3, "ano": 2025, "semestre": 1, "horaInicio": "11:00", "horaFim": "12:30" }
    ] 
}

function AtualizarPerfil({ tableHorarios }) {
    const data = tableHorarios || {};

    const [ano, setAno] = useState(data.ano || 2025);
    const [semestre, setSemestre] = useState(data.semestre || 1);
    const [inicio, setInicio] = useState("");
    const [termino, setTermino] = useState("");
    const [duracao, setDuracao] = useState(50);

    const fazerEnvio = (event) =>{
        event.preventDefault();
        console.log({ 
            ano, semestre, inicio, termino, duracao
          });
    }
    
    return(
            <Box>
                <Title>Configurar Horários</Title>
                <FormGrid onSubmit={fazerEnvio}>
                    <GridArea $area="ano">
                        <Label htmlFor="ano">Ano:</Label>
                        <Input type="text" id="ano" name="ano" value={ano} required onChange={(e) => setAno(e.target.value)}/>
                    </GridArea>
                    <GridArea $area="semestre">
                        <Label htmlFor="semestre">Semestre:</Label>
                        <Select type="text" id="semestre" name="semestre" required onChange={(e) => setSemestre(e.target.value)}>
                        <option value="1">1</option>
                        <option value="1">2</option>
                        </Select>
                    </GridArea>
                    <GridArea $area="tabela">
                        <DivSeparador></DivSeparador>
                        
                        <H3>Horários Cadastrados</H3>

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
                                </Tbody>
                            </TabelaHorarios>
                        </TabelaContainer>
                        
                        <DivSeparador></DivSeparador>
                    </GridArea>

                    <GridArea $area="alterar">
                        <InputRadio type="radio" id="alterar-horario" name="opcao-horario" value="alterar" onchange="alternarModo(this)"/>
                        <Label for="alterar-horario">ALTERAR HORÁRIO</Label>
                    </GridArea>
                    <GridArea $area="adicionar">
                        <InputRadio type="radio" id="adicionar-horario" name="opcao-horario" value="adicionar" checked onchange="alternarModo(this)"/>
                        <Label for="adicionar-horario">ADICIONAR HORÁRIO</Label>
                    </GridArea>
                    <GridArea $area="inicio">
                    </GridArea>
                    <GridArea $area="duracao">
                    </GridArea>
                    <GridArea $area="termino">
                    </GridArea>
                    <GridArea $area="botoes">
                        <Button type="reset">Limpar</Button>   
                        <Button type="submit">Salvar</Button>   
                    </GridArea>

                </FormGrid>
            </Box>
    )
}

export default AtualizarPerfil;