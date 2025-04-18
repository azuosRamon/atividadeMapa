import React from "react";
import styled from "styled-components";
import Logo from './assets/Logo_2.png'
import cores from "./Cores"


const FooterMenu = styled.footer`
    background-color: ${cores.backgroundMenus};
    border-bottom: 3px solid ${cores.cor1};
    `;

const Content = styled.div`
    max-width: 960px;
    margin:  0 auto;
    height: 100%;
    display: flex;
    color: ${cores.corTexto};
    text-align: center;
    justify-content: space-between;
    align-items: center;
    @media screen and (max-width: 768px) {
        flex-direction: column;
        align-items: center;
    }
    `;

const ImagemLogo = styled.img`
    height: 60px;
    margin: 30px  0;
`;

const UlMenu = styled.ul`
    height: 100%;
    justify-content: space-around;
    list-style: none;
    padding: 5px;
    margin: 30px 0;
    background-color: none;
`;

const LiMenu = styled.li`
    align-items: center;
    text-align: left;
    border-bottom: none;
    margin-bottom: 3px;

    @media screen and (max-width: 768px) {
       text-align: center;
    }
`;

const LinkMenu = styled.a`
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 20px;
    color: white;
    text-decoration: none;
    cursor: pointer;
`;



function Footer(){
    return(
        <FooterMenu>
            <Content>
                <LinkMenu $url="">
                    <ImagemLogo src={Logo}/>
                </LinkMenu>
                <UlMenu>
                    <LiMenu style={{textDecoration: "underline"}}>ENGENHARIA DE SOFTWARE</LiMenu>
                    <LiMenu>Ramon Fontes de Souza / 202413690</LiMenu>
                    <LiMenu>Daniel Augusto Ribeiro de Oliveira / 202322047</LiMenu>
                    <LiMenu>Erika Sebould Gomes Pereira / 202322086</LiMenu>
                    <LiMenu>Vitória Alves Pinheiro / 202322091</LiMenu>
                    <LiMenu>Thiago marinho da Silva / 202322140</LiMenu>
                </UlMenu>
            </Content>
        </FooterMenu>
    )
}

export default Footer;