import React, { useState, useEffect} from "react";
import styled from "styled-components";
import { Link } from 'react-router-dom';
import Box from "../SubBox";
import Button from "../SubButton";
import Input from "../SubInput";
import Container from "../SubContainer";
import ParagrafoInformacao from "../SubParagrafo";
import SpamSublinhado from "../SubSpam";
import { useNavigate } from 'react-router-dom';
import cores from "../Cores"
import { supabase } from "/supabaseClient"

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



function Login({dados}){
    const dados_antigos = dados || {};
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(false)
    const navigate = useNavigate();
    
    const capturarUsuarioLogadoLocalStorage = () => {

        let usuario = localStorage.getItem("usuario");
        if (usuario) {
            return true;
        } return false;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) return alert("Erro ao fazer login: " + error.message);

        const user = data.user;
        if (!user) return alert("Usuário não encontrado.");

        // 🔹 Busca em ambas as tabelas
        const { data: empresa } = await supabase
            .from("empresas")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();

        const { data: usuario } = await supabase
            .from("sessao_usuario_view")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();

        // 🔹 Escolhe o tipo
        const dadosCompletos = empresa
            ? { tipo: "empresa", ...empresa }
            : { tipo: "usuario", ...usuario };

        if (!dadosCompletos) {
            alert("Usuário autenticado, mas sem dados cadastrados.");
            return;
        }

        // 🔹 Armazena localmente
        localStorage.setItem("usuario", JSON.stringify(dadosCompletos));

        console.log("Usuário logado:", dadosCompletos);

        navigate("/logado");
        };





    useEffect(() => {
        setStatus(capturarUsuarioLogadoLocalStorage())
    }, [])

    useEffect(() => {
        if (status) {
            handleLogin();
        }
    },[])

/*
    const efetuarLogin = (event) => {
        event.preventDefault(); // Evita recarregamento da página
        console.log(dados_antigos.pessoas); // mostra os usuarios
        let matriculaEncontrada = false
        dados_antigos.pessoas.map((usuarioCadastrado) => {
            console.log(usuarioCadastrado);
            if (Number(usuarioCadastrado.matricula) === Number(matricula))  {
                matriculaEncontrada = true;
                if (usuarioCadastrado.senha === senha) {
                    setarUsuarioLocalStorage(usuarioCadastrado);
                    navigate("/logado");
                }
                else{
                    alert("Senha incorreta!");

                }
            } 
        }) 
        if (!matriculaEncontrada){
            alert("Matrícula não cadastrada!");
        }
      };*/
    return(
        <Container>
            <Box>
                <Title>Faça Login</Title>
                <form onSubmit={handleLogin}>
                    <Input name="email" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required/>

                    <Input name="password"type="password" placeholder="Password" onChange={(e)=> setPassword(e.target.value)} required/>
                    <Button type="submit" disabled={loading}>{loading ? "Carregando..." : "Entrar"}</Button>
                </form>
                <StyledLink to="/RecuperarSenha">Esqueceu a senha? Clique aqui!</StyledLink>
                <ParagrafoInformacao>Ainda não tem uma conta?</ParagrafoInformacao>
                <ParagrafoInformacao>Envie um email para:<SpamSublinhado>email@mail.com.br</SpamSublinhado></ParagrafoInformacao>
            </Box>
        </Container>
    )
}


export default Login;