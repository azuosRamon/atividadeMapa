import React, { useState, useEffect, useMemo} from "react";
import styled from "styled-components";
import Box from "../SubBox";
import Title from "../SubTitleH2";
import useBancoDeDados from "../BdSupabase";
import CriarCamposFormulario from "../SubCriadorForm";
import mapa from "../BdObjetoTabelas"


const FormGrid = styled.form`
gap: 10px;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: /* VERIFICAR OS NOMES DAS AREAS NO ARQUIVO BdObjeto */
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
            Object.entries(cargos.campos).map(([k, v]) => ([k, k=="empresa_id"?usuarioLogado.empresa_id:v.valor]))
        )
    );
      const [operacao, setOperacao] = useState("0");
    
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
        campoNome: "nome"
      });

return(
    <Box>
                <Title>Cadastrar Cargos</Title>
                <FormGrid onSubmit={fazerEnvio}>

                    <CriarCamposFormulario 
                    item={cargos}
                    setFuncao={alterarObjeto}
                    operacao={operacao}
                    setOperacao={setOperacao}
                    objeto ={objeto}
                    ></CriarCamposFormulario>

                    
                </FormGrid>
            </Box>
    )
}

export default CadastrarCargos;
