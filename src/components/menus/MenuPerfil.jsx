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
grid-template-areas: ${(props) =>
  props.$isEmpresa
    ? `
      "nome cnpj telefone"
      "email modelo_id visibilidade"
      "rede_social_1 rede_social_2 ."
      "imagem imagem imagem"
      ". reset botoes"
      `
    : `
      "nome sobrenome cpf"
      "nascimento telefone visibilidade"
      "email email email"
      "rede_social rede_social rede_social"
      "imagem imagem imagem"
      ". reset botoes"
      `};

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: ${(props) =>
      props.$isEmpresa
        ? `
          "nome"
          "cnpj"
          "telefone"
          "email"
          "modelo_id"
          "visibilidade"
          "rede_social_1"
          "rede_social_2"
          "imagem"
          "botoes"
          `
        : `
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
          `};
}
`;

function AtualizarPerfil({usuarioLogado}) {
    console.log(usuarioLogado);
    const isEmpresa = usuarioLogado?.tipo?.toLowerCase() === "empresa";
    const tabelaBase = isEmpresa ? mapa.empresas : mapa.usuarios;
    
    // Força mostrar para false para ocultar a tabela de listagem de dados na tela de perfil
    const tabela = {
        ...tabelaBase,
        tabela: {
            ...tabelaBase.tabela,
            mostrar: false
        }
    };
    
    const primaryKey = tabela.tabela.lista[0];
    const primaryKeyValue = isEmpresa ? usuarioLogado.empresa_id : usuarioLogado.usuario_id;

    const [objeto, setObjeto] = useState(
        Object.fromEntries(
            Object.entries(tabela.campos).map(([k, v]) => ([
                k, 
                k === primaryKey ? primaryKeyValue : v.valor
            ]))
        )
    );
    const [operacao, setOperacao] = useState("2");
    
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

    const enviarPerfil = async (e) => {
        e.preventDefault();
        await fazerEnvio(e);

        // Atualiza o localStorage com os novos dados
        const usuarioLocal = JSON.parse(localStorage.getItem("usuario") || "null");
        if (usuarioLocal) {
            const usuarioAtualizado = {
                ...usuarioLocal,
                nome: objeto.nome || usuarioLocal.nome,
                sobrenome: isEmpresa ? "" : (objeto.sobrenome || usuarioLocal.sobrenome),
                imagem: objeto.imagem || usuarioLocal.imagem
            };
            localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
        }
        window.location.reload();
    };

    return (
        <Box>
            <Title>Atualizar Perfil</Title>
            <DivSeparador></DivSeparador>
            <FormGrid onSubmit={enviarPerfil} $isEmpresa={isEmpresa}>
                <CriarCamposFormulario 
                    item={tabela}
                    setFuncao={alterarObjeto}
                    operacao={operacao}
                    setOperacao={setOperacao}
                    objeto={objeto}
                    setObjeto={setObjeto}
                />
            </FormGrid>
        </Box>
    )
}

export default AtualizarPerfil;