import React from "react";
import styled from "styled-components";
import Box from "./SubBox";
import Input from "./SubInput";
import Select from "./SubSelect";
import Button from "./SubButton";

const Title = styled.h2`
margin: 0 0 20px;
color: white;
`;

const Container = styled.div`
    width: 90%;
    height: auto;
    margin: 20px auto;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.8);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    text-align: center;
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
`;

const LabelInput = styled.label`
    display: block;
    text-transform: uppercase;
    font-size: 12px;
    margin-bottom: 5px;
    font-weight: bold;
    color: #cccccc;
    text-align: left;
`;

const GridArea = styled.div`
grid-area: ${(props) => props.area}
`;

const FormGrid = styled.form`
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "nome sobrenome telefone"
    "nascimento cpf matricula"
    "email email email"
    "senhaAtual . ."
    "senhaAtual senhaNova confirmarSenha"
    ". . botoes"
`;

const data = [
    { nome: "Carlos", sobrenome: "Silva", telefone: "21 99999-9999",nascimento:"2025-03-24", email:"carlossilva@mail.com", cpf: "111.222.333-44", matricula:"202411122", funcao: "Administrador", foto: "" },
    { nome: "Ana", funcao: "Secretaria", foto: "" },
    { nome: "Maria", funcao: "Professor", foto: "" },
]; 

function Horarios(nome, sobrenome, telefone, nascimento, email, cpf, matricula) {
    nome = data[0].nome;
    sobrenome = data[0].sobrenome;
    nascimento = data[0].nascimento;
    email = data[0].email;
    cpf = data[0].cpf;
    matricula = data[0].matricula;
    telefone = data[0].telefone;
    return(
        <Container>
            <Box>
                <Title>Atualizar Perfil</Title>
                <FormGrid>
                    <GridArea area="nome">
                        <LabelInput for="nome">Ano:</LabelInput>
                        <Input type="text" id="nome" name="nome" value={nome} required/>
                    </GridArea>
                    <GridArea area="sobrenome">
                        <LabelInput for="sobrenome">Semestre:</LabelInput>
                        <Input  type="text" id="sobrenome" name="sobrenome" value={sobrenome} required/>
                    </GridArea>
                    <GridArea area="telefone">
                        <LabelInput for="telefone">id:</LabelInput>
                        <Input  type="text" id="sobrenome" name="telefone" value={telefone} required/>
                    </GridArea>
                    <GridArea area="nascimento">
                        <LabelInput for="nascimento">Início:</LabelInput>
                        <Input type="date" id="nascimento" name="nascimento" value={nascimento}  required/>
                    </GridArea>
                    <GridArea area="cpf">
                        <LabelInput for="cpf">Duração:</LabelInput>
                        <Input type="text" name="cpf" id="cpf" value={cpf} required/>
                    </GridArea>
                    <GridArea area="matricula">
                        <LabelInput for="matricula">Término:</LabelInput>
                        <Input type="text" name="matricula" id="matricula" value={matricula} required/>
                    </GridArea>
                    <GridArea area="limpar">
                        <Button type="submit">Limpar</Button>   
                    </GridArea>
                    <GridArea area="salvar">
                        <Button type="submit">Salvar</Button>   
                    </GridArea>

                </FormGrid>
            </Box>
        </Container>
    )
}

export default Horarios;