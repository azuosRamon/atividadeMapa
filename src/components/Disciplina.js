import React, { useState, useEffect, useMemo} from "react";
import styled from "styled-components";
import Box from "./SubBox";
import Input from "./SubInput";
import Select from "./SubSelect";
import Label from "./SubLabel";
import Button from "./SubButton";
import Title from "./SubTitleH2";
import GridArea from "./SubGridArea";
import DivSeparador from "./SubDivSeparador";


const TabelaContainer = styled.div`
    width: 100%;
    height: 200px;
    overflow-x: auto;
    margin-bottom: 25px;
`;
const TabelaHorarios = styled.table`
    width: 100%;
    border-collapse: collapse;
    text-align: left;
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



const FormGrid = styled.form`
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "tabela tabela tabela"
    "operacao operacao idDisciplina"
    "nome nome nome"
    "reset . botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: 
        "tabela"
        "operacao"
        "idDisciplina"
        "nome"
        "reset"
        "botoes";
}
`;

const disciplinas = {
    "disciplinas":[
        { "id": 1, "nome": "Empreendedorismo e inovação"},
        { "id": 2, "nome": "Banco de Dados Relacionais"},
        { "id": 3, "nome": "Estrutura de Dados Avançados"},
        { "id": 4, "nome": "Gestão Ambiental e Desenvolvimento Sustentável"},
        { "id": 5, "nome": "Infraestrutura de TI"},
        { "id": 6, "nome": "Interface Humano-Computador"},
        { "id": 7, "nome": "Práticas Extensionistas Integradoras IV"},
        { "id": 8, "nome": "Processo de Desenvolvimento de Software"},
    ] 
}


function ConfigurarDisciplinas({ tableDisciplinas }) {
    const data = tableDisciplinas || {};
    const [pesquisa, setPesquisa] = useState([]);
    const [operacao, setOperacao] = useState(1);
    const [idDisciplinas, setId] = useState("");
    const [nome, setNome] = useState("");

    const pesquisa2 = useMemo(() => {
        return disciplinas.disciplinas.filter(disciplina => 
            (idDisciplinas ? disciplina.id === idDisciplinas : disciplina.nome.toLowerCase().includes(nome.toLowerCase()))
        );
    }, [nome, idDisciplinas]);
    
    useEffect(() => {
        setPesquisa(pesquisa2);
    }, [pesquisa2]);

    useEffect(() => {
        const disciplinaSelecionada = disciplinas.disciplinas.find(disciplina => disciplina.id === Number(idDisciplinas));
        setNome(disciplinaSelecionada ? disciplinaSelecionada.nome : "");
    }, [idDisciplinas]);


    const fazerEnvio = (event) =>{
        event.preventDefault();
        console.log("enviado!");
    }
    return(
            <Box>
                <Title>Disciplinas</Title>
                <FormGrid onSubmit={fazerEnvio}>
                    <GridArea $area="tabela">
                        <DivSeparador></DivSeparador>
                        <TabelaContainer>
                            <TabelaHorarios>
                                <thead>
                                    <Tr>
                                        <Th>ID</Th>
                                        <Th>NOME</Th>
                                    </Tr>
                                </thead>
                                <Tbody>
                                {pesquisa.length > 0 ? (
                                        pesquisa.map(disciplina => (
                                            <Tr key={disciplina.id}>
                                                <Td>{disciplina.id}</Td>
                                                <Td>{disciplina.nome}</Td>
                                            </Tr>
                                        ))
                                    ) : (
                                        <Tr>
                                            <Td colSpan="2">Nenhuma disciplina encontrada</Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </TabelaHorarios>
                        </TabelaContainer>
                        
                        <DivSeparador></DivSeparador>
                    </GridArea>

                    <GridArea $area="operacao">
                        <Label htmlFor="operacao">Operacao:</Label>
                            <Select autoFocus id="operacao" name="operacao" required onChange={(e) => {setOperacao(e.target.value); setId("")}}>
                            <option value="1">Adicionar Disciplina</option>
                            <option value="2">Alterar Disciplina</option>
                            <option value="3">Deletar Disciplina</option>
                            </Select>
                    </GridArea>
                    <GridArea $area="idDisciplina">
                        <Label htmlFor="idDisciplina">ID:</Label>
                        <Input type="number" id="idDisciplina" name="idDisciplina" disabled={!operacao || Number(operacao)<=1} onChange={(e) => setId(e.target.value ? Number(e.target.value) : "")}/>
                    </GridArea>
                    <GridArea $area="nome">
                        <Label htmlFor="nome">Nome da Disciplina:</Label>
                        <Input type="text" id="nome" value={nome} name="nome" disabled={!operacao || Number(operacao)===3}  onChange={(e) => setNome(e.target.value)} required/>
                    </GridArea>
                    <GridArea $area="reset" onClick={()=> setId("")}>
                        <Button $bgcolor="rgb(38, 38, 38)" type="reset">Limpar</Button>   
                    </GridArea>
                    <GridArea $area="botoes">
                        <Button type="submit">Salvar</Button>   
                    </GridArea>

                </FormGrid>
            </Box>
    )
}

export default ConfigurarDisciplinas;