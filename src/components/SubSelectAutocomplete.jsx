import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Input from "./SubInput";
import cores from "./Cores";

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
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0px 4px 6px rgba(0,0,0,0.3);
`;
const ItemSugestao = styled.li`
  padding: 10px;
  cursor: ${(props) => props.$disabled ? "not-allowed" : "pointer"};
  opacity: ${(props) => props.$disabled ? 0.6 : 1};
  border-bottom: 1px solid rgba(255,255,255,0.05);
  background-color: ${(props) => props.$customBg || (props.$selecionado ? cores.backgroundBotaoSemFoco : cores.backgroundBotaoSemFoco2)};
  color: ${(props) => props.$customColor || "inherit"};
  border-left: ${(props) => props.$selecionado ? "5px solid #fff" : "5px solid transparent"};
  filter: ${(props) => props.$selecionado ? "brightness(2)" : "none"};
  transition: all 0.2s ease;
  &:hover {
    background-color: ${(props) => props.$disabled ? (props.$customBg || cores.backgroundBotaoSemFoco2) : (props.$customBgHover || cores.backgroundBotaoSemFoco)};
    filter: brightness(1.1);
  }
  &:last-child {
      border-bottom: none;
  }
`;

export default function SubSelectAutocomplete({ dados, itemValue, campoDesejado, listaColunas, value, onChange, getTexto, getBackgroundColor, getDisabled }) {
  const [busca, setBusca] = useState("");
  const [foco, setFoco] = useState(false);
  const [indiceSelecionado, setIndiceSelecionado] = useState(-1);
  const wrapperRef = useRef(null);
  const listaRef = useRef(null);

  useEffect(() => {
     if (indiceSelecionado >= 0 && listaRef.current) {
         const item = listaRef.current.children[indiceSelecionado];
         if (item) {
             item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
         }
     }
  }, [indiceSelecionado]);

  const obterTexto = (item) => getTexto ? getTexto(item) : campoDesejado.map(i => item[i]).join(" - ");

  useEffect(() => {
     if (value && String(value) !== "0" && dados.length > 0) {
        const achado = dados.find(c => String(c[itemValue]) === String(value));
        if (achado) {
             setBusca(obterTexto(achado));
        }
     } else {
        setBusca("");
     }
  }, [value, dados, itemValue, campoDesejado, getTexto]);

  useEffect(() => {
    const handleClickFora = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setFoco(false);
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const dadosFiltrados = dados.filter(c => {
      if(!busca) return true;
      const texto = obterTexto(c);
      return texto.toLowerCase().includes(busca.toLowerCase());
  });

  const onSelecionar = (item) => {
      const texto = obterTexto(item);
      setBusca(texto);
      setFoco(false);
      onChange({ target: { value: item[itemValue], name: listaColunas[0] } }, listaColunas[0]);
  }

  const handleManualChange = (e) => {
      setBusca(e.target.value);
      setFoco(true);
      setIndiceSelecionado(-1);
      if (e.target.value === "") {
          onChange({ target: { value: "0", name: listaColunas[0] } }, listaColunas[0]);
      }
  }

  const handleKeyDown = (e) => {
    if (!foco) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndiceSelecionado((prev) => {
          if (dadosFiltrados.length === 0) return -1;
          let next = prev;
          for (let i = 0; i < dadosFiltrados.length; i++) {
              next = (next + 1) % dadosFiltrados.length;
              if (!getDisabled || !getDisabled(dadosFiltrados[next])) return next;
          }
          return prev;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndiceSelecionado((prev) => {
          if (dadosFiltrados.length === 0) return -1;
          let next = prev;
          for (let i = 0; i < dadosFiltrados.length; i++) {
              next = (next - 1 + dadosFiltrados.length) % dadosFiltrados.length;
              if (!getDisabled || !getDisabled(dadosFiltrados[next])) return next;
          }
          return prev;
      });
    } else if (e.key === "Enter") {
      e.preventDefault(); // Evita dar submit no form se estiver num select
      if(indiceSelecionado >= 0 && dadosFiltrados[indiceSelecionado]) {
          const selecionado = dadosFiltrados[indiceSelecionado];
          if (getDisabled && getDisabled(selecionado)) return;
          onSelecionar(selecionado);
      }
    } else if (e.key === "Escape") {
      setFoco(false);
    }
  };

  return (
    <InputBox ref={wrapperRef}>
      <Input
        type="text"
        placeholder="Selecione ou digite para pesquisar..."
        value={busca}
        onChange={handleManualChange}
        onClick={() => setFoco(true)}
        onKeyDown={handleKeyDown}
      />
      {foco && (
        <ListaSugestoes ref={listaRef}>
            {dadosFiltrados.length === 0 ? (
                <ItemSugestao style={{color: '#999'}}>Nenhum resultado...</ItemSugestao>
            ) : (
                dadosFiltrados.map((c, index) => {
                const texto = obterTexto(c);
                const disabled = getDisabled ? getDisabled(c) : false;
                const customBg = getBackgroundColor ? getBackgroundColor(c) : null;
                return (
                    <ItemSugestao
                        key={c[listaColunas[0]]}
                        $selecionado={index === indiceSelecionado}
                        $disabled={disabled}
                        $customBg={customBg}
                        $customBgHover={customBg}
                        $customColor={customBg ? "#000" : undefined}
                        onMouseEnter={() => !disabled && setIndiceSelecionado(index)}
                        onMouseDown={(e) => {
                            if (disabled) {
                                e.preventDefault();
                                return;
                            }
                            onSelecionar(c);
                        }}
                    >
                        {texto}
                    </ItemSugestao>
                )
                })
            )}
        </ListaSugestoes>
      )}
    </InputBox>
  );
}
