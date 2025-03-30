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
    "operacao operacao idCurso"
    "nome nome nome"
    "reset . botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: 
        "tabela"
        "operacao"
        "idCurso"
        "nome"
        "reset"
        "botoes";
}
`;

const cursos = {
    "cursos":[
        { "id": 1, "nome": "Engenharia Civil"},
        { "id": 2, "nome": "Engenharia de Software"},
        { "id": 3, "nome": "Engenharia Ambiental"},
        { "id": 5, "nome": "Engenharia de Petróleo e Gás"},
        { "id": 6, "nome": "Engenharia Elétrica"},
        { "id": 7, "nome": "Engenharia de Telecomunicações"},
        { "id": 8, "nome": "Engenharia Alimentos"},
    ] 
}


function ConfigurarCursos({ tableCursos }) {
    const data = tableCursos || {};
    const [pesquisa, setPesquisa] = useState([]);
    const [operacao, setOperacao] = useState();
    const [idCursos, setId] = useState("");
    const [nome, setNome] = useState("");

    const pesquisa2 = useMemo(() => {
        return cursos.cursos.filter(curso => 
            (idCursos ? curso.id === idCursos : curso.nome.toLowerCase().includes(nome.toLowerCase()))
        );
    }, [nome, idCursos]);
    
    useEffect(() => {
        setPesquisa(pesquisa2);
    }, [pesquisa2]);

    useEffect(() => {
        const cursoSelecionado = cursos.cursos.find(curso => curso.id === Number(idCursos));
        setNome(cursoSelecionado ? cursoSelecionado.nome : "");
    }, [idCursos]);


    const fazerEnvio = (event) =>{
        event.preventDefault();
        console.log("enviado!");
    }
    return(
            <Box>
                <Title>Cursos</Title>
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
                                        pesquisa.map(curso => (
                                            <Tr key={curso.id}>
                                                <Td>{curso.id}</Td>
                                                <Td>{curso.nome}</Td>
                                            </Tr>
                                        ))
                                    ) : (
                                        <Tr>
                                            <Td colSpan="2">Nenhum curso encontrado</Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </TabelaHorarios>
                        </TabelaContainer>
                        
                        <DivSeparador></DivSeparador>
                    </GridArea>

                    <GridArea $area="operacao">
                        <Label htmlFor="operacao">Operacao:</Label>
                            <Select type="text" id="operacao" name="operacao" required onChange={(e) => {setOperacao(e.target.value); setId("")}}>
                            <option value="1">Adicionar Curso</option>
                            <option value="2">Alterar Curso</option>
                            <option value="3">Deletar Curso</option>
                            </Select>
                    </GridArea>
                    <GridArea $area="idCurso">
                        <Label htmlFor="idCurso">ID:</Label>
                        <Input type="number" id="idCurso" name="idCurso" disabled={!operacao || Number(operacao)<=1} onChange={(e) => setId(e.target.value ? Number(e.target.value) : "")}/>
                    </GridArea>
                    <GridArea $area="nome">
                        <Label htmlFor="nome">Nome do Curso:</Label>
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

export default ConfigurarCursos;