import React, { useState} from "react";
import styled from "styled-components";
import Box from "./SubBox";
import Input from "./SubInput";
import Label from "./SubLabel";
import Button from "./SubButton";
import Title from "./SubTitleH2";
import GridArea from "./SubGridArea";


const FormGrid = styled.form`
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "nome sobrenome telefone"
    "nascimento cpf matricula"
    "email email email"
    "senhaAtual . ."
    "senhaAtual senhaNova confirmarSenha"
    ". . botoes";

@media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: 
        "nome"
        "sobrenome"
        "telefone"
        "nascimento"
        "cpf"
        "matricula"
        "email"
        "senhaAtual"
        "senhaAtual"
        "senhaNova"
        "confirmarSenha"
        "botoes"
}
`;

const data = [
    { nome: "Carlos", sobrenome: "Silva", telefone: "21 99999-9999",nascimento:"2025-03-24", email:"carlossilva@mail.com", cpf: "111.222.333-44", matricula:"202411122", funcao: "Administrador", foto: "" },
    { nome: "Ana", funcao: "Secretaria", foto: "" },
    { nome: "Maria", funcao: "Professor", foto: "" },
]; 



function AtualizarPerfil({id}) {
    const usuarioDados = data[id] || {};

    const [nome, trocarNome] = useState(usuarioDados.nome) || "";
    const [sobrenome, trocarSobrenome] = useState(usuarioDados.sobrenome) || "";
    const [telefone, trocarTelefone] = useState(usuarioDados.telefone || "")
    const [nascimento, trocarNascimento] = useState(usuarioDados.nascimento || "")
    const [email, trocarEmail] = useState(usuarioDados.email || "")
    const cpf = usuarioDados.cpf || "";
    const matricula = usuarioDados.matricula || "";
    
    return(
            <Box>
                <Title>Atualizar Perfil</Title>
                <FormGrid>
                    <GridArea $area="nome">
                        <Label htmlFor="nome">Nome:</Label>
                        <Input type="text" id="nome" name="nome" value={nome} required onChange={(e) => trocarNome(e.target.value)}/>
                    </GridArea>
                    <GridArea $area="sobrenome">
                        <Label htmlFor="sobrenome">Sobrenome:</Label>
                        <Input  type="text" id="sobrenome" name="sobrenome" value={sobrenome} required onChange={(e) => trocarSobrenome(e.target.value)} />
                    </GridArea>
                    <GridArea $area="telefone">
                        <Label htmlFor="telefone">telefone:</Label>
                        <Input  type="text" id="telefone" name="telefone" value={telefone} required onChange={(e) => trocarTelefone(e.target.value)}/>
                    </GridArea>
                    <GridArea $area="nascimento">
                        <Label htmlFor="nascimento">Data de Nascimento:</Label>
                        <Input type="date" id="nascimento" name="nascimento" value={nascimento}  required onChange={(e) => trocarNascimento(e.target.value)}/>
                    </GridArea>
                    <GridArea $area="email">
                        <Label htmlFor="email">Email:</Label>
                        <Input type="email" id="email" name="email" value={email} required onChange={(e) => trocarEmail(e.target.value)}/>
                        <Input type="email" id="confirmarEmail" name="confirmarEmail" placeholder="Confirme o email" required/>
                    </GridArea>
                    <GridArea $area="cpf">
                        <Label htmlFor="cpf">CPF:</Label>
                        <Input type="text" name="cpf" id="cpf" $color="gray" value={cpf} readOnly/>
                    </GridArea>
                    <GridArea $area="matricula">
                        <Label htmlFor="matricula">Matrícula:</Label>
                        <Input type="text" name="matricula" id="matricula" $color="gray" value={matricula} readOnly/>
                    </GridArea>
                    <GridArea $area="senhaAtual">
                        <Label htmlFor="senhaAtual">Senha:</Label>
                        <Input type="password" id="senhaAtual" name="senhaAtual" placeholder="Senha atual" required />
                    </GridArea>
                    <GridArea $area="senhaNova">
                        <Input type="password" id="senhaNova" name="senhaNova" placeholder="Senha nova" required/>
                    </GridArea>
                    <GridArea $area="confirmarSenha">
                        <Input type="password" id="confirmarSenha" name="confirmarSenha" placeholder="Confirme sua Senha" required/>
                    </GridArea>
                    <GridArea $area="botoes">
                        <Button type="submit">Salvar</Button>   
                    </GridArea>

                </FormGrid>
            </Box>
    )
}

export default AtualizarPerfil;