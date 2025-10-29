import React, { useState } from "react";
import styled from "styled-components";
import Container from "../SubContainer";
import Box from "../SubBox";
import Input from "../SubInput";
import Button from "../SubButton";
import ParagrafoInformacao from "../SubParagrafo";
import SpamSublinhado from "../SubSpam"
import cores from "../Cores"
import { supabase } from "../../../supabaseClient";

const Title = styled.h2`
margin: 0 0 20px;
color: ${cores.corTexto};
`;

function Recuperar_senha(){
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(null); // null | 'enviando' | 'enviado' | 'erro'
    const [mensagemErro, setMensagemErro] = useState("");

    const enviarEmail = async (event) => {
        event.preventDefault();
        setMensagemErro("");
        if (!email || !email.includes("@")){
            setMensagemErro("Informe um e-mail válido.");
            return;
        }
        try{
            setStatus('enviando');
            // prefer explicit base URL from env (useful in production builds)
            const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
            const redirectTo = baseUrl.replace(/\/$/, '') + '/redefinir-senha';
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
            if (error) {
                setStatus('erro');
                setMensagemErro(error.message || 'Erro ao enviar email.');
                return;
            }
            setStatus('enviado');
        }catch(err){
            setStatus('erro');
            setMensagemErro(err.message || 'Erro inesperado.');
        }
    }
    React.useEffect(() => {
        if (status === 'enviado') {
            alert(`Link para recuperar senha enviado para ${email}`);
            setStatus(null);
        }
        if (status === 'erro' && mensagemErro) {
            alert(`Erro: ${mensagemErro}`);
            setStatus(null);
        }
    }, [status, mensagemErro, email, setStatus]);

    return(
        <Container>
            <Box>
                <Title>Recuperar senha</Title>
                <form onSubmit={enviarEmail}>
                    <Input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Seu e-mail" 
                        required/>
                    <Button type="submit" disabled={status === 'enviando'}>{status === 'enviando' ? 'Enviando...' : 'Recuperar'}</Button>
                </form>
                <ParagrafoInformacao>Ainda não tem uma conta?</ParagrafoInformacao>
                <ParagrafoInformacao>Envie um email para:<SpamSublinhado>email@mail.com.br</SpamSublinhado></ParagrafoInformacao>
            </Box>
        </Container>
    )
}


export default Recuperar_senha;