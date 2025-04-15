import React, { useState } from 'react';
import styled from 'styled-components';
import Label from './SubLabel';
import Input from './SubInput';
import Box from './SubBox';
import { IoChatboxEllipsesOutline } from "react-icons/io5";


const H2 = styled.h2`
  color: ${(props) => props.$color || '#e2e2e2'};
`

const Button = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;

  &:hover{
  transition: .7s;
  background-color:${(props) => props.$hovercolor || '#0056b3'};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(200, 200, 200, 0.4); 
  backdrop-filter: blur(4px); 
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-top: 4px;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;
  height: 100px;
  box-sizing: border-box;
  font-size: 14px;
`;

const CheckboxLabel = styled.label`
  font-style: italic;
  font-size:10pt;
  color: ${(props) => props.$color || '#e2e2e2'};
  display: flex;
  align-items: center;
  gap:8px;
  margin-top:5px;
`;


const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
`;

const CloseButton = styled.button`
  background-color: #ccc;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
`;

const Span = styled.span`
color: white;
display: inline-block;
transition: transform 0.3s ease;
transform: rotate(${props => (props.$ativo ? '90deg' : '0deg')});
margin-top: 5px;
font-size: 24px;
`;


const BotaoFlutuante = () => {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isHuman, setIsHuman] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback enviado:", { nome, email, mensagem });

    alert("Feedback enviado com sucesso!");
    setOpen(false);
    setNome('');
    setEmail('');
    setMensagem('');
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}><Span><IoChatboxEllipsesOutline /></Span></Button>

      {open && (
        <ModalOverlay onClick={() => setOpen(false)}>
          <Box onClick={(e) => e.stopPropagation()}>
            <H2>Envie seu feedback</H2>
            <form onSubmit={handleSubmit}>
                <Label>Nome:</Label>
                <Input
                  type="text"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />

                <Label>Email:</Label>
                <Input
                  type="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Label>Mensagem:</Label>
                <TextArea
                  placeholder="Escreva seu feedback aqui..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  required
                />

                <CheckboxLabel>
                  <input
                    type = "checkbox"
                    checked = {isHuman}
                    onChange={()=> setIsHuman(!isHuman)}
                    required
                  />
                  Não sou um robô.
                </CheckboxLabel>

              <ButtonGroup>
                <SubmitButton type="submit">Enviar</SubmitButton>
                <CloseButton type="button" onClick={() => setOpen(false)}>Cancelar</CloseButton>
              </ButtonGroup>
            </form>
          </Box>
        </ModalOverlay>
      )}
    </>
  );
};

export default BotaoFlutuante;
