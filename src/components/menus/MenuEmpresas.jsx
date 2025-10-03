import React, { useState, useEffect, useMemo} from "react";
import styled from "styled-components";
import Box from "../SubBox";
import Title from "../SubTitleH2";
import useBancoDeDados from "../BdCrudSupabase";
import mapa from "../BdObjetoTabelas"
import CriarCamposFormulario from "../SubCriadorForm";

const FormGrid = styled.form`
gap: 10px;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "tabela tabela tabela"
    "operacao operacao id"
    "nome nome nome"
    "cnpj cnpj telefone"
    "email email visibilidade"
    "imagem imagem imagem"
    "rede_social_1 rede_social_1 rede_social_1"
    "rede_social_2 rede_social_2 rede_social_2"
    "modelo_id modelo_id modelo_id"
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
        "email "
        "exibirContatos"
        "foto"
        "senha"
        "redeSocial1"
        "redeSocial2"
        "reset"
        "botoes";
}
`;

function CadastrarEmpresa() {
        const tabela = mapa.empresas;
    const [objeto, setObjeto] = useState(
        Object.fromEntries(
            Object.entries(tabela.campos).map(([k, v]) => ([k, v.valor]))
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
                <Title>Cadastro de Empresas</Title>
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


export default CadastrarEmpresa;
