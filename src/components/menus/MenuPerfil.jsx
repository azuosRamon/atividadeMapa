import React, { useState} from "react";
import styled from "styled-components";
import Box from "../SubBox";
import Input from "../SubInput";
import Label from "../SubLabel";
import Button from "../SubButton";
import Title from "../SubTitleH2";
import GridArea from "../SubGridArea";
import DivSeparador from "../SubDivSeparador";
import useBancoDeDados from "../BdSupabase";

const FormGrid = styled.form`
gap: 10px;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
    "nome sobrenome telefone"
    "nascimento cpf matricula"
    "email email email"
    "senhaAtual . ."
    "senhaAtual senhaNova confirmarSenha"
    "foto foto foto"
    "empresa empresa empresa"
    "funcao cargo exibirContatos"
    "botoes botoes botoes";

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
        "foto"
        "exibirContatos"
        "empresa"
        "funcao"
        "cargo"
        "botoes"
}
`;



function AtualizarPerfil() {
    const capturarUsuarioLogadoLocalStorage = () => {
            let usuario = localStorage.getItem("usuario");
            if (!usuario) return null;
            try {
                let parsedUsuario = JSON.parse(usuario);
                return parsedUsuario
            } catch (error){
                console.log(error);
                return null;
            }
        }


    const [objeto, setObjeto] = useState(capturarUsuarioLogadoLocalStorage());

    const [operacao, setOperacao] = useState("2");

    const {
        data,
        pesquisa,
        loading,
        fazerEnvio,
        alterarObjeto
    } = useBancoDeDados({
        nomeTabela: "usuarios",
        objeto,
        setObjeto,
        operacao,
        campoId: "usuario_id",
        campoNome: "nome"
    });

    
    return(
            <Box>
                <Title>Atualizar Perfil</Title>
                <DivSeparador></DivSeparador>
                <FormGrid onSubmit={fazerEnvio}>
                    <Input type="hidden" id="usuarioId" name="usuarioId" value={objeto.usuario_id}/>
                    <GridArea $area="nome">
                        <Label htmlFor="nome">Nome:</Label>
                        <Input type="text" id="nome" name="nome" value={objeto.nome} required onChange={(e) => alterarObjeto(e, 'nome')}/>
                    </GridArea>
                    <GridArea $area="sobrenome">
                        <Label htmlFor="sobrenome">Sobrenome:</Label>
                        <Input  type="text" id="sobrenome" name="sobrenome" value={objeto.sobrenome} required onChange={(e) => alterarObjeto(e, 'sobrenome') }/>
                    </GridArea>
                    <GridArea $area="telefone">
                        <Label htmlFor="telefone">telefone:</Label>
                        <Input  type="tel" id="telefone" name="telefone" value={objeto.telefone} required onChange={(e) => alterarObjeto(e, 'telefone')}/>
                    </GridArea>
                    <GridArea $area="nascimento">
                        <Label htmlFor="nascimento">Data de Nascimento:</Label>
                        <Input type="date" id="nascimento" name="nascimento" value={objeto.nascimento}  required onChange={(e) => alterarObjeto(e, 'nascimento')}/>
                    </GridArea>
                    <GridArea $area="email">
                        <Label htmlFor="email">Email:</Label>
                        <Input type="email" id="email" name="email" value={objeto.email} required onChange={(e) => alterarObjeto(e, 'email')}/>
                        <Input type="email" id="confirmarEmail" name="confirmarEmail" placeholder="Confirme o email"/>
                    </GridArea>
                    <GridArea $area="cpf">
                        <Label htmlFor="cpf">CPF:</Label>
                        <Input type="text" name="cpf" id="cpf" $color="gray" value={objeto.cpf} readOnly/>
                    </GridArea>
                    <GridArea $area="matricula">
                        <Label htmlFor="matricula">Matrícula:</Label>
                        <Input type="text" name="matricula" id="matricula" $color="gray" value={objeto.matricula} readOnly/>
                    </GridArea>
                    <GridArea $area="senhaAtual">
                        <Label htmlFor="senhaAtual">Senha:</Label>
                        <Input type="password" id="senhaAtual" name="senhaAtual" placeholder="Senha atual" required />
                    </GridArea>
                    <GridArea $area="senhaNova">
                        <Input type="password" id="senhaNova" name="senhaNova" placeholder="Senha nova" onChange={(e) => alterarObjeto(e, 'senha')}/>
                    </GridArea>
                    <GridArea $area="confirmarSenha">
                        <Input type="password" id="confirmarSenha" name="confirmarSenha" placeholder="Confirme sua Senha"/>
                    </GridArea>
                    <GridArea $area="foto">
                        <Label htmlFor="foto">Foto:</Label>
                        <Input type="file" id="foto" name="foto"/>
                    </GridArea>
                    <GridArea $area="exibirContatos">
                        <Label htmlFor="exibirContatos">Exibir Contatos:</Label>
                        <Input type="checkbox" value={objeto.informacoes_publicas} id="exibirContatos" name="exibirContatos"/>
                    </GridArea>
                    <GridArea $area="empresa">
                        <Label htmlFor="empresa">Sua Empresa:</Label>
                        <Input type="text" value={objeto.empresa_id} readOnly id="empresa" name="empresa"/>
                    </GridArea>
                    <GridArea $area="funcao">
                        <Label htmlFor="funcao">Sua Função:</Label>
                        <Input type="text" value={objeto.funcao} readOnly id="funcao" name="funcao"/>
                    </GridArea>
                    <GridArea $area="cargo">
                        <Label htmlFor="cargo">Seu Cargo:</Label>
                        <Input type="text" value={objeto.cargo} readOnly id="cargo" name="cargo"/>
                    </GridArea>
                    <GridArea $area="botoes">
                        <Button type="submit">Salvar</Button>   
                    </GridArea>

                </FormGrid>
            </Box>
    )
}

export default AtualizarPerfil;