import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from 'react-router-dom';
import Box from "../SubBox";
import Button from "../SubButton";
import Input from "../SubInput";
import Container from "../SubContainer";
import ParagrafoInformacao from "../SubParagrafo";
import SpamSublinhado from "../SubSpam";
import Modal from "../SubModal";
import cores from "../Cores";
import { supabase } from "/supabaseClient";
import { useAuth } from "../AuthProvider"
import axios from "axios";

const Title = styled.h2`
  margin: 0 0 20px;
  color: ${cores.corTexto};
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  color: ${cores.corTexto};
  text-decoration: underline;
  font-size: 12px;
  cursor: pointer;
`;

// Recupera informações de modelo quando não houver MultiTenant ou como Fallback
async function RecuperarModelo(empresaId) {
  try {
    const { data: empresa, error: errorEmpresa } = await supabase
      .from('empresas')
      .select('modelo_id')
      .eq('empresa_id', empresaId)
      .single();

    if (errorEmpresa) throw errorEmpresa;

    const modeloId = empresa?.modelo_id;
    if (!modeloId) return null;

    const { data: modelo, error } = await supabase
      .from('modelos')
      .select('*')
      .eq('modelo_id', modeloId)
      .single();

    if (error) throw error;
    return modelo;
  } catch (err) {
    console.error("Erro ao recuperar modelo:", err);
    return null;
  }
}

function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logando, setLogando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [modalErroAberto, setModalErroAberto] = useState(false);

  // States para seleção de empresa (MultiTenant)
  const [empresasDisponiveis, setEmpresasDisponiveis] = useState([]);
  const [selecionandoEmpresa, setSelecionandoEmpresa] = useState(false);
  const [tmpUser, setTmpUser] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);


  const concluirLogin = async (userData, vinculo) => {
      let modelo = null;
      let empresaId = userData.empresa_id;

      const safeUser = {
        user_id: userData.user_id,
        nome: userData.nome,
        sobrenome: userData.sobrenome,
        imagem: userData.imagem || userData.foto || userData.avatar || "",
        tipo: userData.tipo,
        empresa_id: userData.empresa_id,
        funcao: userData.funcao,
        usuario_id: userData.usuario_id
      };

      if (vinculo) {
          empresaId = vinculo.empresa_id;
          safeUser.empresa_id = empresaId;
          safeUser.funcao = vinculo.funcoes?.nome || safeUser.funcao;
          
          if (vinculo.empresas?.modelo_id) {
              try {
                  const { data: modeloFetch } = await supabase
                      .from('modelos')
                      .select('*')
                      .eq('modelo_id', vinculo.empresas.modelo_id)
                      .single();
                  modelo = modeloFetch;
              } catch(e) {
                  console.error("Erro ao buscar modelo do vinculo", e);
              }
          }
      } else if (empresaId) {
          modelo = await RecuperarModelo(empresaId);
      }

      localStorage.setItem("usuario", JSON.stringify(safeUser));
      if (modelo) localStorage.setItem("modelo", JSON.stringify(modelo));
      else localStorage.removeItem("modelo");

      window.location.href = "/dashboard";
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setLogando(true);

    try {
      const response = await axios.post('https://atividademapa.onrender.com/login', {
        email,
        password
      });

      const { user: userRecebido, access_token, refresh_token } = response.data;

      if (!userRecebido || !userRecebido.user_id) {
        setMensagemErro("Usuário não encontrado.");
        setModalErroAberto(true);
        setLogando(false);
        return;
      }

      // 1. Injeta os tokens na sessão do supabase do Client
      if (access_token && refresh_token) {
        localStorage.setItem("sb_tokens", JSON.stringify({ access_token, refresh_token }));
        await supabase.auth.setSession({ access_token, refresh_token });
      }

      try {
        const sessao = await axios.get(`https://atividademapa.onrender.com/sessao/${userRecebido.user_id}`);
        if (!sessao.data?.user) {
          setMensagemErro("Erro ao validar sessão no servidor.");
          setModalErroAberto(true);
          setLogando(false);
          return;
        }
      } catch (errSessao) {
        console.warn("Falha ao validar sessão após login:", errSessao);
      }

      // 2. Com a sessao habilitada, procuramos as empresas do usuário
      const { data: vinculos, error: errorVinculos } = await supabase
          .from('usuarios_empresas')
          .select(`
            empresa_id,
            funcao_id,
            funcoes(nome),
            empresas(nome, modelo_id)
          `)
          .eq('usuario_id', userRecebido.usuario_id);

      if (errorVinculos || !vinculos || vinculos.length === 0) {
          // Fallback usual: não tem vínculos cadastrados no DB associativo
          await concluirLogin(userRecebido, null);
          return;
      }

      if (vinculos.length === 1) {
          await concluirLogin(userRecebido, vinculos[0]);
          return;
      } else {
          // Processo Multitenant - abre modal
          setEmpresasDisponiveis(vinculos);
          setTmpUser(userRecebido);
          setLogando(false);
          setSelecionandoEmpresa(true);
      }

    } catch (err) {
      setMensagemErro(err.response?.data?.detail || err.message);
      setModalErroAberto(true);
      setLogando(false);
    }
  };

  if (loading) return <div>Carregando sessão...</div>;

  return (
    <Container>
      <Box>
        <Title>Faça Login</Title>
        <form onSubmit={handleLogin}>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            name="password"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" disabled={logando}>
            {logando ? "Carregando..." : "Entrar"}
          </Button>
        </form>
        <StyledLink to="/RecuperarSenha">Esqueceu a senha? Clique aqui!</StyledLink>
        <ParagrafoInformacao>Ainda não tem uma conta?</ParagrafoInformacao>
        <ParagrafoInformacao>
          Envie um email para:
          <SpamSublinhado> email@mail.com.br </SpamSublinhado>
        </ParagrafoInformacao>
      </Box>
      
      <Modal aberto={selecionandoEmpresa} onFechar={()=>{}}>
          <Box>
             <Title>Selecione a Empresa</Title>
             <ParagrafoInformacao>Encontramos mais de um vínculo para sua conta.</ParagrafoInformacao>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                 {empresasDisponiveis.map(vinculo => (
                    <Button key={vinculo.empresa_id} onClick={() => concluirLogin(tmpUser, vinculo)}>
                        Acessar como {vinculo.funcoes?.nome} na {vinculo.empresas?.nome || 'Empresa'}
                    </Button>
                 ))}
             </div>
          </Box>
      </Modal>

      {/* Modal de Erro */}
      <Modal aberto={modalErroAberto} onFechar={() => setModalErroAberto(false)}>
          <Box>
            <Title>Erro no Login</Title>
            <ParagrafoInformacao style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>
              {mensagemErro}
            </ParagrafoInformacao>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={() => setModalErroAberto(false)}>
                Tentar Novamente
              </Button>
            </div>
          </Box>
      </Modal>

    </Container>
  );
}

export default Login;
