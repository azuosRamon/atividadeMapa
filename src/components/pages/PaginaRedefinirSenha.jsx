import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Container from "../SubContainer";
import Box from "../SubBox";
import Input from "../SubInput";
import Button from "../SubButton";
import ParagrafoInformacao from "../SubParagrafo";
import SpamSublinhado from "../SubSpam";
import cores from "../Cores";
import { supabase } from "../../../supabaseClient";

// Componente de título (mantido com o mesmo nome original)
const Title = styled.h2`
  margin: 0 0 20px;
  color: ${cores.corTexto};
`;

const TooltipContainer = styled.div`
  position: relative;
  background-color: #333;
  color: white;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 0.9em;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  text-align: left;
`;

const RequisitoSenhaItem = styled.li`
  list-style: none;
  color: ${(props) => (props.$valido ? "#4CAF50" : "#FF4D4D")};
  font-weight: bold;
  transition: color 0.3s ease;
`;

/**
 * Função para verificar os requisitos da senha.
 * @param {string} senha - A senha a ser verificada.
 * @returns {object} - Objeto com o status de cada requisito.
 */
const verificarRequisitosSenha = (senha) => {
  const requisitos = {
    comprimento: senha.length >= 6,
    maiuscula: /[A-Z]/.test(senha),
    minuscula: /[a-z]/.test(senha),
    numero: /\d/.test(senha),
    especial: /[^a-zA-Z0-9]/.test(senha),
  };
  const todosValidos = Object.values(requisitos).every(Boolean);
  return { ...requisitos, todosValidos };
};

function PaginaRedefinirSenha() {
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [requestState, setRequestState] = useState({
    status: "idle",
    error: null,
  });

  const navegar = useNavigate();

  const requisitosSenha = useMemo(() => {
    const resultados = verificarRequisitosSenha(senha);
    console.log("Status da Senha:", resultados);
    return resultados;
  }, [senha]);

  useEffect(() => {
    if (requestState.error) {
      setRequestState((prevState) => ({ ...prevState, error: null }));
    }
  }, [senha, confirmacao]);

  useEffect(() => {
    const tentarConfigurarSessaoDaUrl = async () => {
      setRequestState({ status: "loading", error: null });

      const params = new URLSearchParams(
        window.location.search + window.location.hash.replace("#", "&")
      );

      const access_token = params.get("access_token") || params.get("token");
      const refresh_token = params.get("refresh_token");

      const erroDaUrl = params.get("error");
      const descricaoErro = params.get("error_description");

      if (erroDaUrl) {
        setRequestState({
          status: "error",
          error: decodeURIComponent(descricaoErro || erroDaUrl),
        });
        return;
      }

      if (!access_token) {
        setRequestState({
          status: "error",
          error:
            "Link de recuperação inválido ou expirado. Tente novamente a recuperação de senha.",
        });
        return;
      }

      try {
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          setRequestState({
            status: "error",
            error: error.message || "Erro ao validar token.",
          });
          return;
        }

        try {
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (e) {
          console.warn("Não foi possível limpar tokens da URL", e);
        }

        setRequestState({ status: "ready", error: null });
      } catch (err) {
        setRequestState({
          status: "error",
          error: err.message || "Erro inesperado.",
        });
      }
    };

    if (window.location.search || window.location.hash) {
      tentarConfigurarSessaoDaUrl();
    } else {
      setRequestState({
        status: "error",
        error:
          "Link de recuperação inválido ou expirado. Tente novamente a recuperação de senha.",
      });
    }
  }, []);

  const enviarNovaSenha = async (e) => {
    e.preventDefault();
    setRequestState({ status: "loading", error: null });

    if (!requisitosSenha.todosValidos) {
      setRequestState({
        status: "ready",
        error: "A senha não atende a todos os requisitos.",
      });
      return;
    }

    if (senha !== confirmacao) {
      setRequestState({
        status: "ready",
        error: "As senhas não coincidem.",
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({ password: senha });

      if (error) {
        setRequestState({
          status: "ready",
          error: error.message || "Erro ao atualizar senha.",
        });
        return;
      }

      setRequestState({ status: "sent", error: null });
    } catch (err) {
      setRequestState({
        status: "error",
        error: err.message || "Erro inesperado.",
      });
    }
  };

  return (
    <Container>
      <Box>
        <Title>Redefinir senha</Title>

        {requestState.status === "idle" && (
          <ParagrafoInformacao>
            Aguardando a validação do link de recuperação. Certifique-se de ter
            chegado a esta página através do link enviado ao seu e-mail.
          </ParagrafoInformacao>
        )}

        {requestState.status === "loading" && (
          <ParagrafoInformacao>Aguarde...</ParagrafoInformacao>
        )}

        {requestState.status === "ready" && (
          <form onSubmit={enviarNovaSenha}>
            <Input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="Nova senha"
              required
              minLength={6}
            />

            {isInputFocused && (
              <TooltipContainer>
                <ul>
                  <RequisitoSenhaItem $valido={requisitosSenha.comprimento}>
                    Pelo menos 6 caracteres
                  </RequisitoSenhaItem>
                  <RequisitoSenhaItem $valido={requisitosSenha.maiuscula}>
                    Uma letra maiúscula
                  </RequisitoSenhaItem>
                  <RequisitoSenhaItem $valido={requisitosSenha.minuscula}>
                    Uma letra minúscula
                  </RequisitoSenhaItem>
                  <RequisitoSenhaItem $valido={requisitosSenha.numero}>
                    Um número
                  </RequisitoSenhaItem>
                  <RequisitoSenhaItem $valido={requisitosSenha.especial}>
                    Um caractere especial
                  </RequisitoSenhaItem>
                </ul>
              </TooltipContainer>
            )}

            <Input
              type="password"
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              placeholder="Confirme a nova senha"
              required
            />

            <Button type="submit" disabled={requestState.status === "loading"}>
              Atualizar senha
            </Button>

            {requestState.error && (
              <ParagrafoInformacao style={{ color: "red", marginTop: "10px" }}>
                {requestState.error}
              </ParagrafoInformacao>
            )}
          </form>
        )}

        {requestState.status === "sent" && (
          <>
            <ParagrafoInformacao>
              Senha atualizada com sucesso.
            </ParagrafoInformacao>
            <Button onClick={() => navegar("/login")}>Ir para Login</Button>
          </>
        )}

        {requestState.status === "error" && (
          <>
            <ParagrafoInformacao style={{ color: "red" }}>
              {requestState.error}
            </ParagrafoInformacao>
            <Button onClick={() => navegar("/RecuperarSenha")}>
              Tentar Recuperar Senha Novamente
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
}

export default PaginaRedefinirSenha;
