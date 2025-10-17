import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Input from "../SubInput";
import Select from "../SubSelect";
import Label from "../SubLabel";
import Button from "../SubButton";
import GridArea from "../SubGridArea";
import cores from "../Cores"
import axios from "axios";
import useBancoDeDados from "../BdSupabase";
import SelectBancoDeDados from "../BdSelectBusca";

const FormGrid = styled.form`
gap: 10px;
display: grid;
box-sizing: border-box;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "imovelId imovelId imovelId"
    "operacao operacao blocosId"
    "nome nome nome"
    "reset . botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: 
        "imovelId"
        "operacao"
        "blocosId"
        "nome"
        "reset"
        "botoes";
}
`;

function BlocosOpcoes({ dados }) { 
  const [objeto, setObjeto] = useState({
    bloco_id: "",
    nome: "",
    imoveil_id: ""
  });
  const [operacao, setOperacao] = useState("1");

  const {
    data,
    pesquisa,
    loading2,
    fazerEnvio,
    alterarObjeto
  } = useBancoDeDados({
    nomeTabela: "blocos",
    objeto,
    setObjeto,
    operacao,
    campoId: "bloco_id",
    campoNome: "nome"
  });

  const [listaCampus, setListaCampus] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    SelectBancoDeDados({
      nomeTabela: "imoveis",
      setData: setListaCampus,
      setLoading: setLoading
    });
  }, []);

  return (
    <FormGrid onSubmit={fazerEnvio}>
      <GridArea $area="operacao">
        <Label htmlFor="operacao">Operacao:</Label>
        <Select
          autoFocus
          id="operacao"
          name="operacao"
          required
          onChange={(e) => {
            setOperacao(e.target.value);
            alterarObjeto(e, "bloco_id");
          }}
        >
          <option value="0">Selecione a operação desejada</option>
          <option value="1">Adicionar</option>
          <option value="2">Alterar</option>
          <option value="3">Deletar</option>
        </Select>
      </GridArea>

      <GridArea $area="imovelId">
        <Label htmlFor="imovelId">Selecione o campus:</Label>
        <Select
          id="imovelId"
          name="imovelId"
          required
          onChange={(e) => alterarObjeto(e, "imoveil_id")}
        >
          {!loading &&
            listaCampus.map((campus) => (
              <option key={campus.imoveil_id} value={campus.imoveil_id}>
                {campus.nome + " - " + campus.cidade}
              </option>
            ))}
        </Select>
      </GridArea>

      <GridArea $area="blocosId">
        <Label htmlFor="blocosId">ID do Bloco:</Label>
        <Input
          type="number"
          id="blocosId"
          name="blocosId"
          alt="Apenas para alteração ou exclusão"
          disabled={!operacao || Number(operacao) <= 1}
          onChange={(e) => alterarObjeto(e, "bloco_id")}
        />
      </GridArea>

      <GridArea $area="nome">
        <Label htmlFor="nome">Nome ou Número do bloco:</Label>
        <Input
          type="text"
          id="nome"
          value={objeto.nome}
          name="nome"
          disabled={!operacao || Number(operacao) === 3}
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
  );
}

export default BlocosOpcoes;