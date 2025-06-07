import React, { useState } from "react";
import styled from "styled-components";
import { CgProfile } from "react-icons/cg";
import { GiPositionMarker } from "react-icons/gi";
import Button from "./SubButton";
import ParagrafoInformacao from "./SubParagrafo";
import terreo from "./Plantas/TERREO_PAVIMENTO.png";
import primeiro_pavimento from "./Plantas/PRIMEIRO_PAVIMENTO.png";
import segundo_pavimento from "./Plantas/SEGUNDO_PAVIMENTO.png";
import terceiro_pavimento from "./Plantas/TERCEIRO_PAVIMENTO.png";
import sala03 from "./Plantas/03.png";
import sala12 from "./Plantas/12.png";
import Slide from "./Slide";
import cores from "./Cores"
import GridArea from "./SubGridArea"

const Container = styled.div``;

const Box = styled.div`
    min-height: 300px;
    padding: 20px;
    background-color: ${cores.backgroundBox};
    box-shadow: 0 4px 8px ${cores.boxShadow};
    border-radius: 2px;
    text-align: center;
    display: grid;
    grid-template-columns: 1fr 1fr;
    cursor: pointer;
    grid-template-areas:
        "foto foto" 
        "nome nome"
        "disciplina disciplina"
        "horario horario"
        "local local"
        "sala sala"
    ;
    &:hover{
        background-color: ${cores.backgroundBotaoSemFoco2};
    }
`;

const DivContentInformacoes = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 10px;
`;

const ImagemProfessor = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
`;

const Titulo4 = styled.h4`
    color: ${cores.corTexto};
    font-size: 15px;
    padding: 0;
    margin: 10px 5px;
`;
const Titulo3 = styled.h3`
    color: ${cores.corTexto};
    font-size: 20px;
    padding: 0;
    margin: 0 5px;
`;

const MapaBG = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${cores.backgroundMapa};
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const FecharBotao = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    background: ${cores.backgroundBox};
    color: ${cores.corTexto};
    border: none;
    padding: 10px;
    cursor: pointer;
    font-size: 20px;
    border-radius: 50%;
`;

const GridAreaFlex = styled(GridArea)`
display: flex;
justify-content: center;

`

const imagensPorSalaEAndar = {
    "2-12": [terreo, sala12, segundo_pavimento, terceiro_pavimento],
    "3-03": [terreo, primeiro_pavimento, sala03, terceiro_pavimento],
};


function CriarCard({ dados, nome, disciplina, dia, horarioInicial, horarioFinal, campus, bloco, pavimento, sala, fotoProfessor }) {
    const data = dados || {};
    const [mostrarMapa, setMostrarMapa] = useState(false)

    const chaveSalaAndar = `${Number(pavimento)}-${Number(sala)}`;
    const imagens = imagensPorSalaEAndar[chaveSalaAndar] || [terreo, primeiro_pavimento, segundo_pavimento, terceiro_pavimento]

    const abrirImagem = () => {
        setMostrarMapa(true)
    }

    const fecharImagem = () => {
        setMostrarMapa(false)
    }
    

    return (
        <Container>
            <Box onClick={abrirImagem}>
                <GridAreaFlex $area='foto'>
                    {fotoProfessor ? (
                        <ImagemProfessor src={fotoProfessor} alt={`${nome} - foto`} />
                    ) : (
                        <CgProfile size={80} color="#999" />
                    )}
                </GridAreaFlex>
                    <GridArea $area='nome'>
                        <Titulo3>{nome}</Titulo3>
                    </GridArea>
                    <GridAreaFlex $area='disciplina'>
                        <ParagrafoInformacao>{disciplina}</ParagrafoInformacao>
                    </GridAreaFlex>
                    <GridAreaFlex $area='horario'>
                        <ParagrafoInformacao>{dia}</ParagrafoInformacao>
                        <ParagrafoInformacao>|</ParagrafoInformacao>
                        <ParagrafoInformacao>{horarioInicial}</ParagrafoInformacao>
                        <ParagrafoInformacao> - </ParagrafoInformacao>
                        <ParagrafoInformacao>{horarioFinal}</ParagrafoInformacao>
                    </GridAreaFlex>
                    <GridAreaFlex $area='local'>
                        <ParagrafoInformacao>{campus}</ParagrafoInformacao>
                        <ParagrafoInformacao>|</ParagrafoInformacao>
                        <ParagrafoInformacao>Bloco: {bloco}</ParagrafoInformacao>
                        <ParagrafoInformacao>|</ParagrafoInformacao>
                        <ParagrafoInformacao>Pavimento: {pavimento}</ParagrafoInformacao>
                        <ParagrafoInformacao>|</ParagrafoInformacao>
                    </GridAreaFlex>
                    <GridAreaFlex $area='sala'>
                        <Titulo4>Sala: {sala}</Titulo4>

                    </GridAreaFlex>
            </Box>

            {mostrarMapa && (
                <MapaBG>
                    <FecharBotao onClick={fecharImagem}>X</FecharBotao>
                    <Slide
                        lista_imagens={imagens}
                        pagina_inicio={Number(pavimento)-1}
                        dados={data}
                    />
                </MapaBG>
            )}
        </Container>
    )
}
export default CriarCard;
