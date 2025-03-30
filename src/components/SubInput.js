import styled from "styled-components";

const Input = styled.input`
width: 100%;
height: 40px;
padding: 10px;
margin: 10px 0;
border: 1px solid #000;
border-radius: 5px;
font-size: 16px;
box-sizing: border-box;
color: ${(props) => props.$color || '#e2e2e2'};
background-color: #333;

&:hover{
    background-color: #222;
    transition: .5s;
}
&::placeholder{
    color: white;
}

`;

export default Input;