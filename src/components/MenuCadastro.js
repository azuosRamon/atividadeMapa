import React from "react";
import styled from "styled-components";
import Box from "./SubBox";
import Input from "./SubInput";
import Select from "./SubSelect";
import Button from "./SubButton";
import DivSeparador from "./SubDivSeparador";

const Title = styled.h2`
margin: 0 0 20px;
color: white;
`;

const Container = styled.div`
    height: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    text-align: center;
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
`;
function Cadastro(){
    return(
        <Container>
            <Box>
                <Title>Novo Usuário</Title>
                <DivSeparador></DivSeparador>
                <form>
                    <Input type="text" placeholder="Nome" required/>
                    <Input type="email" placeholder="Email" required/>
                    <Input type="text" placeholder="CPF" required/>
                    <Input type="text" placeholder="Matricula" required/>
                    <Select>
                        <option value="">Cargo ou Funcao</option>
                        <option value="">Coordenador(a)</option>
                        <option value="">Professor(a)</option>
                        <option value="">Secretário(a)</option>
                    </Select>
                    <Button type="submit">Cadastrar</Button>
                </form>
            </Box>
        </Container>
    )
}

export default Cadastro;