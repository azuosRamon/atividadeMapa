import React, { useState } from "react";
import styled from "styled-components";
import Title from "./SubTitleH2";
import { FaChevronRight } from "react-icons/fa";


const DivColapse = styled.div`
display: flex;
justify-content: flex-start;
align-items: center;
background-color: rgb(38, 38, 38);
border-radius: 5px;
padding: 10px;
margin-bottom: ${(props) => (props.$marginBottom? '20px' : '0px')};;
margin-top: 20px;

`;

const DivColapseContent = styled.div`
  height: ${(props) => (props.$mostrar ? 'auto' : '0')};
  opacity: ${(props) => (props.$mostrar ? 1 : 0)};
  transform: ${(props) => (props.$mostrar ? 'scale(1)' : 'scale(0.98)')};
  pointer-events: ${(props) => (props.$mostrar ? 'auto' : 'none')};
  overflow: hidden;
  transition: 
    opacity 0.2s ease, 
    height 0.2s ease, 
    transform 0.5s ease;
`;
const Span = styled.span`
color: white;
display: inline-block;
transition: transform 0.3s ease;
transform: rotate(${props => (props.$ativo ? '90deg' : '0deg')});
margin: auto 15px;
font-size: 24px;
`;


function Colapse({ nome, children, estadoInicial = false}) {
    const [status, setStatus] = useState(estadoInicial);

    return(
            <div>
                <DivColapse $marginBottom={status} onClick={()=>{setStatus(status => !status)}}>
                    <Span $ativo={status}><FaChevronRight /></Span>
                    <Title>{nome}</Title>
                </DivColapse>

                <DivColapseContent $mostrar={status}>
                    {children}
                </DivColapseContent>
            </div>
    )
}

export default Colapse;