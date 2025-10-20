import React, { useState, useEffect} from "react";
import styled from "styled-components";
import Select from "../SubSelect";
import Input from "../SubInput";
import Label from "../SubLabel";
import Button from "../SubButton";
import GridArea from "../SubGridArea";
import cores from "../Cores"
import useBancoDeDados from "../BdSupabase";
import CriarCamposFormulario from "../SubCriadorForm";
import mapa from "../BdObjetoTabelas"
import Title from "../SubTitleH2";

const FormGrid = styled.form`
gap: 10px;
display: grid;
box-sizing: border-box;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "operacao operacao idCampus"
    "nome nome nome"
    "cep cidade estado"
    "logradouro logradouro latitude"
    "complemento complemento longitude"
    "reset . botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas:
           "operacao"
           "idCampus"
            "nome"
            "cep"
            "cidade"
            "estado"
            "logradouro"
            "complemento"
            "latitude"
            "longitude"
            "reset"
            "botoes";
}
`;

const TitleSublinhado = styled(Title)`
    border-bottom: 2px solid;
`

function CampusOpcoes({ usuarioLogado, operacaoEnviada, item = null }) {
    const tabela = mapa.imoveis;
    const [objeto, setObjeto] = useState(
        Object.fromEntries(
            !item ?
            Object.entries(tabela.campos).map(([k, v]) => ([k, k=="empresa_id"?usuarioLogado.empresa_id:v.valor]))
            :
            Object.entries(item)

        )
    );
    const [operacao, setOperacao] = useState(operacaoEnviada || "1");

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
            <div>
                <TitleSublinhado>IMÓVEL</TitleSublinhado>
                <FormGrid onSubmit={fazerEnvio}>
                    <CriarCamposFormulario 
                    item={tabela}
                    setFuncao={alterarObjeto}
                    operacao={operacao}
                    setOperacao={setOperacao}
                    objeto ={objeto}
                    ></CriarCamposFormulario>
                </FormGrid>
            </div>
    )
}

export default CampusOpcoes;