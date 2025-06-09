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
function Cadastro(){
    
     const [objeto, setObjeto] = useState({
        usuario_id: "",
        nome: "",
        sobrenome: "",
        nascimento: "",
        cpf: "",
        matricula: "",
        email: "",
        telefone: "",
        senha: "",
        foto:"",
        empresa_id: "",
        informacoes_publicas: ""
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