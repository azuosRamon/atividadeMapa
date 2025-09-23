import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CiSquareChevLeft, CiSquareChevRight } from "react-icons/ci";
import { PiMouseRightClickFill } from "react-icons/pi";
import cores from "./Cores";
import SelectBancoDeDados from "./BdSelectBusca";
import Button from "./SubButton";

// ---------------------- styleds (mantidos) ----------------------
const DivContent = styled.div`
  background-color: #222;
  padding: ${(props) => (props.$capturar ? "20px 0" : "50px 0")};
  box-shadow: ${cores.boxShadow} 5px -5px 8px;
`;

const SlideContainer = styled.div`
  overflow: hidden;
  margin: 0 auto;
  position: relative;
`;

const DivSlide = styled.div`
  width: ${(props) => 100 * props.$lista_imagens_informada.length}%;
  display: flex;
  position: relative;
  transition: 0.8s ease-in-out;
  transform: translateX(${(props) => props.translate}%);
`;

const DivItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: 0.8s ease-in-out;
  font-size: 50px;
  color: ${cores.corTexto};
  font-weight: bold;
  width: ${(props) => 100 / props.$lista_imagens_informada.length}%;
  position: relative;
`;

const UlNavegar = styled.ul`
  display: flex;
  justify-content: space-evenly;
  padding: 0;
`;

const LiNavegar = styled.li`
  z-index: 5;
  height: 20px;
  width: 20px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 50%;
  color: ${cores.corTexto};
  border: 1px solid ${cores.corTexto};
  font-size: 0.6em;
  background-color: ${(props) => (props.$active ? cores.cor3 : "")};
  cursor: pointer;
`;

const Setas = styled.button`
  padding: 3.5px 5px;
  background-color: #444;
  color: ${cores.corTexto};
  border: none;
  border-radius: 5px;
  position: absolute;
  top: calc(50% - 25px);
  cursor: pointer;
  z-index: 99;
  &:hover {
    background-color: ${cores.cor3};
    transition: 0.5s;
  }
  @media (max-width: 480px) {
    display: none;
  }
`;

const DivAndares = styled.div`
  width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 50px;
  margin-bottom: 20px;
  @media (max-width: 480px) {
    margin-left: 10%;
  }
`;

const SpamAndares = styled.span`
  display: block;
  width: 40px;
  height: 7px;
  margin-bottom: ${(props) => (props.$ultima ? "2px" : "5px")};
  background-color: ${(props) => (props.$active ? "#fff" : cores.cor3)};
`;

const SpamChao = styled.span`
  display: block;
  width: 60px;
  height: 3px;
  background-color: ${cores.cor3};
`;

const DivSobreposta = styled.div`
  position: relative;
  display: inline-block;
  width: 40%;
  @media (max-width: 480px) {
    width: 90%;
  }
  @media (min-width: 481px) and (max-width: 780px) {
    width: 70%;
  }
`;

const Imagem = styled.img`
  width: 100%;
  display: block;
`;

const SVGOverlay = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: all;
`;

const AreaPoligonal = styled.polygon`
  fill: ${(props) => (props.$procurado ? cores.cor3 : cores.cor4)};
  stroke: ${(props) => props.$procurado || cores.cor4};
  stroke-width: 10;
  cursor: pointer;
  &:hover {
    fill: ${(props) => props.$procurado || cores.cor3};
    stroke: ${(props) => props.$procurado || cores.cor1};
  }
`;

const DivBotoesCoordenadas = styled.div`
  display: flex;
  gap: 10px;
`;

// ---------------------- componente ----------------------
function Slide({
  lista_imagens,
  pagina_inicio,
  listaSalasAtivas = [],
  pavimento = 0,
  capturarCoordenadas = false,
  setPontosArea = null,
}) {
  // Estado interno caso não venha `setPontosArea` por props
  const [pontosInterno, setPontosInterno] = useState("");
  const setPontosAreaFinal = setPontosArea || setPontosInterno;

  const [pontosClicados, setPontosClicados] = useState([]);
  const [slide_atual, mudarSlide] = useState(0);
  const total_slides = lista_imagens.length;
  const indiceAtivo = total_slides - (slide_atual + 1);

  const [startX, mudarStartX] = useState(null);

  // dados do banco
  const [listaPavimentos, setListaPavimentos] = useState([]);
  const [listaSalas, setListaSalas] = useState([]);

  useEffect(() => {
    mudarSlide(pagina_inicio);
    SelectBancoDeDados({
      nomeTabela: "pavimentos",
      setData: setListaPavimentos,
      setLoading: () => {},
    });
    SelectBancoDeDados({
      nomeTabela: "salas",
      setData: setListaSalas,
      setLoading: () => {},
    });
  }, [pagina_inicio]);

  // troca de página
  const mudarPaginaSlide = (direcao) => {
    if (direcao === "proximo") {
      mudarSlide((slide) => (slide + 1) % total_slides);
    } else {
      mudarSlide((slide) => (slide - 1 + total_slides) % total_slides);
    }
  };

  // teclado
  useEffect(() => {
    const apertouTecla = (event) => {
      if (event.key === "ArrowRight") mudarPaginaSlide("proximo");
      if (event.key === "ArrowLeft") mudarPaginaSlide("anterior");
    };
    document.addEventListener("keydown", apertouTecla);
    return () => document.removeEventListener("keydown", apertouTecla);
  }, []);

  // swipe
  const handleStart = (event) => {
    if (event.type === "mousedown") {
      mudarStartX(event.clientX);
    } else if (event.type === "touchstart") {
      mudarStartX(event.touches[0].clientX);
    }
  };

  const handleEnd = (event) => {
    if (startX === null) return;
    const endXPos =
      event.type === "mouseup"
        ? event.clientX
        : event.changedTouches[0].clientX;
    if (startX > endXPos + 50) {
      mudarPaginaSlide("proximo");
    } else if (startX < endXPos - 50) {
      mudarPaginaSlide("anterior");
    }
    mudarStartX(null);
  };

  // clique para coordenadas
  const handlePointerDown = (event) => {
    if (!capturarCoordenadas) return;
    if (event.button !== 0) return;

    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const svgX = (offsetX / rect.width) * 2900;
    const svgY = (offsetY / rect.height) * 2500;

    const novoPonto = [Math.round(svgX), Math.round(svgY)];
    setPontosClicados((prev) => [...prev, novoPonto]);
  };

  // preparar polígonos
  const poligonos = listaSalas
    .map((item) => {
      const pavimentoMatch = listaPavimentos.find(
        (p) => p.pavimento_id === item.pavimento_id
      );
      if (!pavimentoMatch) return null;
      if (pavimentoMatch.numero !== slide_atual + 1) return null;
      try {
        const coords = JSON.parse(item.lista_coordenadas)
          .map(([x, y]) => `${x},${y}`)
          .join(" ");
        return {
          id: item.id,
          numero: item.numero,
          apelido: item.apelido,
          coords,
        };
      } catch (err) {
        console.error("Erro ao parsear coordenadas:", err);
        return null;
      }
    })
    .filter(Boolean);

  return (
    <DivContent $capturar={capturarCoordenadas}>
      {!capturarCoordenadas && (
        <DivAndares>
          {lista_imagens.map((_, indice) => (
            <SpamAndares
              key={indice}
              $active={indice === indiceAtivo}
              $ultima={indice === total_slides - 1}
            />
          ))}
          <SpamChao />
        </DivAndares>
      )}

      <SlideContainer
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
      >
        {!capturarCoordenadas && (
          <Setas style={{ left: "50px" }} onClick={() => mudarPaginaSlide("anterior")}>
            <CiSquareChevLeft size={40} />
          </Setas>
        )}

        <DivSlide
          translate={-(slide_atual * (100 / total_slides))}
          $lista_imagens_informada={lista_imagens}
        >
          {lista_imagens.map((imagemBase, indice) => (
            <DivItem key={indice} $lista_imagens_informada={lista_imagens}>
              <DivSobreposta>
                <Imagem src={imagemBase} alt="Planta" />

                <SVGOverlay
                  viewBox="0 0 2900 2500"
                  preserveAspectRatio="xMidYMid meet"
                  onPointerDown={handlePointerDown}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setPontosClicados((prev) => prev.slice(0, -1));
                  }}
                >
                  {/* Polígonos existentes */}
                  {poligonos.map((poly) => (
                    <AreaPoligonal
                      key={poly.id}
                      points={poly.coords}
                      onClick={() => {
                        if (!capturarCoordenadas) {
                          alert(`Clicou na sala ${poly.numero} - ${poly.apelido}`);
                        }
                      }}
                    />
                  ))}

                  {/* Polígono customizado */}
                  {pontosClicados.length > 2 && (
                    <polygon
                      points={pontosClicados.map(([x, y]) => `${x},${y}`).join(" ")}
                      fill={cores.cor3Transparente}
                      stroke={cores.cor1}
                      strokeWidth={10}
                    />
                  )}

                  {/* Pontos */}
                  {pontosClicados.map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r={20} fill={cores.cor1} />
                  ))}
                </SVGOverlay>
              </DivSobreposta>
            </DivItem>
          ))}
        </DivSlide>
        {/* ESCONDER A NAVEGACAO QUANDO FOR CRIAR POLIGONO */}
        {!capturarCoordenadas && (
          <UlNavegar>
            {lista_imagens.map((_, indice) => (
              <LiNavegar
                key={indice}
                $active={indice === slide_atual}
                onClick={() => mudarSlide(indice)}
              >
                {indice + 1}º
              </LiNavegar>
            ))}
          </UlNavegar>
        )}
      {/* ESCONDER AS SETAS QUANDO FOR CRIAR POLIGONO */}
        {!capturarCoordenadas && (
          <Setas style={{ right: "50px" }} onClick={() => mudarPaginaSlide("proximo")}>
            <CiSquareChevRight size={40} />
          </Setas>
        )}
      </SlideContainer>
        {/* BOTOES QUANDO FOR CRIAR POLIGONO */}
      {capturarCoordenadas && (
        <DivBotoesCoordenadas>
          <Button $bgcolor={cores.backgroundBotaoSemFoco2} onClick={() => setPontosClicados([])}>
            Limpar croqui
          </Button>
          <Button
            $bgcolor={cores.backgroundBotaoSemFoco2}
            onClick={() => setPontosClicados((prev) => prev.slice(0, -1))}
          >
            Deletar último ponto <PiMouseRightClickFill />
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setPontosAreaFinal(JSON.stringify(pontosClicados));
              console.log(JSON.stringify(pontosClicados));
            }}
          >
            Salvar croqui
          </Button>
        </DivBotoesCoordenadas>
      )}
    </DivContent>
  );
}

export default Slide;