import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import Container from "../SubContainer";
import Box from "../SubBox";
import Input from "../SubInput";
import Button from "../SubButton";
import ParagrafoInformacao from "../SubParagrafo";
import SpamSublinhado from "../SubSpam";
import cores from "../Cores";
import { supabase } from "../../../supabaseClient";

// Componente para o Título (manter o nome original para consistência com o arquivo original)
const Title = styled.h2`
margin: 0 0 20px;
color: ${cores.corTexto};
`;

// Estilização para o indicador de força da senha
const ForcaSenhaIndicador = styled.div`
    margin-bottom: 15px;
    font-size: 0.9em;
    color: ${props => props.$color};
    font-weight: bold;
`;

/**
 * Função para verificar a força da senha.
 * @param {string} senha - A senha a ser verificada.
 * @returns {{text: string, color: string}} - Objeto com o texto e a cor indicativa.
 */
const verificarForcaSenha = (senha) => {
    if (senha.length < 6) return { text: "Mínimo 6 caracteres", color: cores.corTexto }; // Cor padrão

    let pontuacao = 0;
    if (senha.length >= 8) pontuacao++;
    if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) pontuacao++; // Letras maiúsculas e minúsculas
    if (/\d/.test(senha)) pontuacao++; // Números
    if (/[^a-zA-Z0-9]/.test(senha)) pontuacao++; // Caracteres especiais

    if (pontuacao < 2) return { text: "Fraca", color: '#FF4D4D' }; // Vermelho
    if (pontuacao < 4) return { text: "Média", color: '#FFB84D' }; // Laranja
    return { text: "Forte", color: '#4CAF50' }; // Verde
}

function PaginaRedefinirSenha(){
    // Estados
    const [senha, setSenha] = useState("");
    const [confirmacao, setConfirmacao] = useState("");
    const [status, setStatus] = useState(null); // null | 'loading' | 'ready' | 'sent' | 'error'
    const [mensagemErro, setMensagemErro] = useState("");
    const navegar = useNavigate(); // Hook renomeado para "navegar"

    // Calcula a força da senha a cada mudança
    const forca = useMemo(() => verificarForcaSenha(senha), [senha]);

    // Efeito para validar o token da URL
    useEffect(() => {
        const tentarConfigurarSessaoDaUrl = async () => {
            setStatus('loading');

            // O Supabase costuma enviar os tokens no hash (ex: #access_token=...)
            const parametrosBusca = new URLSearchParams(window.location.search);
            const hash = window.location.hash ? window.location.hash.replace('#', '?') : '';
            const parametrosHash = new URLSearchParams(hash);

            // Extração de tokens (mantendo nomes originais por serem parte da API Supabase)
            const access_token = parametrosBusca.get('access_token') || parametrosHash.get('access_token') || parametrosBusca.get('token') || parametrosHash.get('token');
            const refresh_token = parametrosBusca.get('refresh_token') || parametrosHash.get('refresh_token');

            // Verificação de erro na URL
            const erroDaUrl = parametrosBusca.get('error') || parametrosHash.get('error');
            const descricaoErro = parametrosBusca.get('error_description') || parametrosHash.get('error_description');
            if (erroDaUrl) {
                setMensagemErro(decodeURIComponent(descricaoErro || erroDaUrl));
                setStatus('error');
                return;
            }

            if (!access_token) {
                // Sem token: Mensagem de erro para o usuário
                setMensagemErro("Link de recuperação inválido ou expirado. Tente novamente a recuperação de senha.");
                setStatus('error');
                return;
            }

            try{
                // Seta a sessão no cliente (necessário para chamar updateUser em seguida)
                const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
                if (error) {
                    setMensagemErro(error.message || 'Erro ao validar token.');
                    setStatus('error');
                    return;
                }

                // Limpa tokens da URL
                try {
                    const caminhoLimpo = window.location.pathname;
                    window.history.replaceState({}, document.title, caminhoLimpo);
                } catch (e) {
                    console.warn('Não foi possível limpar tokens da URL', e);
                }

                // Agora o usuário pode informar a nova senha
                setStatus('ready');
            }catch(err){
                setMensagemErro(err.message || 'Erro inesperado.');
                setStatus('error');
            }
        }
        tentarConfigurarSessaoDaUrl();
    }, []);

    /**
     * Envia a nova senha para o Supabase
     * @param {Event} e - Evento de submissão do formulário.
     */
    const enviarNovaSenha = async (e) => {
        e.preventDefault();
        setMensagemErro("");
        
        if (forca.text === "Mínimo 6 caracteres" || forca.text === "Fraca"){
            setMensagemErro('A senha é muito fraca ou não atende aos requisitos mínimos.');
            return;
        }
        if (senha !== confirmacao){
            setMensagemErro('As senhas não coincidem.');
            return;
        }
        setStatus('loading');
        try{
            // O cliente supabase está autenticado, então updateUser funciona
            const { data, error } = await supabase.auth.updateUser({ password: senha }); // Usamos 'password' pois é a propriedade da API
            if (error){
                setMensagemErro(error.message || 'Erro ao atualizar senha.');
                setStatus('error');
                return;
            }
            setStatus('sent');
        }catch(err){
            setMensagemErro(err.message || 'Erro inesperado.');
            setStatus('error');
        }
    }

    return (
        <Container>
            <Box>
                <Title>Redefinir senha</Title>

                {status === null && (
                    <ParagrafoInformacao>Aguardando a validação do link de recuperação. Certifique-se de ter chegado a esta página através do link enviado ao seu e‑mail.</ParagrafoInformacao>
                )}

                {status === 'loading' && <ParagrafoInformacao>Validando token...</ParagrafoInformacao>}

                {status === 'ready' && (
                    <form onSubmit={enviarNovaSenha}>
                        <Input 
                            type="password" 
                            value={senha} 
                            onChange={(e) => setSenha(e.target.value)} 
                            placeholder="Nova senha" 
                            required 
                            minLength={6} 
                        />
                        <ForcaSenhaIndicador $color={forca.color}>
                            {forca.text}
                        </ForcaSenhaIndicador>
                        <Input 
                            type="password" 
                            value={confirmacao} 
                            onChange={(e) => setConfirmacao(e.target.value)} 
                            placeholder="Confirme a nova senha" 
                            required 
                        />
                        <Button type="submit" disabled={status === 'loading'}>Atualizar senha</Button>
                    </form>
                )}

                {status === 'sent' && (
                    <>
                        <ParagrafoInformacao>Senha atualizada com sucesso.</ParagrafoInformacao>
                        <Button onClick={() => navegar('/login')}>Ir para Login</Button>
                    </>
                )}
                
                {status === 'error' && (
                    <>
                        <ParagrafoInformacao style={{color: 'red'}}>{mensagemErro}</ParagrafoInformacao>
                        <Button onClick={() => navegar('/RecuperarSenha')}>Tentar Recuperar Senha Novamente</Button>
                    </>
                )}
            </Box>
        </Container>
    )
}

export default PaginaRedefinirSenha;