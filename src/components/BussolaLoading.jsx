import React from "react";
import { BiCompass } from "react-icons/bi";
import "../App.css";
import styled from "styled-components";

const Container = styled.div`
    position:absolute;
    width:100%;
    height: 100%;
    background-color: black;
    top: 0;
    left: 0;
    display: flex;
`;
const Content = styled.div`
    display: block;
    background-color: gray;
    width: 200px;
    height: 200px;
    padding: 20px 100px;
    margin: auto;
`;

const Bussola = styled.span`
    font-size:20pt;

`
const P = styled.p`
  font-size: 2rem; 
  margin: 10px; 
`;

export default function BussolaCarregando() {
    return(
        <Container>
            <Content>
                <BiCompass className="App-logo" />
                <P>Carregando...</P>
            </Content>
        </Container>
    )
  
}
