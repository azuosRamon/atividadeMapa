import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CriarCard from "./Card";
import Box from "./SubBox";
import Button from "./SubButton";
import Input from "./SubInput";
import Select from "./SubSelect";
import Container from "./SubContainer";

const Title = styled.h2`
margin: 0 0 20px;
color: white;
`;

const Formulario = styled.form`
    gap: 0 10px;
    display: grid;
    grid-template-columns: 1fr;
    @media (min-width: 481px) and (max-width: 968px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

const Modal = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    position: fixed;
    z-index: 999;
    overflow: auto;
    background-color: #222;
    border-radius: 20px;
    padding: 40px 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.8);
    max-height: 80%;
    `;
const ContainerModal = styled.div`
    display: ${(props)=>(props.$aberto ? "flex": "none")};
    ${(props)=>(props.$aberto ? "align-content: center; justify-content: center;    align-items: center;": '')}
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 997;
    top: 0;
    left: 0;
`;
const BackgroundModal = styled.div`
    background-color: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 998;
    top: 0;
    left: 0;
`;

const CardsContainer = styled.div`
    display: grid;
    grid-template-columns: ${(props)=>((props.$quantidade > 1 ) ? "repeat(1, 1fr)" : "1fr")};
    max-width: 90%;
    gap: 10px;
    align-items: center;
    align-content: center;
    justify-content: center;
`;



const data = [
    { professor: "Carlos Silva", bloco: "1", andar: "2", sala: "12", materia: "Física para Engenharia", dia: "Segunda-feira", horario: "18:50 - 22:10", foto: "" },
    { professor: "Ana Souza", bloco: "1", andar: "3", sala: "03", materia: "Front End", dia: "Terça-feira", horario: "18:50 - 22:10", foto: "" },
    { professor: "João Pereira", bloco: "1", andar: "3", sala: "03", materia: "POO", dia: "Quarta-feira", horario: "18:50 - 22:10", foto: "" },
    { professor: "Maria Oliveira", bloco: "1", andar: "2", sala: "12", materia: "Práticas Extensionistas Integradoras III", dia: "Quinta-feira", horario: "18:50 - 22:10", foto: "" },
    { professor: "Pedro Santos", bloco: "1", andar: "3", sala: "03", materia: "Estrutura de Dados", dia: "Sexta-feira", horario: "18:50 - 22:10", foto: "" },
    { professor: "Lucia Costa", bloco: "1", andar: "2", sala: "12", materia: "Engenharia Econômica", dia: "Sabado", horario: "18:50 - 22:10", foto: "" }
]; 

function Pesquisa(){
    const [resultadoPesquisa, confResultadoPesquisa] = useState([]);
    const [procurarProfessor, confProcurarProfessor] = useState("");
    const [sala, confSala] = useState("");
    const [materia, confMateria] = useState("");
    const [dia, confDia] = useState("");
    const [horario, confHorario] = useState("");
    
    const [estadoModal, mudarEstadoModal] = useState(false);

    const materiasUnicas = Array.from(new Set(data.map((dados)=>(dados.materia))));
    const horariosUnicos = Array.from(new Set(data.map((dados)=>(dados.horario))));
    const diasUnicos = Array.from(new Set(data.map((dados)=>(dados.dia))));
    const buscarResultados = (event) => {
        event.preventDefault();
        
        confResultadoPesquisa(data.filter(d =>
            (!procurarProfessor || d.professor.toLowerCase().includes(procurarProfessor.toLowerCase())) &&
            (!sala || d.sala.toLowerCase() === (sala)) &&
            (!materia || d.materia === materia) && 
            (!dia || d.dia === dia) &&
            (!horario || d.horario === horario)
        )
    )
        mudarEstadoModal(true);
    }

    useEffect(()=>{
        const apertouTecla = (event) =>  {
            if (event.key === "Escape") mudarEstadoModal(false);
        };
        
        document.addEventListener("keydown", apertouTecla);
        return () => document.removeEventListener("keydown", apertouTecla); 
    });

    return(
        <Container>
            <Box>
                <Title>Encontre:</Title>
                <Formulario onSubmit={buscarResultados}>
                    <Input 
                        type="text" 
                        placeholder="Professor" 
                        value={procurarProfessor} 
                        onChange={(e) => confProcurarProfessor(e.target.value)}
                        />
                    <Input 
                        type="text" 
                        placeholder="Sala" 
                        value={sala} 
                        onChange={(e) => confSala(e.target.value)}
                        />
                    <Select
                        value={materia}
                        onChange={(e) => confMateria(e.target.value)}
                        >
                        <option value={""}>Todas as matérias</option>
                        {
                            materiasUnicas.map((item, indice)=>(
                                <option value={item}>{item}</option>
                            ))
                        }
                    </Select>
                    <Select 
                        value={dia}
                        onChange={(e) => confDia(e.target.value)}
                        >
                        <option value={""}>Todas os dias</option>
                        {
                            diasUnicos.map((item, indice)=>(
                                <option value={item}>{item}</option>
                            ))
                        }
                    </Select>
                    <Select 
                        value={horario}
                        onChange={(e) => confHorario(e.target.value)}
                    >
                        <option value={""}>Todas os horários</option>
                        {
                            horariosUnicos.map((item, indice)=>(
                                <option value={item}>{item}</option>
                            ))
                        }
                    </Select>
                    <Button type="submit">Buscar</Button>
                </Formulario>
            </Box>
            <ContainerModal $aberto={estadoModal} >
                <BackgroundModal onClick={()=>mudarEstadoModal(false)}></BackgroundModal>
                <Modal>
                    <CardsContainer
                        $quantidade = {resultadoPesquisa.length}
                        >

                    {
                        resultadoPesquisa.map((item, indice)=>(
                            <CriarCard
                            key = {indice}
                            imagem = {item.foto}
                            nome = {item.professor}
                            disciplina = {item.materia}
                            dia = {item.dia}
                            horario = {item.horario}
                            bloco = {item.bloco}
                            andar = {item.andar}
                            sala = {item.sala}
                            />
                        ))
                    }
                    <Button onClick={()=>mudarEstadoModal(false)}>Voltar</Button>
                    </CardsContainer>
                </Modal>
                </ContainerModal>
        </Container>
    )
}
export default Pesquisa;