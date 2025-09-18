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
import useBancoDeDados from "../BdSql";

const FormGrid = styled.form`
gap: 10px;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "tabela tabela tabela"
    "operacao operacao id"
    "nome nome nome"
    "cnpj cnpj telefone"
    "inicioContrato dataRenovacao tempoContrato"
    "email email valorContrato"
    "senha senha ."
    "redeSocial1 redeSocial1 redeSocial1"
    "redeSocial2 redeSocial2 redeSocial2"
    ". reset botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: 
        "tabela"
        "operacao"
        "id"
        "nome"
        "cnpj"
        "telefone"
        "inicioContrato"
        "dataRenovacao"
        "tempoContrato"
        "email "
        "valorContrato"
        "senha"
        "redeSocial1"
        "redeSocial2"
        "reset"
        "botoes";
}
`;

function CadastrarEmpresa() {
    const [objeto, setObjeto] = useState({
        empresa_id: '',
        nome_empresa: "",
        cnpj: "",
        telefone: "",
        email: "",
        senha: "",
        inicio_contrato: "",
        data_renovacao: "",
        tempo_contrato_meses: '',
        valor_contrato: "",
        rede_social_1: "",
        rede_social_2: "",
    })
      const [operacao, setOperacao] = useState("1");
    
      const {
        data,
        pesquisa,
        loading,
        fazerEnvio,
        alterarObjeto
      } = useBancoDeDados({
        nomeTabela: "empresas",
        objeto,
        setObjeto,
        operacao,
        campoId: "empresa_id",
        campoNome: "nome_empresa"
      });
    

    return(
            <Box>
                <Title>Nova Empresa</Title>
                <FormGrid onSubmit={fazerEnvio}>
                    <GridArea $area="tabela">
                        <DivSeparador></DivSeparador>
                        <Colapse marginBottom={'0px'} nome = "Consultar dados" estadoInicial={false}>
                            {loading
                                ? <div style={{padding: "16px"}}>Carregando...</div>
                                : <TabelaCompleta dados={pesquisa} lista={['empresa_id', 'nome_empresa', 'cnpj']} camposPesquisa={false} />
                            }
                        </Colapse>
                        <DivSeparador></DivSeparador>
                    </GridArea>

                    <GridArea $area="operacao">
                        <Label htmlFor="operacao">Operacao:</Label>
                            <Select id="operacao" autoFocus name="operacao" required onChange={(e) => {setOperacao(e.target.value); alterarObjeto(e, 'empresa_id')}}>
                            <option value="0">Selecione a operação desejada</option>
                            <option value="1">Adicionar</option>
                            <option value="2">Alterar</option>
                            <option value="3">Deletar</option>
                            </Select>
                    </GridArea>
                    <GridArea $area="id">
                        <Label htmlFor="id">ID:</Label>
                        <Input type="number" id="id" name="id" disabled={!operacao || Number(operacao)<=1} onChange={(e) => alterarObjeto(e, 'empresa_id')}/>
                    </GridArea>
                    <GridArea $area="nome">
                        <Label htmlFor="nome">Nome:</Label>
                        <Input type="text" id="nome" value={objeto.nome_empresa} name="nome" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'nome_empresa')} required/>
                    </GridArea>
                    <GridArea $area="cnpj">
                        <Label htmlFor="cnpj">CNPJ:</Label>
                        <Input type="text" id="cnpj" value={objeto.cnpj} name="cnpj" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'cnpj')} required/>
                    </GridArea>
                    <GridArea $area="telefone">
                        <Label htmlFor="telefone">Telefone:</Label>
                        <Input type="phone" id="telefone" value={objeto.telefone} name="telefone" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'telefone')} required/>
                    </GridArea>
                    <GridArea $area="email">
                        <Label htmlFor="email">Email:</Label>
                        <Input type="email" id="email" value={objeto.email} name="email" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'email')} required/>
                    </GridArea>
                    <GridArea $area="senha">
                        <Label htmlFor="senha">Senha:</Label>
                        <Input type="password" id="senha" value={objeto.senha} name="senha" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'senha')} required/>
                    </GridArea>
                    <GridArea $area="inicioContrato">
                        <Label htmlFor="inicioContrato">Data Inicio:</Label>
                        <Input type="date" id="inicioContrato" value={objeto.inicio_contrato} name="inicioContrato" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'inicio_contrato')} required/>
                    </GridArea>
                    <GridArea $area="dataRenovacao">
                        <Label htmlFor="dataRenovacao">Data Renovacao:</Label>
                        <Input type="date" id="dataRenovacao" value={objeto.data_renovacao} name="dataRenovacao" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'data_renovacao')} required/>
                    </GridArea>
                    <GridArea $area="tempoContrato">
                        <Label htmlFor="tempoContrato">Duração em meses:</Label>
                        <Input type="number" id="tempoContrato" value={objeto.tempoContrato} name="tempoContrato" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'tempo_contrato_meses')} required/>
                    </GridArea>
                    <GridArea $area="valorContrato">
                        <Label htmlFor="valorContrato">Valor do contrato:</Label>
                        <Input type="number" id="valorContrato" value={objeto.valor_contrato} name="valorContrato" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'valor_contrato')} required/>
                    </GridArea>
                    <GridArea $area="redeSocial1">
                        <Label htmlFor="redeSocial1">Rede Social:</Label>
                        <Input type="text" id="redeSocial1" value={objeto.rede_social_1} name="redeSocial1" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'rede_social_1')} required/>
                    </GridArea>
                    <GridArea $area="redeSocial2">
                        <Label htmlFor="redeSocial2">Rede Social:</Label>
                        <Input type="text" id="rede_social_2" value={objeto.rede_social_2} name="redeSocial2" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'rede_social_2')} required/>
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

export default CadastrarEmpresa;
