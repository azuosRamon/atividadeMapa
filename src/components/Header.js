import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaSearchLocation, FaBars, FaTimes } from "react-icons/fa";
import { BsPersonFillGear } from "react-icons/bs";
import Usuario_logado from './Usuario_logado';
import Logo from './assets/Logo_2.png'
import DivSeparador from './SubDivSeparador';
import cores from "./Cores"


const HeaderMenu = styled.header`
    background-color: ${cores.backgroundMenus};
    /*border-bottom: 2px solid ${cores.corBorda};*/
`;

const Content = styled.div`
    max-width: 960px;
    margin: 0 auto;
    height: 60px;
    display: flex;
    color: ${cores.corTexto};
    text-align: center;
    justify-content: space-between;
    align-items: center;
    position: relative;

`;

const UlMenu = styled.ul`
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;

    @media screen and (max-width: 768px) {
        display: none;
    }
`;

const CelularMenu = styled.div`
        position: fixed;
        top: 0;
        left: ${({ $abrir }) => ($abrir ? "0" : "-100%")};
        width: 100%;
        height: 100vh;
        background-color: ${cores.backgroundMenus};
        transition: left 0.3s ease-in-out;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index:998;
        overflow: auto;
    }
`;

const ImagemLogo = styled.img`
    height: 90%;
    @media screen and (max-width: 468px) {
        width: 60%;
    };
    @media screen and (min-width: 469px) and (max-width: 768px) {
        width: 30%;
    };
    @media screen and (min-width: 769px) {
        width: 40%;
    };
`;

const LiMenu = styled.li`
    align-items: center;
    text-align: center;
    list-style: none;
    padding: 15px;
    width: 100%;
   &:hover{
        transition: .7s;
        background-color: ${cores.cor1};
    }
`;

const StyledLink = styled(Link)`
    display: flex;
    align-items: center;
    padding: 0 20px;
    color: ${cores.corTexto};
    text-decoration: none;
    cursor: pointer;

    @media screen and (max-width: 768px) {
        justify-content: center;
        padding: 15px 0;
        width: 100%;
    }
`;

const HamburgerIcon = styled.div`
    display: none;
    color: ${cores.corTexto};
    font-size: 2rem;
    cursor: pointer;
    margin-right: 30px;
    z-index: 999;
    @media screen and (max-width: 768px) {
        display: block;
    }
    
`;

const PessoaIcon = styled(BsPersonFillGear)`
font-size: 30px;
color
`;



function Header() {
    const [status, setStatus] = useState(false)
     const capturarUsuarioLogadoLocalStorage = () => {

            let usuario = localStorage.getItem("usuario");
            if (usuario) {
                return true;
            } return false;
    }

    useEffect(() => {
        setStatus(capturarUsuarioLogadoLocalStorage())
    }, [])

    const LogInOut = status ? "Logout" : <PessoaIcon />;
    const [abrirMenu, setAbrirMenu] = useState(false);

    const fazerLogout = () => {
        if (status) {
            localStorage.removeItem('usuario')
            setStatus(false);
        }
    }

    const abrindoMenu = () => {
        setAbrirMenu(!abrirMenu);
    };

    return (
        <HeaderMenu>
            <Content>
                <StyledLink to="/">
                    <ImagemLogo src={Logo} alt="Logo" />
                </StyledLink>
                
                <UlMenu>
                    {status && (
                        <LiMenu><StyledLink to="/logado">Menu</StyledLink></LiMenu>
                    )}
                    <LiMenu><StyledLink to="/login" onClick={status ? fazerLogout : undefined}>{LogInOut}</StyledLink></LiMenu>
                </UlMenu>

                <HamburgerIcon onClick={abrindoMenu} aria-label="Menu de navegação">
                    {abrirMenu ? <FaTimes /> : <FaBars />}
                </HamburgerIcon>

            </Content>
                    <CelularMenu $abrir={abrirMenu}>
                        <DivSeparador></DivSeparador>
                            <LiMenu><StyledLink to="/" onClick={()=> setAbrirMenu(false)}><FaSearchLocation /></StyledLink></LiMenu>
                             {status && <Usuario_logado mobile={true} fecharMenu={() => setAbrirMenu(false)}/>}
                            <LiMenu><StyledLink to="/login" onClick={()=> setAbrirMenu(false)}>{LogInOut}</StyledLink></LiMenu>
                    </CelularMenu>
        </HeaderMenu>
    )
}

export default Header;