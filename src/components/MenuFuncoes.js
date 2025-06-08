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

function CadastrarFuncao() {
    const [data, setData] = useState([]);
    const [pesquisa, setPesquisa] = useState([]);
    const [operacao, setOperacao] = useState("1");
    const [objeto, setObjeto] = useState({
        id: '',
        nome: "",
    })
    const [loading, setLoading] = useState(true);
    const nomeTabela = 'funcoes'
    useEffect(() => {
    axios.get(`https://backend-mapa.onrender.com/${nomeTabela}/`)
        .then(resp => setData(resp.data))
        .catch(e => alert("Erro ao carregar dados!"))
        .finally(() => setLoading(false));
    }, []);
    console.log(objeto);
    const criar = async (nome) => {
      await axios.post(`https://backend-mapa.onrender.com/${nomeTabela}/`, { nome });
      atualizarLista();
    };

    const alterar = async (id, nome) => {
      await axios.put(`https://backend-mapa.onrender.com/${nomeTabela}/${id}`, { nome});
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
          await criar(objeto.nome );
          alert(`Adicionado com sucesso!`);
        } else if (operacao === "2") {
          await alterar(objeto.id, objeto.nome);
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
                <Title>Cadastrar Funcão</Title>
                <FormGrid onSubmit={fazerEnvio}>
                    <GridArea $area="tabela">
                        <DivSeparador></DivSeparador>
                        <Colapse marginBottom={'0px'} nome = "Consultar dados" estadoInicial={false}>
                            {loading
                                ? <div style={{padding: "16px"}}>Carregando...</div>
                                : <TabelaCompleta dados={pesquisa} lista={['funcao_id', 'nome_funcao']} camposPesquisa={false} />
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

export default CadastrarFuncao;
