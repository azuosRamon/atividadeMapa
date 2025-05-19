import styled from "styled-components";
import cores from "./Cores.js"

const Button = styled.button`
margin-top: 10px;
width: 100%;
padding: 10px;
background-color:${(props) => props.$bgcolor || cores.cor3};
color: ${(props) => props.$fontColor || cores.corTextoClaro};
border: none;
border-radius: 3px;
font-size: 16px;
cursor: pointer;

&:hover{
transition: .7s;
background-color:${(props) => props.$hovercolor || cores.corHover};
color: ${cores.corTextoEscuro}
}

@media (min-width: 481px) and (max-width: 968px) {
    height: fit-content;
}
`;
export default Button;