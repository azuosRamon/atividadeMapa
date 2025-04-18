import React, { useState} from "react";
import styled from "styled-components";
import { Link } from 'react-router-dom';
import Box from "./SubBox";
import Button from "./SubButton";
import Input from "./SubInput";
import Container from "./SubContainer";
import ParagrafoInformacao from "./SubParagrafo";
import SpamSublinhado from "./SubSpam";
import { useNavigate } from 'react-router-dom';
import cores from "./Cores"

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



function Login(){
    const [matricula, setMatricula] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();
    const efetuarLogin = (event) => {
        event.preventDefault(); // Evita recarregamento da página
        if (matricula === "2025" && senha === "admin") {
          navigate("/logado");
        } else {
          alert("Matrícula ou senha incorreta!");
        }
      };
    return(
        <Container>
            <Box>
                <Title>Faça Login</Title>
                <form onSubmit={efetuarLogin}>
                    <Input name="matricula" type="number" placeholder="Matrícula" onChange={(e) => setMatricula(e.target.value)} required/>
                    <Input name="password"type="password" placeholder="Password" onChange={(e)=> setSenha(e.target.value)} required/>
                    <Button type="submit">Login</Button>
                </form>
                <StyledLink to="/RecuperarSenha">Esqueceu a senha? Clique aqui!</StyledLink>
                <ParagrafoInformacao>Ainda não tem uma conta?</ParagrafoInformacao>
                <ParagrafoInformacao>Envie um email para:<SpamSublinhado>email@mail.com.br</SpamSublinhado></ParagrafoInformacao>
            </Box>
        </Container>
    )
}


export default Login;