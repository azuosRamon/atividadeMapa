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

const Container = styled.div``;

const Box = styled.div`
    height: 150px;
    padding: 20px;
    background-color: ${cores.backgroundBox};
    box-shadow: 0 4px 8px ${cores.boxShadow};
    border-radius: 10px;
    text-align: center;
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    align-items: center;
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


const imagensPorSalaEAndar = {
    "2-12": [terreo, sala12, segundo_pavimento, terceiro_pavimento],
    "3-03": [terreo, primeiro_pavimento, sala03, terceiro_pavimento],
};

function CriarCard({ nome, disciplina, dia, horarioInicial, horarioFinal, bloco, pavimento, sala, fotoProfessor }) {
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
            <Box>
                <div>
                    {fotoProfessor ? (
                        <ImagemProfessor src={fotoProfessor} alt={`${nome} - foto`} />
                    ) : (
                        <CgProfile size={80} color="#999" />
                    )}
                </div>
                <div>
                    <DivContentInformacoes>
                        <Titulo3>{nome}</Titulo3>
                    </DivContentInformacoes>
                    <DivContentInformacoes>
                        <ParagrafoInformacao>{disciplina}</ParagrafoInformacao>
                    </DivContentInformacoes>
                    <DivContentInformacoes>
                        <ParagrafoInformacao>{dia}</ParagrafoInformacao>
                        <ParagrafoInformacao>|</ParagrafoInformacao>
                        <ParagrafoInformacao>{horarioInicial}</ParagrafoInformacao>
                        <ParagrafoInformacao> - </ParagrafoInformacao>
                        <ParagrafoInformacao>{horarioFinal}</ParagrafoInformacao>
                    </DivContentInformacoes>
                    <DivContentInformacoes>
                        <ParagrafoInformacao>Bloco: {bloco}</ParagrafoInformacao>
                        <ParagrafoInformacao>|</ParagrafoInformacao>
                        <ParagrafoInformacao>Pavimento: {pavimento}</ParagrafoInformacao>
                        <ParagrafoInformacao>|</ParagrafoInformacao>
                        <ParagrafoInformacao>Sala: {sala}</ParagrafoInformacao>
                    </DivContentInformacoes>
                </div>
                <Button onClick={abrirImagem}>
                    <GiPositionMarker size={70} />
                </Button>
            </Box>

            {mostrarMapa && (
                <MapaBG>
                    <FecharBotao onClick={fecharImagem}>X</FecharBotao>
                    <Slide
                        lista_imagens={imagens}
                        pagina_inicio={Number(pavimento)-1}
                    />
                </MapaBG>
            )}
        </Container>
    )
}
export default CriarCard;
