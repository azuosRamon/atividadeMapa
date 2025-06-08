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
        "idCurso"
        "nome"
        "reset"
        "botoes";
}
`;

function CadastrarEmpresa() {
    const [data, setData] = useState([]);
    const [pesquisa, setPesquisa] = useState([]);
    const [operacao, setOperacao] = useState("1");
    const [objeto, setObjeto] = useState({
        id: '',
        nome: "",
        cnpj: "",
        telefone: "",
        email: "",
        senha: "",
        inicioContrato: "2025-06-08",
        dataRenovacao: "",
        valorContrato: "",
        tempoContrato: '',
        redeSocial1: "",
        redeSocial2: "",
    })
    useEffect(() => {
        if (!objeto.inicioContrato || !objeto.tempoContrato) return;

        const inicio = new Date(objeto.inicioContrato);
        inicio.setMonth(inicio.getMonth() + Number(objeto.tempoContrato));

        const ano = inicio.getFullYear();
        const mes = String(inicio.getMonth() + 1).padStart(2, '0'); // Corrige o mês
        const dia = String(inicio.getDate()+1).padStart(2, '0');

        const novaData = `${ano}-${mes}-${dia}`;

        setObjeto(prev => ({
            ...prev,
            dataRenovacao: novaData
        }));
    }, [objeto.inicioContrato, objeto.tempoContrato]);

    const [loading, setLoading] = useState(true);
    const nomeTabela = 'empresa'
    useEffect(() => {
    axios.get(`https://backend-mapa.onrender.com/${nomeTabela}/`)
        .then(resp => setData(resp.data))
        .catch(e => alert("Erro ao carregar dados!"))
        .finally(() => setLoading(false));
    }, []);
    console.log(objeto);
    const criar = async (nome, cnpj, telefone, email, senha, inicio_contrato, data_renovacao, tempo_contrato_meses, valor_contrato, rede_social_1, rede_social_2) => {
      await axios.post(`https://backend-mapa.onrender.com/${nomeTabela}/`, { nome, cnpj, telefone, email, senha, inicio_contrato, data_renovacao, tempo_contrato_meses, valor_contrato, rede_social_1, rede_social_2 });
      atualizarLista();
    };

    const alterar = async (id, nome, cnpj, telefone, email, senha, inicio_contrato, data_renovacao, tempo_contrato_meses, valor_contrato, rede_social_1, rede_social_2) => {
      await axios.put(`https://backend-mapa.onrender.com/${nomeTabela}/${id}`, { nome, cnpj, telefone, email, senha, inicio_contrato, data_renovacao, tempo_contrato_meses, valor_contrato, rede_social_1, rede_social_2});
      atualizarLista();
    };

    const deletar = async (id) => {
      await axios.delete(`https://backend-mapa.onrender.com/${nomeTabela}/${id}`);
      atualizarLista();
    };

    const atualizarLista = () => {
      setLoading(true);
      axios.get(`https://backend-mapa.onrender.com/${nomeTabela}/`)
        .then(resp => setData(resp.data))
        .finally(() => setLoading(false));
    };

    const pesquisa2 = useMemo(() => {
        return data.filter(item => 
            (objeto.id ? item.empresa_id === Number(objeto.id) : item.nome.toLowerCase().includes(objeto.nome.toLowerCase()))
        );
    }, [data,objeto.nome, objeto.id]);
    
    useEffect(() => {
        setPesquisa(pesquisa2);
    }, [pesquisa2]);

    useEffect(() => {
        const objetoSelecionado = data.find(objeto => objeto.empresa_id === Number(objeto.id));
        setObjeto(objetoSelecionado ? objetoSelecionado.nome : "");
    }, [objeto.id,data]);

    const fazerEnvio = async (event) => {
    event.preventDefault();
      try {
        if (operacao === "1") {
          await criar(objeto.nome, objeto.cnpj, objeto.telefone, objeto.email, objeto.senha, objeto.inicioContrato, objeto.dataRenovacao, objeto.tempoContrato, objeto.valorContrato, objeto.redeSocial1, objeto.redeSocial2 );
          alert(`Adicionado com sucesso!`);
        } else if (operacao === "2") {
          await alterar(objeto.id, objeto.nome, objeto.cnpj, objeto.telefone, objeto.email, objeto.senha, objeto.inicioContrato, objeto.dataRenovacao, objeto.tempoContrato, objeto.valorContrato, objeto.redeSocial1, objeto.redeSocial2);
          alert("Alterado com sucesso!");
        } else if (operacao === "3") {
          await deletar(objeto.id);
          alert("Deletado com sucesso!");
        }
      } catch (error) {
        alert("Erro ao salvar. Tente novamente.");
        console.error(error);
      }
    };
    const alterarObjeto = (event, itemAlteracao) =>{
        event.preventDefault();
        setObjeto({
            ...objeto,
            [itemAlteracao] : event.target.value
        })
    }

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
                            <Select id="operacao" autoFocus name="operacao" required onChange={(e) => {setOperacao(e.target.value); alterarObjeto(e, 'id')}}>
                            <option value="0">Selecione a operação desejada</option>
                            <option value="1">Adicionar</option>
                            <option value="2">Alterar</option>
                            <option value="3">Deletar</option>
                            </Select>
                    </GridArea>
                    <GridArea $area="id">
                        <Label htmlFor="id">ID:</Label>
                        <Input type="number" id="id" name="id" disabled={!operacao || Number(operacao)<=1} onChange={(e) => alterarObjeto(e, 'id')}/>
                    </GridArea>
                    <GridArea $area="nome">
                        <Label htmlFor="nome">Nome:</Label>
                        <Input type="text" id="nome" value={objeto.nome} name="nome" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'nome')} required/>
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
                        <Input type="date" id="inicioContrato" value={objeto.inicioContrato} name="inicioContrato" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'inicioContrato')} required/>
                    </GridArea>
                    <GridArea $area="dataRenovacao">
                        <Label htmlFor="dataRenovacao">Data Renovacao:</Label>
                        <Input type="date" id="dataRenovacao" value={objeto.dataRenovacao} name="dataRenovacao" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'dataRenovacao')} required/>
                    </GridArea>
                    <GridArea $area="tempoContrato">
                        <Label htmlFor="tempoContrato">Duração em meses:</Label>
                        <Input type="number" id="tempoContrato" value={objeto.tempoContrato} name="tempoContrato" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'tempoContrato')} required/>
                    </GridArea>
                    <GridArea $area="valorContrato">
                        <Label htmlFor="valorContrato">Valor do contrato:</Label>
                        <Input type="number" id="valorContrato" value={objeto.valorContrato} name="valorContrato" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'valorContrato')} required/>
                    </GridArea>
                    <GridArea $area="redeSocial1">
                        <Label htmlFor="redeSocial1">Rede Social:</Label>
                        <Input type="text" id="redeSocial1" value={objeto.redeSocial1} name="redeSocial1" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'redeSocial1')} required/>
                    </GridArea>
                    <GridArea $area="redeSocial2">
                        <Label htmlFor="redeSocial2">Rede Social:</Label>
                        <Input type="text" id="redeSocial2" value={objeto.redeSocial2} name="redeSocial2" disabled={!operacao || Number(operacao)===3}  onChange={(e) => alterarObjeto(e, 'redeSocial2')} required/>
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
