import React, { useState, useEffect} from "react";
import styled from "styled-components";
import { CgProfile } from "react-icons/cg";
import Button from "./SubButton";
import { useNavigate } from 'react-router-dom';
import Box from "./SubBox";
import cores from "./Cores"



const BoxEditada = styled(Box)`
min-width: 100px;
    padding: 20px;
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
    color: ${cores.corTexto};
    font-size: 20px;
    padding: 0;
    margin: 0 auto;
`;

const ParagrafoInformacao = styled.p`
color: ${cores.corTexto};
font-size: 12px;
margin: 5px auto;
`;

const DivContent = styled.div`

    margin-top: 15px;
`;



function Usuario({ fecharMenu, mobile=false, logo=false }) {
     const capturarUsuarioLogadoLocalStorage = () => {
            let usuario = localStorage.getItem("usuario");
            if (!usuario) return null;
            try {
                let parsedUsuario = JSON.parse(usuario);
                return parsedUsuario
            } catch (error){
                console.log(error);
                return null;
            }
        }

    const telaAtual = useNavigate();

const [usuario, setUsuario] = useState(capturarUsuarioLogadoLocalStorage());
    const navegar = (rota) => {
        telaAtual(rota);
        if (mobile) fecharMenu();
      }
    return (
            <BoxEditada>
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
                        <ParagrafoInformacao>{usuario.cargo}</ParagrafoInformacao>
                    </DivContentInformacoes>
                </DivContent>
                
                <DivContent>
                    { (usuario.funcao.toLowerCase() === "moderadorsite") && (
                        <React.Fragment>
                            <Button onClick={()=>{navegar('/logado')}} $bgcolor="rgb(38, 38, 38)">Início</Button>
                            <Button onClick={()=>{navegar('/editarPerfil')}} $bgcolor="rgb(38, 38, 38)">Perfil</Button>
                            <Button onClick={()=>{navegar('/periodoHorarios')}} $bgcolor="rgb(38, 38, 38)">Períodos e Horários</Button>
                            <Button onClick={()=>{navegar('/edificio')}} $bgcolor="rgb(38, 38, 38)">Edifício</Button>
                            <Button onClick={()=>{navegar('/cursos')}} $bgcolor="rgb(38, 38, 38)">Cursos</Button>
                            <Button onClick={()=>{navegar('/disciplinas')}} $bgcolor="rgb(38, 38, 38)">Disciplinas</Button>
                            <Button onClick={()=>{navegar('/tabelas')}} $bgcolor="rgb(38, 38, 38)">Tabelas</Button>
                            <Button onClick={()=>{navegar('/quadroAulas')}} $bgcolor="rgb(38, 38, 38)">Quadro de aulas</Button>
                            <Button onClick={()=>{navegar('/empresa')}} $bgcolor="rgb(38, 38, 38)">Empresa</Button>
                            <Button onClick={()=>{navegar('/funcoes')}} $bgcolor="rgb(38, 38, 38)">Funcoes</Button>
                            <Button onClick={()=>{navegar('/cargos')}} $bgcolor="rgb(38, 38, 38)">Cargos</Button>
                            <Button onClick={()=>{navegar('/cadastro')}} $bgcolor="rgb(38, 38, 38)">Adicionar usuário</Button>
                        </React.Fragment>
                    )}
                    { (usuario.funcao.toLowerCase() === "moderador") && (
                        <React.Fragment>
                            <Button onClick={()=>{navegar('/logado')}} $bgcolor="rgb(38, 38, 38)">Início</Button>
                            <Button onClick={()=>{navegar('/editarPerfil')}} $bgcolor="rgb(38, 38, 38)">Perfil</Button>
                            <Button onClick={()=>{navegar('/empresa')}} $bgcolor="rgb(38, 38, 38)">Empresa</Button>
                            <Button onClick={()=>{navegar('/funcoes')}} $bgcolor="rgb(38, 38, 38)">Funcoes</Button>
                        </React.Fragment>
                    )}
                    { (usuario.funcao.toLowerCase() === "administrador") && (
                        <React.Fragment>
                            <Button onClick={()=>{navegar('/logado')}} $bgcolor="rgb(38, 38, 38)">Início</Button>
                            <Button onClick={()=>{navegar('/editarPerfil')}} $bgcolor="rgb(38, 38, 38)">Perfil</Button>
                            <Button onClick={()=>{navegar('/tabelas')}} $bgcolor="rgb(38, 38, 38)">Tabelas</Button>
                            <Button onClick={()=>{navegar('/periodoHorarios')}} $bgcolor="rgb(38, 38, 38)">Períodos e Horários</Button>
                            <Button onClick={()=>{navegar('/edificio')}} $bgcolor="rgb(38, 38, 38)">Edifício</Button>
                            <Button onClick={()=>{navegar('/cursos')}} $bgcolor="rgb(38, 38, 38)">Cursos</Button>
                            <Button onClick={()=>{navegar('/disciplinas')}} $bgcolor="rgb(38, 38, 38)">Disciplinas</Button>
                            <Button onClick={()=>{navegar('/quadroAulas')}} $bgcolor="rgb(38, 38, 38)">Quadro de aulas</Button>
                            <Button onClick={()=>{navegar('/cargos')}} $bgcolor="rgb(38, 38, 38)">Cargos</Button>
                            <Button onClick={()=>{navegar('/cadastro')}} $bgcolor="rgb(38, 38, 38)">Adicionar usuário</Button>
                        </React.Fragment>
                    )}
                    { (usuario.funcao.toLowerCase() === "professor") && (
                        <React.Fragment>
                            <Button onClick={()=>{navegar('/logado')}} $bgcolor="rgb(38, 38, 38)">Início</Button>
                            <Button onClick={()=>{navegar('/editarPerfil')}} $bgcolor="rgb(38, 38, 38)">Perfil</Button>
                            <Button onClick={()=>{navegar('/tabelas')}} $bgcolor="rgb(38, 38, 38)">Tabelas</Button>
                        </React.Fragment>
                    )}
                </DivContent>


            </BoxEditada>
    )
}
export default Usuario;
