import React, { useState } from "react";
import styled from "styled-components";
import Box from "../SubBox";
import Title from "../SubTitleH2";
import useBancoDeDados from "../BdCrudSupabase";
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
    "empresa_id empresa_id empresa_id"
    ". reset botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: 
        "tabela"
        "operacao"
        "id"
        "nome"
        "empresa_id"
        "reset"
        "botoes";
}
`;

function CadastrarCargos({usuarioLogado}) {
    const tabela = mapa.cargos;
    const [objeto, setObjeto] = useState(
        Object.fromEntries(
            Object.entries(tabela.campos).map(([k, v]) => ([k, k=="empresa_id"?usuarioLogado.empresa_id:v.valor]))
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
        nomeTabela: tabela.tabela.nome,
        objeto,
        setObjeto,
        operacao,
        campoId: tabela.tabela.lista[0],
        campoNome: tabela.tabela.lista[1],
      });

return(
    <Box>
                <Title>Cadastrar Cargos</Title>
                <FormGrid onSubmit={fazerEnvio}>

                    <CriarCamposFormulario 
                    item={tabela}
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
