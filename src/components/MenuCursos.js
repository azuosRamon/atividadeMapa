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
    const [data, setData] = useState([]);
    const [pesquisa, setPesquisa] = useState([]);
    const [operacao, setOperacao] = useState("1");
    const [idCursos, setId] = useState("");
    const [nome, setNome] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    axios.get("https://backend-mapa.onrender.com/cursos/")
        .then(resp => setData(resp.data))
        .catch(e => alert("Erro ao carregar cursos"))
        .finally(() => setLoading(false));
    }, []);

    const criarCurso = async (nome) => {
      await axios.post("https://backend-mapa.onrender.com/cursos/", { nome });
      atualizarLista();
    };

    const alterarCurso = async (id, nome) => {
      await axios.put(`https://backend-mapa.onrender.com/cursos/${id}`, { nome });
      atualizarLista();
    };

    const deletarCurso = async (id) => {
      await axios.delete(`https://backend-mapa.onrender.com/cursos/${id}`);
      atualizarLista();
    };

    const atualizarLista = () => {
      setLoading(true);
      axios.get("https://backend-mapa.onrender.com/cursos/")
        .then(resp => setData(resp.data))
        .finally(() => setLoading(false));
    };

    const pesquisa2 = useMemo(() => {
        return data.filter(curso => 
            (idCursos ? curso.curso_id === Number(idCursos) : curso.nome.toLowerCase().includes(nome.toLowerCase()))
        );
    }, [data,nome, idCursos]);
    
    useEffect(() => {
        setPesquisa(pesquisa2);
    }, [pesquisa2]);

    useEffect(() => {
        const cursoSelecionado = data.find(curso => curso.curso_id === Number(idCursos));
        setNome(cursoSelecionado ? cursoSelecionado.nome : "");
    }, [idCursos,data]);

    const fazerEnvio = async (event) => {
    event.preventDefault();
      try {
        if (operacao === "1") {
          await criarCurso(nome);
          alert("Curso adicionado!");
        } else if (operacao === "2") {
          await alterarCurso(idCursos, nome);
          alert("Curso alterado!");
        } else if (operacao === "3") {
          await deletarCurso(idCursos);
          alert("Curso deletado!");
        }
      } catch (error) {
        alert("Erro ao salvar curso.");
        console.error(error);
      }
    };

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
                            <Select id="operacao" autoFocus name="operacao" required onChange={(e) => {setOperacao(e.target.value); setId("")}}>
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

export default ConfigurarCursos;
