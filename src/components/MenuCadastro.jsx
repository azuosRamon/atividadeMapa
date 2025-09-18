import React, {useState, useEffect} from "react";
import styled from "styled-components";
import Box from "./SubBox";
import Input from "./SubInput";
import Select from "./SubSelect";
import Button from "./SubButton";
import DivSeparador from "./SubDivSeparador";
import cores from "./Cores"
import useBancoDeDados from "./UseBancoDados";

const Title = styled.h2`
margin: 0 0 20px;
color: ${cores.corTexto};
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
function Cadastro({usuarioLogado}){
    
     const [objeto, setObjeto] = useState({
        usuario_id: "",
        nome: "",
        sobrenome: "",
        nascimento: "1999-01-01",
        cpf: "",
        matricula: "",
        email: "",
        telefone: "",
        senha: "",
        foto:"",
        informacoes_publicas: 1,
        empresa_id: usuarioLogado.empresa_id,
        funcao_id: "",
        cargo_id: "",
    });

    useEffect((prev) => {
        setObjeto({
            ...prev,
            senha: objeto.cpf
        })
    },[objeto.cpf])

    const [operacao, setOperacao] = useState("1");

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
        <Container>
            <Box>
                <Title>Novo Usuário</Title>
                <DivSeparador></DivSeparador>
                <form onSubmit={fazerEnvio}>
                    <Input type="text" placeholder="Nome" onChange={(e)=>{alterarObjeto(e, 'nome')}} required/>
                    <Input type="text" placeholder="Sobrenome" onChange={(e)=>{alterarObjeto(e, 'sobrenome')}} required/>
                    <Input type="email" placeholder="Email" onChange={(e)=>{alterarObjeto(e, 'email')}} required/>
                    <Input type="text" placeholder="CPF" onChange={(e)=>{alterarObjeto(e, 'cpf')}} required/>
                    <Input type="text" placeholder="Matricula" onChange={(e)=>{alterarObjeto(e, 'matricula')}} required/>
                    <Input type="text" placeholder="Funcao" onChange={(e)=>{alterarObjeto(e, 'funcao_id')}} required/>
                    <Input type="text" placeholder="Cargo" onChange={(e)=>{alterarObjeto(e, 'cargo_id')}} required/>
                    {/*<Select>
                        <option value="">Cargo ou Funcao</option>
                        <option value="">Coordenador(a)</option>
                        <option value="">Professor(a)</option>
                        <option value="">Secretário(a)</option>
                    </Select>*/}
                    <Button type="submit">Cadastrar</Button>
                </form>
            </Box>
        </Container>
    )
}

export default Cadastro;