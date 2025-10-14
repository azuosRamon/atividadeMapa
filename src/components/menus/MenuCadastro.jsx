import React, { useState } from "react";
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
    "nome nome nascimento"
    "cpf telefone imagem"
    "email email visibilidade"
    "rede_social rede_social rede_social"
    ". reset botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: 
        "tabela"
        "operacao"
        "id"
        "nome"
        "nascimento"
        "cpf"
        "telefone"
        "email"
        "visibilidade"
        "rede_social"
        "imagem"
        "reset"
        "botoes";
}
`;
import { supabase } from "../../../supabaseClient";

async function cadastrarUsuario(objeto) {
  // 1. Cria conta no Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: objeto.email,
    password: objeto.cpf,
  });

  if (error) throw error;

  const user = data.user;
    if (!user) throw new Error("Usuário não foi criado");

  return user;
}

function Cadastro({ usuarioLogado }) {

    const tabela = mapa.usuarios;
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
    const enviarCadastro = async (e)=>{
        e.preventDefault();
        try {
            const objetoUsuario = await cadastrarUsuario(objeto);
            console.log(objeto);
            const user_id = objetoUsuario.id;
            console.log(user_id);
            const objetoComUserId = {...objeto, user_id};
            await fazerEnvio(e, objetoComUserId);
        }
        catch(err){
            console.error("erro ao cadastrar usuario", err.message);
        }
    }
    
    return(
        <Box>
                <Title>Cadastro de Usuário</Title>
                <FormGrid onSubmit={enviarCadastro}>

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
export default Cadastro;