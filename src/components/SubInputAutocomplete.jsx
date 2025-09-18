// components/AutocompleteInput.jsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Input from "./SubInput";
import cores from "./Cores"
const InputBox = styled.div`
  position: relative;
  width: 100%;
`;

const ListaSugestoes = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${cores.backgroundBotaoSemFoco};
  color: ${cores.corTexto};
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  max-height: 150px;
  overflow-y: auto;


  &::-webkit-scrollbar {
    width: 10px;               /* width of the entire scrollbar */
}

&::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0);        /* color of the tracking area */
}
&::-webkit-scrollbar-thumb {
  background-color: ${cores.corWhite};    /* color of the scroll thumb */
  border-radius: 3px;       /* roundness of the scroll thumb */
  border: 2px solid ${cores.corWhite};  /* creates padding around scroll thumb */
}

`;



const ItemSugestao = styled.li`
  padding: 8px;
  cursor: pointer;
  background-color: ${(props) => (props.$selecionado ? cores.backgroundBotaoSemFoco : cores.backgroundBotaoSemFoco2)};

  &:hover {
    background-color: ${cores.backgroundBotaoSemFoco};
  }
`;

const InputAutocomplete = ({ sugestoes = [], valor, onChange, onSelecionar, placeholder = "" }) => {
  const [sugestoesFiltradas, setSugestoesFiltradas] = useState([]);
  const [indiceSelecionado, setIndiceSelecionado] = useState(-1);
  const wrapperRef = useRef(null);

useEffect(() => {
  if (valor.trim() === "") {
    setSugestoesFiltradas([]);
  } else {
    const filtradas = sugestoes.filter((item) =>
      item.toLowerCase().includes(valor.toLowerCase())
    );

    // Se o valor for igual a uma sugestão exata, esconda a lista
    if (filtradas.length === 1 && filtradas[0].toLowerCase() === valor.toLowerCase()) {
      setSugestoesFiltradas([]);
    } else {
      setSugestoesFiltradas(filtradas);
    }

    setIndiceSelecionado(-1);
  }
}, [valor, sugestoes]);


  useEffect(() => {
    const handleClickFora = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSugestoesFiltradas([]);
        setIndiceSelecionado(-1);
      }
    };

    document.addEventListener("mousedown", handleClickFora);
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndiceSelecionado((prev) =>
        (prev + 1) % sugestoesFiltradas.length
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndiceSelecionado((prev) =>
        (prev - 1 + sugestoesFiltradas.length) % sugestoesFiltradas.length
      );
    } else if (e.key === "Enter" && indiceSelecionado >= 0) {
      e.preventDefault();
      selecionarSugestao(sugestoesFiltradas[indiceSelecionado]);
    }
  };

const selecionarSugestao = (sugestao) => {
  onSelecionar(sugestao);         // Atualiza o estado do input no componente pai
  setSugestoesFiltradas([]);      // Esconde a lista
  setIndiceSelecionado(-1);       // Reseta o índice de navegação
};


  return (
    <InputBox ref={wrapperRef}>
      <Input
        type="text"
        placeholder={placeholder}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      { sugestoesFiltradas.length > 0 && (
        <ListaSugestoes>
            {sugestoesFiltradas.map((sugestao, index) => (
            <ItemSugestao
                key={index}
                $selecionado={index === indiceSelecionado}
                onClick={() => selecionarSugestao(sugestao)}
            >
                {sugestao}
            </ItemSugestao>
            ))}
        </ListaSugestoes>
        )}
    </InputBox>
  );
};

export default InputAutocomplete;
