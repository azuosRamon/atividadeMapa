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
import TabelaCompleta from "./SubTabela";
import Colapse from "./SubColapse"


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




function ConfigurarCursos({ tableCursos }) {
    const data = tableCursos || {};
    const [pesquisa, setPesquisa] = useState([]);
    const [operacao, setOperacao] = useState(1);
    const [idCursos, setId] = useState("");
    const [nome, setNome] = useState("");

    const pesquisa2 = useMemo(() => {
        return data.filter(curso => 
            (idCursos ? curso.id === idCursos : curso.nome.toLowerCase().includes(nome.toLowerCase()))
        );
    }, [nome, idCursos]);
    
    useEffect(() => {
        setPesquisa(pesquisa2);
    }, [pesquisa2]);

    useEffect(() => {
        const cursoSelecionado = data.find(curso => curso.id === Number(idCursos));
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
                        <Colapse marginBottom={'0px'} nome = "Consultar dados" estadoInicial={true}>
                            <TabelaCompleta dados={pesquisa} lista={['id', 'nome']} camposPesquisa={false}></TabelaCompleta>
                        </Colapse>

                        
                        <DivSeparador></DivSeparador>
                    </GridArea>

                    <GridArea $area="operacao">
                        <Label htmlFor="operacao">Operacao:</Label>
                            <Select id="operacao" autoFocus name="operacao" required onChange={(e) => {setOperacao(e.target.value); setId("")}}>
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