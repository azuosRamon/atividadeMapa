import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styled, { keyframes, css } from "styled-components";
import Button from "./SubButton";
import { BiCompass } from "react-icons/bi";
import "../App.css";

const Container = styled.div`
    position:absolute;
    width:100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
    top: 0;
    left: 0;
    display: flex;
`;
const Content = styled.div`
    display: block;
    background-color: gray;
    width: 200px;
    height: 200px;
    padding: 20px 100px;
    margin: auto;
`;

const Bussola = styled.span`
    font-size:20pt;

`
const P = styled.p`
  font-size: 2rem; 
  margin: 10px; 
  color: white;
`;


// ===== ANIMAÇÕES =====
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;
const scaleIn = keyframes`
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;
const scaleOut = keyframes`
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.9); opacity: 0; }
`;

// ===== ESTILOS =====
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.8);

  ${(props) =>
    props.$estado === "aberto" &&
    css`
      animation: ${fadeIn} 0.3s forwards;
    `}
  ${(props) =>
    props.$estado === "fechando" &&
    css`
      animation: ${fadeOut} 0.3s forwards;
    `}
`;

const ModalBox = styled.div`
  position: relative;
  background: #222;
  border-radius: 2px;
  padding: 30px;
  width: 90%;
  max-height: 90%;
  overflow: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
display: flex;
flex-direction: column;
align-items: center;
max-width: 300px;

  ${(props) =>
    props.$estado === "aberto" &&
    css`
      animation: ${scaleIn} 0.3s forwards;
    `}
  ${(props) =>
    props.$estado === "fechando" &&
    css`
      animation: ${scaleOut} 0.3s forwards;
    `}
`;

const ButtonVoltar = styled(Button)`
  height: 100%;
  margin: 20px 0;
  padding: 30px 0;
`;


// ===== COMPONENTE CONTROLADO =====
function BussolaCarregando({ aberto, onFechar, children }) {
  // fechar ao apertar ESC
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onFechar?.();
    if (aberto) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  const modalContent = (
    <Overlay $estado="aberto" onClick={onFechar}>
      <ModalBox $estado="aberto" onClick={(e) => e.stopPropagation()}>
        <BiCompass className="App-logo" />
        <P>{children}</P>
      </ModalBox>
    </Overlay>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

export default BussolaCarregando;
