import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Box from "../SubBox";
import Title from "../SubTitleH2";
import useBancoDeDados from "../BdCrudSupabase";
import mapa from "../BdObjetoTabelas"
import CriarCamposFormulario from "../SubCriadorForm";
import { gerenciadorDeEventos } from "../../utils/gerenciadorDeEventos"; 
import { supabase } from "../../../supabaseClient";

import Modal from "../SubModal";
import Input from "../SubInput";
import Button from "../SubButton";
import ParagrafoInformacao from "../SubParagrafo";
import { useNavigate } from "react-router-dom";
import cores from "../Cores";

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
    display: flex;
    flex-direction: column;
}
`;


async function cadastrarUsuario(objeto) {
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
    const navigate = useNavigate();

    const [cpfVerificacao, setCpfVerificacao] = useState("");
    const [modalVerificacao, setModalVerificacao] = useState(true);
    const [verificando, setVerificando] = useState(false);

    const [objeto, setObjeto] = useState(
        Object.fromEntries(
            Object.entries(tabela.campos).map(([k, v]) => ([k, k=="empresa_id"?usuarioLogado.empresa_id:v.valor]))
        )
    );
    const [operacao, setOperacao] = useState("0");

    const verificarCpf = async () => {
        if (!cpfVerificacao) {
            alert("Digite um CPF para continuar.");
            return;
        }

        setVerificando(true);
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select('usuario_id, cpf')
                .eq('cpf', cpfVerificacao)
                .maybeSingle();

            if (data) {
                alert("Usuário já possui conta cadastrada! Redirecionando para a aba de Vínculo Empresarial...");
                navigate('/relacionarUsuarios'); 
            } else {
                setObjeto(prev => ({ ...prev, cpf: cpfVerificacao }));
                setModalVerificacao(false);
            }
        } catch (err) {
            console.error("Erro ao verificar CPF:", err);
            alert("Ocorreu um erro ao verificar o banco de dados.");
        } finally {
            setVerificando(false);
        }
    };
    
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
            console.log("Iniciando cadastro Auth...");
            const objetoUsuario = await cadastrarUsuario(objeto);
            console.log("Usuário Auth criado:", objetoUsuario.id);

            const user_id = objetoUsuario.id;
            const objetoComUserId = {...objeto, user_id};
            
            console.log("Enviando para o banco de dados...");
            await fazerEnvio(e, objetoComUserId);
            console.log("Cadastro no banco de dados concluído.");

            //Dispara o evento de sucesso
            console.log("Disparando evento 'novoUsuarioCadastrado'...");
            
            gerenciadorDeEventos.disparar("novoUsuarioCadastrado", {
              novoUsuario: objetoComUserId, // Dados do usuário recém-criado
              adminUsuario: usuarioLogado   // Dados do admin que fez o cadastro
            });

        }
        catch(err){
            console.error("Erro ao cadastrar usuario", err.message);
           
        }
    }
    
    return(
        <React.Fragment>
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

            <Modal aberto={modalVerificacao} onFechar={() => {}}>
                <Box>
                    <Title>Pesquisa de Usuário</Title>
                    <ParagrafoInformacao>
                        Antes de cadastrar, valide se o funcionário não possui uma conta matriz. <br/>
                        Digite o CPF para checar a rede.
                    </ParagrafoInformacao>
                    <Input 
                        placeholder="CPF (apenas números)" 
                        value={cpfVerificacao} 
                        onChange={(e) => setCpfVerificacao(e.target.value)} 
                        style={{ marginTop: '10px' }}
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <Button 
                            onClick={() => navigate('/dashboard')} 
                            disabled={verificando} 
                            $bgcolor={cores.backgroundBotaoSemFoco}
                            type="button"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={verificarCpf} 
                            disabled={verificando}
                            $bgcolor={cores.corAdicionar}
                            type="button"
                        >
                            {verificando ? "Consultando..." : "Continuar"}
                        </Button>
                    </div>
                </Box>
            </Modal>
        </React.Fragment>
    )
}
export default Cadastro;