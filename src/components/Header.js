import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaSearchLocation, FaBars, FaTimes } from "react-icons/fa";

import Logo from './assets/Logo.png'

const cor_hover_menu = '#003d82';
const cor_background_menu = 'rgba(0,0,0,0.8)';
const cor_da_borda = 'rgba(0, 0, 0, .5)';

const HeadeMenu = styled.header`
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
    height: 100%;
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;

    @media screen and (max-width: 768px) {
        display: none;
    }
`;

const CelularMenu = styled.div`
    display: none;

    @media screen and (max-width: 768px) {
        display: block;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: ${cor_background_menu};
    }
`;

const CelularUlMenu = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const ImagemLogo = styled.img`
    height: 90%;
`;

const LiMenu = styled.li`
    align-items: center;
    text-align: center;
    border-bottom: none;

    @media screen and (max-width: 768px) {
        width: 100%;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }

   &:hover{
        transition: .7s;
        background-color: ${cor_hover_menu};
    }
`;

const StyledLink = styled(Link)`
    display: flex;
    align-items: center;
    height: 100%;
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

    @media screen and (max-width: 768px) {
        display: block;
    }
`;

function Header() {
    const [abrirMenu, setAbrirMenu] = useState(false);

    const abrindoMenu = () => {
        setAbrirMenu(!abrirMenu);
    };

    return (
        <HeadeMenu>
            <Content>
                <StyledLink to="/">
                    <ImagemLogo src={Logo} alt="Logo" />
                </StyledLink>
                
                <UlMenu>
                    <LiMenu><StyledLink to="/"><FaSearchLocation /></StyledLink></LiMenu>
                    <LiMenu><StyledLink to="/login">Login</StyledLink></LiMenu>
                </UlMenu>

                <HamburgerIcon onClick={abrindoMenu}>
                    {abrirMenu ? <FaTimes /> : <FaBars />}
                </HamburgerIcon>

                {abrirMenu && (
                    <CelularMenu>
                        <CelularUlMenu>
                            <LiMenu><StyledLink to="/" onClick={abrindoMenu}><FaSearchLocation /></StyledLink></LiMenu>
                            <LiMenu><StyledLink to="/login" onClick={abrindoMenu}>Login</StyledLink></LiMenu>
                        </CelularUlMenu>
                    </CelularMenu>
                )}
            </Content>
        </HeadeMenu>
    )
}

export default Header;