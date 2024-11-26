import React from "react";
import styled from "styled-components";
import Container from "./SubContainer";
import Box from "./SubBox";
import Input from "./SubInput";
import Select from "./SubSelect";
import Button from "./SubButton";

const Title = styled.h2`
margin: 0 0 20px;
color: white;
`;

function Cadastro(){
    return(
        <Container>
            <Box>
                <Title>Novo Usuário</Title>
                <form>
                    <Input type="text" placeholder="Nome" required/>
                    <Input type="date" placeholder="Data de nascimento" required/>
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