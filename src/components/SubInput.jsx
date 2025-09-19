import styled from "styled-components";
import cores from "./Cores";

const Input = styled.input`
width: 100%;
height: 40px;
padding: 10px;
margin: 10px 0;
border: 1px solid #000;
border-radius: 3px;
font-size: 16px;
box-sizing: border-box;
color: ${(props) => props.$color || cores.corTextoClaro};
background-color: ${cores.backgroundInput};
display: flex;
&:hover{
    background-color: #222;
    transition: .5s;
}
&::placeholder{
    color: ${cores.corTexto};
}

`;

export default Input;