import styled from "styled-components";
import cores from "./Cores";
const Select = styled.select`
margin: 10px 0;
border: 1px solid #000;
width: 100%;
height: 40px;
padding: 10px;
color: ${cores.corTexto};
border-radius: 5px;
font-size: 16px;
cursor: pointer;
display: flex;
background-color: ${cores.backgroundInput};
&:hover{
    background-color: #222;
    transition: .5s;
}
&:focus{
    background-color: ${cores.corFocus};
    color: ${cores.corWhite};
    transition: .5s;
}
`;

export default Select;