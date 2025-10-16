import React, { useState, useEffect} from "react";
import styled from "styled-components";
import { CgProfile } from "react-icons/cg";
import Button from "../SubButton";
import { useNavigate } from 'react-router-dom';
import Box from "../SubBox";
import cores from "../Cores"
import Colapse from "../SubColapse";

const BoxEditada = styled(Box)`
    min-width: 100px;
    padding: 20px;
    max-width: 200px;
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
                    {usuario.imagem ? (
                        <Imagem src={usuario.imagem} alt={`${usuario.nome} - imagem`} />
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
                    { (usuario.funcao?.toLowerCase() === "moderador(a)") && (
                        <React.Fragment>
                            <Button onClick={()=>{navegar('/dashboard')}} $bgcolor="rgb(38, 38, 38)">Início</Button>
                            <Button onClick={()=>{navegar('/pesquisarDados')}} $bgcolor="rgb(38, 38, 38)">Pesquisa</Button>
                            <Colapse fontSize="1.2rem" nome = "Configurar" estadoInicial={false}>
                                <Button onClick={()=>{navegar('/editarPerfil')}} $bgcolor="rgb(38, 38, 38)">Perfil</Button>
                                <Button onClick={()=>{navegar('/tiposAreas')}} $bgcolor="rgb(38, 38, 38)">Tipos de Áreas</Button>
                                <Button onClick={()=>{navegar('/relacionarUsuarios')}} $bgcolor="rgb(38, 38, 38)">Relacionamento</Button>
                            </Colapse>
                            <Colapse fontSize="1.2rem" nome = "Menu" estadoInicial={false}>
                                <Button onClick={()=>{navegar('/edificio')}} $bgcolor="rgb(38, 38, 38)">Edifício</Button>
                                <Button onClick={()=>{navegar('/periodoHorarios')}} $bgcolor="rgb(38, 38, 38)">Períodos e Horários</Button>
                                <Button onClick={()=>{navegar('/categorias')}} $bgcolor="rgb(38, 38, 38)">Cursos</Button>
                                <Button onClick={()=>{navegar('/produtos')}} $bgcolor="rgb(38, 38, 38)">Disciplinas</Button>
                                <Button onClick={()=>{navegar('/quadroAulas')}} $bgcolor="rgb(38, 38, 38)">Quadro de aulas</Button>
                            </Colapse>
                            <Colapse fontSize="1.2rem" nome = "Adicionar" estadoInicial={false}>
                                <Button onClick={()=>{navegar('/cadastroUsuario')}} $bgcolor="rgb(38, 38, 38)">Usuários</Button>
                                <Button onClick={()=>{navegar('/cadastroEmpresas')}} $bgcolor="rgb(38, 38, 38)">Empresas</Button>
                                <Button onClick={()=>{navegar('/cadastroContrato')}} $bgcolor="rgb(38, 38, 38)">Contratos</Button>
                                <Button onClick={()=>{navegar('/modelos')}} $bgcolor="rgb(38, 38, 38)">Modelos</Button>
                                <Button onClick={()=>{navegar('/funcoes')}} $bgcolor="rgb(38, 38, 38)">Funcoes</Button>
                                <Button onClick={()=>{navegar('/cargos')}} $bgcolor="rgb(38, 38, 38)">Cargos</Button>
                            </Colapse>
                        </React.Fragment>
                    )}
                    { (usuario.tipo.toLowerCase() === "sakdnaskdja") && (
                        <React.Fragment>
                            <Button onClick={()=>{navegar('/dashboard')}} $bgcolor="rgb(38, 38, 38)">Início</Button>
                            <Button onClick={()=>{navegar('/editarPerfil')}} $bgcolor="rgb(38, 38, 38)">Perfil</Button>
                            <Button onClick={()=>{navegar('/cadastroEmpresas')}} $bgcolor="rgb(38, 38, 38)">Empresa</Button>
                            <Button onClick={()=>{navegar('/funcoes')}} $bgcolor="rgb(38, 38, 38)">Funcoes</Button>
                        </React.Fragment>
                    )}
                    { (usuario.tipo.toLowerCase() === "empresa") && (
                        <React.Fragment>
                            <Button onClick={()=>{navegar('/dashboard')}} $bgcolor="rgb(38, 38, 38)">Início</Button>
                            <Button onClick={()=>{navegar('/editarPerfil')}} $bgcolor="rgb(38, 38, 38)">Perfil</Button>
                            <Button onClick={()=>{navegar('/pesquisarDados')}} $bgcolor="rgb(38, 38, 38)">Tabelas</Button>
                            <Button onClick={()=>{navegar('/edificio')}} $bgcolor="rgb(38, 38, 38)">Edifício</Button>
                            <Button onClick={()=>{navegar('/periodoHorarios')}} $bgcolor="rgb(38, 38, 38)">Períodos e Horários</Button>
                            <Button onClick={()=>{navegar('/categorias')}} $bgcolor="rgb(38, 38, 38)">Cursos</Button>
                            <Button onClick={()=>{navegar('/produtos')}} $bgcolor="rgb(38, 38, 38)">Disciplinas</Button>
                            <Button onClick={()=>{navegar('/quadroAulas')}} $bgcolor="rgb(38, 38, 38)">Quadro de aulas</Button>
                            <Button onClick={()=>{navegar('/cadastroUsuario')}} $bgcolor="rgb(38, 38, 38)">Adicionar usuário</Button>
                            <Button onClick={()=>{navegar('/relacionarUsuarios')}} $bgcolor="rgb(38, 38, 38)">Relacionar Usuários</Button>
                        </React.Fragment>
                    )}
                    { (usuario.funcao?.toLowerCase() === "funcionario(a)") && (
                        <React.Fragment>
                            <Button onClick={()=>{navegar('/dashboard')}} $bgcolor="rgb(38, 38, 38)">Início</Button>
                            <Button onClick={()=>{navegar('/editarPerfil')}} $bgcolor="rgb(38, 38, 38)">Perfil</Button>
                            <Button onClick={()=>{navegar('/pesquisarDados')}} $bgcolor="rgb(38, 38, 38)">Tabelas</Button>
                        </React.Fragment>
                    )}
                </DivContent>


            </BoxEditada>
    )
}
export default Usuario;
