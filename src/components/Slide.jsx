import React, { useState, useEffect, useRef} from "react";
import styled from "styled-components";
import { CiSquareChevLeft } from "react-icons/ci";
import { CiSquareChevRight } from "react-icons/ci";
import cores from "./Cores"
import SelectBancoDeDados from "./BdSelectBusca";

import Button from "./SubButton";
import sala001 from "./salasAtivadas/001.png";
import sala002 from "./salasAtivadas/002.png";
import sala003 from "./salasAtivadas/003.png";
import sala004 from "./salasAtivadas/004.png";
import sala005 from "./salasAtivadas/005.png";
import sala006 from "./salasAtivadas/006.png";
import sala007 from "./salasAtivadas/007.png";
import sala008 from "./salasAtivadas/008.png";
import sala110 from "./salasAtivadas/110.png";
import sala111 from "./salasAtivadas/111.png";
import sala112 from "./salasAtivadas/112.png";
import sala114 from "./salasAtivadas/114.png";
import sala115 from "./salasAtivadas/115.png";
import sala116 from "./salasAtivadas/116.png";
import sala117 from "./salasAtivadas/117.png";
import sala201 from "./salasAtivadas/201.png";
import sala202 from "./salasAtivadas/202.png";
import sala203 from "./salasAtivadas/203.png";
import sala204 from "./salasAtivadas/204.png";
import sala222 from "./salasAtivadas/222.png";
import sala223 from "./salasAtivadas/223.png";
import sala224 from "./salasAtivadas/224.png";
import sala225 from "./salasAtivadas/225.png";
import sala226 from "./salasAtivadas/226.png";
import sala227 from "./salasAtivadas/227.png";
import sala228 from "./salasAtivadas/228.png";
import sala301 from "./salasAtivadas/301.png";
import sala302 from "./salasAtivadas/302.png";
import sala303 from "./salasAtivadas/303.png";
import sala304 from "./salasAtivadas/304.png";
import sala334 from "./salasAtivadas/334.png";
import sala335 from "./salasAtivadas/335.png";
import sala336 from "./salasAtivadas/336.png";
import sala337 from "./salasAtivadas/337.png";
import sala338 from "./salasAtivadas/338.png";
import sala339 from "./salasAtivadas/339.png";


const imagensSalas = {
    "001": sala001,
    "002": sala002,
    "003": sala003,
    "004": sala004,
    "005": sala005,
    "006": sala006,
    "007": sala007,
    "008": sala008,
    "110": sala110,
    "111": sala111,
    "112": sala112,
    "114": sala114,
    "115": sala115,
    "116": sala116,
    "117": sala117,
    "201": sala201,
    "202": sala202,
    "203": sala203,
    "204": sala204,
    "222": sala222,
    "223": sala223,
    "224": sala224,
    "225": sala225,
    "226": sala226,
    "227": sala227,
    "228": sala228,
    "301": sala301,
    "302": sala302,
    "303": sala303,
    "304": sala304,
    "334": sala334,
    "335": sala335,
    "336": sala336,
    "337": sala337,
    "338": sala338,
    "339": sala339,
  };

const DivContent = styled.div`
background-color: #222;
padding: 50px 0;
box-shadow: ${cores.boxShadow} 5px -5px 8px;
`;
const SlideContainer = styled.div`
    overflow: hidden;
    margin: 0 auto; 
    position: relative;
`;
const SliderMover = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: none;
  z-index: 1;
  cursor: grab;
  pointer-events: none;
`;
const DivSlide = styled.div`
    width: ${(props) => (100 * props.$lista_imagens_informada.length)}%;
    display: flex;
    position: relative;
    transition: .8s ease-in-out;
    transform: translateX(${(props) => props.translate}%);
`;
const DivItem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    transition: .8s ease-in-out;
    font-size: 50px;
    color: ${cores.corTexto};
    font-weight: bold;
    width: ${(props) => (100 / props.$lista_imagens_informada.length)}%;

    position: relative;
`;

const UlNavegar = styled.ul`
    display: flex;
    justify-content: space-evenly;
    justify-items: center;
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
    border-color: ${cores.corTexto};
    border-style: solid;
    border-width: 1px;
    font-size: .6em;
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
&:hover{
background-color: ${cores.cor3};
transition: .5s;
}
@media (max-width: 480px) {
    display: none;
}
`;

const DivAndares = styled.div`
    width: 40px;
    height:  42px;
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
margin: 0;
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
  pointer-events: all;  // para deixar o clique só nas áreas ativas
`;

const AreaPoligonal = styled.polygon`
  fill: ${(props) => (props.$procurado ? cores.cor3 : cores.cor4)};
  stroke: ${(props) => props.$procurado || cores.cor4};
  stroke-width: 10;
  cursor: pointer;
  pointer-events: all;
  &:hover {
    fill: ${(props) => props.$procurado || cores.cor3};
    stroke: ${(props) => props.$procurado || cores.cor1};
  }
`;

const DivBotoesCoordenadas = styled.div`
display: flex;
gap: 10px;
`;


function Slide({ lista_imagens, pagina_inicio, listaSalasAtivas=[], pavimento = 0,dados, capturarCoordenadas = false}){
    const data = dados || {};
    /*listaSalasAtivas = ["001","002","003","004","005","006","007","008","110","111","112","114","115","116","117","201", "202","203","204","222","223","224","225","226","227","228","301","302","303", "304","334","335","336","337","338","339"]*/
    const [pontosClicados, setPontosClicados] = useState([]);
    const [slide_atual, mudarSlide] = useState(0);
    const total_slides = lista_imagens.length;
    const indiceAtivo = total_slides - (slide_atual + 1);

    let [arrastando, setArrastando] = useState(false);
    let [startX, mudarStartX] = useState(null);

    let [endX, mudarEndX] = useState(null);
    const [aberturaInicial, mudarEstadoAbertura] = useState(false);
    const normalizarCoords = (coords) =>
        coords.map(([x, y]) => `${(x / 2900) * 100},${(y / 2500) * 100}`).join(" ");
      
    useEffect(() => {
        mudarSlide(pagina_inicio);
        mudarEstadoAbertura(true);
      }, []);
    const mudarPaginaSlide = (direcao) =>{
        if (direcao === "proximo"){
            mudarSlide((slide) => ((slide) + 1) % total_slides);
        } else{
            mudarSlide((slide) => ((slide) - 1 + total_slides) % total_slides);
        }
    };

    useEffect(()=>{
        const apertouTecla = (event) =>  {
            if (event.key === "ArrowRight") mudarPaginaSlide("proximo");
            if (event.key === "ArrowLeft") mudarPaginaSlide("anterior");
        };
        
        document.addEventListener("keydown", apertouTecla);
        return () => document.removeEventListener("keydown", apertouTecla); 
    });
    
    const handleStart = (event) => {
        if (event.type === 'mousedown') {
          mudarStartX(event.clientX);
        } else if (event.type === 'touchstart') {
          mudarStartX(event.touches[0].clientX);
        }
      };
      
      const handleEnd = (event) => {
        if (startX === null) return;
      
        const endXPos = event.type === "mouseup"
          ? event.clientX
          : event.changedTouches[0].clientX;
      
        if (startX > endXPos + 50) {
          mudarPaginaSlide("proximo");
        } else if (startX < endXPos - 50) {
          mudarPaginaSlide("anterior");
        }
      
        mudarStartX(null);
      };

    const handlePointerDown = (event) => {
      if (capturarCoordenadas) {
        if (event.button !== 0) return;

        const svg = event.currentTarget;
        const rect = svg.getBoundingClientRect();

        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        const width = rect.width;
        const height = rect.height;

        const svgX = (offsetX / width) * 2900;
        const svgY = (offsetY / height) * 2500;

        const novoPonto = [Math.round(svgX), Math.round(svgY)];
        setPontosClicados((prev) => [...prev, novoPonto]);
      }
    };


    const [listaPavimentos, setListaPavimentos] = useState([])
    const [loadingPavimentos, setLoadingPavimentos] = useState(true)
    useEffect(() => {
        SelectBancoDeDados({nomeTabela: 'pavimentos', setData: setListaPavimentos, setLoading: setLoadingPavimentos })
    }, [])

    return(
        <DivContent>
                <DivAndares>
                    {
                        lista_imagens.map((item, indice) => (
                            <SpamAndares
                                key={indice}
                                $active = {indice === indiceAtivo  ? true : false}
                                $ultima = {indice === total_slides -1}
                            ></SpamAndares>
                        ))
                    }
                    <SpamChao></SpamChao>
                </DivAndares>
                <SlideContainer
                    onMouseDown={handleStart}
                    onMouseUp={handleEnd}
                    onTouchStart={handleStart}
                    onTouchEnd={handleEnd}
                    >
                <Setas style={{left: "50px"}} onClick={()=> mudarPaginaSlide("anterior")}><CiSquareChevLeft size={40}/></Setas>
                <DivSlide 
                translate={-(slide_atual * (100 / total_slides))}
                $lista_imagens_informada={lista_imagens}
                >
                {lista_imagens.map((imagemBase, indice) => (

                    <DivItem key={indice} $lista_imagens_informada={lista_imagens}>
                    <DivSobreposta
>
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
                          {data.salas.map((item) => (
                            <AreaPoligonal
                              key={item.id}
                              points={data.pavimentos.filter(pavimento => pavimento.id === item.pavimentoId)[0].numero === (slide_atual + 1) && JSON.parse(item.area).map(([x, y]) => `${x},${y}`).join(" ")}
                              onClick={(e) => {
                                if (!capturarCoordenadas){
                                  alert(`Clicou na sala ${item.numero} - ${item.apelido}`);
                                }
                              }}
                            />
                          ))}

                          {/* Polígono customizado pelos pontos clicados */}
                          {pontosClicados.length > 2 && (
                            <polygon
                              points={pontosClicados.map(([x, y]) => `${x},${y}`).join(" ")}
                              fill= {cores.cor3}
                              stroke={cores.cor1}
                              strokeWidth={10}
                            />
                          )}

                          {/* Pontos interativos */}
                          {pontosClicados.map(([x, y], i) => (
                            <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r={20}
                          fill={cores.cor1}
                        />

                          ))}
                      </SVGOverlay>



                    </DivSobreposta>

                    </DivItem>
                ))}
                </DivSlide>
                <UlNavegar>
                    {
                      lista_imagens.map((item, indice) => (
                        <LiNavegar
                        key={indice}
                        $active = {indice === slide_atual ? true : false}
                        onClick={() => mudarSlide(indice)}>{indice+1}º</LiNavegar>
                      ))
                    }
                </UlNavegar>
                <Setas style={{right: "50px"}} onClick={() => mudarPaginaSlide("proximo")}><CiSquareChevRight size={40}/></Setas>
            </SlideContainer>
            {capturarCoordenadas && (
              <DivBotoesCoordenadas>
                <Button $bgcolor={cores.backgroundBotaoSemFoco2} onClick={() => setPontosClicados([])}>Limpar croqui</Button>
                <Button $bgcolor={cores.backgroundBotaoSemFoco2} onClick={() => setPontosClicados((prev) => prev.slice(0, -1))}>Deletar ultimo ponto</Button>
                <Button onClick={() => (console.log(pontosClicados.map((item) => "[" + item + "]").toString()))}>Salvar croqui</Button>

              </DivBotoesCoordenadas>

            )}
        </DivContent>
    )
}

export default Slide;