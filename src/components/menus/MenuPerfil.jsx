import React, { useState} from "react";
import styled from "styled-components";
import Box from "../SubBox";
import Input from "../SubInput";
import Label from "../SubLabel";
import Button from "../SubButton";
import Title from "../SubTitleH2";
import GridArea from "../SubGridArea";
import DivSeparador from "../SubDivSeparador";
import useBancoDeDados from "../BdSupabase";


import CriarCamposFormulario from "../SubCriadorForm";
import mapa from "../BdObjetoTabelas"

const FormGrid = styled.form`
gap: 10px;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "nome sobrenome cpf"
    "nascimento telefone visibilidade"
    "email email email"
    "rede_social rede_social rede_social"
    "imagem imagem imagem"
    ". reset botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: 
        "nome"
        "sobrenome"
        "telefone"
        "nascimento"
        "cpf"
        "email"
        "foto"
        "exibirContatos"
        "empresa"
        "funcao"
        "cargo"
        "botoes"
}
`;



function AtualizarPerfil({usuarioLogado}) {
    console.log(usuarioLogado);
    const tabela = mapa.usuarios;
    const [objeto, setObjeto] = useState(
        Object.fromEntries(
            Object.entries(tabela.campos).map(([k, v]) => ([k, k=="usuario_id"?usuarioLogado.usuario_id:v.valor]))
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
                <Title>Atualizar Perfil</Title>
                <DivSeparador></DivSeparador>
                <FormGrid onSubmit={fazerEnvio}>

                    <CriarCamposFormulario 
                    item={tabela}
                    setFuncao={alterarObjeto}
                    operacao={operacao}
                    setOperacao={setOperacao}
                    objeto={objeto}
                    setObjeto={setObjeto}
                    ></CriarCamposFormulario>

                    
                </FormGrid>
            </Box>
    )
}

export default AtualizarPerfil;