import axios from "axios";
import React, { useState } from "react";
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
import Colapse from "../SubColapse";
import cores from "../Cores";
import useNoSql from "../BdNoSQL"; 

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
  const [objeto, setObjeto] = useState({
    curso_id: "",
    nome: "",
  });

  const [operacao, setOperacao] = useState("1");

  const { data, pesquisa, loading, fazerEnvio, alterarObjeto } =
    useNoSql({
      nomeTabela: "cursos",
      objeto,
      setObjeto,
      operacao,
      campoId: "curso_id",
      campoNome: "nome",
    });

  const idDesabilitado = !(operacao === "2" || operacao === "3");

  return (
    <Box>
      <Title>Cursos</Title>

      <FormGrid onSubmit={fazerEnvio}>
        <GridArea $area="tabela">
          <DivSeparador />
          <Colapse marginBottom={"0px"} nome="Consultar dados" estadoInicial={false}>
            {loading ? (
              <div style={{ padding: "16px" }}>Carregando...</div>
            ) : (
              <TabelaCompleta
                dados={pesquisa}
                lista={["curso_id", "nome"]}
                camposPesquisa={false}
              />
            )}
          </Colapse>
          <DivSeparador />
        </GridArea>

        <GridArea $area="operacao">
          <Label htmlFor="operacao">Operacao:</Label>
          <Select
            id="operacao"
            name="operacao"
            required
            value={operacao}
            onChange={(e) => setOperacao(e.target.value)}
          >
            <option value="0">Selecione a operação desejada</option>
            <option value="1">Adicionar</option>
            <option value="2">Alterar</option>
            <option value="3">Deletar</option>
          </Select>
        </GridArea>

        <GridArea $area="idCurso">
          <Label htmlFor="idCurso">ID:</Label>
          <Input
            type="text"                 
            id="idCurso"
            name="idCurso"
            value={objeto.curso_id}   
            placeholder="cole o curso_id"
            disabled={idDesabilitado}
            onChange={(e) => alterarObjeto(e, "curso_id")}
          />
        </GridArea>

        <GridArea $area="nome">
          <Label htmlFor="nome">Nome do Curso:</Label>
          <Input
            type="text"
            id="nome"
            name="nome"
            value={objeto.nome}
            disabled={operacao === "3"} 
            onChange={(e) => alterarObjeto(e, "nome")}
            required
          />
        </GridArea>

        <GridArea $area="reset">
          <Button $bgcolor={cores.backgroundBotaoSemFoco} type="reset">
            Limpar
          </Button>
        </GridArea>

        <GridArea $area="botoes">
          <Button type="submit">Salvar</Button>
        </GridArea>
      </FormGrid>
    </Box>
  );
}

export default ConfigurarCursos;
