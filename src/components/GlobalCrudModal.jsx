import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "./SubModal";
import Button from "./SubButton";
import cores from "./Cores";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px 0;
`;

const Title = styled.h2`
  color: ${cores.corWhite};
  margin-bottom: 20px;
  font-weight: 500;
`;

const Message = styled.p`
  color: ${cores.corTexto};
  margin-bottom: 30px;
  font-size: 1.1rem;
`;

export default function GlobalCrudModal() {
  const [aberto, setAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const handleAlert = (e) => {
      setMensagem(e.detail?.message || "Ocorreu uma operação no sistema.");
      setAberto(true);
    };

    window.addEventListener("crud-alert", handleAlert);
    return () => window.removeEventListener("crud-alert", handleAlert);
  }, []);

  return (
    <Modal aberto={aberto} onFechar={() => setAberto(false)}>
      <Container>
        <Title>Aviso do Sistema</Title>
        <Message>{mensagem}</Message>
        <Button onClick={() => setAberto(false)} style={{ width: "120px" }}>OK</Button>
      </Container>
    </Modal>
  );
}
