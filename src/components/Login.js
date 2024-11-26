import React from "react";
import styled from "styled-components";
import { Link } from 'react-router-dom';
import Box from "./SubBox";
import Button from "./SubButton";
import Input from "./SubInput";
import Container from "./SubContainer";
import ParagrafoInformacao from "./SubParagrafo";
import SpamSublinhado from "./SubSpam";

const Title = styled.h2`
margin: 0 0 20px;
color: white;
`;

const StyledLink = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    color: white;
    text-decoration: underline;
    font-size: 12px;
    cursor: pointer;
`;



function Login(){
    return(
        <Container>
            <Box>
                <Title>Faça Login</Title>
                <form>
                    <Input type="number" placeholder="Matrícula" required/>
                    <Input type="password" placeholder="Password" required/>
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