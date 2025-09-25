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
import CriarCamposFormulario from "../SubCriadorForm";
import mapa from "../BdObjetoTabelas"
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
        "id"
        "nome"
        "reset"
        "botoes";
}
`;

function CadastrarCargos({usuarioLogado}) {
    const cargos = mapa.cargos;
    const [objeto, setObjeto] = useState(
        Object.fromEntries(
            Object.entries(cargos.campos).map(([k, v]) => [k, v.valor])
        )
    );
      const [operacao, setOperacao] = useState("1");
    
      const {
        data,
        pesquisa,
        loading,
        fazerEnvio,
        alterarObjeto
      } = useBancoDeDados({
        nomeTabela: cargos.tabela.nome,
        objeto,
        setObjeto,
        operacao,
        campoId: "cargo_id",
        campoNome: "nome_cargo"
      });

return(
    <Box>
                <Title>Cadastrar Cargos</Title>
                <FormGrid onSubmit={(e)=> {e.preventDefault();console.log("enviou")}}>

                    <CriarCamposFormulario 
                    item={cargos}
                    setFuncao={alterarObjeto}
                    operacao={operacao}
                    setOperacao={operacao}
                    ></CriarCamposFormulario>

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

export default CadastrarCargos;
