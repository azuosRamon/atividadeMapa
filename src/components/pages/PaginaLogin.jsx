import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from 'react-router-dom';
import Box from "../SubBox";
import Button from "../SubButton";
import Input from "../SubInput";
import Container from "../SubContainer";
import ParagrafoInformacao from "../SubParagrafo";
import SpamSublinhado from "../SubSpam";
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

function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logando, setLogando] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      console.log("Usuário já autenticado, redirecionando...");
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLogando(true);

    try {
      const response = await axios.post('https://atividademapa.onrender.com/login', {
        email,
        password
      });

      const { user } = response.data;

      if (!user || !user.user_id) {
        alert("Erro ao fazer login: usuário não encontrado.");
        setLogando(false);
        return;
      }

      localStorage.setItem("usuario", JSON.stringify(user));
      window.location.href = "/dashboard"; // força reload para AuthProvider atualizar
    } catch (err) {
      alert("Erro ao fazer login: " + (err.response?.data?.detail || err.message));
    } finally {
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

          <Button type="submit" disabled={loading}>
            {loading ? "Carregando..." : "Entrar"}
          </Button>
        </form>
        <StyledLink to="/RecuperarSenha">Esqueceu a senha? Clique aqui!</StyledLink>
        <ParagrafoInformacao>Ainda não tem uma conta?</ParagrafoInformacao>
        <ParagrafoInformacao>
          Envie um email para:
          <SpamSublinhado> email@mail.com.br </SpamSublinhado>
        </ParagrafoInformacao>
      </Box>
    </Container>
  );
}

export default Login;
