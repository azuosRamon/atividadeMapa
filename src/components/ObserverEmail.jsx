import React, {useEffect, useState} from "react";
// Verifique se este caminho está correto para você
import { gerenciadorDeEventos } from "../utils/gerenciadorDeEventos"; 
import Modal from "./SubModal";
import emailjs from '@emailjs/browser';
import styled from "styled-components";
import cores from "./Cores";

// (Todos os seus styled-components aqui... não mudam)
const TituloNotificacao = styled.h2`
  color: ${cores.corTexto};
  border-bottom: 1px solid ${cores.cor5};
  padding-bottom: 10px;
  margin-bottom: 15px;
`;

const ListaMensagens = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  color: ${cores.corTextoClaro};
`;

const ItemMensagem = styled.li`
  background-color: ${cores.backgroundBotaoSemFoco2};
  padding: 12px;
  border-radius: 3px;
  margin-bottom: 8px;
  font-size: 14px;
`;
// --- Fim dos styled-components ---


export default function ObserverEmail() {
    const [mensagem, setMensagem] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // Suas chaves do EmailJS
    const SERVICE_ID = 'service_nxjz2tg';
    const PUBLIC_KEY = 'rbCHkaRc0eGNQlXEw';

    useEffect(() => {
        
        // --- Lógica de envio de E-mail de Feedback (Botão Flutuante) ---
        const tratarEnvioFeedback = (dados) => {
            setMensagem([`Enviando feedback de ${dados.nome}...`]);
            setIsOpen(true);

            const parametrosTemplate = {
                from_name: dados.nome,
                reply_to: dados.email,
                message: dados.mensagem,
            };
    
            emailjs.send(
                SERVICE_ID,
                'template_rpa88fg',    // ID do Template do Feedback
                parametrosTemplate,
                PUBLIC_KEY
            )
            .then((response) => {
                console.log("SUCESSO Feedback!", response.status, response.text);
                setMensagem([`Feedback de ${dados.nome} enviado com sucesso!`]);
                setIsOpen(true);
                setTimeout(() => setIsOpen(false), 3000); 
                gerenciadorDeEventos.disparar("enviarFeedback_sucesso");
            })
            .catch((err) => {
                console.error("ERRO AO ENVIAR Feedback:", err);
                setMensagem([`Falha ao enviar o feedback de ${dados.nome}.`]);
                setIsOpen(true);
                setTimeout(() => setIsOpen(false), 3000);
                gerenciadorDeEventos.disparar("enviarFeedback_erro", err);
            });
        };

        // --- LÓGICA DE CADASTRO (Envia para o e-mail padrão do EmailJS) ---
        const tratarNovoUsuario = (dados) => {
            const { novoUsuario, adminUsuario } = dados;

            setMensagem([`Enviando notificação de ${novoUsuario.nome} para a empresa...`]);
            setIsOpen(true);

            const TEMPLATE_ID_NOTIFICACAO = 'template_u2vxrdo'; 

            // Prepara os dados para o template
            const paramsAdmin = {
                // Para o campo "Reply-To" (quem o admin responde)
                reply_to: novoUsuario.email,
                
                //
                // *** [ALTERAÇÃO APLICADA] ***
                // A linha "to_email" foi removida.
                //
                
                // Variáveis que você usou no seu HTML
                admin_name: adminUsuario.nome || 'Administrador',
                new_user_name: novoUsuario.nome,
                new_user_email: novoUsuario.email,
                new_user_funcao: novoUsuario.funcao_id || 'Não definida', // Usei funcao_id com base no SQL
                user_password: novoUsuario.cpf, // Lembrete de segurança
            };

            // Envia o e-mail
            emailjs.send(SERVICE_ID, TEMPLATE_ID_NOTIFICACAO, paramsAdmin, PUBLIC_KEY)
                .then((response) => {
                    console.log("E-mail de notificação SUCESSO!", response.status, response.text);
                    setMensagem([
                        `Usuário ${novoUsuario.nome} cadastrado!`,
                        `Notificação enviada para a empresa.`
                    ]);
                    setIsOpen(true);
                    setTimeout(() => setIsOpen(false), 4000); 
                })
                .catch((err) => {
                    console.error("ERRO AO ENVIAR E-MAIL DE NOTIFICAÇÃO:", err);
                    setMensagem([
                        `Usuário ${novoUsuario.nome} cadastrado, MAS...`,
                        `Houve uma falha ao enviar a notificação para a empresa.`,
                        `Erro: ${err.text || err.message}`
                    ]);
                    setIsOpen(true);
                    setTimeout(() => setIsOpen(false), 5000);
                });
        };

        // --- Inscrições ---
        const desinscreverFeedback = gerenciadorDeEventos.inscrever("enviarFeedback", tratarEnvioFeedback);
        const desinscreverNovoUsuario = gerenciadorDeEventos.inscrever("novoUsuarioCadastrado", tratarNovoUsuario);
        
        // (Removi os eventos "blabla" e "confirmarInscricao" que pareciam ser testes)

        return () => {
            desinscreverFeedback(); 
            desinscreverNovoUsuario();
        };
        
    },[]); // [] = Roda apenas uma vez


    return (
        <Modal aberto={isOpen} onFechar={() => setIsOpen(false)}>
            <div>
                <TituloNotificacao>Notificações do Sistema</TituloNotificacao>
                <ListaMensagens>
                    {mensagem.map((msg, index) => (
                        <ItemMensagem key={index}>{msg}</ItemMensagem>
                    ))}
                </ListaMensagens>
            </div>
        </Modal>
    )
}