import React, { useState, useEffect} from "react";
import styled from "styled-components";
import { CiSquareChevLeft } from "react-icons/ci";
import { CiSquareChevRight } from "react-icons/ci";



const DivContent = styled.div`
background-color: #222;
padding: 50px 0;
//box-shadow: -5px -4px 8px rgba(0,0,0,0.8);
box-shadow: rgba(0, 0, 0, 0.8) 5px -5px 8px;
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
    background-color: rgba(0, 0, 0, 0);
    z-index: 1;
    cursor: grab;
`;
const DivSlide = styled.div`
    width: ${(props) => (100 * props.$lista_imagens_informada.length)}%;
    display: flex;
    position: relative;
    transition: .5s;
    transform: translateX(${(props) => props.translate}%);
`;
const DivItem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    transition: .8s;
    font-size: 50px;
    color: #fff;
    font-weight: bold;
    width: ${(props) => (100 / props.$lista_imagens_informada.length)}%;

    position: relative;
`;
const Imagem = styled.img`
    padding: 0;
    margin: 0;
    width: 40%;
    @media (max-width: 480px) {
    width: 90%;
    }
    @media (min-width: 481px) and (max-width: 780px) {
    width: 70%;
    }
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
    color: #fff;
    border-color: #fff;
    border-style: solid;
    border-width: 1px;
    font-size: .6em;
    background-color: ${(props) => (props.$active ? "#003d82" : "")};
    cursor: pointer;
`;

const Button = styled.button`
padding: 3.5px 5px;
background-color: #444;
color: white;
border: none;
border-radius: 5px;
position: absolute;
top: calc(50% - 25px);
cursor: pointer;
z-index: 99;
&:hover{
background-color: #0056b3;
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
background-color: ${(props) => (props.$active ? "#fff" : "#777")};
`;
const SpamChao = styled.span`
display: block;
width: 60px;
height: 3px;
background-color: #999;
margin: 0;
`;



function Slide({lista_imagens, pagina_inicio}){
    const [slide_atual, mudarSlide] = useState(0);
    const total_slides = lista_imagens.length;
    let [startX, mudarStartX] = useState(null);
    let [endX, mudarEndX] = useState(null);
    const [aberturaInicial, mudarEstadoAbertura] = useState(false);
    if (!aberturaInicial){
        mudarSlide(pagina_inicio);
        mudarEstadoAbertura(true);
    }
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
    
    let handleStart = (event) =>{
        if (event.type === 'mousedown') {
            mudarStartX(event.clientX);
        } else if (event.type === "touchstart") {
            mudarStartX(event.touches[0].clientX);
        };
        console.log(`Posição inicial: (${startX})`);
    };

    const handleEnd = (event) =>{
        if (startX === null) return;

        if (event.type === "mouseup") {
            mudarEndX(event.clientX);
        } else if (event.type === "touchend") {
            mudarEndX(event.changedTouches[0].clientX);
        };
        console.log(`Posição final: (${endX})`);
        if (startX > endX) {
            mudarPaginaSlide("proximo")
        } else if((startX === endX) & (event.type === "mouseup")) {
            mudarPaginaSlide("proximo")
        }   else {
            mudarPaginaSlide("anterior")
        };
    };
    
    return(
        <DivContent>
                <DivAndares>
                    {
                        lista_imagens.map((item, indice) => (
                            <SpamAndares
                                key={indice}
                                $active = {indice === total_slides - (slide_atual + 1)  ? true : false}
                                $ultima = {indice === total_slides -1}
                            ></SpamAndares>
                        ))
                    }
                    <SpamChao></SpamChao>
                </DivAndares>
            <SlideContainer>
                <Button style={{left: "50px"}} onClick={()=> mudarPaginaSlide("anterior")}><CiSquareChevLeft size={40}/></Button>
                <SliderMover
                    onMouseDown={handleStart}
                    onMouseUp={handleEnd}
                    onTouchStart={handleStart}
                    onTouchEnd={handleEnd}
                    ></SliderMover>
                <DivSlide 
                    translate={-slide_atual * 25}
                    $lista_imagens_informada = {lista_imagens}
                    >
                    <DivItem
                        $lista_imagens_informada={lista_imagens}
                    >
                        <Imagem src={lista_imagens[0]}/>
                    </DivItem>
                    <DivItem
                        $lista_imagens_informada={lista_imagens}
                    >
                        <Imagem src={lista_imagens[1]}/>
                    </DivItem>
                    <DivItem
                        $lista_imagens_informada={lista_imagens}
                    >
                        <Imagem src={lista_imagens[2]}/>
                    </DivItem>
                    <DivItem
                        $lista_imagens_informada={lista_imagens}
                    >
                        <Imagem src={lista_imagens[3]}/>
                    </DivItem>
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
                <Button style={{right: "50px"}} onClick={() => {
                    mudarSlide((slide_atual + 1) % total_slides);
                }}><CiSquareChevRight size={40}/></Button>
            </SlideContainer>
        </DivContent>
    )
}

export default Slide;