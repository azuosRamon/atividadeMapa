import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaSearchLocation, FaBars, FaTimes } from "react-icons/fa";
import Usuario_logado from './Usuario_logado';
import Logo from './assets/Logo.png'
import DivSeparador from './SubDivSeparador';

const cor_hover_menu = '#003d82';
const cor_background_menu = 'rgba(0,0,0,0.8)';
const cor_da_borda = 'rgba(0, 0, 0, .5)';

const HeaderMenu = styled.header`
    background-color: ${cor_background_menu};
    border-bottom: 3px solid ${cor_da_borda};
`;

const Content = styled.div`
    max-width: 960px;
    margin: 0 auto;
    height: 60px;
    display: flex;
    color: white;
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
        background-color: ${cor_background_menu};
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
    padding: 10px;
    width: 100%;
   &:hover{
        transition: .7s;
        background-color: ${cor_hover_menu};
    }
`;

const StyledLink = styled(Link)`
    display: flex;
    align-items: center;
    padding: 0 20px;
    color: white;
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
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    margin-right: 10px;
    z-index: 999;
    @media screen and (max-width: 768px) {
        display: block;
    }
    
`;




function Header({dados, userId, status}) {
    const LogInOut = status ? "Logout" : "Login";
    const [abrirMenu, setAbrirMenu] = useState(false);

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
                    <LiMenu><StyledLink to="/"><FaSearchLocation /></StyledLink></LiMenu>
                    <LiMenu><StyledLink to="/login">{LogInOut}</StyledLink></LiMenu>
                </UlMenu>

                <HamburgerIcon onClick={abrindoMenu} aria-label="Menu de navegação">
                    {abrirMenu ? <FaTimes /> : <FaBars />}
                </HamburgerIcon>

            </Content>
                    <CelularMenu $abrir={abrirMenu}>
                        <DivSeparador></DivSeparador>
                            <LiMenu><StyledLink to="/" onClick={()=> setAbrirMenu(false)}><FaSearchLocation /></StyledLink></LiMenu>
                             {status && <Usuario_logado dados={dados} usuarioId={Number(userId)}/>}
                            <LiMenu><StyledLink to="/login" onClick={()=> setAbrirMenu(false)}>{LogInOut}</StyledLink></LiMenu>
                    </CelularMenu>
        </HeaderMenu>
    )
}

export default Header;