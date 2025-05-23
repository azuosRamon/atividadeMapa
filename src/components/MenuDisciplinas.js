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
import cores from "./Cores"

const FormGrid = styled.form`
gap: 10px;
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



function ConfigurarDisciplinas({ tableDisciplinas }) {
    const data = tableDisciplinas || {};
    const [pesquisa, setPesquisa] = useState([]);
    const [operacao, setOperacao] = useState(1);
    const [idDisciplinas, setId] = useState("");
    const [nome, setNome] = useState("");

    const pesquisa2 = useMemo(() => {
        return data.filter(disciplina => 
            (idDisciplinas ? disciplina.id === idDisciplinas : disciplina.nome.toLowerCase().includes(nome.toLowerCase()))
        );
    }, [nome, idDisciplinas]);
    
    useEffect(() => {
        setPesquisa(pesquisa2);
    }, [pesquisa2]);

    useEffect(() => {
        const disciplinaSelecionada = data.find(disciplina => disciplina.id === Number(idDisciplinas));
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
                        <Colapse marginBottom={'0px'} nome = "Consultar dados" estadoInicial={true}>
                            <TabelaCompleta dados={pesquisa} lista={['id', 'nome']} camposPesquisa={false}></TabelaCompleta>
                        </Colapse>
                        <DivSeparador></DivSeparador>
                    </GridArea>

                    <GridArea $area="operacao">
                        <Label htmlFor="operacao">Operacao:</Label>
                            <Select autoFocus id="operacao" name="operacao" required onChange={(e) => {setOperacao(e.target.value); setId("")}}>
                            <option value="0">Selecione a operação desejada</option>
                            <option value="1">Adicionar</option>
                            <option value="2">Alterar</option>
                            <option value="3">Deletar</option>
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
                        <Button $bgcolor={cores.backgroundBotaoSemFoco} type="reset">Limpar</Button>   
                    </GridArea>
                    <GridArea $area="botoes">
                        <Button type="submit">Salvar</Button>   
                    </GridArea>

                </FormGrid>
            </Box>
    )
}

export default ConfigurarDisciplinas;