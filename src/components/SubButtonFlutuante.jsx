// Importe o gerenciador de eventos
import { gerenciadorDeEventos } from '../utils/gerenciadorDeEventos'; // Ajuste o caminho se necessário
import React, { useState, useEffect } from 'react'; // Importe useEffect
import styled from 'styled-components';
import Label from './SubLabel';
import Input from './SubInput';
import Box from './SubBox';
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import cores from "./Cores"

// ... (Todos os seus styled-components H2, Button, ModalOverlay, etc... não mudam) ...
// (Vou omitir os styled-components para economizar espaço)
const H2 = styled.h2`
  color: ${(props) => props.$color || '#e2e2e2'};
`

const Button = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: ${cores.cor3};
  color: ${cores.corTexto};
  border: 2px solid ${cores.cor2};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;

  &:hover{
  transition: .7s;
  background-color:${(props) => props.$hovercolor || cores.cor1};
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
  color: ${(props) => props.color || cores.corTexto};
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
  background-color: ${cores.cor3};
  color: ${cores.corTexto};
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  
  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const CloseButton = styled.button`
  background-color: #ccc;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
`;

const Span = styled.span`
color: ${cores.corTexto};
display: inline-block;
transition: transform 0.3s ease;
transform: rotate(${props => (props.$ativo ? '90deg' : '0deg')});
margin-top: 5px;
font-size: 24px;
margin-left: auto;
`;


// --- INÍCIO DO COMPONENTE ---
const BotaoFlutuante = () => {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isHuman, setIsHuman] = useState(false);
  const [estaEnviando, setEstaEnviando] = useState(false); // NOVO: State de carregamento

  // Efeito para escutar as respostas do gerenciador
  useEffect(() => {
    // O que fazer quando o observer confirmar o sucesso
    const tratarSucesso = () => {
      setEstaEnviando(false);
      setOpen(false);
      // Limpa o formulário
      setNome('');
      setEmail('');
      setMensagem('');
      setIsHuman(false);
      // O ObserverEmail cuidará do Alerta/Modal de sucesso
    };

    // O que fazer quando o observer avisar de um erro
    const tratarErro = (erro) => {
      console.error("Erro reportado pelo observer:", erro);
      setEstaEnviando(false);
      alert("Falha ao enviar o feedback. Tente mais tarde.");
    };

    // Inscreve este componente nos eventos de resposta
    const desinscreverSucesso = gerenciadorDeEventos.inscrever("enviarFeedback_sucesso", tratarSucesso);
    const desinscreverErro = gerenciadorDeEventos.inscrever("enviarFeedback_erro", tratarErro);

    // Limpa as inscrições quando o componente for desmontado
    return () => {
      desinscreverSucesso();
      desinscreverErro();
    };
  }, []); // [] = Executa apenas uma vez quando o componente monta

  const handleSubmit = (e) => {
    e.preventDefault();
    setEstaEnviando(true);

    // A única coisa que o submit faz é disparar o evento
    gerenciadorDeEventos.disparar("enviarFeedback", {
      nome,
      email,
      mensagem
    });
    
    // O restante (fechar modal, limpar form) será feito pelo listener do useEffect
    // quando ele receber o evento "enviarFeedback_sucesso"
  };

  return (
    <>
      {/* Corrigi a prop $ativo para usar o state 'open' */}
      <Button onClick={() => setOpen(true)}><Span $ativo={open}><IoChatboxEllipsesOutline /></Span></Button>

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
                  disabled={estaEnviando} // Desabilita enquanto envia
                  required
                />

                <Label>Email:</Label>
                <Input
                  type="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={estaEnviando}
                  required
                />

                <Label>Mensagem:</Label>
                <TextArea
                  placeholder="Escreva seu feedback aqui..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  disabled={estaEnviando}
                  required
                />

                <CheckboxLabel>
                  <input
                    type = "checkbox"
                    checked = {isHuman}
                    onChange={()=> setIsHuman(!isHuman)}
                    disabled={estaEnviando}
                    required
                  />
                  Não sou um robô.
                </CheckboxLabel>

              <ButtonGroup>
                <SubmitButton type="submit" disabled={estaEnviando}>
                  {estaEnviando ? 'Enviando...' : 'Enviar'}
                </SubmitButton>
                <CloseButton type="button" onClick={() => setOpen(false)} disabled={estaEnviando}>
                  Cancelar
                </CloseButton>
              </ButtonGroup>
            </form>
          </Box>
        </ModalOverlay>
      )}
    </>
  );
};

export default BotaoFlutuante;