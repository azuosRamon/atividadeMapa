import React, { useState, useEffect} from "react";
import styled from "styled-components";
import { CgProfile } from "react-icons/cg";
import Button from "./SubButton";
import { useNavigate } from 'react-router-dom';


const Container = styled.div`
    `;

const Box = styled.div`
    height: auto;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.8);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    text-align: center;
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
`;

const DivContentInformacoes = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 10px;
`;

const Imagem = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
`;

const Titulo3 = styled.h3`
    color: white;
    font-size: 20px;
    padding: 0;
    margin: 0 auto;
`;

const ParagrafoInformacao = styled.p`
color: #f1f1f1;
font-size: 12px;
margin: 5px auto;
`;

const DivContent = styled.div`

    margin-top: 15px;
`;

const data = [
    { nome: "Carlos", sobrenome: "Silva", nascimento:"2025-03-25", email:"carlossilva@mail.com", funcao: "Administrador", foto: "" },
    { nome: "Ana", funcao: "Secretaria", foto: "" },
    { nome: "Maria", funcao: "Professor", foto: "" },
]; 




function Usuario({ id }) {
    const telaAtual = useNavigate();

    const [usuario, setUsuario] = useState(data[id] || {});

    useEffect(() => {
        setUsuario(data[id] || {});
    }, [id])

    return (
            <Box>
                <DivContent>
                    {usuario.foto ? (
                        <Imagem src={usuario.foto} alt={`${usuario.nome} - foto`} />
                    ) : (
                        <CgProfile size={80} color="#999" />
                    )}
                    <DivContentInformacoes>
                        <Titulo3>{usuario.nome}</Titulo3>
                    </DivContentInformacoes>
                    <DivContentInformacoes>
                        <ParagrafoInformacao>{usuario.funcao}</ParagrafoInformacao>
                    </DivContentInformacoes>
                </DivContent>
                
                <DivContent>
                    <Button onClick={()=>{telaAtual('/editarPerfil')}} $bgcolor="rgb(38, 38, 38)">Perfil</Button>
                    <Button onClick={()=>{telaAtual('/periodoHorarios')}} $bgcolor="rgb(38, 38, 38)">Períodos e Horários</Button>
                    <Button onClick={()=>{telaAtual('/edificio')}} $bgcolor="rgb(38, 38, 38)">Edifício</Button>
                    <Button onClick={()=>{telaAtual('/cursos')}} $bgcolor="rgb(38, 38, 38)">Cursos</Button>
                    <Button onClick={()=>{telaAtual('/disciplinas')}} $bgcolor="rgb(38, 38, 38)">Disciplinas</Button>
                    <Button onClick={()=>{telaAtual('/professores')}} $bgcolor="rgb(38, 38, 38)">Professores</Button>
                    <Button onClick={()=>{telaAtual('/quadroAulas')}} $bgcolor="rgb(38, 38, 38)">Quadro de aulas</Button>
                    <Button onClick={()=>{telaAtual('/cadastro')}} $bgcolor="rgb(38, 38, 38)">Adicionar usuário</Button>
                </DivContent>


            </Box>
    )
}
export default Usuario;
