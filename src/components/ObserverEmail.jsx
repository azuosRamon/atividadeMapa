import React, {useEffect, useState} from "react";
import { gerenciadorDeEventos } from "../utils/gerenciadorDeEventos";
import Modal from "./SubModal";

export default function ObserverEmail() {
    const [mensagem, setMensagem] = useState(["blabla"]);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
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

        const desinscrever = gerenciadorDeEventos.inscrever("confirmarInscricao", enviarEmail);
        const desinscrever2 = gerenciadorDeEventos.inscrever("blabla", enviarEmail2);
        
        return () => {desinscrever(); desinscrever2();};
        
    },[]);


    return (
        <Modal aberto={isOpen} onFechar={() => setIsOpen(false)}>
            <div>
                <h2>Observer Email</h2>
                <ul>
                    {mensagem.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            </div>
        </Modal>
    )


}