import React, {useEffect, useState} from "react";
import { gerenciadorDeEventos } from "../utils/gerenciadorDeEventos";
import Modal from "./SubModal";
import emailjs from '@emailjs/browser';
import styled from "styled-components";
import cores from "./Cores";

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
export default function ObserverEmail() {
    const [mensagem, setMensagem] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // --- Lógica de envio de E-mail de Feedback ---
        const tratarEnvioFeedback = (dados) => {
            // 'dados' é o objeto { nome, email, mensagem }
            
            // Mostra o modal com status "Enviando"
            setMensagem([`Enviando feedback de ${dados.nome}...`]);
            setIsOpen(true);

            // Objeto com os parâmetros para o template EmailJS
            const parametrosTemplate = {
                from_name: dados.nome,
                reply_to: dados.email,
                message: dados.mensagem,
            };
    
            // Lógica do EmailJS movida para cá
            emailjs.send(
                'service_nxjz2tg',     // 1. Cole seu Service ID
                'template_rpa88fg',    // 2. Cole seu Template ID
                parametrosTemplate,   // 3. O objeto com os dados
                'rbCHkaRc0eGNQlXEw'      // 4. Cole sua Public Key
            )
            .then((response) => {
                console.log("SUCESSO!", response.status, response.text);
                
                setMensagem([`Feedback de ${dados.nome} enviado com sucesso!`]);
                setIsOpen(true);
                setTimeout(() => setIsOpen(false), 3000); 
                

                gerenciadorDeEventos.disparar("enviarFeedback_sucesso");

            })
            .catch((err) => {
                console.error("ERRO AO ENVIAR:", err);

                setMensagem([`Falha ao enviar o feedback de ${dados.nome}.`]);
                setIsOpen(true);
                setTimeout(() => setIsOpen(false), 3000);

                gerenciadorDeEventos.disparar("enviarFeedback_erro", err);
            });
        };

        // --- Suas lógicas de e-mail anteriores (mantidas) ---
        const enviarEmail = (dados) =>{
            setMensagem((mensagemAnterior) => [...mensagemAnterior, `Email enviado para ${dados} !!!`]);
            setIsOpen(true);
            setTimeout(() => {
                setIsOpen(false);
            }, 3000);
        };
        const enviarEmail2 = (dados) =>{
            setMensagem((mensagemAnterior) => [...mensagemAnterior, `O pavimento ${dados.numero} foi criado com sucesso !!!`]);
            setIsOpen(true);
            setTimeout(() => {
                setIsOpen(false);
            }, 3000);
        };

        // --- Inscrições ---
        const desinscrever = gerenciadorDeEventos.inscrever("confirmarInscricao", enviarEmail);
        const desinscrever2 = gerenciadorDeEventos.inscrever("blabla", enviarEmail2);
        // Inscreve o handler de feedback
        const desinscreverFeedback = gerenciadorDeEventos.inscrever("enviarFeedback", tratarEnvioFeedback);
        
        return () => {
            desinscrever();
            desinscrever2();
            desinscreverFeedback(); // Limpa a inscrição
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