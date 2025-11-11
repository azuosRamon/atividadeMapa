import React, { useState, useEffect, useMemo} from "react";
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

const FormGrid = styled.form`
gap: 10px;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "tabela tabela tabela"
    "operacao operacao idDisciplina"
    "nome nome nome"
    ". reset botoes";

@media (max-width: 768px) {
    display: flex;
    flex-direction: column;
}
`;


function MenuDisciplinas() {
    

     const [objeto, setObjeto] = useState({
        produtos_id: "",
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
        nomeTabela: "produtos",
        objeto,
        setObjeto,
        operacao,
        campoId: "produtos_id",
        campoNome: "nome"
    });
    const modelo = JSON.parse(localStorage.getItem("modelo")) || null;
    return(
            <Box>
                <Title>{modelo.produtos || "Produtos"}</Title>
                <FormGrid onSubmit={fazerEnvio}>
                    <GridArea $area="tabela">
                        <DivSeparador></DivSeparador>
                        <Colapse marginBottom={'0px'} nome = "Consultar dados" estadoInicial={false}>
                            {loading
                                ? <div style={{padding:"16px",color:"white"}}>Carregando...</div>
                                : <TabelaCompleta dados={pesquisa} lista={['produtos_id','nome']} camposPesquisa={false}/>
                            }
                        </Colapse>
                        <DivSeparador></DivSeparador>
                    </GridArea>

                    <GridArea $area="operacao">
                        <Label htmlFor="operacao">Operacao:</Label>
                            <Select autoFocus id="operacao" name="operacao" required onChange={(e) => {setOperacao(e.target.value); alterarObjeto(e, 'produtos_id')}}>
                            <option value="0">Selecione a operação desejada</option>
                            <option value="1">Adicionar</option>
                            <option value="2">Alterar</option>
                            <option value="3">Deletar</option>
                            </Select>
                    </GridArea>
                    <GridArea $area="idDisciplina">
                        <Label htmlFor="idDisciplina">ID:</Label>
                        <Input type="number" id="idDisciplina" name="idDisciplina" disabled={!operacao || Number(operacao)<=1} onChange={(e) => alterarObjeto(e, 'produtos_id')}/>
                    </GridArea>
                    <GridArea $area="nome">
                        <Label htmlFor="nome">Nome da Disciplina:</Label>
                        <Input type="text" id="nome" value={objeto.nome} name="nome" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'nome')} required/>
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

export default MenuDisciplinas;
