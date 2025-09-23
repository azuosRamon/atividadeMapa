import React, { useState } from "react";
import styled from "styled-components";
import Modal from "./SubModal";
import Button from "./SubButton";
import { FcCallback } from "react-icons/fc";
const ButtonVoltar = styled(Button)`
  height: 100%;
  margin-top: 0;
`;


function AbrirModalSubmit({BdCallBack, operacao = "Adicao"}){
    const [mostrarModal, setMostrarModal] = useState(true);
    return(
      <Modal aberto={mostrarModal} onFechar={() => setMostrarModal(false)}>
        <h1>Deseja concluir a operação de ${operacao}?</h1>
        <ButtonVoltar $bgcolor="rgb(38, 38, 38)" onClick={() => setMostrarModal(false)}>
            Voltar
        </ButtonVoltar>
        <Button 
            $bgcolor="rgb(38, 38, 38)" 
            onClick={() => {
                BdCallback?.(); // chama o callback se existir
                setMostrarModal(false);
            }}
            >
            Confirmar
            </Button>

    </Modal>
    )
}

export default AbrirModalSubmit;