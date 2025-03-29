import React, { useState} from "react";
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
    height: auto;
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



function AtualizarPerfil(id) {
    id = 0
    const [nome, trocarNome] = useState(data[id].nome);
    const [sobrenome, trocarSobrenome] = useState(data[id].sobrenome);
    const [telefone, trocarTelefone] = useState(data[id].telefone)
    const [nascimento, trocarNascimento] = useState(data[id].nascimento)
    const [email, trocarEmail] = useState(data[id].email)
    const cpf = data[id].cpf;
    const matricula = data[id].matricula;
    return(
        <Container>
            <Box>
                <Title>Atualizar Perfil</Title>
                <FormGrid>
                    <GridArea area="nome">
                        <LabelInput for="nome">Nome:</LabelInput>
                        <Input type="text" id="nome" name="nome" value={nome} required onChange={(e) => trocarNome(e.target.value)}/>
                    </GridArea>
                    <GridArea area="sobrenome">
                        <LabelInput for="sobrenome">Sobrenome:</LabelInput>
                        <Input  type="text" id="sobrenome" name="sobrenome" value={sobrenome} required onChange={(e) => trocarSobrenome(e.target.value)} />
                    </GridArea>
                    <GridArea area="telefone">
                        <LabelInput for="telefone">telefone:</LabelInput>
                        <Input  type="text" id="sobrenome" name="telefone" value={telefone} required onChange={(e) => trocarTelefone(e.target.value)}/>
                    </GridArea>
                    <GridArea area="nascimento">
                        <LabelInput for="nascimento">Data de Nascimento:</LabelInput>
                        <Input type="date" id="nascimento" name="nascimento" value={nascimento}  required onChange={(e) => trocarNascimento(e.target.value)}/>
                    </GridArea>
                    <GridArea area="email">
                        <LabelInput for="email">Email:</LabelInput>
                        <Input type="email" id="email" name="email" value={email} required onChange={(e) => trocarEmail(e.target.value)}/>
                        <Input type="email" id="confirmarEmail" name="confirmarEmail" placeholder="Confirme o email" required/>
                    </GridArea>
                    <GridArea area="cpf">
                        <LabelInput for="cpf">CPF:</LabelInput>
                        <Input type="text" name="cpf" id="cpf" color="gray" value={cpf} readOnly/>
                    </GridArea>
                    <GridArea area="matricula">
                        <LabelInput for="matricula">Matrícula:</LabelInput>
                        <Input type="text" name="matricula" id="matricula" color="gray" value={matricula} readOnly/>
                    </GridArea>
                    <GridArea area="senhaAtual">
                        <LabelInput for="senhaAtual">Senha:</LabelInput>
                        <Input type="password" id="senha" name="senhaAtual" placeholder="Senha atual" required />
                    </GridArea>
                    <GridArea area="senhaNova">
                        <Input type="password" id="senha" name="senhaNova" placeholder="Senha nova" required/>
                    </GridArea>
                    <GridArea area="confirmarSenha">
                        <Input type="password" id="confirmarSenha" name="confirmarSenha" placeholder="Confirme sua Senha" required/>
                    </GridArea>
                    <GridArea area="botoes">
                        <Button type="submit">Salvar</Button>   
                    </GridArea>

                </FormGrid>
            </Box>
        </Container>
    )
}

export default AtualizarPerfil;