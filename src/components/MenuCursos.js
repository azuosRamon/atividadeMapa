import axios from "axios";
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
import useBancoDeDados from "./UseBancoDados";

const FormGrid = styled.form`
gap: 10px;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "tabela tabela tabela"
    "operacao operacao idCurso"
    "nome nome nome"
    ". reset botoes";

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

function ConfigurarCursos() {
  const [id, setId] = useState("");
  const [objeto, setObjeto] = useState({
    id: "",
    nome: "",
  });
  const [operacao, setOperacao] = useState("1");

  const {
    data,
    pesquisa,
    loading,
    fazerEnvio,
    alterarObjeto
  } = useBancoDeDados({
    nomeTabela: "cursos",
    objeto,
    setObjeto,
    operacao,
    campoId: "curso_id"
  });


    return(
            <Box>
                <Title>Cursos</Title>
                <FormGrid onSubmit={fazerEnvio}>
                    <GridArea $area="tabela">
                        <DivSeparador></DivSeparador>
                        <Colapse marginBottom={'0px'} nome = "Consultar dados" estadoInicial={false}>
                            {loading
                                ? <div style={{padding: "16px"}}>Carregando...</div>
                                : <TabelaCompleta dados={pesquisa} lista={['curso_id', 'nome']} camposPesquisa={false} />
                            }
                        </Colapse>
                        <DivSeparador></DivSeparador>
                    </GridArea>

                    <GridArea $area="operacao">
                        <Label htmlFor="operacao">Operacao:</Label>
                            <Select id="operacao" autoFocus name="operacao" required onChange={(e) => {setOperacao(e.target.value); alterarObjeto(e, 'id')}}>
                            <option value="0">Selecione a operação desejada</option>
                            <option value="1">Adicionar</option>
                            <option value="2">Alterar</option>
                            <option value="3">Deletar</option>
                            </Select>
                    </GridArea>
                    <GridArea $area="idCurso">
                        <Label htmlFor="idCurso">ID:</Label>
                        <Input type="number" id="idCurso" name="idCurso" disabled={!operacao || Number(operacao)<=1} onChange={(e) => setId(e.target.value ? Number(e.target.value) : "")}/>
                    </GridArea>
                    <GridArea $area="nome">
                        <Label htmlFor="nome">Nome do Curso:</Label>
                        <Input type="text" id="nome" value={objeto.nome} name="nome" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'nome')} required/>
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

export default ConfigurarCursos;
